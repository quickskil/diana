// src/components/ServicesGrid.tsx
'use client';

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  PhoneCall,
  Rocket,
  Search,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Megaphone,
  PlayCircle,
} from "lucide-react";
import { useCallback, useRef } from "react";

type Service = {
  icon: React.ElementType;
  title: string;
  href: string;
  bullets: string[];
  cta: string;
  chip: string;
  chipIcon: React.ElementType;
  stat: string;
  statCaption: string;
};

const services: Service[] = [
  {
    icon: Rocket,
    title: "Conversion-Ready Websites",
    href: "/services/websites",
    bullets: [
      "Lightning-fast pages with proof and clear CTAs",
      "Localized copy for Dominican Republic buyers",
      "Booking flows wired to your calendar and CRM",
    ],
    cta: "View website plan",
    chip: "Launch fast",
    chipIcon: Sparkles,
    stat: "+37% more booked calls",
    statCaption: "Fresh copy + frictionless booking",
  },
  {
    icon: Search,
    title: "Digital Ads & Campaigns",
    href: "/services/google-ads",
    bullets: [
      "Google + Meta working together for booked calls",
      "Message match from ad to page to booking",
      "Weekly tuning so spend stays on what books",
    ],
    cta: "View ads plan",
    chip: "Always optimizing",
    chipIcon: CheckCircle2,
    stat: "-28% cost per lead",
    statCaption: "Message match cuts waste",
  },
  {
    icon: PhoneCall,
    title: "AI Voice Agent",
    href: "/services/voice-agents",
    bullets: [
      "AI voice receptionist answers in seconds",
      "Warm transfers to your team during open hours",
      "After-hours callers book automatically or get a callback",
    ],
    cta: "View response plan",
    chip: "24/7 coverage",
    chipIcon: PhoneCall,
    stat: "93% answer rate",
    statCaption: "No more missed calls",
  },
  {
    icon: Megaphone,
    title: "Social Ads & Creative Studio",
    href: "/services/meta-ads",
    bullets: [
      "Hook-led creative that feels native to the feed",
      "Prospecting + retargeting synced to Google",
      "Refresh cycles to beat fatigue and keep CPL steady",
    ],
    cta: "View social plan",
    chip: "Creative lab",
    chipIcon: Sparkles,
    stat: "+18% more booked calls",
    statCaption: "Angles tested weekly",
  },
];

export default function ServicesGrid() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container space-y-8">
        <h2 id="services-title" className="text-center">What we ship</h2>
        <p className="text-center text-white/70 max-w-2xl mx-auto">
          Engage us for one capability or the full program. Each deliverable plugs into the same booked-call pipeline.
        </p>

        <div role="list" className="grid md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  s,
  i,
  reduce,
}: {
  s: Service;
  i: number;
  reduce: boolean;
}) {
  const Icon = s.icon as any;
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -6;
    const ry = (px - 0.5) * 8;
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  }, [reduce]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
  }, []);

  return (
    <motion.div
      role="listitem"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
      whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="radiant-card"
    >
      <div
        ref={ref}
        className="card h-full p-5 rounded-2xl will-change-transform relative"
        style={{
          transform: reduce ? undefined : 'perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))',
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Hover glow */}
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="size-5 opacity-90" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-white/95">{s.title}</h3>
                <div className="text-xs text-white/55">{s.statCaption}</div>
              </div>
            </div>
            <span className="badge">
              <s.chipIcon className="size-3.5" aria-hidden />
              {s.chip}
            </span>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>{s.stat}</span>
                <ArrowRight className="size-4 text-white/60" aria-hidden />
              </div>
              <p className="mt-2 text-xs text-white/60">{s.statCaption}</p>
            </div>

            <ul className="text-white/80 text-sm space-y-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/contact"
              className="btn inline-flex items-center gap-2"
              aria-label={`Book a call about ${s.title}`}
            >
              <CalendarCheck className="size-4" aria-hidden />
              Schedule a call
            </Link>

            <Link
              href="/register"
              className="btn-ghost inline-flex items-center gap-2"
              aria-label={`Start onboarding for ${s.title}`}
            >
              <PlayCircle className="size-4" aria-hidden />
              Start onboarding
            </Link>

            <Link
              href={s.href}
              className="btn-ghost inline-flex items-center gap-2"
              aria-label={`${s.cta}: ${s.title}`}
            >
              <ArrowRight className="size-4" aria-hidden />
              {s.cta}
            </Link>
          </div>

          <p className="text-xs text-white/55">
            Friendly setup, clear pricing, no long-term contracts.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
