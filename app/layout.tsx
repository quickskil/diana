
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StickyBook from '@/components/StickyBook';

export const metadata: Metadata = {
  title: { template: '%s — Business Booster AI', default: 'Business Booster AI — Futuristic Growth Agency' },
  description: 'Websites, Meta Ads, Google Ads, funnels, and AI voice receptionists.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        <StickyBook />
      </body>
    </html>
  );
}
