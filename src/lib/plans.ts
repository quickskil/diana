export type ServiceKey = 'website' | 'ads' | 'voice';

export type ServiceSelectionState = Record<ServiceKey, boolean>;

export interface ServiceDefinition {
  key: ServiceKey;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  proof: string;
  bullets: string[];
  /** Amount due at approval for this service (cents) */
  dueAtApprovalCents: number;
  /** Ongoing pricing note displayed to users */
  ongoingNote: string;
}

export interface ServiceSelectionSummary {
  /** Selected services in canonical order */
  services: ServiceKey[];
  /** Human readable label (e.g. "Full Funnel" or "Website + Ads") */
  label: string;
  /** Combined tagline used in UI hero sections */
  tagline: string;
  /** Combined summary / overview sentence */
  description: string;
  /** Combined proof line for social validation */
  proof: string;
  /** Merged feature bullets */
  bullets: string[];
  /** Kickoff deposit in cents */
  depositCents: number;
  /** Amount due at approval after discounts */
  dueAtApprovalCents: number;
  /** Discount applied in cents (0 if none) */
  discountCents: number;
  /** Total launch cost (deposit + due at approval) */
  totalLaunchCents: number;
  /** Unique list of ongoing pricing notes */
  ongoingNotes: string[];
  /** True when every core service is active */
  isFullFunnel: boolean;
}

export const SERVICE_DEFINITIONS: Record<ServiceKey, ServiceDefinition> = {
  website: {
    key: 'website',
    name: 'Website',
    shortLabel: 'Website',
    tagline: 'Done-for-you conversion site',
    description: 'Launch a conversion-ready site synced to your calendar and optimized to capture booked calls.',
    proof: 'Ideal when you need to prove a new offer fast without wrestling templates.',
    bullets: [
      'One-page funnel with inline booking and proof-driven copy.',
      'Kickoff strategy call to align offers, proof, and goals.',
      'Hosting, speed, analytics, and ongoing support handled for you.'
    ],
    dueAtApprovalCents: 40000,
    ongoingNote: '$25/mo hosting & care'
  },
  ads: {
    key: 'ads',
    name: 'Ads',
    shortLabel: 'Ads',
    tagline: 'Google & Meta ad campaigns',
    description: 'Pair the site with aligned search and social campaigns so intent turns into booked conversations.',
    proof: 'Perfect when you are ready to control demand with transparent performance metrics.',
    bullets: [
      'Search + social campaigns matched to your on-page message.',
      'Weekly trims, reporting, and cost-per-booked-call transparency.',
      'Creative briefs and copy written to stay on brand.'
    ],
    dueAtApprovalCents: 100100,
    ongoingNote: '10% of ad spend management'
  },
  voice: {
    key: 'voice',
    name: 'AI Voice Agents',
    shortLabel: 'AI Voice',
    tagline: 'AI voice agents for follow-up',
    description: 'Answer every lead instantly with AI agents that qualify, book, and warm-transfer conversations.',
    proof: 'Use when you want after-hours coverage and consistent follow-up without hiring.',
    bullets: [
      '24/7 coverage with warm transfers during business hours.',
      'Lead summaries and CRM sync to keep the whole team aligned.',
      'Usage-based billing that scales with your call volume.'
    ],
    dueAtApprovalCents: 140000,
    ongoingNote: 'Voice agents from $99/mo'
  }
};

export const SERVICE_LIST: ServiceDefinition[] = Object.values(SERVICE_DEFINITIONS);

/** Default selection used in onboarding flows */
export const DEFAULT_SERVICE_SELECTION: ServiceSelectionState = {
  website: true,
  ads: false,
  voice: false
};

/** Kickoff deposit charged once whenever at least one service is selected (cents) */
export const BASE_DEPOSIT_CENTS = 9900;

/**
 * Discount applied to the due-at-approval total when every core service is selected.
 * The rate is intentionally conservative so historic pricing stays familiar while still
 * rewarding the full-funnel upgrade.
 */
export const FULL_FUNNEL_DISCOUNT_RATE = 0.1;

export const SERVICE_ORDER: ServiceKey[] = ['website', 'ads', 'voice'];

const LEGACY_PLAN_MAP: Record<string, ServiceKey[]> = {
  'launch': ['website'],
  'launch-traffic': ['website', 'ads'],
  'full-funnel': ['website', 'ads', 'voice']
};

export const PLAN_KEYS: readonly PlanKey[] = ['launch', 'launch-traffic', 'full-funnel'] as const;

export function normalisePlanKey(value: unknown, fallback: PlanKey = 'launch'): PlanKey {
  if (typeof value === 'string') {
    const trimmed = value.trim() as PlanKey;
    if (PLAN_KEYS.includes(trimmed)) {
      return trimmed;
    }
  }
  return fallback;
}

function uniqueOngoingNotes(keys: ServiceKey[]): string[] {
  return keys
    .map(key => SERVICE_DEFINITIONS[key].ongoingNote)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function mergeBullets(keys: ServiceKey[]): string[] {
  return keys
    .flatMap(key => SERVICE_DEFINITIONS[key].bullets)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function mergeText(keys: ServiceKey[], selector: (service: ServiceDefinition) => string): string {
  const parts = keys.map(key => selector(SERVICE_DEFINITIONS[key])).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  if (parts.length === 1) {
    return parts[0]!;
  }
  return parts.join(' • ');
}

export function normaliseServiceSelection(input: unknown): ServiceSelectionState {
  const base: ServiceSelectionState = { ...DEFAULT_SERVICE_SELECTION };

  if (!input) {
    return base;
  }

  if (typeof input === 'string') {
    const key = input.trim();
    const mapped = LEGACY_PLAN_MAP[key];
    if (mapped) {
      for (const service of SERVICE_ORDER) {
        base[service] = mapped.includes(service);
      }
    }
    return base;
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === 'string' && SERVICE_ORDER.includes(item as ServiceKey)) {
        const key = item as ServiceKey;
        base[key] = true;
      }
    }
    return base;
  }

  if (typeof input === 'object') {
    const record = input as Partial<Record<string, unknown>>;
    for (const key of SERVICE_ORDER) {
      const value = record[key];
      if (typeof value === 'boolean') {
        base[key] = value;
      } else if (typeof value === 'string') {
        base[key] = value === 'true';
      } else if (typeof value === 'number') {
        base[key] = value > 0;
      }
    }
    return base;
  }

  return base;
}

export function selectionToServices(selection: ServiceSelectionState): ServiceKey[] {
  return SERVICE_ORDER.filter(key => Boolean(selection[key]));
}

export function isFullFunnel(selection: ServiceSelectionState): boolean {
  return SERVICE_ORDER.every(key => Boolean(selection[key]));
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cents / 100);
}

export function describeSelection(selection: ServiceSelectionState): ServiceSelectionSummary {
  const services = selectionToServices(selection);
  const hasSelection = services.length > 0;
  const depositCents = hasSelection ? BASE_DEPOSIT_CENTS : 0;
  const fullFunnel = isFullFunnel(selection);

  const dueAtApprovalCents = services.reduce((total, key) => total + SERVICE_DEFINITIONS[key].dueAtApprovalCents, 0);
  const discountCents = fullFunnel ? Math.round(dueAtApprovalCents * FULL_FUNNEL_DISCOUNT_RATE) : 0;
  const discountedDue = Math.max(dueAtApprovalCents - discountCents, 0);
  const totalLaunchCents = depositCents + discountedDue;

  const label = fullFunnel
    ? 'Full Funnel'
    : hasSelection
      ? services.map(key => SERVICE_DEFINITIONS[key].shortLabel).join(' + ')
      : 'No services selected';

  const tagline = fullFunnel
    ? 'Website, ads, and AI voice — fully aligned'
    : mergeText(services, service => service.tagline) || 'Select services to build your stack';

  const description = fullFunnel
    ? 'Everything works together: conversion site, always-on campaigns, and AI follow-up that books calls for you.'
    : mergeText(services, service => service.description) || 'Pick services individually or stack them as you grow.';

  const proof = fullFunnel
    ? 'Best when you want the entire funnel managed end-to-end with bundled savings.'
    : mergeText(services, service => service.proof) || 'Choose the pieces you need today — you can always add more later.';

  const bullets = services.length > 0 ? mergeBullets(services) : ['Pick services to see the rollout details.'];
  const ongoingNotes = services.length > 0 ? uniqueOngoingNotes(services) : [];

  return {
    services,
    label,
    tagline,
    description,
    proof,
    bullets,
    depositCents,
    dueAtApprovalCents: discountedDue,
    discountCents,
    totalLaunchCents,
    ongoingNotes,
    isFullFunnel: fullFunnel
  } satisfies ServiceSelectionSummary;
}

/**
 * Legacy helpers retained while the admin UI transitions away from static "plan" terminology.
 */
export type PlanKey = 'launch' | 'launch-traffic' | 'full-funnel';

export interface PlanDetail {
  key: PlanKey;
  name: string;
  price: string;
  tagline: string;
  description: string;
  bullets: string[];
  services: ServiceKey[];
  discountApplied: boolean;
}

function buildPlanDetail(key: PlanKey): PlanDetail {
  const selection = normaliseServiceSelection(key);
  const summary = describeSelection(selection);
  const priceParts = [formatCurrency(summary.depositCents) + ' kickoff'];
  if (summary.dueAtApprovalCents > 0) {
    const balance = formatCurrency(summary.dueAtApprovalCents) + ' due at approval';
    priceParts.push(balance);
  }
  if (summary.ongoingNotes.length > 0) {
    priceParts.push(summary.ongoingNotes.join(' • '));
  }

  return {
    key,
    name: summary.label,
    price: priceParts.join(' • '),
    tagline: summary.tagline,
    description: summary.description,
    bullets: summary.bullets,
    services: summary.services,
    discountApplied: summary.discountCents > 0
  } satisfies PlanDetail;
}

export const PLAN_CATALOG: Record<PlanKey, PlanDetail> = {
  'launch': buildPlanDetail('launch'),
  'launch-traffic': buildPlanDetail('launch-traffic'),
  'full-funnel': buildPlanDetail('full-funnel')
};

export const PLAN_LIST: PlanDetail[] = Object.values(PLAN_CATALOG);
