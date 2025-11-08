import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/server/auth';
import {
  deletePaymentRequest,
  getPaymentRequestById,
  listPaymentRequests,
  updatePaymentRequest
} from '@/lib/server/payment-requests';

type Params = { params: { requestId: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));

    const updates: Parameters<typeof updatePaymentRequest>[1] = {};

    if (body?.projectId !== undefined) {
      updates.projectId = typeof body.projectId === 'string' ? body.projectId : null;
    }
    if (body?.currency !== undefined) {
      updates.currency = typeof body.currency === 'string' ? body.currency : undefined;
    }
    if (body?.description !== undefined) {
      updates.description = typeof body.description === 'string' ? body.description : null;
    }
    if (body?.status !== undefined) {
      const status = body.status;
      if (status === 'draft' || status === 'scheduled' || status === 'sent' || status === 'paid' || status === 'cancelled') {
        updates.status = status;
      }
    }
    if (body?.checkoutUrl !== undefined) {
      updates.checkoutUrl = typeof body.checkoutUrl === 'string' ? body.checkoutUrl : null;
    }
    if (body?.emailSubject !== undefined) {
      updates.emailSubject = typeof body.emailSubject === 'string' ? body.emailSubject : null;
    }
    if (body?.emailMessage !== undefined) {
      updates.emailMessage = typeof body.emailMessage === 'string' ? body.emailMessage : null;
    }
    if (body?.emailSent !== undefined) {
      updates.emailSent = Boolean(body.emailSent);
    }
    if (body?.amount !== undefined || body?.amountCents !== undefined) {
      const amountInput = body?.amountCents ?? body?.amount ?? 0;
      const numericAmount = Number(amountInput);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return NextResponse.json({ ok: false, message: 'Enter a valid amount greater than zero.' }, { status: 400 });
      }
      updates.amountCents = Math.round(body?.amountCents ? numericAmount : numericAmount * 100);
    }

    const updated = await updatePaymentRequest(params.requestId, updates);
    const requests = await listPaymentRequests();
    return NextResponse.json({ ok: true, request: updated, requests, message: 'Payment request updated.' });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message === 'Payment request not found.') {
      return NextResponse.json({ ok: false, message }, { status: 404 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin update payment request error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to update payment request.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAdminUser();
    const existing = await getPaymentRequestById(params.requestId);
    if (!existing) {
      return NextResponse.json({ ok: false, message: 'Payment request not found.' }, { status: 404 });
    }
    await deletePaymentRequest(params.requestId);
    const requests = await listPaymentRequests();
    return NextResponse.json({ ok: true, requests, message: 'Payment request deleted.' });
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
    console.error('Admin delete payment request error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to delete payment request.' }, { status: 500 });
  }
}
