/* ═══════════════════════════════════════════════════
   RENDER — destination cards + slider, timeline, gallery
═══════════════════════════════════════════════════ */

const track=document.getElementById('cards-track');
DESTS.forEach(d=>{
  track.innerHTML+=`<div class="dest-card"><img class="card-img" src="${d.img}" alt="${d.title}" loading="lazy"/><div class="card-overlay"></div><div class="card-body"><span class="card-tag">${d.tag}</span><div class="card-location">${d.location}</div><div class="card-title">${d.title}</div><div class="card-meta"><div class="card-price">${d.price} <span>${d.unit}</span></div><span class="mag-wrap"><button class="card-btn">Quick Book</button></span></div></div></div>`;
});
let ci=0;
document.getElementById('next-btn').addEventListener('click',()=>{ if(ci<DESTS.length-3){ci++;track.style.transform=`translateX(-${ci*364}px)`;} });
document.getElementById('prev-btn').addEventListener('click',()=>{ if(ci>0){ci--;track.style.transform=`translateX(-${ci*364}px)`;} });


const tEl=document.getElementById('timeline');
ITIN.forEach((it,i)=>{
  tEl.innerHTML+=`<div class="timeline-item" style="transition-delay:${i*.12}s"><div class="timeline-dot">${it.icon}</div><div class="timeline-day">${it.day}</div><div class="timeline-event">${it.event}</div><div class="timeline-desc">${it.desc}</div></div>`;
});

const mas=document.getElementById('masonry-grid');
GAL.forEach(p=>{ mas.innerHTML+=`<div class="masonry-item"><img src="${p.img}" alt="${p.t}" loading="lazy"/><div class="masonry-overlay"><div class="masonry-traveler">${p.t}</div><div class="masonry-location">${p.l}</div></div></div>`; });
