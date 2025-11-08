'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { SafeUser } from '@/lib/types/user';
import type { PaymentRecord, PaymentRequest } from '@/lib/types/payments';

export interface CalAttendee {
  name?: string;
  email?: string;
}

export interface CalEvent {
  id: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  organizer?: string;
  location?: string;
  attendees?: CalAttendee[];
  bookingUrl?: string;
  description?: string;
}

type GateState = 'checking' | 'redirecting' | 'ready';

interface AdminContextValue {
  gateState: GateState;
  currentUser: SafeUser | null;
  users: SafeUser[];
  clients: SafeUser[];
  createUser: (payload: {
    name: string;
    email: string;
    password: string;
    company?: string;
    role?: SafeUser['role'];
  }) => Promise<{ ok: boolean; message?: string }>;
  updateUser: (
    userId: string,
    payload: { name?: string; email?: string; company?: string | null; role?: SafeUser['role'] }
  ) => Promise<{ ok: boolean; message?: string }>;
  deleteUser: (userId: string) => Promise<{ ok: boolean; message?: string }>;
  sendUserEmail: (
    userId: string,
    payload: { subject: string; message: string }
  ) => Promise<{ ok: boolean; message?: string; sample?: boolean }>;
  updateOnboardingStatus: ReturnType<typeof useAuth>['updateOnboardingStatus'];
  events: CalEvent[];
  eventsLoading: boolean;
  eventsError: string | null;
  usingSampleEvents: boolean;
  refreshEvents: () => Promise<void>;
  payments: PaymentRecord[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  paymentsSample: boolean;
  refreshPayments: () => Promise<void>;
  paymentRequests: PaymentRequest[];
  paymentRequestsLoading: boolean;
  paymentRequestsError: string | null;
  paymentRequestsSample: boolean;
  refreshPaymentRequests: () => Promise<void>;
  createPaymentRequest: (payload: {
    userId: string;
    projectId?: string | null;
    amount: number;
    currency?: string;
    description?: string;
    generateCheckout?: boolean;
  }) => Promise<{ ok: boolean; message?: string; sample?: boolean; request?: PaymentRequest }>;
  updatePaymentRequest: (
    requestId: string,
    payload: Partial<{
      amount: number;
      currency: string;
      description: string | null;
      status: PaymentRequest['status'];
      checkoutUrl: string | null;
      emailSubject: string | null;
      emailMessage: string | null;
    }>
  ) => Promise<{ ok: boolean; message?: string; request?: PaymentRequest }>;
  deletePaymentRequest: (requestId: string) => Promise<{ ok: boolean; message?: string }>;
  sendPaymentRequestEmail: (
    requestId: string,
    payload: { subject: string; message: string; includeLink?: boolean }
  ) => Promise<{ ok: boolean; message?: string; sample?: boolean; request?: PaymentRequest }>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hydrated, currentUser, users: authUsers, updateOnboardingStatus } = useAuth();

  const [gateState, setGateState] = useState<GateState>('checking');
  const [managedUsers, setManagedUsers] = useState<SafeUser[]>([]);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleEvents, setUsingSampleEvents] = useState(false);

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsSample, setPaymentsSample] = useState(false);

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentRequestsLoading, setPaymentRequestsLoading] = useState(false);
  const [paymentRequestsError, setPaymentRequestsError] = useState<string | null>(null);
  const [paymentRequestsSample, setPaymentRequestsSample] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      setGateState('redirecting');
      router.replace('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      setGateState('redirecting');
      router.replace('/dashboard');
      return;
    }
    setGateState('ready');
  }, [currentUser, hydrated, router]);

  useEffect(() => {
    setManagedUsers(authUsers);
  }, [authUsers]);

  const clients = useMemo(() => managedUsers.filter(user => user.role === 'client'), [managedUsers]);

  const refreshEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await fetch('/api/cal-events', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'Unable to load events from Cal.com');
      }
      setEvents(Array.isArray(data.events) ? data.events : []);
      setUsingSampleEvents(Boolean(data.sample));
    } catch (error) {
      setEventsError((error as Error).message);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const refreshPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const res = await fetch('/api/admin/payments', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to load payments.');
      }
      setPayments(Array.isArray(data.payments) ? data.payments : []);
      setPaymentsSample(Boolean(data.sample));
    } catch (error) {
      setPaymentsError((error as Error).message);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const refreshPaymentRequests = useCallback(async () => {
    setPaymentRequestsLoading(true);
    setPaymentRequestsError(null);
    try {
      const res = await fetch('/api/admin/payment-requests', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to load payment requests.');
      }
      setPaymentRequests(Array.isArray(data.requests) ? data.requests : []);
      setPaymentRequestsSample(Boolean(data.sample));
    } catch (error) {
      setPaymentRequestsError((error as Error).message);
    } finally {
      setPaymentRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gateState !== 'ready') return;
    void refreshEvents();
    void refreshPayments();
    void refreshPaymentRequests();
  }, [gateState, refreshEvents, refreshPayments, refreshPaymentRequests]);

  const createUser = useCallback<AdminContextValue['createUser']>(async payload => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to create user.' };
      }
      if (Array.isArray(data.users)) {
        setManagedUsers(data.users);
      }
      return { ok: true, message: data.message || 'User created.' };
    } catch (error) {
      console.error('createUser failed', error);
      return { ok: false, message: 'Unable to create user.' };
    }
  }, []);

  const updateUser = useCallback<AdminContextValue['updateUser']>(async (userId, payload) => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to update user.' };
      }
      if (Array.isArray(data.users)) {
        setManagedUsers(data.users);
      }
      return { ok: true, message: data.message || 'User updated.' };
    } catch (error) {
      console.error('updateUser failed', error);
      return { ok: false, message: 'Unable to update user.' };
    }
  }, []);

  const deleteUser = useCallback<AdminContextValue['deleteUser']>(async userId => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to delete user.' };
      }
      if (Array.isArray(data.users)) {
        setManagedUsers(data.users);
      }
      return { ok: true, message: data.message || 'User deleted.' };
    } catch (error) {
      console.error('deleteUser failed', error);
      return { ok: false, message: 'Unable to delete user.' };
    }
  }, []);

  const sendUserEmail = useCallback<AdminContextValue['sendUserEmail']>(async (userId, payload) => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to send email.' };
      }
      return { ok: true, message: data.message || 'Email sent.', sample: Boolean(data.sample) };
    } catch (error) {
      console.error('sendUserEmail failed', error);
      return { ok: false, message: 'Unable to send email.' };
    }
  }, []);

  const createPaymentRequestAction = useCallback<AdminContextValue['createPaymentRequest']>(async payload => {
    try {
      const res = await fetch('/api/admin/payment-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: payload.userId,
          projectId: payload.projectId ?? null,
          amount: payload.amount,
          currency: payload.currency,
          description: payload.description,
          generateCheckout: payload.generateCheckout ?? true
        })
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to create payment request.' };
      }
      if (Array.isArray(data.requests)) {
        setPaymentRequests(data.requests);
      } else if (data.request) {
        setPaymentRequests(prev => {
          const others = prev.filter(item => item.id !== data.request.id);
          return [data.request, ...others];
        });
      }
      if (data.sample) {
        setPaymentRequestsSample(true);
      }
      return {
        ok: true,
        message: data.message || 'Payment request created.',
        sample: Boolean(data.sample),
        request: data.request
      };
    } catch (error) {
      console.error('createPaymentRequest failed', error);
      return { ok: false, message: 'Unable to create payment request.' };
    }
  }, []);

  const updatePaymentRequestAction = useCallback<AdminContextValue['updatePaymentRequest']>(async (requestId, payload) => {
    try {
      const res = await fetch(`/api/admin/payment-requests/${encodeURIComponent(requestId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to update payment request.' };
      }
      if (Array.isArray(data.requests)) {
        setPaymentRequests(data.requests);
      } else if (data.request) {
        setPaymentRequests(prev => prev.map(item => (item.id === data.request.id ? data.request : item)));
      }
      return { ok: true, message: data.message || 'Payment request updated.', request: data.request };
    } catch (error) {
      console.error('updatePaymentRequest failed', error);
      return { ok: false, message: 'Unable to update payment request.' };
    }
  }, []);

  const deletePaymentRequestAction = useCallback<AdminContextValue['deletePaymentRequest']>(async requestId => {
    try {
      const res = await fetch(`/api/admin/payment-requests/${encodeURIComponent(requestId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to delete payment request.' };
      }
      if (Array.isArray(data.requests)) {
        setPaymentRequests(data.requests);
      } else {
        setPaymentRequests(prev => prev.filter(item => item.id !== requestId));
      }
      return { ok: true, message: data.message || 'Payment request deleted.' };
    } catch (error) {
      console.error('deletePaymentRequest failed', error);
      return { ok: false, message: 'Unable to delete payment request.' };
    }
  }, []);

  const sendPaymentRequestEmail = useCallback<AdminContextValue['sendPaymentRequestEmail']>(async (requestId, payload) => {
    try {
      const res = await fetch(`/api/admin/payment-requests/${encodeURIComponent(requestId)}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message || 'Unable to send payment email.' };
      }
      if (data.request) {
        setPaymentRequests(prev => prev.map(item => (item.id === data.request.id ? data.request : item)));
      }
      return {
        ok: true,
        message: data.message || 'Payment email sent.',
        sample: Boolean(data.sample),
        request: data.request
      };
    } catch (error) {
      console.error('sendPaymentRequestEmail failed', error);
      return { ok: false, message: 'Unable to send payment email.' };
    }
  }, []);

  const value = useMemo<AdminContextValue>(() => ({
    gateState,
    currentUser: currentUser ?? null,
    users: managedUsers,
    clients,
    createUser,
    updateUser,
    deleteUser,
    sendUserEmail,
    updateOnboardingStatus,
    events,
    eventsLoading,
    eventsError,
    usingSampleEvents,
    refreshEvents,
    payments,
    paymentsLoading,
    paymentsError,
    paymentsSample,
    refreshPayments,
    paymentRequests,
    paymentRequestsLoading,
    paymentRequestsError,
    paymentRequestsSample,
    refreshPaymentRequests,
    createPaymentRequest: createPaymentRequestAction,
    updatePaymentRequest: updatePaymentRequestAction,
    deletePaymentRequest: deletePaymentRequestAction,
    sendPaymentRequestEmail
  }), [
    gateState,
    currentUser,
    managedUsers,
    clients,
    createUser,
    updateUser,
    deleteUser,
    sendUserEmail,
    updateOnboardingStatus,
    events,
    eventsLoading,
    eventsError,
    usingSampleEvents,
    refreshEvents,
    payments,
    paymentsLoading,
    paymentsError,
    paymentsSample,
    refreshPayments,
    paymentRequests,
    paymentRequestsLoading,
    paymentRequestsError,
    paymentRequestsSample,
    refreshPaymentRequests,
    createPaymentRequestAction,
    updatePaymentRequestAction,
    deletePaymentRequestAction,
    sendPaymentRequestEmail
  ]);

  if (gateState !== 'ready') {
    return (
      <main id="main" className="container py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-white/80">
          {gateState === 'checking' ? 'Checking admin access…' : 'Redirecting…'}
        </div>
      </main>
    );
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};
