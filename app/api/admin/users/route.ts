import { NextResponse } from 'next/server';
import { listSafeUsers, requireAdminUser } from '@/lib/server/auth';

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
