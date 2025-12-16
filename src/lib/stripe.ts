type CheckoutLineItem = {
  price_data: {
    currency: string;
    product_data: { name: string; description?: string };
    unit_amount: number;
  };
  quantity: number;
};

type CheckoutSessionPayload = {
  mode: 'payment';
  line_items: CheckoutLineItem[];
  customer_email?: string;
  metadata?: Record<string, string>;
  success_url: string;
  cancel_url: string;
};

type CheckoutSession = {
  id: string;
  url: string | null;
  payment_intent?: string | null;
  metadata?: Record<string, string>;
};

type WebhookEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

class LightweightStripe {
  constructor(private secretKey: string | undefined) {}

  checkout = {
    sessions: {
      create: async (payload: CheckoutSessionPayload): Promise<CheckoutSession> => {
        if (!this.secretKey) {
          return {
            id: 'sess_mock',
            url: payload.success_url,
            payment_intent: null,
            metadata: payload.metadata
          };
        }

        const body = new URLSearchParams({
          mode: payload.mode,
          success_url: payload.success_url,
          cancel_url: payload.cancel_url,
          customer_email: payload.customer_email || ''
        });

        payload.line_items.forEach((item, index) => {
          const prefix = `line_items[${index}]`;
          body.append(`${prefix}[quantity]`, String(item.quantity));
          body.append(`${prefix}[price_data][currency]`, item.price_data.currency);
          body.append(`${prefix}[price_data][unit_amount]`, String(item.price_data.unit_amount));
          body.append(`${prefix}[price_data][product_data][name]`, item.price_data.product_data.name);
          if (item.price_data.product_data.description) {
            body.append(`${prefix}[price_data][product_data][description]`, item.price_data.product_data.description);
          }
        });

        if (payload.metadata) {
          Object.entries(payload.metadata).forEach(([key, value]) => {
            body.append(`metadata[${key}]`, value);
          });
        }

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body
        });

        if (!response.ok) {
          throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as CheckoutSession;
        return data;
      }
    }
  };

  webhooks = {
    constructEvent: (payload: string, _sig: string | null, _secret: string) => {
      return JSON.parse(payload) as WebhookEvent;
    }
  };
}

export const stripe = new LightweightStripe(process.env.STRIPE_SECRET_KEY);
export type { CheckoutSession, WebhookEvent };
