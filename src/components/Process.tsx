// src/components/Process.tsx
'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  Rocket,
  Search,
  PhoneCall,
  CheckCircle2,
  GaugeCircle,
  Handshake,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  BadgeDollarSign,
} from 'lucide-react';

type Step = {
  icon: React.ElementType;
  title: string;
  desc: string;
  bullets: string[];
  badge: string;
};

const ring =
  'linear-gradient(135deg, rgba(124,58,237,.9), rgba(96,165,250,.75), rgba(52,211,153,.75))';

const steps: Step[] = [
  {
    icon: Rocket,
    badge: 'Week 1',
    title: 'Launch a website that’s easy to buy from',
    desc:
      'Clean, fast and clear. Your offers, proof, and next steps are front-and-center so visitors know what to do.',
    bullets: ['Looks great on phone and desktop', 'Your story in plain language', 'Built to grow—add pages anytime'],
  },
  {
    icon: Search,
    badge: 'Week 2–3',
    title: 'Turn on the right traffic',
    desc:
      'Show up when people are looking (Google). Keep growing awareness (Meta). We adjust weekly so your spend works harder.',
    bullets: ['Budgets move to what brings calls', 'Clear, simple reporting', 'Steady creative + keyword tweaks'],
  },
  {
    icon: PhoneCall,
    badge: 'Always on',
    title: 'Never miss a new lead',
    desc:
      'An AI receptionist answers 24/7. During open hours it warm-transfers hot leads. After hours it books the meeting for you.',
    bullets: ['Friendly, on-brand conversations', 'Qualifies in seconds', 'Meetings on your calendar'],
  },
];

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container space-y-12">
        {/* Heading */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 id="process-title">How it works</h2>
          <p className="text-white/75">
            We <b>launch your website</b>, <b>run your ads</b>, and add an <b>AI receptionist</b> that answers new
            callers day and night. During open hours we <b>warm-transfer</b> hot leads to your team; after hours we{' '}
            <b>book the meeting</b>. Simple, friendly, and built to grow with you.
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
              className="relative rounded-2xl p-[1.5px]"
              style={{ background: ring }}
            >
              <article className="rounded-2xl h-full bg-slate-900/70 border border-white/12 p-6 flex flex-col isolation-isolate">
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
                  <ul className="mt-3 text-white/80 text-sm space-y-1 list-disc list-inside">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  {/* micro trust row */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-white/70">
                    <div className="flex items-center gap-1">
                      <GaugeCircle className="size-4 opacity-70" />
                      Fast
                    </div>
                    <div className="flex items-center gap-1">
                      <Handshake className="size-4 opacity-70" />
                      Friendly
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="size-4 opacity-70" />
                      Reliable
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* KPI chips */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ['+ More calls answered', 'Fewer missed opportunities'],
            ['24/7 capture', 'Meetings while you sleep'],
            ['Lower cost per lead', 'Better value from ad spend'],
          ].map(([h, sub]) => (
            <div key={h} className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
              <div className="card p-4 h-full bg-slate-900/70 rounded-2xl">
                <div className="font-medium">{h}</div>
                <div className="text-white/60 text-sm">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead-flow explainer (UPGRADED) */}
        <section aria-labelledby="lead-flow-title" className="space-y-7">
          <h3
            id="lead-flow-title"
            className="text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-sky-300 to-emerald-300"
          >
            Lead flow that fits your day
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Open hours — warm transfer */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45 }}
              className="relative rounded-2xl p-[1.5px]"
              style={{ background: ring }}
            >
              <div className="card p-5 rounded-2xl bg-slate-900/70 border border-white/12">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneCall className="opacity-85" aria-hidden />
                  <div className="font-semibold">Open hours • Warm transfer</div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  A new caller is answered in seconds. The receptionist asks a few short questions, then{' '}
                  <b>consults & connects</b> the call to your team with context. You join, the AI steps back.
                </p>
                <ul className="mt-3 text-xs text-white/65 space-y-1 list-disc list-inside">
                  <li>Quick qualification, no scripts to memorize</li>
                  <li>Clear handoff — your team hears the summary</li>
                  <li>Works with your existing numbers and tools</li>
                </ul>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="size-4" /> Standard 3-way bridge workflow
                </div>
              </div>
            </motion.div>

            {/* After hours — instant scheduling */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="relative rounded-2xl p-[1.5px]"
              style={{ background: ring }}
            >
              <div className="card p-5 rounded-2xl bg-slate-900/70 border border-white/12">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarCheck className="opacity-85" aria-hidden />
                  <div className="font-semibold">After hours • Instant scheduling</div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  The AI offers times and <b>books right on your calendar</b>. Visitors stay on your site and you start
                  the morning with new meetings — no back-and-forth.
                </p>
                <ul className="mt-3 text-xs text-white/65 space-y-1 list-disc list-inside">
                  <li>Inline, popup, or floating badge scheduler</li>
                  <li>Confirmation + calendar invite to both sides</li>
                  <li>Notes and contact details saved for follow-up</li>
                </ul>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="size-4" /> Works great on mobile
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upgraded bridge row with animated arrow + gradient chips */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div
              className="rounded-xl border border-white/12 bg-white/[.06] px-4 py-3 text-sm text-white/80"
              aria-label="Traffic sources"
            >
              <b>Website + Ads</b> bring the right people.
            </div>

            {!reduce ? (
              <motion.div
                className="hidden md:flex items-center justify-center"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                aria-hidden
              >
                <ArrowRight className="mx-2 opacity-75" />
              </motion.div>
            ) : (
              <ArrowRight className="mx-auto opacity-70 hidden md:block" aria-hidden />
            )}

            <div
              className="rounded-xl border border-white/12 bg-white/[.06] px-4 py-3 text-sm text-white/80"
              aria-label="Conversion engine"
            >
              <b>AI Receptionist</b> turns them into bookings — even after hours.
            </div>
          </div>

          {/* Confidence note (friendly; non-jargon) */}
          <p className="text-center text-xs text-white/65 max-w-2xl mx-auto">
            Getting back to people quickly makes a real difference. We design your flow for speed and clarity so more
            conversations turn into customers.
          </p>
        </section>

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
            <li className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1.5">Clear, simple pricing</li>
            <li className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1.5">
              Designed for busy owners — not tech talk
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
