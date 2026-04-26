import { useState, useEffect, useRef, useCallback } from "react";
import shafiProfile from "./assets/shafi_sir.png";

/* ─── INJECT STYLES + FONTS ─── */
const injectStyles = () => {
  if (document.getElementById("sw-styles")) return;
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=Barlow+Condensed:wght@700;900&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.id = "sw-styles";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --forest: #0f2318;
      --forest2: #162d1f;
      --moss: #1e3d28;
      --sage: #2d5a3a;
      --champagne: #d4a853;
      --champ2: #f0cc7a;
      --champ3: #8a6520;
      --cream: #f8f3eb;
      --cream2: #efe8d9;
      --offwhite: #fdfaf5;
      --charcoal: #1a1a1a;
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--forest); color: var(--cream); overflow-x: hidden; }
    .f-play  { font-family: 'Playfair Display', serif; }
    .f-bar   { font-family: 'Barlow Condensed', sans-serif; }
    .f-dm    { font-family: 'DM Sans', sans-serif; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeLeft { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
    @keyframes fadeRight{ from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
    @keyframes zoomIn   { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
    @keyframes drawLine { from { width:0; } to { width:100%; } }
    @keyframes blink    { 0%,100%{ border-color: var(--champagne); } 50%{ border-color:transparent; } }
    @keyframes floatY   { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-12px); } }
    @keyframes rotateSlow { to { transform:rotate(360deg); } }
    @keyframes pulseGlow  { 0%,100%{ box-shadow:0 0 0 0 rgba(212,168,83,0.3); } 50%{ box-shadow:0 0 0 16px rgba(212,168,83,0); } }
    @keyframes marquee   { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
    @keyframes waveBar   { 0%,100%{ height:4px; } 50%{ height:20px; } }
    @keyframes scanLine  { 0%{ top:-100%; } 100%{ top:100%; } }
    @keyframes shimmerBtn{ 0%{ left:-100%; } 100%{ left:200%; } }

    .blink-caret { border-right:2px solid var(--champagne); animation:blink 0.7s step-end infinite; }
    .float-anim  { animation:floatY 4s ease-in-out infinite; }
    .pulse-glow  { animation:pulseGlow 2.5s ease-in-out infinite; }
    .rotate-slow { animation:rotateSlow 20s linear infinite; }
    .wbar        { animation:waveBar 0.6s ease-in-out infinite; }
    .wbar2       { animation:waveBar 0.8s ease-in-out infinite 0.1s; }
    .wbar3       { animation:waveBar 0.5s ease-in-out infinite 0.2s; }
    .wbar4       { animation:waveBar 0.9s ease-in-out infinite 0.05s; }
    .wbar5       { animation:waveBar 0.7s ease-in-out infinite 0.15s; }

    .champ-text {
      background: linear-gradient(135deg, var(--champagne) 0%, var(--champ2) 50%, var(--champagne) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .cream-text { color: var(--cream); }

    /* Diagonal section clip */
    .clip-diagonal { clip-path: polygon(0 4%, 100% 0, 100% 96%, 0 100%); }
    .clip-diag-top  { clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%); }
    .clip-diag-bot  { clip-path: polygon(0 0, 100% 0, 100% 95%, 0 100%); }

    .marquee-wrap { display:flex; overflow:hidden; }
    .marquee-inner{ display:flex; animation:marquee 22s linear infinite; white-space:nowrap; }

    .nav-item { position:relative; }
    .nav-item::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:var(--champagne); transition:width 0.3s; }
    .nav-item:hover::after { width:100%; }

    .btn-champ {
      position:relative; overflow:hidden;
      background:linear-gradient(135deg, var(--champagne), var(--champ2));
      color: var(--forest); font-weight:700; border:none; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    }
    .btn-champ::before {
      content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
      background:rgba(255,255,255,0.25); transform:skewX(-20deg);
      animation:shimmerBtn 2.5s ease-in-out infinite;
    }
    .btn-champ:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(212,168,83,0.4); }

    .btn-outline-champ {
      border:1.5px solid var(--champagne); color:var(--champagne);
      background:transparent; cursor:pointer;
      transition:all 0.3s;
    }
    .btn-outline-champ:hover { background:var(--champagne); color:var(--forest); }

    .card-hover { transition:transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s; }
    .card-hover:hover { transform:translateY(-6px); box-shadow:0 24px 56px rgba(0,0,0,0.35); }

    .grid-line-v { width:1px; background:linear-gradient(to bottom, transparent, rgba(212,168,83,0.15) 30%, rgba(212,168,83,0.15) 70%, transparent); }

    /* Form inputs */
    .sw-input {
      width:100%; padding:0.8rem 1rem; border-radius:6px; outline:none;
      background:rgba(248,243,235,0.06); border:1px solid rgba(212,168,83,0.15);
      color:var(--cream); font-family:'DM Sans',sans-serif; font-size:0.88rem;
      transition:border-color 0.3s, background 0.3s;
    }
    .sw-input:focus { border-color:rgba(212,168,83,0.6); background:rgba(212,168,83,0.04); }
    .sw-input::placeholder { color:rgba(248,243,235,0.3); }
    .sw-input option { background:#0f2318; }
    .sw-label { display:block; font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:rgba(248,243,235,0.35); margin-bottom:0.45rem; font-weight:500; }
  `;
  document.head.appendChild(style);
};

/* ─── REVEAL HOOK ─── */
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [threshold]);
  return [ref, vis];
};

const Reveal = ({ children, dir = "up", delay = 0, className = "" }) => {
  const [ref, vis] = useReveal();
  const anim = vis ? { up:"fadeUp", left:"fadeLeft", right:"fadeRight", zoom:"zoomIn" }[dir] : null;
  return (
    <div ref={ref} className={className} style={anim ? { animation:`${anim} 0.75s ${delay}ms cubic-bezier(.16,1,.3,1) both` } : { opacity:0 }}>
      {children}
    </div>
  );
};

/* ─── TYPING HOOK ─── */
const useTyping = (phrases) => {
  const [text, setText] = useState(""); const [pi, setPi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const ph = phrases[pi];
    const t = setTimeout(() => {
      if (!del) { setText(ph.slice(0, ci + 1)); if (ci + 1 === ph.length) setTimeout(() => setDel(true), 2000); else setCi(c => c + 1); }
      else { setText(ph.slice(0, ci - 1)); if (ci - 1 === 0) { setDel(false); setPi(i => (i + 1) % phrases.length); setCi(0); } else setCi(c => c - 1); }
    }, del ? 50 : 85);
    return () => clearTimeout(t);
  }, [text, pi, ci, del, phrases]);
  return text;
};

/* ─── COUNTER ─── */
const Counter = ({ to, suffix = "" }) => {
  const [v, setV] = useState(0); const ref = useRef(null); const done = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0; const step = to / 55;
        const t = setInterval(() => { cur = Math.min(cur + step, to); setV(Math.floor(cur)); if (cur >= to) clearInterval(t); }, 22);
      }
    }, { threshold: 0.5 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
};

/* ─── PROFILE CARD ─── */
const ProfileCard = () => (
  <div className="float-anim" style={{ position:"relative", zIndex:10 }}>
    <div style={{ width:340, background:"var(--forest2)", borderRadius:24, textAlign:"center", border:"1px solid rgba(212,168,83,0.2)", boxShadow:"0 40px 80px rgba(0,0,0,0.6)", position:"relative", overflow:"hidden" }}>
      
      {/* Big Profile Image */}
      <div style={{ width:"100%", height:380, position:"relative", borderBottom:"2px solid rgba(212,168,83,0.2)" }}>
        <img src={shafiProfile} alt="Muhammed Shafi Sir" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100, background:"linear-gradient(to top, var(--forest2), transparent)" }} />
      </div>

      <div style={{ padding:"0 2rem 2.5rem", position:"relative", zIndex:1, marginTop:"-2rem" }}>
        <h3 className="f-play" style={{ fontSize:"2.2rem", fontWeight:900, color:"var(--cream)", marginBottom:6, textShadow:"0 4px 12px rgba(0,0,0,0.5)" }}>Muhammed Shafi Sir</h3>
        <div className="f-bar" style={{ fontSize:"0.8rem", letterSpacing:"2.5px", color:"var(--champagne)", fontWeight:700, marginBottom:"1.5rem" }}>FOUNDER & CEO · SPEAKWELL ACADEMY</div>
        <div style={{ width:50, height:1, background:"linear-gradient(90deg,transparent,var(--champagne),transparent)", margin:"0 auto 1.5rem" }} />

        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:"1.8rem" }}>
          {["English Trainer","Speaker","CEO","Mentor"].map(t => (
            <span key={t} style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", padding:"5px 12px", borderRadius:100, background:"rgba(212,168,83,0.08)", border:"1px solid rgba(212,168,83,0.2)", color:"var(--champagne)" }}>{t}</span>
          ))}
        </div>

        {/* Stars */}
        <div style={{ color:"#f0cc7a", fontSize:"1rem" }}>
          ★★★★★ <span style={{ fontSize:"0.75rem", color:"rgba(248,243,235,0.4)", marginLeft:6 }}>4.9 / 5.0</span>
        </div>
      </div>
    </div>

    {/* Floating pills */}
    <div style={{ position:"absolute", top:25, right:-25, background:"var(--forest)", border:"1px solid rgba(212,168,83,0.4)", borderRadius:12, padding:"0.8rem 1rem", fontSize:"0.8rem", boxShadow:"0 15px 35px rgba(0,0,0,0.5)", animation:"floatY 3.5s ease-in-out infinite 0.5s", zIndex:2 }}>
      <div className="f-play" style={{ fontSize:"1.4rem", fontWeight:900, color:"var(--champagne)", lineHeight:1 }}>500+</div>
      <div style={{ color:"rgba(248,243,235,0.6)", fontSize:"0.7rem", fontWeight:500 }}>Live Sessions</div>
    </div>
    <div style={{ position:"absolute", bottom:45, left:-35, background:"var(--forest)", border:"1px solid rgba(212,168,83,0.4)", borderRadius:12, padding:"0.8rem 1rem", fontSize:"0.8rem", boxShadow:"0 15px 35px rgba(0,0,0,0.5)", animation:"floatY 3.5s ease-in-out infinite 1.5s", zIndex:2 }}>
      <div className="f-play" style={{ fontSize:"1.4rem", fontWeight:900, color:"var(--champagne)", lineHeight:1 }}>⭐ 4.9</div>
      <div style={{ color:"rgba(248,243,235,0.6)", fontSize:"0.7rem", fontWeight:500 }}>Student Rating</div>
    </div>
  </div>
);

/* ─── VOICE NOTE ─── */
const VoiceNote = ({ name, time, color, quote }) => {
  const [playing, setPlaying] = useState(false); const [prog, setProg] = useState(0); const tmr = useRef(null);
  const secs = time.split(":").reduce((a, b) => a * 60 + +b, 0);
  const toggle = () => {
    if (playing) { clearInterval(tmr.current); setPlaying(false); }
    else {
      setPlaying(true);
      tmr.current = setInterval(() => setProg(p => { if (p >= 100) { clearInterval(tmr.current); setPlaying(false); return 0; } return p + 100 / (secs * 5); }), 200);
    }
  };
  useEffect(() => () => clearInterval(tmr.current), []);
  const elapsed = Math.floor((prog / 100) * secs);
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ background:"rgba(212,168,83,0.06)", border:"1px solid rgba(212,168,83,0.15)", borderRadius:14, padding:"1.2rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"0.9rem" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.85rem", color:"#0f2318", flexShrink:0 }}>{name[0]}</div>
        <div>
          <div style={{ fontWeight:600, fontSize:"0.88rem", color:"var(--cream)" }}>{name}</div>
          <div style={{ fontSize:"0.72rem", color:"rgba(248,243,235,0.35)", marginTop:2 }}>Voice Testimonial • SpeakWell Student</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"flex-end", gap:3, height:22 }}>
          {playing ? [1,2,3,4,5].map(b => <div key={b} className={`wbar${b}`} style={{ width:3, background:"var(--champagne)", borderRadius:2, height:4 }} />) : [8,14,6,18,10,14,8].map((h,i) => <div key={i} style={{ width:2.5, height:h, background:"rgba(212,168,83,0.3)", borderRadius:2 }} />)}
        </div>
      </div>
      {quote && <p style={{ fontSize:"0.8rem", color:"rgba(248,243,235,0.5)", fontStyle:"italic", marginBottom:"0.9rem", lineHeight:1.6 }}>"{quote}"</p>}
      <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
        <button onClick={toggle} style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,var(--champagne),var(--champ2))", border:"none", cursor:"pointer", fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center", color:"#0f2318", fontWeight:700, flexShrink:0 }}>
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ flex:1 }}>
          <div style={{ height:4, borderRadius:4, background:"rgba(212,168,83,0.12)", overflow:"hidden", cursor:"pointer" }}>
            <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,var(--champagne),var(--champ2))", borderRadius:4, transition:"width 0.2s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:"0.7rem", color:"rgba(248,243,235,0.3)" }}>{fmt(elapsed)}</span>
            <span style={{ fontSize:"0.7rem", color:"rgba(248,243,235,0.3)" }}>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── VIDEO CARD ─── */
const VideoCard = ({ name, role, quote, accent }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="card-hover" style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(212,168,83,0.12)", background:"rgba(22,45,31,0.7)" }}>
      <div onClick={() => setOn(!on)} style={{ height:180, background:`linear-gradient(145deg, ${accent}18, ${accent}06)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
        {on ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:40 }}>
              {[10,18,8,22,14,20,10,16,8,18].map((h,i) => <div key={i} style={{ width:4, height:h, background:"var(--champagne)", borderRadius:3, animation:`waveBar ${0.4+i*0.07}s ease-in-out infinite ${i*0.04}s` }} />)}
            </div>
            <span style={{ fontSize:"0.75rem", color:"rgba(248,243,235,0.5)" }}>Playing video…</span>
          </div>
        ) : (
          <>
            <div className="pulse-glow" style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,var(--champagne),var(--champ2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", color:"#0f2318", fontWeight:700 }}>▶</div>
            <span style={{ fontSize:"0.72rem", color:"rgba(248,243,235,0.4)", marginTop:10 }}>Tap to watch</span>
          </>
        )}
        <span style={{ position:"absolute", top:12, left:12, fontSize:"0.65rem", fontWeight:700, letterSpacing:2, textTransform:"uppercase", background:`${accent}33`, color:accent, padding:"3px 9px", borderRadius:100 }}>Video</span>
        {on && <button onClick={e=>{e.stopPropagation();setOn(false);}} style={{ position:"absolute", top:10, right:10, width:26, height:26, borderRadius:"50%", background:"rgba(0,0,0,0.4)", border:"none", color:"rgba(248,243,235,0.6)", cursor:"pointer", fontSize:"0.75rem" }}>✕</button>}
      </div>
      <div style={{ padding:"1.1rem 1.2rem" }}>
        <p style={{ fontSize:"0.82rem", color:"rgba(248,243,235,0.6)", fontStyle:"italic", lineHeight:1.65, marginBottom:"0.9rem" }}>"{quote}"</p>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", fontWeight:700, color:"#0f2318", flexShrink:0 }}>{name[0]}</div>
          <div>
            <div style={{ fontSize:"0.83rem", fontWeight:600, color:"var(--cream)" }}>{name}</div>
            <div style={{ fontSize:"0.7rem", color:"rgba(248,243,235,0.35)" }}>{role}</div>
          </div>
          <div style={{ marginLeft:"auto", color:"#f0cc7a", fontSize:"0.75rem" }}>★★★★★</div>
        </div>
      </div>
    </div>
  );
};

/* ─── COURSE CARD ─── */
const CourseCard = ({ icon, label, title, body, meta, i }) => (
  <Reveal dir="up" delay={i * 70} className="card-hover h-full" style={{ display:"flex" }}>
    <div style={{ background:"var(--forest2)", border:"1px solid rgba(212,168,83,0.1)", borderRadius:14, padding:"1.6rem", display:"flex", flexDirection:"column", height:"100%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,var(--champagne),transparent)`, opacity:0.5 }} />
      <div style={{ fontSize:"1.8rem", marginBottom:"0.8rem" }}>{icon}</div>
      <span style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--champagne)", marginBottom:"0.6rem", display:"block" }}>{label}</span>
      <h3 className="f-play" style={{ fontSize:"1.1rem", fontWeight:700, marginBottom:"0.7rem", color:"var(--cream)", lineHeight:1.25 }}>{title}</h3>
      <p style={{ fontSize:"0.8rem", color:"rgba(248,243,235,0.45)", lineHeight:1.7, flex:1, marginBottom:"1rem" }}>{body}</p>
      <div style={{ display:"flex", gap:"1rem", borderTop:"1px solid rgba(212,168,83,0.08)", paddingTop:"0.9rem" }}>
        {meta.map(([k,v]) => <div key={k} style={{ fontSize:"0.72rem", color:"rgba(248,243,235,0.35)" }}>{k} <span style={{ color:"var(--cream)", fontWeight:500 }}>{v}</span></div>)}
      </div>
    </div>
  </Reveal>
);

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function SpeakWell() {
  useEffect(injectStyles, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [feedTab, setFeedTab] = useState("written");
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goto = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };

  const typed = useTyping(["Spoken English Trainer","Motivational Speaker","CEO · SpeakWell Academy","Confidence Coach","Public Speaking Expert"]);

  const COURSES = [
    { icon:"🗣️", label:"Beginner", title:"Spoken English Foundation", body:"Build pronunciation, grammar and daily vocabulary from zero — with the confidence to speak on day one.", meta:[["⏱","3 Months"],["📡","Online/Offline"]] },
    { icon:"💼", label:"Professional", title:"Business English Mastery", body:"Emails, meetings, presentations and corporate negotiations — communicate like a leader at the workplace.", meta:[["⏱","2 Months"],["📡","Online/Offline"]] },
    { icon:"🎤", label:"Advanced", title:"Public Speaking & Personality", body:"Stage presence, storytelling, persuasion and powerful body language — Muhammed Shafi Sir's signature course.", meta:[["⏱","6 Weeks"],["📡","Offline"]] },
    { icon:"🎯", label:"Interview Prep", title:"Interview Crash Course", body:"HR rounds, group discussions, mock interviews — everything you need to land your dream job confidently.", meta:[["⏱","4 Weeks"],["📡","Online/Offline"]] },
    { icon:"👦", label:"Kids & Teens", title:"Young Speakers Program", body:"Interactive, fun English for school students — building fluency and love for language from an early age.", meta:[["⏱","3 Months"],["📡","Online/Offline"]] },
    { icon:"⚡", label:"Weekend", title:"Weekend Fluency Bootcamp", body:"For busy professionals — intensive weekend sessions for dramatic improvement in just 8 weeks.", meta:[["⏱","8 Weekends"],["📡","Online/Offline"]] },
  ];

  const WRITTEN = [
    { name:"Arjun Menon", role:"Software Engineer, Kochi", text:"Muhammed Shafi Sir rebuilt my confidence from ground up. Placed in an MNC within 2 months. Truly life-changing.", color:"#d4a853" },
    { name:"Priya Nair", role:"Bank Officer, Tirurangadi", text:"From trembling at English to addressing 200 people — SpeakWell Academy is simply life-changing.", color:"#4a9eff" },
    { name:"Rajan Pillai", role:"Parent, Palakkad", text:"My daughter now leads school debates. Muhammed Shafi Sir has an incredible gift for connecting with students of every age.", color:"#4ade80" },
    { name:"Sneha Raj", role:"HR Executive, Bangalore", text:"The Business English course transformed my presentation skills. Got a promotion within 3 months!", color:"#e879f9" },
    { name:"Mohammed Riyas", role:"Bank PO, Kozhikode", text:"Cleared my Bank PO interview in the very first attempt after Muhammed Shafi Sir's crash course. Incredible teacher.", color:"#fb923c" },
    { name:"Divya Krishnan", role:"Student, Tirurangadi", text:"I went from the shyest student to speaking at college events. SpeakWell changed my entire personality.", color:"#22d3ee" },
  ];

  const VIDEOS = [
    { name:"Akhil Thomas", role:"MNC Employee, Pune", quote:"This academy gave me the confidence to speak in board meetings. Muhammed Shafi Sir's approach is unlike anything I've experienced.", accent:"#d4a853" },
    { name:"Fathima Beevi", role:"Teacher, Malappuram", quote:"I joined to improve classroom English and ended up transforming my entire communication style completely.", accent:"#4a9eff" },
  ];

  const VOICES = [
    { name:"Vishnu Kumar", time:"1:24", color:"#d4a853", quote:"I was always afraid of English in public. After one month with Muhammed Shafi Sir, I gave a speech at my office annual day." },
    { name:"Amritha Saji", time:"0:58", color:"#4ade80", quote:"The way Muhammed Shafi Sir teaches — with so much energy and patience — makes you fall in love with English." },
    { name:"Jithin Mathew", time:"2:10", color:"#fb923c", quote:"SpeakWell is not just a class. It is a transformation. Muhammed Shafi Sir cares about every single student personally." },
  ];

  const S = { // inline style helpers
    sec: { padding:"5.5rem 1.25rem", maxWidth:1100, margin:"0 auto" },
    tag: { fontSize:"0.7rem", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", color:"var(--champagne)", display:"flex", alignItems:"center", gap:10, marginBottom:"0.75rem" },
    tagLine: { width:28, height:1, background:"var(--champagne)" },
    h2: { fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, lineHeight:1.1 },
    sub: { fontSize:"0.9rem", color:"rgba(248,243,235,0.45)", lineHeight:1.8, fontWeight:300, marginTop:"1rem" },
    divider: { height:1, background:"linear-gradient(90deg,transparent,rgba(212,168,83,0.35),rgba(240,204,122,0.5),rgba(212,168,83,0.35),transparent)", position:"relative" },
    diamond: { position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"var(--forest)", color:"var(--champagne)", padding:"0 12px", fontSize:"0.65rem" },
  };

  return (
    <div style={{ background:"var(--forest)", minHeight:"100vh", overflowX:"hidden" }}>

      {/* ─── MARQUEE STRIP ─── */}
      <div style={{ background:"var(--champagne)", overflow:"hidden", padding:"0.45rem 0", position:"relative", zIndex:50 }}>
        <div className="marquee-wrap">
          <div className="marquee-inner">
            {Array(6).fill("✦ SpeakWell English Academy · Muhammed Shafi Sir · Tirurangadi, Kerala · Online & Offline Classes · Speak With Confidence ").map((t,i) => (
              <span key={i} style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#0f2318", marginRight:"2rem" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── NAV ─── */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background: scrolled ? "rgba(15,35,24,0.98)" : "rgba(15,35,24,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(212,168,83,0.1)", transition:"all 0.3s" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", height: scrolled ? 58 : 68, transition:"height 0.3s" }}>
          <div className="f-play" style={{ fontSize:"1.45rem", fontWeight:900, color:"var(--champagne)", letterSpacing:"-0.5px" }}>
            Speak<span style={{ color:"var(--cream)" }}>Well</span>
          </div>

          {/* Desktop */}
          <ul style={{ display:"flex", gap:"2rem", listStyle:"none", alignItems:"center" }} className="hidden-mobile">
            {["About","Courses","Feedback","Contact"].map(s => (
              <li key={s} className="nav-item">
                <button onClick={() => goto(s.toLowerCase())} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:500, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(248,243,235,0.5)", transition:"color 0.3s" }}
                  onMouseEnter={e=>e.target.style.color="var(--champagne)"} onMouseLeave={e=>e.target.style.color="rgba(248,243,235,0.5)"}>
                  {s}
                </button>
              </li>
            ))}
            <li>
              <button onClick={()=>goto("contact")} className="btn-champ f-bar" style={{ padding:"0.55rem 1.5rem", borderRadius:4, fontSize:"0.9rem", letterSpacing:"1px" }}>
                ENROLL FREE
              </button>
            </li>
          </ul>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:"none", background:"none", border:"none", cursor:"pointer", flexDirection:"column", gap:5, padding:4 }} className="show-mobile">
            {[0,1,2].map(i => (
              <div key={i} style={{ width:24, height:1.5, background:"var(--champagne)", borderRadius:2, transition:"all 0.3s", transform: menuOpen && i===0 ? "rotate(45deg) translate(4.5px,4.5px)" : menuOpen && i===2 ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none", opacity: menuOpen && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background:"rgba(15,35,24,0.99)", borderTop:"1px solid rgba(212,168,83,0.1)", padding:"1.2rem 1.25rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
            {["About","Courses","Feedback","Contact"].map(s => (
              <button key={s} onClick={() => goto(s.toLowerCase())} style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", fontSize:"0.85rem", fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(248,243,235,0.55)", padding:"0.4rem 0" }}>
                {s}
              </button>
            ))}
            <button onClick={()=>goto("contact")} className="btn-champ f-bar" style={{ padding:"0.75rem 1.5rem", borderRadius:4, fontSize:"1rem", letterSpacing:"1px", textAlign:"center" }}>
              BOOK FREE DEMO CLASS
            </button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" style={{ minHeight:"calc(100vh - 90px)", display:"flex", alignItems:"center", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Big BG text */}
        <div className="f-bar" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"clamp(6rem,20vw,24rem)", fontWeight:900, color:"rgba(212,168,83,0.03)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-4px", whiteSpace:"nowrap" }}>
          SPEAK WELL
        </div>

        <div style={{ maxWidth:900, margin:"0 auto", padding:"4rem 1.25rem", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:"1.5rem", animation:"fadeUp 0.6s ease both" }}>
            <div style={{ width:32, height:1, background:"var(--champagne)" }} />
            <span className="f-bar" style={{ fontSize:"0.78rem", letterSpacing:"3px", color:"var(--champagne)", fontWeight:700 }}>ONLINE & OFFLINE · TIRURANGADI, KERALA</span>
            <div style={{ width:32, height:1, background:"var(--champagne)" }} />
          </div>

          <h1 className="f-play" style={{ fontSize:"clamp(3rem,8vw,6rem)", fontWeight:900, lineHeight:1, marginBottom:"1.5rem", animation:"fadeUp 0.6s 0.1s ease both" }}>
            Speak English<br />
            <span className="champ-text" style={{ fontStyle:"italic" }}>With Confidence,</span><br />
            Change Your Life
          </h1>

          <div style={{ fontSize:"1.2rem", color:"rgba(248,243,235,0.6)", marginBottom:"2.5rem", lineHeight:1.7, fontWeight:300, minHeight:"3.2rem", animation:"fadeUp 0.6s 0.2s ease both" }}>
            Led by <span className="blink-caret" style={{ color:"var(--champagne)", fontWeight:600 }}>{typed}</span>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent:"center", marginBottom:"4rem", animation:"fadeUp 0.6s 0.3s ease both" }}>
            <button onClick={()=>goto("contact")} className="btn-champ f-bar" style={{ padding:"1rem 2.5rem", borderRadius:4, fontSize:"1.1rem", letterSpacing:"1.5px" }}>
              🎓 BOOK FREE DEMO CLASS
            </button>
            <button onClick={()=>goto("courses")} className="btn-outline-champ f-bar" style={{ padding:"1rem 2.2rem", borderRadius:4, fontSize:"1.1rem", letterSpacing:"1.5px" }}>
              VIEW ALL COURSES →
            </button>
          </div>

        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div style={S.divider}><div style={S.diamond}>◆</div></div>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ background:"var(--forest)", padding:"0 1.25rem" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:"5rem", alignItems:"center" }} className="about-grid">
            <Reveal dir="left">
              <div style={S.tag}><div style={S.tagLine} />About Muhammed Shafi Sir</div>
              <h2 className="f-play" style={S.h2}>Your Mentor,<br /><span className="champ-text" style={{ fontStyle:"italic" }}>Your Transformation</span></h2>
              <p style={S.sub}>Muhammed Shafi Sir is the visionary Founder & CEO of SpeakWell English Academy — a certified Spoken English Trainer, dynamic Motivational Speaker, and educator who has transformed thousands of lives across Kerala and beyond.</p>

              <blockquote style={{ margin:"2rem 0", padding:"1.5rem 1.8rem", borderLeft:"2px solid var(--champagne)", background:"rgba(212,168,83,0.05)", borderRadius:"0 12px 12px 0", position:"relative" }}>
                <div className="f-play" style={{ fontSize:"5rem", color:"rgba(212,168,83,0.12)", position:"absolute", top:-12, left:12, lineHeight:1 }}>"</div>
                <p className="f-play" style={{ fontSize:"1.15rem", fontStyle:"italic", color:"rgba(248,243,235,0.85)", lineHeight:1.7, position:"relative", zIndex:1 }}>
                  "English is not just a language — it is the key that unlocks every door of opportunity. I don't just teach words; I teach the courage to use them."
                </p>
                <cite className="f-bar" style={{ display:"block", marginTop:"1rem", fontSize:"0.8rem", letterSpacing:"2px", color:"var(--champagne)", fontStyle:"normal", fontWeight:700 }}>— MUHAMMED SHAFI SIR, FOUNDER · SPEAKWELL</cite>
              </blockquote>

              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {["🎓 Certified Trainer","🎤 Motivational Speaker","🏢 CEO & Founder","📺 Corporate Expert","🧠 Personality Coach"].map(p => (
                  <span key={p} style={{ fontSize:"0.8rem", padding:"0.5rem 1.1rem", borderRadius:100, border:"1px solid rgba(212,168,83,0.2)", color:"rgba(248,243,235,0.5)", transition:"all 0.3s", cursor:"default" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--champagne)";e.currentTarget.style.color="var(--champagne)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(212,168,83,0.2)";e.currentTarget.style.color="rgba(248,243,235,0.5)";}}>{p}</span>
                ))}
              </div>
            </Reveal>

            <Reveal dir="right" style={{ display:"flex", justifyContent:"center" }}>
              <ProfileCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <div style={{ background:"var(--forest2)", padding:"4rem 1.25rem", borderTop:"1px solid rgba(212,168,83,0.1)", borderBottom:"1px solid rgba(212,168,83,0.1)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem", textAlign:"center" }} className="stats-grid">
          {[["5000","+","Students Transformed"],["10","+","Years of Excellence"],["98","%","Success Rate"],["500","+","Live Sessions"]].map(([n,s,l]) => (
            <Reveal key={l} dir="up">
              <div className="f-play" style={{ fontSize:"3rem", fontWeight:900, color:"var(--champagne)", lineHeight:1 }}><Counter to={parseInt(n)} suffix={s} /></div>
              <div className="f-bar" style={{ fontSize:"0.75rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(248,243,235,0.3)", marginTop:8 }}>{l}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ─── COURSES ─── */}
      <section id="courses" style={{ background:"var(--forest)", padding:"0 1.25rem", position:"relative" }}>
        <div style={S.sec}>
          <Reveal dir="up" className="text-center" style={{ textAlign:"center", marginBottom:"4rem" }}>
            <div style={{ ...S.tag, justifyContent:"center" }}><div style={S.tagLine} />Our Programs<div style={S.tagLine} /></div>
            <h2 className="f-play" style={S.h2}>Courses for <span className="champ-text" style={{ fontStyle:"italic" }}>Every Learner</span></h2>
            <p style={{ ...S.sub, maxWidth:550, margin:"1rem auto 0" }}>Expertly crafted programs — from absolute beginners to corporate leaders. Choose the path that fits your goals.</p>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }} className="courses-grid">
            {COURSES.map((c, i) => <CourseCard key={c.title} {...c} i={i} />)}
          </div>
        </div>
      </section>

      {/* ─── WHY ─── */}
      <div style={S.divider}><div style={S.diamond}>◆</div></div>
      <section style={{ background:"var(--forest2)", padding:"0 1.25rem" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"start" }} className="why-grid">
            <Reveal dir="left">
              <div style={S.tag}><div style={S.tagLine} />Why SpeakWell</div>
              <h2 className="f-play" style={S.h2}>What Makes Us<br /><span className="champ-text" style={{ fontStyle:"italic" }}>Different</span></h2>
              <div style={{ marginTop:"2.5rem" }}>
                {[["01","Muhammed Shafi Sir Teaches Every Class","No junior faculty, no outsourcing — every session conducted personally by Muhammed Shafi Sir himself. You always get the very best."],["02","Activity-Based Real Learning","Role plays, storytelling, debates, group discussions and real-world scenarios — English that is fun, practical and permanent."],["03","Flexible Timings for All","Morning, evening and weekend batches in both online and offline formats — we fit seamlessly into your schedule."],["04","Lifetime Alumni Community","Access our exclusive practice groups, doubt-clearing sessions and continued support even long after you graduate."],["05","Certified & Affordable","World-class training at accessible prices — with a recognized SpeakWell Academy certificate on completion."]].map(([n,h,p]) => (
                  <div key={n} style={{ display:"grid", gridTemplateColumns:"60px 1fr", gap:"1.2rem", paddingBottom:"1.5rem", marginBottom:"1.5rem", borderBottom:"1px solid rgba(212,168,83,0.08)" }}
                    onMouseEnter={e=>e.currentTarget.querySelector(".why-num").style.color="var(--champagne)"}
                    onMouseLeave={e=>e.currentTarget.querySelector(".why-num").style.color="rgba(212,168,83,0.15)"}>
                    <div className="why-num f-bar" style={{ fontSize:"2.5rem", fontWeight:900, color:"rgba(212,168,83,0.15)", lineHeight:1, transition:"color 0.3s" }}>{n}</div>
                    <div>
                      <h4 style={{ fontSize:"1rem", fontWeight:600, color:"var(--cream)", marginBottom:6 }}>{h}</h4>
                      <p style={{ fontSize:"0.85rem", color:"rgba(248,243,235,0.45)", lineHeight:1.7 }}>{p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal dir="right">
              <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>
                {[{ title:"💻 Online Classes", col:"#4a9eff", feats:["Live Zoom / Google Meet sessions","Recorded class access anytime","WhatsApp practice group","Digital study materials","Online mock sessions & feedback"] },
                  { title:"🏫 Offline Classes", col:"#d4a853", feats:["Face-to-face with Muhammed Shafi Sir","In-person debates & discussions","Live mock interviews","Activity-based group sessions","Study material provided"] }
                ].map(m => (
                  <div key={m.title} className="card-hover" style={{ borderRadius:16, padding:"2rem", border:"1px solid " + m.col + "33", background: m.col + "08" }}>
                    <h3 className="f-play" style={{ fontSize:"1.35rem", fontWeight:700, color:"var(--cream)", marginBottom:"1.2rem" }}>{m.title}</h3>
                    <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                      {m.feats.map(f => <li key={f} style={{ fontSize:"0.88rem", color:"rgba(248,243,235,0.65)", display:"flex", gap:10 }}><span style={{ color:m.col, flexShrink:0 }}>→</span>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FEEDBACK ─── */}
      <div style={S.divider}><div style={S.diamond}>◆</div></div>
      <section id="feedback" style={{ background:"var(--forest)", padding:"0 1.25rem" }}>
        <div style={S.sec}>
          <Reveal dir="up" style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ ...S.tag, justifyContent:"center" }}><div style={S.tagLine} />Student Feedback<div style={S.tagLine} /></div>
            <h2 className="f-play" style={S.h2}>Real Stories, <span className="champ-text" style={{ fontStyle:"italic" }}>Real Results</span></h2>
            <p style={{ ...S.sub, maxWidth:500, margin:"1rem auto 0" }}>Hear from our students — in their own words, voices, and videos</p>
          </Reveal>

          {/* Tabs */}
          <Reveal dir="up" delay={100} style={{ display:"flex", justifyContent:"center", marginBottom:"3rem" }}>
            <div style={{ display:"flex", gap:"10px", padding:"10px", borderRadius:12, background:"rgba(212,168,83,0.06)", border:"1px solid rgba(212,168,83,0.15)" }}>
              {[["written","💬 Written"+(` (${WRITTEN.length})`)],["video","🎬 Videos"+(` (${VIDEOS.length})`)],["voice","🎙️ Voice Notes"+(` (${VOICES.length})`)]].map(([id,lbl]) => (
                <button key={id} onClick={()=>setFeedTab(id)} className="f-bar" style={{ padding:"0.7rem 1.4rem", borderRadius:8, fontSize:"0.85rem", letterSpacing:"1px", border:"none", cursor:"pointer", transition:"all 0.3s", background: feedTab===id ? "linear-gradient(135deg,var(--champagne),var(--champ2))" : "transparent", color: feedTab===id ? "var(--forest)" : "rgba(248,243,235,0.5)", fontWeight:700, outline:"none" }}>
                  {lbl}
                </button>
              ))}
            </div>
          </Reveal>

          {/* WRITTEN */}
          {feedTab==="written" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }} className="reviews-grid">
              {WRITTEN.map((r, i) => (
                <Reveal key={r.name} dir="up" delay={i * 65}>
                  <div className="card-hover" style={{ background:"var(--forest2)", border:"1px solid rgba(212,168,83,0.12)", borderRadius:16, padding:"1.6rem", height:"100%", display:"flex", flexDirection:"column" }}>
                    <div style={{ color:"#f0cc7a", fontSize:"0.85rem", marginBottom:"0.8rem" }}>★★★★★</div>
                    <p style={{ fontSize:"0.88rem", color:"rgba(248,243,235,0.65)", fontStyle:"italic", lineHeight:1.75, flex:1, marginBottom:"1.2rem" }}>"{r.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.95rem", color:"#0f2318", flexShrink:0 }}>{r.name[0]}</div>
                      <div>
                        <div style={{ fontSize:"0.9rem", fontWeight:600, color:"var(--cream)" }}>{r.name}</div>
                        <div style={{ fontSize:"0.75rem", color:"rgba(248,243,235,0.35)" }}>{r.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* VIDEO */}
          {feedTab==="video" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.5rem", maxWidth:800, margin:"0 auto" }} className="video-grid">
              {VIDEOS.map((v, i) => <Reveal key={v.name} dir="up" delay={i*120}><VideoCard {...v} /></Reveal>)}
            </div>
          )}

          {/* VOICE */}
          {feedTab==="voice" && (
            <div style={{ maxWidth:600, margin:"0 auto", display:"flex", flexDirection:"column", gap:"1.2rem" }}>
              {VOICES.map((v, i) => <Reveal key={v.name} dir="up" delay={i * 100}><VoiceNote {...v} /></Reveal>)}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <div style={{ background:"linear-gradient(135deg,var(--champagne),var(--champ2))", padding:"5rem 1.25rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div className="f-bar" style={{ position:"absolute", right:"-2%", top:"50%", transform:"translateY(-50%)", fontSize:"clamp(8rem,16vw,18rem)", fontWeight:900, color:"rgba(15,35,24,0.06)", letterSpacing:"-4px", userSelect:"none", lineHeight:1 }}>ENROLL NOW</div>
        <Reveal dir="up" style={{ position:"relative", zIndex:1 }}>
          <h2 className="f-play" style={{ fontSize:"clamp(2.2rem,5vw,3.5rem)", fontWeight:900, color:"var(--forest)", marginBottom:"1rem" }}>
            Start Your Journey Today
          </h2>
          <p style={{ fontSize:"1rem", color:"rgba(15,35,24,0.7)", marginBottom:"2.5rem", fontWeight:400, maxWidth:600, margin:"0 auto 2.5rem" }}>One free demo class. No commitment. No payment. Just transformation. Book your seat now and feel the difference.</p>
          <div style={{ display:"flex", gap:"1.2rem", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>goto("contact")} className="f-bar" style={{ padding:"1.1rem 2.8rem", borderRadius:4, fontSize:"1.1rem", letterSpacing:"1.5px", background:"var(--forest)", color:"var(--champagne)", border:"none", cursor:"pointer", fontWeight:700, transition:"all 0.3s" }}
              onMouseEnter={e=>{e.target.style.background="var(--forest2)";}} onMouseLeave={e=>{e.target.style.background="var(--forest)";}}>
              🎓 BOOK FREE DEMO CLASS
            </button>
            <a href="tel:+919999999999" className="f-bar" style={{ padding:"1.1rem 2.2rem", borderRadius:4, fontSize:"1.1rem", letterSpacing:"1.5px", border:"2.5px solid rgba(15,35,24,0.25)", color:"var(--forest)", textDecoration:"none", fontWeight:700, display:"inline-flex", alignItems:"center", gap:8 }}>
              📞 CALL MUHAMMED SHAFI SIR
            </a>
          </div>
        </Reveal>
      </div>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ background:"var(--forest)", padding:"0 1.25rem" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:"5rem", alignItems:"start" }} className="contact-grid">
            <Reveal dir="left">
              <div style={S.tag}><div style={S.tagLine} />Get In Touch</div>
              <h2 className="f-play" style={S.h2}>Let's <span className="champ-text" style={{ fontStyle:"italic" }}>Connect</span></h2>
              <p style={S.sub}>Reach out to enroll, ask questions, or book your free demo class — we'd love to hear from you.</p>
              <div style={{ marginTop:"2.5rem", display:"flex", flexDirection:"column", gap:0 }}>
                {[["📍","Address","SpeakWell English Academy, Tirurangadi, Kerala, India"],["📞","Phone / WhatsApp","+91 99999 99999"],["📧","Email","shafi@speakwellacademy.com"],["⏰","Class Timings","Morning · Evening · Weekend Batches"]].map(([ic,lbl,val]) => (
                  <div key={lbl} style={{ display:"flex", gap:"1.2rem", alignItems:"center", padding:"1.2rem 0", borderBottom:"1px solid rgba(212,168,83,0.08)" }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:"rgba(212,168,83,0.1)", border:"1px solid rgba(212,168,83,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>
                      {ic}
                    </div>
                    <div>
                      <div className="f-bar" style={{ fontSize:"0.68rem", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(248,243,235,0.35)", fontWeight:700 }}>{lbl}</div>
                      <div style={{ fontSize:"0.95rem", color:"rgba(248,243,235,0.8)", marginTop:4 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Form */}
            <Reveal dir="right">
              <div style={{ background:"var(--forest2)", borderRadius:20, padding:"2.5rem", border:"1px solid rgba(212,168,83,0.15)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,transparent,var(--champagne),var(--champ2),var(--champagne),transparent)" }} />
                <h3 className="f-play" style={{ fontSize:"1.7rem", fontWeight:900, color:"var(--cream)", marginBottom:6 }}>Book a Free Demo 🎓</h3>
                <p style={{ fontSize:"0.85rem", color:"rgba(248,243,235,0.4)", marginBottom:"2rem" }}>Our team will contact you within 24 hours.</p>

                {formSent ? (
                  <div style={{ textAlign:"center", padding:"3rem 0" }}>
                    <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>✅</div>
                    <h4 className="f-play" style={{ fontSize:"1.8rem", fontWeight:900, color:"var(--champagne)", marginBottom:8 }}>Enquiry Sent!</h4>
                    <p style={{ fontSize:"0.9rem", color:"rgba(248,243,235,0.5)" }}>Muhammed Shafi Sir's team will contact you shortly. Welcome to the SpeakWell family!</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                      {[["Full Name","Your name","text"],["Phone / WhatsApp","+91 XXXXX XXXXX","tel"]].map(([lbl,ph,t]) => (
                        <div key={lbl}><label className="sw-label">{lbl}</label><input type={t} placeholder={ph} className="sw-input" /></div>
                      ))}
                    </div>
                    <div style={{ marginBottom:"1rem" }}><label className="sw-label">Email</label><input type="email" placeholder="your@email.com" className="sw-input" /></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                      <div><label className="sw-label">Course</label>
                        <select className="sw-input">
                          <option value="">Select…</option>
                          {["Spoken English Foundation","Business English Mastery","Public Speaking","Interview Prep","Young Speakers","Weekend Bootcamp"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div><label className="sw-label">Mode</label>
                        <select className="sw-input">
                          <option>Online</option><option>Offline – Tirurangadi</option><option>Both okay</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom:"1.5rem" }}><label className="sw-label">Message (Optional)</label><textarea rows={3} placeholder="Your goals or questions for Muhammed Shafi Sir…" className="sw-input" style={{ resize:"vertical" }} /></div>
                    <button onClick={()=>setFormSent(true)} className="btn-champ f-bar" style={{ width:"100%", padding:"1.1rem", borderRadius:8, fontSize:"1.1rem", letterSpacing:"1.5px" }}>
                      SEND ENQUIRY & BOOK DEMO →
                    </button>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background:"#050f0a", borderTop:"1px solid rgba(212,168,83,0.1)", padding:"3rem 1.25rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"2rem", paddingBottom:"2rem", borderBottom:"1px solid rgba(248,243,235,0.06)" }}>
            <div>
              <div className="f-play" style={{ fontSize:"1.8rem", fontWeight:900, color:"var(--champagne)" }}>SpeakWell <span style={{ color:"var(--cream)" }}>Academy</span></div>
              <div className="f-bar" style={{ fontSize:"0.68rem", letterSpacing:"2px", color:"rgba(248,243,235,0.3)", marginTop:6 }}>TRANSFORMING LIVES THROUGH ENGLISH · TIRURANGADI, KERALA</div>
            </div>
            <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
              {["Home","About","Courses","Feedback","Contact"].map(s=>(
                <button key={s} onClick={()=>goto(s.toLowerCase())} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.75rem", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(248,243,235,0.35)", fontWeight:500, transition:"color 0.3s" }}
                  onMouseEnter={e=>{e.target.style.color="var(--champagne)";}} onMouseLeave={e=>{e.target.style.color="rgba(248,243,235,0.35)";}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <p style={{ fontSize:"0.75rem", color:"rgba(248,243,235,0.2)" }}>© 2024 SpeakWell English Academy · Founded by Muhammed Shafi Sir · Tirurangadi, Kerala, India</p>
            <p style={{ fontSize:"0.75rem", color:"rgba(212,168,83,0.35)" }}>Empowering every voice in Kerala 🇮🇳</p>
          </div>
        </div>
      </footer>

      {/* ─── RESPONSIVE OVERRIDES ─── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
          .about-grid    { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .why-grid      { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .contact-grid  { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .courses-grid  { grid-template-columns: 1fr !important; }
          .reviews-grid  { grid-template-columns: 1fr !important; }
          .video-grid    { grid-template-columns: 1fr !important; }
          .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .text-center   { text-align: center !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .courses-grid { grid-template-columns: repeat(2,1fr) !important; }
          .reviews-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
