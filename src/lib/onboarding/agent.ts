// Onboarding agent state machine for Business Booster onboarding flow.
// This module provides a structured way to track the nine-step onboarding
// experience, calculate deposits, and emit machine-readable payloads for the
// backend and automation layers.

export const KICKOFF_DEPOSIT = 99;

export type OnboardingStepId =
  | 'WELCOME'
  | 'SELECT_SERVICES'
  | 'BUSINESS_INFO'
  | 'DESIGN_SPECS'
  | 'MEDIA_UPLOAD'
  | 'REVIEW_AND_PAY_99'
  | 'POSTPAY_SUCCESS'
  | 'LAUNCH_APPROVAL'
  | 'FINAL_INVOICE';

export interface OnboardingStep {
  id: OnboardingStepId;
  index: number;
  title: string;
  prompt: string;
}

export type ServiceKey =
  | 'conversion_website'
  | 'google_ads_setup'
  | 'meta_ads_setup'
  | 'ai_voice_receptionist'
  | 'analytics_reporting'
  | 'booking_calendar';

export interface ServiceDefinition {
  id: ServiceKey;
  label: string;
  total: number;
  ongoingNote?: string;
}

export interface SelectedService {
  id: ServiceKey;
  label: string;
  total: number;
  deposit: number;
  balanceDueLater: number;
  ongoingNote?: string;
}

export interface BusinessInfo {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  serviceAreas: string;
  coreServices: string;
  description: string;
  successGoal: string;
  competitors?: string;
  socialLinks?: string[];
}

export interface DesignSpecs {
  brandColours?: string;
  preferredFonts?: string;
  styleMood?: string;
  references?: string;
  notes?: string;
}

export interface UploadAsset {
  id: string;
  url: string;
  filename?: string;
  mimeType?: string;
  sizeKb?: number;
  category?:
    | 'logo'
    | 'brand_photo'
    | 'team_photo'
    | 'before_after'
    | 'testimonial'
    | 'brochure'
    | 'voice_sample'
    | 'other';
}

export interface VoiceAgentConfig {
  timezone: string;
  businessHours: {
    dow: number[];
    start: string;
    end: string;
  };
  warmTransferNumber?: string;
  positiveIntentKeywords: string[];
  minConfidenceForTransfer: number;
}

export type OnboardingStatus =
  | 'draft'
  | 'deposit_paid'
  | 'awaiting_final_invoice'
  | 'complete';

export interface OnboardingState {
  projectId: string;
  state: OnboardingStepId;
  currentStepIndex: number;
  totalSteps: number;
  status: OnboardingStatus;
  selectedServices: SelectedService[];
  depositNow: number;
  balanceLater: number;
  business?: BusinessInfo;
  designSpecs?: DesignSpecs;
  uploads: UploadAsset[];
  voiceAgent?: VoiceAgentConfig | null;
  webhookQueue: string[];
}

export const SERVICE_CATALOG: Record<ServiceKey, ServiceDefinition> = {
  conversion_website: {
    id: 'conversion_website',
    label: 'Conversion Website',
    total: 499,
  },
  google_ads_setup: {
    id: 'google_ads_setup',
    label: 'Google Ads Setup',
    total: 499,
  },
  meta_ads_setup: {
    id: 'meta_ads_setup',
    label: 'Meta Ads Setup',
    total: 499,
  },
  ai_voice_receptionist: {
    id: 'ai_voice_receptionist',
    label: 'AI Voice Receptionist',
    total: 499,
    ongoingNote: 'Includes AI receptionist routing. Voice minutes billed separately after launch.',
  },
  analytics_reporting: {
    id: 'analytics_reporting',
    label: 'Analytics & Reporting Setup',
    total: 199,
  },
  booking_calendar: {
    id: 'booking_calendar',
    label: 'Booking Calendar Integration',
    total: 149,
  },
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'WELCOME',
    index: 1,
    title: 'Welcome',
    prompt:
      '🚀 Kick off your project for only $99 now — the rest you only pay when you approve the launch.\nChoose the services you’d like to start with, and we’ll build your funnel.\n*Progress: Step 1 of 9*',
  },
  {
    id: 'SELECT_SERVICES',
    index: 2,
    title: 'Select services',
    prompt:
      'Select the services you want. Each service starts at $99 now. The balance is paid after you approve launch.\nAvailable services:\n- Conversion Website – total $499\n- Google Ads Setup – total $499\n- Meta Ads Setup – total $499\n- AI Voice Receptionist – total $499\n- Analytics & Reporting Setup – total $199\n- Booking Calendar Integration – total $149\n*Progress: Step 2 of 9*',
  },
  {
    id: 'BUSINESS_INFO',
    index: 3,
    title: 'Business information',
    prompt:
      'Now tell us about your business. This helps us craft copy, design, and automation that feels like you.\nRequired fields:\n• Business Name\n• Contact Name\n• Email\n• Phone\n• Website/Domain (if any)\n• Service Areas or Regions\n• Core Services or Products\n• Short Description of What You Offer\n• Your Success Goal\nOptional: Competitors, Social Media links.\n*Progress: Step 3 of 9*',
  },
  {
    id: 'DESIGN_SPECS',
    index: 4,
    title: 'Design specs',
    prompt:
      'What should your brand look and feel like?\nProvide:\n• Brand colours (hex or keywords)\n• Preferred fonts (if any)\n• Style/mood (e.g., modern, friendly, bold)\n• Any reference websites or screenshots\nIf unsure, just tell us your vibe.\n*Progress: Step 4 of 9*',
  },
  {
    id: 'MEDIA_UPLOAD',
    index: 5,
    title: 'Media upload',
    prompt:
      'Upload your media assets so we can build quickly:\n• Logos (horizontal + square)\n• Brand or product photos\n• Team photos\n• Before/after photos (if relevant)\n• Testimonials or review screenshots\n• Brochures/PDFs\n• Optional: Voice sample (if AI Voice selected)\n*Progress: Step 5 of 9*',
  },
  {
    id: 'REVIEW_AND_PAY_99',
    index: 6,
    title: 'Review & pay $99',
    prompt:
      'Here’s your summary:\n• Services selected: [list]\n• Kickoff deposit due now: **$[depositNow]**\n• Balance due after your approval: **$[balanceLater]**\nPay the deposit to reserve your slot — we’ll start immediately.\nYou’ll review everything before you pay the rest.\n*Progress: Step 6 of 9*',
  },
  {
    id: 'POSTPAY_SUCCESS',
    index: 7,
    title: 'Deposit confirmed',
    prompt:
      '🎉 You’re all set!\n• Your strategist will contact you within 24h\n• Copy outline hits in 1-2 days\n• Design mockups in 3-4 days\n• Launch review call before we go live\n*Progress: Step 7 of 9*',
  },
  {
    id: 'LAUNCH_APPROVAL',
    index: 8,
    title: 'Launch approval',
    prompt:
      'Time to review your build (website, ads, voice agent if selected).\nMake sure you’re thrilled.\nOnce you approve, we’ll send the final invoice and launch.\n*Progress: Step 8 of 9*',
  },
  {
    id: 'FINAL_INVOICE',
    index: 9,
    title: 'Final invoice',
    prompt:
      'Great work! Please settle your remaining balance of **$[balanceLater]**.\nAfter payment we mark the project complete, launch live, and hand off your dashboard.\nOptional: You’ll get a quick 1-minute feedback survey.\n*Progress: Step 9 of 9 – Done*',
  },
];

function ensureStepIndex(stepId: OnboardingStepId): number {
  const step = ONBOARDING_STEPS.find(s => s.id === stepId);
  if (!step) {
    throw new Error(`Unknown onboarding step: ${stepId}`);
  }
  return step.index;
}

function buildVoiceAgentConfig(existing?: Partial<VoiceAgentConfig> | null): VoiceAgentConfig {
  return {
    timezone: existing?.timezone ?? 'America/Los_Angeles',
    businessHours: existing?.businessHours ?? { dow: [1, 2, 3, 4, 5], start: '09:00', end: '17:00' },
    warmTransferNumber: existing?.warmTransferNumber,
    positiveIntentKeywords: existing?.positiveIntentKeywords ?? ['ready', 'start', 'quote', 'hire', 'book'],
    minConfidenceForTransfer: existing?.minConfidenceForTransfer ?? 0.65,
  };
}

function mapServices(serviceIds: ServiceKey[]): SelectedService[] {
  return serviceIds.map(id => {
    const definition = SERVICE_CATALOG[id];
    if (!definition) {
      throw new Error(`Unknown service: ${id}`);
    }

    const balanceDueLater = Math.max(definition.total - KICKOFF_DEPOSIT, 0);

    return {
      id: definition.id,
      label: definition.label,
      total: definition.total,
      deposit: KICKOFF_DEPOSIT,
      balanceDueLater,
      ongoingNote: definition.ongoingNote,
    } satisfies SelectedService;
  });
}

function calculateFinancials(selectedServices: SelectedService[]) {
  const depositNow = selectedServices.length * KICKOFF_DEPOSIT;
  const balanceLater = selectedServices.reduce((sum, service) => sum + service.balanceDueLater, 0);
  return { depositNow, balanceLater };
}

export interface OnboardingAgentSnapshot extends OnboardingState {
  prompt: string;
}

export class OnboardingAgent {
  private state: OnboardingState;

  constructor(projectId: string, initial?: Partial<OnboardingState>) {
    const startingStep = initial?.state ?? 'WELCOME';
    const selectedServices = initial?.selectedServices ?? [];
    const { depositNow, balanceLater } = calculateFinancials(selectedServices);

    this.state = {
      projectId,
      state: startingStep,
      currentStepIndex: ensureStepIndex(startingStep),
      totalSteps: ONBOARDING_STEPS.length,
      status: initial?.status ?? 'draft',
      selectedServices,
      depositNow,
      balanceLater,
      business: initial?.business,
      designSpecs: initial?.designSpecs,
      uploads: initial?.uploads ?? [],
      voiceAgent: initial?.voiceAgent ?? null,
      webhookQueue: initial?.webhookQueue ?? [],
    } satisfies OnboardingState;
  }

  getSnapshot(): OnboardingAgentSnapshot {
    const prompt = this.getPrompt();
    return {
      ...this.state,
      prompt,
    };
  }

  private getPrompt(): string {
    const step = ONBOARDING_STEPS.find(item => item.id === this.state.state);
    return step?.prompt ?? '';
  }

  private updateFinancials() {
    const { depositNow, balanceLater } = calculateFinancials(this.state.selectedServices);
    this.state.depositNow = depositNow;
    this.state.balanceLater = balanceLater;
  }

  private setStep(stepId: OnboardingStepId) {
    this.state.state = stepId;
    this.state.currentStepIndex = ensureStepIndex(stepId);
  }

  selectServices(serviceIds: ServiceKey[]) {
    this.state.selectedServices = mapServices(serviceIds);
    this.updateFinancials();

    if (serviceIds.includes('ai_voice_receptionist')) {
      this.state.voiceAgent = buildVoiceAgentConfig(this.state.voiceAgent ?? undefined);
    } else {
      this.state.voiceAgent = null;
    }

    this.setStep('BUSINESS_INFO');
  }

  setBusinessInfo(info: BusinessInfo) {
    this.state.business = info;
    this.setStep('DESIGN_SPECS');
  }

  setDesignSpecs(specs: DesignSpecs) {
    this.state.designSpecs = specs;
    this.setStep('MEDIA_UPLOAD');
  }

  recordUploads(assets: UploadAsset[]) {
    this.state.uploads = [...this.state.uploads, ...assets];
    if (assets.length > 0) {
      this.state.webhookQueue.push('assets.uploaded');
    }
    this.setStep('REVIEW_AND_PAY_99');
  }

  queueAdditionalUploadEvent() {
    this.state.webhookQueue.push('assets.uploaded');
  }

  setVoiceAgentConfig(config: Partial<VoiceAgentConfig>) {
    this.state.voiceAgent = buildVoiceAgentConfig(config);
  }

  reviewAndPayDeposit() {
    this.setStep('REVIEW_AND_PAY_99');
  }

  markDepositPaid() {
    this.state.status = 'deposit_paid';
    this.state.webhookQueue.push('deposit.paid');
    this.setStep('POSTPAY_SUCCESS');
  }

  advanceAfterDeposit() {
    this.setStep('POSTPAY_SUCCESS');
  }

  advanceToLaunchApproval() {
    this.setStep('LAUNCH_APPROVAL');
  }

  approveLaunch() {
    this.state.status = 'awaiting_final_invoice';
    this.state.webhookQueue.push('launch.approved');
    this.setStep('FINAL_INVOICE');
  }

  markFinalInvoicePaid() {
    this.state.status = 'complete';
    this.state.webhookQueue.push('final.paid');
  }

  toJSON(): OnboardingState {
    return { ...this.state, webhookQueue: [...this.state.webhookQueue] };
  }
}

export function createInitialAgent(projectId: string): OnboardingAgent {
  return new OnboardingAgent(projectId);
}
