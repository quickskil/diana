// src/components/Process.tsx
'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Rocket, Search, PhoneCall, CheckCircle2, CalendarCheck, BadgeDollarSign } from 'lucide-react';
import MiniChart from './MiniChart';

type Step = {
  icon: React.ElementType;
  title: string;
  desc: string;
  bullets: string[];
  badge: string;
};

const steps: Step[] = [
  {
    icon: Rocket,
    badge: 'Week 1',
    title: 'Launch a conversion page',
    desc: 'We write the story like a friend would: quick, clear, and proof-first.',
    bullets: ['Loads fast on any device', 'One CTA to book a call'],
  },
  {
    icon: Search,
    badge: 'Week 2',
    title: 'Send the right traffic',
    desc: 'Ads repeat the same promise so every click lands feeling familiar.',
    bullets: ['Search + social tuned to the offer', 'Weekly trims keep budget on winners'],
  },
  {
    icon: PhoneCall,
    badge: 'Always on',
    title: 'Answer instantly',
    desc: 'Our AI receptionist greets every lead, books meetings, and warm-transfers hot callers to you.',
    bullets: ['24/7 coverage in your tone', 'Live transfer when you’re free'],
  },
];

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container space-y-12">
        {/* Heading */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 id="process-title">How we roll everything out</h2>
          <p className="text-white/75">
            Three simple moves, one friendly team. We launch the page, fuel it with traffic, and make sure every lead is greeted
            in seconds.
          </p>
        </header>

        {/* 3 clear steps */}
        <div role="list" className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              role="listitem"
              key={s.title}
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="radiant-card"
            >
              <article className="card h-full p-6 flex flex-col isolation-isolate">
                {/* hover glow that never blocks clicks */}
                {!reduce && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.08 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      background:
                        'radial-gradient(520px 180px at var(--mx,50%) var(--my,50%), #fff, transparent 40%)',
                    }}
                    onMouseMove={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      const r = el.getBoundingClientRect();
                      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <s.icon className="opacity-95" aria-hidden />
                    <span className="badge">{s.badge}</span>
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-white/75 text-sm mt-1">{s.desc}</p>
                  <ul className="mt-4 text-white/85 text-sm space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* System summary */}
        <div className="radiant-card">
          <div className="card grid gap-4 p-6 text-center sm:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] sm:text-left">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white/95">Everything feeds the same pipeline</h3>
              <p className="text-white/70 text-sm">
                We connect the site, ads, and AI follow-up so learnings move quickly. By the time you check in, new calls are
                already on the calendar.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
              <div className="flex items-center justify-between text-white/60">
                <span>Pipeline health</span>
                <span className="badge">Live view</span>
              </div>
              <MiniChart values={[22, 27, 35, 41, 44, 49, 57, 63]} color="emerald" ariaLabel="Pipeline health trending up" />
              <p className="text-xs text-white/55">Weekly notes highlight what we doubled down on and what we trimmed.</p>
            </div>
          </div>
        </div>

        {/* CTA — BIG, friendly, and persuasive */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="btn inline-flex items-center gap-2 h-12 px-5 rounded-xl will-change-transform"
              aria-label="Book a strategy call"
              style={{ minWidth: 220 }}
            >
              <CalendarCheck className="size-4" aria-hidden />
              Book a Strategy Call
            </Link>

            <a
              href="#voice-demo"
              className="btn-ghost inline-flex items-center gap-2 h-12 px-5 rounded-xl will-change-transform"
              aria-label="Try the live AI voice demo"
              style={{ minWidth: 200 }}
            >
              <PhoneCall className="size-4" aria-hidden />
              Try the Voice Demo
            </a>

            <Link
              href="/pricing"
              className="btn-ghost inline-flex items-center gap-2 h-12 px-5 rounded-xl will-change-transform"
              aria-label="See plans & pricing"
              style={{ minWidth: 200 }}
            >
              <BadgeDollarSign className="size-4" aria-hidden />
              See Plans & Pricing
            </Link>
          </div>

          {/* Reassurance under CTAs */}
          <ul className="flex flex-wrap items-center justify-center gap-2 text-[12px] text-white/60">
            <li className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1.5">No long-term contracts</li>
            <li className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1.5">Plain-language updates</li>
            <li className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1.5">Calendar filled for you</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
