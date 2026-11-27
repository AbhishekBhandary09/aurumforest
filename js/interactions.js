/* INTERACTIVE — Live Search, Booking, Newsletter, Nav */
(function wireAll(){
  document.querySelectorAll("a[href^=\"#\"]").forEach(a=>{
    a.addEventListener("click",e=>{
      const t=document.querySelector(a.getAttribute("href"));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:"smooth",block:"start"}); }
    });
  });

  const searchBtn=document.querySelector(".search-btn");
  const sInputs=document.querySelectorAll(".search-input");
  function doSearch(){
    const q=(sInputs[0]?.value||"").trim().toLowerCase();
    const cards=document.querySelectorAll(".dest-card");
    let matched=0;
    cards.forEach(c=>{
      const txt=c.textContent.toLowerCase();
      const show=!q||txt.includes(q);
      c.style.display=show?"":"none";
      if(show) matched++;
    });
    document.getElementById("destinations")?.scrollIntoView({behavior:"smooth"});
    showToast(q ? `✦ Showing ${matched} expedition(s) for "${sInputs[0].value.trim()}"` : "✦ Showing all curated expeditions");
  }
  if(searchBtn) searchBtn.addEventListener("click",doSearch);
  sInputs.forEach(inp=>{
    inp.addEventListener("keydown",e=>{ if(e.key==="Enter") doSearch(); });
    inp.addEventListener("input",()=>{ if(!inp.value.trim()) document.querySelectorAll(".dest-card").forEach(c=>c.style.display=""); });
  });

  document.querySelector(".nav-cta")?.addEventListener("click",()=>{
    document.getElementById("concierge-fab")?.click();
  });

  document.addEventListener("click",e=>{
    const item=e.target.closest(".globe-dest-item");
    if(!item) return;
    const name=item.querySelector(".globe-dest-name")?.textContent;
    if(name && window.openConciergeWith) window.openConciergeWith(`Plan a luxury 7-day trip to ${name}`);
  });

  const nlBtn=document.querySelector(".newsletter-btn");
  const nlInput=document.querySelector(".newsletter-input");
  if(nlBtn) nlBtn.addEventListener("click",()=>{
    const email=(nlInput?.value||"").trim();
    if(!email||!email.includes("@")){ flashBorder(nlInput); return; }
    showToast("✦ Subscribed! Welcome to AurumForest.");
    if(nlInput) nlInput.value="";
  });
  if(nlInput) nlInput.addEventListener("keydown",e=>{ if(e.key==="Enter") nlBtn?.click(); });

  function showToast(msg){
    const ex=document.getElementById("aurum-toast"); if(ex) ex.remove();
    const t=document.createElement("div"); t.id="aurum-toast"; t.textContent=msg;
    t.style.cssText="position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(16px);background:rgba(20,32,20,.96);backdrop-filter:blur(16px);border:1px solid var(--glass-border);color:var(--gold-light);font-family:'DM Sans',sans-serif;font-size:.75rem;letter-spacing:.1em;padding:12px 28px;z-index:3000;opacity:0;transition:opacity .3s,transform .3s;white-space:nowrap;pointer-events:none;";
    document.body.appendChild(t);
    requestAnimationFrame(()=>{ t.style.opacity="1"; t.style.transform="translateX(-50%) translateY(0)"; setTimeout(()=>{ t.style.opacity="0"; t.style.transform="translateX(-50%) translateY(10px)"; setTimeout(()=>t.remove(),400); },2800); });
  }
  window.aurumToast=showToast;
  function flashBorder(el){ if(!el) return; const o=el.style.borderColor; el.style.borderColor="#e05555"; el.focus(); setTimeout(()=>el.style.borderColor=o,1800); }
})();