import { NextRequest, NextResponse } from 'next/server';
import { adminDeleteUser, adminUpdateUser, listSafeUsers, requireAdminUser } from '@/lib/server/auth';

type RouteContext = { params: Promise<{ userId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const { userId } = await context.params;

    const user = await adminUpdateUser(userId, {
      name: typeof body?.name === 'string' ? body.name : undefined,
      email: typeof body?.email === 'string' ? body.email : undefined,
      company: typeof body?.company === 'string' ? body.company : undefined,
      role: body?.role === 'admin' ? 'admin' : body?.role === 'client' ? 'client' : undefined
    });
    const users = await listSafeUsers();
    return NextResponse.json({ ok: true, user, users, message: 'User updated.' });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message === 'User not found.') {
      return NextResponse.json({ ok: false, message }, { status: 404 });
    }
    if (message.includes('already in use')) {
      return NextResponse.json({ ok: false, message }, { status: 409 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin update user error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to update user.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdminUser();
    const { userId } = await context.params;

    await adminDeleteUser(userId);
    const users = await listSafeUsers();
    return NextResponse.json({ ok: true, users, message: 'User deleted.' });
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
    console.error('Admin delete user error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to delete user.' }, { status: 500 });
  }
}
