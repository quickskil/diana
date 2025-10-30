import { getSchedulerUrl, toEmbedUrl } from '@/lib/scheduler';

export default function CalComBlock() {
  const baseUrl = getSchedulerUrl();
  const embedUrl = toEmbedUrl(baseUrl);

  return (
    <section id="book" className="section">
      <div className="container space-y-6">
        <h2>Book a discovery call</h2>
        <div className="radiant-card">
          <div className="card p-2">
            <iframe
              src={embedUrl}
              title="Schedule time with Business Booster AI"
              className="w-full rounded-xl border-0"
              style={{ minHeight: '680px' }}
              allow="camera *; microphone *; fullscreen; autoplay"
              loading="lazy"
            />
          </div>
        </div>
        <p className="text-xs text-white/50">
          Powered by{' '}
          <a
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Cal.com
          </a>
        </p>
      </div>
    </section>
  );
}
