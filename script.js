
/* ============ EDIT HERE ============ */
// Mouth image pairs (first one tilts 15deg left, second is straight). Each shows MOUTH_MS.
const SETS={lense:["assets/mouth-lens-closed.jpg","assets/mouth-lens-open.jpg"],digital:["assets/mouth-digital-1.jpg","assets/mouth-digital-2.jpg"],shop:["assets/mouth-shop-1.jpg","assets/mouth-shop-2.jpg"]},MOUTH_MS=150;
// PHYSICAL: 7 works. ar = width/height. Edit title / meta / desc.
const IM=["assets/art-1.jpg","assets/art-2.jpg","assets/art-3.jpg","assets/art-4.jpg","assets/art-5.jpg","assets/art-6.jpg","assets/art-7.jpg","assets/art-8.jpg"];
const ART=[
 {src:IM[0],ar:0.664,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[1],ar:1.248,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[2],ar:1,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[3],ar:1.007,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[4],ar:1.284,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[5],ar:.996,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[6],ar:.37,title:"Title",meta:"Medium, year",desc:"Description of the work."},
 {src:IM[7],ar:0.653,title:"Title",meta:"Medium, year",desc:"Description of the work."}];
// LENS binder: 3 spreads, each with a left and right page. Photos sit freely on the page:
// x = % from the left, y = % from the top, w = width as % of the page (height follows the photo).
// For video use {type:'video',src:'assets/clip.mp4',x:..,y:..,w:..}; for text use {type:'text',text:'...',x:..,y:..,w:..}.
// Photos: assets/lens/NN.jpg (compressed, shown in the book) and assets/lens/full/NN.jpg (large, opens when clicked).
const P=(n,x,y,w)=>({src:`assets/lens/${n}.jpg`,full:`assets/lens/full/${n}.jpg`,x,y,w});
const SPREADS=[
 {l:[P('01',6,3.8,46),P('02',58,15.0,36),P('03',16,58.5,32)],
  r:[P('04',6,4.5,44),P('05',52,37.5,42)]},
 {l:[P('06',52,3.0,42),P('07',6,16.5,38),P('08',44,60.0,34)],
  r:[P('09',52,4.5,42),P('10',8,39.0,44)]},
 {l:[P('11',8,4.5,36),P('12',50,9.0,44),P('13',14,60.0,34)],
  r:[P('14',6,4.5,44),P('15',52,37.5,42)]}];
// DIGITAL: type img|video, src:"" = placeholder. Each project has steps shown in the flow chart.
const GFX=["assets/graphic-01.jpg","assets/graphic-02.jpg","assets/graphic-03.jpg","assets/graphic-04.jpg","assets/graphic-05.jpg","assets/graphic-06.jpg","assets/graphic-07.jpg","assets/graphic-08.jpg","assets/graphic-09.jpg","assets/graphic-10.jpg","assets/graphic-11.jpg","assets/graphic-12.jpg","assets/graphic-13.jpg","assets/graphic-14.jpg","assets/graphic-15.jpg"];
const stp=n=>Array.from({length:n},(_,i)=>({type:'img',src:'',title:'Step '+(i+1),text:'Describe this stage of the process.'}));
const prj=(n,k)=>Array.from({length:n},(_,i)=>({type:'img',src:'',title:'Project 0'+(i+1),steps:stp(k)}));
const DIGITAL={graphic:{name:'Graphic design',gallery:true,items:GFX.map(s=>({src:s}))},interactive:{name:'Interactive',items:prj(3,5)},three:{name:'3D',items:prj(3,5)}};
/* =================================== */
const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hh=()=>{const h=$('header').offsetHeight+8;document.documentElement.style.setProperty('--hh',h+'px');return h};

/* ---- 3D head ---- */
const cv=$('#c'),rd=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
rd.setPixelRatio(Math.min(devicePixelRatio,2));rd.outputEncoding=THREE.sRGBEncoding;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,50);cam.position.z=5;
const grp=new THREE.Group();sc.add(grp);
const MOUTH=new THREE.Vector3(-.005,.598,.25),CEN=new THREE.Vector3(.00429,.69453,-.02),MW=.085;let K=1,loaded=false;
function fit(){rd.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();hh();gal()}
new THREE.GLTFLoader().load('assets/head.glb',g=>{
 let mesh;g.scene.traverse(o=>{if(o.isMesh)mesh=o});
 const map=mesh.material.map;if(map){map.encoding=THREE.sRGBEncoding;map.minFilter=THREE.LinearFilter;map.generateMipmaps=false}
 mesh.material=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});
 const box=new THREE.Box3().setFromObject(mesh),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());
 CEN.copy(c);K=2.3/s.y;mesh.scale.setScalar(K);mesh.position.copy(c).multiplyScalar(-K);
 grp.add(mesh);grp.position.y=-.3;loaded=true;
});
let mx=0,my=0,tx=0,ty=0,lock=false;
addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2});
function mouthPx(){
 grp.updateMatrixWorld(true);
 const at=v=>grp.localToWorld(v.clone().sub(CEN).multiplyScalar(K)).project(cam),a=at(MOUTH),b=at(MOUTH.clone().add(new THREE.Vector3(MW,0,0))),W=innerWidth,H=innerHeight;
 return {x:(a.x+1)/2*W,y:(1-a.y)/2*H,w:2*Math.abs((b.x-a.x)/2*W)};
}
function loop(){requestAnimationFrame(loop);const f=lock?.25:.08;
 tx+=((lock?0:mx*.85)-tx)*f;ty+=((lock?0:my*.45)-ty)*f;grp.rotation.y=tx;grp.rotation.x=ty;
 if(f0v)rd.render(sc,cam);
 pan+=(panT+mx*2.5-pan)*.09;ring.style.transform=`translateZ(${R+150}px) rotateY(${pan}deg)`}

/* ---- binder (Lense) ---- */
function media(it){
 if(it.x!==undefined){const st=`left:${it.x}%;top:${it.y}%;width:${it.w}%`;
  if(it.type==='text')return `<p class="fl" style="${st}">${it.text}</p>`;
  if(it.type==='video')return `<figure class="fl" style="${st}"><video src="${it.src}" controls playsinline></video>${it.cap?`<figcaption>${it.cap}</figcaption>`:''}</figure>`;
  return `<figure class="fl" style="${st}"><img src="${it.src}" data-full="${it.full||it.src}" alt="${it.cap||''}" decoding="async">${it.cap?`<figcaption>${it.cap}</figcaption>`:''}</figure>`}
 if(it.type==='text')return `<p>${it.text}</p>`;
 const m=it.src?(it.type==='video'?`<video src="${it.src}" controls playsinline></video>`:`<img src="${it.src}" alt="">`):(it.type==='video'?'ADD VIDEO':'ADD PHOTO');
 return `<figure class="k ${it.w?'w':''}"><div class="m">${m}</div>${it.cap?`<figcaption>${it.cap}</figcaption>`:''}</figure>`;
}
const pg=a=>`<div class="pg${a.length&&a[0].x!==undefined?' free':''}">${a.map(media).join('')}</div>`;
function lense(){
 const S=SPREADS,n=S.length;
 let h=`<div class="wrap"><div class="book"><div class="half l">${pg(S[0].l)}</div><div class="half r">${pg(S[n-1].r)}</div>`;
 for(let i=0;i<n-1;i++)h+=`<div class="leaf"><div class="face2 f">${pg(S[i].r)}</div><div class="face2 b">${pg(S[i+1].l)}</div></div>`;
 return h+`<div class="rings">${[12,36,60,84].map(t=>`<div class="ring" style="top:${t}%"></div>`).join('')}</div></div>
 <div class="ctl"><button class="pv" aria-label="Previous">&larr;</button><span class="pi"></span><button class="nx" aria-label="Next">&rarr;</button></div></div>`;
}
let lidx=0,binders=[];
const bStep=d=>{lidx=Math.max(0,Math.min(SPREADS.length-1,lidx+d));binders=binders.filter(f=>f()!==false)};
function wire(root){
 const ls=[...root.querySelectorAll('.leaf')],pv=root.querySelector('.pv'),nx=root.querySelector('.nx'),pi=root.querySelector('.pi');let first=true;
 const up=()=>{if(!ls[0].isConnected)return false;ls.forEach((l,i)=>{l.classList.toggle('flipped',i<lidx);setTimeout(()=>l.style.zIndex=i<lidx?i+1:ls.length-i,i<lidx&&!first?500:0)});
  pi.textContent=`${lidx+1} / ${ls.length+1}`;pv.disabled=!lidx;nx.disabled=lidx>=ls.length;first=false};
 pv.onclick=()=>bStep(-1);nx.onclick=()=>bStep(1);binders.push(up);up();
}
/* ---- digital ---- */
const mm=o=>o.src?(o.type==='video'?`<video src="${o.src}" controls playsinline muted></video>`:`<img src="${o.src}" alt="">`):(o.type==='video'?'ADD VIDEO':'ADD IMAGE');
function digital(){return `<div class="dg"><nav class="dmenu">${Object.entries(DIGITAL).map(([k,v])=>`<button data-c="${k}">${v.name}</button>`).join('')}</nav><div class="dcontent"></div><div class="flow"><div class="fbar"><span></span><button class="fx">CLOSE ×</button></div><div class="fscroll"><div class="ftrack"></div></div></div></div>`}
function wireD(root){
 const dg=root.querySelector('.dg'),dc=dg.querySelector('.dcontent'),fl=dg.querySelector('.flow'),sc=fl.querySelector('.fscroll'),tr=fl.querySelector('.ftrack');
 function flow(it){fl.querySelector('.fbar span').textContent=it.title;
  tr.innerHTML=`<div class="dot"></div>`+it.steps.map((s,i)=>`<div class="cn"></div><div class="nd"><small>${String(i+1).padStart(2,'0')}</small><div class="m">${mm(s)}</div><b>${s.title}</b><p>${s.text}</p></div>`).join('')+`<div class="cn"></div><div class="dot"></div>`;
  sc.scrollLeft=0;fl.classList.add('on')}
 dg.querySelectorAll('.dmenu button').forEach(b=>b.onclick=()=>{
  const D=DIGITAL[b.dataset.c];dg.classList.add('side');dg.querySelectorAll('.dmenu button').forEach(x=>x.classList.toggle('on',x===b));
  dc.className='dcontent';void dc.offsetWidth;
  dc.innerHTML=D.gallery?`<h2>${D.name}</h2><div class="mas">${D.items.map(it=>`<img src="${it.src}" alt="">`).join('')}</div>`:`<h2>${D.name}</h2><div class="grid big">${D.items.map((it,i)=>`<figure class="gi" data-i="${i}"><div class="m">${mm(it)}</div><figcaption>${it.title}</figcaption></figure>`).join('')}</div>`;
  dc.className='dcontent in';dc.querySelectorAll('.mas img').forEach(im=>im.onclick=()=>{LB.querySelector('img').src=im.src;LB.querySelector('p').innerHTML='';LB.style.display='flex'});
  dc.querySelectorAll('.gi').forEach(g=>g.onclick=()=>flow(D.items[+g.dataset.i]))});
 fl.querySelector('.fx').onclick=()=>fl.classList.remove('on');
 sc.addEventListener('wheel',e=>{e.preventDefault();sc.scrollLeft+=e.deltaY+e.deltaX},{passive:false});
}
const PAGES={lense,digital,shop:()=>`<div class="soon">Shop — coming soon</div>`};

/* ---- curved gallery (Physical) ---- */
const ring=$('#ring'),R=1150;let pan=0,panT=0,maxPan=0,minPan=0,drag=null,moved=0,f0v=true;
function gal(){
 const H=Math.max(180,Math.min(.5*(innerHeight-hh()),440)),gap=90,W=ART.map(a=>a.ar*H);
 const L=W.reduce((a,b)=>a+b,0)+gap*(ART.length-1);let s=-L/2;ring.innerHTML='';
 ART.forEach((a,i)=>{const c=s+W[i]/2;s+=W[i]+gap;
  const f=document.createElement('figure');f.className='fr';f.style.cssText=`width:${W[i]}px;height:${H}px;margin:${-H/2}px 0 0 ${-W[i]/2}px;transform:rotateY(${-c/R}rad) translateZ(${-R}px)`;
  f.innerHTML=`<img src="${a.src}" alt="${a.title}"><figcaption><b>${a.title}</b>${a.meta}<br>${a.desc}</figcaption>`;
  f.onclick=()=>{if(moved<6)lb(i)};ring.appendChild(f)});
 const D=180/Math.PI;maxPan=(L/2-W[W.length-1]/2)/R*D;minPan=-(L/2-W[0]/2)/R*D;panT=Math.max(minPan,Math.min(maxPan,panT));
}
const G=$('#gal'),setPan=v=>panT=Math.max(minPan,Math.min(maxPan,v));
G.onpointerdown=e=>{drag=e.clientX;moved=0};
addEventListener('pointermove',e=>{if(drag!=null){const d=e.clientX-drag;moved+=Math.abs(d);drag=e.clientX;setPan(panT-d*.12)}});
addEventListener('pointerup',()=>drag=null);
G.addEventListener('wheel',e=>{e.preventDefault();setPan(panT+(e.deltaY+e.deltaX)*.05)},{passive:false});
let li=-1;const LB=$('#lb');
function lb(i){li=(i+ART.length)%ART.length;const a=ART[li];LB.querySelector('img').src=a.src;LB.querySelector('p').innerHTML=`<b style="color:#fff;letter-spacing:.06em;text-transform:uppercase">${a.title}</b> — ${a.meta}<br>${a.desc}`;LB.style.display='flex'}
LB.onclick=()=>{LB.style.display='none';li=-1};
addEventListener('keydown',e=>{const fl=document.querySelector('.flow.on'),k=e.key;
 if(li>=0){if(k==='Escape')LB.onclick();if(k==='ArrowRight')lb(li+1);if(k==='ArrowLeft')lb(li-1)}
 else if(fl){const s=fl.querySelector('.fscroll');if(k==='Escape')fl.classList.remove('on');if(k==='ArrowRight')s.scrollLeft+=320;if(k==='ArrowLeft')s.scrollLeft-=320}
 else if(cur==='physical'){if(k==='ArrowRight')setPan(panT+12);if(k==='ArrowLeft')setPan(panT-12)}
 else if(cur==='lense'){if(k==='ArrowRight')bStep(1);if(k==='ArrowLeft')bStep(-1)}});

/* ---- navigation ---- */
let busy=false,cur=null,loc='home',mpos=null;
const world=$('#world'),pitch=$('#pitch'),f1=$('#f1'),f2=$('#f2'),pageEl=$('#page'),mi=$('#mi'),low=$('#low'),ov=$('#ov');
const YAW0='translateZ(-50vw)',YAW1='translateZ(-50vw) rotateY(-90deg)',P0='translateY(0) rotateX(0deg)',P1='translateY(-100vh) rotateX(90deg)';
const setNav=n=>document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===n));
const setOf=n=>SETS[n]||SETS.lense;
function mount(n,root){root.innerHTML=PAGES[n]();if(n==='lense')wire(root);if(n==='digital')wireD(root);if(n==='shop'&&typeof wireS==='function')wireS(root)}
function showMouth(src,rot){mi.style.cssText=`display:block;left:${mpos.x}px;top:${mpos.y}px;width:${Math.max(90,mpos.w*1.5)}px;transform:translate(-50%,-50%) rotate(${rot}deg)`;mi.src=src}
async function turn(toP){
 if(toP){f1.style.visibility='visible';world.style.transform=YAW1;await sleep(1350);f0v=false}
 else{f0v=true;world.style.transform=YAW0;await sleep(1350);f1.style.visibility='hidden'}
}
async function showPage(n){
 const s=setOf(n);lock=true;await sleep(380);
 mpos=loaded?mouthPx():{x:innerWidth/2,y:innerHeight/2,w:200};
 showMouth(s[0],-15);await sleep(MOUTH_MS);showMouth(s[1],0);await sleep(MOUTH_MS);
 mount(n,pageEl);pageEl.className=(n==='digital'||n==='shop')?'d':'';pageEl.style.top=hh()+'px';pageEl.style.display='flex';
 const p=pageEl.getBoundingClientRect();pageEl.style.transformOrigin=`${mpos.x-p.left}px ${mpos.y-p.top}px`;pageEl.classList.add('fly');
 await sleep(900);mi.style.display='none';loc='page';cur=n;
}
async function collapse(n,el=pageEl){
 const s=setOf(n);if(!lock){lock=true;await sleep(380)}
 if(loaded)mpos=mouthPx();showMouth(s[1],0);
 const p=el.getBoundingClientRect();el.style.transformOrigin=`${mpos.x-p.left}px ${mpos.y-p.top}px`;
 el.classList.remove('fly');el.classList.add('back');await sleep(480);el.style.display='none';
 showMouth(s[0],-15);await sleep(MOUTH_MS);mi.style.display='none';
}
async function toHome(){
 if(loc==='physical')await turn(false);
 else if(loc==='low'){
  lock=true;f0v=true;mount('lense',ov);ov.className='';ov.style.display='flex';low.innerHTML='';
  pitch.style.transform=P0;await sleep(1350);f2.style.visibility='hidden';await collapse('lense',ov);
 }else if(loc==='page')await collapse(cur);
 loc='home';cur=null;lock=false;
}
async function toLow(from){ // camera turns to look down at the book
 mount('lense',low);f2.style.visibility='visible';
 if(from==='physical')world.style.transform=YAW0;
 pitch.style.transform=P1;await sleep(1350);
 if(from==='physical')f1.style.visibility='hidden';else pageEl.style.display='none';
 f0v=false;loc='low';cur='lense';
}
async function open(n){
 if(busy||n===cur)return;busy=true;setNav(n);
 try{
  if(n==='lense'&&cur)await toLow(loc);
  else{await toHome();
   if(n==='physical'){panT=0;pan=0;await turn(true);loc='physical';cur=n}else await showPage(n)}
 }finally{busy=false}
}
async function home(){if(busy||!cur)return;busy=true;try{await toHome();setNav(null)}finally{busy=false}}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>open(b.dataset.p));
$('#home').onclick=home;addEventListener('resize',fit);fit();loop();

document.addEventListener('click',e=>{const im=e.target.closest&&e.target.closest('.pg.free img');
 if(im){const L=document.querySelector('#lb');L.querySelector('img').src=im.dataset.full||im.src;L.querySelector('p').innerHTML='';L.style.display='flex'}});
