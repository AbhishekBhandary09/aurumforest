/* ═══════════════════════════════════════════════════
   FEATURE 3 — GLOBE + FLIGHT ARC SHADERS (Three.js)
   Wrapped in window load to guarantee layout is ready
═══════════════════════════════════════════════════ */
window.addEventListener('load', function initGlobe(){
  const GD=[
    {name:'Swiss Alps',lat:46.8,lon:8.2,c:0xc9a84c},
    {name:'Maldives',lat:3.2,lon:73.2,c:0xe2c97e},
    {name:'Patagonia',lat:-51,lon:-73,c:0xc9a84c},
    {name:'Kyoto, Japan',lat:35,lon:135.7,c:0xe2c97e},
    {name:'Sahara',lat:31,lon:-4,c:0xc9a84c},
    {name:'Lofoten',lat:68.2,lon:14.5,c:0xe2c97e},
    {name:'Bora Bora',lat:-16.5,lon:-151.7,c:0xc9a84c},
    {name:'Serengeti',lat:-2.3,lon:34.8,c:0xe2c97e},
  ];
  const HOME={lat:51.5,lon:-0.12}; // London

  const cv=document.getElementById('globe-canvas');

  // Use a reliable size — parentElement may be 0 during script execution
  function getSize(){ return Math.min(Math.max(cv.parentElement.offsetWidth||500, 280), 600); }
  let S=getSize();
  cv.width=S*devicePixelRatio; cv.height=S*devicePixelRatio;
  cv.style.width=S+'px'; cv.style.height=S+'px';

  const rnd=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  rnd.setPixelRatio(devicePixelRatio); rnd.setSize(S,S); rnd.setClearColor(0x000000,0);
  const sc=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(40,1,.1,100); cam.position.z=2.6;
  sc.add(new THREE.AmbientLight(0xffffff,.3));
  const sun=new THREE.DirectionalLight(0xfff5e0,1.6); sun.position.set(3,2,3); sc.add(sun);
  const fillL=new THREE.DirectionalLight(0xffffff,.4); fillL.position.set(-2,1,2); sc.add(fillL);
  const rimL=new THREE.DirectionalLight(0xc9a84c,.3); rimL.position.set(-3,-1,-2); sc.add(rimL);


  // ── REAL EARTH TEXTURES (NASA / public domain) ──
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  // Primary: high-res Natural Earth texture from NASA visible earth
  // Fallback chain: NASA → stdi CDN → procedural canvas
  const EARTH_URLS = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_atmos_2048.jpg',
  ];
  const SPEC_URLS = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_specular_2048.jpg',
  ];
  const BUMP_URLS = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_normal_2048.jpg',
  ];
  const NIGHT_URLS = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
    'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_lights_2048.png',
  ];
  const CLOUDS_URLS = [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
    'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_clouds_1024.png',
  ];

  // Try loading a texture from an array of fallback URLs
  function loadWithFallback(urls, onLoad, onFail) {
    let idx = 0;
    function tryNext() {
      if (idx >= urls.length) { if(onFail) onFail(); return; }
      loader.load(urls[idx++], onLoad, undefined, tryNext);
    }
    tryNext();
  }

  // Procedural fallback texture (used while real textures load or if they fail)
  function mkFallbackTex() {
    const TS=2048, tc=document.createElement('canvas');
    tc.width=tc.height=TS;
    const ctx=tc.getContext('2d');
    // Deep ocean
    const og=ctx.createLinearGradient(0,0,0,TS);
    og.addColorStop(0,'#0a1628'); og.addColorStop(.4,'#0d2240'); og.addColorStop(.6,'#0d2240'); og.addColorStop(1,'#0a1628');
    ctx.fillStyle=og; ctx.fillRect(0,0,TS,TS);
    // Grid
    ctx.strokeStyle='rgba(100,160,255,.06)'; ctx.lineWidth=.7;
    for(let la=-80;la<=80;la+=10){const y=((90-la)/180)*TS;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(TS,y);ctx.stroke();}
    for(let lo=-180;lo<=180;lo+=10){const x=((lo+180)/360)*TS;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,TS);ctx.stroke();}
    const p=(la,lo)=>[((lo+180)/360)*TS,((90-la)/180)*TS];
    // Land — green-brown
    const landGrad=ctx.createLinearGradient(0,0,0,TS);
    landGrad.addColorStop(0,'#2d5a1e'); landGrad.addColorStop(.3,'#3a6b28'); landGrad.addColorStop(.6,'#4a7a32'); landGrad.addColorStop(.8,'#8b7355'); landGrad.addColorStop(1,'#a89070');
    ctx.fillStyle=landGrad;
    function land(pts){ctx.beginPath();const[sx,sy]=p(pts[0][0],pts[0][1]);ctx.moveTo(sx,sy);pts.slice(1).forEach(([la,lo])=>{const[x,y]=p(la,lo);ctx.lineTo(x,y);});ctx.closePath();ctx.fill();}
    // North America
    land([[72,-140],[72,-68],[60,-64],[50,-55],[47,-53],[45,-60],[35,-75],[30,-80],[24,-81],[22,-73],[20,-87],[15,-85],[10,-75],[9,-77],[8,-79],[8,-77],[10,-62],[15,-60],[20,-60],[22,-73],[24,-81],[30,-80],[35,-75],[45,-60],[47,-53],[52,-55],[55,-60],[60,-65],[65,-68],[70,-73],[72,-80],[72,-90],[72,-110],[72,-140]]);
    land([[60,-44],[72,-44],[83,-30],[83,-20],[76,-18],[70,-22],[63,-50],[60,-44]]);
    // South America
    land([[12,-72],[10,-62],[5,-52],[0,-50],[-5,-35],[-10,-37],[-15,-38],[-23,-43],[-33,-52],[-55,-67],[-55,-64],[-42,-63],[-35,-58],[-20,-40],[-10,-37],[-5,-35],[0,-50],[5,-60],[10,-62],[12,-72]]);
    // Europe
    land([[36,-9],[36,3],[38,3],[40,3],[44,8],[46,13],[48,17],[50,14],[53,14],[55,15],[57,18],[57,27],[60,27],[65,25],[70,25],[71,28],[70,31],[68,33],[70,30],[71,25],[70,20],[68,18],[65,14],[62,5],[58,5],[55,8],[54,10],[56,10],[55,15],[53,14],[48,14],[46,13],[44,8],[42,3],[41,3],[38,13],[37,15],[38,16],[37,12],[38,12],[37,9],[36,9],[36,-9]]);
    // Africa
    ctx.beginPath();
    [[37,10],[36,26],[32,32],[28,33],[22,37],[15,42],[12,44],[8,42],[5,38],[0,42],[-5,39],[-10,38],[-15,35],[-20,34],[-26,33],[-34,26],[-35,18],[-29,17],[-22,14],[-17,12],[-12,14],[-5,10],[0,8],[4,5],[4,2],[8,-2],[10,-5],[8,-5],[5,-5],[5,2],[10,0],[12,3],[15,0],[15,-17],[17,-12],[20,-13],[14,-17],[15,0],[20,13],[28,17],[35,20],[37,10]].forEach(([la,lo],i)=>{const[x,y]=p(la,lo);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.closePath();ctx.fill();
    // Asia
    ctx.beginPath();
    [[70,30],[70,60],[72,80],[70,100],[68,140],[60,140],[55,135],[50,140],[45,135],[40,130],[35,129],[30,122],[25,121],[22,114],[20,110],[15,108],[10,107],[5,104],[1,104],[-5,105],[0,110],[5,104],[10,78],[15,75],[20,73],[25,68],[28,65],[30,50],[25,57],[22,60],[20,58],[25,57],[30,50],[35,37],[38,28],[38,36],[40,36],[40,27],[42,26],[42,44],[48,46],[50,52],[55,60],[60,60],[65,55],[65,40],[70,30]].forEach(([la,lo],i)=>{const[x,y]=p(la,lo);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.closePath();ctx.fill();
    // Australia
    land([[-15,130],[-12,136],[-15,140],[-20,148],[-26,153],[-38,146],[-38,140],[-34,135],[-32,124],[-22,114],[-18,122],[-15,130]]);
    // Ice caps
    ctx.fillStyle='#d4e8f0';
    land([[-70,-180],[-70,180],[-90,180],[-90,-180]]);
    land([[75,-180],[75,180],[90,180],[90,-180]]);
    // City lights glow
    ctx.fillStyle='rgba(255,220,120,.55)';
    [[51,0],[48,2],[52,13],[55,37],[40,28],[35,139],[31,121],[28,77],[1,103],[37,-9],[40,-3],[33,-7],[19,-99],[40,-74],[34,-118],[41,-87],[30,-90],[-33,-70],[-23,-43],[-34,-58],[-26,28],[6,1],[9,7],[14,17],[30,31],[3,101],[13,100],[14,121],[22,114],[37,127]].forEach(([la,lo])=>{
      const[cx2,cy2]=p(la,lo);
      ctx.beginPath();ctx.arc(cx2,cy2,3+Math.random()*3,0,Math.PI*2);ctx.fill();
    });
    return new THREE.CanvasTexture(tc);
  }

  // Build globe mesh with fallback texture first, upgrade when real textures arrive
  const globeMat = new THREE.MeshPhongMaterial({
    map: mkFallbackTex(),
    shininess: 15,
    specular: new THREE.Color(0x1a3a5c),
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), globeMat);
  sc.add(globe);

  // Load real NASA textures and swap in as they arrive
  loadWithFallback(EARTH_URLS, tex => {
    tex.anisotropy = rnd.capabilities.getMaxAnisotropy();
    globeMat.map = tex;
    globeMat.needsUpdate = true;
  });
  loadWithFallback(SPEC_URLS, tex => {
    globeMat.specularMap = tex;
    globeMat.shininess = 40;
    globeMat.specular = new THREE.Color(0x4488bb);
    globeMat.needsUpdate = true;
  });
  loadWithFallback(BUMP_URLS, tex => {
    globeMat.normalMap = tex;
    globeMat.normalScale = new THREE.Vector2(0.06, 0.06);
    globeMat.needsUpdate = true;
  });

  // Night lights layer (additive blend over dark side)
  let nightMesh = null;
  loadWithFallback(NIGHT_URLS, tex => {
    const nightMat = new THREE.MeshLambertMaterial({
      map: tex, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    nightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 64, 64), nightMat);
    sc.add(nightMesh);
  });

  // Cloud layer
  let cloudMesh = null;
  loadWithFallback(CLOUDS_URLS, tex => {
    const cloudMat = new THREE.MeshLambertMaterial({
      map: tex, transparent: true, opacity: 0.35,
      blending: THREE.NormalBlending, depthWrite: false,
    });
    cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.012, 48, 48), cloudMat);
    sc.add(cloudMesh);
  });

  // Atmosphere glow (blue rim light — real-looking)
  const atmGeo = new THREE.SphereGeometry(1.06, 48, 48);
  const atmMat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.2, 0.55, 1.0, 1.0) * intensity;
      }
    `,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const atm = new THREE.Mesh(atmGeo, atmMat);
  sc.add(atm);

  // Outer glow shell
  sc.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.12, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0a2060, transparent: true, opacity: 0.08, side: THREE.BackSide })
  ));

  function ll3d(lat,lon,r=1.02){
    const phi=(90-lat)*(Math.PI/180),theta=(lon+180)*(Math.PI/180);
    return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));
  }

  // Pins
  const pinGrp=new THREE.Group(); sc.add(pinGrp);
  const pins=[];
  GD.forEach((d,i)=>{
    const pos=ll3d(d.lat,d.lon);
    const g=new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0,.008,.06,6),new THREE.MeshBasicMaterial({color:d.c})));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(.014,12,12),new THREE.MeshBasicMaterial({color:d.c})));
    const hm=new THREE.MeshBasicMaterial({color:d.c,transparent:true,opacity:.5,side:THREE.DoubleSide});
    g.add(new THREE.Mesh(new THREE.RingGeometry(.022,.028,24),hm));
    g.position.copy(pos);g.lookAt(new THREE.Vector3(0,0,0));g.rotateX(Math.PI/2);
    g.userData={d,i};pinGrp.add(g);pins.push(g);
  });
  // Home pin
  const hPos=ll3d(HOME.lat,HOME.lon);
  const hg=new THREE.Group();
  hg.add(new THREE.Mesh(new THREE.SphereGeometry(.018,12,12),new THREE.MeshBasicMaterial({color:0xffffff})));
  const hRm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.4,side:THREE.DoubleSide});
  hg.add(new THREE.Mesh(new THREE.RingGeometry(.026,.032,24),hRm));
  hg.position.copy(hPos);hg.lookAt(new THREE.Vector3(0,0,0));hg.rotateX(Math.PI/2);
  pinGrp.add(hg);

  // ── FEATURE 4: ANIMATED FLIGHT ARC SHADERS ──
  // Each arc is a Quadratic Bezier drawn dynamically as a "head" traces the path
  const arcGrp=new THREE.Group(); sc.add(arcGrp);
  const arcs=[];

  function mkArc(sLL,eLL,color,lift=0.48){
    const p1=ll3d(sLL.lat,sLL.lon,1.01);
    const p2=ll3d(eLL.lat,eLL.lon,1.01);
    const mid=p1.clone().add(p2).multiplyScalar(.5).normalize().multiplyScalar(1.01+lift);
    const pts=[];
    for(let t=0;t<=1;t+=0.01) pts.push(
      p1.clone().multiplyScalar((1-t)*(1-t))
        .add(mid.clone().multiplyScalar(2*(1-t)*t))
        .add(p2.clone().multiplyScalar(t*t))
    );

    // Glowing HEAD dot
    const headGeo=new THREE.SphereGeometry(.012,8,8);
    const headMat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9});
    const head=new THREE.Mesh(headGeo,headMat);
    sc.add(head);

    // TAIL line (rebuilt per frame for the "snake" effect)
    const tailMat=new THREE.LineBasicMaterial({color,transparent:true,opacity:0,linewidth:1});
    const tailLine=new THREE.Line(new THREE.BufferGeometry(),tailMat);
    arcGrp.add(tailLine);

    return {pts,head,headMat,tailLine,tailMat,progress:Math.random(), speed:.006+Math.random()*.004};
  }

  GD.forEach(d=>arcs.push(mkArc(HOME,{lat:d.lat,lon:d.lon},d.c)));

  // Decorative orbit rings
  function addOrbit(axis,n,col,op){
    const pts=[];for(let i=0;i<=n;i++){const a=(i/n)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a),Math.sin(a),0).applyAxisAngle(axis,0).multiplyScalar(1.12));}
    sc.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op})));
  }
  addOrbit(new THREE.Vector3(1,0,0),128,0xc9a84c,.12);
  addOrbit(new THREE.Vector3(0,0,1),128,0xc9a84c,.07);

  // Starfield
  const sp=[];for(let i=0;i<1200;i++){const r=8+Math.random()*6,t=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);sp.push(r*Math.sin(phi)*Math.cos(t),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(t));}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xfff5e0,size:.025,transparent:true,opacity:.6})));

  // Interaction
  let drag=false,pM={x:0,y:0},rV={x:0,y:0},autoR=true,actPin=null,zoom=2.6;
  cv.addEventListener('mousedown',e=>{drag=true;autoR=false;pM={x:e.clientX,y:e.clientY};setTimeout(()=>autoR=true,4000);});
  cv.addEventListener('mousemove',e=>{if(!drag)return;const dx=e.clientX-pM.x,dy=e.clientY-pM.y;rV.y=dx*.005;rV.x=dy*.005;globe.rotation.y+=rV.y;globe.rotation.x+=rV.x;pinGrp.rotation.y+=rV.y;pinGrp.rotation.x+=rV.x;arcGrp.rotation.y+=rV.y;arcGrp.rotation.x+=rV.x;if(cloudMesh){cloudMesh.rotation.y+=rV.y;cloudMesh.rotation.x+=rV.x;}if(nightMesh){nightMesh.rotation.y+=rV.y;nightMesh.rotation.x+=rV.x;}pM={x:e.clientX,y:e.clientY};});
  cv.addEventListener('mouseup',()=>drag=false);cv.addEventListener('mouseleave',()=>drag=false);
  cv.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.min(4,Math.max(1.8,zoom+e.deltaY*.003));},{passive:false});
  let lT=null;
  cv.addEventListener('touchstart',e=>{lT=e.touches[0];autoR=false;setTimeout(()=>autoR=true,4000);});
  cv.addEventListener('touchmove',e=>{e.preventDefault();if(!lT)return;const t=e.touches[0],dx=t.clientX-lT.clientX,dy=t.clientY-lT.clientY;globe.rotation.y+=dx*.005;globe.rotation.x+=dy*.003;pinGrp.rotation.y+=dx*.005;pinGrp.rotation.x+=dy*.003;arcGrp.rotation.y+=dx*.005;arcGrp.rotation.x+=dy*.003;if(cloudMesh){cloudMesh.rotation.y+=dx*.005;cloudMesh.rotation.x+=dy*.003;}if(nightMesh){nightMesh.rotation.y+=dx*.005;nightMesh.rotation.x+=dy*.003;}lT=t;},{passive:false});
  cv.addEventListener('touchend',()=>lT=null);

  function rotateTo(lat,lon){const tx=(lat*Math.PI/180)*0.75;let ty=-((lon+90)*Math.PI/180);const twoPi=Math.PI*2;while(ty-globe.rotation.y>Math.PI)ty-=twoPi;while(ty-globe.rotation.y<-Math.PI)ty+=twoPi;
    const sx=globe.rotation.x,sy=globe.rotation.y;let t=0;
    (function s(){t+=.04;if(t>1)return;const e=1-Math.pow(1-t,3);
    globe.rotation.x=sx+(tx-sx)*e;globe.rotation.y=sy+(ty-sy)*e;
    pinGrp.rotation.x=globe.rotation.x;pinGrp.rotation.y=globe.rotation.y;
    arcGrp.rotation.x=globe.rotation.x;arcGrp.rotation.y=globe.rotation.y;
    if(cloudMesh){cloudMesh.rotation.x=globe.rotation.x;cloudMesh.rotation.y=globe.rotation.y;}
    if(nightMesh){nightMesh.rotation.x=globe.rotation.x;nightMesh.rotation.y=globe.rotation.y;}
    requestAnimationFrame(s);})();
  }

  // Dest list
  const dList=document.getElementById('globe-dest-list');
  const pCard=document.getElementById('globe-pin'),pName=document.getElementById('globe-pin-name');
  GD.forEach((d,i)=>{
    const item=document.createElement('div');item.className='globe-dest-item';
    item.innerHTML=`<div class="globe-dest-dot"></div><div class="globe-dest-name">${d.name}</div><div class="globe-dest-coords">${d.lat>0?d.lat+'°N':Math.abs(d.lat)+'°S'} ${d.lon>0?d.lon+'°E':Math.abs(d.lon)+'°W'}</div>`;
    item.addEventListener('mouseenter',()=>{document.querySelectorAll('.globe-dest-item').forEach(el=>el.classList.remove('active'));item.classList.add('active');pName.textContent=d.name;pCard.classList.add('visible');actPin=i;autoR=false;rotateTo(d.lat,d.lon);});
    item.addEventListener('mouseleave',()=>{pCard.classList.remove('visible');actPin=null;});
    dList.appendChild(item);cHover(item);
  });

  // ── FEATURE 5 (Globe scrolls via GSAP ScrollTrigger) ──
  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger:'#globe-section',start:'top bottom',end:'bottom top',
      onUpdate:self=>{
        if(!drag && actPin===null){
          globe.rotation.y=self.progress*Math.PI*1.6;
          pinGrp.rotation.y=globe.rotation.y;
          arcGrp.rotation.y=globe.rotation.y;
          if(cloudMesh) cloudMesh.rotation.y=globe.rotation.y;
          if(nightMesh) nightMesh.rotation.y=globe.rotation.y;
        }
      }
    });
  }

  // Arc rotation sync (arcs follow globe)
  let pulse=0;
  (function animLoop(){
    requestAnimationFrame(animLoop);
    pulse+=.03;
    if(autoR&&!drag&&!window.ScrollTrigger){
      globe.rotation.y+=.0018;
      pinGrp.rotation.y+=.0018;
      arcGrp.rotation.y+=.0018;
      if(cloudMesh)  cloudMesh.rotation.y = globe.rotation.y + pulse * 0.0004;
      if(nightMesh)  nightMesh.rotation.y = globe.rotation.y;
    }
    if(!drag&&!autoR){
      rV.x*=.92;rV.y*=.92;
      globe.rotation.y+=rV.y;globe.rotation.x+=rV.x;
      pinGrp.rotation.y+=rV.y;pinGrp.rotation.x+=rV.x;
      arcGrp.rotation.y+=rV.y;arcGrp.rotation.x+=rV.x;
      if(cloudMesh){ cloudMesh.rotation.y=globe.rotation.y; cloudMesh.rotation.x=globe.rotation.x; }
      if(nightMesh){ nightMesh.rotation.y=globe.rotation.y; nightMesh.rotation.x=globe.rotation.x; }
    }
    cam.position.z+=(zoom-cam.position.z)*.06;

    // Pins pulse
    pins.forEach((pg,i)=>{
      const off=(i/pins.length)*Math.PI*2,s=1+.25*Math.sin(pulse+off);
      if(pg.children[2]){pg.children[2].scale.setScalar(s);pg.children[2].material.opacity=.3+.2*Math.sin(pulse+off);}
      pg.children[1].material.color.setHex(actPin===i?0xfff5e0:pg.userData.d.c);
    });
    if(hg.children[1]){hg.children[1].scale.setScalar(1+.3*Math.sin(pulse*.7));hg.children[1].material.opacity=.3+.25*Math.sin(pulse*.7);}

    // ── Flight arcs animation ──
    // Apply globe rotation to the HEAD position (world space = globe space)
    const globeQuat=globe.quaternion;

    arcs.forEach(arc=>{
      arc.progress+=arc.speed;
      if(arc.progress>1.3) arc.progress=-0.2;

      const prog=arc.progress;
      const tail=0.18;
      const head=Math.max(0,Math.min(1,prog));
      const tailStart=Math.max(0,head-tail);
      const N=arc.pts.length;

      // Head position (in globe local space → world space via quaternion)
      if(prog>0&&prog<1){
        const hi=Math.min(N-1,Math.floor(head*(N-1)));
        const wp=arc.pts[hi].clone().applyQuaternion(globeQuat);
        arc.head.position.copy(wp);
        arc.headMat.opacity=Math.sin(prog*Math.PI)*0.9;
      } else {
        arc.headMat.opacity=0;
      }

      // Tail (visible segment)
      const visP=[];
      const si=Math.floor(tailStart*(N-1));
      const ei=Math.min(N-1,Math.floor(head*(N-1)));
      for(let j=si;j<=ei;j++) visP.push(arc.pts[j].clone().applyQuaternion(globeQuat));

      if(visP.length>=2){
        arc.tailLine.geometry.setFromPoints(visP);
        arc.tailMat.opacity=prog>0&&prog<1.1?0.5:0;
      } else {
        arc.tailMat.opacity=0;
      }
    });

    rnd.render(sc,cam);
  })();

  window.addEventListener('resize',()=>{
    const S2=getSize();
    cv.style.width=S2+'px';cv.style.height=S2+'px';cv.width=S2*devicePixelRatio;cv.height=S2*devicePixelRatio;rnd.setSize(S2,S2);
  });
}); // end window load — globe
