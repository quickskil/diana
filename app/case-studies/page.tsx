// app/case-studies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Proof, not promises: real outcomes from fast websites, coordinated ads, and AI voice receptionists that turn clicks into booked calls.",
};

type Study = {
  name: string;
  vertical: string;
  metric: string;
  detail: string;
  method: string;
  tags?: string[];
};

type Play = {
  title: string;
  outcome: string;
  bullets: string[];
  cta?: string;
  href?: string;
};

const studies: Study[] = [
  // DTC / eCom
  {
    name: "DTC Skincare (anonymized)",
    vertical: "DTC / eCommerce",
    metric: "ROAS 3.2 → 5.0",
    detail:
      "Creative variants + faster product page reduced drop-offs and lifted return on ad spend.",
    method: "Fresh hooks • product proof above the fold • quicker LCP",
    tags: ["Meta", "Creative", "Speed"],
  },
  {
    name: "Nutritional Supplements",
    vertical: "DTC / eCommerce",
    metric: "Checkout completion +28%",
    detail:
      "Simplified mobile cart, trust badges earlier, and cleaner offers. More paid clicks turned into orders.",
    method: "Offer clarity • trust elements • mobile friction cuts",
    tags: ["CRO", "Mobile", "Trust"],
  },

  // SaaS
  {
    name: "B2B SaaS Trials",
    vertical: "SaaS",
    metric: "Demo requests +92%",
    detail:
      "Search + PMAX aimed at pains by role; pricing page simplified; voice agent booked after hours.",
    method: "Intent mapping • clear plan tiers • 24/7 booking",
    tags: ["Search", "PMAX", "Voice"],
  },
  {
    name: "Dev Tools",
    vertical: "SaaS",
    metric: "CPL −34%",
    detail:
      "Landing pages matched queries tightly; YouTube explainer raised CTR and lowered CPC over time.",
    method: "Message match • lightweight video • steady testing",
    tags: ["YouTube", "Quality", "CPL"],
  },

  // Local Services / Trades
  {
    name: "HVAC Peak Season",
    vertical: "Trades",
    metric: "Missed calls −65%",
    detail:
      "AI voice receptionist answered overflow; urgent jobs routed to on-call tech, others booked.",
    method: "Priority queues • warm-transfer • instant scheduling",
    tags: ["Voice", "Dispatch", "After-hours"],
  },
  {
    name: "Roofing Estimates",
    vertical: "Home Services",
    metric: "Booked inspections 2.2×",
    detail:
      "Neighborhood LPs + call-to-book flow; AI voice qualified storm-damage leads and set visits.",
    method: "Local LPs • proof gallery • booking first",
    tags: ["Local", "LPs", "Voice"],
  },

  // Healthcare
  {
    name: "Dental Group",
    vertical: "Healthcare",
    metric: "New patient calls +58%",
    detail:
      "Insurance FAQs above the fold, location pages, and voice agent to book consults nights/weekends.",
    method: "Insurance clarity • maps LPs • after-hours",
    tags: ["Voice", "Local SEO", "Maps"],
  },
  {
    name: "Physical Therapy",
    vertical: "Healthcare",
    metric: "Show-ups +36%",
    detail:
      "Shorter intake forms, SMS reminders, and warm-transfer for post-surgery inquiries.",
    method: "Short forms • reminders • transfer",
    tags: ["Forms", "Reminders", "Transfer"],
  },

  // Legal
  {
    name: "Injury Law",
    vertical: "Legal",
    metric: "CPL −31%",
    detail:
      "Theme-tight ad groups + intent-specific landing pages improved Quality Score and reduced CPC.",
    method: "Keyword themes • proof • call routing",
    tags: ["Search", "Quality Score", "Calls"],
  },
  {
    name: "Immigration",
    vertical: "Legal",
    metric: "Qualified consults +47%",
    detail:
      "Language-specific pages; voice agent captured and scheduled after hours across time zones.",
    method: "Language LPs • 24/7 booking • timezone routing",
    tags: ["Voice", "Multilingual", "Booking"],
  },

  // Real Estate
  {
    name: "Real Estate Team",
    vertical: "Real Estate",
    metric: "Appointments 2.1×",
    detail:
      "Seller lead magnets; voice agent pre-qualified and booked showings for ready buyers.",
    method: "Guides • calendar routing • SMS confirm",
    tags: ["Funnels", "Voice", "SMS"],
  },

  // Education
  {
    name: "Bootcamp Programs",
    vertical: "Education",
    metric: "Applications +54%",
    detail:
      "Program pages simplified; chat-to-call handover; voice agent booked campus calls over weekends.",
    method: "Clear syllabus • handover • weekend booking",
    tags: ["CRO", "Voice", "Chat"],
  },

  // Fitness / Hospitality
  {
    name: "Fitness Studio",
    vertical: "Fitness",
    metric: "Trial signups +73%",
    detail:
      "Offer tests on Meta and faster mobile hero improved first-visit conversion.",
    method: "Offer/angle tests • short form • wallet pass",
    tags: ["Meta", "Offers", "Mobile"],
  },
  {
    name: "Boutique Hotel",
    vertical: "Hospitality",
    metric: "Direct bookings +26%",
    detail:
      "Meta + Search to direct site; voice handled late-night calls and upsold packages.",
    method: "Direct booking • upsell scripts • after-hours",
    tags: ["Meta", "Search", "Voice"],
  },

  // Finance / Insurance
  {
    name: "Mortgage Brokers",
    vertical: "Finance",
    metric: "Qualified leads +41%",
    detail:
      "Search by product type; pre-approval flow; warm-transfer for hot leads during work hours.",
    method: "Product LPs • pre-qual • transfer",
    tags: ["Search", "LPs", "Voice"],
  },
  {
    name: "Auto Insurance",
    vertical: "Insurance",
    metric: "Quote requests +38%",
    detail:
      "Simple quote form; PMAX scale; voice agent followed up on incomplete forms.",
    method: "Short forms • PMAX • callback",
    tags: ["Forms", "PMAX", "Voice"],
  },

  // B2B Services
  {
    name: "IT Services",
    vertical: "B2B Services",
    metric: "Sales calls +52%",
    detail:
      "Pain-based Search + proof-heavy LPs; voice receptionist booked evaluations after hours.",
    method: "Pain keywords • proof • voice booking",
    tags: ["Search", "Proof", "Voice"],
  },
  {
    name: "Commercial Cleaning",
    vertical: "B2B Services",
    metric: "RFPs +37%",
    detail:
      "Geo LPs and scheduler; voice agent qualified by square footage and timing.",
    method: "Geo LPs • qualification • scheduling",
    tags: ["Local", "Voice", "Calendar"],
  },

  // Non-profit
  {
    name: "Non-profit Fundraising",
    vertical: "Non-profit",
    metric: "Donations +22%",
    detail:
      "Faster donation page, clear impact blocks, and remarketing to previous supporters.",
    method: "Speed • impact proof • remarketing",
    tags: ["CRO", "Meta", "Email"],
  },
];

const plays: Play[] = [
  {
    title: "Speed → more people stay",
    outcome: "Pages feel instant on phones, so fewer visitors bounce.",
    bullets: ["Keep the most important content up top", "Avoid layout jumps", "Compress images & ship lean"],
  },
  {
    title: "Relevance lowers your costs",
    outcome: "Ad → page message match lifts results and often reduces CPC.",
    bullets: ["Match the search or scroll ‘hook’ on the page", "Show proof quickly", "Make the next step obvious"],
  },
  {
    title: "Answer instantly, win more",
    outcome: "AI receptionist books meetings 24/7 and warm-transfers hot callers.",
    bullets: ["After-hours coverage", "Warm transfer during open hours", "Summaries to your CRM"],
  },
];

export default function Page() {
  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="cs-title"
    >
      {/* Ambient gradient mesh behind content */}
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
        {/* Hero */}
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 badge">
            Proof • Not promises
          </div>
          <h1 id="cs-title">Case Studies</h1>
          <p className="text-white/70 max-w-3xl mx-auto">
            We combine fast websites, coordinated ads, and AI voice receptionists
            to turn clicks into <b>booked calls</b> — even after hours.
          </p>
          <p className="text-xs text-white/50">
            Metrics below are anonymized composites that reflect common results
            by niche. Your plan will be tailored to your goals and budget.
          </p>
        </header>

        {/* Studies grid */}
        <section
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Recent outcomes by niche"
        >
          {studies.map((x) => (
            <article
              key={x.name}
              className="group card p-5 flex flex-col gap-3 relative overflow-hidden"
              style={{
                backgroundImage:
                  "radial-gradient(200% 120% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/70">{x.vertical}</div>
                <span className="badge">Composite</span>
              </div>

              <h2 className="font-semibold">{x.name}</h2>
              <div className="text-3xl font-extrabold tracking-tight">
                {x.metric}
              </div>
              <p className="text-white/70 text-sm">{x.detail}</p>
              <div className="text-xs text-white/60">How: {x.method}</div>

              {x.tags && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {x.tags.map((t) => (
                    <li
                      key={t}
                      className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              {/* bottom shimmer line */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-px opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
                }}
              />
            </article>
          ))}
        </section>

        {/* Why results happen (simple, non-technical) */}
        <section
          className="grid lg:grid-cols-3 gap-4"
          aria-label="Why this works"
        >
          {plays.map((p) => (
            <article key={p.title} className="card p-5">
              <div className="font-semibold mb-1">{p.title}</div>
              <p className="text-sm text-white/70">{p.outcome}</p>
              <ul className="mt-2 text-sm text-white/70 space-y-1 list-disc list-inside">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* Niche playbooks (choose your lane) */}
        <section
          aria-labelledby="niche-title"
          className="space-y-4"
        >
          <h2 id="niche-title" className="text-center">
            Choose your lane — we’ll bring the playbook
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Home Services",
                copy:
                  "Neighborhood pages + click-to-book. Voice answers peaks and books jobs after hours.",
                chips: ["Local LPs", "Reviews", "After-hours"],
              },
              {
                title: "Healthcare",
                copy:
                  "Insurance info up front, locations nearby, and instant booking to reduce no-shows.",
                chips: ["Insurance FAQs", "Maps", "Reminders"],
              },
              {
                title: "SaaS",
                copy:
                  "Search by role/pain, short demo path, and voice to catch nights/weekends.",
                chips: ["Pain keywords", "Clear pricing", "24/7 booking"],
              },
              {
                title: "Legal",
                copy:
                  "Intent-specific pages, proof of wins, and warm-transfer for hot cases.",
                chips: ["Intent LPs", "Proof", "Live transfer"],
              },
              {
                title: "DTC / eCom",
                copy:
                  "Fast product pages, quick proof, and creative testing that keeps costs down.",
                chips: ["Speed", "UGC", "Offers"],
              },
              {
                title: "B2B Services",
                copy:
                  "Pain-based Search + consult LPs. Voice receptionist books the meeting.",
                chips: ["Search", "Proof", "Voice"],
              },
            ].map((n) => (
              <article
                key={n.title}
                className="card p-5 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(200% 120% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
                }}
              >
                <div className="font-semibold">{n.title}</div>
                <p className="text-white/70 text-sm mt-1">{n.copy}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {n.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Premium CTA band */}
        <section aria-labelledby="cta-title" className="space-y-4">
          <h2 id="cta-title" className="text-center">Want a version of this for your niche?</h2>
          <div className="relative text-center">
            {/* gradient halo */}
            <div
              aria-hidden
              className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
              }}
            />
            <p className="relative text-white/75 text-lg">
              We’ll map a simple plan to turn more clicks into booked calls — and
              show you the quickest win.
            </p>
            <div className="relative mt-3 flex items-center justify-center gap-2">
              <Link href="/contact" className="btn">
                Book a Strategy Call
              </Link>
              <Link href="/pricing" className="btn-ghost">
                See pricing
              </Link>
            </div>
            <p className="relative text-xs text-white/50 mt-2">
              Friendly chat. Clear next steps. No long-term contracts.
            </p>
          </div>
        </section>

        {/* Small print */}
        <p className="text-[11px] text-white/45">
          These examples illustrate typical lifts when fast pages, relevant ads,
          and instant answering work together. Results vary by market and budget.
        </p>
      </div>
    </main>
  );
}
