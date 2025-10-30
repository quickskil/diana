'use client';
import { useEffect } from 'react';

export default function CalendlyBlock() {
  useEffect(()=>{
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return ()=>{ document.body.removeChild(script); };
  }, []);

  const url = process.env.NEXT_PUBLIC_CALENDLY_URL || process.env.CALENDLY_URL || 'https://calendly.com/your-handle/intro-call';
  return (
    <section id="book" className="section">
      <div className="container space-y-6">
        <h2>Book a discovery call</h2>
        <div className="card p-2">
          <div className="calendly-inline-widget" data-url={url} style={{minWidth: '320px', height: '680px'}} />
        </div>
      </div>
    </section>
  );
}
