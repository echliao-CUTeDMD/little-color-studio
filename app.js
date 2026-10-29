'use strict';
const COLORS=[['奶油黃','#f5d77d'],['珊瑚橘','#efa48a'],['天空藍','#acd4df'],['嫩葉綠','#b9ce99'],['莓果粉','#deb1c8'],['可可棕','#bc9b7b']];
const R=(shape,n,x,y)=>({shape,n,x,y});
const path=d=>`<path d="${d}"/>`;
const ellipse=(cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const rect=(x,y,w,h,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const SCENES=[
{id:'garden',name:'小兔的花園',desc:'入門 · 15 個色塊',regions:[
R(rect(12,12,476,396,14),3,52,165),R(ellipse(414,75,32,32),1,414,75),R(path('M12 305 Q120 230 245 290 Q365 230 488 289 L488 408 L12 408Z'),4,430,365),
R(path('M62 92 Q51 65 77 59 Q80 32 108 40 Q128 29 144 53 Q180 48 178 75 Q185 95 163 96Z'),5,118,72),
R(path('M175 206 Q142 84 172 70 Q203 63 213 192Z'),2,178,131),R(path('M271 194 Q280 68 310 77 Q340 87 307 219Z'),2,303,139),
R(ellipse(249,316,78,79),1,250,335),R(ellipse(242,230,90,69),1,241,220),R(ellipse(184,373,32,17),2,183,373),R(ellipse(303,373,32,17),2,303,373),
R(path('M63 327 Q24 286 41 273 Q70 274 77 327Z'),4,51,295),R(path('M78 321 Q93 276 116 290 Q117 312 78 337Z'),4,99,306),
R(path('M60 242 C27 226 40 203 62 211 C58 183 89 179 95 206 C119 187 139 214 117 231 C143 249 125 273 102 258 C97 284 67 278 69 255 C42 270 30 244 60 242Z'),5,82,252),R(ellipse(85,232,18,18),1,85,232),
R(path('M373 299 Q378 270 400 285 Q423 271 426 298 L402 354Z'),2,400,309)
],lines:'<path d="M77 270V355 M400 283l-9-17 M401 282l10-18"/><path d="M219 251q22 23 44 0 M239 242l6 0"/><ellipse cx="206" cy="226" rx="4" ry="6" fill="#4e584b"/><ellipse cx="274" cy="226" rx="4" ry="6" fill="#4e584b"/><path d="M168 249l25 3 M289 253l25-4 M153 341q-19-24-32-8"/>'},
{id:'home',name:'森林小屋',desc:'探索 · 17 個色塊',regions:[
R(rect(12,12,476,396,14),3,60,65),R(ellipse(410,77,33,33),1,410,77),R(path('M12 285 Q150 234 257 285 Q380 245 488 282 L488 408 H12Z'),4,61,370),
R(rect(76,218,18,121,5),6,85,312),R(path('M85 87 L32 203 H53 L24 264 H145 L115 203 H136Z'),4,85,214),R(rect(412,220,18,125,5),6,421,318),R(path('M422 117 L374 210 H390 L362 276 H478 L450 210 H465Z'),4,421,235),
R(rect(306,116,29,80),6,320,146),R(rect(157,210,192,137),1,174,281),R(path('M135 216 L251 110 L369 216Z'),2,250,178),R(rect(229,262,48,85,23),6,253,301),
R(rect(177,243,34,38,5),3,194,261),R(rect(296,243,34,38,5),3,313,261),R(path('M229 347 L278 347 L326 408 H182Z'),5,252,381),
R(ellipse(133,355,23,13),5,133,355),R(ellipse(362,365,27,16),2,362,365),R(path('M175 76 Q149 77 159 57 Q160 45 179 48 Q195 25 209 46 Q230 40 239 60 Q248 78 220 78Z'),5,197,60)
],lines:'<path d="M194 244v36 M178 261h32 M313 244v36 M297 261h32 M85 155v113 M421 180v96"/><circle cx="264" cy="307" r="3" fill="#4e584b"/>'},
{id:'sea',name:'鯨魚去旅行',desc:'探索 · 16 個色塊',regions:[
R(rect(12,12,476,396,14),3,46,45),R(path('M12 290 Q72 265 128 289 T250 288 T370 289 T488 284 V408 H12Z'),3,45,317),
R(path('M133 238 C107 137 264 113 329 197 Q362 221 395 188 L422 164 Q451 165 446 192 Q467 202 449 222 Q420 232 391 230 Q364 303 246 301 Q161 304 133 238Z'),5,259,211),
R(path('M143 256 Q260 297 362 261 Q319 320 237 311 Q167 306 143 256Z'),1,249,287),R(path('M253 263 Q247 329 298 338 Q324 317 304 276Z'),5,281,306),
R(path('M235 146 Q215 111 191 109 Q187 90 204 91 Q228 95 239 127 Q238 81 261 79 Q282 84 266 98 Q250 107 247 146Z'),3,246,123),
R(ellipse(80,118,22,22),1,80,118),R(ellipse(118,73,13,13),1,118,73),R(ellipse(361,88,18,18),1,361,88),
R(path('M70 230 Q104 202 123 226 Q108 255 77 242 L56 253 L58 219Z'),2,91,231),
R(path('M380 326 Q411 304 436 325 L458 313 L456 344 L433 335 Q406 359 380 326Z'),2,416,330),
R(path('M50 408 Q25 354 45 344 Q66 355 57 379 Q83 335 91 355 Q93 381 77 408Z'),4,61,390),
R(path('M349 408 Q325 354 344 349 Q365 360 354 379 Q387 349 388 370 Q381 392 373 408Z'),4,359,390),
R(path('M175 344 L184 362 L206 366 L188 381 L191 400 L173 390 L154 400 L158 380 L142 366 L164 362Z'),1,175,376),
R(ellipse(271,390,26,13),6,271,390),R(ellipse(446,390,22,12),6,446,390)
],lines:'<circle cx="181" cy="224" r="5" fill="#4e584b"/><path d="M170 245q15 13 28 0"/><circle cx="106" cy="228" r="2" fill="#4e584b"/><circle cx="396" cy="326" r="2" fill="#4e584b"/>'}
];
SCENES.push(...createZodiacScenes(),...createFairytaleScenes(),...createFilialScenes(),...createPoemScenes(),...createAlphabetScenes(),...createZhuyinScenes());
const photoRecord=loadPhotoRecord();
if(photoRecord)SCENES.push(makePhotoScene(photoRecord.model));
const $=id=>document.getElementById(id);
const scenePalette=s=>s.palette||COLORS;
const activeColors=()=>scenePalette(SCENES[current]);
let saved={};try{saved=JSON.parse(localStorage.getItem('little-color-v1'))||{}}catch{}
if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
if(photoRecord)saved['my-photo']=photoRecord.fills;
let current=SCENES.findIndex(s=>s.category==='poem'),selected=1,mode='number',sound=false,audioContext;const histories=SCENES.map(()=>[]);
const fills=SCENES.map(s=>s.regions.map((_,i)=>{let c=saved[s.id]?.[i];return scenePalette(s).some(p=>p[1]===c)?c:null}));
const storyAudio=setupStoryAudio(()=>SCENES[current]);
function svgFor(scene,colors,interactive=false){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" aria-label="${scene.name}" ${interactive?'role="group"':'role="img"'}><g stroke="#505b4d" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${scene.regions.map((r,i)=>`<g ${interactive?`class="region" tabindex="0" role="button" data-i="${i}" aria-label="第 ${i+1} 塊，${r.n} 號${scenePalette(scene)[r.n-1][0]}${colors[i]?'，已填色':''}"`:''} fill="${colors[i]||'#fffdf8'}">${r.shape}${interactive?`<text class="region-number" x="${r.x}" y="${r.y}" text-anchor="middle" dominant-baseline="central" stroke="none">${colors[i]?'':r.n}</text>`:''}</g>`).join('')}<g fill="none" pointer-events="none">${scene.lines}</g></g></svg>`}
function say(text){$('status').textContent=text}
function save(){try{const photoIndex=SCENES.findIndex(s=>s.category==='photo');if(photoIndex>=0)localStorage.setItem(PHOTO_KEY,JSON.stringify({model:SCENES[photoIndex].model,fills:fills[photoIndex]}));localStorage.setItem('little-color-v1',JSON.stringify(Object.fromEntries(SCENES.map((s,i)=>[s.id,fills[i]]).filter(([id])=>id!=='my-photo'))))}catch{say('目前無法自動存檔，記得按「儲存作品」留下你的畫。')}}
function render(){selected=Math.min(selected,activeColors().length);renderPalette();storyAudio.sync();const s=SCENES[current];$('scene-title').textContent=s.name;$('zhuyin-panel').hidden=!s.zhuyin;if(s.zhuyin){const z=s.zhuyin;$('zhuyin-example').textContent=z.character+'（'+z.word+'）';$('zhuyin-syllable').innerHTML=[...z.syllable].map(c=>c===z.symbol?'<mark>'+c+'</mark>':c).join('');}$('poem-panel').hidden=!s.poem;$('poem-author').textContent=s.poem?'唐 · '+s.poem.author:'';$('poem-lines').textContent=s.poem?s.poem.lines.map((line,i)=>line+(i%2?'。':'，')).join('\n'):'';$('poem-meaning').textContent=s.poem?s.poem.meaning:'';if(s.poem)$('poem-source').href=s.poem.source;$('photo-reference').hidden=s.category!=='photo';$('photo-reference-image').innerHTML=s.category==='photo'?svgFor(s,s.regions.map(r=>scenePalette(s)[r.n-1][1])):'';$('story-intro').textContent=s.story||'';$('story-intro').hidden=!s.story;$('scene-level').textContent=s.desc;$('drawing').classList.toggle('photo-canvas',s.category==='photo');$('drawing').innerHTML=svgFor(s,fills[current],true);document.querySelectorAll('.scene-card').forEach((el,i)=>{el.classList.toggle('active',i===current);el.setAttribute('aria-pressed',i===current)});update()}
function update(){const count=fills[current].filter(Boolean).length,total=fills[current].length;$('progress-label').textContent=`已塗好 ${count} / ${total} 個色塊`;$('progress-percent').textContent=Math.round(count/total*100)+'%';$('progress').style.width=count/total*100+'%';$('undo').disabled=!histories[current].length;$('selected-note').textContent=`現在的顏色：${selected} 號・${activeColors()[selected-1][0]}`;document.querySelectorAll('.swatch').forEach((el,i)=>{el.classList.toggle('active',selected===i+1);el.setAttribute('aria-pressed',selected===i+1)})}
function tone(){if(!sound)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();let o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.value=400+selected*70;g.gain.setValueAtTime(.07,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.18);o.start();o.stop(audioContext.currentTime+.18)}catch{}}
function paint(i){const s=SCENES[current],color=activeColors()[selected-1][1];if(mode==='number'&&s.regions[i].n!==selected){say(`這一塊是 ${s.regions[i].n} 號喔！試試${activeColors()[s.regions[i].n-1][0]}。`);return}if(fills[current][i]===color)return;const wasComplete=fills[current].every(Boolean);histories[current].push([...fills[current]]);fills[current][i]=color;const el=$('drawing').querySelector(`[data-i="${i}"]`);el.setAttribute('fill',color);el.querySelector('.region-number').textContent='';el.setAttribute('aria-label',`第 ${i+1} 塊，已填${activeColors()[selected-1][0]}`);update();tone();say('真棒！再幫下一個色塊穿上新衣吧。');if(!wasComplete&&fills[current].every(Boolean)){say('完成了！你是今天的小小藝術家！可以儲存作品或挑另一張畫。');celebrate()}save()}
function celebrate(){for(let i=0;i<36;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.background=COLORS[i%6][1];c.style.animationDelay=Math.random()*.5+'s';$('celebration').append(c)}setTimeout(()=>$('celebration').replaceChildren(),3500)}
function renderLibrary(){
 const category=SCENES[current].category||'classic';$('scenes').replaceChildren();
 SCENES.forEach((s,i)=>{let b=document.createElement('button');b.className='scene-card';b.dataset.category=s.category||'classic';b.hidden=b.dataset.category!==category;b.innerHTML=svgFor(s,s.regions.map(r=>scenePalette(s)[r.n-1][1]))+`<strong>${s.name}</strong><small>${s.desc}</small>`;b.onclick=()=>{current=i;render();say(`來畫「${s.name}」吧！`)};$('scenes').append(b)});
 $('photo-collection').hidden=!SCENES.some(s=>s.category==='photo');
}
function selectCollection(category){const next=SCENES.findIndex(s=>(s.category||'classic')===category);if(next<0)return;current=next;document.querySelectorAll('.scene-card').forEach(b=>b.hidden=b.dataset.category!==category);['photo','zhuyin','alphabet','poem','filial','fairytale','zodiac','classic'].forEach(c=>{$(c+'-collection').classList.toggle('active',c===category);$(c+'-collection').setAttribute('aria-pressed',c===category)});render();say('來畫「'+SCENES[current].name+'」吧！')}
['photo','zhuyin','alphabet','poem','filial','fairytale','zodiac','classic'].forEach(c=>{$(c+'-collection').onclick=()=>selectCollection(c)});
function renderPalette(){$('palette').replaceChildren();activeColors().forEach(([name,color],i)=>{let b=document.createElement('button');b.className='swatch';b.style.setProperty('--color',color);b.style.setProperty('--swatch-ink',parseInt(color.slice(1,3),16)*.299+parseInt(color.slice(3,5),16)*.587+parseInt(color.slice(5,7),16)*.114<145?'#ffffff':'#25382e');b.setAttribute('aria-label',`${i+1} 號 ${name}`);b.innerHTML=`<span>${i+1}</span><small>${name}</small>`;b.onclick=()=>{selected=i+1;update();say(`選好了 ${selected} 號${name}，點一下畫裡的色塊吧。`)};$('palette').append(b)})}
function installPhoto(model){const scene=makePhotoScene(model);let i=SCENES.findIndex(s=>s.category==='photo');if(i<0){i=SCENES.length;SCENES.push(scene);fills.push([]);histories.push([])}else SCENES[i]=scene;fills[i]=scene.regions.map(()=>null);histories[i]=[];selected=1;current=i;renderLibrary();selectCollection('photo');say('照片填色圖準備好了！先選顏色，再找相同的數字。');save()}
setupPhotoUpload(installPhoto);
renderLibrary();
$('drawing').addEventListener('click',e=>{let el=e.target.closest('.region');if(el)paint(Number(el.dataset.i))});
$('drawing').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){let el=e.target.closest('.region');if(el){e.preventDefault();paint(Number(el.dataset.i))}}});
function setMode(next){mode=next;['number','free'].forEach(m=>{$(m+'-mode').classList.toggle('active',m===next);$(m+'-mode').setAttribute('aria-pressed',m===next)});$('mode-help').textContent=next==='number'?'找一找，畫裡相同的數字在哪裡？':'喜歡什麼就塗什麼，讓想像力自由跑！';say(next==='number'?'數字填色：選擇對應號碼的顏色。':'自由配色：每一塊都可以用你喜歡的顏色！')}
$('number-mode').onclick=()=>setMode('number');$('free-mode').onclick=()=>setMode('free');
$('numbers').onchange=e=>$('drawing').classList.toggle('hide-numbers',!e.target.checked);
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=`♪ 填色音效：${sound?'開':'關'}`;$('sound').setAttribute('aria-pressed',sound);tone()};
$('undo').onclick=()=>{if(histories[current].length){fills[current]=histories[current].pop();render();save();say('已回到上一步。')}};
$('hint').onclick=()=>{let i=SCENES[current].regions.findIndex((r,i)=>!fills[current][i]&&(mode==='free'||r.n===selected));if(i<0){say('這個顏色的色塊已經畫好了，換個顏色試試！');return}let el=$('drawing').querySelector(`[data-i="${i}"]`);el.classList.remove('hint');void el.getBoundingClientRect();el.classList.add('hint');el.focus({preventScroll:true});say('亮起來的色塊在等你喔！')};
$('reset').onclick=()=>$('reset-dialog').showModal();$('cancel-reset').onclick=()=>$('reset-dialog').close();$('confirm-reset').onclick=()=>{histories[current].push([...fills[current]]);fills[current].fill(null);$('reset-dialog').close();render();save();say('新的畫布準備好了！也可以按上一步找回原本的顏色。')};
$('download').onclick=()=>{const s=SCENES[current];const blob=new Blob([svgFor(s,fills[current])],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1500;canvas.height=1260;let ctx=canvas.getContext('2d');ctx.fillStyle='#fffcf6';ctx.fillRect(0,0,1500,1260);ctx.drawImage(img,0,0,1500,1260);URL.revokeObjectURL(url);canvas.toBlob(b=>{if(!b){say('下載未完成，請再試一次。');return}let u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`小小塗色屋-${s.name}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);say('作品已準備下載，快分享你的顏色吧！')},'image/png')};img.onerror=()=>{URL.revokeObjectURL(url);say('圖片匯出失敗，請再試一次。')};img.src=url};
render();



