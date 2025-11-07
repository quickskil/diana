import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser, updateUserAccount } from '@/lib/server/auth';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = await request.json();

    const updated = await updateUserAccount(user.id, {
      name: body?.name,
      company: body?.company,
      email: body?.email,
      newPassword: body?.newPassword,
      currentPassword: body?.currentPassword
    });

    return NextResponse.json({ ok: true, user: updated, message: 'Account updated.' });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please sign in again.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Access denied.' }, { status: 403 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    const status = /password|email|required|name|deposit/i.test(message) ? 400 : 500;
    console.error('Account update error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to update account.' }, { status });
  }
}
