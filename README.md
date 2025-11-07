
# Business Booster AI — Multi‑page Funnel Site (Next.js)

Stack: Next.js (App Router), TypeScript, Tailwind, Motion, OpenAI Responses API, Cal.com.

## Run locally
```
pnpm i   # or npm i / yarn
cp .env.example .env.local
pnpm dev
```
Set:
- OPENAI_API_KEY
- OPENAI_MODEL (e.g., gpt-4.1-mini)
- CAL_URL or NEXT_PUBLIC_CAL_URL (defaults to https://cal.com/cm-seo-bu01oy/30min?overlayCalendar=true)
- POSTGRES_URL (Vercel Postgres connection string; DATABASE_URL is also supported)
- CALCOM_API_KEY (optional — enables live Cal.com bookings in the admin dashboard)

Pages:
- Home (hero, services grid, AI tools, testimonials, FAQ)
- Services + product pages (Websites, Meta Ads, Google Ads, Funnels, AI Voice Agents)
- Case Studies, Pricing, About, Contact (Cal.com), Blog
