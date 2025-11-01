'use client';
import { motion } from 'motion/react';
import { CalendarCheck } from 'lucide-react';

const tiers = [
  {
    name: 'Launch',
    price: '$499 setup',
    sub: 'Hosting & care $25/mo',
    bullets: [
      'Conversion-ready one-page site with booking',
      'Copy, proof, and offer aligned to convert',
      'Speed, analytics, and handoff handled for you',
    ],
    cta: '#book',
  },
  {
    name: 'Launch + Traffic',
    price: '$1,500 setup',
    sub: 'Ongoing: 10% of ad spend (no retainer)',
    bullets: [
      'Google & Meta campaigns matched to the page',
      'Weekly trims, insights, and budget protection',
      'Transparent fees — every dollar accounted for',
    ],
    cta: '#book',
  },
  {
    name: 'Full Funnel Automation',
    price: '$2,900 setup',
    sub: 'AI receptionist from $99/mo',
    bullets: [
      'Everything in Launch + Traffic',
      '24/7 AI voice agent with warm transfers',
      'Lead follow-up, summaries, and CRM sync',
    ],
    cta: '#book',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container space-y-10">
        <h2 className="text-center">Transparent pricing</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t, i)=>(
            <motion.div
              key={t.name}
              className="radiant-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card p-6 flex flex-col gap-4">
                <div className="text-white/60">{t.name}</div>
                <div className="text-4xl font-extrabold">{t.price}</div>
                {t.sub && <div className="text-xs text-white/55">{t.sub}</div>}
                <ul className="text-white/70 space-y-2 list-disc list-inside">
                  {t.bullets.map(b=><li key={b}>{b}</li>)}
                </ul>
                <a href={t.cta} className="btn mt-auto inline-flex items-center gap-2">
                  <CalendarCheck className="size-4" aria-hidden />
                  Book a Call
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
