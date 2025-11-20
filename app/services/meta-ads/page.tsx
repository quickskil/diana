// app/services/meta-ads/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Megaphone,
  PlayCircle,
  Users,
  FlaskConical,
  ThumbsUp,
  Target,
  Sparkles,
  CheckCircle2,
  Wallet,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import ServicePill from "@/components/ServicePill";

export const metadata: Metadata = {
  title: "Meta Ads",
  description:
    "Creative that gets noticed — and books calls. We plan, test, and scale ads that bring the right people at the right price.",
};

const ring =
  "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.85))";
const pane = "card p-6 rounded-2xl bg-black/65 border border-white/10";

export default function Page() {
  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="svc-title"
    >
      {/* Ambient gradient (LCP-safe) */}
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
        {/* HERO */}
        <header className="space-y-3">
          <ServicePill />
          <h1 id="svc-title" className="leading-tight">
            Meta Ads that turn attention into <span className="text-brand">booked calls</span>
          </h1>
          <p className="lead max-w-3xl">
            We don’t chase “likes.” We build a simple system that finds the right people,
            earns their trust, and gets them to <b>book a call</b>. Choose Meta as a
            standalone growth lane or bundle it with our Google Ads program — we
            market them separately but sync the offer so both audiences move toward
            booking.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="btn">See pricing</Link>
            <Link href="/contact" className="btn-ghost">Book a call</Link>
          </div>

          {/* Trust chips */}
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
            <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 inline-flex items-center gap-2">
              <Target className="size-3.5" /> Quality leads over vanity clicks
            </li>
            <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 inline-flex items-center gap-2">
              <Wallet className="size-3.5" /> Budget used where it works
            </li>
            <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 inline-flex items-center gap-2">
              <MessageCircle className="size-3.5" /> Clear weekly updates
            </li>
          </ul>
        </header>

        {/* What you get — friendly, outcome-first */}
        <section aria-label="What you get" className="grid md:grid-cols-3 gap-4">
          <Outcome
            icon={Megaphone}
            title="Ads people notice (and act on)"
            copy="Short hooks, clear value, and proof. We speak your customer’s language and make the next step obvious."
          />
          <Outcome
            icon={Users}
            title="More of the right people"
            copy="Prospecting + smart retargeting to keep discovery and follow-up covered — with a steady flow of leads."
          />
          <Outcome
            icon={ThumbsUp}
            title="Lower costs over time"
            copy="As winners emerge, we shift spend to what converts and refresh creative to avoid fatigue."
          />
        </section>

        {/* Our Playbook: Create → Test → Scale */}
        <section aria-label="How we run Meta Ads" className="space-y-4">
          <h2 className="text-white/95 font-semibold">Our simple playbook</h2>

          <div className="grid lg:grid-cols-3 gap-4">
            <RingCard>
              <header className="flex items-center gap-2 mb-2">
                <PlayCircle className="opacity-90" aria-hidden />
                <div className="font-semibold">Create</div>
              </header>
              <ul className="text-sm text-white/75 space-y-2 list-disc list-inside">
                <li>UGC + motion that feels native to the feed</li>
                <li>Show proof fast: before/after, reviews, quick demos</li>
                <li>“Book a Call” or Instant Form — obvious and easy</li>
              </ul>
              <p className="text-xs text-white/55 mt-3">
                Goal: ads people actually watch — and act on.
              </p>
            </RingCard>

            <RingCard>
              <header className="flex items-center gap-2 mb-2">
                <FlaskConical className="opacity-90" aria-hidden />
                <div className="font-semibold">Test</div>
              </header>
              <ul className="text-sm text-white/75 space-y-2 list-disc list-inside">
                <li>3–5 fresh ideas each cycle (hooks, angles, formats)</li>
                <li>Quick reads on winners; keep freshness high</li>
                <li>Ad → page message stays tight for quality clicks</li>
              </ul>
              <p className="text-xs text-white/55 mt-3">
                Goal: learn fast, keep only the best.
              </p>
            </RingCard>

            <RingCard>
              <header className="flex items-center gap-2 mb-2">
                <ThumbsUp className="opacity-90" aria-hidden />
                <div className="font-semibold">Scale</div>
              </header>
              <ul className="text-sm text-white/75 space-y-2 list-disc list-inside">
                <li>Shift budget to winners; pause what under-performs</li>
                <li>Unlock scale when fit is proven</li>
                <li>Feed fresh creative so results don’t fade</li>
              </ul>
              <p className="text-xs text-white/55 mt-3">
                Goal: more booked calls for the same (or less) spend.
              </p>
            </RingCard>
          </div>
        </section>

        {/* Why it works (plain-English proof) */}
        <section aria-label="Why it works" className="grid md:grid-cols-3 gap-4">
          <MiniProof
            title="Consistent lead flow"
            copy="Prospecting + retargeting keeps both discovery and follow-up covered."
          />
          <MiniProof
            title="Cheaper clicks over time"
            copy="Better creative + tighter message match = stronger relevance and lower costs."
          />
          <MiniProof
            title="Instant scheduling"
            copy="Pair with our AI voice receptionist to answer, qualify, and book 24/7."
          />
        </section>

        {/* Budget → Results explainer */}
        <section aria-label="Budget to results" className="grid lg:grid-cols-2 gap-4">
          <article className={pane}>
            <header className="mb-2 flex items-center gap-2">
              <Wallet className="opacity-85" />
              <h3 className="font-semibold">How we treat your budget</h3>
            </header>
            <ul className="text-sm text-white/75 space-y-2 list-disc list-inside">
              <li>Start focused: spend goes where results come from</li>
              <li>Cut waste with exclusions and smart placement choices</li>
              <li>Weekly notes on what’s working, and what we’re changing</li>
            </ul>
            <p className="text-xs text-white/55 mt-3">
              The goal isn’t “more spend” — it’s more good leads for every dollar.
            </p>
          </article>

          <article className={pane}>
            <header className="mb-2 flex items-center gap-2">
              <Sparkles className="opacity-85" />
              <h3 className="font-semibold">What makes it convert</h3>
            </header>
            <ul className="text-sm text-white/75 space-y-2 list-disc list-inside">
              <li>Clear value in 1–2 lines — no guessing</li>
              <li>Real proof: reviews, screenshots, quick results</li>
              <li>Friction-free next step (form or “Book a Call”)</li>
            </ul>
            <p className="text-xs text-white/55 mt-3">
              Quick response matters — following up within minutes wins far more
              opportunities than hours later. We design for speed and clarity. 
            </p>
          </article>
        </section>

        {/* What’s included / Options */}
        <section aria-label="Deliverables" className="grid md:grid-cols-2 gap-4">
          <article className={pane}>
            <h3 className="font-semibold">Included</h3>
            <ul className="mt-3 text-sm text-white/75 space-y-2 list-disc list-inside">
              <li>Account setup, clean goals (lead / booked call)</li>
              <li>Creative briefs + weekly test plan</li>
              <li>Retargeting that brings warm visitors back</li>
              <li>Transparent reporting on leads, calls, and CPL</li>
            </ul>
          </article>
          <article className={pane}>
            <h3 className="font-semibold">Options</h3>
            <ul className="mt-3 text-sm text-white/75 space-y-2 list-disc list-inside">
              <li>UGC sourcing, scripts, and motion graphics</li>
              <li>Server-side tagging & CRM routing</li>
              <li>AI voice receptionist: answers, qualifies, <b>books</b> 24/7</li>
            </ul>
          </article>
        </section>

        {/* Gentle FAQ for objections */}
        <section aria-label="FAQ" className="grid md:grid-cols-3 gap-4">
          <Faq
            q="How soon can we start?"
            a="We can usually kick off within a week. Creative and landing page updates happen in parallel so we can launch quickly."
          />
          <Faq
            q="Do you lock us into big budgets?"
            a="No. We start lean, prove the funnel, and scale only when results are consistent."
          />
          <Faq
            q="How do we measure success?"
            a="Booked calls and qualified leads — not vanity clicks. We’ll agree on simple weekly numbers."
          />
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-3 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
            }}
          />
          <p className="relative text-white/80 text-lg">
            Want a simple plan to get more calls from Meta?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link href="/contact" className="btn inline-flex items-center gap-2">
              <PhoneIcon /> Book a Strategy Call
            </Link>
            <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
              See friendly pricing <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>


    </main>
  );
}

/* --------------------- small presentational helpers --------------------- */

function RingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-[1px]" style={{ background: ring }}>
      <div className="rounded-2xl bg-black/75 border border-white/10 p-5">
        {children}
      </div>
    </div>
  );
}

function Outcome({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  copy: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: ring }}>
      <article
        className="card h-full rounded-2xl bg-black/70 p-5"
        style={{
          backgroundImage:
            "radial-gradient(200% 120% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="opacity-90" aria-hidden />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-white/75 text-sm mt-1">{copy}</p>
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
          }}
        />
      </article>
    </div>
  );
}

function MiniProof({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="card p-5">
      <div className="font-semibold mb-1">{title}</div>
      <p className="text-white/75 text-sm">{copy}</p>
    </article>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <article className="card p-5">
      <div className="font-semibold">{q}</div>
      <p className="text-white/75 text-sm mt-1">{a}</p>
    </article>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M2.01 3.72C1.7 2.7 2.7 1.7 3.72 2.01l3.21 1c.63.2 1.04.8 1.04 1.46v2.4a1.8 1.8 0 0 1-.9 1.56l-1.22.68a12.4 12.4 0 0 0 5.14 5.14l.68-1.22a1.8 1.8 0 0 1 1.56-.9h2.4c.66 0 1.26.41 1.46 1.04l1 3.21c.31 1.02-.69 2.02-1.71 1.71l-2.98-.92c-6.4-1.98-11.5-7.08-13.48-13.48l-.92-2.98Z" />
    </svg>
  );
}
