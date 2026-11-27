/* ═══════════════════════════════════════════════════
   INTERACTIVE — Search, Booking, Newsletter, Nav
═══════════════════════════════════════════════════ */
(function wireAll(){

  /* Smooth scroll nav links */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* Search bar */
  const searchBtn=document.querySelector('.search-btn');
  const sInputs=document.querySelectorAll('.search-input');
  function doSearch(){
    const dest=(sInputs[0]?.value||'').trim();
    if(!dest){ flashBorder(sInputs[0]); return; }
    document.getElementById('destinations')?.scrollIntoView({behavior:'smooth'});
    showToast(`✦ Searching for "${dest}"…`);
  }
  if(searchBtn) searchBtn.addEventListener('click',doSearch);
  sInputs.forEach(inp=>inp.addEventListener('keydown',e=>{ if(e.key==='Enter') doSearch(); }));

  /* Book a Journey (nav CTA) → open concierge */
  document.querySelector('.nav-cta')?.addEventListener('click',()=>{
    document.getElementById('concierge-fab')?.click();
  });

  /* Quick Book on destination cards */
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.card-btn');
    if(!btn) return;
    const title=btn.closest('.dest-card')?.querySelector('.card-title')?.textContent||'this destination';
    const price=btn.closest('.dest-card')?.querySelector('.card-price')?.childNodes[0]?.textContent||'';
    showToast(`✦ Loading booking for ${title}…`);
    if(window.openConciergeWith) window.openConciergeWith(`I'd like to book a luxury trip to ${title} (${price}). What does it include?`);
  });

  /* Globe destination list → open concierge */
  document.addEventListener('click',e=>{
    const item=e.target.closest('.globe-dest-item');
    if(!item) return;
    const name=item.querySelector('.globe-dest-name')?.textContent;
    if(name && window.openConciergeWith) window.openConciergeWith(`Plan a luxury 7-day trip to ${name}`);
  });

  /* Newsletter */
  const nlBtn=document.querySelector('.newsletter-btn');
  const nlInput=document.querySelector('.newsletter-input');
  if(nlBtn) nlBtn.addEventListener('click',()=>{
    const email=(nlInput?.value||'').trim();
    if(!email||!email.includes('@')){ flashBorder(nlInput); return; }
    showToast('✦ Subscribed! Welcome to AurumForest.');
    if(nlInput) nlInput.value='';
  });
  if(nlInput) nlInput.addEventListener('keydown',e=>{ if(e.key==='Enter') nlBtn?.click(); });

  /* Footer links */
  document.querySelectorAll('.footer-links a, .footer-bottom-links a').forEach(a=>{
    a.addEventListener('click',e=>{ e.preventDefault(); showToast('✦ Coming soon.'); });
  });

  /* Social links */
  document.querySelectorAll('.social-link').forEach(a=>{
    a.addEventListener('click',e=>{ e.preventDefault(); showToast('✦ Social pages launching soon.'); });
  });

  /* ── Toast ── */
  function showToast(msg){
    const ex=document.getElementById('aurum-toast');
    if(ex) ex.remove();
    const t=document.createElement('div');
    t.id='aurum-toast';
    t.textContent=msg;
    t.style.cssText=
      'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(16px);'+
      'background:rgba(20,32,20,.96);backdrop-filter:blur(16px);'+
      'border:1px solid var(--glass-border);color:var(--gold-light);'+
      "font-family:'DM Sans',sans-serif;font-size:.75rem;letter-spacing:.1em;"+
      'padding:12px 28px;z-index:3000;opacity:0;'+
      'transition:opacity .3s,transform .3s;white-space:nowrap;pointer-events:none;';
    document.body.appendChild(t);
    requestAnimationFrame(()=>{
      t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)';
      setTimeout(()=>{
        t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(10px)';
        setTimeout(()=>t.remove(),400);
      },2800);
    });
  }

  window.aurumToast=showToast;

  /* ── Flash border ── */
  function flashBorder(el){
    if(!el) return;
    const orig=el.style.borderColor;
    el.style.borderColor='#e05555'; el.style.transition='border-color .3s'; el.focus();
    setTimeout(()=>el.style.borderColor=orig,1800);
  }

})();
