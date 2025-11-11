// app/pricing/page.tsx
import type { Metadata } from "next";
import PricingContent, { PricingTier } from "./PricingContent";
import {
  BASE_DEPOSIT_CENTS,
  SERVICE_LIST,
  describeSelection,
  formatCurrency as formatSelectionCurrency,
  type ServiceKey
} from "@/lib/plans";

function selectionFor(keys: ServiceKey[]) {
  const selection: Record<ServiceKey, boolean> = { website: false, ads: false, voice: false };
  keys.forEach(key => {
    selection[key] = true;
  });
  return selection;
}

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans for an automated funnel — start lean, add pieces as you grow.",
};

const tiers: PricingTier[] = [
  ...SERVICE_LIST.map((service, index) => {
    const selection = selectionFor([service.key]);
    const summary = describeSelection(selection);
    const colors: PricingTier["color"][] = ["violet", "sky", "emerald"];
    const color = colors[index % colors.length];
    return {
      name: service.name,
      headline: service.tagline,
      summary: summary.description,
      deposit: `${formatSelectionCurrency(BASE_DEPOSIT_CENTS)} kickoff deposit`,
      depositNote: "Reserves your build slot and gets assets moving.",
      balance: `${formatSelectionCurrency(summary.dueAtApprovalCents)} balance after approval`,
      balanceNote: "We only invoice once you sign off on the launch.",
      ongoing: summary.ongoingNotes.join(" • ") || "No ongoing fees",
      ongoingNote: service.ongoingNote,
      total: `${formatSelectionCurrency(summary.totalLaunchCents)} total launch investment`,
      bullets: summary.bullets,
      cta: service.key === "website" ? "Start with the site" : service.key === "ads" ? "Add traffic" : "Add AI voice",
      trend: index === 0 ? [4, 6, 9, 12, 16, 19, 21, 24] : index === 1 ? [28, 32, 36, 41, 47, 53, 58, 64] : [35, 42, 51, 60, 68, 75, 82, 90],
      color,
      proof: summary.proof,
    } satisfies PricingTier;
  }),
  (() => {
    const selection = selectionFor(["website", "ads", "voice"]);
    const summary = describeSelection(selection);
    return {
      name: "Full Funnel Bundle",
      headline: "Site + ads + voice",
      summary: "Activate every service together and capture leads end-to-end with built-in savings.",
      deposit: `${formatSelectionCurrency(BASE_DEPOSIT_CENTS)} kickoff deposit`,
      depositNote: "Hold your slot while we map campaigns and call flows.",
      balance: `${formatSelectionCurrency(summary.dueAtApprovalCents)} balance after approval`,
      balanceNote: `Bundle savings automatically applied — ${formatSelectionCurrency(summary.discountCents)} off vs. buying individually.`,
      ongoing: summary.ongoingNotes.join(" • "),
      ongoingNote: "Usage-based AI + campaign management scale with demand.",
      total: `${formatSelectionCurrency(summary.totalLaunchCents)} total launch investment`,
      bullets: summary.bullets,
      cta: "Go fully automated",
      trend: [40, 48, 56, 65, 73, 81, 88, 96],
      color: "emerald",
      proof: summary.proof,
    } satisfies PricingTier;
  })(),
];

export default function Page() {
  return <PricingContent tiers={tiers} />;
}
