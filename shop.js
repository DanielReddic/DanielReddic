/* SHOP — switched off for now (the site shows "Shop - coming soon").
   To launch it, in index.html remove the comment markers around the two shop lines
   (<link ... shop.css> in the head, <script ... shop.js> at the bottom, AFTER script.js).
   This file needs script.js loaded first (it reuses the artwork images in IM and the PAGES list).

   Before launch: put your real Zelle address and email in SHOP below, set real prices, and
   replace the placeholder items. Checkout shows the buyer your Zelle address with an order code and opens an
   email with the order details to you; you confirm payment and ship. There is no card processing. */
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

PAGES.shop=shop;
