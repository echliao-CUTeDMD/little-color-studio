const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/care-timer.js','utf8');
const ctx=vm.createContext({assert,console});vm.runInContext(code.replace('setupCareTimer();',''),ctx);
vm.runInContext(`
const start=new Date(2026,9,29,10,0,0).getTime();
const t=createCareTimer({},start);
t.tick(600000,start+600000,true);assert.equal(t.state.today,600000);
t.tick(600000,start+1200000,false);assert.equal(t.state.today,600000);
t.interval(10,start+1200000);assert.equal(t.state.restUntil,start+1800000);
t.tick(10000,start+1210000,true);assert.equal(t.state.today,600000);
assert.equal(t.resume(start+1799999),false);assert.equal(t.resume(start+1800000),true);assert.equal(t.state.segment,0);
t.tick(12000,start+1812000,true);const restored=createCareTimer(JSON.parse(JSON.stringify(t.state)),start+1812000);assert.equal(restored.state.today,612000);assert.equal(restored.state.segment,12000);
restored.rest(start+1812000);const afterClose=createCareTimer(restored.state,start+3000000);assert(afterClose.state.restUntil);assert(afterClose.resume(start+3000000));
const midnight=new Date(2026,9,30).getTime();const overnight=createCareTimer({day:careDay(midnight-1000),today:300000,segment:100000},midnight-1000);overnight.tick(2000,midnight+1000,true);assert.equal(overnight.state.today,1000);assert.equal(overnight.state.segment,102000);
const invalid=createCareTimer({today:-5,segment:'oops',interval:999,restUntil:Infinity},start);assert.equal(invalid.state.today,0);assert.equal(invalid.state.segment,0);assert.equal(invalid.state.interval,30);
console.log('PASS: foreground accumulation, hidden pause, interval changes, 10-minute rest, early-resume prevention, reload, closed-page rest, midnight and invalid records.');
`,ctx);
// UI integration with a deterministic clock.
let wall=new Date(2026,9,29,10).getTime(),mono=0,interval,stopCount=0;
const nodes=new Map(),events={};function el(id){if(!nodes.has(id))nodes.set(id,{value:'30',textContent:'',disabled:false,open:false,addEventListener(k,f){this[k]=f},click(){if(id==='story-stop')stopCount++},showModal(){this.open=true},close(){this.open=false},focus(){}});return nodes.get(id)}
const data=new Map();const doc={hidden:false,getElementById:el,querySelectorAll(){return []},addEventListener(k,f){events[k]=f}};
const ui=vm.createContext({document:doc,window:{addEventListener(k,f){events[k]=f}},performance:{now:()=>mono},Date:class extends Date{constructor(...args){super(...(args.length?args:[wall]))}static now(){return wall}},localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},setInterval:f=>interval=f});
vm.runInContext(code,ui);mono+=1000;wall+=1000;interval();assert.equal(el('care-total').textContent,'0:01');
el('care-interval').value='10';el('care-interval').onchange();assert.equal(el('care-interval').value,'10');
mono+=599000;wall+=599000;interval();assert(el('care-dialog').open);assert(el('care-resume').disabled);assert.equal(stopCount,1);
el('care-dialog').cancel({preventDefault(){this.prevented=true}});el('care-resume').onclick();assert(el('care-dialog').open);
mono+=600000;wall+=600000;interval();assert(!el('care-resume').disabled);el('care-resume').onclick();assert(!el('care-dialog').open);assert.equal(el('care-session').textContent,'0:00');
console.log('PASS: visible timer, settings value, modal, narration stop and parent resume integration.');
