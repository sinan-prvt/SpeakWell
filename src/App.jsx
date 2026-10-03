import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from "motion/react";
import shafiProfile from "./assets/shafi_sir.png";
import Icon from "./components/Icon";
import ContactForm from "./components/ContactForm";
import { CarouselDots } from "./components/Carousel";
import { useCarousel } from "./lib/useCarousel";
import { Counter, Reveal, SplitReveal, Tilt } from "./components/motion";
import { scrollToId, setScrollLock, useMedia, useSmoothScroll } from "./lib/scroll";
import {
  EMAIL, FAQ, FORMATS, FOUNDER, NAV, PHONE, PHONE_TEL, PILLARS, PROGRAMS, REVIEWS, STATS, STEPS, WHATSAPP,
} from "./data";

const EASE = [0.16, 1, 0.3, 1];

const Logo = ({ onClick, light }) => (
  <button className={light ? "logo logo-light" : "logo"} onClick={onClick} aria-label="SpeakWell English Academy — home">
    <span className="logo-mark"><Icon name="chat" size={18} stroke={2} /></span>
    <span className="logo-text">SpeakWell<small>English Academy</small></span>
  </button>
);

const SectionHead = ({ eyebrow, title, accent, sub, center }) => (
  <div className={center ? "sec-head sec-head-center" : "sec-head"}>
    <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
    <h2 className="h2">
      <SplitReveal text={title} />{accent && <> <SplitReveal text={accent} className="accent" delay={0.1} /></>}
    </h2>
    {sub && <Reveal delay={0.1}><p className="sub">{sub}</p></Reveal>}
  </div>
);

/* ─── NAV ─── */
function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    const ob = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([, id]) => { const el = document.getElementById(id); if (el) ob.observe(el); });
    return () => ob.disconnect();
  }, []);

  const go = (id) => { setOpen(false); setScrollLock(false); scrollToId(id); };
  useEffect(() => { setScrollLock(open); }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "is-scrolled" : ""}`}>
      <div className="container nav-inner">
        <Logo onClick={() => go("home")} />
        <nav className="nav-links" aria-label="Primary">
          {NAV.map(([label, id]) => (
            <button key={id} className={active === id ? "nav-link is-active" : "nav-link"} onClick={() => go(id)}>
              {active === id && <motion.span layoutId="nav-dot" className="nav-dot" />}
              {label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-phone" href={`tel:${PHONE_TEL}`}><Icon name="phone" size={16} /> {PHONE}</a>
          <button className="btn btn-primary btn-sm" onClick={() => go("contact")}>Enroll now</button>
        </div>
        <button className={open ? "burger is-open" : "burger"} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><span /><span /></button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-menu" aria-label="Mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
            <div className="container mobile-menu-inner">
              {NAV.map(([label, id], i) => (
                <motion.button key={id} className="mobile-link" onClick={() => go(id)}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}>
                  <span className="mobile-idx">0{i + 1}</span>{label}<Icon name="arrow" size={20} />
                </motion.button>
              ))}
              <motion.div className="mobile-menu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <button className="btn btn-primary btn-lg btn-block" onClick={() => go("contact")}>Enroll now <Icon name="arrow" size={18} /></button>
                <div className="mobile-contact">
                  <a href={`tel:${PHONE_TEL}`}><Icon name="phone" size={16} /> {PHONE}</a>
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={16} /> WhatsApp</a>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    </header>
  );
}

/* ─── HERO ─── */
function HeroVisual() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });
  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 600], [0, -60]);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="hero-visual" onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <div className="hv-orbits" aria-hidden="true"><span /><span /><span /></div>
      <motion.div className="hv-stage" style={reduce ? undefined : { rotateX: rx, rotateY: ry, y: lift }}>
        <div className="hv-photo">
          <img src={shafiProfile} alt={`${FOUNDER}, Founder & CEO of SpeakWell English Academy`} />
          <div className="hv-photo-caption">
            <strong>{FOUNDER}</strong>
            <span>Founder &amp; CEO · Lead Trainer</span>
          </div>
        </div>

        <motion.div className="hv-card hv-live" style={{ z: 70 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: EASE }}>
          <span className="live-dot" />
          <div><strong>Live practice session</strong><span>Online &amp; in person</span></div>
        </motion.div>

        <motion.div className="hv-card hv-wave" style={{ z: 110 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }}>
          <span className="hv-icon"><Icon name="mic" size={18} /></span>
          <div className="wave" aria-hidden="true">{[10, 18, 8, 22, 14, 24, 12, 18, 9, 20, 13, 7, 16, 21, 11].map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 0.07}s` }} />)}</div>
        </motion.div>

        <motion.div className="hv-card hv-score" style={{ z: 90 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.8, ease: EASE }}>
          <span className="hv-label">Success rate</span>
          <strong>98%</strong>
          <div className="hv-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 0.98 }} transition={{ delay: 1.6, duration: 1.4, ease: EASE }} /></div>
        </motion.div>

        <motion.div className="hv-card hv-rating" style={{ z: 60 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8, ease: EASE }}>
          <div className="stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} />)}</div>
          <span>Rated 10/10 by learners</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.button className="hero-badge" onClick={() => scrollToId("contact")} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <span className="badge-pill">Offer</span> Online Spoken English course — just ₹699 <Icon name="arrow" size={14} />
          </motion.button>
          <h1 className="h1">
            <SplitReveal text="Speak English with" play delay={0.1} />{" "}
            <SplitReveal text="clarity and confidence." play className="accent" delay={0.3} />
          </h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8, ease: EASE }}>
            Practical spoken-English programs for students, professionals and job seekers — taught personally by {FOUNDER}, Founder of SpeakWell English Academy. Learn online or in our Tirurangadi classroom.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: EASE }}>
            <button className="btn btn-primary btn-lg" onClick={() => scrollToId("contact")}>Enroll now <Icon name="arrow" size={18} /></button>
            <button className="btn btn-outline btn-lg" onClick={() => scrollToId("programs")}>Explore programs</button>
          </motion.div>
          <motion.ul className="hero-points" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
            {["Taught by the founder", "Morning, evening & weekend batches", "Certificate on completion"].map((p) => <li key={p}><Icon name="check" size={16} stroke={2.2} />{p}</li>)}
          </motion.ul>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function Stats() {
  return (
    <section className="stats-band">
      <div className="container stats-grid">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="stat">
            <div className="stat-num"><Counter to={s.value} suffix={s.suffix} /></div>
            <div className="stat-label">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── PROGRAMS ─── */
function Programs() {
  const ref = useRef(null);
  const nav = useCarousel(ref);
  return (
    <section id="programs" className="section">
      <div className="container">
        <SectionHead eyebrow="Programs" title="Programs built around" accent="real outcomes."
          sub="Six focused programs — from your first conversation to your next boardroom presentation. Every program runs in flexible morning, evening and weekend batches." />
        <div className="programs-grid carousel" ref={ref}>
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="program-cell">
              <Tilt max={6} className="tilt-fill"><article className={p.featured ? "program spot is-featured" : "program spot"}>
                {p.featured && <span className="program-flag">Signature program</span>}
                <div className="program-top">
                  <span className="program-icon"><Icon name={p.icon} size={22} /></span>
                  <span className="program-level">{p.level}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <dl className="program-meta">
                  <div><dt>Duration</dt><dd>{p.duration}</dd></div>
                  <div><dt>Format</dt><dd>{p.mode}</dd></div>
                  <div className="full"><dt>Ideal for</dt><dd>{p.ideal}</dd></div>
                </dl>
                <button className="program-cta" onClick={() => scrollToId("contact")}>Enquire now <Icon name="arrow" size={16} /></button>
              </article></Tilt>
            </Reveal>
          ))}
        </div>
        <CarouselDots {...nav} label="Program" />
      </div>
    </section>
  );
}

/* ─── METHOD ─── */
function Method() {
  const ref = useRef(null);
  const nav = useCarousel(ref);
  return (
    <section id="method" className="section section-tint">
      <div className="container">
        <SectionHead center eyebrow="The SpeakWell method" title="Built on practice," accent="not memorisation."
          sub="Fluency comes from speaking — often, with guidance and in a supportive room. Everything about how we teach is designed around that." />
        <div className="pillars carousel" ref={ref}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08}>
              <div className="spot pillar">
                <span className="pillar-icon"><Icon name={p.icon} size={22} /></span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <CarouselDots {...nav} label="Reason" />
      </div>
    </section>
  );
}

/* ─── JOURNEY (cards stack as you scroll) ─── */
function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const nav = useCarousel(ref);
  return (
    <section className="section">
      <div className="container journey">
        <div className="journey-head">
          <SectionHead eyebrow="How it works" title="Your path to" accent="fluent English." sub="A clear, supportive journey from your first enquiry to your certificate — and beyond." />
          <Reveal delay={0.15}><button className="btn btn-primary" onClick={() => scrollToId("contact")}>Start with step one <Icon name="arrow" size={18} /></button></Reveal>
        </div>
        <div className="steps-col">
          <ol className="steps carousel" ref={ref}>
            {STEPS.map((s, i) => <Step key={s.title} s={s} i={i} n={STEPS.length} progress={scrollYProgress} />)}
          </ol>
          <CarouselDots {...nav} label="Step" />
        </div>
      </div>
    </section>
  );
}

function Step({ s, i, n, progress }) {
  const reduce = useReducedMotion();
  const phone = useMedia("(max-width: 640px)");
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04]);
  return (
    <li className="step-wrap" style={{ top: `calc(110px + ${i * 22}px)` }}>
      <motion.div className="step" style={reduce || phone ? undefined : { scale }}>
        <span className="step-num">0{i + 1}</span>
        <div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      </motion.div>
    </li>
  );
}

/* ─── TRAINER ─── */
function Trainer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <section id="trainer" className="section">
      <div className="container trainer-grid">
        <Reveal className="trainer-photo-wrap">
          <motion.div className="trainer-photo" ref={ref} initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }} whileInView={{ clipPath: "inset(0% 0 0 0 round 28px)" }} viewport={{ once: true, margin: "0px 0px -15% 0px" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}>
            <motion.img src={shafiProfile} alt={FOUNDER} style={{ y }} />
          </motion.div>
          <div className="trainer-stat"><strong>10+</strong><span>years helping learners find their voice</span></div>
        </Reveal>
        <div>
          <SectionHead eyebrow="Meet your trainer" title={FOUNDER} />
          <Reveal delay={0.05}><p className="trainer-role">Founder &amp; CEO, SpeakWell English Academy</p></Reveal>
          <Reveal delay={0.1}>
            <p className="sub">{FOUNDER} is a certified spoken-English trainer, motivational speaker and corporate communication coach. For more than a decade he has helped thousands of learners across Kerala and beyond speak English with confidence — in classrooms, interviews, offices and on stage.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <blockquote className="trainer-quote">
              <p>“English is not just a language — it is the key that unlocks every door of opportunity. I don't just teach words; I teach the courage to use them.”</p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="creds">
              {["Certified Spoken English Trainer", "Motivational Speaker", "Corporate Communication Trainer", "Personality Development Coach"].map((c) => <li key={c}><Icon name="check" size={16} stroke={2.2} />{c}</li>)}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FORMATS ─── */
function Formats() {
  return (
    <section className="section section-tint">
      <div className="container">
        <SectionHead center eyebrow="Learning formats" title="Learn online" accent="or in person." sub="The same program, the same trainer, the same results — choose the format that fits your life." />
        <div className="formats">
          {FORMATS.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className={i ? "spot format format-dark" : "spot format"}>
                <div className="format-head">
                  <span className="pillar-icon"><Icon name={f.icon} size={22} /></span>
                  <div><h3>{f.title}</h3><span>{f.note}</span></div>
                </div>
                <ul>{f.feats.map((x) => <li key={x}><Icon name="check" size={16} stroke={2.2} />{x}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── REVIEWS (dual marquee) ─── */
const ReviewCard = ({ r }) => (
  <figure className="spot review">
    <div className="stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} />)}</div>
    <blockquote>“{r.text}”</blockquote>
    <figcaption>
      <span className="avatar">{r.name.split(" ").map((w) => w[0]).join("")}</span>
      <span><strong>{r.name}</strong><small>{r.role}</small></span>
    </figcaption>
  </figure>
);

function Reviews() {
  const half = Math.ceil(REVIEWS.length / 2);
  const rows = [REVIEWS.slice(0, half), REVIEWS.slice(half)];
  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <SectionHead center eyebrow="Learner stories" title="Real people." accent="Real progress." sub="Students, professionals and parents on what changed after SpeakWell." />
      </div>
      <div className="marquee-wrap">
        {rows.map((row, ri) => (
          <div key={ri} className={ri ? "marquee marquee-rev" : "marquee"}>
            <div className="marquee-track">
              {[...row, ...row].map((r, i) => <ReviewCard key={i} r={r} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section">
      <div className="container faq-grid">
        <div>
          <SectionHead eyebrow="FAQ" title="Questions," accent="answered." sub="Can't find what you're looking for? Call or WhatsApp us — we're happy to help." />
          <Reveal delay={0.15}>
            <a className="btn btn-outline" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Chat on WhatsApp</a>
          </Reveal>
        </div>
        <div className="faq-list">
          {FAQ.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.04}>
              <div className={open === i ? "faq is-open" : "faq"}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {q}<span className="faq-icon"><Icon name="plus" size={18} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 28]);
  return (
    <section className="cta-section" ref={ref}>
      <div className="container">
        <motion.div className="cta" style={reduce ? undefined : { scale, borderRadius: radius }}>
          <div className="cta-glow" aria-hidden="true" />
          <span className="eyebrow eyebrow-light">Admissions open</span>
          <h2>Your voice deserves to be heard.</h2>
          <p>Join the next batch and start speaking English with confidence — online or in Tirurangadi.</p>
          <div className="cta-actions">
            <button className="btn btn-light btn-lg" onClick={() => scrollToId("contact")}>Enroll now <Icon name="arrow" size={18} /></button>
            <a className="btn btn-ghost-light btn-lg" href={`tel:${PHONE_TEL}`}><Icon name="phone" size={18} /> {PHONE}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const info = [
    ["phone", "Call or WhatsApp", PHONE, `tel:${PHONE_TEL}`],
    ["mail", "Email", EMAIL, `mailto:${EMAIL}`],
    ["pin", "Campus", "SpeakWell English Academy, Tirurangadi, Kerala, India"],
    ["clock", "Batches", "Morning · Evening · Weekend"],
  ];
  return (
    <section id="contact" className="section">
      <div className="container contact-grid">
        <div>
          <SectionHead eyebrow="Enroll" title="Take the first step" accent="today." sub="Send us a quick enquiry and our team will get back to you within 24 hours with batch dates, fees and the right program for your goals." />
          <ul className="info-list">
            {info.map(([ic, lbl, val, href], i) => (
              <Reveal key={lbl} as="li" delay={i * 0.06} className="info-row">
                <span className="info-icon"><Icon name={ic} size={20} /></span>
                <span>
                  <small>{lbl}</small>
                  {href ? <a href={href}>{val}</a> : <span>{val}</span>}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light onClick={() => scrollToId("home")} />
            <p>Helping students, professionals and families across Kerala speak English with clarity and confidence for more than a decade.</p>
          </div>
          <div>
            <h4>Programs</h4>
            <ul>{PROGRAMS.map((p) => <li key={p.title}><button onClick={() => scrollToId("programs")}>{p.title}</button></li>)}</ul>
          </div>
          <div>
            <h4>Academy</h4>
            <ul>{NAV.map(([l, id]) => <li key={id}><button onClick={() => scrollToId(id)}>{l}</button></li>)}<li><button onClick={() => scrollToId("contact")}>Enroll</button></li></ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${PHONE_TEL}`}>{PHONE}</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li>Tirurangadi, Kerala, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SpeakWell English Academy. All rights reserved.</span>
          <span>Founded by {FOUNDER}</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── KEYWORD BAND (moves with scroll) ─── */
function WordBand() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const words = ["Fluency", "Confidence", "Public Speaking", "Interviews", "Business English", "Personality", "Pronunciation", "Leadership"];
  const row = [...words, ...words, ...words];
  return (
    <div className="word-band" ref={ref} aria-hidden="true">
      <motion.div className="word-row" style={{ x: x1 }}>{row.map((w, i) => <span key={i} className={i % 2 ? "outline" : ""}>{w}<i>✦</i></span>)}</motion.div>
      <motion.div className="word-row word-row-sm" style={{ x: x2 }}>{row.map((w, i) => <span key={i} className={i % 2 ? "" : "outline"}>{w}<i>✦</i></span>)}</motion.div>
    </div>
  );
}

/* ─── MOBILE ACTION BAR + BACK TO TOP ─── */
function FloatingActions() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    // Hide once the enquiry form is on screen so the bar never covers it
    const contact = document.getElementById("contact")?.getBoundingClientRect();
    const atContact = contact && contact.top < window.innerHeight;
    setShow(y > window.innerHeight * 0.8 && !atContact);
  });
  const dash = useTransform(scrollYProgress, (v) => 126 - v * 126);
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div key="bar" className="mobile-bar" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.45, ease: EASE }}>
            <a href={`tel:${PHONE_TEL}`} className="mobile-bar-btn" aria-label="Call"><Icon name="phone" size={20} /></a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="mobile-bar-btn" aria-label="WhatsApp"><Icon name="whatsapp" size={20} /></a>
            <button className="btn btn-primary mobile-bar-cta" onClick={() => scrollToId("contact")}>Enroll now <Icon name="arrow" size={18} /></button>
          </motion.div>
          <motion.button key="top" className="to-top" onClick={() => scrollToId("home")} aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
            <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" /><motion.circle cx="22" cy="22" r="20" className="to-top-ring" style={{ strokeDashoffset: dash }} /></svg>
            <Icon name="arrow" size={18} style={{ transform: "rotate(-90deg)" }} />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}

/* Cards with .spot get a soft gold light that follows the cursor */
function useSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const el = e.target.closest?.(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const reduce = useReducedMotion();
  useSmoothScroll(!reduce);
  useSpotlight();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <WordBand />
        <Programs />
        <Method />
        <Journey />
        <Trainer />
        <Formats />
        <Reviews />
        <Faq />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
