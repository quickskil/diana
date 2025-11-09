// app/case-studies/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { caseStudies } from '@/data/caseStudies';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'See how local service brands pair conversion-first websites, ads, and AI voice receptionists to capture every call and launch with a $99 kickoff.',
};

const proofPoints = [
  {
    title: 'Never miss a lead',
    copy: 'Small businesses can miss up to 40% of inbound calls during peak windows — our AI agents answer instantly so every opportunity is captured and routed.',
  },
  {
    title: 'Always-on coverage',
    copy: 'Voice reception stays active 24/7, trimming 40-65% from traditional answering costs while delivering consistent caller experiences.',
  },
  {
    title: 'Faster speed-to-lead',
    copy: 'Leads that hear from you within the first hour are ~7× more likely to convert. Automated callbacks and booking flows make that the default.',
  },
];

const rolloutSteps = [
  {
    step: '01',
    title: 'Conversion-ready website refresh',
    copy: 'We rebuild your key service pages around proof, trust signals, and calls-to-action that point straight to phone or booking flows.',
  },
  {
    step: '02',
    title: 'High-intent ads and tracking',
    copy: 'Search, Local Services, and paid social campaigns turn on together with call tracking so you see which channels drive booked work.',
  },
  {
    step: '03',
    title: 'AI voice agent + warm transfers',
    copy: 'Our branded agent answers, qualifies, schedules, and hands off urgent cases to your team — with summaries waiting in your inbox.',
  },
];

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="cs-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%),' +
            'radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%),' +
            'radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)',
          WebkitMaskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
          maskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
        }}
      />

      <div className="container space-y-12">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 id="cs-title">Local case studies powered by AI voice reception</h1>
          <p className="text-white/70">
            Explore how nine service niches blend a conversion-focused website, paid traffic, and an always-on voice agent to
            catch every call. Each playbook starts with a $99 kickoff and ends with a funnel you can scale confidently.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Case studies by niche">
          {caseStudies.map((study) => (
            <Link
              key={study.nicheKey}
              href={study.slug}
              className="radiant-card transition hover:-translate-y-1"
            >
              <div className="card h-full space-y-3 p-5">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                    <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                    Voice + funnel bundle
                  </span>
                  <span className="font-semibold text-white/75">$99 kickoff</span>
                </div>
                <h2 className="text-lg font-semibold text-white/95">{study.title}</h2>
                <p className="text-sm text-white/70">{study.overview}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">View case study →</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-4" aria-label="Why it works">
          {proofPoints.map((point) => (
            <div key={point.title} className="radiant-card">
              <div className="card h-full p-5 space-y-2">
                <h2 className="text-lg font-semibold text-white/95">{point.title}</h2>
                <p className="text-sm text-white/70">{point.copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card p-6 md:p-10 space-y-6">
            <header className="space-y-3 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Our rollout in every niche</p>
              <h2 className="text-2xl font-semibold text-white/95">One playbook, customized by industry</h2>
              <p className="text-sm text-white/70 max-w-3xl">
                The sequence stays consistent: conversion-first site, coordinated traffic, and an AI receptionist who handles call
                answer, transfers, and scheduling without fail. Then we iterate weekly on real call summaries and campaign data.
              </p>
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              {rolloutSteps.map((step) => (
                <div key={step.step} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{step.step}</span>
                  <h3 className="text-lg font-semibold text-white/90">{step.title}</h3>
                  <p className="text-sm text-white/70">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-5 text-center md:text-left md:p-8">
            <h2 className="text-2xl font-semibold text-white/95">Ready to see your own projections?</h2>
            <p className="text-sm text-white/70 max-w-2xl">
              Reserve your kickoff for $99 and we will map call volumes, expected booked appointments, and the ad + website launch
              plan for your niche. You approve the strategy before any larger investment goes live.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link href="/contact" className="btn">
                Book a discovery call
              </Link>
              <Link href="/voice-demo" className="btn-ghost">
                Hear the live voice agent
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
