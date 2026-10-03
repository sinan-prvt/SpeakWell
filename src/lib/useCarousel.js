import { useEffect, useState } from "react";

/* Tracks which child of a horizontally scrolling container is centred.
   Marks it with .is-active so CSS can animate the focused card. */
export function useCarousel(ref) {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const kids = [...el.children];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      kids.forEach((k, i) => {
        const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      kids.forEach((k, i) => k.classList.toggle("is-active", i === best));
      setCount(kids.length);
      setActive(best);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [ref]);

  const go = (i) => {
    const el = ref.current, k = el?.children[i];
    if (k) el.scrollTo({ left: k.offsetLeft - (el.clientWidth - k.offsetWidth) / 2, behavior: "smooth" });
  };
  return { active, count, go };
}
