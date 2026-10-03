import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import { Tilt } from "./motion";
import { VIDEOS, VOICES, WRITTEN } from "../data";

const EASE = [0.16, 1, 0.3, 1];
const PER_PAGE = 3;

const Stars = () => (
  <div className="stars" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} />)}
  </div>
);

const Avatar = ({ name, color, size = 40 }) => (
  <div className="avatar" style={{ width: size, height: size, background: color }}>{name[0]}</div>
);

function VoiceNote({ name, time, color, quote }) {
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const tmr = useRef(null);
  const secs = time.split(":").reduce((a, b) => a * 60 + +b, 0);

  const toggle = () => {
    if (playing) { clearInterval(tmr.current); setPlaying(false); return; }
    setPlaying(true);
    tmr.current = setInterval(() => setProg((p) => {
      if (p >= 100) { clearInterval(tmr.current); setPlaying(false); return 0; }
      return p + 100 / (secs * 5);
    }), 200);
  };
  useEffect(() => () => clearInterval(tmr.current), []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const bars = [8, 14, 6, 18, 10, 22, 12, 16, 8, 20, 14, 6, 12, 18, 10, 14, 8, 16, 12, 20, 6, 14, 10, 18];

  return (
    <div className="glass voice">
      <div className="voice-head">
        <Avatar name={name} color={color} size={42} />
        <div>
          <div className="t-name">{name}</div>
          <div className="t-role">Voice Testimonial · SpeakWell Student</div>
        </div>
      </div>
      <p className="t-quote">“{quote}”</p>
      <div className="voice-player">
        <button className="play-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
        <div className="wave">
          {bars.map((h, i) => (
            <span key={i}
              className={playing ? "wave-bar is-playing" : "wave-bar"}
              style={{ height: h, animationDelay: `${(i % 6) * 0.08}s`, opacity: i / bars.length <= prog / 100 ? 1 : 0.3 }} />
          ))}
        </div>
        <span className="voice-time">{fmt(Math.floor((prog / 100) * secs))} / {time}</span>
      </div>
    </div>
  );
}

function VideoCard({ name, role, quote, accent }) {
  const [on, setOn] = useState(false);
  return (
    <Tilt className="glass video-card" max={6}>
      <button className="video-thumb" onClick={() => setOn(!on)} style={{ "--accent": accent }} aria-label={on ? "Stop video" : `Play video from ${name}`}>
        <span className="chip">Video</span>
        {on ? (
          <div className="video-playing">
            <div className="wave">
              {[10, 18, 8, 22, 14, 20, 10, 16, 8, 18].map((h, i) => <span key={i} className="wave-bar is-playing" style={{ height: h, animationDelay: `${i * 0.06}s` }} />)}
            </div>
            <span className="muted-sm">Playing video…</span>
          </div>
        ) : (
          <span className="play-orb"><Icon name="play" size={20} /></span>
        )}
      </button>
      <div className="video-body">
        <p className="t-quote">“{quote}”</p>
        <div className="t-person">
          <Avatar name={name} color={accent} size={34} />
          <div><div className="t-name">{name}</div><div className="t-role">{role}</div></div>
          <Stars />
        </div>
      </div>
    </Tilt>
  );
}

export default function Testimonials() {
  const [tab, setTab] = useState("written");
  const [page, setPage] = useState(0);
  const pages = Math.ceil(WRITTEN.length / PER_PAGE);
  const tabs = [["written", `Written (${WRITTEN.length})`], ["video", `Videos (${VIDEOS.length})`], ["voice", `Voice Notes (${VOICES.length})`]];

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "tab is-active" : "tab"} onClick={() => setTab(id)}>
            {tab === id && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab + page}
          initial={{ opacity: 0, y: 30, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 6 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ transformPerspective: 1200 }}
        >
          {tab === "written" && (
            <div className="grid-3">
              {WRITTEN.slice(page * PER_PAGE, (page + 1) * PER_PAGE).map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}>
                  <Tilt className="glass review" max={7}>
                    <Icon name="quote" size={30} className="review-quote-icon" />
                    <Stars />
                    <p className="t-quote">“{r.text}”</p>
                    <div className="t-person">
                      <Avatar name={r.name} color={r.color} />
                      <div><div className="t-name">{r.name}</div><div className="t-role">{r.role}</div></div>
                    </div>
                  </Tilt>
                </motion.div>
              ))}
            </div>
          )}
          {tab === "video" && <div className="grid-2 narrow">{VIDEOS.map((v) => <VideoCard key={v.name} {...v} />)}</div>}
          {tab === "voice" && <div className="stack narrow-sm">{VOICES.map((v) => <VoiceNote key={v.name} {...v} />)}</div>}
        </motion.div>
      </AnimatePresence>

      {tab === "written" && (
        <div className="pager">
          <button className="round-btn" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous reviews"><Icon name="arrowL" size={18} /></button>
          <div className="dots">
            {Array.from({ length: pages }, (_, p) => (
              <button key={p} className={p === page ? "dot is-active" : "dot"} onClick={() => setPage(p)} aria-label={`Reviews page ${p + 1}`} />
            ))}
          </div>
          <button className="round-btn" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} aria-label="Next reviews"><Icon name="arrow" size={18} /></button>
        </div>
      )}
    </>
  );
}
