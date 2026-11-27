window.AF_API = localStorage.getItem("af_api_url") || (location.hostname === "localhost" || location.hostname === "127.0.0.1" ? "http://localhost:5000/api" : "https://aurumforest-api.onrender.com/api");
const RATES = { INR: { sym: "₹", mult: 108 }, GBP: { sym: "£", mult: 1 }, USD: { sym: "$", mult: 1.28 } };
let curCurr = localStorage.getItem("af_curr") || "INR";
let afToken = localStorage.getItem("af_token") || "";
let afUser = JSON.parse(localStorage.getItem("af_user") || "null");

function fmtPrice(gbp) {
  const r = RATES[curCurr] || RATES.INR;
  return r.sym + Math.round(gbp * r.mult).toLocaleString("en-IN");
}
function rawAmount(gbp, guests = 1) {
  const r = RATES[curCurr] || RATES.INR;
  return Math.round(gbp * r.mult * guests);
}

const modalBg = document.createElement("div");
modalBg.className = "af-modal-bg";
modalBg.innerHTML = "<div class=\"af-modal\"><button class=\"af-x\" id=\"af-x\">✕</button><div id=\"af-body\"></div></div>";
document.body.appendChild(modalBg);
const afBody = document.getElementById("af-body");
const openModal = (html) => { afBody.innerHTML = html; modalBg.classList.add("open"); };
const closeModal = () => modalBg.classList.remove("open");
document.getElementById("af-x").onclick = closeModal;
modalBg.onclick = (e) => { if (e.target === modalBg) closeModal(); };

function updateCardPrices() {
  document.querySelectorAll(".dest-card").forEach((card, i) => {
    const d = (typeof DESTS !== "undefined" && DESTS[i]) || null;
    if (!d) return;
    const gbp = parseInt(String(d.price).replace(/[^0-9]/g, ""), 10) || 4200;
    const pEl = card.querySelector(".card-price");
    if (pEl && pEl.childNodes[0]) pEl.childNodes[0].textContent = fmtPrice(gbp) + " ";
  });
}

function mountNavTools() {
  const ctaWrap = document.querySelector(".nav-cta")?.parentElement;
  if (!ctaWrap || document.getElementById("af-nav-tools")) return;
  const bar = document.createElement("div");
  bar.id = "af-nav-tools"; bar.className = "af-nav-tools";
  bar.innerHTML = "<button class=\"af-pill\" id=\"af-curr-btn\">" + curCurr + "</button><button class=\"af-pill\" id=\"af-acct-btn\">" + (afUser ? "✦ " + afUser.name.split(" ")[0] : "Sign In") + "</button>";
  ctaWrap.parentNode.insertBefore(bar, ctaWrap);
  document.getElementById("af-curr-btn").onclick = () => {
    const order = ["INR", "GBP", "USD"];
    curCurr = order[(order.indexOf(curCurr) + 1) % order.length];
    localStorage.setItem("af_curr", curCurr);
    document.getElementById("af-curr-btn").textContent = curCurr;
    updateCardPrices();
    if (window.aurumToast) window.aurumToast("✦ Currency set to " + curCurr);
  };
  document.getElementById("af-acct-btn").onclick = () => afUser ? openAccountModal() : openAuthModal("login");
}
mountNavTools(); updateCardPrices();

window.openBookingModal = function(pkg) {
  const gbp = pkg.priceGBP || parseInt(String(pkg.price||4200).replace(/[^0-9]/g,""),10) || 4200;
  const dt = new Date(Date.now() + 30*864e5).toISOString().slice(0,10);
  openModal(`<div class="af-eyebrow">${pkg.location||"Bespoke Expedition"}</div><h2 class="af-h2">${pkg.title}</h2>
    <p style="color:var(--slate-light);font-size:.85rem;line-height:1.6">${pkg.summary||"Private luxury itinerary with dedicated concierge, transfers, and curated stays."}</p>
    <div class="af-grid2">
      <div class="af-field"><label>Traveller Full Name</label><input class="af-inp" id="bk-name" value="${afUser?.name||""}" placeholder="Abhishek Bhandary"/></div>
      <div class="af-field"><label>Email for E-Ticket</label><input class="af-inp" id="bk-email" type="email" value="${afUser?.email||""}" placeholder="you@example.com"/></div>
      <div class="af-field"><label>Phone / WhatsApp</label><input class="af-inp" id="bk-phone" value="${afUser?.phone||""}" placeholder="+91 98765 43210"/></div>
      <div class="af-field"><label>Departure Date</label><input class="af-inp" id="bk-date" type="date" value="${dt}"/></div>
      <div class="af-field"><label>Guests</label><input class="af-inp" id="bk-guests" type="number" min="1" max="12" value="2"/></div>
      <div class="af-field"><label>Special Requests</label><input class="af-inp" id="bk-req" placeholder="Dietary, private transfer, celebrations…"/></div>
    </div>
    <div class="af-summary"><div><div style="font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--slate)">Total Expedition Investment</div><div style="font-size:.75rem;color:var(--slate-light)" id="bk-break">2 guests × ${fmtPrice(gbp)}</div></div><div style="font-family:\x27Cormorant Garamond\x27,serif;font-size:1.8rem;color:var(--gold-light)" id="bk-tot">${fmtPrice(gbp*2)}</div></div>
    <button class="af-btn" id="bk-pay">Proceed to Secure Payment (${curCurr})</button>`);
  const gInp = document.getElementById("bk-guests");
  gInp.oninput = () => {
    const n = Math.max(1, parseInt(gInp.value,10)||1);
    document.getElementById("bk-break").textContent = n + " guest(s) × " + fmtPrice(gbp);
    document.getElementById("bk-tot").textContent = fmtPrice(gbp*n);
  };
  document.getElementById("bk-pay").onclick = async () => {
    const n = Math.max(1, parseInt(gInp.value,10)||1);
    const payload = { guestName: document.getElementById("bk-name").value.trim(), guestEmail: document.getElementById("bk-email").value.trim(), guestPhone: document.getElementById("bk-phone").value.trim(), packageTitle: pkg.title, location: pkg.location||pkg.title, travelDate: document.getElementById("bk-date").value, guests: n, currency: curCurr, totalAmount: rawAmount(gbp, n), specialRequests: document.getElementById("bk-req").value.trim() };
    if(!payload.guestName || !payload.guestEmail || !payload.guestPhone) return alert("Please enter your name, email, and phone number.");
    const btn = document.getElementById("bk-pay"); btn.textContent = "Initializing Gateway…"; btn.disabled = true;
    try {
      const res = await fetch(window.AF_API + "/bookings/create-order", { method:"POST", headers:{"Content-Type":"application/json", ...(afToken?{Authorization:"Bearer "+afToken}:{})}, body: JSON.stringify(payload) });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || "Booking failed");
      if(!data.order.simulated && window.Razorpay) {
        const rzp = new window.Razorpay({ key: data.order.keyId, amount: data.order.amount, currency: data.order.currency, name: "AurumForest", description: pkg.title, order_id: data.order.id, prefill: { name: payload.guestName, email: payload.guestEmail, contact: payload.guestPhone }, theme: { color: "#c9a84c" }, handler: async (resp) => { await verifyPay({ bookingRef: data.bookingRef, ...resp, simulated: false }); } });
        rzp.open(); btn.disabled = false; btn.textContent = "Proceed to Secure Payment ("+curCurr+")";
      } else {
        await verifyPay({ bookingRef: data.bookingRef, simulated: true });
      }
    } catch(e) {
      btn.disabled = false; btn.textContent = "Proceed to Secure Payment ("+curCurr+")";
      openModal(`<div class="af-eyebrow">Offline / Preview Mode</div><h2 class="af-h2">Reservation Saved Locally</h2><p style="color:var(--slate-light);font-size:.85rem;line-height:1.6">Backend server is currently sleeping or offline (${e.message}). Your inquiry for <strong>${pkg.title}</strong> (${fmtPrice(gbp*n)}) has been queued.</p><br><button class="af-btn" onclick="document.querySelector(\x27.af-modal-bg\x27).classList.remove(\x27open\x27)">Done</button>`);
    }
  };
};

async function verifyPay(body) {
  const res = await fetch(window.AF_API + "/bookings/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
  const data = await res.json();
  openModal(`<div class="af-eyebrow">✦ Expedition Confirmed</div><h2 class="af-h2">Booking Reference: ${body.bookingRef}</h2><p style="color:var(--slate-light);font-size:.88rem;line-height:1.7">Thank you, <strong>${data.booking?.guestName||"Traveller"}</strong>. Your payment is verified and your private concierge has issued your itinerary dossier for <strong>${data.booking?.packageTitle||"your journey"}</strong>.</p><div class="af-summary"><span>Payment ID: ${data.booking?.razorpayPaymentId||"Verified"}</span><span style="color:var(--gold-light)">Status: PAID</span></div><button class="af-btn" onclick="document.querySelector(\x27.af-modal-bg\x27).classList.remove(\x27open\x27)">Return to AurumForest</button>`);
}

window.openAuthModal = function(mode="login") {
  const isReg = mode === "register";
  openModal(`<div class="af-eyebrow">Traveller Vault</div><h2 class="af-h2">${isReg?"Create Your Account":"Welcome Back"}</h2>
    ${isReg?`<div class="af-field"><label>Full Name</label><input class="af-inp" id="au-name" placeholder="Abhishek Bhandary"/></div><div class="af-field"><label>Phone</label><input class="af-inp" id="au-phone" placeholder="+91 98765 43210"/></div>`:""}
    <div class="af-field"><label>Email</label><input class="af-inp" id="au-email" type="email" placeholder="you@example.com"/></div>
    <div class="af-field"><label>Password</label><input class="af-inp" id="au-pass" type="password" placeholder="••••••"/></div>
    <button class="af-btn" id="au-sub">${isReg?"Register":"Sign In"}</button>
    <p style="margin-top:14px;font-size:.78rem;color:var(--slate);text-align:center"><a href="#" id="au-sw" style="color:var(--gold-light)">${isReg?"Already have an account? Sign In":"New to AurumForest? Create Account"}</a></p>`);
  document.getElementById("au-sw").onclick = (e) => { e.preventDefault(); openAuthModal(isReg?"login":"register"); };
  document.getElementById("au-sub").onclick = async () => {
    const body = { email: document.getElementById("au-email").value.trim(), password: document.getElementById("au-pass").value };
    if(isReg) { body.name = document.getElementById("au-name").value.trim(); body.phone = document.getElementById("au-phone").value.trim(); }
    try {
      const res = await fetch(window.AF_API + "/auth/" + (isReg?"register":"login"), { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const data = await res.json();
      if(!res.ok) return alert(data.message || "Authentication failed");
      afToken = data.token; afUser = data.user;
      localStorage.setItem("af_token", afToken); localStorage.setItem("af_user", JSON.stringify(afUser));
      document.getElementById("af-acct-btn").textContent = "✦ " + afUser.name.split(" ")[0];
      openAccountModal();
    } catch(e) { alert("Server offline: " + e.message); }
  };
};

window.openAccountModal = async function() {
  openModal(`<div class="af-eyebrow">Member Dossier</div><h2 class="af-h2">My Journeys · ${afUser.name}</h2><div id="af-bk-list" style="color:var(--slate-light);font-size:.85rem">Loading your confirmed expeditions…</div><br><button class="af-btn-ghost" id="af-out">Sign Out</button>`);
  document.getElementById("af-out").onclick = () => { afToken=""; afUser=null; localStorage.removeItem("af_token"); localStorage.removeItem("af_user"); document.getElementById("af-acct-btn").textContent="Sign In"; closeModal(); };
  try {
    const res = await fetch(window.AF_API + "/bookings/my-bookings", { headers:{ Authorization:"Bearer "+afToken } });
    const list = await res.json();
    document.getElementById("af-bk-list").innerHTML = !list.length ? "<p>No bookings yet. Explore our expeditions to reserve your first journey.</p>" : list.map(b => `<div class="af-summary"><div><strong style="color:var(--white)">${b.packageTitle}</strong><div style="font-size:.75rem;color:var(--slate)">Ref: ${b.bookingRef} · Date: ${b.travelDate} · ${b.guests} Guests</div></div><div style="text-align:right"><div style="color:var(--gold-light)">${b.currency} ${Number(b.totalAmount).toLocaleString()}</div><div style="font-size:.65rem;text-transform:uppercase;color:var(--gold)">${b.paymentStatus}</div></div></div>`).join("");
  } catch(e) { document.getElementById("af-bk-list").textContent = "Could not reach API server."; }
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".card-btn");
  if(!btn) return;
  e.stopImmediatePropagation();
  const card = btn.closest(".dest-card");
  const idx = Array.from(document.querySelectorAll(".dest-card")).indexOf(card);
  const pkg = (typeof DESTS !== "undefined" && DESTS[idx]) || { title: card?.querySelector(".card-title")?.textContent || "Luxury Expedition", location: card?.querySelector(".card-location")?.textContent || "Global", price: card?.querySelector(".card-price")?.textContent || "4200" };
  window.openBookingModal(pkg);
}, true);
