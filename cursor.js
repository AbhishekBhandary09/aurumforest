/* ═══════════════════════════════════════════════════
   FEATURE 1 — CUSTOM CURSOR
═══════════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
(function raf(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(raf); })();
function cHover(el){
  el.addEventListener('mouseenter',()=>{cursor.classList.add('ex');ring.classList.add('ex');});
  el.addEventListener('mouseleave',()=>{cursor.classList.remove('ex');ring.classList.remove('ex');});
}
document.querySelectorAll('a,button,input,textarea,.dest-card,.masonry-item,.sugg-chip').forEach(cHover);
