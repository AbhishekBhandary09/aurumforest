/* ═══════════════════════════════════════════════════
   FEATURE 4 — GSAP PARALLAX & SCROLL ANIMATIONS
═══════════════════════════════════════════════════ */
if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax scrub
  gsap.to('#hero-title',{yPercent:22,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('#hero-sub',{yPercent:14,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});

  // Destination cards stagger in
  gsap.utils.toArray('.dest-card').forEach((card,i)=>{
    gsap.fromTo(card,{opacity:0,y:60},{opacity:1,y:0,duration:.9,ease:'power3.out',
      scrollTrigger:{trigger:card,start:'top 85%',toggleActions:'play none none none'},delay:i*.1});
  });

  // Section titles slide
  gsap.utils.toArray('.section-title').forEach(el=>{
    gsap.fromTo(el,{opacity:0,x:-40},{opacity:1,x:0,duration:1,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 86%',toggleActions:'play none none none'}});
  });

  // Masonry stagger
  gsap.utils.toArray('.masonry-item').forEach((el,i)=>{
    gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:.75,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'},delay:(i%4)*.09});
  });

  // Stat count-up
  gsap.utils.toArray('.stat-number').forEach(el=>{
    ScrollTrigger.create({trigger:el,start:'top 80%',once:true,onEnter:()=>{
      const raw=el.textContent,num=parseFloat(raw.replace(/[^0-9.]/g,'')),suf=raw.replace(/[\d,.]/g,'');
      if(!isNaN(num)) gsap.fromTo({v:0},{v:num},{duration:2,ease:'power2.out',
        onUpdate:function(){el.textContent=Math.round(this.targets()[0].v).toLocaleString()+suf;}});
    }});
  });
}
