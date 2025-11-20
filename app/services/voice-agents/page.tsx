import type { Metadata } from "next";
import { ServicePageTemplate, type ServicePageContent } from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "AI Voice Agent & Call Center Automation",
  description:
    "Answer every call, qualify leads, and book appointments automatically. Warm transfers and instant callbacks built for growth teams in the Dominican Republic.",
};

const content: ServicePageContent = {
  title: "AI Voice Agent & Call Center Automation",
  subtitle:
    "An AI receptionist that answers in seconds, qualifies callers, and books meetings so your team never loses a high-intent lead.",
  overview:
    "We deploy an AI voice agent that greets callers in your brand voice, verifies consent, asks the right questions, and books them directly onto your calendar or connects them live. Missed calls trigger automatic callbacks, so every click from your Ads or Website is protected. Reporting lives in your dashboard with call summaries, outcomes, and routing rules you can adjust yourself.",
  whatYouGet: [
    "24/7 answering with Spanish/English scripts tuned for Dominican Republic callers",
    "Qualification questions, appointment booking, and warm transfers to your team when they’re available",
    "Automatic callbacks for missed calls or new form/chat leads so no opportunity slips",
    "Call summaries, recordings (where allowed), and CRM notes synced to your systems",
    "Self-serve playbooks and onboarding steps so you can update prompts and routing without tickets",
    "Compliance guardrails with clear consent language and opt-out options baked in",
  ],
  whyItWorks:
    "Speed wins deals. By answering instantly and following proven call flows, the Voice Agent keeps prospects engaged and moves them to a scheduled slot or live rep before a competitor can. Localized scripts and dual-language support build trust, while automated reporting shows which channels drive the best conversations.",
  howItPairs:
    "Pair it with Digital Ads & Campaign Management to protect every paid click, and with Conversion-Ready Websites so callers land on a page that sets the right expectation. Together, Ads + Voice Agent + Website give you a closed loop: attract, capture, and convert without gaps.",
  idealFor: [
    "Service businesses that miss calls during peak hours",
    "Sales teams that want fewer no-shows and better-qualified conversations",
    "Dominican Republic brands needing bilingual coverage and clear compliance language",
  ],
  pricing: "Custom based on call volume",
  integrationNote:
    "Works best when connected to our Digital Ads and Conversion-Ready Websites. Ads drive the calls, the Website sets the promise, and the Voice Agent books the meeting — a full-stack loop of Ads + Voice Agent + Website.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
