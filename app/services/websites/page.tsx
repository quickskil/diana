import type { Metadata } from "next";
import {
  BadgeCheck,
  BarChart4,
  Globe,
  Layers3,
  MousePointerClick,
  PenTool,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TimerReset,
  Wand2,
} from "lucide-react";
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
    "We build or refresh your site on a performance-first stack. Every page ships with conversion patterns above the fold, localized Spanish/English copy, and booking flows that sync to your calendar. You get a CMS you can edit, QA across devices common in the Dominican Republic, and analytics that focus on calls and scheduled visits — not vanity metrics.",
  whatYouGet: [
    "Homepage and landing templates with hero, proof, pricing, FAQ, and CTA density tuned for conversions",
    "SEO-friendly architecture plus Core Web Vitals and image optimization for faster loads on mobile data",
    "Booking flows (calendar or lead form) with notifications, tags, and CRM-ready payloads",
    "Copywriting and bilingual variants tailored to Dominican Republic buyers with localized trust cues",
    "Analytics, consent banners, and conversion tracking mapped to booked calls and store visits",
    "Self-serve CMS, pattern library, and onboarding so your team can launch updates without developer delays",
  ],
  whyItWorks:
    "People convert when they trust you and see a frictionless next step. We combine speed, focused layouts, and objection-handling copy to keep visitors moving toward a call. Faster pages lower ad costs, while proof, FAQs, and social validation lift qualified conversions.",
  howItPairs:
    "Built to pair with Digital Ads & Campaign Management and the AI Voice Agent. Ads send qualified traffic, the Website converts them, and the Voice Agent books or transfers — creating a full-stack loop of Ads + Voice Agent + Website.",
  idealFor: [
    "Service businesses needing a fast refresh before scaling ads",
    "Multi-location teams that require consistent pages per location",
    "Brands targeting Dominican Republic customers who browse on mobile first",
  ],
  pricing: "Custom based on scope",
  integrationNote:
    "Your site is wired to the same pipeline as our Ads and Voice Agent. Ads drive the right visitors, the Website converts them, and the Voice Agent finalizes the booking — Ads + Voice Agent + Website working together.",
  heroBadges: ["Production-ready build room", "SEO + CRO baked in", "Mobile-first for the Dominican Republic"],
  stats: [
    {
      label: "Load time",
      value: "<1.2s avg",
      detail: "Edge caching, image optimization, and Core Web Vitals tuned on Next.js",
      icon: TimerReset,
    },
    {
      label: "Conversion lift",
      value: "+32%",
      detail: "CTA density, proof, and localized messaging raise booked-call rates",
      icon: MousePointerClick,
    },
    {
      label: "Self-serve edits",
      value: "Minutes",
      detail: "Pattern library + CMS so your team ships pages without ticket queues",
      icon: Sparkles,
    },
  ],
  playbooks: [
    {
      title: "Conversion spine",
      description: "Above-the-fold clarity, proof placement, and CTA rhythm",
      items: [
        "Hero, offer, and social proof within the first scroll",
        "Pricing, FAQ, and objection handling mapped to your offers",
        "Sticky CTAs and inline booking for mobile visitors",
      ],
      icon: Wand2,
    },
    {
      title: "Search + tracking",
      description: "SEO structure with reliable analytics",
      items: [
        "Schema, sitemaps, and internal linking for your services",
        "Server-side tagging plus consent-ready analytics",
        "GA4 and pixel events focused on booked calls and visits",
      ],
      icon: Globe,
    },
    {
      title: "Localization & trust",
      description: "Designed for Dominican Republic audiences",
      items: [
        "Bilingual copy and currency formatting",
        "Regulatory and accessibility guardrails",
        "Local testimonials and proof blocks to reduce hesitation",
      ],
      icon: ShieldCheck,
    },
  ],
  steps: [
    {
      title: "Blueprint & messaging",
      description: "Audit your current site, map offers to pages, and collect proof + FAQs.",
      duration: "Week 1",
    },
    {
      title: "Build & CMS setup",
      description: "Implement layouts, copy, and bilingual variants with structured data.",
      duration: "Weeks 2-3",
    },
    {
      title: "QA & performance",
      description: "Cross-device QA, performance tuning, and event tracking validation.",
      duration: "Week 3",
    },
    {
      title: "Launch & iterate",
      description: "Ship, monitor conversions, and hand off a playbook for ongoing updates.",
      duration: "Week 4",
    },
  ],
  proofPoints: [
    "Accessibility and consent patterns built in",
    "Device lab QA for low-bandwidth and mobile visitors",
    "Content approvals with annotated previews",
    "Performance budgets with alerts if pages regress",
  ],
  toolkit: [
    { name: "Next.js + Vercel", detail: "Performance-first hosting", icon: Layers3 },
    { name: "Tailwind + design tokens", detail: "Consistent UI patterns", icon: PenTool },
    { name: "Cal.com & forms", detail: "Booking and lead capture", icon: BadgeCheck },
    { name: "Analytics & pixels", detail: "GA4, Meta, and server tagging", icon: BarChart4 },
    { name: "Localization", detail: "Spanish/English variants", icon: Smartphone },
    { name: "QA & monitoring", detail: "Uptime, speed, and alerting", icon: ShieldCheck },
  ],
  ctaNote:
    "Onboard inside the app with a page checklist, copy prompts, and preview links. We stay available for launch-day edits and CRO suggestions.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
