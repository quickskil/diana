import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    include: { slot: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({
    bookings: bookings.map((booking) => ({
      id: booking.id,
      studentName: booking.studentName,
      studentEmail: booking.studentEmail,
      goal: booking.goal,
      status: booking.status,
      start: booking.slot.start,
      end: booking.slot.end
    }))
  });
}
