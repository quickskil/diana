# Diana Tolu — Personal Mathematics Tutor

Production-ready booking site for Diana Tolu, UCLA mathematics student, IMO Silver Medalist, EGMO Gold Medalist, and Putnam Top 200 performer. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma (SQLite), and Stripe Checkout.

## Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)
- Stripe account for Checkout and webhooks
- SMTP credentials for outbound email (confirmations, reminders, receipts)

## Getting started
```bash
npm install
cp .env.example .env.local
# Update .env.local with your secrets
npx prisma db push
npm run dev
```

Visit `http://localhost:3000`.

### Environment variables
- `DATABASE_URL` — SQLite path (default `file:./dev.db`).
- `NEXT_PUBLIC_SITE_URL` — public base URL for redirects (e.g., `http://localhost:3000`).
- `STRIPE_SECRET_KEY` — Stripe secret key.
- `STRIPE_WEBHOOK_SECRET` — webhook signing secret from the Stripe dashboard.
- `HOURLY_RATE_CENTS` — price per session in cents (default `12000`).
- `ADMIN_KEY` — shared secret to access admin APIs.
- `CRON_SECRET` — shared secret to trigger reminder dispatch.
- `EMAIL_FROM` — from address for emails.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials.

## Booking flow
1. Students browse availability on `/schedule` and submit their details.
2. The booking API creates a pending record and starts a Stripe Checkout session.
3. After payment succeeds, the webhook marks the slot as booked, sends confirmation + receipt emails, and schedules a reminder 24 hours before the session.
4. Admins can view sessions on `/admin` by supplying the `ADMIN_KEY` in the UI.
5. Reminder emails are dispatched by calling `POST /api/reminders` with header `x-cron-key: ${CRON_SECRET}` (ideal for a cron job).

## Stripe webhook
Run Stripe CLI locally:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Testing
```bash
npm test
```

## Production build
```bash
npm run build
npm start
```

Deploy to your preferred host (Vercel, Fly.io, etc.). Ensure environment variables are set and `prisma db push` runs during deployment.
