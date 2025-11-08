export type PaymentType = 'kickoff-deposit' | 'final-balance' | 'other';

export interface PaymentChargeSummary {
  id: string;
  status: string;
  receiptUrl: string | null;
  email: string | null;
  paidAt: string | null;
}

export interface PaymentRecord {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description: string | null;
  metadata: Record<string, string>;
  charge: PaymentChargeSummary | null;
}

export interface DepositSummary {
  paid: boolean;
  status: string;
  amount: number;
  currency: string;
  lastPaymentAt: string | null;
  receiptUrl: string | null;
}

export type PaymentRequestStatus = 'draft' | 'scheduled' | 'sent' | 'paid' | 'cancelled';

export interface PaymentRequest {
  id: string;
  userId: string;
  projectId: string | null;
  amountCents: number;
  currency: string;
  description: string | null;
  status: PaymentRequestStatus;
  checkoutUrl: string | null;
  emailSubject: string | null;
  emailMessage: string | null;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}
