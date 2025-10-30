// src/components/ServicesGrid.tsx
'use client';

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Megaphone,
  MousePointerClick,
  PhoneCall,
  Rocket,
  Search,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
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
};

const services: Service[] = [
  {
    icon: Rocket,
    title: "Websites that Convert",
    href: "/services/websites",
    bullets: [
      "Looks great, loads fast, easy to use",
      "Clear story that guides visitors to book",
      "Built to grow — add pages and features later",
    ],
    cta: "See Website Plan",
    chip: "Launch in 10 days",
    chipIcon: Sparkles,
  },
  {
    icon: Search,
    title: "Google Ads",
    href: "/services/google-ads",
    bullets: [
      "Show up when people search for you",
      "No fluff — spend goes to what brings calls",
      "Simple fee: 10% of ad spend",
    ],
    cta: "See Google Plan",
    chip: "Simple 10% fee",
    chipIcon: CheckCircle2,
  },
  {
    icon: Megaphone,
    title: "Meta Ads",
    href: "/services/meta-ads",
    bullets: [
      "Reach more of the right people",
      "Quick creative testing to find winners",
      "Weekly tweaks so results keep improving",
    ],
    cta: "See Meta Plan",
    chip: "Fresh creative weekly",
    chipIcon: Sparkles,
  },
  {
    icon: MousePointerClick,
    title: "Funnels & CRO",
    href: "/services/funnels",
    bullets: [
      "Straightforward steps from click → call",
      "Short forms, fewer clicks, more bookings",
      "A/B tests to keep raising conversion",
    ],
    cta: "See Funnel Plan",
    chip: "Iterate every month",
    chipIcon: CheckCircle2,
  },
  {
    icon: PhoneCall,
    title: "AI Voice Receptionists",
    href: "/services/voice-agents",
    bullets: [
      "Answers new callers 24/7 so you don’t miss leads",
      "Transfers warm leads to your team during open hours",
      "After-hours callers get scheduled instantly",
    ],
    cta: "See Voice Plan",
    chip: "Live demo ready",
    chipIcon: PhoneCall,
  },
];

export default function ServicesGrid() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container space-y-8">
        <h2 id="services-title" className="text-center">What we ship</h2>
        <p className="text-center text-white/70 max-w-3xl mx-auto">
          We make it easy: <b>we build your site</b>, <b>run your ads</b>, and our <b>AI receptionist</b> answers new callers
          around the clock. During open hours we <b>warm-transfer</b> hot leads to your team; after hours we <b>book the
          meeting</b>. Simple, friendly, and focused on results.
        </p>

        <div role="list" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: reduce ? 0 : 0.08 }}
          transition={{ duration: 0.2 }}
          style={{
            background:
              'radial-gradient(600px 200px at var(--mx, 50%) var(--my, 50%), #fff, transparent 40%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-start gap-3">
          <Icon className="opacity-90 shrink-0" aria-hidden />
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-semibold text-white/95">{s.title}</h3>
              <span className="badge">
                <s.chipIcon className="size-3.5" aria-hidden />
                {s.chip}
              </span>
            </div>

            <ul className="text-white/80 text-sm space-y-2 mb-5">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Actions: clearer, friendlier, with icons */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <Link
                href={s.href}
                className="btn-ghost inline-flex items-center gap-2"
                aria-label={`${s.cta}: ${s.title}`}
              >
                <ArrowRight className="size-4" aria-hidden />
                {s.cta}
              </Link>

              <Link
                href="/contact"
                className="btn inline-flex items-center gap-2"
                aria-label={`Book a call about ${s.title}`}
              >
                <CalendarCheck className="size-4" aria-hidden />
                Book a Call
              </Link>
            </div>

            {/* Micro reassurance */}
            <p className="mt-3 text-xs text-white/55">
              Friendly setup. Clear pricing. No long-term contracts.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
