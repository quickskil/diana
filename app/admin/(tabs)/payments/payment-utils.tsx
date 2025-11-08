export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch {
    return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
  }
};

export const formatPaymentStatusLabel = (value?: string | null) => {
  if (!value) return 'Unknown';
  switch (value) {
    case 'succeeded':
      return 'Paid';
    case 'processing':
      return 'Processing';
    case 'requires_action':
      return 'Action required';
    case 'requires_payment_method':
      return 'Awaiting payment method';
    case 'canceled':
      return 'Canceled';
    default:
      return value.replace(/_/g, ' ');
  }
};
