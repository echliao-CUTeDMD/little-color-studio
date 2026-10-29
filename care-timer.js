 'use strict';
const CARE_KEY='little-color-care-v1';
const careDay=t=>{const d=new Date(t);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
function createCareTimer(record={},now=Date.now()){
 const safe=n=>Number.isFinite(n)&&n>=0?n:0;
 const state={day:careDay(now),today:record.day===careDay(now)?Math.min(safe(record.today),86400000):0,segment:Math.min(safe(record.segment),1800000),interval:[10,20,30].includes(record.interval)?record.interval:30,restUntil:record.restUntil>0?Math.min(safe(record.restUntil),now+600000):0};
 function day(t){if(state.day!==careDay(t)){state.day=careDay(t);state.today=0}}
 return {state,
 tick(delta,now,visible){delta=safe(delta);let todayDelta=delta;if(state.day!==careDay(now)){const midnight=new Date(now);midnight.setHours(0,0,0,0);todayDelta=Math.min(delta,now-midnight.getTime())}day(now);if(state.restUntil||!visible)return;state.today+=todayDelta;state.segment+=delta;if(state.segment>=state.interval*60000)state.restUntil=now+600000},
 rest(now){day(now);if(!state.restUntil)state.restUntil=now+600000},
 resume(now){day(now);if(!state.restUntil||now<state.restUntil)return false;state.restUntil=0;state.segment=0;return true},
 interval(value,now){if(![10,20,30].includes(value))return;state.interval=value;if(!state.restUntil&&state.segment>=value*60000)state.restUntil=now+600000}
 };
}
function setupCareTimer(){
 const el=id=>document.getElementById(id);let stored={};try{stored=JSON.parse(localStorage.getItem(CARE_KEY))||{}}catch{}if(typeof stored!=='object'||Array.isArray(stored))stored={};
 const timer=createCareTimer(stored),dialog=el('care-dialog');let last=performance.now(),visible=!document.hidden,wasRest=false,saveAt=0;
 const format=ms=>{const seconds=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`};
 function save(){try{localStorage.setItem(CARE_KEY,JSON.stringify(timer.state))}catch{el('care-storage').textContent='此瀏覽器無法保存計時紀錄，重新開啟後可能重算。'}}
 function render(){const s=timer.state,rest=!!s.restUntil;el('care-total').textContent=format(s.today);el('care-session').textContent=format(s.segment);el('care-next').textContent=rest?'休息中':format(s.interval*60000-s.segment);el('care-interval').value=String(s.interval);
  if(rest){el('care-countdown').textContent=format(s.restUntil-Date.now());el('care-resume').disabled=Date.now()<s.restUntil;el('care-rest-message').textContent=Date.now()<s.restUntil?'現在離開螢幕，看看遠方、走動一下，不用盯著倒數喔。':'休息時間已到，請家長確認後再繼續，也可以直接關閉遊戲。';if(!wasRest){el('story-stop').click();document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==dialog)d.close()});dialog.showModal();save()}}
  wasRest=rest;
 }
 function tick(){const now=performance.now();timer.tick(Math.max(0,now-last),Date.now(),visible);last=now;render();if(now-saveAt>=5000){save();saveAt=now}}
 el('care-interval').onchange=()=>{const value=Number(el('care-interval').value);tick();timer.interval(value,Date.now());render();save()};
 el('care-rest').onclick=()=>{tick();timer.rest(Date.now());render();save()};
 el('care-resume').onclick=()=>{if(timer.resume(Date.now())){dialog.close();wasRest=false;last=performance.now();render();save();el('care-rest').focus()}};
 dialog.addEventListener('cancel',e=>e.preventDefault());
 document.addEventListener('visibilitychange',()=>{tick();visible=!document.hidden;last=performance.now();save()});
 window.addEventListener('pagehide',()=>{tick();visible=false;save()});window.addEventListener('pageshow',()=>{last=performance.now();visible=!document.hidden;render()});
 setInterval(tick,1000);render();return timer;
}
setupCareTimer();
