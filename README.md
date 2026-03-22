# GolfGives — Play. Win. Give.

A subscription-based golf platform combining Stableford score tracking, monthly prize draws, and charitable giving.

Built with **Next.js 14**, **Supabase**, **Stripe**, and **Tailwind CSS**.

---

## Features

- **Subscription engine** — Monthly and yearly plans via Stripe
- **Score tracking** — Rolling 5-score Stableford window (1–45)
- **Monthly draws** — 3, 4, and 5-number match prizes with jackpot rollover
- **Charity giving** — Choose any charity, minimum 10% of subscription donated
- **Winner verification** — Proof upload, admin approval, payout tracking
- **Admin dashboard** — Full control over users, draws, charities, and payouts
- **Mobile-first** — Fully responsive design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Stripe](https://stripe.com) account

### 1. Clone the repository

```bash
git clone https://github.com/YOURUSERNAME/golf-platform.git
cd golf-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp env.local.example .env.local
```

Fill in your keys in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STRIPE_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_MONTHLY_PRICE_ID=price_your-monthly-price-id
STRIPE_YEARLY_PRICE_ID=price_your-yearly-price-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

1. Go to your Supabase project → **SQL Editor**
2. Paste and run the contents of `schema.sql`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Set up Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret and update `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, signup pages
│   ├── (dashboard)/      # Authenticated user pages
│   ├── (main)/           # Public pages (homepage, subscribe)
│   └── api/
│       └── webhooks/
│           └── stripe/   # Stripe webhook handler
├── components/
│   └── dashboard/        # Shared dashboard components
├── lib/
│   ├── auth/             # Auth server actions
│   ├── scores/           # Score server actions
│   ├── stripe/           # Stripe client + actions
│   └── supabase/         # Supabase clients (browser, server, admin)
├── middleware.ts          # Route protection
└── types/
    └── database.ts        # Full TypeScript types for all tables
```

---

## Database Schema

| Table | Description |
|---|---|
| `profiles` | Extends Supabase auth users |
| `subscriptions` | Stripe subscription data |
| `charities` | Charity directory |
| `charity_events` | Events per charity |
| `user_charity_selections` | Which charity a user supports |
| `golf_scores` | Rolling 5-score window per user |
| `draws` | Monthly draw events |
| `prize_tiers` | 3/4/5-match prize pools per draw |
| `draw_entries` | User entries per draw |
| `winners` | Winners with verification + payout status |

---

## Prize Pool Distribution

| Match | Pool Share | Rollover |
|---|---|---|
| 5-number match | 40% | Yes (jackpot) |
| 4-number match | 35% | No |
| 3-number match | 25% | No |

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from `.env.local`
4. Deploy

### Stripe webhooks (production)

In your Stripe Dashboard → **Webhooks** → **Add endpoint**:

- URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

---

## Test Cards (Stripe)

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0025 0000 3155` | Requires authentication |

Use any future expiry date and any 3-digit CVC.

---

## Environment Variables Reference

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API Keys |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe → Product catalogue → Monthly plan |
| `STRIPE_YEARLY_PRICE_ID` | Stripe → Product catalogue → Yearly plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks |

---

## License

This project was built as part of the Digital Heroes Full-Stack Development Trainee Selection Process.
