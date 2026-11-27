/* ═══════════════════════════════════════════════════
   FEATURE 2 — GOLDEN HOUR (time-based CSS theme)
═══════════════════════════════════════════════════ */
(function goldenHour(){
  function applyMode(h, latOffset){
    const d = h >= (4-latOffset)  && h < (7+latOffset);
    const day = h >= (7+latOffset) && h < (17+latOffset);
    const dk = h >= (17+latOffset) && h < (21+latOffset);
    const body = document.body;
    body.classList.remove('mode-dawn','mode-dusk','mode-night');
    let label='';
    if(d)   { body.classList.add('mode-dawn');  label='🌅 Dawn Mode';  }
    else if(day) {                              label='☀ Day Mode';   }
    else if(dk)  { body.classList.add('mode-dusk');  label='🌇 Dusk Mode';  }
    else         { body.classList.add('mode-night'); label='🌙 Night Mode'; }
    const lbl=document.getElementById('time-label');
    if(lbl) lbl.textContent=label;
  }
  function run(){
    const h=new Date().getHours();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(p=>{
        const off=Math.abs(p.coords.latitude)>55?1:0;
        applyMode(h,off);
      },()=>applyMode(h,0),{timeout:3000});
    } else applyMode(h,0);
  }
  run();
  setInterval(run,5*60*1000);
})();
