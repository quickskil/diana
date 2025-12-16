import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://diana-tolu.example.com'),
  title: {
    default: 'Diana Tolu — UCLA Mathematics Tutor',
    template: '%s — Diana Tolu Tutoring'
  },
  description:
    'Book one-on-one mathematics tutoring with Diana Tolu, UCLA mathematics student, IMO Silver Medalist, EGMO Gold Medalist, and Putnam Top 200 performer.',
  openGraph: {
    title: 'Diana Tolu — Personal Mathematics Tutor',
    description:
      'International medalist and UCLA mathematics student offering tailored tutoring sessions for Olympiad, university, and competition prep.',
    url: 'https://diana-tolu.example.com',
    siteName: 'Diana Tolu Tutoring',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diana Tolu — Personal Mathematics Tutor',
    description: 'Book dedicated one-on-one math tutoring with an IMO and EGMO medalist.'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
