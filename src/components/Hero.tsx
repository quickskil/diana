// src/components/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  PhoneCall,
  CalendarCheck,
  Tag,
  Headphones,
  ArrowUpRight,
  Clock,
  TrendingDown,
} from 'lucide-react';

const ring = 'linear-gradient(135deg, rgba(139,92,246,.9), rgba(96,165,250,.85))'; // logo vibe

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

            <h1 className="mt-3 leading-tight">
              Turn clicks into <span className="text-brand">clients</span> — on autopilot.
            </h1>

            <p className="lead max-w-2xl">
              We build fast <b>websites</b>, run simple, effective <b>Google &amp; Meta Ads</b>, and
              add an <b>AI voice receptionist</b> that answers right away, asks a few key questions,
              <b> books the meeting</b>, or <b>warm-transfers</b> to your team. You close deals —
              we handle the busywork.
            </p>

     
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
                k: '+40% answer rate',
                v: 'More calls answered, fewer missed leads',
                I: ArrowUpRight,
              },
              { k: '24/7 capture', v: 'Night & weekend bookings', I: Clock },
              { k: 'Lower CPL', v: 'Faster pages = cheaper wins', I: TrendingDown },
            ].map(({ k, v, I }, i) => (
              <li key={k} className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: ring }}>
                <div className="card h-full bg-black/75 p-4 border border-white/10">
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
                  <div className="text-xs text-white/65 mt-1">{v}</div>
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
            className="relative overflow-hidden rounded-2xl p-[1px]"
            style={{ background: ring }}
          >
            <div className="rounded-[15px] bg-black/80 p-7 border border-white/10 space-y-5">
              <header className="space-y-1">
                <h2 className="text-white/95 text-lg font-semibold">How we grow your business</h2>
                <p className="text-white/70 text-sm">
                  Nothing fancy. We help more visitors become <b>booked calls</b>.
                </p>
              </header>

              <ol className="space-y-4 text-sm text-white/90">
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block size-2.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#7dd3fc)' }}
                    aria-hidden
                  />
                  <div>
                    <b>1) Launch a clean, fast page</b>
                    <div className="text-white/65">Clear offer, proof up top, easy “Book a Call” — no jargon.</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block size-2.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#60a5fa,#22d3ee)' }}
                    aria-hidden
                  />
                  <div>
                    <b>2) Turn on ads that match the page</b>
                    <div className="text-white/65">Search/PMAX for people looking; Meta to reach more like them.</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block size-2.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#34d399,#8b5cf6)' }}
                    aria-hidden
                  />
                  <div>
                    <b>3) Answer every lead</b>
                    <div className="text-white/65">Our AI answers 24/7, books times, or <b>warm-transfers</b> to you.</div>
                  </div>
                </li>
              </ol>

              <div className="grid sm:grid-cols-3 gap-2 text-[13px]">
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/85">More calls</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/85">Less waiting</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/85">Lower cost</div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/contact" className="btn h-12 min-w-[11rem] gap-2">
                  <PhoneCall className="size-4" aria-hidden />
                  Book a Call
                </Link>
                <Link href="#services" className="btn-ghost h-12 min-w-[12rem] gap-2">
                  <ArrowUpRight className="size-4" aria-hidden />
                  See What We Ship
                </Link>
              </div>

              <p className="text-[12px] leading-relaxed text-white/55">
                We focus on booked calls, not “clicks.” Simple pages + honest copy make ads cheaper and easier.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>


    </section>
  );
}
