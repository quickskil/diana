'use client';
import { motion } from 'motion/react';
import { CalendarCheck } from 'lucide-react';

const tiers = [
  { name: 'Starter', price: '$1,500', bullets: ['1 landing page', 'Meta or Google Ads setup', 'Basic analytics'], cta: '#book' },
  { name: 'Growth', price: '$3,500', bullets: ['Website (up to 5 pages)', 'Meta + Google Ads', 'Funnels + testing', 'AI receptionist (1 line)'], cta: '#book' },
  { name: 'Scale', price: 'Custom', bullets: ['Custom site', 'Full-funnel paid media', 'AI voice agents (multi-line)', 'CRO program'], cta: '#book' }
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
