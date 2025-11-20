import type { Metadata } from "next";
import { ServicePageTemplate, type ServicePageContent } from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Conversion-Ready Websites & Landing Pages",
  description:
    "Fast, trustworthy sites that turn ad clicks into booked calls. Built for Dominican Republic audiences and ready to self-onboard.",
};

const content: ServicePageContent = {
  title: "Conversion-Ready Websites & Landing Pages",
  subtitle: "Lightning-fast pages that show proof, answer objections, and make booking the obvious next step.",
  overview:
    "We build or refresh your site on a performance-first stack, with messaging, proof, and CTAs designed to book calls. Each page is mapped to your offers and ad campaigns, loads quickly on mobile data in the Dominican Republic, and routes leads to instant scheduling or your AI Voice Agent for live booking.",
  whatYouGet: [
    "Homepage and landing pages structured for above-the-fold clarity, proof, and CTA density",
    "SEO-friendly architecture plus Core Web Vitals optimization for faster loads and better quality scores",
    "Booking flows (calendar or lead form) with notifications and integrations to your CRM",
    "Copywriting and localized Spanish/English variants tuned to Dominican Republic buyers",
    "Analytics, consent banners, and conversion tracking focused on calls and bookings",
    "Self-serve CMS and onboarding so your team can launch updates without developer delays",
  ],
  whyItWorks:
    "People convert when they trust you and see a clear path to action. We combine speed, focused layouts, and objection-handling copy to keep visitors moving toward a call. Faster pages lower ad costs, while clear proof and FAQs boost qualified conversions.",
  howItPairs:
    "Built to pair with Digital Ads & Campaign Management and the AI Voice Agent. Ads send qualified traffic, the Website converts them, and the Voice Agent books or transfers — creating a full-stack loop of Ads + Voice Agent + Website.",
  idealFor: [
    "Service businesses needing a fast refresh before scaling ads",
    "Multi-location teams that need consistent pages for each area",
    "Brands targeting Dominican Republic customers who browse on mobile first",
  ],
  pricing: "Custom based on scope",
  integrationNote:
    "Your site is wired to the same pipeline as our Ads and Voice Agent. Ads drive the right visitors, the Website converts them, and the Voice Agent finalizes the booking — Ads + Voice Agent + Website working together.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
