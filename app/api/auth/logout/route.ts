import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/server/auth';

export async function POST() {
  try {
    await clearSessionCookie();
  } catch (error) {
    console.error('Logout error', error);
  }
  return NextResponse.json({ ok: true });
}
