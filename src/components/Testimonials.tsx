// src/components/Testimonials.tsx
'use client';

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Script from "next/script";

type Item = {
  name: string;
  role?: string;
  text: string;
  metric?: string;
  rating?: number;     // 1..5
  date?: string;       // ISO, for JSON-LD
};

const items: Item[] = [
  { name: "A. Rivera — DTC Brand", text: "We 3x’d ROAS in 6 weeks and cut CAC by 31%.", metric: "ROAS 3.2→5.0", rating: 5, date: "2025-03-21" },
  { name: "M. Chen — SaaS", text: "Our new site and funnel doubled demo requests.", metric: "Demos +92%", rating: 5, date: "2025-05-02" },
  { name: "J. Diaz — Home Services", text: "The AI receptionist rescued 40% of missed calls.", metric: "Answer rate +40%", rating: 5, date: "2024-11-18" },
];

export default function Testimonials() {
  // a11y ids
  const id = useId();
  // carousel state
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // computed
  const total = items.length;
  const active = ((index % total) + total) % total;

  // Snap to active slide (no layout jank per web.dev). :contentReference[oaicite:3]{index=3}
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ left: active * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  // Autoplay that pauses on hover/focus/visibility and respects reduced motion. :contentReference[oaicite:4]{index=4}
  useEffect(() => {
    if (reduce) return;
    let hover = false;
    let focus = false;

    const el = listRef.current;
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    el?.addEventListener("mouseenter", onEnter);
    el?.addEventListener("mouseleave", onLeave);

    const onFocusIn = () => (focus = true);
    const onFocusOut = () => (focus = false);
    el?.addEventListener("focusin", onFocusIn);
    el?.addEventListener("focusout", onFocusOut);

    const iv = setInterval(() => {
      if (document.hidden || hover || focus) return;
      setIndex((p) => p + 1);
    }, 5500);

    return () => {
      clearInterval(iv);
      el?.removeEventListener("mouseenter", onEnter);
      el?.removeEventListener("mouseleave", onLeave);
      el?.removeEventListener("focusin", onFocusIn);
      el?.removeEventListener("focusout", onFocusOut);
    };
  }, [reduce]);

  // Keyboard control (Left/Right/PageUp/PageDown/Home/End) per APG patterns. :contentReference[oaicite:5]{index=5}
  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        setIndex((p) => p + 1);
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "PageUp":
        setIndex((p) => p - 1);
        e.preventDefault();
        break;
      case "Home":
        setIndex(0);
        e.preventDefault();
        break;
      case "End":
        setIndex(total - 1);
        e.preventDefault();
        break;
    }
  }

  // JSON-LD Review + AggregateRating for SEO (Google/Schema.org). :contentReference[oaicite:6]{index=6}
  const jsonLd = useMemo(() => {
    const avg =
      items.length === 0
        ? undefined
        : Number(
            (items.reduce((s, it) => s + (it.rating || 5), 0) / items.length).toFixed(2)
          );
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Business Booster AI",
      "url": "https://yourdomain.com",
      "aggregateRating": avg
        ? {
            "@type": "AggregateRating",
            "ratingValue": String(avg),
            "reviewCount": String(items.length),
          }
        : undefined,
      "review": items.map((it) => ({
        "@type": "Review",
        "reviewBody": it.text,
        "author": { "@type": "Person", "name": it.name },
        ...(it.date ? { "datePublished": it.date } : {}),
        ...(it.rating
          ? { "reviewRating": { "@type": "Rating", "ratingValue": String(it.rating), "bestRating": "5" } }
          : {}),
      })),
    };
  }, []);

  return (
    <section
      className="section"
      aria-labelledby={`${id}-title`}
      aria-roledescription="carousel"
      role="region"
      aria-label="Client testimonials carousel"
      onKeyDown={onKeyDown}
    >
      {/* JSON-LD for reviews */}
      <Script id="reviews-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id={`${id}-title`}>What clients say</h2>
          <div className="text-sm text-white/70">Real results, short path to ROI.</div>
        </div>

        <div className="card overflow-hidden relative">
          {/* Track */}
          <div
            ref={listRef}
            className="flex snap-x snap-mandatory overflow-hidden focus:outline-none"
            tabIndex={0}
            aria-live="polite"
            aria-atomic="true"
          >
            {items.map((it, i) => (
              <Slide key={it.name} i={i} total={total} active={active} item={it} />
            ))}
          </div>

          {/* Prev/Next controls */}
          <div className="absolute inset-y-0 left-2 flex items-center">
            <button
              aria-label="Previous testimonial"
              className="btn-ghost"
              onClick={() => setIndex((p) => p - 1)}
            >
              <ChevronLeft />
            </button>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              aria-label="Next testimonial"
              className="btn-ghost"
              onClick={() => setIndex((p) => p + 1)}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${i === active ? "bg-white" : "bg-white/40"} focus:outline-none focus:ring-2 focus:ring-white/60`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="/contact" className="btn">Book a Strategy Call</a>
        </div>
      </div>
    </section>
  );
}

function Slide({
  item,
  i,
  total,
  active,
}: {
  item: Item;
  i: number;
  total: number;
  active: number;
}) {
  const selected = i === active;

  return (
    <motion.div
      className="w-full p-6 shrink-0 snap-start outline-none"
      role="group"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${total}`}
      aria-selected={selected}
      initial={{ opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: selected ? 1 : 0.8, scale: selected ? 1 : 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative rounded-2xl p-[1px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,.8), rgba(96,165,250,.6), rgba(52,211,153,.6))",
        }}
      >
        <div className="rounded-2xl bg-black/60 p-6 h-full">
          <blockquote className="text-xl font-semibold mb-2">“{item.text}”</blockquote>
          <div className="text-white/60">{item.name}{item.role ? ` — ${item.role}` : ""}</div>
          <div className="mt-1 flex items-center gap-3">
            {item.metric && <div className="text-white/70 text-sm">{item.metric}</div>}
            {typeof item.rating === "number" && (
              <Stars rating={item.rating} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stars({ rating = 5 }: { rating?: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${full} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < full ? "text-yellow-300" : "text-white/25"}`}
          viewBox="0 0 20 20"
          aria-hidden
          fill="currentColor"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.953L10 0l2.95 5.957 6.562.953-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
}
