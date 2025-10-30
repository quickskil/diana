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
  Sparkles,
} from 'lucide-react';

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
    title: 'Launch a website that’s easy to buy from',
    desc:
      'We launch a modern site that shows who you help, why you are trusted, and how to talk to you in under a minute.',
    bullets: ['Loads fast on phone or desktop', 'Clear promise and proof up top', 'Built so new sections are easy'],
  },
  {
    icon: Search,
    badge: 'Week 2–3',
    title: 'Turn on steady traffic',
    desc:
      'We run Google for high-intent leads and Meta to stay in front of lookalikes. Reports are short and focused on booked calls.',
    bullets: ['Spend goes to proven winners', 'Plain-language updates each week', 'Creative and keywords stay fresh'],
  },
  {
    icon: PhoneCall,
    badge: 'Always on',
    title: 'Never miss a new lead',
    desc:
      'An AI receptionist answers in your tone, captures the details, and either connects callers live or books the meeting for you.',
    bullets: ['Greets callers in seconds', 'Shares a quick summary with you', 'Adds meetings straight to your calendar'],
  },
];

const kpis: { icon: React.ElementType; title: string; caption: string }[] = [
  { icon: PhoneCall, title: '+ More live conversations', caption: 'Fewer missed opportunities' },
  { icon: CalendarCheck, title: '24/7 bookings', caption: 'Wake up to new meetings' },
  { icon: BadgeDollarSign, title: 'Lower cost per lead', caption: 'Better use of ad spend' },
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

                  {/* micro trust row */}
                  <div className="mt-5 pill-grid text-[12px]">
                    <span className="pill"><GaugeCircle className="size-3.5" aria-hidden /> Fast launch</span>
                    <span className="pill"><Handshake className="size-3.5" aria-hidden /> Done with you</span>
                    <span className="pill"><ShieldCheck className="size-3.5" aria-hidden /> Built to last</span>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* KPI chips */}
        <div className="grid sm:grid-cols-3 gap-4">
          {kpis.map(({ icon: Icon, title, caption }) => (
            <div key={title} className="radiant-card">
              <div className="card p-4 h-full space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Icon className="size-4 text-emerald-300" aria-hidden />
                  {title}
                </div>
                <div className="text-white/65 text-sm">{caption}</div>
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
              className="radiant-card"
            >
              <div className="card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneCall className="opacity-85" aria-hidden />
                  <div className="font-semibold">Open hours • Warm transfer</div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  New callers hear a friendly voice right away. The receptionist gathers the key details, then loops your team
                  in live with a short summary so you can jump straight into the conversation.
                </p>
                <ul className="mt-4 text-xs text-white/70 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Quick qualification in your voice
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Smooth handoff with context
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Works with your existing number
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* After hours — instant scheduling */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: 0.06 }}
              className="radiant-card"
            >
              <div className="card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarCheck className="opacity-85" aria-hidden />
                  <div className="font-semibold">After hours • Instant scheduling</div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  After-hours visitors pick a time that works for them. Confirmations go out instantly, and you start the day
                  with fresh meetings already on the calendar.
                </p>
                <ul className="mt-4 text-xs text-white/70 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Scheduler lives on your site
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Instant confirmation for both sides
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-300" aria-hidden />
                    Notes saved for easy follow-up
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Upgraded bridge row with animated arrow + gradient chips */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="pill w-full justify-center text-sm" aria-label="Traffic sources">
              <Sparkles className="size-4" aria-hidden /> Website + Ads bring the right people
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

            <div className="pill w-full justify-center text-sm" aria-label="Conversion engine">
              <PhoneCall className="size-4" aria-hidden /> AI Receptionist turns them into bookings
            </div>
          </div>

          {/* Confidence note (friendly; non-jargon) */}
          <p className="text-center text-xs text-white/70 max-w-2xl mx-auto">
            When it’s effortless to get in touch, more conversations happen. We design every touchpoint so people feel heard and
            ready to buy.
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
