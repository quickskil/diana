export const DEFAULT_SCHEDULER_URL =
  'https://cal.com/business-booster/30min';

const schedulerUrl =
  process.env.NEXT_PUBLIC_CAL_URL ||
  process.env.CAL_URL ||
  process.env.NEXT_PUBLIC_CALCOM_URL ||
  process.env.CALCOM_URL ||
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  process.env.CALENDLY_URL ||
  DEFAULT_SCHEDULER_URL;

export function getSchedulerUrl() {
  return schedulerUrl;
}

export function toEmbedUrl(base: string, options?: { theme?: 'dark' | 'light'; layout?: string }) {
  const { theme = 'dark', layout = 'month_view' } = options || {};
  try {
    const url = new URL(base);
    if (url.hostname.endsWith('cal.com') && !url.pathname.startsWith('/embed')) {
      url.pathname = `/embed${url.pathname}`.replace(/\/\/+/g, '/');
    }
    url.searchParams.set('embed', 'true');
    if (theme) url.searchParams.set('theme', theme);
    if (layout) url.searchParams.set('layout', layout);
    return url.toString();
  } catch {
    const params = new URLSearchParams({ embed: 'true' });
    if (theme) params.set('theme', theme);
    if (layout) params.set('layout', layout);
    return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`;
  }
}

export function extractCalLink(base: string) {
  try {
    const url = new URL(base);
    if (!url.hostname.endsWith('cal.com')) return null;
    const path = url.pathname.replace(/^\/+/, '');
    return path || null;
  } catch {
    return null;
  }
}
