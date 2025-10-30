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
      {/* Ambient logo-colored mesh (no images) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 0% 0%, rgba(139,92,246,.20), transparent 60%),' +
            'radial-gradient(900px 400px at 100% 10%, rgba(96,165,250,.18), transparent 60%),' +
            'radial-gradient(600px 300px at 10% 95%, rgba(59,130,246,.14), transparent 60%)',
          WebkitMaskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
          maskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
        }}
      />

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
              Full-funnel partner
            </div>

            <h1 className="mt-3 leading-tight">
              Hey, let’s turn more clicks into booked calls.
            </h1>

            <p className="lead max-w-2xl">
              We build the page, run the ads, and have an AI receptionist ready to answer in seconds. You stay focused on the
              conversations that close.
            </p>

            <div className="pill-grid text-sm text-white/85">
              <span className="pill"><Rocket className="size-4" aria-hidden /> Launch-ready site</span>
              <span className="pill"><Search className="size-4" aria-hidden /> Ads that match</span>
              <span className="pill"><PhoneCall className="size-4" aria-hidden /> 24/7 response</span>
              <span className="pill"><Sparkles className="size-4" aria-hidden /> Friendly copy</span>
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
              { k: 'Lower CPL', v: 'Message match saves spend', I: TrendingDown },
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
                      Real client data
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
                <h2 className="text-white/95 text-lg font-semibold">How we get you there</h2>
                <p className="text-white/70 text-sm">
                  Friendly, fast, and focused on one outcome: conversations with people ready to buy.
                </p>
              </header>

              <div className="grid gap-3">
                <div className="radiant-card">
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Booked calls</span>
                      <span className="badge">+42% avg</span>
                    </div>
                    <MiniChart
                      values={[9, 11, 13, 17, 21, 26, 33, 38]}
                      color="violet"
                      ariaLabel="Booked calls trending upward 42 percent on average"
                    />
                    <p className="text-xs text-white/60">One clean funnel keeps leads moving without extra follow-up.</p>
                  </div>
                </div>

                <ol className="grid gap-3 text-sm text-white/85">
                  {[ 
                    {
                      title: 'Launch a conversion-ready page',
                      copy: 'Story, proof, and booking are all above the fold — written like a friend explaining your offer.',
                    },
                    {
                      title: 'Run ads that echo the promise',
                      copy: 'Search + paid social drive the same message so every click feels familiar.',
                    },
                    {
                      title: 'Answer every lead instantly',
                      copy: 'Our AI receptionist greets, qualifies, and books or warm-transfers in real time.',
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
                  <p className="font-semibold text-white/85">You’ll always know:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• What changed this week</li>
                    <li>• Where leads booked</li>
                    <li>• What’s next to test</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  <p className="font-semibold text-white/85">How it feels:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Friendly updates in plain language</li>
                    <li>• One team handling every piece</li>
                    <li>• A calendar that fills itself</li>
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
                Zero fluff. We show what booked, what we trimmed, and the next friendly move to grow revenue.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>


    </section>
  );
}
