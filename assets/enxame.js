/* Enxame Tirvo: o Hipercode e mais três agentes em 3D fofo constroem a página na rolagem. Os três mudam a cada visita, em rodízio. */
(function(){
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const POOL=['pixel','loop','nano','bit','debug','cifra','query','prosa','babel','orbita','crivo','neon','eco','cron'];
const SQ=(()=>{let n=0;try{n=+localStorage.getItem('tirvo-enxame')||0;localStorage.setItem('tirvo-enxame',String(n+3))}catch(e){n=Math.floor(Math.random()*POOL.length)}
  return [0,1,2].map(k=>POOL[(n+k)%POOL.length])})();
window.HC3D=(()=>{if(!window.THREE)return null;const RM=false,DPR=Math.min(2,devicePixelRatio||1);
const PI=Math.PI,V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),C=h=>new THREE.Color(h).convertSRGBToLinear();
let R1;try{R1=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});if(!R1.getContext())return null}catch(e){return null}
R1.outputEncoding=THREE.sRGBEncoding;
const scn=new THREE.Scene();
scn.add(new THREE.HemisphereLight(C('#fff0e4'),C('#2a1a22'),.62));
const key=new THREE.DirectionalLight(0xffffff,.85);key.position.set(-30,45,50);scn.add(key);
const rim=new THREE.DirectionalLight(C('#ffc39a'),.55);rim.position.set(35,25,-45);scn.add(rim);

/* ---------- materiais e geometrias compartilhadas ---------- */
const MC=new Map();
const M=(h,ro=.45,o)=>{const k='s'+h+ro+(o?JSON.stringify(o):'');if(!MC.has(k))MC.set(k,new THREE.MeshStandardMaterial(Object.assign({color:C(h),roughness:ro,metalness:0},o||{})));return MC.get(k)};
const E=(h,op=1)=>{const k='e'+h+op;if(!MC.has(k))MC.set(k,new THREE.MeshBasicMaterial({color:C(h),transparent:op<1,opacity:op,depthWrite:op>=1}));return MC.get(k)};
const VC=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.45,metalness:0});
const mK=M('#120d0f',.25),mW=E('#ffffff');
const BALL=new THREE.SphereGeometry(1,24,16),HALF=new THREE.SphereGeometry(1,24,12,0,2*PI,PI/2,PI/2);
const GC=new Map(),geo=(k,f)=>{if(!GC.has(k))GC.set(k,f());return GC.get(k)};
const cyl=(a,b,h,s=16)=>geo(`c${a},${b},${h},${s}`,()=>new THREE.CylinderGeometry(a,b,h,s));
const cone=(r,h,s=20)=>geo(`k${r},${h},${s}`,()=>new THREE.ConeGeometry(r,h,s));
const tor=(r,t,arc=2*PI)=>geo(`t${r},${t},${arc}`,()=>new THREE.TorusGeometry(r,t,10,Math.max(12,Math.round(28*arc/PI)),arc));
const add=(par,g,m,p=[0,0,0],s,r)=>{const me=new THREE.Mesh(g,m);me.position.set(p[0],p[1],p[2]);if(s)me.scale.set(s[0],s[1],s[2]);if(r)me.rotation.set(r[0],r[1],r[2]);par.add(me);return me};
const grp=(par,p=[0,0,0],r)=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);if(r)g.rotation.set(r[0],r[1],r[2]);par.add(g);return g};
const pw=(v,e)=>Math.sign(v)*Math.pow(Math.abs(v),e);
const se=(v,e)=>v.divideScalar(Math.pow(Math.pow(Math.abs(v.x),e)+Math.pow(Math.abs(v.y),e)+Math.pow(Math.abs(v.z),e),1/e));
// polígono com cantos arredondados no plano da frente (n lados, normal do primeiro lado em off)
const poly=(v,n,off,p=8)=>{const th=Math.atan2(v.y,v.x);let s=0;for(let i=0;i<n;i++){const c=Math.cos(th-off-i*2*PI/n);if(c>0)s+=Math.pow(c,p)}const r=1/Math.pow(s,1/p);v.x*=r;v.y*=r;return v};
function deform(fn,paint,w=96,h=72){const g=new THREE.SphereGeometry(1,w,h),a=g.attributes.position,v=V();
  for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i);const p=fn(v.clone());a.setXYZ(i,p.x,p.y,p.z)}
  g.computeVertexNormals();const nm=g.attributes.normal,m=new Map();
  for(let i=0;i<a.count;i++){const k=[a.getX(i),a.getY(i),a.getZ(i)].map(n=>n.toFixed(3)).join();(m.get(k)||m.set(k,[]).get(k)).push(i)}
  m.forEach(ix=>{if(ix.length<2)return;const s=V();ix.forEach(i=>s.add(v.fromBufferAttribute(nm,i)));s.normalize();ix.forEach(i=>nm.setXYZ(i,s.x,s.y,s.z))});
  if(paint){const col=new Float32Array(a.count*3),c=new THREE.Color();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i);c.copy(C(paint(v)));col.set([c.r,c.g,c.b],i*3)}g.setAttribute('color',new THREE.BufferAttribute(col,3))}
  return g}
const rbox=(w,h,d,e=4)=>geo(`r${w},${h},${d},${e}`,()=>deform(v=>se(v,e).multiply(V(w/2,h/2,d/2)),null,24,16));
const mix=(a,b,t)=>'#'+C(a).lerp(C(b),t).convertLinearToSRGB().getHexString();
function extr(shape,d=.5,bv=.18){const g=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:3,curveSegments:10});g.center();return g}
const starShape=(n,R,r)=>{const s=new THREE.Shape();for(let i=0;i<=2*n;i++){const a=PI/2+i*PI/n,q=i%2?r:R;i?s.lineTo(Math.cos(a)*q,Math.sin(a)*q):s.moveTo(Math.cos(a)*q,Math.sin(a)*q)}return s};
const STAR=geo('star',()=>extr(starShape(5,1,.45),.35,.15)),STAR4=geo('star4',()=>extr(starShape(4,1,.3),.25,.1));
const HEART=geo('heart',()=>{const s=new THREE.Shape();s.moveTo(0,-1);s.bezierCurveTo(-.3,-.7,-1.2,-.2,-1.2,.35);s.bezierCurveTo(-1.2,.95,-.4,1.15,0,.6);s.bezierCurveTo(.4,1.15,1.2,.95,1.2,.35);s.bezierCurveTo(1.2,-.2,.3,-.7,0,-1);return extr(s,.4,.2)});
const tube=(pts,r,s=40)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),s,r,8,false);
const helix=(r,h,turns,tr)=>{const pts=[];for(let i=0;i<=turns*16;i++){const a=i/16*2*PI;pts.push([Math.cos(a)*r,i/(turns*16)*h,Math.sin(a)*r])}return tube(pts,tr,turns*24)};

/* ---------- colocação na superfície por raio ---------- */
const rc=new THREE.Raycaster();
function hit(ms,o,d){rc.set(o,d.normalize());return rc.intersectObjects(ms,false)[0]}
function surf(ch,x,y,push=0,tilt=.3){const h=hit(ch.face,V(x,y,80),V(0,0,-1)),g=new THREE.Group();
  if(h){const n=h.face.normal.clone().transformDirection(h.object.matrixWorld).lerp(V(0,0,1),tilt).normalize();g.position.copy(h.point).addScaledVector(n,push);g.quaternion.setFromUnitVectors(V(0,0,1),n)}else g.position.set(x,y,push);
  ch.b.add(g);return g}
const sideX=(ch,y,sx,z=0)=>{const h=hit(ch.body,V(sx*80,y,z),V(-sx,0,0));return h?h.point.x:sx*8};
const botY=(ch,x,z=0)=>{const h=hit(ch.body,V(x,-80,z),V(0,1,0));return h?h.point.y:-8};
const topY=(ch,x,z=0)=>{const h=hit(ch.body,V(x,80,z),V(0,-1,0));return h?h.point.y:8};

/* ---------- mão, braço e perna (mesmo rig do Hipercode) ---------- */
function hand(par,sx,m){const h=grp(par,[sx*2.55,0,0]);
  add(h,BALL,m,[sx*.2,0,0],[.5,.42,.36]);add(h,BALL,m,[sx*.95,0,0],[.95,.8,.3]);
  const base=sx>0?0:PI,fin=(x,y,an,len,rad)=>{const g=grp(h,[x,y,0],[0,0,an]);add(g,cyl(rad,rad,len),m,[len/2,0,0],null,[0,0,PI/2]);add(g,BALL,m,[len,0,0],[rad,rad,rad])};
  [[-.42,1.05],[-.02,1.25],[.38,1.1]].forEach(([a,l])=>{const an=base+sx*a;fin(sx*1.05+Math.cos(an)*.7,Math.sin(an)*.62,an,l,.24)});
  const ta=base+sx*1.55;fin(sx*.8+Math.cos(ta)*.6,Math.sin(ta)*.6,base+sx*1.05,.9,.26);return h}
function arms(ch,y,k=1,cu,cf,chd,inset=.6){const c=ch.c;for(const sx of[-1,1]){const x=sideX(ch,y,sx)-sx*inset*k,a=grp(ch.b,[x,y,0]);a.scale.setScalar(k);
  add(a,cyl(.5,.5,2.7),M(cu||c.b),[sx*1.35,0,0],null,[0,0,PI/2]);const el=grp(a,[sx*2.7,0,0]);add(el,BALL,M(cu||c.b),[0,0,0],[.56,.56,.56]);
  add(el,cyl(.46,.5,2.4),M(cf||cu||c.b),[sx*1.2,0,0],null,[0,0,PI/2]);ch.arms.push({sx,a,el,h:hand(el,sx,M(chd||c.l))})}}
const setArm=(ch,i,a1,a2,b=0)=>{const A=ch.arms[i];if(!A)return;A.a.rotation.set(0,0,A.sx*a1);A.el.rotation.set(0,-A.sx*b,A.sx*a2)};
function flame(par,cols,s=1){const f=grp(par);f.scale.setScalar(s);[[1.2,6.2],[.8,4.3],[.42,2.6]].forEach(([rd,h],k)=>{const c=add(f,geo(`fl${rd}`,()=>new THREE.ConeGeometry(rd,h,20,1,true)),E(cols[k],.9),[0,-h/2,0],null,[PI,0,0]);c.renderOrder=k+1});return f}
const fcols=c=>[c.a,mix(c.a,'#ffffff',.45),mix(c.a,'#ffffff',.8)];
function legs(ch,o={}){const c=ch.c,k=o.k||1,x0=o.x||3.5;for(const sx of[-1,1]){const y=botY(ch,sx*x0)+.6*k,hp=grp(ch.b,[sx*x0,y,0]);hp.scale.setScalar(k);
  add(hp,cyl(.5,.5,3.3),M(o.cu||c.b),[0,-1.6,0]);const kn=grp(hp,[0,-3.2,0]);add(kn,BALL,M(o.cu||c.b),[0,0,0],[.54,.54,.54]);
  add(kn,cyl(.48,.5,3.3),M(o.cf||o.cu||c.b),[0,-1.6,0]);const fs=o.foot||1;add(kn,BALL,M(o.cfoot||c.l),[sx*.4,-3.6,.5],[1.5*fs,.85*fs,1.85*fs]);
  if(o.sole)add(kn,BALL,M(o.sole),[sx*.4,-4.05,.5],[1.45*fs,.4*fs,1.8*fs]);
  if(o.fire){const f=flame(kn,o.fire);f.position.set(sx*.2,-4.3,.4);ch.flames.push(f)}ch.legs.push({hp,kn,sx})}}
const setLeg=(ch,i,h,k)=>{const L=ch.legs[i];if(L){L.hp.rotation.x=h;L.kn.rotation.x=k}};

/* ---------- corpos ---------- */
const P3=PI/3;
const BODY={
 hc:{f:v=>{se(v,2.4);v.x*=1-.07*v.y;v.z*=1-.07*v.y;return v.set(v.x*10.5,v.y*8.4,v.z*7.4)},F:{ey:4,ex:4,my:-3.9},ay:.3},
 box:{f:v=>{se(v,3.6);return v.set(v.x*10.5,v.y*8.5,v.z*7.5)},F:{ey:3,ex:4,my:-3.2},ay:0},
 circle:{f:v=>{se(v,2.05);return v.set(v.x*9.6,v.y*9.4,v.z*8.6)},F:{ey:3.2,ex:3.8,my:-3.4},ay:-.5},
 drop:{f:v=>{se(v,2.1);if(v.y>0){const s=1-Math.pow(v.y,1.6)*.82;v.x*=s;v.z*=s;v.y*=1.35}return v.set(v.x*9.2,v.y*8.6,v.z*8)},F:{ey:1.4,ex:3.6,my:-3.4},ay:-2},
 capsule:{f:v=>{se(v,2.6);return v.set(v.x*12.5,v.y*7,v.z*7.5)},F:{ey:1.8,ex:4.3,my:-2.4},ay:-1},
 hex:{f:v=>{se(v,2.4);poly(v,6,PI/6,10);return v.set(v.x*9.4,v.y*8.4,v.z*7.2)},F:{ey:2.6,ex:3.6,my:-3.2},ay:0},
 shield:{f:v=>{se(v,3);if(v.y<0){const s=1+v.y*.55;v.x*=s;v.z*=1+v.y*.25;v.y*=1.2}return v.set(v.x*10,v.y*9,v.z*7)},F:{ey:3.4,ex:3.9,my:-2.6},ay:2},
 tv:{f:v=>{se(v,4.5);return v.set(v.x*12,v.y*9.5,v.z*7)},F:{ey:2.3,ex:3.8,my:-2.6},ay:-1},
 tall:{f:v=>{se(v,2.6);return v.set(v.x*7.6,v.y*11.5,v.z*7.4)},F:{ey:4.6,ex:3,my:.2,s:.85},ay:-.5},
 dome:{f:v=>{se(v,2.2);if(v.y<0)v.y*=.32;return v.set(v.x*11.5,v.y*11-1.5,v.z*9.5)},F:{ey:4,ex:4,my:.3},ay:-1.5},
 tri:{f:v=>{se(v,2.3);poly(v,3,-PI/2,8);return v.set(v.x*6.6,v.y*6.6-1.4,v.z*7.2)},F:{ey:.4,ex:2.7,my:-3,s:.85},ay:-4},
 egg:{f:v=>{se(v,2);v.x*=1-.13*v.y;v.z*=1-.13*v.y;if(v.y>0)v.y*=1.12;return v.set(v.x*9.6,v.y*10.2,v.z*8.6)},F:{ey:3.6,ex:3.4,my:-1.6},ay:-1.5},
 diamond:{f:v=>{se(v,2.3);poly(v,4,PI/4,8);return v.set(v.x*7.8,v.y*8.4,v.z*7)},F:{ey:2,ex:2.9,my:-2.4,s:.9},ay:-.3},
 gear:{f:v=>{se(v,2.4);const th=Math.atan2(v.y,v.x),r=1+.12*(.5+.5*Math.tanh(3.5*Math.cos(8*th)));v.x*=r;v.y*=r;return v.set(v.x*9.2,v.y*9.2,v.z*6.8)},F:{ey:2.4,ex:3.6,my:-3},ay:-.5}
};

/* ---------- olhos ---------- */
function eye(ch,x,y,push=-.1){const e=new THREE.Group();surf(ch,x,y,push).add(e);ch.eyes.push(e);return e}
const glint=(e,x,y,z,s)=>add(e,BALL,mW,[x,y,z],[s,s,s]);
const EYES={
 hc:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey,-.12);add(e,BALL,mK,[0,0,0],[1,1.6,.55]);glint(e,-.35,.62,.42,.3)}},
 two:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey);add(e,BALL,mK,[0,0,0],[1.15,1.3,.5]);glint(e,-.35,.45,.4,.34)}},
 big:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey);add(e,BALL,mK,[0,0,0],[1.65,1.95,.6]);glint(e,-.5,.7,.5,.55);glint(e,.55,-.65,.5,.24)}},
 three:(ch,F)=>{[[-3.5,-.2,.95],[0,1.1,1.2],[3.5,-.2,.95]].forEach(([x,y,s])=>{const e=eye(ch,x,F.ey+y);add(e,BALL,mK,[0,0,0],[s,s*1.15,.5]);glint(e,-.3*s,.4*s,.4,.3*s)})},
 wide:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex*1.1,F.ey);add(e,BALL,mK,[0,0,0],[1.35,1.95,.55]);glint(e,-.45,.75,.45,.45)}},
 mono:(ch,F)=>{const e=eye(ch,0,F.ey,.2);add(e,BALL,M('#ffffff',.3),[0,0,0],[2.6,2.6,1]);add(e,BALL,M(ch.c.s,.3),[0,0,.72],[1.55,1.55,.4]);add(e,BALL,mK,[0,0,.95],[.8,.8,.3]);glint(e,-.55,.6,1.1,.34)},
 squint:(ch,F)=>{const c=ch.c;
   let e=eye(ch,-F.ex,F.ey);add(e,BALL,mK,[0,0,0],[1.1,1.3,.5]);glint(e,-.35,.45,.4,.32);add(surf(ch,-F.ex,F.ey+2.2,.05),rbox(2.4,.5,.4),mK,[0,0,0],null,[0,0,.2]);
   e=eye(ch,F.ex,F.ey-.1);add(e,BALL,mK,[0,0,0],[1.15,.55,.5]);glint(e,-.3,.12,.4,.2);add(surf(ch,F.ex,F.ey+1.1,.05),rbox(2.6,.5,.4),mK,[0,0,0],null,[0,0,.35])},
 visor:(ch,F)=>{const g=surf(ch,0,F.ey,.15,.8);add(g,rbox(13.5,3.8,1.6,5),M('#0c1a22',.18),[0,0,0]);add(g,rbox(12,.35,.2),E(ch.c.g,.5),[0,1.2,.78]);
   const s=add(g,BALL,E(ch.c.a),[0,0,.8],[1,1,.35]);add(s,BALL,E('#ffe0c8'),[0,0,.6],[.45,.45,.4]);ch.anim.push(t=>s.position.x=Math.sin(t*2.2)*4.4)},
 shades:(ch,F)=>{const c=M('#0c0c10',.12);for(const sx of[-1,1]){const g=surf(ch,sx*2.7,F.ey,.25);add(g,rbox(4.8,3,1,3),c);add(g,rbox(2.6,.35,.2),E('#ffffff',.55),[-.4,.7,.52],null,[0,0,.35])}
   add(surf(ch,0,F.ey+.5,.4),rbox(1.4,.6,.6),c)},
 screen:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey,.75);add(e,rbox(1.7,2.4,.3),E(ch.c.a))}},
 glasses:(ch,F)=>{const fr=M('#3a2a18',.35);for(const sx of[-1,1]){const e=eye(ch,sx*F.ex,F.ey);add(e,BALL,mK,[0,0,0],[.95,1.05,.45]);glint(e,-.3,.35,.38,.28);
   const g=surf(ch,sx*F.ex,F.ey,.55);add(g,tor(1.75,.2),fr);add(g,new THREE.CircleGeometry(1.7,28),E('#ffffff',.12),[0,0,-.05])}
   add(surf(ch,0,F.ey+.3,.7),cyl(.14,.14,2.6),fr,[0,0,0],null,[0,0,PI/2])},
 anime:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey);add(e,BALL,mK,[0,0,0],[1.5,1.95,.55]);add(e,BALL,E(ch.c.l),[0,-.8,.35],[.95,.7,.3]);glint(e,-.45,.7,.5,.5);glint(e,.45,.05,.5,.22)}},
 happy:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const g=surf(ch,ex,F.ey,.05);add(g,tor(1.05,.3,PI),mK,[0,-.5,0])}},
 goggles:(ch,F)=>{const b=M('#8a6a3a',.4);for(const sx of[-1,1]){const e=eye(ch,sx*F.ex,F.ey);add(e,BALL,mK,[0,0,0],[.9,1,.45]);glint(e,-.3,.35,.38,.26);
   const g=surf(ch,sx*F.ex,F.ey,.55);add(g,tor(2,.55),b);add(g,new THREE.CircleGeometry(1.9,28),E(ch.c.a,.28))}
   add(surf(ch,0,F.ey,.8),cyl(.3,.3,1.6),b,[0,0,0],null,[0,0,PI/2])},
 monocle:(ch,F)=>{EYES.two(ch,F);const g=surf(ch,F.ex,F.ey,.6);add(g,tor(1.9,.26),M('#ffd24a',.3,{metalness:.35}));add(g,new THREE.CircleGeometry(1.8,28),E('#ffffff',.14));
   add(g,tube([[1.3,-1.4,0],[1.9,-3,-.2],[1.4,-4.8,-.6]],.08),M('#ffd24a',.3,{metalness:.35}))},
 stars:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey,.1);add(e,BALL,mK,[0,0,-.2],[1.35,1.35,.4]);const s=add(e,STAR,M('#ffe24a',.3),[0,0,.25],[1.15,1.15,1]);ch.anim.push(t=>s.rotation.z=Math.sin(t*1.5)*.3)}},
 leds:(ch,F)=>{for(const ex of[-F.ex,F.ex]){const e=eye(ch,ex,F.ey,.15);add(e,rbox(2.6,2.6,.9,5),M('#1c1410',.3));add(e,rbox(1.7,1.7,.4,5),E('#62ff86'),[0,0,.4]);glint(e,-.45,.45,.62,.2)}}
};

/* ---------- boca: respira e abre um sorriso maior de tempos em tempos ---------- */
const MOUTH={
 smile:(g,s)=>{add(g,tor(2*s,.32,PI),mK,[0,s,0],null,[0,0,PI]);for(const sx of[-1,1])add(g,BALL,mK,[sx*2*s,s,0],[.32,.32,.32])},
 line:g=>{add(g,cyl(.3,.3,3),mK,[0,0,0],null,[0,0,PI/2]);for(const sx of[-1,1])add(g,BALL,mK,[sx*1.5,0,0],[.3,.3,.3])},
 o:g=>add(g,BALL,mK,[0,0,0],[.85,1,.3]),
 dot:g=>add(g,BALL,mK,[0,0,0],[.5,.5,.3]),
 teeth:g=>{add(g,HALF,mK,[0,.6,0],[2.1,1.6,.3]);add(g,rbox(3.4,.7,.3),M('#ffffff',.3),[0,.2,.12])},
 grin:(g,s,c)=>{add(g,HALF,mK,[0,.8,0],[2.4,2,.3]);add(g,rbox(3.9,.7,.3),M('#ffffff',.3),[0,.4,.12]);add(g,BALL,M('#ff7a92'),[0,-.6,.12],[1.1,.6,.2])},
 zig:g=>add(g,tube([[-1.8,0,0],[-1.2,.5,0],[-.6,-.1,0],[0,.5,0],[.6,-.1,0],[1.2,.5,0],[1.8,0,0]],.2,48),mK),
 screen:(g,s,c)=>add(g,tor(1.8,.34,PI),E(c.a),[0,.9,.75],null,[0,0,PI]),
 stache:(g,s,c)=>{for(const sx of[-1,1])add(g,BALL,M('#5a3a1e',.6),[sx*1.2,.3,.15],[1.4,.55,.35],[0,0,-sx*.3]);add(g,tor(.9,.2,PI),mK,[0,-.2,0],null,[0,0,PI])},
 cat:g=>{for(const sx of[-1,1])add(g,tor(.75,.22,PI),mK,[sx*.75,.4,0],null,[0,0,PI])},
 tongue:(g,s)=>{MOUTH.smile(g,s*.85);add(g,BALL,M('#ff7a92'),[.5,-.9,.2],[.8,.9,.3])},
 slant:g=>{add(g,cyl(.3,.3,2.6),mK,[0,0,0],null,[0,0,PI/2+.25]);for(const sx of[-1,1])add(g,BALL,mK,[sx*1.26,sx*.32,0],[.3,.3,.3])},
 fang:(g,s)=>{MOUTH.smile(g,s*.85);add(g,cone(.35,.9),M('#ffffff',.3),[.8,-.6,.2],null,[PI,0,0])},
 talk:g=>{add(g,BALL,mK,[0,0,0],[1.35,1.05,.35]);add(g,BALL,M('#ff7a92'),[0,-.45,.1],[.8,.45,.3])},
 grille:(g,s,c)=>{add(g,rbox(4.8,2.1,.6,5),M('#1c1410',.3));for(let i=0;i<4;i++)add(g,rbox(.4,1.4,.3),M(c.l),[-1.5+i,0,.25])}
};
const grinT=t=>{const p=t%4.1,g=p<1.2?Math.sin(PI*p/1.2):0;return g*g};

/* ---------- topo ---------- */
const TOP={
 stems:ch=>{for(const sx of[-1,1]){const a=grp(ch.b,[sx*4,topY(ch,sx*4)-.7,0]);add(a,cyl(.2,.38,4.8),M(ch.c.d),[0,2.4,0]);add(a,BALL,M(ch.c.d),[0,4.8,0],[.2,.2,.2]);ch.ants.push([a,sx,.26])}},
 one:ch=>{const a=grp(ch.b,[0,topY(ch,0)-.4,0]);add(a,cyl(1,1.2,.6),M(ch.c.d),[0,.3,0]);add(a,cyl(.2,.28,3.6),M(ch.c.a),[0,2.2,0]);add(a,BALL,M(ch.c.a),[0,4.2,0],[.75,.75,.75]);ch.ants.push([a,0,0])},
 horns:ch=>{for(const sx of[-1,1]){const a=grp(ch.b,[sx*4.2,topY(ch,sx*4.2)-.8,0],[0,0,-sx*.45]);add(a,cone(1,2.2),M(ch.c.a),[0,1.1,0]);add(a,cone(.55,1.6),M(ch.c.a),[sx*.25,2.6,0],null,[0,0,sx*.5])}},
 spark:ch=>{const a=grp(ch.b,[0,topY(ch,0)+1.8,0]);const s=add(a,STAR4,E('#ffe07a'),[0,0,0],[1.3,1.3,1.3]);for(const sx of[-1,1])add(ch.b,BALL,M(ch.c.l),[sx*1.3,topY(ch,0)-1,0],[.7,1.6,.5],[0,0,-sx*.7]);ch.anim.push(t=>{s.rotation.z=t*1.2;s.scale.setScalar(1.1+.25*Math.sin(t*4))})},
 rotor:ch=>{const y=topY(ch,0)-.4,a=grp(ch.b,[0,y,0]);add(a,cyl(.3,.3,2.4),M(ch.c.d),[0,1.2,0]);add(a,BALL,M(ch.c.a),[0,2.5,0],[.7,.5,.7]);
   const b=grp(a,[0,2.6,0]);for(const r of[0,PI])add(b,rbox(4.4,.3,1.4,3),M(ch.c.a),[Math.cos(r)*2.4,0,Math.sin(r)*2.4],null,[0,-r,.12]);ch.anim.push(t=>b.rotation.y=t*12)},
 dish:ch=>{const a=grp(ch.b,[0,topY(ch,0)-.3,0]);add(a,cyl(.3,.4,2.4),M(ch.c.d),[0,1.2,0]);const d=grp(a,[0,2.6,0],[.7,0,.2]);
   add(d,geo('dish',()=>{const p=[];for(let i=0;i<=10;i++){const u=i/10;p.push(new THREE.Vector2(u*3.4,u*u*1.6))}const g=new THREE.LatheGeometry(p,32);return g}),M(ch.c.w,.4,{side:THREE.DoubleSide}));
   add(d,cyl(.12,.12,2.2),M(ch.c.d),[0,1.1,0]);add(d,BALL,E(ch.c.a),[0,2.3,0],[.45,.45,.45]);ch.anim.push(t=>d.rotation.y=Math.sin(t*.8)*.9)},
 coil:ch=>{const a=grp(ch.b,[0,topY(ch,0)-.3,0]);add(a,helix(.7,4,5,.16),M(ch.c.a));add(a,BALL,M(ch.c.a),[0,4.6,0],[.7,.7,.7]);ch.ants.push([a,0,0])},
 fin:ch=>{for(let i=0;i<6;i++){const z=4-i*1.8,y=topY(ch,0,z);if(y<-50)continue;add(ch.b,BALL,M(ch.c.a,.55),[0,y+1.1-i*.05,z],[.75,1.9-i*.12,1.1],[-.35+i*.12,0,0])}},
 rabbit:ch=>{for(const sx of[-1,1]){const a=grp(ch.b,[sx*1.4,topY(ch,sx*1.4)-.3,0],[0,0,-sx*.45]);add(a,cyl(.14,.2,6.5),M('#39404a'),[0,3.2,0]);add(a,BALL,M(ch.c.a),[0,6.5,0],[.5,.5,.5]);ch.ants.push([a,sx,.45])}
   add(ch.b,HALF,M('#39404a'),[0,topY(ch,0)-.2,0],[1.8,1.3,1.8],[PI,0,0])},
 hat:ch=>{const a=grp(ch.b,[0,topY(ch,0)-.6,0],[0,0,-.08]);add(a,cyl(5,5,.5,32),M('#2a2230',.5),[0,.2,0]);add(a,cyl(3.2,3.4,5.4,32),M('#2a2230',.5),[0,3,0]);add(a,cyl(3.45,3.45,1,32),M(ch.c.a),[0,1,0])},
 bubble:ch=>{const a=grp(ch.b,[4,topY(ch,0)+4.2,0]);add(a,rbox(7.4,4.6,2.2,3),M('#ffffff',.35));add(a,cone(.9,1.8),M('#ffffff',.35),[-2,-2.6,0],null,[PI,0,-.4]);
   const d=[];for(let i=-1;i<=1;i++)d.push(add(a,BALL,M(ch.c.b),[i*1.5,0,1.1],[.45,.45,.25]));ch.anim.push(t=>{a.position.y=topY0+Math.sin(t*1.6)*.5;d.forEach((m,i)=>m.position.y=Math.max(0,Math.sin(t*5-i*.8))*.4)});const topY0=a.position.y},
 crown:ch=>{const y=topY(ch,0),a=grp(ch.b,[0,y-1.6,0]),g=M('#ffd21a',.3,{metalness:.3});add(a,geo('crw',()=>new THREE.CylinderGeometry(2.4,2.1,1.4,24,1,true)),M('#ffd21a',.3,{metalness:.3,side:THREE.DoubleSide}),[0,.7,0]);
   for(let i=0;i<5;i++){const r=i/5*2*PI;add(a,cone(.55,1.6),g,[Math.sin(r)*2.3,2.1,Math.cos(r)*2.3]);add(a,BALL,E(ch.c.w),[Math.sin(r)*2.3,3,Math.cos(r)*2.3],[.3,.3,.3])}},
 star:ch=>{const o=grp(ch.b,[0,4,0]),s=add(o,STAR,M('#ffe24a',.3),[12.5,4,0],[1.3,1.3,1.3]);ch.anim.push(t=>{o.rotation.y=t*1.1;s.rotation.y=-t*1.1;s.rotation.z=t*2})},
 ears:ch=>{for(const sx of[-1,1]){const x=sx*3.4,y=topY(ch,x),a=grp(ch.b,[x,y-1.6,0],[0,0,-sx*.55]);add(a,cone(1.7,3.4,4),M(ch.c.b),[0,1.6,0],[1,1,.55],[0,PI/4,0]);add(a,cone(1,2.2,4),M(ch.c.l),[0,1.4,.5],[1,1,.3],[0,PI/4,0])}},
 bulb:ch=>{const a=grp(ch.b,[0,topY(ch,0)-.4,0]);add(a,cyl(1,1.1,1.4),M('#b7bcc4',.35,{metalness:.4}),[0,.7,0]);for(let i=0;i<3;i++)add(a,tor(1.08,.12),M('#9aa0a8',.35,{metalness:.4}),[0,.3+i*.45,0],null,[PI/2,0,0]);
   const b=add(a,BALL,E('#fff4a8'),[0,3,0],[2,2.2,2]);const hl=add(a,BALL,E('#fff4a8',.18),[0,3,0],[3.4,3.6,3.4]);ch.anim.push(t=>hl.scale.setScalar(3.3+.3*Math.sin(t*3)))},
 headset:ch=>{const w=sideX(ch,1,1)+.6,a=grp(ch.b,[0,1,0]),m=M('#3a3f4a',.4);add(a,tor(w,.5,PI),m,[0,0,0]);
   for(const sx of[-1,1]){add(a,cyl(1.8,1.8,1.2,24),m,[sx*w,0,0],null,[0,0,PI/2]);add(a,cyl(1.3,1.3,.4,24),M(ch.c.a),[sx*(w+.7),0,0],null,[0,0,PI/2])}
   add(a,tube([[-w-.3,-1,1],[-w+.5,-4,4],[-w+4,-5.2,7.2]],.2),m);add(a,BALL,M(ch.c.a),[-w+4.3,-5.2,7.4],[.8,.8,.8])},
 bells:ch=>{const y=topY(ch,0),m=M('#d9dde3',.25,{metalness:.5});for(const sx of[-1,1]){const a=grp(ch.b,[sx*3.6,topY(ch,sx*3.6)-.6,0],[0,0,-sx*.5]);add(a,cyl(.25,.25,2),M('#6b4a2a'),[0,1,0]);add(a,HALF,m,[0,3.6,0],[2.2,2.2,2.2],[PI,0,0]);add(a,BALL,m,[0,5.9,0],[.4,.4,.4]);ch.ants.push([a,sx,.5])}
   const h=grp(ch.b,[0,y+.2,0]);add(h,cyl(.18,.18,3),M('#6b4a2a'),[0,1.5,0]);add(h,BALL,M('#ff4d4d'),[0,3.1,0],[.6,.6,.6]);ch.anim.push(t=>h.rotation.z=(t%4<.8)?Math.sin(t*40)*.5:0)}
};

/* ---------- propulsão ---------- */
const PROP={
 twin:ch=>legs(ch,{fire:fcols(ch.c)}),
 legs:ch=>legs(ch,{x:4}),
 feet:ch=>legs(ch,{k:.8,foot:1.35,x:2.8,cfoot:ch.c.a}),
 jet:ch=>{const y=botY(ch,0);add(ch.b,cone(2,2.6,24),M(ch.c.d),[0,y-.6,0],null,[0,0,0]);const f=flame(ch.b,fcols(ch.c),1.1);f.position.set(0,y-1.8,0);ch.flames.push(f)},
 jet3:ch=>{for(let i=0;i<3;i++){const r=i/3*2*PI+PI/2,x=Math.cos(r)*3.4,z=Math.sin(r)*2.6,y=botY(ch,x,z);add(ch.b,cone(1.2,1.8,20),M(ch.c.d),[x,y-.3,z]);const f=flame(ch.b,fcols(ch.c),.6);f.position.set(x,y-1.1,z);ch.flames.push(f)}},
 wings:ch=>{const m=M(ch.c.g,.3,{transparent:true,opacity:.75});for(const sx of[-1,1]){const w=grp(ch.b,[sx*5,1,-5]);add(w,BALL,m,[sx*3,2.4,-.4],[3.2,4.6,.35],[0,0,-sx*.5]);add(w,BALL,m,[sx*2.8,-1.4,-.2],[2.2,2.8,.3],[0,0,sx*.6]);ch.anim.push(t=>w.rotation.y=sx*(.3+Math.sin(t*14)*.35))}},
 hover:ch=>{const y=botY(ch,0),m=E(ch.c.g,.16);add(ch.b,geo('beam',()=>new THREE.CylinderGeometry(3,7,11,32,1,true)),m,[0,y-5.5,0]).renderOrder=2;
   const rs=[0,1,2].map(i=>add(ch.b,tor(4,.18),E(ch.c.a,.6),[0,0,0],null,[PI/2,0,0]));ch.anim.push(t=>rs.forEach((r,i)=>{const u=((t*.6)+i/3)%1;r.position.y=y-1-u*10;r.scale.setScalar(.75+u*.85);r.material.opacity=.6}))},
 legs6:ch=>{const y=botY(ch,0)+1.5;for(const sx of[-1,1])for(const z of[-2.4,0,2.4]){const hp=grp(ch.b,[sx*4.5,y,z],[0,0,sx*.75]);hp.scale.setScalar(.6);
   add(hp,cyl(.5,.5,3.3),M(ch.c.d),[0,-1.6,0]);const kn=grp(hp,[0,-3.2,0],[0,0,-sx*1.05]);add(kn,BALL,M(ch.c.d),[0,0,0],[.6,.6,.6]);add(kn,cyl(.45,.3,3.5),M(ch.c.d),[0,-1.7,0]);add(kn,BALL,M(ch.c.l),[0,-3.5,0],[.6,.5,.6]);
   const ph=z*.8+(sx>0?PI:0);ch.anim.push(t=>{hp.rotation.x=Math.sin(t*6+ph)*.25})}},
 boost:ch=>{for(const sx of[-1,1]){const x=sideX(ch,-3,sx)+sx*.6,g=grp(ch.b,[x,-3.5,-1]);add(g,cyl(1.1,1.1,4.2,20),M(ch.c.l),[0,0,0]);add(g,BALL,M(ch.c.a),[0,2.1,0],[1.1,1.4,1.1]);add(g,cone(1.2,1,20),M(ch.c.d),[0,-2.4,0],null,[PI,0,0]);
   const f=flame(g,fcols(ch.c),.55);f.position.set(0,-2.9,0);ch.flames.push(f)}},
 wheel:ch=>{const y=botY(ch,0),m=M(ch.c.d);add(ch.b,cyl(.55,.55,3.4),m,[0,y-1.5,0]);const w=grp(ch.b,[0,y-5.2,0]);for(const sx of[-1,1])add(ch.b,rbox(.5,3,.8),m,[sx*1.5,y-4,0]);
   add(w,tor(2.3,.9),M('#26212a',.7),[0,0,0],null,[0,PI/2,0]);add(w,cyl(1.2,1.2,1.6,20),M(ch.c.l),[0,0,0],null,[0,0,PI/2]);ch.anim.push(t=>w.rotation.x=-t*5)},
 cloud:ch=>{const y=botY(ch,0)-1.2,m=M('#ffffff',.9);[[-5,0,0,3.2],[0,.6,.5,4],[5,0,0,3.2],[-2.5,-.6,2.4,2.8],[2.6,-.5,2.3,2.8],[0,-.2,-2.5,3.2]].forEach(([x,yy,z,r])=>add(ch.b,BALL,m,[x,y+yy,z],[r,r*.8,r]))},
 tent:ch=>{const y=botY(ch,0)+.8;for(let i=0;i<5;i++){const r=i/5*2*PI+PI/2,x=Math.cos(r)*5.5,z=Math.sin(r)*4;let p=grp(ch.b,[x,y,z]);const segs=[];
   for(let k=0;k<5;k++){const rr=1.1-k*.17;add(p,BALL,M(ch.c.b),[0,0,0],[rr,rr*1.2,rr]);segs.push(p);p=grp(p,[0,-1.5+k*.1,0])}add(p,BALL,M(ch.c.l),[0,.4,0],[.35,.35,.35]);
   ch.anim.push(t=>segs.forEach((s,k)=>{s.rotation.z=Math.sin(t*2.6+i*1.3-k*.7)*.28*Math.cos(r);s.rotation.x=Math.sin(t*2.6+i*1.3-k*.7)*.28*Math.sin(r)+.08}))}},
 spring:ch=>{const y=botY(ch,0)+.6,sp=add(ch.g,helix(1.6,6,6,.3),M('#b7bcc4',.3,{metalness:.5}),[0,y-6,0]);add(ch.g,cyl(2.6,2.8,.8,24),M(ch.c.d),[0,y-6.3,0]);ch.spring={sp}},
 fan:ch=>{const y=botY(ch,0);add(ch.b,cyl(.35,.35,2.4),M(ch.c.d),[0,y-1,0]);const b=grp(ch.b,[0,y-2.4,0]);add(b,BALL,M(ch.c.d),[0,0,0],[.7,.5,.7]);
   for(let i=0;i<3;i++){const r=i/3*2*PI;add(b,rbox(4,.25,1.3,3),M(ch.c.a),[Math.cos(r)*2.2,0,Math.sin(r)*2.2],null,[0,-r,.2])}ch.anim.push(t=>b.rotation.y=t*14)},
 puff:ch=>{const y=botY(ch,0);const ps=[0,1,2].map(i=>add(ch.b,BALL,new THREE.MeshStandardMaterial({color:C('#ffffff'),roughness:.9,transparent:true}),[(i-1)*3,y,0]));
   ch.anim.push(t=>ps.forEach((p,i)=>{const u=(t*.7+i/3)%1;p.position.y=y-1-u*6;p.scale.setScalar(1.2+u*1.6);p.material.opacity=.8*(1-u)}))},
 tread:ch=>{const y=botY(ch,0)-1.6,m=M('#2b2622',.7);add(ch.b,rbox(17,4,8,4),m,[0,y,0]);const ws=[];
   for(let i=0;i<4;i++){const w=add(ch.b,cyl(1.3,1.3,8.4,16),M('#6b5a4a',.5),[-5.4+i*3.6,y,0],null,[PI/2,0,0]);ws.push(w);add(w,rbox(.5,.5,.5),M(ch.c.l),[.7,4.25,0])}
   add(ch.b,cyl(.6,.6,1.2),M(ch.c.d),[0,y+2.2,0]);ch.anim.push(t=>ws.forEach(w=>w.rotation.y=t*3))}
};

/* ---------- detalhes ---------- */
const DET={
 grid:(ch,F)=>{const g=surf(ch,0,F.my-2.6,.05);for(let r=0;r<2;r++)for(let k=0;k<4;k++)add(g,BALL,M(ch.c.d),[-1.8+k*1.2,-r*1.1,0],[.35,.35,.2])},
 cheeks:(ch,F)=>{for(const sx of[-1,1])add(surf(ch,sx*F.ex*1.45,F.ey-2.2,.02),BALL,M(ch.c.a,.6,{transparent:true,opacity:.55}),[0,0,0],[1.1,.7,.15])},
 belly:()=>{},stripe:()=>{},spots:()=>{},screen:()=>{},
 led:(ch,F)=>{const g=surf(ch,F.ex*1.7,F.my-1.2,.1);const l=add(g,BALL,E(ch.c.a),[0,0,0],[.6,.6,.3]);ch.anim.push(t=>l.visible=(t%1.4)<1)},
 lights:ch=>{const ls=[];for(let i=0;i<10;i++){const r=i/10*2*PI;ls.push(add(ch.b,BALL,E(i%2?ch.c.a:ch.c.g),[Math.cos(r)*13.9,-3,Math.sin(r)*13.9],[.55,.55,.55]))}ch.anim.push(t=>ls.forEach((l,i)=>l.visible=((Math.floor(t*4)+i)%2)==0))},
 keyhole:(ch,F)=>{const g=surf(ch,0,F.my-3.4,.05);add(g,cyl(1.5,1.5,.35,28),M('#ffd26a',.3,{metalness:.35}),[0,0,0],null,[PI/2,0,0]);add(g,cyl(.45,.45,.3,16),mK,[0,.3,.2],null,[PI/2,0,0]);add(g,rbox(.5,1.1,.3),mK,[0,-.45,.2])},
 scarf:ch=>{const y=-1.8,w=sideX(ch,y,1)+.3;add(ch.b,tor(1,.1),M(ch.c.a,.7),[0,y,0],[w,w*1.0,1],[PI/2,0,0]).scale.set(w,(w*.97),9);const t=grp(ch.b,[2.5,y-.6,6.6],[0,0,.25]);add(t,rbox(1.9,5,.7,3),M(ch.c.a,.7),[0,-2.2,0]);for(let i=0;i<3;i++)add(t,rbox(.35,.8,.4),M(ch.c.a2),[-.6+i*.6,-4.8,0]);ch.anim.push(tt=>t.rotation.z=.25+Math.sin(tt*2)*.08)},
 bowtie:(ch,F)=>{const g=surf(ch,0,F.my-2.6,.4);for(const sx of[-1,1])add(g,cone(1.2,2.2,4),M(ch.c.a),[sx*1.1,0,0],[1,1,.5],[0,0,sx*PI/2]);add(g,BALL,M(ch.c.a2),[0,0,.2],[.55,.55,.4])},
 number:(ch,F)=>{const g=surf(ch,0,F.my-2.9,.15),m=M(ch.c.a,.3,{metalness:.25});add(g,rbox(.9,3,.6,5),m,[0,0,0]);add(g,rbox(.8,1.3,.6,5),m,[-.55,1.05,0],null,[0,0,-.9]);add(g,rbox(2.2,.7,.6,5),m,[0,-1.4,0])},
 ring:ch=>{const r=grp(ch.b,[0,-.5,0],[1.25,0,.28]);add(r,tor(13.5,.55),M(ch.c.a,.35));add(r,tor(11.8,.3),M(ch.c.l,.35));ch.anim.push(t=>r.rotation.z=.28+Math.sin(t*.9)*.06)},
 badge:(ch,F)=>{const g=surf(ch,-2.8,F.my-2.6,.15);for(const sx of[-1,1])add(g,rbox(.8,2.2,.2),M(ch.c.a2),[sx*.5,-1.6,-.1],null,[0,0,sx*.25]);add(g,cyl(1.5,1.5,.4,24),M(ch.c.a),[0,0,0],null,[PI/2,0,0]);add(g,STAR,E('#ffffff'),[0,0,.3],[.8,.8,.5])},
 heart:(ch,F)=>{const g=surf(ch,0,F.my-3,.3),h=add(g,HEART,M(ch.c.a,.35),[0,0,0],[1.3,1.3,1]);ch.anim.push(t=>{const p=t%1.1,b=p<.3?Math.sin(p/.3*PI)*.25:0;h.scale.setScalar(1.25+b)})},
 bolts:(ch,F)=>{for(const[x,y]of[[-5.2,5.2],[5.2,5.2],[-5.2,-5.8],[5.2,-5.8]]){const g=surf(ch,x,y,.1);add(g,cyl(.6,.6,.4,6),M(ch.c.l,.35,{metalness:.3}),[0,0,0],null,[PI/2,0,0]);add(g,rbox(.9,.2,.2),M(ch.c.d),[0,0,.25])}}
};

/* ---------- ferramentas (seguradas na mão direita, apontando para cima) ---------- */
const MET=M('#c8ccd2',.3,{metalness:.5});
const TOOL={
 ruler:(g,c)=>{add(g,rbox(1.5,7.5,.35,6),M('#ffd84a',.4),[0,2.6,0]);for(let i=0;i<9;i++)add(g,rbox(i%2?.4:.7,.12,.2),M('#3a2a18'),[-.55+(i%2?.15:.3),-.6+i*.8,.2])},
 wand:(g,c)=>{add(g,cyl(.18,.18,5.2),M('#3a2a4a'),[0,2.4,0]);const s=add(g,STAR,M(c.a,.35),[0,5.4,0],[1.1,1.1,1]);g.userData.fx=t=>s.rotation.z=t*2},
 solder:(g,c)=>{add(g,cyl(.5,.45,2.8),M(c.a),[0,.8,0]);add(g,cyl(.15,.15,2.8),MET,[0,3.6,0]);add(g,cone(.18,.7),E('#ff7a2a'),[0,5.3,0]);add(g,BALL,E('#ffb070',.5),[0,5.6,0],[.45,.45,.45])},
 brush:(g,c)=>{add(g,cyl(.24,.3,4.2),M('#b57a3c'),[0,1.6,0]);add(g,cyl(.38,.3,1),MET,[0,4.1,0]);add(g,cone(.4,1.6),M(c.a),[0,5.4,0])},
 lupa:(g,c)=>{add(g,rbox(.6,3,.6),M('#3a3a44'),[0,.8,0]);const r=grp(g,[0,4.3,0]);add(r,tor(1.6,.3),M('#3a3a44',.35));add(r,new THREE.CircleGeometry(1.6,28),E('#bfefff',.35))},
 check:(g,c)=>{add(g,cyl(.2,.2,4),M(c.a),[0,1.8,0]);const k=grp(g,[0,5,0]);add(k,rbox(1.1,.5,.4),E('#6dff8a'),[-.4,-.2,0],null,[0,0,-.8]);add(k,rbox(2.2,.5,.4),E('#6dff8a'),[.45,.2,0],null,[0,0,.9])},
 key:(g,c)=>{const m=M('#ffd26a',.3,{metalness:.35});add(g,tor(1,.32),m,[0,.4,0]);add(g,cyl(.25,.25,4.2),m,[0,3.3,0]);add(g,rbox(1,.4,.3),m,[.5,4.6,0]);add(g,rbox(.8,.4,.3),m,[.4,3.8,0])},
 chart:(g,c)=>{add(g,cyl(.18,.18,2.4),M('#3a3a44'),[0,.8,0]);add(g,rbox(4.6,3.6,.3,6),M('#ffffff',.4),[0,3.6,0]);[[c.a,1.4],[c.b,2.3],[c.a2,1]].forEach(([col,h],i)=>add(g,rbox(.8,h,.3),M(col),[-1.2+i*1.2,2.1+h/2,.2]))},
 pena:(g,c)=>{add(g,cone(.25,1),mK,[0,-.2,0],null,[PI,0,0]);add(g,cyl(.08,.1,6),M('#d8cbb0'),[0,2.6,0]);add(g,BALL,M('#fffaf0',.6),[.35,3.4,0],[1.1,3,.18],[0,0,-.12])},
 book:(g,c)=>{const b=grp(g,[0,2.2,0],[0,-.4,0]);add(b,rbox(3.6,4.6,1.2,6),M(c.a),[0,0,0]);add(b,rbox(3.3,4.2,.9,6),M('#fffaf0'),[.2,0,.08]);add(b,rbox(.3,4.7,1.3,6),M(c.a2),[-1.7,0,0])},
 cursor:(g,c)=>{const s=new THREE.Shape();[[0,0],[0,-4],[1,-3],[1.8,-4.8],[2.5,-4.4],[1.7,-2.7],[3,-2.6]].forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();
   const k=grp(g,[0,4.2,0]);add(k,geo('cur',()=>extr(s,.4,.12)),M('#ffffff',.35),[0,0,.1]);add(k,geo('cur',()=>extr(s,.4,.12)),mK,[0,0,-.15],[1.18,1.12,1])},
 rocket:(g,c)=>{const r=grp(g,[0,3,0]);add(r,cyl(.8,.8,3,20),M('#ffffff',.35));add(r,cone(.8,1.4),M(c.a),[0,2.2,0]);add(r,BALL,E(c.a),[0,.4,.7],[.35,.35,.2]);
   for(let i=0;i<3;i++){const a=i/3*2*PI;add(r,rbox(.2,1.2,1),M(c.a2),[Math.sin(a)*.9,-1.2,Math.cos(a)*.9],null,[0,a,0])}const f=flame(r,fcols(c),.3);f.position.y=-1.6},
 stamp:(g,c)=>{add(g,BALL,M(c.a2),[0,4.6,0],[.9,.9,.9]);add(g,cyl(.35,.45,2.2),M(c.a2),[0,3.2,0]);add(g,rbox(3,1.2,2,5),M(c.a),[0,1.8,0]);add(g,rbox(2.8,.3,1.8),M('#e03050'),[0,1.1,0])},
 spray:(g,c)=>{add(g,cyl(1,1,3.4,20),M(c.a),[0,2,0]);add(g,cyl(.7,.9,.6,20),MET,[0,4,0]);add(g,rbox(.5,.6,.9),M('#ffffff'),[0,4.6,.2]);
   const p=[0,1,2,3].map(i=>add(g,BALL,new THREE.MeshBasicMaterial({color:C(c.b),transparent:true,depthWrite:false}),[0,4.6,.8],[.25,.25,.25]));g.userData.fx=t=>p.forEach((m,i)=>{const u=(t*1.5+i/4)%1;m.position.set(Math.sin(i*2.3)*u*.8,4.7+u*.6,.8+u*3);m.scale.setScalar(.2+u*.5);m.material.opacity=.6*(1-u)})},
 buoy:(g,c)=>{const b=grp(g,[0,2.4,0]);for(let i=0;i<4;i++)add(b,tor(1.9,.65,PI/2),M(i%2?'#ffffff':c.a,.45),[0,0,0],null,[0,0,i*PI/2])},
 wrench:(g,c)=>{add(g,rbox(.8,5,.4,5),MET,[0,2,0]);add(g,tor(1,.42,PI*1.45),MET,[0,5,0],null,[0,0,-PI*.22])},
 pen:(g,c)=>{add(g,cyl(.35,.35,4.4),M('#2a2230'),[0,2,0]);add(g,cone(.35,.9),E(c.a),[0,4.6,0]);add(g,BALL,E(c.a,.45),[0,5.1,0],[.5,.5,.5])}
};

/* ---------- o elenco ---------- */
const HC={b:'#ff5a0f',l:'#ffb27a',d:'#b8420c',s:'#8a300a',g:'#ffe6d2',w:'#fff4ea',a:'#ff5a0f',a2:'#b8420c'};
const CAST=[
 {id:'hipercode',nome:'Hipercode',papel:'IA autônoma, líder do enxame',txt:'Corpo laranja, duas antenas e foguete nos pés.',shape:'hc',top:'stems',eyes:'hc',prop:'twin',mouth:'smile',c:HC,fire:['#ff5a0f','#ffb27a','#ffe6d2']},
 {id:'next',nome:'Next',papel:'Guia da Tirvo',txt:'Robô branco e laranja, cabeça grande e a mira da Tirvo no peito.',custom:'next'},
 {id:'pixel',nome:'Pixel',papel:'Estrutura e layout',txt:'Caixa ciano, visor com scanner, antena laranja e régua.',shape:'box',top:'one',eyes:'visor',prop:'twin',detail:'grid',mouth:'line',tool:'ruler',
  c:{b:'#22c3e6',l:'#8be8f7',d:'#0e7894',s:'#0a5468',g:'#b8f4ff',w:'#effdff',a:'#ff5a0f',a2:'#b8420c'}},
 {id:'loop',nome:'Loop',papel:'Lógica e interações',txt:'Bola violeta, três olhos, chifres rosa, jato único e varinha.',shape:'circle',top:'horns',eyes:'three',prop:'jet',detail:'cheeks',mouth:'smile',tool:'wand',
  c:{b:'#9b5cff',l:'#c9a6ff',d:'#5a2cb0',s:'#3d1d7a',g:'#e3d1ff',w:'#f7f1ff',a:'#ff4fa3',a2:'#b02a6c'}},
 {id:'nano',nome:'Nano',papel:'Detalhes e acabamento',txt:'Gota verde, olhos grandes, asinhas e ferro de solda.',shape:'drop',top:'spark',eyes:'big',prop:'wings',detail:'belly',mouth:'o',tool:'solder',
  c:{b:'#4fd13a',l:'#a4ef95',d:'#2a8420',s:'#1c5c15',g:'#d8ffcc',w:'#f3fff0',a:'#ffb000',a2:'#b07900'}},
 {id:'bit',nome:'Bit',papel:'Imagens e mídia',txt:'Cápsula amarela, hélice no topo, LED azul e pincel.',shape:'capsule',top:'rotor',eyes:'two',prop:'legs',detail:'led',mouth:'teeth',tool:'brush',
  c:{b:'#ffc21a',l:'#ffe27e',d:'#b07900',s:'#6e4c00',g:'#fff1b8',w:'#fffbea',a:'#22c3e6',a2:'#0e7894'}},
 {id:'debug',nome:'Debug',papel:'Testes',txt:'Hexágono lima, antena de mola, olhar desconfiado e seis patinhas.',shape:'hex',top:'coil',eyes:'squint',prop:'legs6',detail:'stripe',mouth:'zig',tool:'check',
  c:{b:'#a8e61e',l:'#d6f77f',d:'#6a9a0c',s:'#466a05',g:'#ecffc0',w:'#fbfff0',a:'#3f6dff',a2:'#1f3fa8'}},
 {id:'cifra',nome:'Cifra',papel:'Segurança',txt:'Escudo de aço, penacho vermelho, óculos escuros e chave.',shape:'shield',top:'fin',eyes:'shades',prop:'boost',detail:'keyhole',mouth:'dot',tool:'key',
  c:{b:'#8e9aab',l:'#c8d1dd',d:'#5b6576',s:'#3c4452',g:'#dfe6ef',w:'#f4f7fb',a:'#ff3d3d',a2:'#a51e1e'}},
 {id:'query',nome:'Query',papel:'Dados',txt:'Televisão azul, antena de coelho, rosto na tela e monociclo.',shape:'tv',top:'rabbit',eyes:'screen',prop:'wheel',detail:'screen',mouth:'screen',tool:'chart',
  c:{b:'#3f6dff',l:'#93adff',d:'#2544b8',s:'#172d80',g:'#c9d6ff',w:'#f0f4ff',a:'#3ee8b5',a2:'#1a9c76'}},
 {id:'prosa',nome:'Prosa',papel:'Textos',txt:'Corpo alto cor de areia, cartola, óculos, bigode e pena.',shape:'tall',top:'hat',eyes:'glasses',prop:'cloud',detail:'scarf',mouth:'stache',tool:'pena',
  c:{b:'#e8cf95',l:'#f7e8c4',d:'#b39455',s:'#7d6433',g:'#fbf2dc',w:'#fffaf0',a:'#d43b3b',a2:'#8f2020'}},
 {id:'babel',nome:'Babel',papel:'Tradução',txt:'Cúpula turquesa, tentáculos, balão de fala, gravata-borboleta e livro.',shape:'dome',top:'bubble',eyes:'anime',prop:'tent',detail:'bowtie',mouth:'cat',tool:'book',
  c:{b:'#16a89a',l:'#6fd9ce',d:'#0b6f66',s:'#064a44',g:'#b9efe9',w:'#eefffd',a:'#ffc21a',a2:'#b07900'}},
 {id:'orbita',nome:'Órbita',papel:'Deploy',txt:'Ovo lavanda, anel de planeta, estrela, óculos de piloto e foguetinho.',shape:'egg',top:'star',eyes:'goggles',prop:'jet3',detail:'ring',mouth:'tongue',tool:'rocket',
  c:{b:'#b9a8ff',l:'#ddd3ff',d:'#7a66d6',s:'#5140a3',g:'#ece7ff',w:'#faf8ff',a:'#7ee0ff',a2:'#2f9bc4'}},
 {id:'crivo',nome:'Crivo',papel:'Revisão',txt:'Losango rosa, orelhas de gato, monóculo, selo e carimbo.',shape:'diamond',top:'ears',eyes:'monocle',prop:'fan',detail:'badge',mouth:'slant',tool:'stamp',
  c:{b:'#ff9cc8',l:'#ffcde3',d:'#d0588f',s:'#933a63',g:'#ffe6f1',w:'#fff6fa',a:'#3f6dff',a2:'#2544b8'}},
 {id:'neon',nome:'Neon',papel:'Design de interface',txt:'Cogumelo magenta, pintas, lâmpada acesa, olhos de estrela e spray.',shape:'mush',top:'bulb',eyes:'stars',prop:'feet',detail:'spots',mouth:'fang',tool:'spray',
  c:{b:'#e44be0',l:'#f29ef0',d:'#9e2a9b',s:'#6b1a69',g:'#fbd4fa',w:'#fff2fe',a:'#b4ec1e',a2:'#6a9a0c'}},
 {id:'eco',nome:'Eco',papel:'Suporte',txt:'Nuvem branca, fone com microfone, coração que pulsa e boia.',shape:'cloud',top:'headset',eyes:'wide',prop:'puff',detail:'heart',mouth:'talk',tool:'buoy',
  c:{b:'#e6eef8',l:'#ffffff',d:'#aebdd0',s:'#7d8ea6',g:'#ffffff',w:'#ffffff',a:'#ff5a8a',a2:'#b8325e'}},
 {id:'cron',nome:'Cron',papel:'Automação',txt:'Engrenagem bronze, sinos de despertador, olhos de LED, esteira e chave inglesa.',shape:'gear',top:'bells',eyes:'leds',prop:'tread',detail:'bolts',mouth:'grille',tool:'wrench',
  c:{b:'#c9803f',l:'#e8b37e',d:'#8a5222',s:'#5e3614',g:'#f5d9bc',w:'#fff5ea',a:'#ff4d4d',a2:'#a51e1e'}}
];

function newCh(d){const g=new THREE.Group(),b=new THREE.Group();g.add(b);scn.add(g);return{d,c:d.c,g,b,face:[],body:[],eyes:[],arms:[],legs:[],ants:[],flames:[],anim:[],mouth:null,tool:null}}
function bodyPart(ch,gm,p=[0,0,0],face=true){const m=add(ch.b,gm,VC,p);ch.body.push(m);if(face)ch.face.push(m);return m}
function paintFor(d){const c=d.c;
  if(d.detail==='belly')return p=>(p.z>0&&(p.x/5.2)**2+((p.y+4.2)/3.6)**2<1)?c.l:c.b;
  if(d.detail==='stripe')return p=>(p.y<-3.2&&p.y>-4.6)||(p.y<-5.9&&p.y>-7.2)?c.d:c.b;
  return()=>c.b}
// a caneta de luz do Hipercode e do Next só aparece quando eles trabalham
const TIP={ruler:6.3,wand:5.4,solder:5.6,brush:6.2,lupa:4.3,check:5.2,key:4.8,chart:5.4,pena:6.4,book:4.6,cursor:4.2,rocket:5.2,stamp:1.1,spray:4.8,buoy:2.4,wrench:5.6,pen:5.2};
function addTool(ch,tl){const k=tl||'pen',t=grp(ch.arms[0].h,[-1.1,0,.5],[0,0,.85]);t.scale.setScalar(.95);TOOL[k](t,ch.c);ch.tool=t;ch.penOnly=!tl;
  const tip=new THREE.Object3D();tip.position.y=TIP[k];t.add(tip);ch.tip=tip}
function build(d){const ch=newCh(d),c=d.c;let F;
  if(d.shape==='disc'){bodyPart(ch,deform(v=>{se(v,2.2);return v.set(v.x*14,v.y*2.6,v.z*14)},()=>c.b),[0,-3,0],false);
    bodyPart(ch,deform(v=>{se(v,2);if(v.y<0)v.y*=.3;return v.multiplyScalar(8)},v=>v.y>6.8?c.l:c.b),[0,-2.5,0]);F={ey:3.3,ex:0,my:.6};ch.ay=1.2}
  else if(d.shape==='mush'){bodyPart(ch,deform(v=>{se(v,2.4);return v.set(v.x*6.8,v.y*7.6,v.z*6.4)},()=>c.w),[0,-3.4,0]);
    const sp=[[0,1,.5],[.8,.35,.5],[-.8,.35,.5],[.45,.5,-.75],[-.5,.45,-.7],[0,.3,.95],[.95,.2,-.2],[-.95,.25,-.1]].map(a=>V(...a).normalize());
    bodyPart(ch,deform(v=>{se(v,2.2);if(v.y<0)v.y*=.28;return v.set(v.x*13.5,v.y*7.5,v.z*12.5)},p=>{const n=V(p.x/13.5,p.y/7.5,p.z/12.5).normalize();return sp.some(s=>n.dot(s)>.95)?'#ffffff':c.b}),[0,3.2,0],false);
    F={ey:-1.8,ex:2.7,my:-5,s:.8};ch.ay=-4.4;ch.armK=.8}
  else if(d.shape==='cloud'){[[-5.6,-1.5,0,5.6],[0,2,0,7.2],[5.6,-1.5,0,5.6],[0,-1.8,2.2,6.8],[-3,-3.4,-1,5],[3,-3.4,-1,5]].forEach(([x,y,z,r],i)=>{bodyPart(ch,geo('cl'+r,()=>deform(v=>v.multiplyScalar(r),null,48,32)),[x,y,z],i===3||i===1);ch.body[ch.body.length-1].material=M(c.b,.6)});
    F={ey:1,ex:3.3,my:-2.6};ch.ay=-1.5}
  else{const B=BODY[d.shape];bodyPart(ch,deform(B.f,paintFor(d)));F=Object.assign({s:1},B.F);ch.ay=B.ay}
  F.s=F.s||1;ch.b.updateMatrixWorld(true);
  if(d.detail==='screen'){const g=surf(ch,0,0,.05,.9);add(g,rbox(18.5,14,1.2,5),M('#0d1630',.2));add(g,rbox(17,.3,.2),E(c.g,.18),[0,5.6,.62])}
  EYES[d.eyes](ch,F);
  const mg=surf(ch,0,F.my,d.mouth==='screen'?.05:-.1);ch.mouth=grp(mg);ch.mouth.scale.setScalar(F.s);MOUTH[d.mouth](ch.mouth,1,c);
  TOP[d.top](ch);if(d.detail)DET[d.detail](ch,F);
  arms(ch,ch.ay,ch.armK||(d.shape==='tri'||d.shape==='diamond'?.85:1));
  if(d.prop==='twin'&&d.fire)legs(ch,{fire:d.fire});else PROP[d.prop](ch);
  addTool(ch,d.tool);
  return ch}

/* ---------- Next: cabeça grande separada do corpo, como no site ---------- */
function buildNext(d){const W='#f6f3f0',O='#ff5500',K='#221c2b';d.c={b:W,l:'#ffffff',d:'#2d2537',s:'#d9d2cc',g:'#ffd0b8',w:'#ffffff',a:O,a2:'#cc3a00'};const ch=newCh(d),c=d.c;
  const head=grp(ch.b,[0,7,0]);ch.head=head;
  const hm=add(head,deform(v=>{se(v,2.15);return v.set(v.x*12.6,v.y*10,v.z*10.4)},p=>p.y>3.8?O:W),VC);ch.face.push(hm);ch.body.push(hm);
  add(ch.b,cyl(2.4,2.4,3,20),M('#2d2537'),[0,-3,0]);
  const bm=bodyPart(ch,deform(v=>{se(v,2.1);if(v.y<0)v.y*=1.05;return v.set(v.x*7.8,v.y*7.4,v.z*6.8)},p=>(p.y<-1.4&&p.y>-3.9)?O:W),[0,-10.3,0],false);
  ch.b.updateMatrixWorld(true);
  // olhos: aro escuro, íris laranja, pupila e brilho
  const eyeN=x=>{const e=eye(ch,x,3.9,-.3);add(e,BALL,M(K,.3),[0,0,0],[3.7,3.7,1]);add(e,BALL,M(O,.35),[0,-.3,.6],[2.8,2.8,.55]);add(e,BALL,mK,[0,-.4,.95],[1.25,1.25,.3]);glint(e,-1,1,1.15,.6);glint(e,1,-1.1,1.1,.26);
    add(e,tor(3.1,.55,PI*.8),M(K,.3),[0,.2,.8],null,[0,0,PI*.1])};eyeN(-4.9);eyeN(4.9);
  for(const sx of[-1,1])add(surf(ch,sx*8.4,.6,.02),BALL,M(O,.6,{transparent:true,opacity:.6}),[0,0,0],[1.5,.8,.15]);
  const mg=surf(ch,0,-.2,-.1);ch.mouth=grp(mg);add(ch.mouth,HALF,M(K,.3),[0,.9,0],[2.4,2,.35]);add(ch.mouth,BALL,M(O),[0,-.4,.15],[1.2,.65,.25]);
  // tampa laranja com placa branca, orelhas e antena com bolinha
  add(surf(ch,0,13.4,.15,.5),rbox(4,1.8,.6,5),M('#ffffff',.35));
  for(const sx of[-1,1]){const e=grp(head,[sx*12.4,0,0],[0,0,sx*PI/2]);add(e,cyl(2.6,2.8,1.4,28),M(O),[0,0,0]);add(e,cyl(1.3,1.3,.3,20),M(K),[0,-.75*sx,0]);add(e,cyl(.7,.7,.4,16),M('#ffffff'),[0,-.85*sx,.1])}
  const an=grp(head,[0,9.6,0]);add(an,cyl(.8,1,.6),M(K),[0,.3,0]);add(an,cyl(.18,.22,3),M(K),[0,1.8,0]);add(an,BALL,M(O),[0,3.6,0],[1.1,1.1,1.1]);ch.ants.push([an,0,0]);
  // mira da Tirvo no peito
  const face0=ch.face;ch.face=[bm];const r=surf(ch,0,-7.8,.08);ch.face=face0;const m=M(K,.35);
  for(const[sx,sy]of[[-1,1],[1,1],[-1,-1],[1,-1]]){add(r,rbox(1.4,.45,.3),m,[sx*1.4,sy*1.8,0]);add(r,rbox(.45,1.4,.3),m,[sx*1.85,sy*1.35,0])}
  add(r,BALL,E(O),[0,0,.1],[.9,.9,.4]);add(r,BALL,mW,[-.3,.3,.35],[.25,.25,.2]);
  // braços: ombro laranja, antebraço e mão brancos
  const bodyOnly=ch.body;ch.body=[bm];arms(ch,-6.8,.85,O,W,W,.3);addTool(ch,null);
  legs(ch,{x:2.6,k:.75,cu:O,cfoot:W,foot:1.25,sole:O});ch.body=bodyOnly;return ch}

const USE=['hipercode',...SQ],chars=CAST.filter(d=>USE.includes(d.id)).map(d=>d.custom?buildNext(d):build(d));

/* ---------- sombra no chão ---------- */
const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gr=gx.createRadialGradient(32,32,0,32,32,32);
gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');gx.fillStyle=gr;gx.fillRect(0,0,64,64);
const shTex=new THREE.CanvasTexture(gc);
chars.forEach((ch,i)=>{ch.g.updateMatrixWorld(true);const bx=new THREE.Box3().setFromObject(ch.g);ch.box=bx;
  ch.floor=bx.min.y-1.5;const s=add(ch.g,new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false,opacity:.6}),[0,ch.floor,0],[22,22,1],[-PI/2,0,0]);ch.shadow=s;
  ch.ph=i*1.37;ch.yaw=0;ch.vy=0;ch.fly=!ch.legs.length||ch.d.prop==='twin'});

/* ---------- poses: idle, make (escrevendo), dash (voando para um lado), dance (parado, dançando) ---------- */
chars.forEach(ch=>{ch.g.rotation.order='YXZ';ch.cy=(ch.box.max.y+ch.floor)/2;ch.shadow.visible=false});
function apply(ch,t,mode,o){const tt=t+ch.ph,fast=mode==='dash',work=mode==='make',dance=mode==='dance';
  ch.b.position.y=Math.sin(tt*2.4)*(ch.fly?.8:.35);
  ch.ants.forEach(([a,sx,base])=>a.rotation.z=-sx*base+Math.sin(tt*5+sx)*.09+(fast?.35:0));
  const bl=!fast&&(tt%3.9)<.13;ch.eyes.forEach(e=>e.scale.y=bl?.12:1);
  if(ch.mouth){const g=Math.max(grinT(tt),work?.35:0,fast||dance?.6:0),b=Math.sin(tt*2.2)*.04,k=ch.mouth.userData.k||(ch.mouth.userData.k=ch.mouth.scale.x);ch.mouth.scale.set(k*(1+b+.2*g),k*(1+.4*g),k)}
  const sw=Math.sin(tt*1.7)*.06,wv=Math.sin(tt*9)*.45;
  ch.tool.visible=!ch.penOnly||work;ch.tool.rotation.z=.85;ch.g.rotation.set(.06,0,0);
  if(work){setArm(ch,0,-.6,.25,.55);ch.tool.rotation.z=PI/2+.3+Math.sin(tt*11)*.12;setArm(ch,1,-.45+Math.sin(tt*20)*.35,.95);ch.g.rotation.set(.1,-.3,0)}
  else if(fast){setArm(ch,0,-1.25,.25,-.6);setArm(ch,1,-1.25,.25,-.6);ch.g.rotation.set(.38,1.25*(o.dir||1),0)}
  else if(dance){const d=o.d||0,k=o.k||0,bt=d*PI*2.2;
    if(k===0){const hop=Math.abs(Math.sin(bt));ch.b.position.y+=hop*3;const up=hop>.5?1.2:-.2;setArm(ch,0,up,.5);setArm(ch,1,up,.5)}
    else if(k===1){const s=Math.sin(bt);ch.g.rotation.set(.06,s*.5,s*.12);setArm(ch,0,s>0?1.2:-.8,.6);setArm(ch,1,s>0?-.8:1.2,.6)}
    else if(k===2){setArm(ch,0,1.3,.6+Math.sin(tt*9)*.4);setArm(ch,1,1.3,.6+Math.sin(tt*9+PI)*.4);ch.b.position.y+=Math.abs(Math.sin(bt))*1.2}
    else{ch.g.rotation.set(.06,Math.sin(d*5)*.35,0);setArm(ch,0,.15,.1);setArm(ch,1,.15,.1);ch.b.position.y+=1.5}}
  else if(ch.penOnly){setArm(ch,0,-1+sw,.7);setArm(ch,1,-1-sw,.7)}
  else{setArm(ch,1,-1-sw,.7);setArm(ch,0,-.45+sw*.6,1.3+Math.sin(tt*3)*.12,.5);ch.tool.rotation.z=.85-Math.sin(tt*3)*.1}
  if(ch.tool.visible&&ch.tool.userData.fx)ch.tool.userData.fx(tt);
  ch.legs.forEach((L,i)=>fast?setLeg(ch,i,.75,.9):setLeg(ch,i,.08+(i?-sw:sw),.22));
  ch.flames.forEach((f,i)=>f.scale.y=f.scale.x*(fast?1.5:1)*(.82+.2*Math.sin(t*23+i*2)+.1*Math.sin(t*41+i)));
  ch.anim.forEach(f=>f(tt))}
function only(ch){chars.forEach(o=>o.g.visible=o===ch)}
const SPR=Math.round(128*DPR),camS=new THREE.PerspectiveCamera(30,1,1,600),tv=V();R1.setPixelRatio(1);R1.setSize(SPR,SPR,false);
camS.position.set(0,4,100);camS.lookAt(0,0,0);camS.updateProjectionMatrix();camS.updateMatrixWorld(true);
const byId={};chars.forEach(c=>byId[c.d.id]=c);
const nrm=v=>[(v.x+1)/2,(1-v.y)/2];
// devolve o quadro, a ponta da ferramenta e o centro do corpo, em fração do quadro
function sprite(id,t,mode,o={}){const ch=byId[id];only(ch);ch.g.position.set(0,-ch.cy,0);apply(ch,t,mode,o);ch.g.updateMatrixWorld(true);
  const tip=nrm(ch.tip.getWorldPosition(tv).project(camS)),body=nrm(ch.b.getWorldPosition(tv).project(camS));R1.render(scn,camS);return {cv:R1.domElement,tip,body}}
return {sprite,has:id=>!!byId[id],col:id=>byId[id]&&byId[id].d.c?byId[id].d.c.b:null};
})();
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const root=document.documentElement;
if(RM||!('IntersectionObserver' in window)){root.classList.remove('hb');return}
const TAU=Math.PI*2,N=48;
const O='#ff5a0f',H='#ffb27a',K='#0c0b0d',M='#b8420c',W='#ffe6d2',L='#ff8a45',D='#6e2606',G2='#3d1604';
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const cl=v=>Math.max(0,Math.min(1,v)),sm=v=>{v=cl(v);return v*v*(3-2*v)},mix=(a,b,u)=>a+(b-a)*u;
function bg(c,S){
  const g=c.createRadialGradient(S/2,S*.46,0,S/2,S*.46,S*.64);
  g.addColorStop(0,'#151012');g.addColorStop(1,'#08080a');
  c.fillStyle=g;c.fillRect(0,0,S,S);
  c.fillStyle='rgba(255,255,255,.035)';
  const st=S/20;for(let y=st/2;y<S;y+=st)for(let x=st/2;x<S;x+=st)c.fillRect(x,y,1,1);
}
// corpo oficial: oval 21 x 17, centro 24, 28.5
const BM=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=N;const g=cv.getContext('2d');g.fillStyle='#fff';
  g.beginPath();g.ellipse(24,28.5,10.5,8.5,0,0,TAU);g.fill();
  const id=g.getImageData(0,0,N,N).data,m=new Uint8Array(N*N);for(let i=0;i<N*N;i++)m[i]=id[i*4+3]>120?1:0;return m})();
let x0=N,x1=0,y0=N,y1=0;
for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(BM[y*N+x]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
const LA=20,LB=27,LL=5,AY=28,AL=4,FL=y1+LL+3,CX=(x0+x1)/2;
let L0=x0,R0=x1;for(let x=x0;x<=x1;x++)if(BM[AY*N+x]){L0=x;break}for(let x=x1;x>=x0;x--)if(BM[AY*N+x]){R0=x;break}
const inB=(x,y)=>x>=0&&x<N&&y>=0&&y<N&&BM[y*N+x];

// Dancinhas: seis, para quando a página para e não há mais o que construir.
// PERNAS devolve [[desvio do pé, comprimento], ...] para a esquerda e a
// direita; OFS devolve o que o corpo inteiro faz — desvio, pulinho, boca e
// para onde ele olha. Os dois andam em tempos diferentes de propósito.
const DANCA_N=6;
const DANCA_PERNAS=(i,d)=>{const k=n=>Math.floor(d*n);
  if(i===0)return (k(4)%2)?[[0,3],[0,5]]:[[0,5],[0,3]];          // robô: uma perna encolhe por vez
  if(i===1){const g=(k(3)%2)?1:-1;return [[-2*g,5],[-2*g,5]]}     // twist: as duas para o mesmo lado
  if(i===2)return (k(4)%2)?[[0,5],[2,3]]:[[0,5],[0,5]];           // discoteca: batidinha do pé direito
  if(i===3)return (k(3)%2)?[[-4,4],[0,5]]:[[0,5],[4,4]];          // chute: uma de cada vez, para fora
  if(i===4){const j=k(12)%2;return [[-2-j,4+j],[2+j,5-j]]}        // tremelique: vibração miúda
  const m=k(3)%3;return m===0?[[0,5],[0,3]]:m===1?[[-1,4],[1,4]]:[[0,3],[0,5]]}; // macarrão: onda
const DANCA_OFS=(i,d)=>{const k=n=>Math.floor(d*n);
  if(i===0)return{X:0,Y:(k(4)%2)?-1:0,mouth:'line',look:(k(2)%2)?1:-1};
  if(i===1){const g=(k(3)%2)?1:-1;return{X:g,Y:0,mouth:'smile',look:g}}
  if(i===2){const u=k(4)%2;return{X:0,Y:u?-2:0,mouth:u?'o':'smile',look:1}}
  if(i===3){const p=k(3)%2;return{X:0,Y:p?-1:0,mouth:'smile',look:p?-1:1}}
  if(i===4)return{X:(k(12)%2)?1:-1,Y:(k(6)%2)?-1:0,mouth:'o',look:0};
  const m=k(3)%3;return{X:0,Y:Math.round(Math.sin(d*6)*2),mouth:m===1?'o':'smile',look:m-1}};

// o personagem, igual à ficha oficial
function byte(R,s,t){
  const ox=Math.round(s.X),wf=((t*7)|0)%2,dir=s.dir||0,look=s.look??dir,air=!!s.air;
  const dy=Math.round(s.Y)+(s.walk?(wf?-1:0):0)+(s.bob||0);
  const scan=s.eyes==='scan';
  // pernas da dancinha: null quando ele não está dançando
  const dPer=s.dance?DANCA_PERNAS(s.dance[0],s.dance[1]):null;
  // antenas
  const wob=Math.round(Math.sin(t*5)*(air?1:.6))-(s.fast?dir*2:0);
  for(const [bx,lean] of [[20,-1],[28,1]]){let tx=bx,ty=21;
    for(let i=1;i<=3;i++){const e=i/3;tx=bx+Math.round(lean*e*e+wob*e);ty=21-i;R(tx+ox,ty+dy,1,1,M)}
    R(tx-1+ox,ty-2+dy,2,2,scan?W:H)}
  // fogo do foguete
  const footY=y1+LL+2,flick=Math.floor(hash(Math.floor(t*20))*3);
  const flame=(fx,fy,wd,len)=>{for(let i=0;i<len;i++){const e=i/len,w=Math.max(1,Math.round(wd*(1-e*.7))),sx=Math.round(fx-w/2-dir*i*.45+(hash(i+Math.floor(t*24)+fx)-.5)*(e>.4?2:0));
    R(sx,fy+i,w,1,e<.15?W:e<.4?H:e<.7?O:M)}};
  if(dPer){const len=2+Math.floor(hash(Math.floor(t*18))*2);
    for(let q=0;q<2;q++){const b=q?LB:LA,[ddx,dln]=dPer[q];flame(b+ddx+ox+.5,y1+dln+1+dy,2,len)}}
  else if(s.flame>0&&!s.fast){const len=Math.round((4+flick)*s.flame+1);flame(LA+ox+.5,footY+dy,2,len);flame(LB+ox+.5,footY+dy,2,len)}
  if(s.fast){const fx=Math.round(dir>0?x0-1:x1+1)+ox,fy=Math.round((y0+y1)/2+3)+dy,len=10+flick*2;
    for(let i=0;i<len;i++){const e=i/len,h=Math.max(1,Math.round(4*(1-e)));R(fx-dir*i,fy-(h>>1)+(hash(i+Math.floor(t*30))>.7?1:0),1,h,e<.15?W:e<.4?H:e<.7?O:M)}}
  // pernas
  if(dPer){for(let q=0;q<2;q++){const b=q?LB:LA,[ddx,dln]=dPer[q];let fx=b;
    for(let j=1;j<=dln;j++){fx=b+Math.round(ddx*j/dln);R(fx+ox,y1+j+dy,1,1,O)}
    R(fx-(ddx<0?1:0)+ox,y1+dln+1+dy,2,1,H)}}
  else if(air){for(const lx of [LA,LB]){R(lx+ox,y1+1+dy,1,LL,O);R(lx-(lx<CX?1:0)+ox,y1+1+LL+dy,2,1,H)}}
  else{const h1=s.walk?(wf?LL-1:LL+1):LL,h2=s.walk?(wf?LL+1:LL-1):LL;
    R(LA+ox,y1+1+dy,1,h1,O);R(LA+ox-1,y1+1+h1+dy,2,1,H);R(LB+ox,y1+1+dy,1,h2,O);R(LB+ox,y1+1+h2+dy,2,1,H)}
  // corpo
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(BM[y*N+x]){
    const up=!inB(x,y-1),rt=!inB(x+1,y),dn=!inB(x,y+1);R(x+ox,y+dy,1,1,up?L:(rt||dn)?M:O)}
  // olhos
  const blink=!air&&!scan&&(t%3.7)<.13;
  for(const ex of [19,27]){const x=ex+look+ox;
    if(scan){R(x,23+dy,2,3,W)}
    else if(blink)R(x,25+dy,2,1,K);
    else if(s.fast)R(x,24+dy,2,1,K);
    else R(x,23+dy,2,3,K)}
  // boca
  const X0=24+ox+look,Y0=31+dy,mo=s.mouth||(s.fast?'o':s.walk?'line':'smile');
  if(mo==='o')R(X0-1,Y0,2,2,K);else if(mo==='line')R(X0-1,Y0,3,1,K);
  else{R(X0-2,Y0,1,1,K);R(X0+2,Y0,1,1,K);R(X0-1,Y0+1,3,1,K)}
  // braços
  const ay=AY+dy,lx=L0-1+ox,rx=R0+1+ox;
  const arm=(x,sg,lift)=>{const h=Math.ceil(AL/2);for(let k=0;k<AL;k++)R(x+sg*k,ay+(k>=h?lift:0),1,1,O);return x+sg*AL};
  const raise=(sg)=>{const hx=sg>0?rx:lx;for(let k=0;k<AL;k++)R(hx+sg*Math.ceil(k*.6),ay-k,1,1,O);R(hx+sg*Math.ceil(AL*.6)+(sg<0?-1:0),ay-AL-1,2,2,H)};
  const lower=(sg)=>{const hx=sg>0?rx:lx;for(let k=0;k<AL-1;k++)R(hx+sg*Math.ceil(k*.6),ay+k,1,1,O);R(hx+sg*Math.ceil((AL-1)*.6)+(sg<0?-1:0),ay+AL-1,2,1,H)};
  const rest=(sg)=>{const e=arm(sg>0?rx:lx,sg,1);R(e,ay+1,1,2,H)};
  const a=s.arms||'rest';
  if(a==='dash'){const back=-dir;const e=arm(back>0?rx:lx,back,0);R(e,ay-1,1,2,H);const f2=arm(back>0?lx:rx,-back,1);R(f2+(back>0?-1:0),ay+1,2,1,H)}
  else if(a==='fly'){const up=dir>=0?1:-1;raise(up);lower(-up)}
  else if(a==='land'){const e1=arm(lx,-1,-1);R(e1,ay-2,1,2,H);const e2=arm(rx,1,-1);R(e2,ay-2,1,2,H)}
  else if(a==='walk'){const w1=wf?-1:1;const e1=arm(lx,-1,1);R(e1,ay+w1,1,2,H);const e2=arm(rx,1,1);R(e2,ay-w1,1,2,H)}
  else if(a==='up'){raise(-1);raise(1)}
  else if(a==='hold'){rest(-1);raise(1)}
  else if(a==='point'){rest(-1);const e=arm(rx,1,0);R(e,ay-1,1,2,H)}
  else if(a==='wave'){rest(-1);const wv=((t*6)|0)%2;for(let k=0;k<AL;k++)R(rx+Math.ceil(k*.5),ay-k,1,1,O);R(rx+Math.ceil(AL*.5)+wv-1,ay-AL-1,2,2,H)}
  else if(a==='dance'){const di=s.dance[0],dd=s.dance[1],k=n=>Math.floor(dd*n);
    const out=sg=>{const e=arm(sg>0?rx:lx,sg,0);R(e+(sg<0?-1:0),ay-1,1,2,H)};
    if(di===0){if(k(4)%2){raise(-1);lower(1)}else{lower(-1);raise(1)}}
    else if(di===1){if(k(3)%2){raise(-1);rest(1)}else{rest(-1);raise(1)}}
    else if(di===2){rest(-1);if(k(4)%2)raise(1);else lower(1)}
    else if(di===3){out(-1);out(1)}
    else if(di===4){if(k(12)%2){raise(-1);raise(1)}else{lower(-1);lower(1)}}
    else{const m=k(3)%3;if(m===0){raise(-1);lower(1)}else if(m===1){out(-1);out(1)}else{lower(-1);raise(1)}}}
  else if(a==='make'){const sg=look<0?-1:1,e=arm(sg>0?rx:lx,sg,0);R(e+(sg<0?-1:0),ay-1,2,2,H);
    for(let k=1;k<=3;k++)R(e+sg*k+(sg<0?-1:0),ay+k,1,1,k<3?K:M);R(e+sg*4+(sg<0?-1:0),ay+4,1,1,W);s.tip=[e+sg*4+(sg<0?-1:0)+.5,ay+4.5];
    ((t*16)|0)%2?raise(-sg):lower(-sg)}
  else{rest(-1);rest(1)}
}
const edgeX=(y,side)=>{if(side>0){for(let x=x1;x>=x0;x--)if(BM[y*N+x])return x}else{for(let x=x0;x<=x1;x++)if(BM[y*N+x])return x}return CX};
// de costas: sem rosto, as duas mãos no teclado
function byteBack(R,s,t){
  const ox=Math.round(s.X),dy=Math.round(s.Y);
  const wob=Math.round(Math.sin(t*5)*.6);
  for(const [bx,lean] of [[20,-1],[28,1]]){let tx=bx,ty=21;for(let i=1;i<=3;i++){const e=i/3;tx=bx+Math.round(lean*e*e+wob*e);ty=21-i;R(tx+ox,ty+dy,1,1,M)}R(tx-1+ox,ty-2+dy,2,2,H)}
  R(LA+ox,y1+1+dy,1,LL,O);R(LA+ox-1,y1+1+LL+dy,2,1,H);R(LB+ox,y1+1+dy,1,LL,O);R(LB+ox,y1+1+LL+dy,2,1,H);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(BM[y*N+x]){const up=!inB(x,y-1),rt=!inB(x+1,y),lf=!inB(x-1,y),dn=!inB(x,y+1);R(x+ox,y+dy,1,1,up?L:(rt||lf||dn)?M:O)}
  const ay=AY+dy,lx=L0-1+ox,rx=R0+1+ox,f=s.typing?((t*16)|0)%2:0,g=s.typing?((t*16+.5)|0)%2:0;
  if(s.cast){const sh=((t*12)|0)%2,glow=((t*18)|0)%3===0?W:H;
    for(let k=0;k<AL;k++){R(lx-k,ay-k,1,1,O);R(rx+k,ay-k,1,1,O)}
    R(lx-AL-1,ay-AL-1-sh,2,2,glow);R(rx+AL,ay-AL-1-(1-sh),2,2,glow);return}
  for(let k=0;k<AL;k++){R(lx-k,ay,1,1,O);R(rx+k,ay,1,1,O)}
  R(lx-AL,ay-1+f,1,2,H);R(rx+AL,ay-1+(s.typing?1-g:0),1,2,H);
}
// voo de super-herói: deitado, braço da frente esticado, pernas para trás
function byteFly(R,s,t){
  const d=s.dir,rear=-d,ox=Math.round(s.X),dy=Math.round(s.Y),fl=((t*14)|0)%2,flick=Math.floor(hash(Math.floor(t*20))*3);
  for(const bx of [20,28]){const pts=[[bx-d,20],[bx-2*d,19],[bx-3*d,19]];for(const [x,y] of pts)R(x+ox,y+dy,1,1,M);R(bx-4*d-(d>0?1:0)+ox,17+dy+fl,2,2,H)}
  for(const ly of [32,35]){const e=edgeX(ly,rear);for(let i=1;i<=LL;i++)R(e+rear*i+ox,ly+dy+(i>3&&fl&&ly===35?1:0),1,1,O);
    const fx=e+rear*(LL+1);R(fx+ox,ly-1+dy,1,2,H);
    const len=s.flame?5+flick+(s.fast?5:0):0;for(let i=0;i<len;i++){const q=i/len,h=q<.5?2:1;R(fx+rear*(i+1)+ox,ly-(h>1?1:0)+dy+(hash(i+Math.floor(t*30)+ly)>.75?1:0),1,h,q<.15?W:q<.4?H:q<.7?O:M)}}
  {const e=edgeX(30,rear);R(e+rear+ox,30+dy,1,1,O);R(e+rear*2+ox,31+dy,1,1,O);R(e+rear*3+ox,31+dy,1,1,H)}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(BM[y*N+x]){const up=!inB(x,y-1),rt=!inB(x+1,y),dn=!inB(x,y+1);R(x+ox,y+dy,1,1,up?L:(rt||dn)?M:O)}
  {const e=edgeX(26,d);for(let k=1;k<=AL;k++)R(e+d*k+ox,26+dy,1,1,O);R(e+d*(AL+1)-(d<0?1:0)+ox,25+dy,2,2,H)}
  for(const ex of [19,27])R(ex+2*d+ox,(s.scan?25:24)+dy,2,2,s.scan?W:K);
  R(24+2*d-1+ox,31+dy,3,1,K);
}
// Enxame: 4 agentes novos, gerados por ficha (forma, cor, antena, olhos, propulsão, ferramenta)
const AG=[
 {id:'pixel',nome:'Pixel',papel:'Estrutura e layout',shape:'box',top:'one',eyes:'visor',prop:'twin',detail:'grid',mouth:'line',tool:'ruler',
  c:{b:'#22c3e6',l:'#8be8f7',d:'#0e7894',s:'#0a5468',g:'#b8f4ff',w:'#effdff',a:'#ff5a0f'}},
 {id:'loop',nome:'Loop',papel:'Lógica e interações',shape:'circle',top:'horns',eyes:'three',prop:'jet',detail:'cheeks',mouth:'smile',tool:'wand',
  c:{b:'#9b5cff',l:'#c9a6ff',d:'#5a2cb0',s:'#3d1d7a',g:'#e3d1ff',w:'#f7f1ff',a:'#ff4fa3'}},
 {id:'nano',nome:'Nano',papel:'Detalhes e acabamento',shape:'drop',top:'spark',eyes:'big',prop:'wings',detail:'belly',mouth:'o',tool:'solder',
  c:{b:'#4fd13a',l:'#a4ef95',d:'#2a8420',s:'#1c5c15',g:'#d8ffcc',w:'#f3fff0',a:'#ffb000'}},
 {id:'bit',nome:'Bit',papel:'Imagens e mídia',shape:'capsule',top:'rotor',eyes:'two',prop:'legs',detail:'led',mouth:'teeth',tool:'brush',
  c:{b:'#ffc21a',l:'#ffe27e',d:'#b07900',s:'#6e4c00',g:'#fff1b8',w:'#fffbea',a:'#22c3e6'}}
];
function agMask(shape){const cv=document.createElement('canvas');cv.width=cv.height=N;const g=cv.getContext('2d');g.fillStyle='#fff';g.beginPath();
  if(shape==='box')g.roundRect(14,20,21,17,4);
  else if(shape==='circle')g.ellipse(24.5,29,9.5,9.5,0,0,TAU);
  else if(shape==='drop'){g.moveTo(24.5,16);g.bezierCurveTo(27,21,34,24,34,30);g.arc(24.5,30,9.5,0,Math.PI);g.bezierCurveTo(15,24,22,21,24.5,16)}
  else g.roundRect(11,23,27,13,6.5);
  g.fill();const id=g.getImageData(0,0,N,N).data,m=new Uint8Array(N*N);for(let i=0;i<N*N;i++)m[i]=id[i*4+3]>120?1:0;
  let a=N,b=0,c=N,d=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(m[y*N+x]){a=Math.min(a,x);b=Math.max(b,x);c=Math.min(c,y);d=Math.max(d,y)}
  const h=d-c,ay=Math.round(c+h*(shape==='drop'?.7:.55));let l=a,r=b;for(let x=a;x<=b;x++)if(m[ay*N+x]){l=x;break}for(let x=b;x>=a;x--)if(m[ay*N+x]){r=x;break}
  const ey=Math.round(c+h*(shape==='drop'?.48:shape==='capsule'?.25:.22)),my=Math.round(c+h*(shape==='drop'?.74:shape==='capsule'?.62:.64));
  return {m,x0:a,x1:b,y0:c,y1:d,cx:Math.round((a+b)/2),ay,L0:l,R0:r,ey,my,in:(x,y)=>x>=0&&x<N&&y>=0&&y<N&&m[y*N+x]}}
AG.forEach(A=>A.k=agMask(A.shape));

function agent(R,A,s,t){const P=A.c,G=A.k,ox=Math.round(s.X||0),dy=Math.round(s.Y||0),look=s.look??0,dir=s.dir||0,fast=!!s.fast;
  const {x0,x1,y0,y1,cx}=G,fl=((t*14)|0)%2,flick=Math.floor(hash(Math.floor(t*20)+A.id.length)*3);
  const X=v=>v+ox,Y=v=>v+dy;
  const fire=(fx,fy,wd,len,side)=>{for(let i=0;i<len;i++){const e=i/len,w=Math.max(1,Math.round(wd*(1-e*.7)));
    const col=e<.15?P.w:e<.4?P.g:e<.7?P.b:P.d;
    if(side)R(X(fx-side*i),Y(fy-(w>>1)),1,w,col);else R(X(Math.round(fx-w/2+(hash(i+Math.floor(t*24)+fx)-.5)*(e>.4?2:0))),Y(fy+i),w,1,col)}};
  // topo: antena, chifres, faísca ou hélice
  const wob=Math.round(Math.sin(t*5)*1)-(fast?dir*2:0);
  if(A.top==='one'){let tx=cx,ty=y0;for(let i=1;i<=4;i++){tx=cx+Math.round(wob*i/4);ty=y0-i;R(X(tx),Y(ty),1,1,P.s)}R(X(tx-1),Y(ty-2),3,2,((t*3)|0)%2?P.a:'#ffb27a')}
  else if(A.top==='horns'){for(const sg of [-1,1]){const bx=cx+sg*5;const pts=[[0,0],[sg,-1],[sg*2,-2],[sg*2,-3],[sg,-4]];
    pts.forEach(([u,v],i)=>R(X(bx+u),Y(G.y0+1+v-(i?0:0)),1,1,i>2?P.a:P.d))}}
  else if(A.top==='spark'){const on=((t*10)|0)%3;R(X(cx),Y(y0-2),1,1,P.a);if(on){R(X(cx-1),Y(y0-2),3,1,P.a);R(X(cx),Y(y0-3),1,3,P.a)}R(X(cx),Y(y0-2),1,1,P.w)}
  else if(A.top==='rotor'){R(X(cx),Y(y0-1),1,2,P.s);R(X(cx),Y(y0-2),1,1,P.d);const sp=((t*24)|0)%3,w=[13,7,2][sp];R(X(cx-(w>>1)),Y(y0-3),w,1,sp===2?P.s:P.d);if(sp===0){R(X(cx-6),Y(y0-3),1,1,P.a);R(X(cx+6),Y(y0-3),1,1,P.a)}}
  // propulsão
  const legs=(len,dang)=>{for(const lx of [cx-4,cx+4]){const h=len+(dang&&fl&&lx>cx?1:0);R(X(lx),Y(y1+1),1,h,P.b);R(X(lx-(lx<cx?1:0)),Y(y1+1+h),2,1,P.l)}};
  if(fast){const fx=dir>0?x0-1:x1+1,fy=Math.round((y0+y1)/2+2),len=10+flick*2;
    for(let i=0;i<len;i++){const e=i/len,h=Math.max(1,Math.round(4*(1-e)));R(X(fx-dir*i),Y(fy-(h>>1)+(hash(i+Math.floor(t*30))>.7?1:0)),1,h,e<.15?P.w:e<.4?P.g:e<.7?P.b:P.d)}}
  if(A.prop==='twin'){legs(4);if(!fast){const len=Math.round((4+flick)*(s.flame??.6)+1);fire(cx-4+.5,y1+6,2,len);fire(cx+4+.5,y1+6,2,len)}}
  else if(A.prop==='jet'){const b=y1-1;R(X(cx-2),Y(b+1),5,2,P.s);R(X(cx-1),Y(b+3),3,1,P.d);if(!fast)fire(cx+.5,b+4,4,Math.round((5+flick)*(s.flame??.7)+2))}
  else if(A.prop==='wings'){legs(2,1);}
  else legs(3,1);
  // corpo com sombreado
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(G.m[y*N+x]){const up=!G.in(x,y-1),rt=!G.in(x+1,y),dn=!G.in(x,y+1),lf=!G.in(x-1,y);R(X(x),Y(y),1,1,up?P.l:(rt||dn)?P.d:lf&&A.shape==='box'?P.l:P.b)}
  // asas (Nano)
  if(A.prop==='wings'){const up=fast?1:((t*18)|0)%2;for(const sg of [-1,1]){const ex=sg<0?x0-1:x1+1,wy=G.ay-5;
    if(up){for(let k=0;k<4;k++)R(X(ex+sg*k),Y(wy-k),1,k+2,k>2?P.g:P.l)}else{for(let k=0;k<4;k++)R(X(ex+sg*k),Y(wy+1),1,2+(k<2?1:0),P.g)}}
    if(!fast&&Math.random()<.5)R(X(cx+Math.round((Math.random()-.5)*16)),Y(y1+2+Math.round(Math.random()*5)),1,1,P.a)}
  // detalhes de cor
  if(A.detail==='grid'){for(let y=G.my+2;y<=y1-2;y+=2)for(let x=x0+4;x<=x1-4;x+=3)R(X(x),Y(y),1,1,P.d)}
  else if(A.detail==='cheeks'){R(X(cx-7),Y(G.ey+4),2,1,P.a);R(X(cx+6),Y(G.ey+4),2,1,P.a)}
  else if(A.detail==='belly'){for(let x=cx-3;x<=cx+3;x++)R(X(x),Y(y1-2),1,1,P.a);R(X(cx-2),Y(y1-3),5,1,P.a)}
  else if(A.detail==='led'){R(X(x1-5),Y(G.my+1),2,2,((t*2.5)|0)%2?P.a:P.s);R(X(x0+4),Y(G.my+1),1,1,P.s);R(X(x0+6),Y(G.my+1),1,1,P.s)}
  // olhos
  const K2='#0c0b0d',blink=!fast&&(t%3.3)<.12,ey=G.ey;
  if(A.eyes==='visor'){R(X(x0+3),Y(ey),x1-x0-5,4,K2);const sx=x0+4+Math.round((Math.sin(t*3)*.5+.5)*(x1-x0-9));R(X(sx+look),Y(ey+1),3,2,P.a);R(X(sx+look+1),Y(ey+1),1,1,'#ffe6d2')}
  else if(A.eyes==='three'){[[-6,0],[-1,-1],[4,0]].forEach(([u,v])=>blink?R(X(cx+u+look),Y(ey+v+1),2,1,K2):R(X(cx+u+look),Y(ey+v),2,2,K2))}
  else if(A.eyes==='big'){for(const u of [-5,2]){if(blink)R(X(cx+u+look),Y(ey+2),3,1,K2);else{R(X(cx+u+look),Y(ey),3,fast?2:4,K2);R(X(cx+u+look+(look>0?2:0)),Y(ey),1,1,P.w)}}}
  else for(const u of [-5,3]){if(blink||fast)R(X(cx+u+look),Y(ey+1),2,1,K2);else R(X(cx+u+look),Y(ey),2,3,K2)}
  // boca
  const mx=cx+look,my=G.my,mo=s.mouth||A.mouth;
  if(mo==='o')R(X(mx),Y(my),2,2,K2);else if(mo==='line')R(X(mx-1),Y(my),3,1,K2);
  else if(mo==='teeth'){R(X(mx-2),Y(my),5,2,K2);R(X(mx-1),Y(my),1,1,P.w);R(X(mx+1),Y(my),1,1,P.w)}
  else{R(X(mx-2),Y(my),1,1,K2);R(X(mx+2),Y(my),1,1,K2);R(X(mx-1),Y(my+1),3,1,K2)}
  // braços e ferramenta
  const ay=Y(G.ay),lx=X(G.L0-1),rx=X(G.R0+1),AL=4;
  const arm=(x,sg,lift)=>{for(let k=0;k<AL;k++)R(x+sg*k,ay+(k>=2?lift:0),1,1,P.b);return x+sg*AL};
  const raise=sg=>{const hx=sg>0?rx:lx;for(let k=0;k<AL;k++)R(hx+sg*Math.ceil(k*.6),ay-k,1,1,P.b);R(hx+sg*Math.ceil(AL*.6)+(sg<0?-1:0),ay-AL-1,2,2,P.l)};
  const lower=sg=>{const hx=sg>0?rx:lx;for(let k=0;k<AL-1;k++)R(hx+sg*Math.ceil(k*.6),ay+k,1,1,P.b);R(hx+sg*Math.ceil((AL-1)*.6)+(sg<0?-1:0),ay+AL-1,2,1,P.l)};
  const rest=sg=>{const e=arm(sg>0?rx:lx,sg,1);R(e,ay+1,1,2,P.l)};
  const a=s.arms||'rest';
  if(a==='make'){const sg=look<0?-1:1,e=arm(sg>0?rx:lx,sg,0),hx=e+(sg<0?-1:0);R(hx,ay-1,2,2,P.l);let tip;
    if(A.tool==='ruler'){for(let k=1;k<=4;k++)R(hx+sg*k,ay+k-1,1,1,k%2?P.a:'#ffe6d2');tip=[hx+sg*5,ay+4]}
    else if(A.tool==='wand'){for(let k=1;k<=3;k++)R(hx+sg*k,ay+k,1,1,K2);const tw=((t*12)|0)%2;R(hx+sg*4-1,ay+4,3,1,P.a);R(hx+sg*4,ay+3,1,3,P.a);if(tw)R(hx+sg*4,ay+4,1,1,P.w);tip=[hx+sg*4,ay+4]}
    else if(A.tool==='solder'){R(hx+sg,ay+1,1,2,P.s);R(hx+sg*2,ay+2,1,1,P.s);R(hx+sg*3,ay+3,1,1,'#8a8f98');R(hx+sg*4,ay+4,1,1,((t*20)|0)%2?P.a:P.w);tip=[hx+sg*4,ay+4]}
    else{R(hx+sg,ay+1,1,1,P.s);R(hx+sg*2,ay+2,1,1,P.s);R(hx+sg*3+(sg<0?-1:0),ay+3,2,2,P.a);tip=[hx+sg*3+(sg<0?-1:0)+1,ay+5]}
    s.tip=[tip[0]+.5,tip[1]+.5];((t*16)|0)%2?raise(-sg):lower(-sg)}
  else if(a==='dash'){const b=-dir,e=arm(b>0?rx:lx,b,0);R(e,ay-1,1,2,P.l);const f=arm(b>0?lx:rx,-b,1);R(f+(b>0?-1:0),ay+1,2,1,P.l)}
  else if(a==='up'){raise(-1);raise(1)}
  else if(a==='swap'){const f=((t*(s.rate||6))|0)%2;f?(raise(-1),lower(1)):(lower(-1),raise(1))}
  else if(a==='wave'){rest(-1);const wv=((t*6)|0)%2;for(let k=0;k<AL;k++)R(rx+Math.ceil(k*.5),ay-k,1,1,P.b);R(rx+Math.ceil(AL*.5)+wv-1,ay-AL-1,2,2,P.l)}
  else{rest(-1);rest(1)}
}

const SEL='main .crumbs,main .label,main .lead,main .page-hero__actions,main figure,main .hipercode__claim,main .pipeline__step,main .carousel,main .micro-cta,main .seal,main .svc-link,main .cta-band>div,footer .footer__top-cta,footer .footer__cols>*,footer .footer__bottom,main p,main ul,main ol,main img,main picture,main details,main form,main blockquote,main table';
// títulos: o site escreve letra por letra; o Hipercode acompanha o cursor dessa escrita
const TITLES=[...document.querySelectorAll('main h1,main h2,.footer__closing')];
const all=[...document.querySelectorAll(SEL)];
const blocks=all.filter(el=>!all.some(o=>o!==el&&o.contains(el)));
const TYPE=el=>el.matches('main figure,main .carousel,main img,main picture')?'media':el.matches('main .page-hero__actions,main .micro-cta,main .svc-link,main .cta-band>div,footer .footer__top-cta,main form')?'acao':el.matches('main .hipercode__claim,main .pipeline__step,main .seal,main ul,main ol,main details,main table,footer *')?'estrutura':'texto';
blocks.forEach(el=>{el.setAttribute('data-hb','');el.__t=TYPE(el)});
window.__hbOK=1;

const cv=document.createElement('canvas');cv.className='hb-fx';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
const c=cv.getContext('2d');let VW=0,VH=0,dpr=1;
function fit(){dpr=Math.min(2,devicePixelRatio||1);VW=innerWidth;VH=innerHeight;cv.width=Math.round(VW*dpr);cv.height=Math.round(VH*dpr)}
fit();addEventListener('resize',()=>{fit();roster()});
const Q=()=>VW<700?1.5:2;

// a equipe: Hipercode nos textos, Pixel na estrutura, Loop nas ações, Bit nas imagens
const ag=id=>AG.find(a=>a.id===id);
const X3=window.HC3D;
const COLS=['#22c3e6','#9b5cff','#4fd13a','#ffc21a','#ff4fa3','#ff8a45'];
const WK=[{id:'hipercode',type:'texto',col:O,soft:H,rate:16,ph:0}];
['estrutura','acao','media'].forEach((type,i)=>{const id=SQ[i],A=ag(id)||AG[i];const col=(X3&&X3.col(id))||A.c.b;
  WK.push({id,type,A:{...A,id},col,soft:col,rate:[11,21,8][i],ph:[.37,.71,.13][i],side:i%2?0:1})});
WK[0].side=0;
WK.forEach((w,i)=>{w.x=i%2?VW+80:-80;w.y=VH*(.25+i*.15);w.dir=i%2?-1:1;w.mode='idle';w.hist=[];w.job=null;w.park=null;
  const s={X:0,Y:0,arms:'make',look:-1,air:true},R=()=>{};w.A?agent(R,w.A,s,0):byte(R,s,0);w.tipG=s.tip});
// seis dancinhas do Hipercode (ficha oficial); os outros três têm passo próprio
const DANCA_DUR=4.2;
// passos dos agentes: cada um sorteia outro passo a cada compasso, com duração própria
const AGD=[
 (d)=>{const b=((d*4)|0)%2;return{X:0,Y:-Math.round(Math.abs(Math.sin(d*Math.PI*4))*3),arms:b?'up':'rest',look:0,mouth:'smile'}},
 (d)=>{const x=Math.round(Math.sin(d*4)*2);return{X:x,Y:0,arms:'swap',rate:4,look:x>0?1:x<0?-1:0}},
 (d)=>({X:0,Y:Math.round(Math.sin(d*5)*2),arms:'wave',look:((d*1.5)|0)%2?1:-1,mouth:'smile'}),
 (d)=>({X:0,Y:0,arms:((d*6)|0)%2?'up':'swap',rate:6,look:[-1,0,1,0][((d*6)|0)%4],mouth:'o'}),
 (d)=>({X:((d*12)|0)%2?1:-1,Y:((d*6)|0)%2?-1:0,arms:'swap',rate:12,look:0,mouth:'o'}),
 (d)=>{const f=d%1.1,j=f<.5?Math.round(-16*f*(.5-f)*2):0;return{X:0,Y:j,arms:j<0?'up':'rest',look:1,mouth:j<0?'o':'smile'}}];
// quem aparece: no computador os quatro; no celular só o Hipercode e o Bit, para não lotar a tela estreita
const ALL=WK.slice(),MOB=['hipercode',WK[1].id];
function roster(){const on=VW<700?ALL.filter(w=>MOB.includes(w.id)):ALL;
  for(const w of ALL)if(!on.includes(w)){if(w.job)finish(w.job.el);w.job=null;w.tj=null;w.park=null}
  WK.length=0;WK.push(...on)}
const tipOff=w=>{if(H3&&w.tipO)return w.tipO;const q=Q();return [(w.tipG[0]-(w.A?24.5:24))*q,(w.tipG[1]-28)*q]};
// agentes em 3D fofo: o quadro é colado com o centro do corpo em (w.x, w.y); a ponta da ferramenta vira o ponto de escrita
const H3=window.HC3D,SZ3=()=>70*Q();
function draw3(w,t){const tw=t+w.ph*10;let r;
  if(w.mode==='make')r=H3.sprite(w.id,tw,'make');
  else if(w.mode==='dash')r=H3.sprite(w.id,tw,'dash',{dir:w.dir});
  else if(!w.settled){w.dI=-1;r=H3.sprite(w.id,tw,'idle')}
  else{if(w.dI==null||w.dI<0||t-w.dT>4.2){let i=(Math.random()*4)|0;if(i===w.dI)i=(i+1)%4;w.dI=i;w.dT=t}r=H3.sprite(w.id,tw,'dance',{k:w.dI,d:t-w.dT})}
  const S=SZ3(),sx=w.x-r.body[0]*S,sy=w.y-r.body[1]*S;c.drawImage(r.cv,sx,sy,S,S);
  if(w.mode==='make')w.tipO=[(r.tip[0]-r.body[0])*S,(r.tip[1]-r.body[1])*S]}
if(H3)WK.forEach(w=>{const r=H3.sprite(w.id,0,'make'),S=SZ3();w.tipO=[(r.tip[0]-r.body[0])*S,(r.tip[1]-r.body[1])*S]});

function drawW(w,t){if(H3)return draw3(w,t);const q=Q(),cx0=w.A?24.5:24,bx=w.x-cx0*q,by=w.y-28*q;
  const R=(x,y,wd,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(bx+x*q),Math.round(by+y*q),Math.ceil(wd*q),Math.ceil(h*q))};
  const tw=t*w.rate/16+w.ph*10,d=w.dance,A=w.A;
  if(w.mode==='make'){const s={X:0,Y:0,air:true,arms:'make',look:-1,flame:.5,mouth:'o'};A?agent(R,A,s,tw):byte(R,s,tw);return}
  if(w.mode==='dash'){A?agent(R,A,{fast:true,arms:'dash',dir:w.dir},tw):byteFly(R,{dir:w.dir,X:0,Y:0,flame:1,fast:true},tw);return}
  if(!w.settled){w.dI=-1;const s={X:0,Y:Math.round(Math.sin(t*3+w.ph*9)*1.5),air:true,arms:'rest',look:0,flame:.6};A?agent(R,A,s,tw):byte(R,s,tw);return}
  // dancinhas: cada um com passo e ritmo próprios
  const u=t+w.ph*7;
  if(w.id==='hipercode'){if(w.dI==null||w.dI<0||t-w.dT>DANCA_DUR){let i=(Math.random()*DANCA_N)|0;if(i===w.dI)i=(i+1)%DANCA_N;w.dI=i;w.dT=t}
    const dd=t-w.dT,o=DANCA_OFS(w.dI,dd);byte(R,{X:o.X,Y:o.Y,air:true,arms:'dance',dance:[w.dI,dd],look:o.look,flame:.5,mouth:o.mouth},tw)}
  else{const dur=3.6+(w.rate%5)*.4;if(w.dI==null||w.dI<0||t-w.dT>dur){let i=(Math.random()*AGD.length)|0;if(i===w.dI)i=(i+1)%AGD.length;w.dI=i;w.dT=t}
    const o=AGD[w.dI](t-w.dT);agent(R,A,{X:o.X,Y:o.Y,arms:o.arms,rate:o.rate,look:o.look,mouth:o.mouth},tw)}}

// linhas do bloco e roteiro da escrita: linha digitada, volta do cursor, próxima linha
function linesOf(el){const r=el.getBoundingClientRect(),W=r.width,Hh=r.height,out=[];
  const rg=document.createRange();rg.selectNodeContents(el);
  for(const b of rg.getClientRects()){if(b.width<2||b.height<4)continue;
    const top=b.top-r.top,bot=b.bottom-r.top,l=out.find(o=>Math.abs(o.top-top)<4);
    if(l){l.x0=Math.min(l.x0,b.left-r.left);l.x1=Math.max(l.x1,b.right-r.left);l.bot=Math.max(l.bot,bot)}
    else out.push({top,bot,x0:b.left-r.left,x1:b.right-r.left,txt:1})}
  out.sort((a,b)=>a.top-b.top);
  const rows=[];let y=0;
  const fill=to=>{const n=Math.ceil((to-y)/36);for(let i=0;i<n;i++)rows.push({top:y+(to-y)*i/n,bot:y+(to-y)*(i+1)/n,x0:0,x1:W,txt:0});y=to};
  for(const l of out){if(l.top-y>20)fill(l.top);rows.push(l);y=Math.max(y,l.bot)}
  if(Hh-y>20)fill(Hh);
  if(!rows.length)rows.push({top:0,bot:Math.max(1,Hh),x0:0,x1:W,txt:0});
  const seg=[];let tot=0;
  rows.forEach((l,i)=>{l.w=Math.max(1,(l.x1-l.x0)/(l.txt?7:45));seg.push({i,w:l.w});tot+=l.w;
    const n=rows[i+1];if(n){const w=Math.max(1.5,Math.min(8,Math.hypot(l.x1-n.x0,n.top-l.top)/80));seg.push({i,ret:1,w});tot+=w}});
  return {rows,seg,tot}}

const queue=[],wait=new Set(blocks);
// ponto exato onde o cursor da escrita do título está (base da letra)
function caretOf(el){const cur=el.querySelector('.tt-cur');let a=null,right=true;
  if(cur){a=cur.previousElementSibling;if(!a||!a.classList.contains('tt-c')){a=cur.nextElementSibling;right=false}}
  if(!a||!a.classList.contains('tt-c')){a=el.querySelector('.tt-c');right=false}
  if(!a)return null;const r=a.getBoundingClientRect();return [right?r.right:r.left,r.top+r.height*.78]}
const inView=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.top<VH*.95&&r.bottom>0};
const titleBusy=el=>WK.some(w=>w.tj&&w.tj.el===el);
function nextTitle(typingOnly){return TITLES.find(el=>!el.__skip&&!el.classList.contains('tt-done')&&inView(el)&&!titleBusy(el)&&(!typingOnly||(el.querySelector('.tt-cur')&&!el.classList.contains('tt-wait'))))}
function finish(el){el.style.clipPath='';el.classList.add('hb-done')}
function scan(){let add=false;for(const el of wait){const r=el.getBoundingClientRect();if(r.top<VH*.92&&r.bottom>0&&r.width>0){wait.delete(el);queue.push(el);add=true}}
  for(let i=queue.length-1;i>=0;i--){const r=queue[i].getBoundingClientRect();if(r.bottom<-40||r.top>VH*1.4){finish(queue[i]);queue.splice(i,1)}}
  if(add)queue.sort((a,b)=>{const p=a.getBoundingClientRect(),q=b.getBoundingClientRect();return p.top-q.top||p.left-q.left})}
const titleNear=()=>TITLES.some(el=>{if(el.__skip||el.classList.contains('tt-done'))return false;const r=el.getBoundingClientRect();return r.width>0&&r.top<VH*1.5&&r.bottom>0});
function pick(w){if(w.id==='hipercode'&&titleNear())return null;let i=queue.findIndex(el=>el.__t===w.type);
  if(i<0)i=queue.findIndex(el=>{const o=WK.find(v=>v.type===el.__t);return o.job||o.tj||(o.id==='hipercode'&&titleNear())});
  return i<0?null:queue.splice(i,1)[0]}
function start(w,el){const n=queue.length,sp=n>6?.4:n>2?.65:1,L=linesOf(el);
  el.style.clipPath='inset(0 100% 100% 0)';w.settled=false;
  const far=Math.hypot(w.x-el.getBoundingClientRect().left,w.y-el.getBoundingClientRect().top)>VW*.5;
  w.job={el,L,t:0,fly:(far?.2:.12)*sp,frame:.07*sp,type:Math.min(.9,Math.max(.24,L.tot/480))*sp,sx:w.x,sy:w.y}}

// vagas livres: onde o agente fica sem cobrir texto, imagem ou botão
const OCC='header,.wa-float,main h1,main h2,main h3,main p,main li,main a,main button,main img,main figure,main svg,main video,main input,main textarea,main [data-hb],footer p,footer a,footer li,footer h2,footer h3,footer img,footer svg';
const PAD=6,box=(x,y,q)=>[x-19*q,y-16*q,x+19*q,y+18*q];
const ov=(a,b)=>{const w=Math.min(a[2],b[2])-Math.max(a[0],b[0]),h=Math.min(a[3],b[3])-Math.max(a[1],b[1]);return w>0&&h>0?w*h:0};
function park(){const q=Q(),occ=[];
  for(const el of document.querySelectorAll(OCC)){const b=el.getBoundingClientRect();if(b.width<2||b.height<2||b.bottom<0||b.top>VH||b.right<0||b.left>VW)continue;occ.push([b.left-PAD,b.top-PAD,b.right+PAD,b.bottom+PAD])}
  const taken=WK.filter(w=>w.job||w.tj).map(w=>box(w.x,w.y,q)),st=16,cand=[];
  for(let y=24*q;y<=VH-20*q;y+=st){for(let x=20*q;x<=VW-20*q;x+=st)cand.push([x,y,0]);cand.push([4*q,y,1],[VW-4*q,y,1])}
  const still=T-lastScroll>.35,area=38*34*q*q;
  // celular: cada agente tem sua vaga fixa na borda da tela, meio escondido, e não sai dela enquanto não trabalha
  const DOCK={hipercode:[0,.62],[WK[1].id]:[1,.42]};
  if(VW<700){for(const w of WK){if(w.job||w.tj)continue;const [sd,fy]=DOCK[w.id],p=[sd?VW-3*q:3*q,Math.round(VH*fy)];
    if(!w.park||Math.hypot(p[0]-w.park[0],p[1]-w.park[1])>4)w.settled=false;w.park=p}return}
  for(const w of WK){if(w.job||w.tj)continue;
    if(w.park){const b=box(w.park[0],w.park[1],q);let o=0;for(const r of occ)o+=ov(b,r);for(const r of taken)o+=ov(b,r);
      const onScr=w.park[1]>0&&w.park[1]<VH&&w.park[0]>-10*q&&w.park[0]<VW+10*q;
      if(onScr&&(!still||o<area*.04||w.settled)){taken.push(b);continue}}
    let best=null,bc=1e18;const fx=w.x,fy=w.y;
    for(const [x,y,peek] of cand){if((x<VW/2?0:1)!==w.side)continue;const b=box(x,y,q);let o=0;for(const r of taken)o+=ov(b,r)*6;if(o*20>bc)continue;
      for(const r of occ){o+=ov(b,r);if(o*20>bc)break}
      const cst=o*20+Math.min(x,VW-x)*.15+Math.hypot(x-fx,y-fy)*1.2+(peek?600:0);
      if(cst<bc){bc=cst;best=[x,y]}}
    if(best){if(!w.park||Math.hypot(best[0]-w.park[0],best[1]-w.park[1])>4)w.settled=false;w.park=best;taken.push(box(best[0],best[1],q))}}}

const GLY='<>/{}=;:()[]01#$*+',sparks=[],bits=[];
let last=performance.now(),T=0,lastPark=-1,lastScroll=-9;
addEventListener('scroll',()=>{lastScroll=T},{passive:true});
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,VW,VH);
  scan();
  // títulos primeiro com o Hipercode; se ele já está num título, quem estiver livre pega o outro que já começou
  for(const w of WK){if(w.job||w.tj)continue;if(VW<700&&w.id!=='hipercode'&&WK.filter(v=>v.job||v.tj).length>=2)continue;const el=w.id==='hipercode'?nextTitle():WK[0].tj?nextTitle(true):null;
    if(el){w.tj={el,t:0,sx:w.x,sy:w.y};w.settled=false}}
  {const MAXB=VW<700?2:4;let act=WK.filter(w=>w.job||w.tj).length;
    for(let i=0;i<queue.length&&act<MAXB;){const el=queue[i],tn=titleNear();
      const free=WK.filter(w=>!w.job&&!w.tj&&!(w.id==='hipercode'&&tn));if(!free.length)break;
      const r=el.getBoundingClientRect(),d=w=>Math.hypot(w.x-r.left,w.y-r.top);
      let w=VW>=700?free.find(v=>v.type===el.__t):null;if(!w)w=free.sort((a,b)=>d(a)-d(b))[0];
      queue.splice(i,1);start(w,el);act++}}
  if(T-lastPark>.3){lastPark=T;park()}
  const q=Q();
  for(const w of WK){w.caret=null;const j=w.job,tj=w.tj;
    if(tj){const el=tj.el;tj.t+=dt;
      if(!caretOf(el)&&tj.t>3)el.__skip=1;if(el.__skip||el.classList.contains('tt-done')||!inView(el)){w.tj=null;w.mode='idle';w.park=null;lastPark=-1}
      else{const p=caretOf(el),[ox,oy]=tipOff(w),fly=.16;
        if(p){if(tj.t<fly){const u=tj.t/fly,e=u*u*(3-2*u),tx=p[0]-ox,ty=p[1]-oy,nx=tj.sx+(tx-tj.sx)*e;w.mode='dash';if(Math.abs(nx-w.x)>.5)w.dir=nx>w.x?1:-1;w.x=nx;w.y=tj.sy+(ty-tj.sy)*e}
          else{w.mode='make';w.x=p[0]-ox;w.y=p[1]-oy;
            const typing=el.querySelector('.tt-cur')&&!el.classList.contains('tt-wait');
            if(typing&&Math.random()<.8){const h=parseFloat(getComputedStyle(el).fontSize)||30;sparks.push({x:p[0],y:p[1]-Math.random()*h*.7,vx:(Math.random()-.3)*160,vy:-50-Math.random()*100,l:.3,col:w.col})}}}}}
    else if(j){const {el,L}=j,r=el.getBoundingClientRect(),[ox,oy]=tipOff(w);j.t+=dt;
      const r0=L.rows[0],s0=[r.left+r0.x0,r.top+(r0.top+r0.bot)/2];
      if(j.t<j.fly){const u=j.t/j.fly,e=u*u*(3-2*u),tx=s0[0]-ox,ty=s0[1]-oy;w.mode='dash';
        const nx=j.sx+(tx-j.sx)*e;if(Math.abs(nx-w.x)>.5)w.dir=nx>w.x?1:-1;w.x=nx;w.y=j.sy+(ty-j.sy)*e}
      else{const tt=j.t-j.fly;w.mode='make';let p=s0;
        const fu=Math.min(1,tt/j.frame),x=Math.round(r.left)+.5,y=Math.round(r.top)+.5,wd=Math.round(r.width),h=Math.round(r.height);
        c.globalAlpha=.6;c.strokeStyle=w.col;c.lineWidth=1;c.setLineDash([4,4]);c.beginPath();
        c.moveTo(x,y);c.lineTo(x+wd*fu,y);c.moveTo(x,y);c.lineTo(x,y+h*fu);if(fu>=1){c.moveTo(x+wd,y);c.lineTo(x+wd,y+h);c.lineTo(x,y+h)}c.stroke();c.setLineDash([]);c.globalAlpha=1;
        if(tt>=j.frame){const u=Math.min(1,(tt-j.frame)/j.type);let acc=u*L.tot,k=0;
          while(k<L.seg.length-1&&acc>L.seg[k].w){acc-=L.seg[k].w;k++}
          const sg=L.seg[k],ln=L.rows[sg.i],f=Math.min(1,acc/sg.w),W=r.width;
          if(sg.ret){const n=L.rows[sg.i+1];el.style.clipPath=`polygon(-6px -6px,${W+6}px -6px,${W+6}px ${ln.bot}px,-6px ${ln.bot}px)`;
            p=[r.left+ln.x1+(n.x0-ln.x1)*f,r.top+(ln.top+ln.bot)/2+((n.top+n.bot)/2-(ln.top+ln.bot)/2)*f]}
          else{const cx=ln.x0+(ln.x1-ln.x0)*f;
            el.style.clipPath=`polygon(-6px -6px,${W+6}px -6px,${W+6}px ${ln.top}px,${cx}px ${ln.top}px,${cx}px ${ln.bot}px,-6px ${ln.bot}px)`;
            p=[r.left+cx,r.top+(ln.top+ln.bot)/2];w.caret={x:r.left+cx,y0:r.top+ln.top,y1:r.top+ln.bot,txt:ln.txt}}
          if(u>=1){finish(el);w.job=null;w.mode='idle';w.caret=null;w.park=null;lastPark=-1}}
        // a ponta da ferramenta fica exatamente no cursor
        w.x=p[0]-ox;w.y=p[1]-oy}}
    else{w.mode='idle';const tg=w.park||[w.x,w.y],dx=tg[0]-w.x,dy=tg[1]-w.y,dist=Math.hypot(dx,dy),k=1-Math.exp(-dt*7);
      if(dist>40){w.mode='dash';w.settled=false;if(Math.abs(dx)>2)w.dir=dx>0?1:-1}
      w.x+=dx*k;w.y+=dy*k;if(dist<3)w.settled=true}
    if(w.mode!=='dash')w.hist.length=0;else{w.hist.push([w.x,w.y]);if(w.hist.length>10)w.hist.shift()}
    for(let i=1;i<w.hist.length;i++){const a=w.hist[i-1],b=w.hist[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])>220)continue;const al=i/w.hist.length;
      c.globalAlpha=al*.5;c.strokeStyle=w.col;c.lineWidth=al*3*q;c.beginPath();c.moveTo(a[0]-w.dir*14*q,a[1]+2*q);c.lineTo(b[0]-w.dir*14*q,b[1]+2*q);c.stroke()}
    c.globalAlpha=1;drawW(w,T);
    const cr=w.caret;if(cr){const h=cr.y1-cr.y0;
      c.fillStyle=w.col;c.fillRect(Math.round(cr.x),Math.round(cr.y0),Math.max(2,Math.round(q*1.5)),Math.round(h));
      c.globalAlpha=.45;c.fillStyle=w.soft;c.beginPath();c.arc(cr.x,cr.y0+h/2,3*q,0,Math.PI*2);c.fill();c.globalAlpha=1;
      if(cr.txt){if(Math.random()<.8)bits.push({x:cr.x+4+Math.random()*8,y:cr.y0+h*.5,ch:GLY[(Math.random()*GLY.length)|0],l:.22,sz:Math.max(10,Math.min(18,h*.55)),col:w.col,soft:w.soft})}
      else{c.globalAlpha=.5;c.fillStyle=w.soft;c.fillRect(Math.round(cr.x)-24,Math.round(cr.y0),24,Math.round(h));c.globalAlpha=1}
      if(Math.random()<.7)sparks.push({x:cr.x,y:cr.y0+Math.random()*h,vx:(Math.random()-.3)*140,vy:-40-Math.random()*90,l:.3,col:w.col})}}
  c.textBaseline='middle';
  for(let i=bits.length-1;i>=0;i--){const b=bits[i];b.l-=dt;if(b.l<=0){bits.splice(i,1);continue}b.y-=dt*30;c.globalAlpha=b.l/.22;c.fillStyle=b.l>.15?b.soft:b.col;c.font=`${b.sz|0}px ui-monospace,Menlo,Consolas,monospace`;c.fillText(b.ch,b.x,b.y)}
  c.globalAlpha=1;
  for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.l-=dt;if(s.l<=0){sparks.splice(i,1);continue}s.vy+=260*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;c.fillStyle=s.l>.18?W:s.col;c.fillRect(Math.round(s.x),Math.round(s.y),2,2)}
  requestAnimationFrame(frame)}
roster();
window.__hb={queue,WK,get T(){return T}};requestAnimationFrame(frame);
})();
})();
