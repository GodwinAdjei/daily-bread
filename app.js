// IMPORTANT: Only the first TWO entries came from your message.
// Days 3-5 are temporary sample entries, NOT verified B.R.E.A.D. 2023 assignments.
// To add all 365 days later, edit this array (or move it into a separate data file).
const READINGS = [
  { id: '2023-01-01', date: 'January 1', passage: 'Genesis 1–3', book: 'GEN', start: 1, end: 3, verified: true },
  { id: '2023-01-02', date: 'January 2', passage: 'Genesis 4–7', book: 'GEN', start: 4, end: 7, verified: true },
  { id: '2023-01-03', date: 'January 3', passage: 'Genesis 8–11', book: 'GEN', start: 8, end: 11, verified: false },
  { id: '2023-01-04', date: 'January 4', passage: 'Genesis 12–15', book: 'GEN', start: 12, end: 15, verified: false },
  { id: '2023-01-05', date: 'January 5', passage: 'Genesis 16–19', book: 'GEN', start: 16, end: 19, verified: false }
];
const STORAGE_KEY = 'daily-bread-completed-v1';
let completed = loadCompleted();
function loadCompleted() { try { const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); return new Set(Array.isArray(raw)?raw.filter(x=>typeof x==='string'):[]); } catch { return new Set(); } }
function saveCompleted(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...completed]));return true}catch{return false}}
function youVersionUrl(reading){return `https://www.bible.com/bible/111/${reading.book}.${reading.start}.NIV`;}
function render(){
 const done=READINGS.filter(x=>completed.has(x.id)).length;
 document.getElementById('progressText').textContent=`${done} of ${READINGS.length} completed`;
 document.getElementById('progressPercent').textContent=`${Math.round(done/READINGS.length*100)}%`;
 document.getElementById('progressFill').style.width=`${done/READINGS.length*100}%`;
 document.getElementById('progressBar').setAttribute('aria-valuemax',String(READINGS.length));
 document.getElementById('progressBar').setAttribute('aria-valuenow',String(done));
 document.getElementById('monthCount').textContent=`${READINGS.length} readings`;
 const next=READINGS.find(x=>!completed.has(x.id));
 const card=document.getElementById('nextCard');card.replaceChildren();
 const label=document.createElement('div');label.className='next-label';label.textContent=next?'UP NEXT':'ALL CAUGHT UP';card.append(label);
 const title=document.createElement('div');title.className='next-title';title.textContent=next?next.passage:'Every reading completed!';card.append(title);
 if(next){const sub=document.createElement('div');sub.className='next-sub';sub.textContent=`${next.date}${next.verified?'':' · Sample entry'}`;card.append(sub);const a=document.createElement('a');a.className='read-button';a.href=youVersionUrl(next);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Read in YouVersion ↗';card.append(a)}
 const list=document.getElementById('readingList');list.replaceChildren();
 for(const reading of READINGS){const row=document.createElement('div');row.className=`entry${completed.has(reading.id)?' done':''}`;
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.className='check';checkbox.checked=completed.has(reading.id);checkbox.setAttribute('aria-label',`Mark ${reading.date}, ${reading.passage}, complete`);checkbox.addEventListener('change',()=>{if(checkbox.checked)completed.add(reading.id);else completed.delete(reading.id);saveCompleted();render()});
 const info=document.createElement('div');info.className='reading-info';const date=document.createElement('div');date.className='day';date.textContent=reading.date;const passage=document.createElement('div');passage.className='passage';passage.textContent=reading.passage;info.append(date,passage);
 if(!reading.verified){const sample=document.createElement('div');sample.className='sample-tag';sample.textContent='SAMPLE — replace later';info.append(sample)}
 const link=document.createElement('a');link.className='passage-link';link.href=youVersionUrl(reading);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Read ↗';link.setAttribute('aria-label',`Read ${reading.passage} in YouVersion (starts at chapter ${reading.start})`);
 row.append(checkbox,info,link);list.append(row)}
}
render();
const dialog=document.getElementById('backupDialog');document.getElementById('backupBtn').addEventListener('click',()=>dialog.showModal());document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
document.getElementById('exportBtn').addEventListener('click',()=>{const data=JSON.stringify({app:'daily-bread',version:1,exportedAt:new Date().toISOString(),completed:[...completed]},null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='daily-bread-backup.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('backupStatus').textContent='Backup file created.'});
document.getElementById('importFile').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.app!=='daily-bread'||!Array.isArray(data.completed)||!data.completed.every(x=>typeof x==='string'))throw new Error('Invalid backup format');const valid=new Set(READINGS.map(r=>r.id));completed=new Set(data.completed.filter(id=>valid.has(id)));if(!saveCompleted())throw new Error('Device storage is unavailable');render();document.getElementById('backupStatus').textContent='Backup imported successfully.'}catch(err){document.getElementById('backupStatus').textContent=`Could not import: ${err.message}`}event.target.value=''});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
