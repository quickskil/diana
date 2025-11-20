import type { Metadata } from "next";
import { ServicePageTemplate, type ServicePageContent } from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "CRM, Nurture & Automation Setup",
  description:
    "Lead routing, reminders, and follow-up that keep every inquiry moving. Self-serve onboarding with our growth stack.",
};

const content: ServicePageContent = {
  title: "CRM, Nurture & Automation Setup",
  subtitle:
    "Routing, reminders, and follow-up automations so every lead from Ads, Website, or Voice Agent is worked until it books.",
  overview:
    "We configure your CRM and automations so leads are captured, scored, and followed up automatically. From instant SMS/email confirmations to task queues and pipeline stages, you get a clean system that your team can manage. Our playbooks keep Dominican Republic customers informed in Spanish or English and connect directly to your Ads and Voice Agent data for a full view of performance.",
  whatYouGet: [
    "CRM audit and setup with pipelines mapped to your sales process",
    "Lead routing rules from forms, calls, and chats with clear ownership",
    "Automated SMS/email confirmations, reminders, and no-show recovery sequences",
    "Integration with the AI Voice Agent for call summaries, bookings, and status updates",
    "Dashboards for lead source, speed-to-lead, and booking rates across channels",
    "Self-serve onboarding steps and playbooks so you can adjust automations without custom code",
  ],
  whyItWorks:
    "Fast, consistent follow-up wins more deals than one-off manual outreach. By aligning CRM stages, notifications, and nurture sequences, your team always knows who to call next and prospects receive timely reminders. Dual-language messaging respects Dominican Republic customers and keeps response rates high.",
  howItPairs:
    "Designed to sit between Digital Ads, Conversion-Ready Websites, and the AI Voice Agent. Ads and Website forms feed the CRM instantly, the Voice Agent logs calls and bookings, and automations nudge every lead until they schedule — the full stack of Ads + Voice Agent + Website + CRM working together.",
  idealFor: [
    "Teams without a clean CRM process who want reliable follow-up",
    "Businesses adding call center automation and needing shared visibility",
    "Leaders who want transparent dashboards and self-serve tweaks without hiring engineers",
  ],
  pricing: "Custom setup with ongoing support options",
  integrationNote:
    "We wire CRM and automations directly into the Ads + Voice Agent + Website stack, so every channel is tracked and every lead is nurtured until it books.",
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
