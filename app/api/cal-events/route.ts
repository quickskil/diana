import { NextRequest, NextResponse } from 'next/server';

interface CalAttendee {
  name?: string;
  email?: string;
}

interface CalEvent {
  id: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  organizer?: string;
  location?: string;
  attendees?: CalAttendee[];
  bookingUrl?: string;
  description?: string;
  [key: string]: unknown;
}

const SAMPLE_EVENTS: CalEvent[] = [
  {
    id: 'sample-1',
    title: 'Strategy call — Launch plan',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'confirmed',
    organizer: 'Business Booster AI',
    location: 'Cal.com video room',
    bookingUrl: 'https://cal.com/business-booster-ai/30min',
    attendees: [{ name: 'Demo Prospect', email: 'prospect@example.com' }],
    description: 'Sample data shown until you add a CALCOM_API_KEY environment variable.'
  },
  {
    id: 'sample-2',
    title: 'Ads + AI follow-up review',
    startTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    status: 'pending',
    organizer: 'Business Booster AI',
    location: 'Zoom',
    bookingUrl: 'https://cal.com/business-booster-ai/45min',
    attendees: [{ name: 'Automation Team', email: 'team@businessbooster.ai' }],
    description: 'Illustrative placeholder to visualise the admin event list.'
  }
];

const CALCOM_API_URL = process.env.CALCOM_API_URL || 'https://api.cal.com/v1';
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;

function normaliseEvents(payload: unknown): CalEvent[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as CalEvent[];
  if (typeof payload === 'object' && payload !== null) {
    const maybe = (payload as Record<string, unknown>);
    if (Array.isArray(maybe.data)) return maybe.data as CalEvent[];
    if (Array.isArray(maybe.bookings)) return maybe.bookings as CalEvent[];
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const attendeeEmail = searchParams.get('email')?.toLowerCase();

  if (!CALCOM_API_KEY) {
    const filtered = attendeeEmail
      ? SAMPLE_EVENTS.filter(event => event.attendees?.some(a => a.email?.toLowerCase() === attendeeEmail))
      : SAMPLE_EVENTS;
    return NextResponse.json({ ok: true, events: filtered, sample: true });
  }

  try {
    const res = await fetch(`${CALCOM_API_URL.replace(/\/$/, '')}/bookings`, {
      headers: {
        Authorization: `Bearer ${CALCOM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Cal.com responded with status ${res.status}`);
    }

    const raw = await res.json();
    const events = normaliseEvents(raw);
    const filtered = attendeeEmail
      ? events.filter(event => event.attendees?.some(a => a.email?.toLowerCase() === attendeeEmail))
      : events;

    return NextResponse.json({ ok: true, events: filtered, sample: false });
  } catch (error) {
    console.error('Failed to load Cal.com events', error);
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
