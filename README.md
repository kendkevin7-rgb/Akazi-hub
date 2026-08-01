# Akazi Hub

A mobile-first gig and blue-collar marketplace connecting Kigali households with vetted (NID-verified) plumbers, electricians, cleaners, painters, masons, drivers, IT technicians, software engineers, wedding planners, chefs, home workers, fitness trainers, and event services. Hire and pay a deposit via Mobile Money (MTN MoMo / Airtel Money) directly from a worker's profile.

Built for low-bandwidth, outdoor-readable, one-hand mobile use — every tap target is at least 48×48px, animation is minimal, and the whole app targets a sub-1.5MB page weight.

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with a custom design system (`tailwind.config.ts`)
- **Lucide React** icons
- **Prisma** schema for PostgreSQL (Users, WorkerProfile, Verification, JobPosting, Rating)
- Phone-number + OTP authentication model (mocked in this build)

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and provider keys
npm run db:generate    # generate the Prisma client
npm run db:push        # push schema to your PostgreSQL instance
npm run db:seed        # populate localized demo data
npm run dev
```

Open http://localhost:3000 — the layout is optimized for a mobile viewport, so use your browser's device toolbar (or an actual phone) for the intended experience.

> **Note:** The UI itself (home, search, worker profiles, hiring, onboarding) runs entirely on typed mock data in `src/lib/mockData.ts`, so you can explore the whole app with `npm run dev` alone — the database is only needed to wire up real persistence.

## Project structure

```
src/
  app/
    page.tsx                  Home — hero, category grid, featured workers
    search/page.tsx           Worker directory with filters
    worker/[id]/page.tsx      Worker profile + one-click hire
    jobs/page.tsx             Client's booking history
    profile/page.tsx          Account + language + legal links
    onboarding/page.tsx       4-step worker registration (identity → skills → NID → payout)
    legal/privacy/page.tsx    Privacy Policy (GDPR / Law 058/2021 aligned)
    legal/terms/page.tsx      Terms of Service
    legal/security/page.tsx   Security & Trust (credential protection, OWASP)
  components/                 BottomNav, Header, Footer, WorkerCard, HireModal, NidVerification, LegalDoc, etc.
  lib/
    types.ts                  Shared TypeScript types
    i18n.ts                   English / Kinyarwanda / French dictionaries
    mockData.ts               Localized demo workers & jobs
prisma/
  schema.prisma                Database schema
  seed.ts                       Seed script
```

## Design system

| Token | Value | Use |
|---|---|---|
| `brand-500` | `#0F6B5C` | Primary actions, hero, trust signals |
| `gold-500` | `#EFB308` | Money/deposit callouts, ratings |
| `ink-900` | `#12140F` | Body text (high contrast for outdoor use) |
| `trade.plumber` | `#2563A8` | Plumber badge/category color |
| `trade.electrician` | `#C97F00` | Electrician badge/category color |
| `trade.cleaner` | `#0F6B5C` | Cleaner badge/category color |
| `trade.painter` | `#6B3FA0` | Painter badge/category color |
| `trade.mason` | `#A0522D` | Mason badge/category color |
| `trade.driver` | `#1E40AF` | Driver badge/category color |
| `trade.it` | `#0E7490` | IT technician badge/category color |
| `trade.software` | `#4F46E5` | Software engineer badge/category color |
| `trade.wedding` | `#DB2777` | Wedding planner badge/category color |
| `trade.chef` | `#EA580C` | Chef badge/category color |
| `trade.home` | `#15803D` | Home worker badge/category color |
| `trade.fitness` | `#C026D3` | Fitness trainer badge/category color |
| `trade.events` | `#92400E` | Event services badge/category color |

Each trade keeps one consistent color across the category grid, skill selector, and worker badges — a lightweight visual language similar to how tools and safety gear are color-coded on a real job site.

Fonts: **Sora** (display/headings) + **Manrope** (body/UI), loaded via `next/font/google` with `display: swap`.

## Key flows implemented

- **Bottom navigation** (Home / Search / My Jobs / Profile) fixed on mobile, with a floating WhatsApp support button.
- **Language toggle** — English, Kinyarwanda, French — persisted to `localStorage`.
- **Worker onboarding** — personal info → skill selection → mock NID verification (16-digit, must start with 1 or 2) → Mobile Money payout setup + rate. Consent to Terms, Privacy, and data processing is required before registration can proceed.
- **Search & directory** — instant client-side filtering by trade, availability, and text query.
- **One-click hire** — modal collects task, date/time, and phone, then simulates a MoMo/Airtel Money USSD push and booking confirmation.
- **13 trade categories** — plumbing, electrical, cleaning, painting, masonry, driving, IT support, software engineering, wedding planning, catering, home care, fitness training, and event services.

## Privacy, security & compliance

- **Legal pages** (`/legal/privacy`, `/legal/terms`, `/legal/security`) aligned with Rwanda's Data Protection and Privacy Law of 2021, the GDPR, and OWASP best practices — covering data collection, lawful basis, retention, data-subject rights, credential protection, and responsible disclosure.
- **Consent-first onboarding** — workers must explicitly agree to the Terms, Privacy Policy, and data processing before submitting registration.
- **Security headers** applied to every route via `next.config.mjs`: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`.
- **Credential handling rules** — OTPs are hashed and time-limited, NID numbers are encrypted at rest and never shown on public profiles, and MoMo payment references are never logged in plain text.

## Production notes

This build ships with realistic mock data and simulated verification/payment flows so the full experience can be reviewed without external services. To go to production you would:

1. Wire real OTP delivery (e.g. Africa's Talking, Twilio Verify) behind the phone-auth screens.
2. Replace the mock NID check with Rwanda's National Identification Agency (NIDA) lookup API.
3. Replace the simulated MoMo flow with real MTN MoMo / Airtel Money Collections API calls, storing `momoTransactionRef` on `JobPosting`.
4. Point Prisma at a managed PostgreSQL instance and run migrations instead of `db push`.
