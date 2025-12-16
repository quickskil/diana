import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import Script from 'next/script';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dianatolu.com';
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Diana Tolu — UCLA Mathematics Tutor',
    template: '%s — Diana Tolu Tutoring'
  },
  description:
    'Book one-on-one mathematics tutoring with Diana Tolu, UCLA mathematics student, IMO Silver Medalist, EGMO medalist, and Putnam Top 200 performer.',
  openGraph: {
    title: 'Diana Tolu — Personal Mathematics Tutor',
    description:
      'International medalist and UCLA mathematics student offering tailored tutoring sessions for Olympiad, university, and competition prep.',
    url: siteUrl,
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
      <body className="text-slate-50">
        <Nav />
        <main>{children}</main>
        <Footer />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
