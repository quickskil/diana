import type { Metadata } from 'next';
import OnboardingDashboard from './onboarding-dashboard';

export const metadata: Metadata = {
  title: 'Admin — Onboarding',
  description: 'Review submissions, update statuses, and align every stakeholder on the rollout plan.'
};

export default function OnboardingPage() {
  return <OnboardingDashboard />;
}

