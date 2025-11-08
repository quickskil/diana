import type { Metadata } from 'next';
import PaymentsDashboard from './payments-dashboard';

export const metadata: Metadata = {
  title: 'Admin — Payments',
  description: 'Monitor deposits, send final balances, and keep billing conversations organised.'
};

export default function PaymentsPage() {
  return <PaymentsDashboard />;
}

