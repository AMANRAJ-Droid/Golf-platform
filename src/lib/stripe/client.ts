import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

/** Subscription plan config — keep in sync with Stripe Dashboard */
export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    label: 'Monthly',
    amount: 999,     // pence / cents
    interval: 'month' as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    label: 'Yearly',
    amount: 9900,
    interval: 'year' as const,
  },
} as const

export type PlanKey = keyof typeof PLANS

/** Fixed portion of each subscription that goes to the prize pool */
export const PRIZE_POOL_PERCENTAGE = 0.60  // 60% of subscription fee

/** Minimum charity contribution */
export const MIN_CHARITY_PERCENTAGE = 10   // 10%
