import { NextRequest, NextResponse } from 'next/server';
import { createSession, createUser, listSafeUsers } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name ?? '').toString().trim();
    const email = (body?.email ?? '').toString().trim().toLowerCase();
    const password = (body?.password ?? '').toString();
    const company = body?.company ? body.company.toString().trim() : null;

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, message: 'Please complete all required fields.' }, { status: 400 });
    }

    const user = await createUser({ name, email, password, company });
    await createSession(user.id);

    const payload: Record<string, unknown> = { ok: true, user, message: 'Account created.' };
    if (user.role === 'admin') {
      payload.users = await listSafeUsers();
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = (error as Error).message;
    if (message.toLowerCase().includes('already')) {
      return NextResponse.json({ ok: false, message: 'That email is already registered.' }, { status: 400 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Registration error', error);
    return NextResponse.json({ ok: false, message: 'Unable to create the account right now.' }, { status: 500 });
  }
}
