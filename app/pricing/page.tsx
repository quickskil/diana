// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  Search,
  Megaphone,
  PhoneCall,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Smile,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Clear, friendly pricing. Start small, scale when it pays.",
};

type Tier = {
  name: string;
  price: string;
  sub?: string;
  bullets: string[];
  cta: string;
  href: string;
  featured?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  chip?: string;
};

const tiers: Tier[] = [
  {
    name: "Tier 1 • Website",
    price: "from $499",
    sub: "Hosting & monitoring $25/mo",
    bullets: [
      "Clean, fast page that makes it easy to book a call",
      "Inline calendar or quick lead form",
      "Looks great on phones",
    ],
    cta: "Start my website",
    href: "/contact",
    icon: Rocket,
    chip: "Launch fast",
  },
  {
    name: "Tier 2 • Website + Ads",
    price: "from $1,500 setup",
    sub: "Simple management: 10% of ad spend",
    bullets: [
      "Up to 5 pages (home, services, proof, contact, FAQ)",
      "Google & Meta ads that send the right people",
      "Weekly tweaks to keep results improving",
    ],
    cta: "Launch site + ads",
    href: "/contact",
    featured: true,
    icon: Search,
    chip: "Most popular",
  },
  {
    name: "Tier 3 • Website Automation",
    price: "from $2,900 setup",
    sub: "AI voice from $99–$300+/mo • Ads: 10% of spend",
    bullets: [
      "Everything in Tier 2 (site + ads + ongoing improvements)",
      "AI voice answers 24/7, books meetings, and warm-transfers",
      "Less chasing, more conversations with ready buyers",
    ],
    cta: "Scale with automation",
    href: "/contact",
    icon: PhoneCall,
    chip: "Always on",
  },
];

function ValueChip({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

function TierCard(t: Tier) {
  const Ring = t.featured
    ? "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.85))"
    : "linear-gradient(135deg, rgba(124,58,237,.55), rgba(96,165,250,.45), rgba(52,211,153,.45))";

  const Icon = t.icon ?? Megaphone;

  return (
    <article className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: Ring }}>
      <div className={`card h-full rounded-2xl bg-black/70 p-6 ${t.featured ? "ring-1 ring-white/15" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="text-sm text-white/65">{t.name}</div>
          {t.chip && (
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/80">
              {t.chip}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <Icon className="size-5 opacity-90" />
          <div className="text-4xl font-extrabold tracking-tight">{t.price}</div>
        </div>

        {t.sub && <div className="mt-1 text-white/60">{t.sub}</div>}

        <ul className="mt-3 text-sm text-white/75 space-y-2">
          {t.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] size-4 opacity-80" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link href={t.href} className="btn mt-4 inline-flex items-center gap-2">
          {t.cta} <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function AlaCarte({
  title,
  price,
  points,
}: {
  title: string;
  price: string;
  points: string[];
}) {
  return (
    <article className="card p-5">
      <div className="font-semibold">{title}</div>
      <div className="text-2xl font-bold mt-1">{price}</div>
      <ul className="mt-2 text-sm text-white/70 space-y-1 list-disc list-inside">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Page() {
  return (
    <main className="section relative overflow-hidden">
      {/* ambient gradient */}
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

      <div className="container space-y-10">
        {/* Hero */}
        <header className="text-center space-y-3">
          <h1>Pricing</h1>
          <p className="text-white/75 max-w-2xl mx-auto">
            Start with the minimum that makes you money. Add ads when it’s working.
            Turn on voice when you want leads answered <i>every time</i>.
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            <ValueChip icon={Zap}>Launch fast</ValueChip>
            <ValueChip icon={ShieldCheck}>No long-term contracts</ValueChip>
            <ValueChip icon={Smile}>Friendly support</ValueChip>
          </div>

          <p className="text-xs text-white/50">Transparent pricing • Zero pressure</p>
        </header>

        {/* Packages */}
        <section className="grid md:grid-cols-3 gap-4" aria-label="Packages">
          {tiers.map((t) => (
            <TierCard key={t.name} {...t} />
          ))}
        </section>

        {/* What every plan includes */}
        <section aria-label="All plans include" className="grid md:grid-cols-4 gap-3">
          <article className="card p-5">
            <div className="font-semibold">Built to convert</div>
            <p className="text-sm text-white/70 mt-1">
              Clear story, proof above the fold, and a fast path to “Book a Call”.
            </p>
          </article>
          <article className="card p-5">
            <div className="font-semibold">Looks great on phones</div>
            <p className="text-sm text-white/70 mt-1">
              Speedy, mobile-first pages so visitors stick and take action.
            </p>
          </article>
          <article className="card p-5">
            <div className="font-semibold">Simple reporting</div>
            <p className="text-sm text-white/70 mt-1">
              See booked calls and real outcomes — not vanity clicks.
            </p>
          </article>
          <article className="card p-5">
            <div className="font-semibold">Human help</div>
            <p className="text-sm text-white/70 mt-1">
              Friendly chat, clear next steps, and quick tweaks when you need them.
            </p>
          </article>
        </section>

        {/* A-la-carte */}
        <section aria-labelledby="menu-title" className="space-y-3">
          <h2 id="menu-title" className="text-center">Prefer to build your own?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AlaCarte title="Extra website page" price="from $195" points={["Section design & copy polish", "SEO-friendly headings"]} />
            <AlaCarte title="Google Ads setup" price="from $450" points={["Search campaign + tracking", "Weekly checks & tidy-ups"]} />
            <AlaCarte title="Meta Ads setup" price="from $450" points={["Creative variants & hooks", "Simple, clean events"]} />
            <AlaCarte title="Creative pack" price="from $250" points={["Ad copy + 3–5 variants", "Image/video cutdowns"]} />
            <AlaCarte title="AI voice line" price="from $99/mo" points={["Answers 24/7", "Books meetings & warm-transfers"]} />
            <AlaCarte title="CRM connection" price="from $199 setup" points={["HubSpot / Pipedrive / SFDC", "Source tags & call summaries"]} />
          </div>
          <p className="text-xs text-white/55 text-center">
            Final pricing depends on scope and volume. We’ll tailor the plan so you invest the minimum to earn more.
          </p>
        </section>

        {/* Mini FAQ (plain language) */}
        <section className="grid md:grid-cols-3 gap-3">
          <article className="card p-4">
            <div className="font-medium mb-1">Why start at $499?</div>
            <p className="text-sm text-white/70">
              It’s a focused landing page built to convert. Prove ROI quickly, then expand to a full site and ads.
            </p>
          </article>
          <article className="card p-4">
            <div className="font-medium mb-1">Is 10% of ad spend fair?</div>
            <p className="text-sm text-white/70">
              Yes — it’s simple and aligned. We grow when your results grow. No surprise “management” add-ons.
            </p>
          </article>
          <article className="card p-4">
            <div className="font-medium mb-1">How does AI voice pricing work?</div>
            <p className="text-sm text-white/70">
              Most plans are a low monthly base + usage. We’ll size it to your hours and call volume so it stays efficient.
            </p>
          </article>
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
            We’ll tailor the plan so you invest the minimum to make more.
          </p>
          <Link href="/contact" className="relative btn inline-flex items-center gap-2">
            Book a Call <ArrowRight className="size-4" />
          </Link>
          <p className="relative text-xs text-white/55">
            Zero pressure. If we’re not a fit, you’ll still leave with a clear plan.
          </p>
        </section>

        {/* Light notes */}
        <section className="text-[11px] text-white/45 space-y-1">
          <div>
            <b>Notes:</b> “from” prices reflect typical ranges for SMB needs and may vary by scope.
          </div>
        </section>
      </div>
    </main>
  );
}
