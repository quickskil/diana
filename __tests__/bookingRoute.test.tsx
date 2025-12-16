import { POST } from '@/app/api/bookings/route';

describe('booking API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, STRIPE_SECRET_KEY: 'sk_test', HOURLY_RATE_CENTS: '12000' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 400 for invalid payload', async () => {
    const response = await POST(new Request('http://test', { method: 'POST', body: JSON.stringify({}) }));
    expect(response.status).toBe(400);
  });

  it('creates a checkout session when slot available', async () => {
    const mockSlot = { id: 'slot-1', isBooked: false } as any;
    const mockBooking = {
      id: 'booking-1',
      slotId: 'slot-1',
      studentEmail: 'test@example.com',
      studentName: 'Test',
      goal: '',
      amountCents: 12000,
      status: 'PENDING'
    } as any;

    const mockSession = { id: 'sess_123', url: 'https://checkout.stripe.com/session/123' } as any;

    jest.spyOn(require('@/lib/prisma'), 'prisma', 'get').mockReturnValue({
      slot: { findUnique: jest.fn().mockResolvedValue(mockSlot) },
      booking: {
        create: jest.fn().mockResolvedValue(mockBooking),
        update: jest.fn().mockResolvedValue(mockBooking)
      }
    });

    jest.spyOn(require('@/lib/stripe'), 'stripe', 'get').mockReturnValue({
      checkout: { sessions: { create: jest.fn().mockResolvedValue(mockSession) } }
    });

    const response = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({
          slotId: 'slot-1',
          studentName: 'Tester',
          studentEmail: 'test@example.com',
          goal: 'Focus'
        })
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.checkoutUrl).toBe(mockSession.url);
  });
});
