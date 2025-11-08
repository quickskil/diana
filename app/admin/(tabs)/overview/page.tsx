import type { Metadata } from 'next';
import OverviewPanel from './overview-panel';

export const metadata: Metadata = {
  title: 'Admin — Overview',
  description: 'Pulse-check the entire Business Booster operation from a single view.'
};

export default function OverviewPage() {
  return <OverviewPanel />;
}

