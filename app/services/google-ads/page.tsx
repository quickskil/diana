// app/services/google-ads/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Megaphone,
  Sparkles,
  MousePointerClick,
  BadgeCheck,
  CalendarCheck,
  ChartLine,
  CheckCircle2,
  Target,
  GaugeCircle,
  PhoneCall,
  ArrowRight,
  Headphones,
} from "lucide-react";
import ServicePill from "@/components/ServicePill";

export const metadata: Metadata = {
  title: "Google Ads",
  description:
    "Show up when people are searching and turn clicks into booked calls — Search, PMAX, and YouTube working together.",
};

export default function Page() {
  const ring =
    "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.85))";

  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="svc-title"
    >
      {/* Ambient gradient (paint-only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%)," +
            "radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%)," +
            "radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)",
          WebkitMaskImage:
            "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
          maskImage:
            "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
        }}
      />

      <div className="container space-y-12">
        {/* Top “Service” pill */}
        <ServicePill />

        {/* HERO */}
        <header className="space-y-4">
          <h1 id="svc-title">Google Ads</h1>
          <p className="lead max-w-3xl">
            We set up Google Ads so you <b>show up when people are searching</b>,
            send them to the right page, and turn clicks into{" "}
            <b>booked calls</b>. Search + PMAX find demand. YouTube builds
            trust. Your website does the converting. Run Google-only or pair it
            with our Meta Ads program — we package them separately but connect
            the creative so both channels compound.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="btn inline-flex items-center gap-2">
              <BadgeCheck className="size-4" />
              See pricing
            </Link>
            <Link
              href="/contact"
              className="btn-ghost inline-flex items-center gap-2"
            >
              <CalendarCheck className="size-4" />
              Book a call
            </Link>
          </div>
        </header>

        {/* OUTCOMES (friendly, simple) */}
        <section aria-label="What you get" className="grid md:grid-cols-3 gap-4">
          <ValueCard title="Qualified traffic" ring={ring}>
            <Row icon={Search} text="Catch people who are already looking for you." />
            <Row icon={Target} text="Send clicks to a page that matches their intent." />
            <Row icon={MousePointerClick} text="Make booking the natural next step." />
          </ValueCard>

          <ValueCard title="Lower cost per lead" ring={ring}>
            <Row icon={Sparkles} text="Sharper messages and offers each week." />
            <Row icon={GaugeCircle} text="Fewer wasted clicks, more good ones." />
            <Row icon={ChartLine} text="Improvements that compound over time." />
          </ValueCard>

          <ValueCard title="Real measurement" ring={ring}>
            <Row icon={BadgeCheck} text="Clean, simple tracking focused on booked calls." />
            <Row icon={ChartLine} text="Clear reporting: calls, meetings, and CPL." />
            <Row icon={PhoneCall} text="Tie ad spend to real conversations." />
          </ValueCard>
        </section>

        {/* PLAYBOOK: Search + PMAX + YouTube (plain-English) */}
        <section aria-label="Our playbook" className="grid lg:grid-cols-3 gap-4">
          <MiniCard title="Search (catch intent)" ring={ring}>
            Show up for the terms your customers use. Say what they’re thinking,
            send them to the page that answers it, and make booking easy.
          </MiniCard>
          <MiniCard title="Performance Max (scale smart)" ring={ring}>
            After Search is working, PMAX finds more of the same kind of people
            across Google’s placements — without guessing or wasting budget.
          </MiniCard>
          <MiniCard title="YouTube (build preference)" ring={ring}>
            Short, clear videos that show value fast. People recognize you, your
            clicks get cheaper, and more turn into meetings.
          </MiniCard>
        </section>

        {/* HOW WE RUN IT (no jargon, high trust) */}
        <section aria-label="How we run it" className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h2 className="font-semibold">Simple setup, steady improvements</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={CheckCircle2}>Clear campaigns by theme and goal</Li>
              <Li icon={CheckCircle2}>Trim waste weekly; keep winners funded</Li>
              <Li icon={CheckCircle2}>Landing page tweaks that boost results</Li>
              <Li icon={CheckCircle2}>Straightforward reports (calls, CPL)</Li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Connected to the rest of your funnel</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={MousePointerClick}>Website aligns with ad messages</Li>
              <Li icon={Headphones}>AI voice receptionist answers & books 24/7</Li>
              <Li icon={PhoneCall}>Warm-transfer during open hours</Li>
              <Li icon={CalendarCheck}>After-hours? Instant scheduling</Li>
            </ul>
          </div>
        </section>

        {/* WHAT'S INCLUDED / OPTIONS (friendly) */}
        <section aria-label="Deliverables" className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h2 className="font-semibold">Included</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={Search}>Search & PMAX setup to match your offer</Li>
              <Li icon={Megaphone}>YouTube ad briefs & simple edit plan</Li>
              <Li icon={MousePointerClick}>Landing page guidance for relevance</Li>
              <Li icon={ChartLine}>Lead/call reporting & CPL tracking</Li>
              <Li icon={Sparkles}>Weekly improvements, not set-and-forget</Li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Options</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={Megaphone}>Creative production (scripts, cuts, variants)</Li>
              <Li icon={Headphones}>
                AI voice receptionist to answer, qualify, and book
              </Li>
              <Li icon={PhoneCall}>CRM routing and call summaries</Li>
              <Li icon={BadgeCheck}>Server-friendly tagging where supported</Li>
            </ul>
          </div>
        </section>

        {/* Bridge: Ads → Website → Voice */}
        <section className="space-y-4">
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="card p-4 text-sm text-white/75">
              <b>Google Ads</b> brings the right people.
            </div>
            <ArrowRight className="mx-auto opacity-70 hidden md:block" aria-hidden />
            <div className="card p-4 text-sm text-white/75">
              <b>Website + AI Receptionist</b> turn them into bookings.
            </div>
          </div>
          <p className="text-center text-xs text-white/60 max-w-2xl mx-auto">
            Friendly setup. Clear pricing. We optimize toward booked calls — not vanity clicks.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-5 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
            }}
          />
          <p className="relative text-white/80 text-lg">
            Ready to turn intent into appointments?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link href="/contact" className="btn h-12 px-5 rounded-xl inline-flex items-center gap-2">
              <CalendarCheck className="size-4" />
              Book a Strategy Call
            </Link>
            <Link href="/pricing" className="btn-ghost h-12 px-5 rounded-xl inline-flex items-center gap-2">
              <BadgeCheck className="size-4" />
              See friendly pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ------------------------ helpers ------------------------ */

function ValueCard({
  title,
  children,
  ring,
}: {
  title: string;
  children: React.ReactNode;
  ring: string;
}) {
  return (
    <div className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
      <article className="card rounded-2xl bg-black/60 p-6 h-full">
        <h2 className="font-semibold">{title}</h2>
        <div className="mt-3 space-y-2">{children}</div>
      </article>
    </div>
  );
}

function MiniCard({
  title,
  children,
  ring,
}: {
  title: string;
  children: React.ReactNode;
  ring: string;
}) {
  return (
    <div className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
      <article className="card rounded-2xl bg-black/60 p-5 h-full">
        <div className="font-semibold mb-1">{title}</div>
        <p className="text-white/75 text-sm">{children}</p>
      </article>
    </div>
  );
}

function Row({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm text-white/75">
      <Icon className="size-4 mt-0.5 opacity-85" aria-hidden />
      <span>{text}</span>
    </div>
  );
}

function Li({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="size-4 mt-0.5 opacity-85" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
