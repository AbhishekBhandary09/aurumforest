/* ═══════════════════════════════════════════════════
   FEATURE 6 — AI CONCIERGE (fully working)
═══════════════════════════════════════════════════ */
(function concierge(){
  const fab     = document.getElementById('concierge-fab');
  const panel   = document.getElementById('concierge-panel');
  const closeBtn= document.getElementById('c-close');
  const msgs    = document.getElementById('c-msgs');
  const input   = document.getElementById('c-input');
  const send    = document.getElementById('c-send');
  let open=false, busy=false;
  const history=[];

  /* ── API Key management ── */
  let apiKey = localStorage.getItem('aurum_api_key') || '';

  function showKeyPrompt(){
    if(document.getElementById('key-prompt')) return;
    const d=document.createElement('div');
    d.className='msg msg-a'; d.id='key-prompt';
    d.innerHTML=`<strong style="color:var(--gold-light)">🔑 API Key Required</strong>
      <p style="font-size:.8rem;color:var(--slate-light);line-height:1.6;margin:10px 0 12px">
        Enter your free
        <a href="https://console.anthropic.com/keys" target="_blank"
           style="color:var(--gold-light);text-decoration:underline">Anthropic API key</a>
        to activate the AI Concierge. Stored only in your browser.
      </p>
      <div style="display:flex;gap:8px">
        <input id="key-input" type="password" placeholder="sk-ant-…"
          style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--glass-border);
                 outline:none;color:var(--white);font-family:'DM Sans',sans-serif;
                 font-size:.8rem;padding:9px 12px" />
        <button id="key-save"
          style="background:var(--gold);border:none;padding:9px 16px;color:var(--forest);
                 font-size:.75rem;font-weight:500;cursor:pointer;white-space:nowrap">
          Save Key
        </button>
      </div>
      <p style="font-size:.68rem;color:var(--slate);margin-top:8px">
        Your key never leaves your device. Click 🗑 below to clear it anytime.
      </p>`;
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
    const ki=document.getElementById('key-input');
    const ks=document.getElementById('key-save');
    if(ki) ki.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveKey();}});
    if(ks) ks.addEventListener('click',saveKey);
  }

  function saveKey(){
    const ki=document.getElementById('key-input');
    const val=(ki?.value||'').trim();
    if(!val.startsWith('sk-ant-') && !val.startsWith('sk-')){
      if(ki){ ki.style.borderColor='#e05555'; ki.focus(); }
      return;
    }
    apiKey=val;
    localStorage.setItem('aurum_api_key',apiKey);
    const kp=document.getElementById('key-prompt');
    if(kp) kp.remove();
    addClearKeyBtn();
    addMsg('✦ Key saved! Tell me your dream journey — I\'ll craft a bespoke itinerary.','assistant');
    input.focus();
  }

  function addClearKeyBtn(){
    if(document.getElementById('clear-key-btn')) return;
    const btn=document.createElement('button');
    btn.id='clear-key-btn';
    btn.title='Clear saved API key';
    btn.innerHTML='🗑 Clear Key';
    btn.style.cssText='position:fixed;bottom:104px;left:36px;z-index:2001;'+
      'background:rgba(20,32,20,.85);border:1px solid var(--glass-border);'+
      'color:var(--slate);font-size:.65rem;letter-spacing:.1em;padding:7px 14px;'+
      'cursor:pointer;transition:all .2s;backdrop-filter:blur(8px);font-family:"DM Sans",sans-serif';
    btn.addEventListener('mouseenter',()=>{ btn.style.color='var(--gold)'; btn.style.borderColor='var(--gold)'; });
    btn.addEventListener('mouseleave',()=>{ btn.style.color='var(--slate)'; btn.style.borderColor='var(--glass-border)'; });
    btn.addEventListener('click',()=>{
      localStorage.removeItem('aurum_api_key');
      apiKey=''; btn.remove();
      const kp=document.getElementById('key-prompt');
      if(kp) kp.remove();
      addMsg('API key cleared. Enter a new key to continue.','assistant');
      showKeyPrompt();
    });
    document.body.appendChild(btn);
  }

  const SYS=`You are AurumForest Concierge, the AI travel planner for AurumForest — an ultra-luxury travel company. You craft exquisite, highly personalised travel itineraries.

When asked for a trip, reply with:
1. One elegant opening sentence (evocative, aspirational tone)
2. A JSON block in EXACTLY this format — no extra text inside the block:
\`\`\`json
{"destination":"...","duration":"X days","theme":"...","days":[{"day":1,"title":"...","activities":"..."}],"accommodation":"...","priceFrom":"£X,XXX per person"}
\`\`\`
3. One closing sentence offering to personalise further.
Keep the tone refined, evocative, world-class. Suggest only premium experiences.`;

  function toggle(){
    open=!open;
    panel.classList.toggle('open',open);
    if(open){
      input.focus();
      if(apiKey) addClearKeyBtn();
      else if(!document.getElementById('key-prompt')) showKeyPrompt();
    }
  }

  fab.addEventListener('click',toggle);
  closeBtn.addEventListener('click',toggle);
  [fab,closeBtn,send].forEach(cHover);

  document.getElementById('c-sugg').querySelectorAll('.sugg-chip').forEach(c=>{
    c.addEventListener('click',()=>{ input.value=c.textContent; sendMsg(); });
    cHover(c);
  });

  function addMsg(html,role){
    const d=document.createElement('div');
    d.className=`msg msg-${role==='assistant'?'a':'u'}`;
    d.innerHTML = role==='user'
      ? `<span style="font-size:.85rem">${html}</span>`
      : html;
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
  }

  function showTyping(){
    const d=document.createElement('div');
    d.className='typing'; d.id='typing';
    d.innerHTML='<div class="td"></div><div class="td"></div><div class="td"></div>';
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
  }
  function hideTyping(){ const t=document.getElementById('typing'); if(t) t.remove(); }

  function renderItinerary(text){
    const m=text.match(/```json\n?([\s\S]*?)\n?```/);
    if(!m) return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    const pre =text.slice(0, text.indexOf('```json')).trim();
    const post=text.slice(text.indexOf('```json')+m[0].length).trim();
    let card='';
    try{
      const d=JSON.parse(m[1]);
      card='<div class="itin-card">';
      if(d.destination) card+=`<div style="font-size:.95rem;color:var(--gold-light);font-family:'Cormorant Garamond',serif;margin-bottom:8px">✦ ${d.destination} · ${d.duration}</div>`;
      if(d.theme) card+=`<div style="font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">${d.theme}</div>`;
      if(d.days) d.days.forEach(dy=>{
        card+=`<div class="itin-card-day"><div class="itin-day-num">Day ${dy.day}</div><div class="itin-day-text"><span class="itin-day-hi">${dy.title}</span>${dy.activities}</div></div>`;
      });
      if(d.accommodation) card+=`<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(201,168,76,.15);font-size:.75rem;color:var(--slate)">🏨 ${d.accommodation}</div>`;
      if(d.priceFrom) card+=`<div style="margin-top:6px;font-size:.82rem;color:var(--gold-light);font-weight:500">From ${d.priceFrom}</div>`;
      card+=`<button onclick="window.aurumToast&&window.aurumToast('✦ Booking request sent for this journey!')"
        style="margin-top:12px;background:var(--gold);border:none;padding:8px 18px;color:var(--forest);
               font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;font-family:'DM Sans',sans-serif;
               font-weight:500;cursor:pointer;transition:background .2s"
        onmouseover="this.style.background='var(--gold-light)'"
        onmouseout="this.style.background='var(--gold)'">✦ Book This Journey</button>`;
      card+='</div>';
    } catch(e){
      card=`<p style="color:var(--slate-light);font-size:.85rem;line-height:1.7">${text.replace(/\n/g,'<br>')}</p>`;
    }
    return (pre?`<p style="margin-bottom:10px;line-height:1.7">${pre}</p>`:'')+card+(post?`<p style="margin-top:10px;line-height:1.7">${post}</p>`:'');
  }

  async function sendMsg(){
    const txt=input.value.trim();
    if(!txt||busy) return;

    if(!apiKey){
      if(!open) toggle();
      showKeyPrompt();
      return;
    }

    busy=true;
    input.value=''; input.style.height='auto';
    document.getElementById('c-sugg').style.display='none';
    addMsg(txt,'user'); showTyping();
    history.push({role:'user',content:txt});

    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-api-key': apiKey,
          'anthropic-version':'2023-06-01',
          'anthropic-dangerous-direct-browser-access':'true'
        },
        body:JSON.stringify({
          model:'claude-opus-4-5',
          max_tokens:1024,
          system:SYS,
          messages:history
        })
      });

      if(!res.ok){
        const err=await res.json().catch(()=>({}));
        throw new Error(err?.error?.message||`HTTP ${res.status}`);
      }

      const data=await res.json();
      hideTyping();
      const reply=data.content?.[0]?.text||'I could not generate a response. Please try again.';
      history.push({role:'assistant',content:reply});
      addMsg(renderItinerary(reply),'assistant');

    } catch(e){
      hideTyping();
      const isAuth=e.message.includes('401')||e.message.includes('403')||e.message.toLowerCase().includes('invalid');
      const isNet =e.message.includes('Failed to fetch')||e.message.includes('NetworkError')||e.message.includes('CORS');
      const msg = isAuth
        ? '🔑 Invalid API key. Please re-enter your key.'
        : isNet
        ? '🌐 Network error — check your internet connection and try again.'
        : `⚠️ ${e.message}`;
      addMsg(msg,'assistant');
      if(isAuth){ apiKey=''; localStorage.removeItem('aurum_api_key'); showKeyPrompt(); }
    }
    busy=false;
  }

  send.addEventListener('click',sendMsg);
  input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg(); } });
  input.addEventListener('input',()=>{ input.style.height='auto'; input.style.height=Math.min(input.scrollHeight,80)+'px'; });

  // Expose to globe click handler
  window.openConciergeWith=function(query){
    if(!open) toggle();
    input.value=query; input.focus();
  };
})();
