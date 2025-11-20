import type { Metadata } from "next";
import {
  BellRing,
  Bot,
  CalendarClock,
  Layers3,
  LockKeyhole,
  PhoneCall,
  PhoneForwarded,
  ShieldCheck,
  Sparkles,
  AudioWaveform,
} from "lucide-react";
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
  heroBadges: ["24/7 coverage", "Warm transfers + callbacks", "Compliance-ready scripting"],
  stats: [
    {
      label: "Answer rate",
      value: "93%",
      detail: "Instant pick-up with fallback callbacks for any missed calls",
      icon: PhoneCall,
    },
    {
      label: "Booking conversion",
      value: "+18-32%",
      detail: "Scripted qualification and calendar booking raise show rates",
      icon: CalendarClock,
    },
    {
      label: "Setup time",
      value: "Under 2 weeks",
      detail: "Prebuilt flows, bilingual prompts, and QA keep rollout quick",
      icon: Sparkles,
    },
  ],
  playbooks: [
    {
      title: "Call handling",
      description: "Every caller gets a next step",
      items: [
        "Bilingual greeting, consent, and qualification",
        "Calendar booking or warm transfer based on availability",
        "Callbacks for missed calls, forms, and chats",
      ],
      icon: PhoneForwarded,
    },
    {
      title: "Compliance & trust",
      description: "Guardrails for regulated industries",
      items: [
        "Recorded consent and opt-out language",
        "Sensitive data redaction and routing rules",
        "Audit logs with summaries and outcomes",
      ],
      icon: ShieldCheck,
    },
    {
      title: "Operations",
      description: "Control panel your team can use",
      items: [
        "Prompt, routing, and hours management without tickets",
        "Notifications for new bookings and hot leads",
        "Daily/weekly performance recaps",
      ],
      icon: Bot,
    },
  ],
  steps: [
    {
      title: "Script & routing",
      description: "Capture FAQs, compliance language, and scheduling rules. Map transfers and hours.",
      duration: "Week 1",
    },
    {
      title: "Build & connect",
      description: "Train the agent, wire calendars, and set up numbers, SIP, or WebRTC endpoints.",
      duration: "Week 1-2",
    },
    {
      title: "QA & launch",
      description: "Test flows in both languages, validate recordings/consent, and launch softly.",
      duration: "Week 2",
    },
    {
      title: "Optimize & report",
      description: "Tune questions, transfers, and callback rules using weekly summaries.",
      duration: "Ongoing",
    },
  ],
  proofPoints: [
    "Consent-first scripts with recorded acknowledgements",
    "Fallback routing if calendars are blocked or reps are busy",
    "Automated summaries with action items to your inbox/CRM",
    "Security reviews for storage, retention, and access",
  ],
  toolkit: [
    { name: "AI call flows", detail: "Bilingual scripts + prompts", icon: AudioWaveform },
    { name: "Calendar + booking", detail: "Warm transfers + scheduling", icon: PhoneForwarded },
    { name: "Telephony", detail: "SIP, WebRTC, call distribution", icon: PhoneCall },
    { name: "Compliance", detail: "Consent, redaction, retention", icon: LockKeyhole },
    { name: "Analytics", detail: "Summaries, QA, and alerts", icon: BellRing },
    { name: "Integrations", detail: "CRM + website handoffs", icon: Layers3 },
  ],
  ctaNote:
    "Start with your existing call flows. We handle prompts, QA, and launch scripts, then give your team the controls to tweak routes and follow-up rules.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
