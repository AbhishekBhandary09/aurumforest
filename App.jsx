/**
 * Aurum Expeditions — Luxury Travel Landing Page
 * React + Vite + Tailwind CSS + Framer Motion
 *
 * Install deps:
 *   npm install framer-motion lucide-react
 */

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Search, ChevronLeft, ChevronRight, ArrowRight,
  MapPin, Calendar, Users, Star, Instagram,
  Twitter, Facebook, Youtube, Send, Mountain,
  Plane, Compass, Camera, Moon, Sparkles
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    img: "https://images.unsplash.com/photo-1508804052814-cd3ba865a116?w=700&q=80",
    tag: "Most Popular", location: "Switzerland",
    title: "Zermatt & the Matterhorn", price: "£4,200", unit: "per person / 5 nights",
  },
  {
    img: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=80",
    tag: "Exclusive", location: "Maldives",
    title: "Overwater Sanctuary", price: "£6,800", unit: "per person / 7 nights",
  },
  {
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
    tag: "Adventure", location: "Patagonia, Argentina",
    title: "Torres del Paine", price: "£5,450", unit: "per person / 10 nights",
  },
  {
    img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=700&q=80",
    tag: "Cultural", location: "Japan",
    title: "Ryokan & Zen Trail", price: "£5,900", unit: "per person / 8 nights",
  },
  {
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80",
    tag: "Remote", location: "Morocco",
    title: "Sahara Under Stars", price: "£3,600", unit: "per person / 5 nights",
  },
];

const ITINERARY = [
  { day: "Day 01", Icon: Plane,    event: "Arrival in Zurich",          desc: "Private transfer to Zermatt. Evening welcome dinner at a candlelit mountain fondue restaurant." },
  { day: "Day 02", Icon: Mountain, event: "Matterhorn Glacier Paradise", desc: "Cable car ascent to 3,883m. Guided glacier walk with your expert alpine guide." },
  { day: "Day 03", Icon: Moon,     event: "Gornergrat & Stargazing",     desc: "Cog railway to the observatory. Evening stargazing session — champagne included." },
  { day: "Day 04", Icon: Compass,  event: "Grindelwald & the Eiger",     desc: "Exclusive ski experience or snowshoe trail through the Bernese Oberland." },
  { day: "Day 05", Icon: Sparkles, event: "Farewell & Departure",        desc: "Final morning spa treatment. Private transfer to Zurich Airport." },
];

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80", traveler: "Eloise & Marcus", loc: "Lofoten, Norway" },
  { img: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=500&q=80", traveler: "Priya S.",        loc: "Kerala Backwaters" },
  { img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=80", traveler: "James & Fiona",  loc: "Bora Bora" },
  { img: "https://images.unsplash.com/photo-1526659666037-99c2d4d01c4e?w=500&q=80", traveler: "Aiko T.",         loc: "Kyoto, Japan" },
  { img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80", traveler: "Henri & Claire", loc: "Dolomites, Italy" },
  { img: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=500&q=80", traveler: "Sofia M.",        loc: "Maldives" },
  { img: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=500&q=80", traveler: "Oliver K.",       loc: "Swiss Alps" },
  { img: "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=500&q=80", traveler: "Camille & Remi", loc: "Sahara, Morocco" },
];

const STATS = [
  { number: "2,400+", label: "Expeditions Completed" },
  { number: "94",     label: "Countries Covered" },
  { number: "98%",    label: "Client Satisfaction" },
  { number: "26yr",   label: "Years of Excellence" },
];

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const ringRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
    };
    const onEnter = () => setExpanded(true);
    const onLeave = () => setExpanded(false);

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf;
    const animate = () => {
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.12;
      setRing({ x: ringRef.current.x, y: ringRef.current.y });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-gold"
        style={{ left: pos.x, top: pos.y, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: expanded ? 20 : 12, height: expanded ? 20 : 12 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border border-gold opacity-60"
        style={{ left: ring.x, top: ring.y, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: expanded ? 56 : 36, height: expanded ? 56 : 36, opacity: expanded ? 0.3 : 0.6 }}
        transition={{ duration: 0.35 }}
      />
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all duration-500"
      style={{
        padding: scrolled ? "16px 48px" : "24px 48px",
        background: scrolled ? "rgba(20,32,20,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
      }}
    >
      <div className="font-cormorant text-2xl font-light tracking-widest uppercase text-gold-light">
        <span className="text-white">Aurum</span> Expeditions
      </div>

      <ul className="hidden md:flex gap-9 list-none">
        {["Destinations", "Journeys", "Stories", "Contact"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-[0.7rem] tracking-[0.2em] uppercase text-slate-light hover:text-gold-light transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <button className="hidden md:block text-[0.7rem] tracking-[0.2em] uppercase bg-gold text-forest px-6 py-2.5 font-medium hover:bg-gold-light transition-colors">
        Book a Journey
      </button>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85')" }}
        animate={{ scale: [1.06, 1.0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/20 via-forest/10 to-forest/95" />

      <div className="relative z-10 w-full px-12 pb-20">
        <motion.p
          className="text-[0.7rem] tracking-[0.35em] uppercase text-gold mb-5"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
        >
          Curated Luxury Expeditions Since 1998
        </motion.p>

        <motion.h1
          className="font-cormorant text-[clamp(3.5rem,8vw,7rem)] font-light leading-none text-white max-w-3xl mb-7"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
        >
          Where the <em className="italic text-gold-light">World</em>
          <br />Reveals Itself
        </motion.h1>

        <motion.p
          className="text-slate-light font-light max-w-lg leading-relaxed mb-11 text-[0.95rem]"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
        >
          Private journeys crafted for the discerning traveller. Untouched summits, secret coastlines, and authentic encounters beyond the ordinary.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          className="flex max-w-3xl border border-gold/20"
          style={{ background: "rgba(26,46,26,0.55)", backdropFilter: "blur(24px)" }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 1 }}
        >
          {[
            { label: "Destination", icon: MapPin, placeholder: "Swiss Alps, Patagonia…" },
            { label: "Duration",    icon: Calendar, placeholder: "7 – 14 nights" },
            { label: "Travellers",  icon: Users,    placeholder: "2 adults" },
          ].map(({ label, icon: Icon, placeholder }, i) => (
            <div key={label} className={`flex-1 px-6 py-5 ${i < 2 ? "border-r border-gold/20" : ""}`}>
              <div className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mb-1 flex items-center gap-1.5">
                <Icon size={10} /> {label}
              </div>
              <input
                type="text"
                placeholder={placeholder}
                className="bg-transparent border-none outline-none text-white text-[0.9rem] w-full placeholder-slate font-light"
                style={{ cursor: "none" }}
              />
            </div>
          ))}
          <button className="bg-gold text-forest px-9 text-[0.7rem] tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-colors whitespace-nowrap flex items-center gap-2">
            <Search size={14} /> Explore
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Destination Card ─────────────────────────────────────────────────────────

function DestCard({ img, tag, location, title, price, unit }) {
  return (
    <motion.div
      className="relative min-w-[340px] overflow-hidden border border-gold/20 flex-shrink-0"
      data-hover
      whileHover={{ y: -14, scale: 1.012, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.img
        src={img} alt={title}
        className="w-full object-cover block"
        style={{ height: 440 }}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.7 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <span className="inline-block text-[0.6rem] tracking-[0.2em] uppercase bg-gold text-forest px-3 py-1 mb-3">{tag}</span>
        <div className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1.5">{location}</div>
        <div className="font-cormorant text-[1.7rem] font-normal text-white mb-4">{title}</div>
        <div className="flex items-center justify-between">
          <div className="font-cormorant text-[1.5rem] font-light text-gold-light">
            {price} <span className="text-[0.7rem] font-sans text-slate">{unit}</span>
          </div>
          <button className="text-[0.65rem] tracking-[0.15em] uppercase bg-gold text-forest px-5 py-2 font-medium hover:bg-gold-light transition-colors">
            Quick Book
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Destinations Section ─────────────────────────────────────────────────────

function Destinations() {
  const [idx, setIdx] = useState(0);
  const max = DESTINATIONS.length - 3;

  return (
    <section id="destinations" className="py-28 px-12 bg-forest-mid">
      <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-gold mb-4">Trending This Season</p>
          <div className="w-12 h-px bg-gold mb-6" />
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light text-white leading-tight">
            Extraordinary <em className="italic text-gold-light">Places</em><br />Await You
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-slate-light font-light text-[0.95rem] leading-relaxed max-w-md mb-6">
            Hand-selected destinations for those who seek authenticity, splendour, and the ineffable feeling of being somewhere truly singular.
          </p>
          <div className="flex gap-3">
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <button
                key={i}
                onClick={() => setIdx(i === 0 ? Math.max(0, idx - 1) : Math.min(max, idx + 1))}
                className="w-12 h-12 border border-gold/20 bg-forest/50 text-gold flex items-center justify-center hover:bg-gold hover:text-forest hover:border-gold transition-all"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: -idx * (340 + 24) }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {DESTINATIONS.map((d) => <DestCard key={d.title} {...d} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ day, Icon, event, desc, index }) {
  return (
    <motion.div
      className="relative mb-12 pl-12"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      {/* Dot */}
      <motion.div
        className="absolute left-0 top-1 w-7 h-7 border border-gold flex items-center justify-center"
        initial={{ background: "var(--forest-mid)" }}
        whileInView={{ background: "var(--gold)" }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.3 }}
        style={{ color: "var(--forest)" }}
      >
        <Icon size={12} />
      </motion.div>

      <div className="text-[0.6rem] tracking-[0.25em] uppercase text-gold mb-1.5">{day}</div>
      <div className="font-cormorant text-[1.3rem] text-white mb-1.5">{event}</div>
      <div className="text-[0.85rem] text-slate-light font-light leading-relaxed">{desc}</div>
    </motion.div>
  );
}

// ─── Itinerary Section ────────────────────────────────────────────────────────

function Itinerary() {
  return (
    <section id="itinerary" className="py-28 px-12 bg-forest">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-gold mb-4">Sample Journey</p>
            <div className="w-12 h-px bg-gold mb-6" />
            <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light text-white leading-tight mb-6">
              <em className="italic text-gold-light">Five Days</em><br />in the Swiss Alps
            </h2>
            <p className="text-slate-light font-light text-[0.95rem] leading-relaxed max-w-md mb-14">
              A private expedition through Zermatt, Grindelwald, and the Bernese Oberland — designed entirely around you.
            </p>
          </motion.div>

          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-3.5 top-5 bottom-5 w-px bg-gradient-to-b from-gold to-gold/10" />
            {ITINERARY.map((item, i) => (
              <TimelineItem key={item.day} {...item} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          className="lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1531210483974-4f8205d0078a?w=900&q=85"
            alt="Swiss Alps"
            className="w-full object-cover border border-gold/20"
            style={{ height: 580 }}
          />
          <div className="p-6 border border-gold/20 border-t-0" style={{ background: "var(--card-bg)" }}>
            <h4 className="font-cormorant text-[1.2rem] text-white mb-1">Zermatt Private Chalet</h4>
            <p className="text-[0.8rem] text-slate">Your base — an alpine retreat with panoramic Matterhorn views</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

function Gallery() {
  return (
    <section id="stories" className="py-28 px-12 bg-forest-mid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-end">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-gold mb-4">Traveller Stories</p>
          <div className="w-12 h-px bg-gold mb-6" />
          <h2 className="font-cormorant text-[clamp(2.2rem,4vw,3.5rem)] font-light text-white leading-tight">
            Moments That<br /><em className="italic text-gold-light">Define</em> a Journey
          </h2>
        </motion.div>
        <motion.p
          className="text-slate-light font-light text-[0.95rem] leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our community of explorers shares authentic moments from expeditions across six continents. Every photograph is a testament to the world's enduring beauty.
        </motion.p>
      </div>

      {/* Masonry */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {GALLERY.map((item, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden mb-4 break-inside-avoid group"
            data-hover
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.07 }}
          >
            <motion.img
              src={item.img} alt={item.traveler}
              className="w-full block"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
              <div className="font-cormorant text-[1rem] text-white">{item.traveler}</div>
              <div className="text-[0.65rem] tracking-[0.15em] uppercase text-gold flex items-center gap-1">
                <MapPin size={9} /> {item.loc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-16 border border-gold/20 divide-x divide-gold/20">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="p-9 text-center"
            style={{ background: "var(--forest-mid)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="font-cormorant text-[3rem] font-light text-gold-light leading-none mb-2">{s.number}</div>
            <div className="text-[0.65rem] tracking-[0.2em] uppercase text-slate">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contact" className="bg-forest border-t border-gold/20 pt-20 pb-10 px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div className="font-cormorant text-[1.6rem] font-light text-gold-light tracking-widest uppercase mb-4">
            Aurum Expeditions
          </div>
          <p className="text-[0.85rem] text-slate font-light leading-relaxed mb-7">
            We craft private journeys for travellers who seek more than a holiday — an experience that reshapes how they see the world.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-gold/20 flex items-center justify-center text-slate hover:border-gold hover:text-gold hover:bg-gold/10 transition-all">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <div className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-6">Destinations</div>
          <ul className="space-y-3">
            {["Swiss Alps & Dolomites", "Patagonia Wilderness", "Maldives Private Islands", "Japanese Ryokan Trail", "Sahara Stargazing", "Antarctic Expedition"].map(link => (
              <li key={link}><a href="#" className="text-[0.85rem] text-slate font-light hover:text-gold-light transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-6">Services</div>
          <ul className="space-y-3">
            {["Bespoke Itineraries", "Private Aviation", "Villa & Chalet Rentals", "Expert Guides", "24/7 Concierge", "Corporate Retreats"].map(link => (
              <li key={link}><a href="#" className="text-[0.85rem] text-slate font-light hover:text-gold-light transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <div className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-6">Private Newsletter</div>
          <p className="text-[0.82rem] text-slate font-light leading-relaxed mb-5">
            Receive curated dispatches from remote corners of the world. No frequency promises — only quality.
          </p>
          <div className="flex border border-gold/20">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-4 py-3.5 text-[0.85rem] text-white placeholder-slate outline-none font-light"
              style={{ cursor: "none" }}
            />
            <button className="bg-gold text-forest px-5 hover:bg-gold-light transition-colors">
              <Send size={14} />
            </button>
          </div>
          <p className="text-[0.72rem] text-slate mt-3 leading-relaxed">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="border-t border-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-[0.72rem] text-slate tracking-wider">
          © 2026 <span className="text-gold">Aurum Expeditions Ltd</span>. All rights reserved.
        </p>
        <div className="flex gap-7">
          {["Privacy Policy", "Terms of Use", "Cookie Settings"].map(l => (
            <a key={l} href="#" className="text-[0.72rem] text-slate hover:text-gold-light transition-colors tracking-wide">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-forest text-cream overflow-x-hidden cursor-none">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Destinations />
      <Itinerary />
      <Gallery />
      <Footer />
    </div>
  );
}
