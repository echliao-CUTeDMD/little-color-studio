'use strict';
const PHOTO_KEY='little-color-photo-v1';
function photoGrid(width,height,density){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1||width*height>25000000||width/height>4||height/width>4)throw Error('請選擇 2,500 萬像素以內、長寬比不超過 4：1 的照片。');
 const side=[12,18,24].includes(Number(density))?Number(density):18;
 return width>=height?{columns:side,rows:Math.max(3,Math.round(side*height/width))}:{columns:Math.max(3,Math.round(side*width/height)),rows:side};
}
function quantizePhoto(rgba,columns,rows){
 const points=Array.from({length:columns*rows},(_,i)=>Array.from(rgba.slice(i*4,i*4+3)));
 const distance=(a,b)=>a.reduce((sum,v,j)=>sum+(v-b[j])**2,0);
 const centers=[[...points[0]]];
 while(centers.length<6){let best=0,next=null;for(const p of points){const d=Math.min(...centers.map(c=>distance(p,c)));if(d>best){best=d;next=p}}if(!next)break;centers.push([...next])}
 let cells=[];
 for(let round=0;round<14;round++){
  cells=points.map(p=>{let best=0;for(let j=1;j<centers.length;j++)if(distance(p,centers[j])<distance(p,centers[best]))best=j;return best});
  const sums=centers.map(()=>[0,0,0,0]);points.forEach((p,i)=>{p.forEach((v,j)=>sums[cells[i]][j]+=v);sums[cells[i]][3]++});
  sums.forEach((s,i)=>{if(s[3])centers[i]=s.slice(0,3).map(v=>v/s[3])});
 }
 const used=[...new Set(cells)].sort((a,b)=>centers[b].reduce((s,v)=>s+v,0)-centers[a].reduce((s,v)=>s+v,0));
 const palette=used.map(i=>'#'+centers[i].map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''));
 return {version:1,columns,rows,palette,cells:cells.map(i=>used.indexOf(i)+1)};
}
function validPhotoModel(m){return !!m&&m.version===1&&Number.isInteger(m.columns)&&Number.isInteger(m.rows)&&m.columns>=3&&m.rows>=3&&m.columns<=24&&m.rows<=24&&Array.isArray(m.palette)&&m.palette.length>=1&&m.palette.length<=6&&m.palette.every(c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c))&&Array.isArray(m.cells)&&m.cells.length===m.columns*m.rows&&m.cells.every(n=>Number.isInteger(n)&&n>=1&&n<=m.palette.length)}
function loadPhotoRecord(){try{const r=JSON.parse(localStorage.getItem(PHOTO_KEY));return validPhotoModel(r?.model)?r:null}catch{return null}}
function makePhotoScene(model){
 if(!validPhotoModel(model))throw Error('照片填色資料不完整，請重新選擇照片。');
 const cell=Math.min(476/model.columns,396/model.rows),left=(500-cell*model.columns)/2,top=(420-cell*model.rows)/2;
 const regions=model.cells.map((n,i)=>{const x=left+(i%model.columns)*cell,y=top+Math.floor(i/model.columns)*cell;return {shape:`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" stroke="#778075" stroke-width="0.6"/>`,n,x:x+cell/2,y:y+cell/2}});
 return {id:'my-photo',name:'我的照片填色',category:'photo',model,palette:model.palette.map((c,i)=>[`照片色 ${i+1}`,c]),regions,lines:'',desc:`照片像素畫 · ${regions.length} 個色塊`,story:'照片已變成數字像素畫！依號碼填色，慢慢拼出自己的回憶。可展開參考圖看看完成後的模樣。'};
}
function setupPhotoUpload(onCreate){
 const el=id=>document.getElementById(id);let source=null,url=null,generation=0;
 function clear(){generation++;source=null;if(url)URL.revokeObjectURL(url);url=null;el('photo-preview').removeAttribute('src');el('photo-file').value='';el('photo-build').disabled=true;el('photo-message').textContent='選擇 JPG、PNG 或 WebP，最多 12 MB。'}
 el('photo-open').onclick=()=>{clear();el('photo-dialog').showModal()};
 el('photo-cancel').onclick=()=>el('photo-dialog').close();
 el('photo-dialog').addEventListener('close',clear);
 el('photo-file').onchange=async()=>{
  const file=el('photo-file').files[0];clear();if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){el('photo-message').textContent='請使用 12 MB 以內的 JPG、PNG 或 WebP；HEIC 請先轉成 JPG。';return}
  const token=generation;const objectUrl=URL.createObjectURL(file);url=objectUrl;el('photo-message').textContent='正在讀取照片…';
  try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=objectUrl});if(token!==generation)return;photoGrid(img.naturalWidth,img.naturalHeight,18);source=img;el('photo-preview').src=objectUrl;el('photo-build').disabled=false;el('photo-message').textContent='照片準備好了。選擇色塊密度，再建立填色圖。'}
  catch{if(token!==generation)return;source=null;if(url)URL.revokeObjectURL(url);url=null;el('photo-message').textContent='無法使用這張照片。請選擇可正常開啟、2,500 萬像素以內、長寬比不超過 4：1 的圖片。'}
 };
 el('photo-build').onclick=()=>{
  if(!source)return;
  el('photo-build').disabled=true;
  try{const {columns,rows}=photoGrid(source.naturalWidth,source.naturalHeight,el('photo-density').value);const canvas=document.createElement('canvas');canvas.width=columns;canvas.height=rows;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,columns,rows);ctx.drawImage(source,0,0,columns,rows);const model=quantizePhoto(ctx.getImageData(0,0,columns,rows).data,columns,rows);onCreate(model);el('photo-dialog').close()}
  catch{el('photo-message').textContent='這次轉換沒有完成，請試試較小的圖片。';el('photo-build').disabled=false}
 };
}
