// Run with: node check.cjs (no dependencies). Logic checks with a minimal DOM stub.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.style={setProperty(){}};this.classList={toggle(){},add(){},remove(){}};this.dataset={};this.textContent='';}append(c){this.children.push(c)}setAttribute(){}addEventListener(){}querySelector(){return new Element()}querySelectorAll(){return []}replaceChildren(){this.children=[]}getBoundingClientRect(){return {}}focus(){}showModal(){}close(){}}
const els=new Map(),data=new Map();const context=vm.createContext({document:{getElementById(id){if(!els.has(id))els.set(id,new Element());return els.get(id)},createElement(){return new Element()},querySelectorAll(selector){return selector==='.scene-card'?(els.get('scenes')?.children||[]):selector==='.swatch'?(els.get('palette')?.children||[]):[]}},localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},setTimeout(){},addEventListener(){},console,assert});
vm.runInContext(fs.readFileSync(__dirname+'/fairytales.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/zodiac.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/filial.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/story-audio.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/photo.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/poems.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);
vm.runInContext(`
assert.equal(SCENES.length,89);
assert.equal(new Set(SCENES.map(s=>s.id)).size,89);
assert.equal(SCENES.filter(s=>s.category==='poem').length,30);
assert.equal(new Set(TANG_POEMS.map(p=>p.title)).size,30);
assert(TANG_POEMS.every(p=>[4,6,8].includes(p.lines.length)&&p.lines.every(line=>[5,7].includes([...line].length))&&p.author&&p.meaning&&p.source.startsWith('https://zh.wikisource.org/wiki/')));
assert.equal(TANG_POEMS.find(p=>p.key==='grass').lines.length,8);
assert.equal(TANG_POEMS.find(p=>p.key==='mother').lines.length,6);
assert.deepEqual(TANG_POEMS.map(p=>p.key),['quiet','spring','tower','deer','bamboo','beans','plum','farewell','jiande','snow','hermit','sunset','stove','autumn-night','remaining-snow','monk','qin','mother','grass','farm','mountain-autumn','sea-moon','brothers','hibiscus','yellow-crane','baidi','maple','west-stream','swallows','peach-stream']);
assert.deepEqual(SCENES.slice(3,15).map(s=>s.name.split('・')[0]),['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬']);
assert.equal(SCENES.filter(s=>s.category==='fairytale').length,20);
assert(SCENES.slice(15).every(s=>s.story&&s.regions.length>=10));
assert.equal(SCENES.filter(s=>s.category==='filial').length,24);
assert(SCENES.filter(s=>s.category==='filial').every(s=>FILIAL_NARRATIONS[s.id.slice(7)]?.length>100));
assert.equal(Object.keys(OTHER_NARRATIONS).length,35);
assert(SCENES.every(s=>getStoryNarration(s).length>80));
assert.equal(new Set(SCENES.map(s=>getStoryNarration(s))).size,89);
assert.equal(new Set(SCENES.slice(35,59).map(s=>s.name)).size,24);
assert.deepEqual(SCENES.slice(35,59).map(s=>s.name),['孝感動天','親嘗湯藥','齧指痛心','單衣順母','負米養親','賣身葬父','鹿乳奉親','行傭供母','懷橘遺親','乳姑不怠','恣蚊飽血','臥冰求鯉','為母埋兒','扼虎救父','棄官尋母','嘗糞憂心','戲彩娛親','拾葚供親','扇枕溫衾','湧泉躍鯉','聞雷泣墓','刻木事親','哭竹生筍','滌親溺器']);
assert.equal(current,59);
assert.equal($('poem-panel').hidden,false);
assert.equal($('poem-author').textContent,'唐 · 李白');
assert($('poem-lines').textContent.includes('床前明月光'));
$('poem-reading-mode').value='poem';$('poem-reading-mode').onchange();
assert(!$('story-full-text').textContent.includes('白話解說'));
assert($('story-full-text').textContent.includes('舉頭望明月'));
$('poem-reading-mode').value='full';$('poem-reading-mode').onchange();assert($('story-full-text').textContent.includes('白話解說'));
current=0;
for(const s of SCENES)for(const r of s.regions){assert(r.n>=1&&r.n<=6);assert(r.x>0&&r.x<500&&r.y>0&&r.y<420)}
paint(0);assert.equal(fills[0][0],null,'Wrong numbered color must be rejected');
selected=3;paint(0);assert.equal(fills[0][0],COLORS[2][1]);
$('undo').onclick();assert.equal(fills[0][0],null);
setMode('free');selected=2;paint(0);assert.equal(fills[0][0],COLORS[1][1]);
$('confirm-reset').onclick();assert(fills[0].every(x=>x===null));
$('undo').onclick();assert.equal(fills[0][0],COLORS[1][1]);
setMode('number');
for(current=0;current<SCENES.length;current++){for(let i=0;i<SCENES[current].regions.length;i++){selected=SCENES[current].regions[i].n;paint(i)}assert(fills[current].every(Boolean));assert.equal($('progress-percent').textContent,'100%')}
assert.equal(Object.keys(JSON.parse(localStorage.getItem('little-color-v1'))).length,89);
selectCollection('classic');assert.equal(current,0);
selectCollection('zodiac');assert.equal(current,3);
selectCollection('fairytale');assert.equal(current,15);
assert.equal($('story-intro').textContent,SCENES[15].story);
selectCollection('classic');assert.equal($('story-intro').hidden,true);
selectCollection('filial');assert.equal(current,35);
assert.equal($('story-audio').hidden,false);
assert.equal($('story-full-text').textContent,FILIAL_NARRATIONS.heaven);
assert.equal($('story-intro').textContent,SCENES[35].story);
for(const [category,count] of [['classic',3],['zodiac',12],['fairytale',20],['filial',24],['poem',30]]){
 selectCollection(category);
 assert.equal(document.querySelectorAll('.scene-card').filter(b=>!b.hidden).length,count);
 assert.equal($('story-audio').hidden,false);
 assert.equal($('poem-panel').hidden,category!=='poem');
 assert.equal($('poem-reading-label').hidden,category!=='poem');
 assert.equal($('story-full-text').textContent,getStoryNarration(SCENES[current]));
 assert(fills[current].every(Boolean),'Switching categories must preserve completed art');
}
console.log('PASS: 89 scenes including 24 filial stories; '+SCENES.reduce((sum,s)=>sum+s.regions.length,0)+' regions; number validation, free coloring, undo, reset, completion, save, collection switching.');
let queued=null,latest=null;
const narrator=createStoryNarrator({synth:{cancel(){queued=null},speak(u){queued=u}},Utterance:class {constructor(text){this.text=text}},onState:s=>latest=s});
for(current=0;current<SCENES.length;current++){
 render();const s=SCENES[current];
 assert.equal($('story-audio').hidden,false);assert.equal($('story-full-text').textContent,getStoryNarration(s));
 narrator.setScene(s.id,s.name+'。'+getStoryNarration(s));narrator.play();let sentences=0;
 while(latest.state==='playing'){assert(queued.text.length>0);const next=queued;queued=null;next.onend();assert(++sentences<40)}
 assert(sentences>=4);assert.equal(latest.state,'idle');
}
console.log('PASS: all 89 scenes expose matching narration and complete simulated sentence playback.');
const originalIds=SCENES.map(s=>s.id).join(',');
const photoModel={version:1,columns:3,rows:3,palette:['#123456','#fedcba'],cells:[1,2,1,2,1,2,1,2,1]};
installPhoto(photoModel);assert.equal(SCENES.length,90);assert.equal(current,89);
assert.equal(document.querySelectorAll('.scene-card').filter(b=>!b.hidden).length,1);
assert.equal(document.querySelectorAll('.swatch').length,2);assert.equal($('photo-reference').hidden,false);
selected=2;paint(0);assert.equal(fills[89][0],null);selected=1;paint(0);assert.equal(fills[89][0],'#123456');
$('undo').onclick();assert.equal(fills[89][0],null);paint(0);
assert.equal(loadPhotoRecord().fills[0],'#123456');
selectCollection('classic');assert.equal(activeColors(),COLORS);assert.equal($('photo-reference').hidden,true);
selectCollection('photo');assert.equal(fills[89][0],'#123456');
installPhoto({...photoModel,palette:['#000000'],cells:Array(9).fill(1)});assert.equal(SCENES.length,90);assert(fills[89].every(c=>c===null));assert.equal(histories[89].length,0);
assert.equal(SCENES.slice(0,89).map(s=>s.id).join(','),originalIds);
for(let i=0;i<9;i++)paint(i);assert.equal($('progress-percent').textContent,'100%');
console.log('PASS: custom palette, photo selection, hints/number validation, undo, save, replacement, original artwork preservation, completion.');
`,context);
