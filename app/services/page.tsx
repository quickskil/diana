import ServicesGrid from "@/components/ServicesGrid";
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
          <h1 id="services-title">All-in-one funnel, built for booked calls</h1>
          <p className="text-white/70">
            Pick the full system or start with the piece you need first. Each service is shaped to plug into the same pipeline —
            so clicks turn into conversations without extra coordination.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/75">
            <span className="pill">Launch fast</span>
            <span className="pill">Plain-language reporting</span>
            <span className="pill">24/7 follow-up</span>
          </div>
        </header>

        <ServicesGrid />

        <section className="radiant-card">
          <div className="card p-6 text-center space-y-3">
            <h2 className="text-xl font-semibold text-white/95">Need a custom mix?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              We tailor the rollout to your sales cycle. Start with the foundation, add traffic once it converts, then switch on
              voice automation when you are ready for every lead to be answered.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/contact" className="btn">
                Book a strategy call
              </Link>
              <Link href="/pricing" className="btn-ghost">
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
