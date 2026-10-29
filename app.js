const STORAGE_KEY = 'daily-bread-completed-v1'; // Preserve existing on-device progress.
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const BOOKS = {
'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM','Deuteronomy':'DEU','Joshua':'JOS','Judges':'JDG','Ruth':'RUT','I Samuel':'1SA','II Samuel':'2SA','I Kings':'1KI','II Kings':'2KI','I Chronicles':'1CH','II Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH','Esther':'EST','Job':'JOB','Psalm':'PSA','Psalms':'PSA','Proverbs':'PRO','Ecclesiastes':'ECC','Song of Solomon':'SNG','Isaiah':'ISA','Jeremiah':'JER','Lamentations':'LAM','Ezekiel':'EZK','Daniel':'DAN','Hosea':'HOS','Joel':'JOL','Amos':'AMO','Obadiah':'OBA','Jonah':'JON','Micah':'MIC','Nahum':'NAM','Habakkuk':'HAB','Zephaniah':'ZEP','Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL','Matthew':'MAT','Mark':'MRK','Luke':'LUK','John':'JHN','Acts':'ACT','Romans':'ROM','I Corinthians':'1CO','II Corinthians':'2CO','Galatians':'GAL','Ephesians':'EPH','Philippians':'PHP','Colossians':'COL','I Thessalonians':'1TH','II Thessalonians':'2TH','I Timothy':'1TI','II Timothy':'2TI','Titus':'TIT','Philemon':'PHM','Hebrews':'HEB','James':'JAS','I Peter':'1PE','II Peter':'2PE','I John':'1JN','II John':'2JN','III John':'3JN','Jude':'JUD','Revelation':'REV'};
const names=Object.keys(BOOKS).sort((a,b)=>b.length-a.length);
let readings=[],completed=loadCompleted(), currentMonth=1;
function loadCompleted(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return new Set(Array.isArray(value)?value.filter(x=>typeof x==='string'):[])}catch{return new Set()}}
function saveCompleted(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...completed]));return true}catch{alert('Could not save progress on this device. Please export a backup.');return false}}
window.dailyBread={getCompleted:()=>[...completed], setCompleted:(ids)=>{completed=new Set(ids);saveCompleted();render()}, getReadingIds:()=>readings.map(r=>r.id)};
function partsFor(passage){let lastBook='';return passage.split(';').map(s=>s.trim()).filter(Boolean).map(part=>{const name=names.find(n=>part===n||part.startsWith(n+' '));if(name)lastBook=name;const rest=name?part.slice(name.length).trim():part;const match=rest.match(/^(\d+)/);return {label:part,book:BOOKS[lastBook],chapter:match?Number(match[1]):1}})}
function bibleUrl(part){return `https://www.bible.com/bible/111/${part.book}.${part.chapter}.NIV`}
function render(){
 const done=readings.filter(x=>completed.has(x.id)).length, next=readings.find(x=>!completed.has(x.id));
 document.getElementById('progressText').textContent=`${done} of 365 completed`;
 document.getElementById('progressPercent').textContent=`${Math.round(done/365*100)}%`;
 document.getElementById('progressFill').style.width=`${done/365*100}%`;
 document.getElementById('progressBar').setAttribute('aria-valuemax','365');document.getElementById('progressBar').setAttribute('aria-valuenow',String(done));
 const card=document.getElementById('nextCard');card.replaceChildren();
 const label=document.createElement('div');label.className='next-label';label.textContent=next?'UP NEXT':'ALL FINISHED';card.append(label);
 const title=document.createElement('div');title.className='next-title';title.textContent=next?next.passage:'All 365 readings complete!';card.append(title);
 if(next){const sub=document.createElement('div');sub.className='next-sub';sub.textContent=`${MONTHS[next.month-1]} ${next.day} · 2023 schedule`;card.append(sub);
 const a=document.createElement('a');a.className='read-button';a.href=bibleUrl(partsFor(next.passage)[0]);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open NIV in YouVersion ↗';card.append(a);
 const jump=document.createElement('button');jump.className='jump-button';jump.textContent='Show in schedule';jump.onclick=()=>{currentMonth=next.month;render();document.getElementById('monthPicker').scrollIntoView({behavior:'smooth'})};card.append(jump)}
 const picker=document.getElementById('monthPicker');picker.value=String(currentMonth);
 document.getElementById('monthHeading').textContent=MONTHS[currentMonth-1];
 const monthReads=readings.filter(r=>r.month===currentMonth);
 document.getElementById('monthCount').textContent=`${monthReads.filter(x=>completed.has(x.id)).length} / ${monthReads.length} complete`;
 const list=document.getElementById('readingList');list.replaceChildren();
 for(const reading of monthReads){
 const row=document.createElement('div');row.className=`entry${completed.has(reading.id)?' done':''}`;
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.className='check';checkbox.checked=completed.has(reading.id);checkbox.setAttribute('aria-label',`Mark ${MONTHS[reading.month-1]} ${reading.day}, ${reading.passage}, complete`);
 checkbox.addEventListener('change',()=>{if(checkbox.checked)completed.add(reading.id);else completed.delete(reading.id);saveCompleted();render();window.dispatchEvent(new CustomEvent('dailybread:change',{detail:{id:reading.id,done:checkbox.checked}}))});
 const info=document.createElement('div');info.className='reading-info';
 const date=document.createElement('div');date.className='day';date.textContent=`${MONTHS[reading.month-1]} ${reading.day}`;
 const passage=document.createElement('div');passage.className='passage';passage.textContent=reading.passage;info.append(date,passage);
 const links=document.createElement('div');links.className='passage-links';
 partsFor(reading.passage).forEach((p,i)=>{const a=document.createElement('a');a.href=bibleUrl(p);a.target='_blank';a.rel='noopener noreferrer';a.textContent=`Read ${i+1} ↗`;a.title=`Open ${p.label} in YouVersion NIV (at starting chapter)`;links.append(a)});
 info.append(links);row.append(checkbox,info);list.append(row)
 }
}
async function start(){
 try{const response=await fetch('./readings.json');if(!response.ok)throw Error('Schedule could not be downloaded');readings=await response.json();if(readings.length!==365)throw Error('Incomplete schedule');
 const first=readings.find(r=>!completed.has(r.id));currentMonth=first?.month||1;
 const picker=document.getElementById('monthPicker');MONTHS.forEach((m,i)=>{const o=document.createElement('option');o.value=String(i+1);o.textContent=m;picker.append(o)});picker.addEventListener('change',e=>{currentMonth=Number(e.target.value);render()});
 render();
 }catch(err){document.getElementById('nextCard').textContent=`Could not load reading schedule: ${err.message}. Check your connection and refresh.`}
}
const dialog=document.getElementById('backupDialog');document.getElementById('backupBtn').onclick=()=>dialog.showModal();document.getElementById('closeDialog').onclick=()=>dialog.close();
document.getElementById('exportBtn').onclick=()=>{const data=JSON.stringify({app:'daily-bread',version:2,exportedAt:new Date().toISOString(),completed:[...completed]},null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='daily-bread-backup.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('backupStatus').textContent='Backup downloaded. Save it somewhere safe.'};
document.getElementById('importFile').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.app!=='daily-bread'||!Array.isArray(data.completed)||!data.completed.every(x=>typeof x==='string'))throw Error('Invalid backup');if(!confirm('Replace your current checkmarks with the backup file?'))return;const valid=new Set(readings.map(r=>r.id));completed=new Set(data.completed.filter(x=>valid.has(x)));if(!saveCompleted())throw Error('Could not save');render();window.dispatchEvent(new Event('dailybread:restored'));document.getElementById('backupStatus').textContent='Backup restored.'}catch(e){document.getElementById('backupStatus').textContent=`Import failed: ${e.message}`}finally{event.target.value=''}});
start();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
