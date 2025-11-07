import { NextRequest, NextResponse } from 'next/server';
import { createSession, listSafeUsers, verifyUserCredentials } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email ?? '').toString().trim();
    const password = (body?.password ?? '').toString();

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'Please provide your email and password.' }, { status: 400 });
    }

    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Invalid login details.' }, { status: 401 });
    }

    await createSession(user.id);

    const payload: Record<string, unknown> = { ok: true, user, message: 'Logged in.' };
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
    console.error('Login error', error);
    return NextResponse.json({ ok: false, message: 'Unable to log in right now.' }, { status: 500 });
  }
}
