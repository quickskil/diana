// src/components/ProofCarousel.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/**
 * Accessible, reduced-motion-friendly scroll-snap carousel.
 * Keyboard: Tab to focus buttons; arrow keys work when the track is focused.
 * Auto-advance pauses on hover, focus, or when prefers-reduced-motion is set.
 */
type Slide = { title: string; blurb: string; meta?: string };

const slides: Slide[] = [
  { title: "Calls booked after-hours", blurb: "AI voice receptionist booked 12 consults last week while staff were offline.", meta: "Local Services" },
  { title: "Faster page, higher conversion", blurb: "Homepage LCP improved from 3.9s → 1.9s; trial signups +26% MoM.", meta: "SaaS" },
  { title: "More relevant clicks", blurb: "Tighter themes + new landers cut CPC −18% and raised QS to 8–9.", meta: "Legal" },
  { title: "Creative angles that win", blurb: "3 hooks iterated weekly; CPA −22% with fresh social proof.", meta: "DTC" },
  { title: "Fewer missed calls", blurb: "Overflow captured during peak season; dispatch warm-transfers priority jobs.", meta: "HVAC" },
];

export default function ProofCarousel() {
  const id = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  // Auto-advance every 4.5s (unless paused or prefers-reduced-motion)
  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  // Snap to current slide
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  }, [index, reduceMotion]);

  function prev() { setIndex((p) => (p - 1 + slides.length) % slides.length); }
  function next() { setIndex((p) => (p + 1) % slides.length); }

  return (
    <div
      className="relative"
      role="region"
      aria-labelledby={`${id}-label`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div id={`${id}-label`} className="sr-only">Recent wins carousel</div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-hidden rounded-2xl border border-white/10"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-live="polite"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); next(); }
          if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
        }}
        style={{ scrollBehavior: "smooth" }}
      >
        {slides.map((s, i) => (
          <div
            key={s.title}
            className="w-full shrink-0 snap-start p-6 grid content-between bg-white/[0.02]"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <div>
              <div className="text-sm text-white/60">{s.meta}</div>
              <div className="text-xl font-semibold mt-1">{s.title}</div>
              <p className="text-white/70 mt-2">{s.blurb}</p>
            </div>
            <div className="mt-6 h-px bg-white/10" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-2 hidden sm:flex items-center gap-2">
        <button aria-label="Previous" className="btn-ghost" onClick={prev}><ChevronLeft /></button>
      </div>
      <div className="absolute inset-y-0 right-2 hidden sm:flex items-center gap-2">
        <button aria-label="Next" className="btn-ghost" onClick={next}><ChevronRight /></button>
      </div>

      {/* Dots + Pause */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          className="btn-ghost"
          aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
