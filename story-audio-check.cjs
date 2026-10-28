const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({assert,console});
vm.runInContext(fs.readFileSync(__dirname+'/story-audio.js','utf8'),ctx);
vm.runInContext(`
assert.equal(Object.keys(FILIAL_NARRATIONS).length,24);
assert.equal(Object.keys(OTHER_NARRATIONS).length,35);
for(const text of Object.values(OTHER_NARRATIONS))assert(text.length>80);
for(const text of Object.values(FILIAL_NARRATIONS))assert(text.length>100);
const spoken=[],states=[];let cancels=0;
const synth={cancel(){cancels++},speak(u){spoken.push(u)}};
class Utterance{constructor(text){this.text=text}}
const player=createStoryNarrator({synth,Utterance,onState:s=>states.push(s)});
player.setScene('one','第一句。第二句。');player.configure({voiceURI:'zh-TW-test'},.7);player.play();
assert.equal(spoken.at(-1).text,'第一句。');assert.equal(spoken.at(-1).lang,'zh-TW');assert.equal(spoken.at(-1).rate,.7);
assert.equal(spoken.at(-1).voice.voiceURI,'zh-TW-test');
spoken.at(-1).onend();assert.equal(spoken.at(-1).text,'第二句。');
const old=spoken.at(-1);player.togglePause();assert.equal(player.getState().state,'paused');
old.onend();assert.equal(player.getState().state,'paused');
player.togglePause();assert.equal(player.getState().state,'playing');assert.equal(spoken.at(-1).text,'第二句。');
const before=spoken.length;player.setScene('one','第一句。第二句。');assert.equal(spoken.length,before);assert.equal(player.getState().state,'playing');
spoken.at(-1).onend();assert.equal(player.getState().state,'idle');
player.play();const stale=spoken.at(-1);player.setScene('two','新的故事。');assert.equal(player.getState().state,'idle');
stale.onend();stale.onerror({error:'interrupted'});assert.equal(player.getState().state,'idle');
player.play();assert.equal(spoken.at(-1).text,'新的故事。');player.stop();assert.equal(player.getState().state,'idle');
player.play();spoken.at(-1).onerror({error:'not-allowed'});assert.match(states.at(-1).message,/再按一次/);
player.setScene('classic','');const count=spoken.length;player.play();assert.equal(spoken.length,count);
const unsupported=createStoryNarrator({onState:s=>states.push(s)});unsupported.setScene('x','故事。');unsupported.play();assert.equal(unsupported.getState().available,false);
console.log('PASS: 59 scripts; speech sequencing, voice/rate, pause/resume, stale events, stop, scene change, same-scene rendering, errors, unsupported browser.');
`,ctx);
