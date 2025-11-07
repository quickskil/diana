export type PlanKey = 'launch' | 'launch-traffic' | 'full-funnel';

export interface PlanDetail {
  key: PlanKey;
  name: string;
  price: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export const PLAN_CATALOG: Record<PlanKey, PlanDetail> = {
  'launch': {
    key: 'launch',
    name: 'Launch',
    price: '$99 kickoff • $400 due at approval • $25/mo hosting & care',
    tagline: 'Done-for-you conversion website',
    description:
      'Launch fast with a single high-converting page that syncs to your calendar and tees up future campaigns.',
    bullets: [
      'One-page funnel with inline booking and proof-driven copy.',
      'Roadmap the rollout on a quick kickoff call so you know every step.',
      'Build the foundation to layer ads and automation when you are ready.',
      'Kick off with a $99 deposit — pay the balance once you approve the launch.'
    ]
  },
  'launch-traffic': {
    key: 'launch-traffic',
    name: 'Launch + Traffic',
    price: '$99 kickoff • $1,401 due at approval • 10% of ad spend',
    tagline: 'Done-for-you site and ads',
    description:
      'Pair the conversion-ready site with paid search and social so you capture intent the moment the page goes live.',
    bullets: [
      'Search + social campaigns matched to the on-page message.',
      'Weekly trims, reporting, and transparent cost-per-booked-call metrics.',
      'Keeps everything in sync so ads, page, and receptionist share the same story.',
      'Kick off with a $99 deposit — pay the balance once you approve the launch.'
    ]
  },
  'full-funnel': {
    key: 'full-funnel',
    name: 'Full Funnel Automation',
    price: '$99 kickoff • $2,801 due at approval • Voice from $99/mo',
    tagline: 'Site, ads, and AI voice receptionist',
    description:
      'Go fully automated with an AI receptionist that answers every lead, books calls, and warm-transfers during open hours.',
    bullets: [
      'Includes everything in Launch + Traffic plus AI voice coverage.',
      'Voice agent qualifies, books, and sends warm transfers after hours.',
      'Scorecards and call summaries tie spend directly to revenue conversations.',
      'Kick off with a $99 deposit — pay the balance once you approve the launch.'
    ]
  }
};

export const PLAN_LIST: PlanDetail[] = Object.values(PLAN_CATALOG);
