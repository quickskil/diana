// src/components/Footer.tsx
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { getSchedulerUrl } from "@/lib/scheduler";
import {
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  HelpCircle,
  Handshake,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const brand = "Business Booster AI";
  const siteUrl = "https://yourdomain.com"; // update when you deploy
  const schedulerUrl = getSchedulerUrl();

  // Minimal Organization JSON-LD (keeps things clean, no social/address)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: siteUrl,
    logo: `${siteUrl}/theme/img/logo.png`,
  };

  const ring =
    "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.9))";

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="mt-16 border-t border-white/10 bg-black/60 backdrop-blur-sm"
    >
      {/* Structured data for richer snippets */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />


      {/* Main footer grid */}
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        {/* Brand + simple promise */}
        <div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-32">
              <Image
                src="/theme/img/logo.png"
                alt={`${brand} logo`}
                fill
                priority
                sizes="128px"
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-wide">{brand}</span>
          </div>
          <p className="mt-3 text-sm text-white/70">
            We design fast websites, run Google &amp; Meta ads, and add{" "}
            <b>AI voice receptionists</b> that answer and book calls 24/7—so
            you never miss a lead.
          </p>

          {/* Micro trust chips */}
          <ul className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1 inline-flex items-center gap-1 text-white/75">
              <ShieldCheck className="size-3.5" /> No long-term contracts
            </li>
            <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1 inline-flex items-center gap-1 text-white/75">
              <Sparkles className="size-3.5" /> Friendly, done-with-you setup
            </li>
          </ul>
        </div>

        {/* Services */}
        <nav aria-label="Services">
          <h3 className="text-sm font-semibold text-white/85">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {[
              { href: "/services/websites", label: "Websites that Convert" },
              { href: "/services/google-ads", label: "Digital Ads" },
              { href: "/services/meta-ads", label: "Social Ads" },
              { href: "/services/crm-automation", label: "CRM & Automations" },
              { href: "/services/voice-agents", label: "AI Voice Receptionists" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-1 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company">
          <h3 className="text-sm font-semibold text-white/85">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {[
              { href: "/case-studies", label: "Case Studies" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-1 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Helpful links (icons; no social or address) */}
        <div>
          <h3 className="text-sm font-semibold text-white/85">
            Helpful links
          </h3>
          <ul className="mt-3 grid gap-2 text-sm text-white/75">
            <li>
              <Link
                href="/pricing#packages"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span className="inline-flex items-center gap-2">
                  <FileText className="size-4 opacity-90" /> Packages overview
                </span>
                <ArrowRight className="size-4 opacity-70 group-hover:translate-x-0.5 transition" />
              </Link>
            </li>
            <li>
              <a
                href="/voice-demo"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span className="inline-flex items-center gap-2">
                  <HelpCircle className="size-4 opacity-90" /> Try the voice
                  demo
                </span>
                <ArrowRight className="size-4 opacity-70 group-hover:translate-x-0.5 transition" />
              </a>
            </li>
            <li>
              <a
                href={schedulerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck className="size-4 opacity-90" /> Book a quick
                  call
                </span>
                <ArrowRight className="size-4 opacity-70 group-hover:translate-x-0.5 transition" />
              </a>
            </li>
          </ul>

          {/* Subtle gradient ring accent under the helpful list */}
          <div
            aria-hidden
            className="mt-4 rounded-xl h-[1px] w-full opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
            }}
          />
          <p className="mt-2 text-[12px] text-white/55">
            Lead generation on autopilot.
          </p>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 text-xs flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-white/60">
          <div>
            © {year} {brand}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/privacy"
              className="rounded px-1 py-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="rounded px-1 py-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Floating ring accent along the top edge of the footer (subtle) */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-[calc(100%-2px)] h-[2px] w-[min(92vw,1100px)] rounded-full opacity-50"
        style={{ background: ring }}
      />
    </footer>
  );
}
