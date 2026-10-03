import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from "motion/react";
import shafiProfile from "./assets/shafi_sir.png";
import Icon from "./components/Icon";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import { Counter, Magnetic, Reveal, ScrollWords, SplitReveal, Tilt } from "./components/motion";
import { useTyping } from "./lib/useTyping";
import { scrollToId, useMedia, useSmoothScroll } from "./lib/scroll";
import { COURSES, EMAIL, MARQUEE_WORDS, MODES, NAV, PHONE, PHONE_TEL, ROLES, STATS, WHY } from "./data";

const Scene3D = lazy(() => import("./components/Scene3D"));
const EASE = [0.16, 1, 0.3, 1];

const hasWebGL = (() => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch { return false; }
})();

/* If the 3D scene can't load or render, keep the page working and show the glow only */
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ─── PRELOADER ─── */
function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9));
      setN(v);
      if (v === 100) { clearInterval(t); setTimeout(onDone, 250); }
    }, 45);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <motion.div className="preloader" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
      <div className="logo logo-lg">Speak<span>Well</span></div>
      <div className="preloader-bar"><motion.div style={{ scaleX: n / 100 }} /></div>
      <div className="preloader-num">{String(n).padStart(3, "0")}</div>
    </motion.div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setScrolled(y > 40);
  });

  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((s) => { const el = document.getElementById(s.toLowerCase()); if (el) ob.observe(el); });
    return () => ob.disconnect();
  }, []);

  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <motion.header className={`nav ${scrolled ? "is-scrolled" : ""}`} animate={{ y: hidden ? -120 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <nav className="nav-inner">
          <button className="logo" onClick={() => go("home")} aria-label="SpeakWell home">Speak<span>Well</span></button>
          <ul className="nav-links">
            {NAV.map((s) => {
              const id = s.toLowerCase();
              return (
                <li key={s}>
                  <button className={active === id ? "nav-link is-active" : "nav-link"} onClick={() => go(id)}>
                    {active === id && <motion.span layoutId="nav-active" className="nav-active" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <span>{s}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="nav-cta"><button className="btn btn-gold btn-sm" onClick={() => go("contact")}>Enroll Now</button></div>
          <button className={open ? "burger is-open" : "burger"} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              {NAV.map((s, i) => (
                <motion.button key={s} className="mobile-link" onClick={() => go(s.toLowerCase())}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <span className="mobile-idx">0{i + 1}</span>{s}
                </motion.button>
              ))}
              <button className="btn btn-gold btn-block" onClick={() => go("contact")}>Enroll Now</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

/* ─── HERO ─── */
function Hero({ ready }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref);
  const typed = useTyping(ROLES);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(10px)"]);

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="hero-canvas" aria-hidden="true">
        <div className="hero-canvas-glow" />
        {hasWebGL && (
          <SceneBoundary>
            <Suspense fallback={null}>
              <Scene3D active={inView} reduced={reduce} />
            </Suspense>
          </SceneBoundary>
        )}
      </div>

      <motion.div className="container hero-content" style={reduce ? undefined : { y, opacity, filter: blur }}>
        <motion.div className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE }}>
          <span className="live-dot" /> Online &amp; Offline · Tirurangadi, Kerala
        </motion.div>

        <h1 className="hero-title">
          <SplitReveal text="Speak English" play={ready} className="line" delay={0.05} />
          <SplitReveal text="With Confidence," play={ready} className="line gold-text italic" delay={0.2} />
          <SplitReveal text="Change Your Life" play={ready} className="line" delay={0.35} />
        </h1>

        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.6, ease: EASE }}>
          Led by <span className="typed">{typed}</span>
        </motion.p>

        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.75, ease: EASE }}>
          <Magnetic><button className="btn btn-gold btn-lg" onClick={() => scrollToId("contact")}>Enroll Now <Icon name="arrow" size={18} /></button></Magnetic>
          <Magnetic><button className="btn btn-ghost btn-lg" onClick={() => scrollToId("courses")}>View All Courses</button></Magnetic>
        </motion.div>

        <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 1, delay: 1 }}>
          <div className="trust-avatars">
            {["#d4a853", "#7fb3ff", "#6ee7a0", "#ee9cf9"].map((c, i) => <span key={c} style={{ background: c, zIndex: 4 - i }}>{"APRS"[i]}</span>)}
          </div>
          <div>
            <div className="stars-inline">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={13} />)}</div>
            <div className="muted-sm"><strong>5,000+</strong> students transformed</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.button className="scroll-cue" onClick={() => scrollToId("about")} aria-label="Scroll down" style={{ opacity }}>
        <span className="scroll-cue-line" />
        <span>Scroll</span>
      </motion.button>
    </section>
  );
}

/* ─── KEYWORD BAND (scroll-linked) ─── */
function WordBand() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="word-band" ref={ref} aria-hidden="true">
      <motion.div className="word-row" style={{ x: x1 }}>
        {words.map((w, i) => <span key={i} className={i % 2 ? "outline" : ""}>{w}<i>✦</i></span>)}
      </motion.div>
      <motion.div className="word-row word-row-alt" style={{ x: x2 }}>
        {words.map((w, i) => <span key={i} className={i % 2 ? "" : "outline"}>{w}<i>✦</i></span>)}
      </motion.div>
    </div>
  );
}

/* ─── ABOUT ─── */
function About() {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div>
          <Reveal><div className="tag">About Mr. Muhammed Shafi Sir</div></Reveal>
          <h2 className="h2">
            <SplitReveal text="Your Mentor," className="line" />
            <SplitReveal text="Your Transformation" className="line gold-text italic" delay={0.15} />
          </h2>
          <Reveal delay={0.1}>
            <p className="lead">Mr. Muhammed Shafi Sir is the visionary Founder &amp; CEO of SpeakWell English Academy — a certified Spoken English Trainer, dynamic Motivational Speaker, and educator who has transformed thousands of lives across Kerala and beyond.</p>
          </Reveal>

          <blockquote className="about-quote">
            <Icon name="quote" size={40} className="about-quote-icon" />
            <ScrollWords className="serif quote-text" text="English is not just a language — it is the key that unlocks every door of opportunity. I don't just teach words; I teach the courage to use them." />
            <cite>— Mr. Muhammed Shafi Sir, Founder · SpeakWell English Academy</cite>
          </blockquote>

          <div className="pills">
            {["Certified Trainer", "Motivational Speaker", "CEO & Founder", "Corporate Expert", "Personality Coach"].map((p, i) => (
              <Reveal key={p} delay={i * 0.06} y={16}><span className="pill">{p}</span></Reveal>
            ))}
          </div>
        </div>

        <Reveal x={60} y={0} className="profile-wrap">
          <Tilt className="profile-card" max={9}>
            <div className="profile-img" ref={imgRef}>
              <motion.img src={shafiProfile} alt="Mr. Muhammed Shafi Sir" style={{ y: imgY }} />
              <div className="profile-img-fade" />
            </div>
            <div className="profile-info">
              <h3 className="serif">Mr. Muhammed Shafi Sir</h3>
              <div className="profile-role">Founder &amp; CEO · SpeakWell English Academy</div>
              <div className="profile-tags">
                {["English Trainer", "Speaker", "CEO", "Mentor"].map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className="float-badge badge-r">
              <strong className="gold-text">100+</strong>
              <span>Successful Students</span>
            </div>
            <div className="float-badge badge-l">
              <strong className="gold-text">10/10</strong>
              <span>Student Rating</span>
            </div>
          </Tilt>
          <div className="profile-orbit" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function Stats() {
  return (
    <section className="stats">
      <div className="container stats-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} y={30}>
            <Tilt className="glass stat" max={12}>
              <div className="stat-num gold-text"><Counter to={s.value} suffix={s.suffix} /></div>
              <div className="stat-label">{s.label}</div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── COURSES (horizontal scroll on desktop) ─── */
function CourseCard({ c, i }) {
  return (
    <Tilt className="glass course" max={8}>
      <div className="course-top">
        <span className="course-icon"><Icon name={c.icon} size={24} /></span>
        <span className="course-idx">0{i + 1}</span>
      </div>
      <span className="course-label">{c.label}</span>
      <h3 className="course-title">{c.title}</h3>
      <p className="course-body">{c.body}</p>
      <div className="course-meta">
        <span><Icon name="clock" size={14} /> {c.duration}</span>
        <span><Icon name="laptop" size={14} /> {c.mode}</span>
      </div>
      <button className="course-link" onClick={() => scrollToId("contact")}>Enroll in this course <Icon name="arrow" size={16} /></button>
    </Tilt>
  );
}

function Courses() {
  const desktop = useMedia("(min-width: 960px)");
  const reduce = useReducedMotion();
  const horizontal = desktop && !reduce;
  const target = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [horizontal]);

  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const header = (
    <div className="container courses-head">
      <div>
        <Reveal><div className="tag">Our Programs</div></Reveal>
        <h2 className="h2">
          <SplitReveal text="Courses for" className="line" />
          <SplitReveal text="Every Learner" className="line gold-text italic" delay={0.12} />
        </h2>
      </div>
      <Reveal delay={0.1}><p className="lead courses-lead">Expertly crafted programs — from absolute beginners to corporate leaders. Choose the path that fits your goals.</p></Reveal>
    </div>
  );

  if (!horizontal) {
    return (
      <section id="courses" className="section">
        {header}
        <div className="container grid-3 courses-grid">
          {COURSES.map((c, i) => <Reveal key={c.title} delay={(i % 3) * 0.08}><CourseCard c={c} i={i} /></Reveal>)}
        </div>
      </section>
    );
  }

  return (
    <section id="courses" ref={target} className="courses-pin" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="courses-sticky">
        {header}
        <motion.div ref={track} className="courses-track" style={{ x }}>
          {COURSES.map((c, i) => <div key={c.title} className="course-slot"><CourseCard c={c} i={i} /></div>)}
        </motion.div>
        <div className="container"><div className="courses-progress"><motion.div style={{ scaleX: bar }} /></div></div>
      </div>
    </section>
  );
}

/* ─── WHY ─── */
function Why() {
  return (
    <section id="why" className="section section-alt">
      <div className="container why-grid">
        <div className="why-sticky">
          <Reveal><div className="tag">Why SpeakWell</div></Reveal>
          <h2 className="h2">
            <SplitReveal text="What Makes Us" className="line" />
            <SplitReveal text="Different" className="line gold-text italic" delay={0.12} />
          </h2>
          <div className="modes">
            {MODES.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.12}>
                <Tilt className="glass mode" max={6}>
                  <div className="mode-head"><span className="course-icon"><Icon name={m.icon} size={22} /></span><h3 className="serif">{m.title}</h3></div>
                  <ul>{m.feats.map((f) => <li key={f}><Icon name="check" size={15} />{f}</li>)}</ul>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
        <ol className="why-list">
          {WHY.map(([h, p], i) => <WhyItem key={h} n={i + 1} h={h} p={p} />)}
        </ol>
      </div>
    </section>
  );
}

function WhyItem({ n, h, p }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 40%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [-35, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const reduce = useReducedMotion();
  return (
    <motion.li ref={ref} className="why-item" style={reduce ? undefined : { rotateX, opacity, transformPerspective: 900, transformOrigin: "top center" }}>
      <span className="why-num">{String(n).padStart(2, "0")}</span>
      <div>
        <h4>{h}</h4>
        <p>{p}</p>
      </div>
      <motion.span className="why-line" style={{ scaleX: line }} />
    </motion.li>
  );
}

/* ─── CTA (tilts flat as it scrolls in) ─── */
function CTA() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  return (
    <section className="cta-wrap" ref={ref}>
      <motion.div className="container" style={reduce ? undefined : { rotateX, scale, y, transformPerspective: 1400 }}>
        <div className="cta">
          <div className="cta-bg-text" aria-hidden="true">ENROLL NOW</div>
          <div className="cta-content">
            <h2 className="serif">Start Your Journey Today</h2>
            <p>Transform your English today. Secure your seat now and feel the difference.</p>
            <div className="cta-actions">
              <Magnetic><button className="btn btn-dark btn-lg" onClick={() => scrollToId("contact")}>Enroll Now <Icon name="arrow" size={18} /></button></Magnetic>
              <Magnetic><a className="btn btn-dark-ghost btn-lg" href={`tel:${PHONE_TEL}`}><Icon name="phone" size={18} /> Call Muhammed Shafi Sir</a></Magnetic>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const info = [
    ["pin", "Address", "SpeakWell English Academy, Tirurangadi, Kerala, India"],
    ["phone", "Phone / WhatsApp", PHONE, `tel:${PHONE_TEL}`],
    ["mail", "Email", EMAIL, `mailto:${EMAIL}`],
    ["clock", "Class Timings", "Morning · Evening · Weekend Batches"],
  ];
  return (
    <section id="contact" className="section">
      <div className="container contact-grid">
        <div>
          <Reveal><div className="tag">Get In Touch</div></Reveal>
          <h2 className="h2"><SplitReveal text="Let's" className="line" /> <SplitReveal text="Connect" className="gold-text italic" delay={0.1} /></h2>
          <Reveal delay={0.1}><p className="lead">Reach out to enroll or ask questions — we'd love to hear from you.</p></Reveal>
          <div className="info-list">
            {info.map(([ic, lbl, val, href], i) => (
              <Reveal key={lbl} delay={i * 0.07} x={-30} y={0}>
                <div className="info-row">
                  <span className="info-icon"><Icon name={ic} size={20} /></span>
                  <div>
                    <div className="info-label">{lbl}</div>
                    {href ? <a href={href} className="info-val">{val}</a> : <div className="info-val">{val}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal x={40} y={0}><ContactForm /></Reveal>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="logo">Speak<span>Well</span> <em>English Academy</em></div>
            <div className="footer-tagline">Transforming lives through English · Tirurangadi, Kerala</div>
          </div>
          <div className="footer-links">
            {["Home", ...NAV].map((s) => <button key={s} onClick={() => scrollToId(s.toLowerCase())}>{s}</button>)}
          </div>
        </div>
        <Reveal y={60}><div className="footer-mark" aria-hidden="true">SpeakWell</div></Reveal>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SpeakWell English Academy · Founded by Mr. Muhammed Shafi Sir · Tirurangadi, Kerala, India</p>
          <p className="gold-dim">Empowering every voice in Kerala</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const finishLoading = useCallback(() => setLoading(false), []);
  useSmoothScroll(!reduce);

  return (
    <div className="app">
      <div className="bg-fx" aria-hidden="true"><span className="orb orb-1" /><span className="orb orb-2" /><span className="grid-lines" /><span className="noise" /></div>

      <AnimatePresence>{loading && <Preloader key="pre" onDone={finishLoading} />}</AnimatePresence>

      <div className="announce">
        <div className="announce-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>✦ Special Offer: Online Spoken English Class just <b>₹699</b> ✦ SpeakWell English Academy · Conducted by Muhammed Shafi Sir · Tirurangadi, Kerala ✦ Speak With Confidence&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <Nav />
      <main>
        <Hero ready={!loading} />
        <WordBand />
        <About />
        <Stats />
        <Courses />
        <Why />
        <section id="feedback" className="section">
          <div className="container">
            <div className="center-head">
              <Reveal><div className="tag tag-center">Student Feedback</div></Reveal>
              <h2 className="h2"><SplitReveal text="Real Stories," /> <SplitReveal text="Real Results" className="gold-text italic" delay={0.12} /></h2>
              <Reveal delay={0.1}><p className="lead">Hear from our students — in their own words, voices, and videos.</p></Reveal>
            </div>
            <Reveal delay={0.15}><Testimonials /></Reveal>
          </div>
        </section>
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
