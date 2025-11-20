import type { Metadata } from "next";
import {
  Activity,
  BarChart3,
  Compass,
  GaugeCircle,
  Megaphone,
  Radar,
  Rocket,
  ShieldCheck,
  Target,
  TrendingDown,
} from "lucide-react";
import { ServicePageTemplate, type ServicePageContent } from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Digital Ads & Campaign Management",
  description:
    "Google + Meta ads tuned for booked calls. Localized campaigns, clear reporting, and self-serve onboarding starting at $499.",
};

const content: ServicePageContent = {
  title: "Digital Ads & Campaign Management",
  subtitle:
    "Full-funnel Google and Meta campaigns built to book calls and visits in the Dominican Republic — without wasting spend.",
  overview:
    "We plan, launch, and optimize Google Search/PMAX and Meta ads together so your brand shows up when people are ready to buy. Every click is routed to a conversion-ready page, then followed by instant scheduling or a warm transfer. You get booked calls, store visits, and transparent CPL reporting, with self-serve onboarding that keeps you in control.",
  whatYouGet: [
    "Channel mix mapped to your goals: Google Search, PMAX, and Meta paid social running in sync",
    "Localized targeting and Spanish/English creative tailored to Dominican Republic audiences",
    "Weekly optimizations to bids, keywords, audiences, and creative so budget flows to the winners",
    "Conversion tracking focused on calls, bookings, and qualified form fills — not vanity metrics",
    "Landing page alignment and offer testing to keep message match tight and CPL trending down",
    "Self-serve onboarding with clear checklists and live dashboards you can review anytime",
  ],
  whyItWorks:
    "We combine intent (Google) with demand creation (Meta) and keep them pointed at the same conversion path. Our team builds native creative, uses Dominican Republic location intelligence, and measures success by booked calls and visits. Weekly tuning keeps campaigns fresh while you see every move in your dashboard.",
  howItPairs:
    "Ads plug directly into our AI Voice Agent and Conversion-Ready Websites. Traffic lands on fast pages that match the ad promise, while the Voice Agent answers, qualifies, and books every lead — so no click is wasted. Add both for a full growth stack that captures, converts, and follows up automatically.",
  idealFor: [
    "Local service businesses in the Dominican Republic that need more booked calls",
    "Multi-location brands seeking consistent lead flow and reliable CPL tracking",
    "Founders who want agency support but prefer self-serve onboarding and transparent edits",
  ],
  pricing: "Starting at $499",
  integrationNote:
    "Best results come when Digital Ads feed into a Conversion-Ready Website and the AI Voice Agent handles calls and callbacks. Combine the three for Ads + Voice Agent + Website coverage across every touchpoint.",
  heroBadges: ["Search + social in sync", "CPL obsessed", "Strategy + execution + QA"],
  stats: [
    {
      label: "Cost per lead",
      value: "-28%",
      detail: "Message match, negative lists, and bid strategy tuning",
      icon: TrendingDown,
    },
    {
      label: "Speed to launch",
      value: "7-10 days",
      detail: "Prebuilt checklists and bilingual creative accelerate go-live",
      icon: Rocket,
    },
    {
      label: "Tracking confidence",
      value: "100%",
      detail: "Server-side tagging, consent, and QAed events for calls and bookings",
      icon: ShieldCheck,
    },
  ],
  playbooks: [
    {
      title: "Acquisition system",
      description: "Intent + discovery working together",
      items: [
        "Google Search + PMAX to win high-intent demand",
        "Meta prospecting and retargeting mapped to your promos",
        "Offer sequencing that lines up with your calendar",
      ],
      icon: Target,
    },
    {
      title: "Creative & copy lab",
      description: "Angles and formats that act native",
      items: [
        "Bilingual ad sets with hooks, headlines, and proofs",
        "UGC-style video, statics, and motion variants to beat fatigue",
        "Ad-to-page message match with shared briefs",
      ],
      icon: Megaphone,
    },
    {
      title: "Optimization cadence",
      description: "Weekly reviews with accountable changes",
      items: [
        "Bid strategy shifts based on lead quality",
        "Budget reallocation tied to conversion paths",
        "QA for search terms, placements, and creative winners",
      ],
      icon: Activity,
    },
  ],
  steps: [
    {
      title: "Plan & forecast",
      description: "Define goals, markets, and offers. Map budgets to CPL and CPA targets.",
      duration: "Week 1",
    },
    {
      title: "Build & wire events",
      description: "Stand up campaigns, pixels, and server-side tagging with QAed test events.",
      duration: "Week 1",
    },
    {
      title: "Launch & learn",
      description: "Ship first wave, monitor early signals, and tighten message match to pages.",
      duration: "Week 2",
    },
    {
      title: "Optimize & scale",
      description: "Weekly iterations to bids, creative, and landing experiences. Monthly reviews with you.",
      duration: "Ongoing",
    },
  ],
  proofPoints: [
    "Documented change logs for every optimization",
    "QA checklist for tracking, consent, and targeting before launch",
    "Brand-safe exclusions and negative lists tuned for the DR",
    "Shared dashboards with call, booking, and revenue signals",
  ],
  toolkit: [
    { name: "Google Ads", detail: "Search, PMAX, YouTube", icon: Compass },
    { name: "Meta Ads", detail: "Prospecting + retargeting", icon: Radar },
    { name: "Server-side tagging", detail: "Better data resiliency", icon: GaugeCircle },
    { name: "Creative templates", detail: "Hooks, scripts, and variants", icon: BarChart3 },
    { name: "QA playbooks", detail: "Checklists and change logs", icon: ShieldCheck },
    { name: "Reporting", detail: "CPL, bookings, and calls", icon: TrendingDown },
  ],
  ctaNote:
    "Spin up campaigns with a guided onboarding: choose markets, approve creative, and watch the dashboard populate in days, not weeks.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
