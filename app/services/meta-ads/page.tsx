import type { Metadata } from "next";
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
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
