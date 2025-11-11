import type { ServiceKey, ServiceSelectionState } from '@/lib/plans';

export type UserRole = 'admin' | 'client';

export type OnboardingStatus = 'not-started' | 'submitted' | 'in-progress' | 'launch-ready';

export interface OnboardingForm {
  services: ServiceSelectionState;
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

export interface UserServiceStatus {
  key: ServiceKey;
  active: boolean;
  priceCents: number | null;
  ongoingNote: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface OnboardingProject {
  id: string;
  label: string;
  data: OnboardingForm;
  createdAt: string;
  updatedAt: string;
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
  onboarding?: OnboardingProject | null;
  onboardingProjects: OnboardingProject[];
  services: UserServiceStatus[];
}

export const defaultOnboarding: OnboardingForm = {
  services: {
    website: true,
    ads: false,
    voice: false
  },
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
