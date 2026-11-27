/* ═══════════════════════════════════════════════════
   FEATURE 5 — MAGNETIC BUTTONS
═══════════════════════════════════════════════════ */
(function magnetic(){
  const R=80;
  document.querySelectorAll('.mag-wrap').forEach(wrap=>{
    const btn=wrap.querySelector('button,a');
    if(!btn) return;
    let tx=0,ty=0,cx=0,cy=0;
    (function tick(){cx+=(tx-cx)*.13;cy+=(ty-cy)*.13;btn.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(tick);})();
    window.addEventListener('mousemove',e=>{
      const r=wrap.getBoundingClientRect();
      const bx=r.left+r.width/2,by=r.top+r.height/2;
      const dx=e.clientX-bx,dy=e.clientY-by,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<R){
        const pull=(1-dist/R);
        tx=dx*pull*.42;ty=dy*pull*.42;
        btn.style.boxShadow=`0 0 ${Math.round(pull*32)}px rgba(201,168,76,${(pull*.6).toFixed(2)})`;
      } else {
        tx=0;ty=0;btn.style.boxShadow='';
      }
    });
  });
})();
