import { NextResponse } from 'next/server';
import { getSessionUser, listSafeUsers } from '@/lib/server/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: true, user: null });
    }
    const payload: Record<string, unknown> = { ok: true, user };
    if (user.role === 'admin') {
      payload.users = await listSafeUsers();
    }
    return NextResponse.json(payload);
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Session error', error);
    return NextResponse.json({ ok: false, message: 'Unable to load session.' }, { status: 500 });
  }
}
