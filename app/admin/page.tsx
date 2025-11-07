import type { Metadata } from 'next';
import AdminView from './admin-view';

export const metadata: Metadata = {
  title: 'Admin control centre',
  description: 'Review onboarding submissions and monitor every Cal.com event across accounts.'
};

export default function AdminPage() {
  return <AdminView />;
}
