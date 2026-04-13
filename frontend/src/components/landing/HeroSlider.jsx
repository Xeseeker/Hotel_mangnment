import React, { useState, useEffect, useCallback } from "react";

const SLIDE_INTERVAL_MS = 6500;

/**
 * Full-bleed hero background slider (fade transition, no external animation libs).
 */
const HeroSlider = ({ slides, className = "" }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir) => {
      setIndex((i) => {
        if (dir === "next") return (i + 1) % slides.length;
        return (i - 1 + slides.length) % slides.length;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1 || paused) return undefined;
    const id = setInterval(() => go("next"), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length, paused, go]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPaused(true);
    const handler = () => setPaused(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!slides?.length) return null;

  return (
    <div
      className={`absolute inset-0 ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setPaused(false);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hotel imagery"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={slide.src}
            alt={slide.alt || ""}
            className="h-full w-full object-cover object-center"
            fetchPriority={i === 0 ? "high" : "low"}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => go("prev")}
        className="absolute left-3 top-1/2 z-[5] -translate-y-1/2 rounded-full border border-white/25 bg-elysium-ink/35 p-2.5 text-white backdrop-blur-md transition hover:bg-elysium-ink/55 sm:left-6 sm:p-3"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go("next")}
        className="absolute right-3 top-1/2 z-[5] -translate-y-1/2 rounded-full border border-white/25 bg-elysium-ink/35 p-2.5 text-white backdrop-blur-md transition hover:bg-elysium-ink/55 sm:right-6 sm:p-3"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className="absolute bottom-24 left-0 right-0 z-[5] flex justify-center gap-2 sm:bottom-28"
        role="tablist"
        aria-label="Choose slide"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-gold-400" : "w-2 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
