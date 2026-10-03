import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1];

/* Fade/slide in once when scrolled into view */
export function Reveal({ children, delay = 0, y = 28, x = 0, scale = 1, as = "div", className, style }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/* Headline that rises word-by-word from behind a mask */
export function SplitReveal({ text, className, delay = 0, stagger = 0.06, as = "span", play }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = play ?? inView;
  const Tag = as;
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="split-mask" aria-hidden="true">
          <motion.span
            className="split-word"
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      )).flatMap((el, i) => (i ? [" ", el] : [el]))}
    </Tag>
  );
}

/* Number that counts up once visible */
export function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: EASE, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}
