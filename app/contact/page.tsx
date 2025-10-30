// app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getSchedulerUrl, toEmbedUrl } from "@/lib/scheduler";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a discovery call. We’ll show you how we turn clicks into booked calls with websites, ads, and AI voice receptionists.",
};

const CAL_URL = getSchedulerUrl();
const CAL_EMBED_URL = toEmbedUrl(CAL_URL);

export default function Page() {
  return (
    <main id="main" className="section">
      <div className="container space-y-10">
        {/* Hero */}
        <header className="text-center space-y-3">
          <h1>Book a Discovery Call</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Fast chat. Clear plan. If we’re a fit, we’ll launch a site that converts, turn on ads that compound,
            and connect an AI voice receptionist so you never miss a lead.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/case-studies" className="btn-ghost">See results</Link>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="btn">Open scheduler in Cal.com</a>
          </div>
          <p className="text-xs text-white/50">No long-term contracts • Transparent pricing</p>
        </header>

        {/* Grid: contact & scheduler */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <article className="card p-5">
              <div className="font-semibold">How we help</div>
              <ul className="mt-2 text-sm text-white/70 space-y-2 list-disc list-inside">
                <li>Tier 1: Website that actually converts</li>
                <li>Tier 2: Website + Ads (management at <b>10%</b> of ad spend)</li>
                <li>Tier 3: Website Automation — ads + <b>AI voice receptionist</b></li>
              </ul>
            </article>

            <article className="card p-5">
              <div className="font-semibold">Talk to a real person</div>
              <ul className="mt-2 text-sm text-white/70 space-y-2">
                <li>Email: <a href="mailto:hello@yourdomain.com" className="underline underline-offset-4">hello@yourdomain.com</a></li>
                <li>Phone: <a href="tel:+12136810660" className="underline underline-offset-4">+1 (213) 681-0660</a></li>
                <li>Hours: Mon–Fri, 9am–5pm (PST)</li>
              </ul>
              <p className="mt-3 text-xs text-white/50">Prefer after-hours? Book below — our AI receptionist can still schedule you through Cal.com.</p>
            </article>

            <article className="card p-5">
              <div className="font-semibold">What to expect</div>
              <ol className="mt-2 text-sm text-white/70 space-y-2 list-decimal list-inside">
                <li>5–10 minutes to understand your offer & goals.</li>
                <li>The quickest path to ROI — no fluff.</li>
                <li>Clear next steps, pricing, and timeline.</li>
              </ol>
            </article>
          </div>

          {/* Cal.com inline */}
          <div className="card p-2 overflow-hidden">
            <iframe
              src={CAL_EMBED_URL}
              title="Schedule time with Business Booster AI"
              className="w-full rounded-xl border-0"
              style={{ minHeight: "720px" }}
              allow="camera *; microphone *; fullscreen; autoplay"
              loading="lazy"
            />
            <p className="p-3 text-xs text-white/50">
              Powered by {" "}
              <a className="underline" href="https://cal.com" target="_blank" rel="noopener noreferrer">
                Cal.com
              </a>
              .
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-3">
          <p className="text-white/70">Zero pressure. If we’re not a fit, you’ll still leave with a clear plan.</p>
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="btn">Book a Call</a>
        </section>
      </div>
    </main>
  );
}
