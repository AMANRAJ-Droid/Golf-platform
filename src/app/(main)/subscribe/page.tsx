import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/actions'
import { PLANS } from '@/lib/stripe/client'
import { formatCurrency } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { Check } from 'lucide-react'

const FEATURES = [
  'Enter every monthly draw automatically',
  'Track up to 5 Stableford scores',
  '3, 4, and 5-number match prizes',
  'Jackpot rolls over until won',
  'Choose any charity to support',
  'At least 10% goes directly to charity',
  'Full results & history dashboard',
]

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already subscribed → go to dashboard
  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    if (sub) redirect('/dashboard')
  }

  const params = await searchParams

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 py-16">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Membership</p>
          <h1 className="font-display text-5xl font-bold text-white">
            Choose your plan
          </h1>
          <p className="mt-4 text-white/50 max-w-md mx-auto">
            One simple subscription. Monthly draws, charity giving, and full score tracking included.
          </p>
        </div>

        {params.error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 text-center">
            {params.error}
          </div>
        )}

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {/* Monthly */}
          <form action={createCheckoutSession.bind(null, 'monthly')}>
            <button type="submit" className="w-full text-left card hover:border-white/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40">Monthly</p>
                  <p className="font-display text-4xl font-bold text-white mt-1">
                    {formatCurrency(PLANS.monthly.amount)}
                    <span className="text-base font-body font-normal text-white/40">/mo</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-brand-500 group-hover:bg-brand-500/10 transition-all flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/40 group-hover:text-brand-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-white/40">Cancel anytime. No commitment.</p>
            </button>
          </form>

          {/* Yearly — recommended */}
          <form action={createCheckoutSession.bind(null, 'yearly')}>
            <button type="submit" className="w-full text-left relative rounded-2xl border border-brand-500/50 bg-brand-500/5 p-6 hover:border-brand-400 hover:bg-brand-500/10 transition-all group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                  Best value — save 17%
                </span>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-400">Yearly</p>
                  <p className="font-display text-4xl font-bold text-white mt-1">
                    {formatCurrency(Math.round(PLANS.yearly.amount / 12))}
                    <span className="text-base font-body font-normal text-white/40">/mo</span>
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Billed {formatCurrency(PLANS.yearly.amount)} per year
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-brand-500/50 group-hover:border-brand-400 group-hover:bg-brand-500/20 transition-all flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-white/40">Two months free. Pay once, play all year.</p>
            </button>
          </form>
        </div>

        {/* Feature list */}
        <div className="card-solid">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">
            Everything included in both plans
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-xs text-white/25 mt-8">
          Payments processed securely by Stripe. Subscriptions renew automatically.
        </p>
      </div>
    </div>
  )
}
