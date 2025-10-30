// app/contact/page.tsx
import MiniChart from "@/components/MiniChart";
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
        <header className="space-y-5 text-center max-w-3xl mx-auto">
          <h1 id="contact-title">Let’s plan how we’ll get you more booked calls</h1>
          <p className="text-white/70">
            In 20 minutes we’ll learn about your offer, walk through the funnel, and size the rollout. You leave with a friendly
            action plan — whether we work together or not.
          </p>
          <div className="mx-auto max-w-sm">
            <MiniChart values={[9, 13, 17, 22, 29, 34, 39, 45]} color="violet" ariaLabel="Projected booked calls after launch" />
            <p className="mt-2 text-xs text-white/55">Typical ramp once the site, ads, and voice follow-up are live.</p>
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
                <MiniChart values={[15, 18, 22, 27, 31, 36, 38, 42]} color="emerald" ariaLabel="Meeting agenda progress" />
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
              <MiniChart values={[95, 78, 62, 48, 34, 22, 18, 15]} color="sky" ariaLabel="Lead response time dropping" />
              <p className="text-xs text-white/55">Voice automation picks up instantly so your team focuses on the closes.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
