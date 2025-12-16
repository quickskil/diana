# Diana Tolu — Personal Mathematics Tutor

This site is a lightweight marketing and scheduling experience for Diana Tolu, a UCLA mathematics student, IMO Silver Medalist, EGMO medalist, and Putnam Top 200 performer. It uses Next.js (App Router) with Tailwind CSS and embeds Koalendar for booking + Stripe payments.

## Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)
- A Koalendar account with a published booking page
- (Optional) Google Analytics ID if you want traffic insights

## Getting started
```bash
npm install
cp .env.example .env.local
# Add your Koalendar link and site URL to .env.local
npm run dev
```
Visit `http://localhost:3000`.

## Environment variables
Create `.env.local` with the following values:

```
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
NEXT_PUBLIC_KOALENDAR_URL=https://koalendar.com/e/your-booking-page
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # optional
```
- `NEXT_PUBLIC_SITE_URL` is used for SEO metadata and Open Graph tags.
- `NEXT_PUBLIC_KOALENDAR_URL` should be the public link to your Koalendar booking page (iframe-friendly).
- `NEXT_PUBLIC_GA_ID` injects the Google Analytics script when present.

## How Koalendar + Stripe works
1. In Koalendar, create a booking page for Diana&apos;s tutoring sessions and enable Stripe payments in the Koalendar checkout settings.
2. Copy the public booking link (e.g., `https://koalendar.com/e/diana-tolu`) into `NEXT_PUBLIC_KOALENDAR_URL`.
3. Koalendar will handle calendar sync, availability, student intake forms, and Stripe payment collection directly inside the embedded iframe on `/schedule`.
4. No local database or custom API is needed—Koalendar owns the scheduling and payment flow.

## Deployment tips
- Deploy easily on Vercel or any Next.js host.
- Set the environment variables above in your hosting dashboard.
- If you use a custom domain, update `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS URL so SEO metadata resolves correctly.

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm start` — run the production server
- `npm run lint` — lint the codebase

## Contact
Questions or content updates? Email [hello@dianatolu.com](mailto:hello@dianatolu.com).
