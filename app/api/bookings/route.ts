import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const bookingSchema = z.object({
  slotId: z.string(),
  studentName: z.string().min(2),
  studentEmail: z.string().email(),
  goal: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking details' }, { status: 400 });
  }

  const { slotId, studentEmail, studentName, goal } = parsed.data;

  const slot = await prisma.slot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) {
    return NextResponse.json({ error: 'Slot unavailable' }, { status: 409 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const amountCents = Number(process.env.HOURLY_RATE_CENTS || '12000');

  const booking = await prisma.booking.create({
    data: {
      slotId,
      studentEmail,
      studentName,
      goal: goal || '',
      amountCents,
      status: 'PENDING'
    }
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tutoring session with Diana Tolu',
            description: '60-minute personal mathematics tutoring session'
          },
          unit_amount: amountCents
        },
        quantity: 1
      }
    ],
    customer_email: studentEmail,
    metadata: { bookingId: booking.id, slotId },
    success_url: `${siteUrl}/schedule?status=success`,
    cancel_url: `${siteUrl}/schedule?status=cancelled`
  });

  await prisma.booking.update({ where: { id: booking.id }, data: { checkoutId: session.id } });

  return NextResponse.json({ checkoutUrl: session.url });
}
