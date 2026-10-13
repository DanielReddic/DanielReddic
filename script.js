
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
// LENSE binder: 3 spreads. type img|video|text, w:true = full width, src:"" = placeholder.
const P=(cap,w)=>({type:'img',src:'',cap:cap||'Title — description',w});
const SPREADS=[
 {l:[P('Photo 01 — description',true),P('Photo 02'),P('Photo 03')],r:[P('Photo 04'),P('Photo 05'),{type:'text',text:'Statement / notes go here.'}]},
 {l:[P('Photo 06'),P('Photo 07'),P('Photo 08',true)],r:[{type:'video',src:'',cap:'Video 01 — description',w:true},P('Photo 09'),P('Photo 10')]},
 {l:[P('Photo 11',true),P('Photo 12'),P('Photo 13')],r:[P('Photo 14'),P('Photo 15'),P('Photo 16',true)]}];
// DIGITAL: type img|video, src:"" = placeholder. Each project has steps shown in the flow chart.
const GFX=["assets/graphic-01.jpg","assets/graphic-02.jpg","assets/graphic-03.jpg","assets/graphic-04.jpg","assets/graphic-05.jpg","assets/graphic-06.jpg","assets/graphic-07.jpg","assets/graphic-08.jpg","assets/graphic-09.jpg","assets/graphic-10.jpg","assets/graphic-11.jpg","assets/graphic-12.jpg","assets/graphic-13.jpg","assets/graphic-14.jpg","assets/graphic-15.jpg"];
const stp=n=>Array.from({length:n},(_,i)=>({type:'img',src:'',title:'Step '+(i+1),text:'Describe this stage of the process.'}));
const prj=(n,k)=>Array.from({length:n},(_,i)=>({type:'img',src:'',title:'Project 0'+(i+1),steps:stp(k)}));
const DIGITAL={graphic:{name:'Graphic design',gallery:true,items:GFX.map(s=>({src:s}))},interactive:{name:'Interactive',items:prj(3,5)},three:{name:'3D',items:prj(3,5)}};
// SHOP: set your Zelle + email. Prices below are placeholders. sizes shows a size picker; one:true = single original.
const SHOP={zelle:"YOUR-ZELLE-EMAIL-OR-PHONE",email:"YOUR-EMAIL",
 merch:[
  {id:'m1',title:'Print 01',price:45,desc:'Giclée print on archival paper.',sizes:['8x10','11x14','18x24'],src:IM[3]},
  {id:'m2',title:'Poster 02',price:30,desc:'Offset poster.',sizes:['18x24','24x36'],src:IM[1]},
  {id:'m3',title:'T-shirt 03',price:40,desc:'Heavyweight cotton tee, screen printed.',sizes:['S','M','L','XL'],src:''},
  {id:'m4',title:'Print 04',price:45,desc:'Giclée print on archival paper.',sizes:['8x10','11x14','18x24'],src:IM[4]},
  {id:'m5',title:'T-shirt 05',price:40,desc:'Heavyweight cotton tee, screen printed.',sizes:['S','M','L','XL'],src:''},
  {id:'m6',title:'Poster 06',price:30,desc:'Offset poster.',sizes:['18x24','24x36'],src:IM[5]}],
 works:IM.map((s,i)=>({id:'w'+(i+1),title:'Title '+(i+1),price:1200,one:true,desc:'Medium, year, dimensions.',src:s}))};
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
 if(it.type==='text')return `<p>${it.text}</p>`;
 const m=it.src?(it.type==='video'?`<video src="${it.src}" controls playsinline></video>`:`<img src="${it.src}" alt="">`):(it.type==='video'?'ADD VIDEO':'ADD PHOTO');
 return `<figure class="k ${it.w?'w':''}"><div class="m">${m}</div>${it.cap?`<figcaption>${it.cap}</figcaption>`:''}</figure>`;
}
const pg=a=>`<div class="pg">${a.map(media).join('')}</div>`;
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
let cart=[];const usd=n=>'$'+n.toLocaleString();
const LAYM=[[1,3,0],[5,2,9],[8,3,2],[3,3,7],[6,3,0],[10,3,11],[1,2,4],[8,4,8]],LAYW=[[1,6,0],[8,5,12],[3,5,6],[7,6,0],[1,5,10],[8,5,2],[2,6,4],[7,5,9]];
const shImg=it=>it.src?`<img src="${it.src}" alt="${it.title}">`:`<div class="ph" style="aspect-ratio:4/5">ADD PHOTO</div>`;
function shop(){return `<div class="sh"><div class="shbar"><span><button data-t="merch" class="on">Merch</button><button data-t="works">Works</button></span><button class="cartb">Cart (0)</button></div><div class="shg"></div><div class="sht"></div></div>`}
function wireS(root){
 const sh=root.querySelector('.sh'),g=sh.querySelector('.shg'),t=sh.querySelector('.sht'),cb=sh.querySelector('.cartb');let tab='merch';
 const upd=()=>cb.textContent=`Cart (${cart.reduce((a,c)=>a+c.q,0)})`,show=h=>{t.innerHTML=h;t.style.display='flex';t.querySelector('.x').onclick=hide},hide=()=>t.style.display='none',total=()=>cart.reduce((a,c)=>a+c.price*c.q,0);
 function grid(){const L=tab==='merch'?LAYM:LAYW;g.scrollTop=0;
  g.innerHTML=SHOP[tab].map((it,i)=>{const l=L[i%L.length];return `<figure class="mi" data-i="${i}" style="grid-column:${l[0]}/span ${l[1]};margin-top:${l[2]}vh">${shImg(it)}<figcaption>${it.title} — ${usd(it.price)}</figcaption></figure>`}).join('');
  g.querySelectorAll('.mi').forEach(f=>f.onclick=()=>item(SHOP[tab][+f.dataset.i]))}
 function item(it){let sz=it.sizes?it.sizes[0]:'';
  show(`<div class="det"><div class="di">${shImg(it)}</div><div class="dt"><button class="x">CLOSE ×</button><h3>${it.title}</h3><div class="pr">${usd(it.price)}</div><p>${it.desc}</p>${it.sizes?`<div class="sz">${it.sizes.map((s,i)=>`<button data-s="${s}" class="${i?'':'on'}">${s}</button>`).join('')}</div>`:''}<button class="add">ADD TO CART</button></div></div>`);
  t.querySelectorAll('.sz button').forEach(b=>b.onclick=()=>{sz=b.dataset.s;t.querySelectorAll('.sz button').forEach(x=>x.classList.toggle('on',x===b))});
  t.querySelector('.add').onclick=()=>{const k=cart.find(c=>c.id===it.id&&c.sz===sz);if(k&&!it.one)k.q++;else if(!k)cart.push({id:it.id,title:it.title,sz,price:it.price,q:1});upd();cartV()}}
 function cartV(){show(`<div class="cartp"><button class="x">CLOSE ×</button><h3>Cart</h3>${cart.length?cart.map((c,i)=>`<div class="ci"><span>${c.title}${c.sz?' · '+c.sz:''} × ${c.q}</span><span>${usd(c.price*c.q)}<button data-r="${i}">remove</button></span></div>`).join('')+`<div class="ci tot"><span>Total</span><span>${usd(total())}</span></div><button class="add co">CHECKOUT</button>`:'<p>Your cart is empty.</p>'}</div>`);
  t.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.r,1);upd();cartV()});
  const co=t.querySelector('.co');if(co)co.onclick=checkout}
 function checkout(){show(`<div class="cartp"><button class="x">CLOSE ×</button><h3>Checkout</h3><input class="nm" placeholder="Name"><input class="em" placeholder="Email"><input class="ad" placeholder="Shipping address"><button class="add pl">PLACE ORDER</button><div class="ord"></div></div>`);
  t.querySelector('.pl').onclick=()=>{const v=c=>t.querySelector(c).value.trim(),id='ORD-'+Math.random().toString(36).slice(2,8).toUpperCase();
   const body=`Order ${id}\n`+cart.map(c=>`${c.title}${c.sz?' ('+c.sz+')':''} x${c.q} — ${usd(c.price*c.q)}`).join('\n')+`\nTotal ${usd(total())}\n\n${v('.nm')}\n${v('.em')}\n${v('.ad')}`;
   t.querySelector('.ord').innerHTML=`<p><b>Order ${id}</b> — ${usd(total())}</p><p>1. Pay by Zelle to <b>${SHOP.zelle}</b> with ${id} in the memo.<br>2. Email your order details so it can be confirmed and shipped.</p><a class="add" href="mailto:${SHOP.email}?subject=${encodeURIComponent('Order '+id)}&body=${encodeURIComponent(body)}">EMAIL ORDER</a>`}}
 sh.querySelectorAll('.shbar [data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;sh.querySelectorAll('.shbar [data-t]').forEach(x=>x.classList.toggle('on',x===b));grid()});
 cb.onclick=cartV;grid();upd();
}
const PAGES={lense,digital,shop};

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
function mount(n,root){root.innerHTML=PAGES[n]();if(n==='lense')wire(root);if(n==='digital')wireD(root);if(n==='shop')wireS(root)}
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
