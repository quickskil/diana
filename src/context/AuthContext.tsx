'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { OnboardingForm, OnboardingStatus, SafeUser } from '@/lib/types/user';

interface AuthContextValue {
  hydrated: boolean;
  currentUser: SafeUser | null;
  users: SafeUser[];
  register: (payload: { name: string; email: string; password: string; company?: string }) => Promise<{ ok: boolean; message?: string }>;
  login: (payload: { email: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  saveOnboarding: (payload: OnboardingForm) => Promise<{ ok: boolean; message?: string }>;
  updateOnboardingStatus: (payload: { userId: string; status: OnboardingStatus; note?: string }) => Promise<{ ok: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_ENDPOINT = '/api/session';
const REGISTER_ENDPOINT = '/api/auth/register';
const LOGIN_ENDPOINT = '/api/auth/login';
const LOGOUT_ENDPOINT = '/api/auth/logout';
const ONBOARDING_ENDPOINT = '/api/onboarding';
const ADMIN_USERS_ENDPOINT = '/api/admin/users';

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Failed to parse JSON response', error, text);
    throw new Error('Invalid server response.');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [adminUsersLoaded, setAdminUsersLoaded] = useState(false);

  const fetchAdminUsers = useCallback(async () => {
    try {
      const res = await fetch(ADMIN_USERS_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Unable to load users');
      }
      const data = await parseJson<{ users?: SafeUser[] }>(res);
      if (Array.isArray(data.users)) {
        setUsers(data.users);
        setAdminUsersLoaded(true);
      }
    } catch (error) {
      console.error('Failed to fetch admin users', error);
      setUsers([]);
      setAdminUsersLoaded(true);
    }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(SESSION_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Unable to load session');
      }
      const data = await parseJson<{ user?: SafeUser | null; users?: SafeUser[] }>(res);
      const nextUser = data.user ?? null;
      setCurrentUser(nextUser);
      if (nextUser?.role === 'admin' && Array.isArray(data.users)) {
        setUsers(data.users);
        setAdminUsersLoaded(true);
      } else {
        setUsers([]);
        setAdminUsersLoaded(false);
      }
    } catch (error) {
      console.error('Failed to fetch session', error);
      setCurrentUser(null);
      setUsers([]);
      setAdminUsersLoaded(false);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!hydrated) return;
    if (currentUser?.role === 'admin' && !adminUsersLoaded) {
      void fetchAdminUsers();
    }
  }, [adminUsersLoaded, currentUser?.role, fetchAdminUsers, hydrated]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      setAdminUsersLoaded(false);
    }
  }, [currentUser?.role]);

  const register = useCallback<AuthContextValue['register']>(async payload => {
    try {
      const res = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJson<{ ok?: boolean; message?: string; user?: SafeUser | null; users?: SafeUser[] }>(res);
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message ?? 'We could not create your account.' };
      }
      const nextUser = data.user ?? null;
      setCurrentUser(nextUser);
      if (nextUser?.role === 'admin' && Array.isArray(data.users)) {
        setUsers(data.users);
        setAdminUsersLoaded(true);
      } else {
        setUsers([]);
        setAdminUsersLoaded(false);
      }
      return { ok: true, message: data.message ?? 'Account created.' };
    } catch (error) {
      console.error('Registration failed', error);
      return { ok: false, message: 'We could not create your account.' };
    }
  }, []);

  const login = useCallback<AuthContextValue['login']>(async payload => {
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJson<{ ok?: boolean; message?: string; user?: SafeUser | null; users?: SafeUser[] }>(res);
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message ?? 'Login failed. Check your details.' };
      }
      const nextUser = data.user ?? null;
      setCurrentUser(nextUser);
      if (nextUser?.role === 'admin' && Array.isArray(data.users)) {
        setUsers(data.users);
        setAdminUsersLoaded(true);
      } else {
        setUsers([]);
        setAdminUsersLoaded(false);
      }
      return { ok: true, message: data.message ?? 'Logged in.' };
    } catch (error) {
      console.error('Login failed', error);
      return { ok: false, message: 'Login failed. Check your details.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(LOGOUT_ENDPOINT, { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setCurrentUser(null);
      setUsers([]);
      setAdminUsersLoaded(false);
    }
  }, []);

  const saveOnboarding = useCallback<AuthContextValue['saveOnboarding']>(async payload => {
    try {
      const res = await fetch(ONBOARDING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await parseJson<{ ok?: boolean; message?: string; user?: SafeUser | null }>(res);
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message ?? 'Unable to save onboarding right now.' };
      }
      if (data.user) {
        setCurrentUser(data.user);
        if (data.user.role === 'admin') {
          setAdminUsersLoaded(false);
        }
      }
      return { ok: true, message: data.message ?? 'Onboarding saved.' };
    } catch (error) {
      console.error('Failed to save onboarding', error);
      return { ok: false, message: 'Unable to save onboarding right now.' };
    }
  }, []);

  const updateOnboardingStatus = useCallback<AuthContextValue['updateOnboardingStatus']>(async payload => {
    try {
      const res = await fetch(`/api/admin/onboarding/${encodeURIComponent(payload.userId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: payload.status, note: payload.note })
      });
      const data = await parseJson<{ ok?: boolean; message?: string; user?: SafeUser | null }>(res);
      if (!res.ok || data.ok === false) {
        return { ok: false, message: data.message ?? 'Unable to update onboarding status.' };
      }
      if (data.user) {
        setUsers(prev => prev.map(user => (user.id === data.user?.id ? data.user! : user)));
        setCurrentUser(prev => {
          if (prev && prev.id === data.user?.id) {
            return data.user ?? prev;
          }
          return prev;
        });
        setAdminUsersLoaded(true);
      }
      return { ok: true, message: data.message ?? 'Onboarding status updated.' };
    } catch (error) {
      console.error('Failed to update onboarding status', error);
      return { ok: false, message: 'Unable to update onboarding status.' };
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    hydrated,
    currentUser,
    users,
    register,
    login,
    logout,
    saveOnboarding,
    updateOnboardingStatus
  }), [currentUser, hydrated, login, logout, register, saveOnboarding, updateOnboardingStatus, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}

