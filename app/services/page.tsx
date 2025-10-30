
import ServicesGrid from '@/components/ServicesGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Websites, Ads, Funnels, and AI Voice Agents'
};

export default function Page() {
  return <ServicesGrid />;
}
