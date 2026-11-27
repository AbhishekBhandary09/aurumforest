/* ═══════════════════════════════════════════════════
   INTERSECTION OBSERVERS (reveal + timeline)
═══════════════════════════════════════════════════ */
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
const to=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.3});
document.querySelectorAll('.timeline-item').forEach(el=>to.observe(el));

// Late cursor hook for dynamically added elements
setTimeout(()=>document.querySelectorAll('.dest-card,.card-btn,.slider-btn,.masonry-item,.globe-dest-item,.social-link,.footer-links a,.nav-links a').forEach(cHover),600);
