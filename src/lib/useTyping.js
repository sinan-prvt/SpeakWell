import { useEffect, useState } from "react";

/* Cycling typewriter text */
export function useTyping(phrases) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const full = phrases[i];
    let next = () => setText(full.slice(0, text.length + (deleting ? -1 : 1)));
    let delay = deleting ? 28 : 55;
    if (!deleting && text === full) { next = () => setDeleting(true); delay = 1600; }
    else if (deleting && text === "") { next = () => { setDeleting(false); setI((i + 1) % phrases.length); }; delay = 250; }
    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases]);
  return text;
}
