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
import type { PaymentRecord } from '@/lib/types/payments';

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
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hydrated, currentUser, users, updateOnboardingStatus } = useAuth();

  const [gateState, setGateState] = useState<GateState>('checking');
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleEvents, setUsingSampleEvents] = useState(false);

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsSample, setPaymentsSample] = useState(false);

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

  const clients = useMemo(() => users.filter(user => user.role === 'client'), [users]);

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

  useEffect(() => {
    if (gateState !== 'ready') return;
    void refreshEvents();
    void refreshPayments();
  }, [gateState, refreshEvents, refreshPayments]);

  const value = useMemo<AdminContextValue>(() => ({
    gateState,
    currentUser: currentUser ?? null,
    users,
    clients,
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
    refreshPayments
  }), [
    gateState,
    currentUser,
    users,
    clients,
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
    refreshPayments
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

