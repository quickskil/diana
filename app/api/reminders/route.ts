import { NextResponse } from 'next/server';
import { isBefore } from '@/lib/date-utils';
import { prisma, Booking, Reminder, Slot } from '@/lib/prisma';
import { reminderTemplate, sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  const cronKey = request.headers.get('x-cron-key');
  if (!cronKey || cronKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pending = (await prisma.reminder.findMany({
    where: { sent: false },
    include: { booking: { include: { slot: true } } }
  })) as (Reminder & { booking: Booking & { slot: Slot } })[];

  type ReminderWithBooking = Reminder & { booking: Booking & { slot: Slot } };

  const due = pending.filter((reminder: ReminderWithBooking) => isBefore(reminder.sendAt, new Date()));
  let sentCount = 0;

  for (const reminder of due) {
    await sendEmail(
      reminder.booking.studentEmail,
      'Reminder: upcoming tutoring session with Diana Tolu',
      reminderTemplate(reminder.booking.studentName, reminder.booking.slot.start.toLocaleString())
    );
    await prisma.reminder.update({ where: { id: reminder.id }, data: { sent: true } });
    sentCount += 1;
  }

  return NextResponse.json({ sent: sentCount, pending: pending.length });
}
