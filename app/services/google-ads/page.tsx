import type { Metadata } from "next";
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
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
