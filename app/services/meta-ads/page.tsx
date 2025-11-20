import type { Metadata } from "next";
import {
  Aperture,
  Camera,
  Clapperboard,
  Cpu,
  Folders,
  LayoutGrid,
  LineChart,
  Palette,
  Share2,
  Shuffle,
} from "lucide-react";
import { ServicePageTemplate, type ServicePageContent } from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Social Ads & Creative Studio",
  description:
    "Thumb-stopping creative and paid social management that fills your pipeline. Built to complement Google Ads, Voice Agent, and your website.",
};

const content: ServicePageContent = {
  title: "Social Ads & Creative Studio",
  subtitle: "Meta and TikTok creative that earns attention and drives booked calls, coordinated with your Google campaigns.",
  overview:
    "We plan and produce short-form creative that feels native to the feed, then manage paid social campaigns to drive leads at a sustainable CPL. Each ad matches your landing page promise and includes proof, localized hooks, and fast pacing that resonates in the Dominican Republic. Reporting focuses on booked calls and cost per qualified lead, with self-serve onboarding so you can review everything inside the app.",
  whatYouGet: [
    "Creative strategy with hooks, scripts, and motion cues tailored to your offers",
    "Ad production support (UGC-style cuts, subtitles, and rapid variants) ready for Meta and TikTok",
    "Prospecting and retargeting campaigns that sync with your Google Ads calendar",
    "Message-match landing page guidance to keep CPL trending down",
    "Weekly optimizations and refresh cycles to avoid creative fatigue",
    "Self-serve onboarding, briefs, and approval flows directly in your account",
  ],
  whyItWorks:
    "Social ads win when they blend in, show proof fast, and make the next step obvious. We build variations quickly, test them in structured campaigns, and align every winning angle with your website and Google Ads. The result is cheaper clicks and more booked calls, not just views or likes.",
  howItPairs:
    "Runs alongside Digital Ads & Campaign Management to cover both intent and discovery. Traffic lands on Conversion-Ready Websites, and the AI Voice Agent answers every inquiry — turning Social Ads + Voice Agent + Website into a reliable growth loop.",
  idealFor: [
    "Brands that need fresh creative to keep CPL stable",
    "Teams already running Google Ads who want a coordinated social layer",
    "Dominican Republic companies needing bilingual hooks and proof",
  ],
  pricing: "Custom packages based on creative volume",
  integrationNote:
    "Combine Social Ads with the rest of the stack: Ads bring attention, the Website converts, and the Voice Agent books and follows up — Ads + Voice Agent + Website working in sync.",
  heroBadges: ["Creative + media in one room", "Hook testing weekly", "Playbooks for bilingual markets"],
  stats: [
    {
      label: "Creative velocity",
      value: "6-10/mo",
      detail: "Fresh cuts and variants shipped every cycle to beat fatigue",
      icon: Clapperboard,
    },
    {
      label: "CPL stability",
      value: "Within 10%",
      detail: "Offer sequencing and retargeting guardrails keep lead costs predictable",
      icon: LineChart,
    },
    {
      label: "Approval speed",
      value: "48 hrs",
      detail: "Async briefs and annotated previews keep you in the loop without meetings",
      icon: Folders,
    },
  ],
  playbooks: [
    {
      title: "Creative engine",
      description: "Angles that feel native to the feed",
      items: [
        "Hook library with bilingual scripts and captions",
        "UGC-style filming guidance and editing templates",
        "Motion, subtitles, and CTA overlays ready for Meta/TikTok",
      ],
      icon: Camera,
    },
    {
      title: "Testing framework",
      description: "Structured experiments across the funnel",
      items: [
        "Prospecting vs. retargeting mixes that mirror Google themes",
        "Headline, thumb, and CTA testing with clear holdouts",
        "Learning agendas and weekly scorecards",
      ],
      icon: Aperture,
    },
    {
      title: "Operations & governance",
      description: "Keep campaigns safe and on-brand",
      items: [
        "Brand kits, fonts, and color systems baked into templates",
        "Comments and approvals inside the dashboard",
        "Guardrails for compliance and local platform policies",
      ],
      icon: Palette,
    },
  ],
  steps: [
    {
      title: "Angle mapping",
      description: "Pick offers, proof, and hooks aligned to your best customers.",
      duration: "Week 1",
    },
    {
      title: "Produce & prep",
      description: "Capture UGC, edit variants, and package assets for Meta/TikTok.",
      duration: "Week 1-2",
    },
    {
      title: "Launch & learn",
      description: "Deploy campaigns with mirrored structures to Google for clean data.",
      duration: "Week 2",
    },
    {
      title: "Refresh & scale",
      description: "Ship new angles weekly and rebalance budgets based on CPL and bookings.",
      duration: "Ongoing",
    },
  ],
  proofPoints: [
    "Storyboards and subtitles for accessibility and compliance",
    "Asset QA for ratio, pacing, and message match",
    "Brand-safe blocklists and placement controls",
    "Post-purchase and lead quality surveys to validate angles",
  ],
  toolkit: [
    { name: "Meta & TikTok Ads", detail: "Prospecting + retargeting", icon: Share2 },
    { name: "Creative templates", detail: "Hook, thumb, and CTA systems", icon: LayoutGrid },
    { name: "UGC production", detail: "Guides and editing support", icon: Clapperboard },
    { name: "Variant testing", detail: "Holdouts and refresh cadences", icon: Shuffle },
    { name: "Brand kits", detail: "Fonts, colors, and safe words", icon: Palette },
    { name: "Performance reporting", detail: "CPL, bookings, and retention", icon: Cpu },
  ],
  ctaNote:
    "Approve hooks, upload footage, and see preview links before anything goes live. We keep creative and media in one dashboard so you always know what is running.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
