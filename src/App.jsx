import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from "motion/react";
import shafiProfile from "./assets/shafi_sir.png";
import Icon from "./components/Icon";
import ContactForm from "./components/ContactForm";
import { Counter, Reveal, SplitReveal } from "./components/motion";
import { scrollToId, useSmoothScroll } from "./lib/scroll";
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

  const go = (id) => { setOpen(false); scrollToId(id); };

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
          <motion.nav className="mobile-menu" aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="container">
              {NAV.map(([label, id]) => <button key={id} className="mobile-link" onClick={() => go(id)}>{label}<Icon name="arrow" size={18} /></button>)}
              <button className="btn btn-primary btn-block" onClick={() => go("contact")}>Enroll now</button>
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
      <motion.div className="hv-stage" style={reduce ? undefined : { rotateX: rx, rotateY: ry, y: lift }}>
        <div className="hv-photo">
          <img src={shafiProfile} alt={`${FOUNDER}, Founder & CEO of SpeakWell English Academy`} />
          <div className="hv-photo-caption">
            <strong>{FOUNDER}</strong>
            <span>Founder &amp; CEO · Lead Trainer</span>
          </div>
        </div>

        <motion.div className="hv-card hv-live" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: EASE }}>
          <span className="live-dot" />
          <div><strong>Live practice session</strong><span>Online &amp; in person</span></div>
        </motion.div>

        <motion.div className="hv-card hv-wave" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }}>
          <span className="hv-icon"><Icon name="mic" size={18} /></span>
          <div className="wave" aria-hidden="true">{[10, 18, 8, 22, 14, 24, 12, 18, 9, 20, 13, 7, 16, 21, 11].map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 0.07}s` }} />)}</div>
        </motion.div>

        <motion.div className="hv-card hv-score" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.8, ease: EASE }}>
          <span className="hv-label">Success rate</span>
          <strong>98%</strong>
          <div className="hv-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 0.98 }} transition={{ delay: 1.6, duration: 1.4, ease: EASE }} /></div>
        </motion.div>

        <motion.div className="hv-card hv-rating" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8, ease: EASE }}>
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
  return (
    <section id="programs" className="section">
      <div className="container">
        <SectionHead eyebrow="Programs" title="Programs built around" accent="real outcomes."
          sub="Six focused programs — from your first conversation to your next boardroom presentation. Every program runs in flexible morning, evening and weekend batches." />
        <div className="programs-grid">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08} className="program-cell">
              <article className={p.featured ? "program is-featured" : "program"}>
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
                <button className="program-cta" onClick={() => scrollToId("contact")}>Enquire about this program <Icon name="arrow" size={16} /></button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── METHOD ─── */
function Method() {
  return (
    <section id="method" className="section section-tint">
      <div className="container">
        <SectionHead center eyebrow="The SpeakWell method" title="Built on practice," accent="not memorisation."
          sub="Fluency comes from speaking — often, with guidance and in a supportive room. Everything about how we teach is designed around that." />
        <div className="pillars">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08}>
              <div className="pillar">
                <span className="pillar-icon"><Icon name={p.icon} size={22} /></span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── JOURNEY (cards stack as you scroll) ─── */
function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="section">
      <div className="container journey">
        <div className="journey-head">
          <SectionHead eyebrow="How it works" title="Your path to" accent="fluent English." sub="A clear, supportive journey from your first enquiry to your certificate — and beyond." />
          <Reveal delay={0.15}><button className="btn btn-primary" onClick={() => scrollToId("contact")}>Start with step one <Icon name="arrow" size={18} /></button></Reveal>
        </div>
        <ol className="steps" ref={ref}>
          {STEPS.map((s, i) => <Step key={s.title} s={s} i={i} n={STEPS.length} progress={scrollYProgress} />)}
        </ol>
      </div>
    </section>
  );
}

function Step({ s, i, n, progress }) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04]);
  return (
    <li className="step-wrap" style={{ top: `calc(110px + ${i * 22}px)` }}>
      <motion.div className="step" style={reduce ? undefined : { scale }}>
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
          <div className="trainer-photo" ref={ref}>
            <motion.img src={shafiProfile} alt={FOUNDER} style={{ y }} />
          </div>
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
              <div className={i ? "format format-dark" : "format"}>
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
  <figure className="review">
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

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const reduce = useReducedMotion();
  useSmoothScroll(!reduce);
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
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
    </>
  );
}
