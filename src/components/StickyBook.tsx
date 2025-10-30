// src/components/StickyBook.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { extractCalLink, getSchedulerUrl } from '@/lib/scheduler';

declare global {
  interface Window {
    Cal?: (...args: any[]) => void;
  }
}

let calScriptPromise: Promise<void> | null = null;

function loadCalComScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Cal) return Promise.resolve();
  if (calScriptPromise) return calScriptPromise;

  calScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-calcom-embed]');
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => {
          calScriptPromise = null;
          reject(new Error('Failed to load Cal.com embed'));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.dataset.calcomEmbed = 'true';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    });
    script.addEventListener('error', () => {
      calScriptPromise = null;
      reject(new Error('Failed to load Cal.com embed'));
    });
    document.head.appendChild(script);
  });

  return calScriptPromise;
}

type Props = {
  /** CSS selector to observe; button appears once this is mostly off-screen */
  watch?: string;
  /** Accessible label (tooltip/title + screen readers) */
  label?: string;
  /** Optional UTM string (no leading ?) */
  utm?: string;
  /** Where to place the FAB: "br" | "bl" (bottom-right / bottom-left) */
  position?: 'br' | 'bl';
};

export default function StickyBook({
  watch = '#hero',
  label = 'Book a Strategy Call',
  utm = 'utm_source=site&utm_medium=fab&utm_campaign=sticky',
  position = 'br',
}: Props) {
  const base = getSchedulerUrl();

  const url = useMemo(() => {
    if (!utm) return base;
    return base + (base.includes('?') ? '&' : '?') + utm;
  }, [base, utm]);

  const [show, setShow] = useState(false);

  // Respect reduced motion
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  useEffect(() => {
    const target = document.querySelector(watch);
    if (!target || !('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // Show FAB when the watched element is < 15% visible (user has scrolled past hero)
        setShow(e.intersectionRatio < 0.15);
      },
      { threshold: [0, 0.15, 1] }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [watch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadCalComScript()
      .then(() => {
        try {
          window.Cal?.('init', { origin: 'https://app.cal.com' });
        } catch {
          /* noop */
        }
      })
      .catch(() => {
        /* embed script optional */
      });
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const fallback = () => window.open(url, '_blank', 'noopener,noreferrer');

    loadCalComScript()
      .then(() => {
        try {
          const calLink = extractCalLink(base);
          if (window.Cal && calLink) {
            window.Cal('popup', {
              calLink,
              config: {
                layout: 'month_view',
                theme: 'dark',
              },
            });
            return;
          }
        } catch {
          // swallow and use fallback
        }
        fallback();
      })
      .catch(fallback);
  }

  const sideClass =
    position === 'bl'
      ? 'left-4 sm:left-6'
      : 'right-4 sm:right-6';

  return (
    <div
      className={`fixed ${sideClass} bottom-4 sm:bottom-6 z-50 pointer-events-none`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
      aria-live="polite"
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={handleClick}
        className="pointer-events-auto group relative inline-flex items-center justify-center h-12 w-12 rounded-full text-white shadow-lg border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,58,237,.96), rgba(96,165,250,.9), rgba(52,211,153,.9))',
          transform: show ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
          opacity: show ? 1 : 0,
          transition: reduce
            ? 'none'
            : 'transform 260ms cubic-bezier(.2,.8,.2,1), opacity 260ms ease',
        }}
      >
        {/* Icon */}
        <Calendar className="h-5 w-5" aria-hidden />

        {/* Hover tooltip (no JS; hidden on touch) */}
        <span
          className="absolute -top-2 -translate-y-full whitespace-nowrap rounded-md px-2 py-1 text-xs bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"
          style={{ right: position === 'br' ? 0 : 'auto', left: position === 'bl' ? 0 : 'auto' }}
        >
          {label}
        </span>

        {/* Gentle pulse to draw attention once (reduced-motion safe) */}
        {!reduce && show && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-[ping_1.8s_ease-out_1] bg-white/20"
          />
        )}
      </button>
    </div>
  );
}
