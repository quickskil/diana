import { NextResponse } from 'next/server';
import { prisma, Booking, Slot } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { bookingConfirmationTemplate, receiptTemplate, sendEmail } from '@/lib/email';
import { subHours } from '@/lib/date-utils';

type CheckoutSession = {
  metadata?: Record<string, string>;
  payment_intent?: string | null;
};

type PaymentIntent = {
  metadata?: Record<string, string>;
};

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  let event: { type: string; data: { object: unknown } };
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as CheckoutSession;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const booking = (await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentIntentId: session.payment_intent?.toString() || null
      },
      include: { slot: true }
    })) as Booking & { slot: Slot };

    await prisma.slot.update({ where: { id: booking.slotId }, data: { isBooked: true } });

    const startIso = booking.slot.start.toISOString();
    const endIso = booking.slot.end.toISOString();

    await prisma.reminder.create({
      data: {
        bookingId: booking.id,
        sendAt: subHours(booking.slot.start, 24),
        sent: false
      }
    });

    await sendEmail(
      booking.studentEmail,
      'Your tutoring session is confirmed',
      bookingConfirmationTemplate(
        booking.studentName,
        new Date(startIso).toLocaleString(),
        new Date(endIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    );

    await sendEmail(
      booking.studentEmail,
      'Receipt for your tutoring session',
      receiptTemplate(booking.studentName, booking.amountCents)
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as PaymentIntent;
    const bookingId = intent.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
    }
  }

  return NextResponse.json({ received: true });
}
