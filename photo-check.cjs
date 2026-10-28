const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const storage=new Map(),ctx=vm.createContext({assert,console,localStorage:{getItem:k=>storage.get(k)}});
vm.runInContext(fs.readFileSync(__dirname+'/photo.js','utf8'),ctx);
vm.runInContext(`
assert.deepEqual(photoGrid(1200,800,18),{columns:18,rows:12});
assert.deepEqual(photoGrid(800,1200,24),{columns:16,rows:24});
assert.throws(()=>photoGrid(10000,10000,18));assert.throws(()=>photoGrid(10000,100,18));
const pixels=Uint8ClampedArray.from(Array.from({length:16},(_,i)=>i<8?[255,0,0,255]:[0,0,255,255]).flat());
const m=quantizePhoto(pixels,4,4);assert(validPhotoModel(m));assert.equal(m.palette.length,2);assert(m.palette.includes('#ff0000'));assert(m.palette.includes('#0000ff'));assert.equal(m.cells.length,16);
const white=quantizePhoto(new Uint8ClampedArray(64).fill(255),4,4);assert.equal(white.palette.length,1);assert(white.cells.every(n=>n===1));
assert(!validPhotoModel({...m,cells:[99]}));assert(!validPhotoModel({...m,palette:['<script>']}));assert(!validPhotoModel({...m,rows:100000}));
const scene=makePhotoScene(m);assert.equal(scene.regions.length,16);assert.equal(scene.palette.length,2);assert.equal(scene.category,'photo');
assert(scene.regions.every(r=>r.x>0&&r.x<500&&r.y>0&&r.y<420));assert.throws(()=>makePhotoScene({}));
assert.equal(loadPhotoRecord(),null);
console.log('PASS: landscape/portrait grids, dimension limits, color extraction, monochrome, model validation, SVG generation.');
`,ctx);
storage.set('little-color-photo-v1',JSON.stringify({model:{version:1,columns:3,rows:3,palette:['#ffffff'],cells:Array(9).fill(1)},fills:['#ffffff']}));
vm.runInContext("assert.equal(loadPhotoRecord().model.cells.length,9)",ctx);
storage.set('little-color-photo-v1','not-json');vm.runInContext('assert.equal(loadPhotoRecord(),null)',ctx);
