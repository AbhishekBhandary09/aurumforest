/* ═══════════════════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════════════════ */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',scrollY>60));
