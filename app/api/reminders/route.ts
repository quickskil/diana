import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { reminderTemplate, sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  const cronKey = request.headers.get('x-cron-key');
  if (!cronKey || cronKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pending = await prisma.reminder.findMany({
    where: { sent: false },
    include: { booking: { include: { slot: true } } }
  });

  const due = pending.filter((reminder) => isBefore(reminder.sendAt, new Date()));
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
