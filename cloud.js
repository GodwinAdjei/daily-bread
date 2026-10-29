import { firebaseConfig } from './firebase-config.js';

const $ = id => document.getElementById(id);
const banner = $('syncBanner');
const status = $('accountStatus');
const dialog = $('accountDialog');
const signInBtn = $('signinBtn');
const signOutBtn = $('signoutBtn');
let auth, db, user, firestore, authSdk;
let busy = false;
let ready = false;
const QUEUE_KEY = 'daily-bread-pending-cloud-v3';
const ACCOUNT_KEY = 'daily-bread-cloud-account-v3';
let queue = readQueue();

function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '{}'); } catch { return {}; } }
function saveQueue() { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); }
function report(message, state='') {
  banner.className = 'sync-banner' + (state ? ' ' + state : '');
  banner.textContent = message;
  status.textContent = message;
}
function hasConfig() { return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('PASTE_'); }
function appReady() { return Boolean(window.dailyBread?.getReadingIds().length); }

$('accountBtn').addEventListener('click', () => dialog.showModal());
$('closeAccount').addEventListener('click', () => dialog.close());

if (!hasConfig()) {
  report('Saved on this device · Cloud setup required');
  $('accountHelp').textContent = 'Local checkmarks work now. To enable automatic cloud backup, follow the Firebase setup steps in README.md and publish your updated firebase-config.js.';
  signInBtn.hidden = true;
} else {
  try {
    const [{initializeApp}, authModule, dbModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
    authSdk = authModule;
    firestore = dbModule;
    const app = initializeApp(firebaseConfig);
    auth = authModule.getAuth(app);
    db = dbModule.getFirestore(app);
    await authModule.setPersistence(auth, authModule.browserLocalPersistence);
    signInBtn.addEventListener('click', async () => {
      report('Opening Google sign-in…', 'syncing');
      try {
        await authModule.signInWithPopup(auth, new authModule.GoogleAuthProvider());
        dialog.close();
      } catch (error) {
        report(`Sign-in failed: ${error.message}`, 'error');
        // On iPhone, if the installed app blocks the popup, sign in using the site in Safari.
      }
    });
    signOutBtn.addEventListener('click', async () => {
      await authModule.signOut(auth);
      report('Signed out · Checkmarks still saved on this device');
    });
    authModule.onAuthStateChanged(auth, async currentUser => {
      user = currentUser;
      signInBtn.hidden = Boolean(user);
      signOutBtn.hidden = !user;
      $('accountEmail').textContent = user?.email || '';
      if (!user) { ready=false; report('Saved on this device · Sign in to sync'); return; }
      try {
        await waitForReadings();
        await reconcile();
      } catch(err) { report(`Cloud unavailable · Saved locally (${err.message})`, 'error'); }
    });
    window.addEventListener('online', () => { if (user) flushQueue(); });
  } catch(err) {
    report('Saved on device · Could not load cloud service', 'error');
    status.textContent = String(err);
  }
}

function waitForReadings() {
  if (appReady()) return Promise.resolve();
  return new Promise((resolve,reject) => {
    const timeout = setTimeout(() => { window.removeEventListener('dailybread:ready', fn); reject(new Error('Reading schedule not ready')); }, 12000);
    function fn() { clearTimeout(timeout); resolve(); }
    window.addEventListener('dailybread:ready', fn, {once:true});
  });
}

async function reconcile() {
  if (!user || !appReady()) return;
  ready=false;
  const uid=user.uid;
  // Never carry another account's queued changes into this account.
  const previousAccount=localStorage.getItem(ACCOUNT_KEY);
  if(previousAccount && previousAccount!==uid){queue={};saveQueue();}
  localStorage.setItem(ACCOUNT_KEY,uid);
  report('Checking cloud backup…', 'syncing');
  const coll=firestore.collection(db,'users',uid,'readingProgress');
  const snapshot=await firestore.getDocs(coll);
  const allIds=new Set(window.dailyBread.getReadingIds());
  const remote=new Map();
  snapshot.forEach(doc => {if(allIds.has(doc.id)) remote.set(doc.id,doc.data().done===true);});
  const local=new Set(window.dailyBread.getCompleted());
  if (snapshot.empty) {
    // First sign-in on a fresh cloud account: upload any locally completed days.
    for(const id of local) queue[id]=true;
  }
  // Cloud is the source of truth on reinstalls. Only unsynced local edits override it.
  const merged=new Set([...remote].filter(([,done])=>done).map(([id])=>id));
  if (snapshot.empty) for(const id of local) merged.add(id);
  for (const [id,done] of Object.entries(queue)) {
    if(!allIds.has(id)) continue;
    if(done) merged.add(id); else merged.delete(id);
  }
  window.dailyBread.setCompleted([...merged]);
  saveQueue();
  ready=true;
  await flushQueue();
}

window.addEventListener('dailybread:change', event => {
  const {id,done}=event.detail;
  queue[id]=done;
  saveQueue();
  if(user && ready) void flushQueue();
  else report(user ? 'Saved locally · Waiting for cloud' : 'Saved on this device · Sign in to sync');
});

window.addEventListener('dailybread:restored', () => {
  for (const id of window.dailyBread.getReadingIds()) queue[id]=window.dailyBread.getCompleted().includes(id);
  saveQueue();
  if (user && ready) void flushQueue();
});

async function flushQueue() {
  if (!user || !ready || busy) return;
  busy=true;
  const uid=user.uid;
  try {
    while (user?.uid===uid && Object.keys(queue).length) {
      if(!navigator.onLine) {report('Saved locally · Waiting for internet', 'syncing'); return;}
      report('Syncing your checkmarks…', 'syncing');
      const [id,done]=Object.entries(queue)[0];
      await firestore.setDoc(firestore.doc(db,'users',uid,'readingProgress',id), {
        done: Boolean(done), updatedAt:firestore.serverTimestamp()
      });
      // Do not discard a newer change made while the request was in flight.
      if(queue[id]===done) delete queue[id];
      saveQueue();
    }
    if(user?.uid===uid) report('All progress synced to cloud', 'synced');
  } catch(err) {
    report('Saved locally · Cloud sync will retry when online', 'error');
    console.warn('Daily Bread sync:',err);
  } finally { busy=false; }
}
