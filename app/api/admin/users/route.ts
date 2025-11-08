import { NextRequest, NextResponse } from 'next/server';
import { createUser, listSafeUsers, requireAdminUser } from '@/lib/server/auth';

export async function GET() {
  try {
    await requireAdminUser();
    const users = await listSafeUsers();
    return NextResponse.json({ ok: true, users });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin users error', error);
    return NextResponse.json({ ok: false, message: 'Unable to load users.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const company = typeof body?.company === 'string' ? body.company.trim() : null;
    const role = body?.role === 'admin' ? 'admin' : 'client';

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, password, company, role });
    const users = await listSafeUsers();
    return NextResponse.json({ ok: true, user, users, message: 'User created.' });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message.includes('Email already registered')) {
      return NextResponse.json({ ok: false, message }, { status: 409 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin create user error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to create user.' }, { status: 500 });
  }
}
