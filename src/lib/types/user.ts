import type { PlanKey } from '@/lib/plans';

export type UserRole = 'admin' | 'client';

export type OnboardingStatus = 'not-started' | 'submitted' | 'in-progress' | 'launch-ready';

export interface OnboardingForm {
  plan: PlanKey;
  billingContactName: string;
  billingContactEmail: string;
  billingNotes: string;
  companyName: string;
  website: string;
  primaryMetric: string;
  monthlyAdBudget: string;
  salesCycle: string;
  teamSize: string;
  crmTools: string;
  voiceCoverage: string;
  calLink: string;
  goals: string;
  challenges: string;
  launchTimeline: string;
  notes: string;
  targetAudience: string;
  uniqueValueProp: string;
  offerDetails: string;
  brandVoice: string;
  adChannels: string;
  followUpProcess: string;
  receptionistInstructions: string;
  integrations: string;
}

export interface OnboardingSnapshot {
  data: OnboardingForm;
  completedAt: string | null;
  status: OnboardingStatus;
  statusNote?: string | null;
  statusUpdatedAt: string;
}

export interface SafeUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  company?: string | null;
  createdAt: string;
  onboarding?: OnboardingSnapshot | null;
}

export const defaultOnboarding: OnboardingForm = {
  plan: 'launch',
  billingContactName: '',
  billingContactEmail: '',
  billingNotes: '',
  companyName: '',
  website: '',
  primaryMetric: 'Booked consultations',
  monthlyAdBudget: '',
  salesCycle: '',
  teamSize: '',
  crmTools: '',
  voiceCoverage: '',
  calLink: '',
  goals: '',
  challenges: '',
  launchTimeline: '',
  notes: '',
  targetAudience: '',
  uniqueValueProp: '',
  offerDetails: '',
  brandVoice: '',
  adChannels: '',
  followUpProcess: '',
  receptionistInstructions: '',
  integrations: ''
};
