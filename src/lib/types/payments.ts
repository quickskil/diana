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
