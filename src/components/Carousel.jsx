/* Dots, counter and swipe hint — only shown on phones (see CSS) */
export function CarouselDots({ active, count, go, label }) {
  if (!count) return null;
  return (
    <div className="carousel-nav">
      <div className="carousel-dots">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} className={i === active ? "is-active" : ""} onClick={() => go(i)} aria-label={`${label} ${i + 1}`} />
        ))}
      </div>
      <span className="carousel-count">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
      {active === 0 && <span className="carousel-hint" aria-hidden="true">Swipe <span>→</span></span>}
    </div>
  );
}
