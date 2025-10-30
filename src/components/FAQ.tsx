// src/components/FAQ.tsx
'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarCheck, ChevronDown } from 'lucide-react';
import Script from 'next/script';

type QA = { q: string; a: string; id?: string };

const faqs: QA[] = [
  {
    q: 'How do the voice agents book calls?',
    a: 'We embed a scheduler inline or use a popup widget so calls are booked without leaving your page. The agent can propose times, confirm details, and create the event.',
    id: 'booking',
  },
  {
    q: 'What’s a warm transfer?',
    a: 'The agent qualifies the caller, consults briefly with your teammate, then bridges everyone on a short conference so context is shared before the AI drops (consult → bridge).',
    id: 'warm-transfer',
  },
  {
    q: 'Do you replace my team?',
    a: 'No. Agents handle routine calls 24/7 and escalate when needed. During open hours we warm-transfer to your team; after-hours we schedule—so you never miss a lead.',
    id: 'replace-team',
  },
  {
    q: 'What do you actually ship first?',
    a: 'We start with a fast, conversion-first website and clean analytics. Then we align Search/PMAX and Meta to the right landing pages. Finally, we add the voice agent.',
    id: 'what-we-ship',
  },
  {
    q: 'Which schedulers and CRMs do you support?',
    a: 'Common picks are Cal.com, Calendly (if you must), or HubSpot scheduling. CRM handoffs typically go to HubSpot, Pipedrive, or Salesforce via webhook/API.',
    id: 'integrations',
  },
  {
    q: 'How fast can we go live?',
    a: 'MVP websites often go live in 2–3 weeks, ads in 3–5 days after creative, and the voice agent in under a week once we have call flows and integrations.',
    id: 'timeline',
  },
  {
    q: 'How do you handle privacy and security?',
    a: 'We minimize data capture, redact sensitive fields where possible, and pass only what your systems need. Access is scoped by role and tokens; call recordings are optional.',
    id: 'privacy',
  },
];

export default function FAQ() {
  const reduce = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Allow deep-linking: /page#faq-warm-transfer opens that item
  useEffect(() => {
    const hash = (typeof window !== 'undefined' && window.location.hash.replace('#', '')) || '';
    if (!hash) return;
    const idx = faqs.findIndex((f) => `faq-${f.id ?? slugify(f.q)}` === hash);
    if (idx >= 0) setOpen(idx);
  }, []);

  // Smooth scroll the opened item into view (respect reduced motion)
  useEffect(() => {
    if (open == null) return;
    const el = document.getElementById(`faq-panel-${open}`);
    if (!el) return;
    el.parentElement?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, [open, reduce]);

  // JSON-LD (FAQPage) for rich results
  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };
  }, []);

  return (
    <section className="section" aria-labelledby={`${uid}-title`}>
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container space-y-6" ref={containerRef}>
        <h2 id={`${uid}-title`}>FAQ</h2>

        <div className="radiant-card" role="presentation">
          <div className="card p-2 divide-y divide-white/10" role="list">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const contentId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            const hashId = `faq-${item.id ?? slugify(item.q)}`;

            return (
              <div key={item.q} id={hashId} className="py-2" role="listitem">
                {/* Visible button acts as the heading control (APG disclosure pattern) */}
                <button
                  id={buttonId}
                  className="accordion-q w-full text-left py-3 focus:outline-none flex items-center justify-between gap-3"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-medium">{item.q}</span>
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="opacity-70" />
                  </motion.span>
                </button>

                {/* Panel */}
                <motion.div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={false}
                  animate={isOpen ? 'open' : 'closed'}
                  variants={{
                    open: { height: 'auto', opacity: 1 },
                    closed: { height: 0, opacity: 0 },
                  }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className="overflow-hidden pr-2"
                >
                  <div className="accordion-a pb-4 text-white/80 text-sm">
                    {item.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <a href="/contact" className="btn inline-flex items-center gap-2">
            <CalendarCheck className="size-4" aria-hidden />
            Still have questions? Book a Call
          </a>
        </div>
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
