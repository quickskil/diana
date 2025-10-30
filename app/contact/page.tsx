// app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getSchedulerUrl, toEmbedUrl } from "@/lib/scheduler";
import { CalendarCheck, PhoneCall, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a discovery call to see how we automate your funnel with a conversion-first site, matching ads, and AI voice follow-up.",
};

const CAL_URL = getSchedulerUrl();
const CAL_EMBED_URL = toEmbedUrl(CAL_URL);

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="contact-title">
      <div className="container space-y-10">
        <header className="space-y-5 text-center max-w-3xl mx-auto">
          <h1 id="contact-title">Plan the rollout for more booked calls</h1>
          <p className="text-white/70">
            In a focused 20-minute session we review your offer, identify funnel gaps, and map the launch timeline. You leave with
            a clear next step, whether we partner or not.
          </p>
          <div className="mx-auto max-w-xl text-sm text-white/65">
            <ul className="grid gap-1 text-left md:grid-cols-2">
              <li>• Live review of your current journey</li>
              <li>• Prioritised actions for site, media, and follow-up</li>
              <li>• Implementation timeline and owners</li>
              <li>• Budget guardrails before we start</li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="btn inline-flex items-center gap-2">
              <CalendarCheck className="size-4" aria-hidden />
              Book in Cal.com
            </a>
            <Link href="/pricing" className="btn-ghost">
              View pricing
            </Link>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="radiant-card">
              <div className="card p-5 space-y-3">
                <h2 className="text-lg font-semibold text-white/95">What we’ll cover</h2>
                <ul className="text-sm text-white/75 space-y-2">
                  <li>Where leads come from today and what’s getting in the way</li>
                  <li>The quickest way to launch a conversion-first page</li>
                  <li>How traffic, follow-up, and reporting stay connected</li>
                </ul>
              </div>
            </div>

            <div className="radiant-card">
              <div className="card p-5 space-y-3">
                <h2 className="text-lg font-semibold text-white/95">Say hi anytime</h2>
                <div className="text-sm text-white/70 space-y-2">
                  <p>
                    Email: <a className="underline underline-offset-4" href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>
                  </p>
                  <p>
                    Phone: <a className="underline underline-offset-4" href="tel:+12136810660">+1 (213) 681-0660</a>
                  </p>
                  <p>Hours: Mon–Fri, 9am–5pm PT</p>
                </div>
                <p className="text-xs text-white/55">After hours? The voice agent and scheduler still have you covered.</p>
              </div>
            </div>

            <div className="radiant-card">
              <div className="card p-5 space-y-3">
                <h2 className="text-lg font-semibold text-white/95">What happens next</h2>
                <ol className="text-sm text-white/75 space-y-2 list-decimal list-inside">
                  <li>5-minute discovery to align on offer and goals</li>
                  <li>We outline the exact funnel rollout</li>
                  <li>You get pricing, timeline, and onboarding link</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="radiant-card">
            <div className="card p-2 overflow-hidden">
              <iframe
                src={CAL_EMBED_URL}
                title="Schedule time with Business Booster AI"
                className="w-full rounded-xl border-0"
                style={{ minHeight: "680px" }}
                allow="camera *; microphone *; fullscreen; autoplay"
                loading="lazy"
              />
              <p className="p-3 text-xs text-white/50 text-center">
                Scheduler hosted on Cal.com. Prefer a direct call? We’re happy to dial in.
              </p>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] md:items-center">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-xl font-semibold text-white/95">We’re here to take lead follow-up off your plate</h2>
              <p className="text-sm text-white/70">
                Every engagement includes conversion copywriting, campaign setup, AI call handling, and weekly optimization. One
                team, one invoice, one automated funnel.
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/80 md:justify-start">
                <span className="pill"><Sparkles className="size-4" aria-hidden /> Plain-language updates</span>
                <span className="pill"><PhoneCall className="size-4" aria-hidden /> 24/7 coverage</span>
                <span className="pill"><CalendarCheck className="size-4" aria-hidden /> Meetings on your calendar</span>
              </div>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
              <div className="flex items-center justify-between text-white/60">
                <span>Lead response time</span>
                <span className="badge">Under 30s</span>
              </div>
              <p className="text-xs text-white/55">
                Voice automation answers every inbound request within 30 seconds so your team stays focused on conversations that
                convert.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
