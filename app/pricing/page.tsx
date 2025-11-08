// app/pricing/page.tsx
import type { Metadata } from "next";
import PricingContent, { PricingTier } from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans for an automated funnel — start lean, add pieces as you grow.",
};

const tiers: PricingTier[] = [
  {
    name: "Launch",
    headline: "Conversion website",
    summary: "Conversion website built to capture and schedule leads from day one.",
    deposit: "Only $99 to start",
    depositNote: "Reserves your build slot and gets copy + design rolling.",
    balance: "$400 balance after approval",
    balanceNote: "Invoiced only when you sign off on the launch.",
    ongoing: "$25/mo hosting & care",
    ongoingNote: "Keeps speed, security, and updates handled for you.",
    total: "$499 total build investment",
    bullets: [
      "One-page funnel with booking",
      "Story, proof, and offer aligned",
      "Ready to grow into more pages",
    ],
    cta: "Start with the site",
    trend: [4, 6, 9, 12, 16, 19, 21, 24],
    color: "violet",
    proof: "Ideal when you need to prove a new service or offer quickly.",
  },
  {
    name: "Launch + Traffic",
    headline: "Site + ads",
    summary: "Pair your high-converting site with aligned search and social campaigns.",
    deposit: "Only $99 to start",
    depositNote: "Lock in your spot and we begin audience + keyword research.",
    balance: "$1,401 balance after approval",
    balanceNote: "Covers build + campaign setup once you give the go-ahead.",
    ongoing: "10% of ad spend management",
    ongoingNote: "No retainers — scaled and paused with your budget.",
    total: "$1,500 total launch investment",
    bullets: [
      "Search + social campaigns",
      "Message match from ad to page",
      "Weekly trims & reporting",
    ],
    cta: "Add traffic",
    trend: [28, 32, 36, 41, 47, 53, 58, 64],
    color: "sky",
    proof: "Great for service brands ready to control demand with paid traffic.",
  },
  {
    name: "Full Funnel Automation",
    headline: "Site + ads + voice",
    summary: "Layer in AI reception so every lead is answered and routed instantly.",
    deposit: "Only $99 to start",
    depositNote: "Hold your slot while we map scripts and call flows.",
    balance: "$2,801 balance after approval",
    balanceNote: "Covers launch of the full funnel once you are thrilled with it.",
    ongoing: "Voice reception from $99/mo",
    ongoingNote: "Usage-based AI + human handoff that scales with call volume.",
    total: "$2,900 total launch investment",
    bullets: [
      "Everything in Launch + Traffic",
      "AI receptionist answers instantly",
      "Warm transfers & after-hours booking",
    ],
    cta: "Go fully automated",
    trend: [35, 42, 51, 60, 68, 75, 82, 90],
    color: "emerald",
    proof: "Built for teams that want ads, site, and conversations managed end-to-end.",
  },
];

export default function Page() {
  return <PricingContent tiers={tiers} />;
}
