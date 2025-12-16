import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureBaseAvailability } from '@/lib/slots';

type SlotPayload = { start?: unknown; end?: unknown };

const parseSlotPayload = (body: SlotPayload) => {
  if (typeof body.start !== 'string' || typeof body.end !== 'string') {
    return { success: false as const };
  }

  return { success: true as const, data: { start: body.start, end: body.end } };
};

export async function GET() {
  await ensureBaseAvailability();
  const slots = await prisma.slot.findMany({ where: { isBooked: false }, orderBy: { start: 'asc' } });
  return NextResponse.json({ slots });
}

export async function POST(request: Request) {
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = parseSlotPayload(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { start, end } = parsed.data;
  const slot = await prisma.slot.create({ data: { start: new Date(start), end: new Date(end) } });
  return NextResponse.json({ slot }, { status: 201 });
}
