// src/components/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  PhoneCall,
  CalendarCheck,
  ArrowUpRight,
  Clock,
  TrendingDown,
  Rocket,
  Search,
  Sparkles,
  ArrowUp,
} from 'lucide-react';
import MiniChart from './MiniChart';

export default function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener?.('change', update);
    return () => mq?.removeEventListener?.('change', update);
  }, []);

  return (
    <section
      id="hero"
      className="section relative overflow-hidden"
      aria-label="Business Booster AI — Websites, Ads, and AI Voice Receptionists"
    >
      <div className="container grid lg:grid-cols-12 gap-12 items-start">
        {/* LEFT: headline + pitch + CTAs */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/75">
              <Sparkles className="size-3.5" aria-hidden />
              Full-funnel rollout
            </div>

            <h1 className="mt-3 leading-tight">
              Scale booked consultations with one connected system.
            </h1>

            <p className="lead max-w-2xl">
              We ship the conversion-first site, align paid media with the same story, and deploy an AI receptionist so qualified
              leads are handled immediately.
            </p>

            <div className="pill-grid text-sm text-white/85">
              <span className="pill"><Rocket className="size-4" aria-hidden /> Conversion-first site</span>
              <span className="pill"><Search className="size-4" aria-hidden /> Coordinated paid media</span>
              <span className="pill"><PhoneCall className="size-4" aria-hidden /> Immediate lead response</span>
              <span className="pill"><Sparkles className="size-4" aria-hidden /> Conversion copywriting</span>
            </div>


          </motion.div>

          {/* Proof chips with tiny icons */}
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                k: '+44% booked calls',
                v: 'Single, clear funnel',
                I: ArrowUp,
              },
              { k: '24/7 follow-up', v: 'Voice agent covers nights', I: Clock },
              { k: 'Lower CPL', v: 'Message match cuts waste', I: TrendingDown },
            ].map(({ k, v, I }, i) => (
              <li key={k} className="radiant-card">
                <div className="card h-full p-4">
                  {!reduceMotion && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute -top-1 left-0 h-px w-full opacity-30"
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.1 + i * 0.12 }}
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)' }}
                    />
                  )}
                  <div className="flex items-center gap-2 font-semibold text-white/95">
                    <I className="size-4 opacity-90" aria-hidden />
                    {k}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                    <span>{v}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/65">
                      <Sparkles className="size-3" aria-hidden />
                      Verified performance
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>


        </div>

        {/* RIGHT: How we grow revenue — friendlier copy + icon CTAs */}
        <div className="lg:col-span-5">
          <motion.aside
            aria-label="How we grow revenue"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.06 }}
            className="radiant-card"
          >
            <div className="card rounded-[18px] p-7 space-y-6">
              <header className="space-y-1">
                <h2 className="text-white/95 text-lg font-semibold">How the engagement runs</h2>
                <p className="text-white/70 text-sm">
                  We align every asset around one objective: booked meetings with qualified prospects.
                </p>
              </header>

              <div className="grid gap-3">
                <div className="radiant-card">
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Booked consultations</span>
                      <span className="badge">+42% avg</span>
                    </div>
                    <MiniChart
                      values={[9, 11, 13, 17, 21, 26, 33, 38]}
                      color="violet"
                      ariaLabel="Booked consultations trending upward 42 percent on average"
                    />
                    <p className="text-xs text-white/60">One connected funnel keeps prospects moving without manual follow-up.</p>
                  </div>
                </div>

                <ol className="grid gap-3 text-sm text-white/85">
                  {[
                    {
                      title: 'Launch the conversion page',
                      copy: 'Proof, offer, and scheduling stay above the fold with sub-two-second load times.',
                    },
                    {
                      title: 'Align paid media with the same promise',
                      copy: 'Search and paid social mirror the landing page so every click lands with context.',
                    },
                    {
                      title: 'Answer and qualify every lead',
                      copy: 'The AI receptionist greets prospects, books meetings, or warm-transfers in real time.',
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/80">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-white/90">{step.title}</span>
                      </div>
                      <p className="mt-2 text-xs text-white/65 leading-relaxed">{step.copy}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  <p className="font-semibold text-white/85">You see:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Weekly priorities and outcomes</li>
                    <li>• Channel and booking performance</li>
                    <li>• Planned tests and owners</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  <p className="font-semibold text-white/85">You experience:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Plain-language updates</li>
                    <li>• One accountable team</li>
                    <li>• A predictable calendar</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn h-12 min-w-[11rem] gap-2">
                  <PhoneCall className="size-4" aria-hidden />
                  Book a Call
                </Link>
                <Link href="#services" className="btn-ghost h-12 min-w-[12rem] gap-2">
                  <ArrowUpRight className="size-4" aria-hidden />
                  See What We Ship
                </Link>
                <Link href="/voice-demo" className="btn-ghost h-12 min-w-[12rem] gap-2">
                  <PhoneCall className="size-4" aria-hidden />
                  Hear the AI receptionist
                </Link>
              </div>

              <p className="text-[12px] leading-relaxed text-white/55">
                Every review highlights booked meetings, optimisation work, and next steps.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>


    </section>
  );
}
