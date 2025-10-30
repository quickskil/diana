import ServicesGrid from "@/components/ServicesGrid";
import MiniChart from "@/components/MiniChart";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Three-part growth system: conversion-first site, traffic engine, and AI lead response.",
};

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="services-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%)," +
            "radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%)," +
            "radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)",
          WebkitMaskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
          maskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
        }}
      />

      <div className="container space-y-10">
        <header className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 id="services-title">Pick your starting point, or let us run it all</h1>
          <p className="text-white/70">
            Every service plugs into the same pipeline. Grab the piece you need or hand over the full funnel — we’ll keep the
            tone friendly and the results easy to read.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/75">
            <span className="pill">Launch fast</span>
            <span className="pill">Plain-language reporting</span>
            <span className="pill">24/7 follow-up</span>
          </div>
        </header>

        <ServicesGrid />

        <section className="grid gap-4 md:grid-cols-2" aria-label="Outcome snapshots">
          <div className="radiant-card">
            <div className="card p-6 space-y-3">
              <h2 className="text-lg font-semibold text-white/95">Quick wins we watch</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Booked calls</span>
                    <span className="badge">+40% avg</span>
                  </div>
                  <MiniChart values={[8, 12, 15, 18, 24, 30, 34, 39]} color="violet" ariaLabel="Booked calls trending up" />
                  <p className="text-xs text-white/55">Conversion-first pages + follow-up keep leads moving.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Cost per lead</span>
                    <span className="badge">-26%</span>
                  </div>
                  <MiniChart values={[82, 78, 73, 68, 63, 59, 55, 52]} color="sky" ariaLabel="Cost per lead trending down" />
                  <p className="text-xs text-white/55">Message match and fast pages save media spend.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="radiant-card">
            <div className="card p-6 space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white/95">Need a custom mix?</h2>
              <p className="text-sm text-white/70 max-w-xl mx-auto">
                Tell us how leads reach you today. We’ll map the fastest rollout, size the traffic, and show how voice follow-up
                keeps conversations warm.
              </p>
              <MiniChart values={[4, 7, 12, 18, 26, 32, 37, 44]} color="emerald" ariaLabel="Ramp plan increasing over time" />
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Link href="/contact" className="btn">
                  Book a friendly strategy chat
                </Link>
                <Link href="/pricing" className="btn-ghost">
                  View pricing
                </Link>
              </div>
              <p className="text-xs text-white/55">No pressure — leave with a plan even if we don’t work together.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
