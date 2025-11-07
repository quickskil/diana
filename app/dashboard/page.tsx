import type { Metadata } from 'next';
import DashboardView from './dashboard-view';

export const metadata: Metadata = {
  title: 'Client dashboard',
  description: 'Complete onboarding, review plan guidance, and sync your Cal.com bookings.'
};

export default function DashboardPage() {
  return <DashboardView />;
}
