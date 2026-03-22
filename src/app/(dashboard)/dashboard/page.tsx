import { createClient } from '@/lib/supabase/server'
import { createBillingPortalSession } from '@/lib/stripe/actions'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, Heart, ArrowRight, TrendingUp, Calendar } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>
}) {
  const supabase  = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams

  // Parallel data fetching
  const [
    { data: profile },
    { data: subscription },
    { data: scores },
    { data: charitySelection },
    { data: recentWinnings },
    { data: upcomingDraw },
    { data: myEntries },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, handicap').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('golf_scores').select('*').eq('user_id', user.id).order('played_on', { ascending: false }).limit(5),
    supabase.from('user_charity_selections').select('*, charities(name, image_url)').eq('user_id', user.id).maybeSingle(),
    supabase.from('winners').select('*, draws(draw_date), prize_tiers(match_count)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('draws').select('*').eq('status', 'published').order('draw_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('draw_entries').select('draw_id').eq('user_id', user.id),
  ])

  const firstName  = profile?.full_name?.split(' ')[0] ?? 'Golfer'
  const totalWon   = recentWinnings?.reduce((sum, w) => sum + (w.prize_amount ?? 0), 0) ?? 0
  const drawsEntered = myEntries?.length ?? 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          {params.subscribed && (
            <p className="section-eyebrow mb-1">Welcome aboard!</p>
          )}
          <h1 className="font-display text-3xl font-bold text-white">
            {params.subscribed ? `You're in, ${firstName}` : `Good to see you, ${firstName}`}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {params.subscribed ? 'Your subscription is active. Start entering scores below.' : 'Here\'s your overview for this month.'}
          </p>
        </div>
      </div>

      {/* ── Module 1: Subscription status ──────────────────── */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-white/30 mb-3">Subscription</h2>
        <div className={cn(
          'card flex flex-col sm:flex-row sm:items-center justify-between gap-4',
          !subscription && 'border-amber-500/30 bg-amber-500/5'
        )}>
          {subscription ? (
            <>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white capitalize">{subscription.plan} plan</p>
                    <span className="badge-green">Active</span>
                    {subscription.cancel_at_period_end && <span className="badge-amber">Cancels soon</span>}
                  </div>
                  <p className="text-sm text-white/40 mt-0.5">
                    {subscription.cancel_at_period_end
                      ? `Access until ${formatDate(subscription.current_period_end!)}`
                      : `Renews ${formatDate(subscription.current_period_end!)}`}
                  </p>
                </div>
              </div>
              <form action={createBillingPortalSession}>
                <button type="submit" className="btn-ghost text-sm">
                  Manage billing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div>
                <p className="font-medium text-amber-400">No active subscription</p>
                <p className="text-sm text-white/40 mt-0.5">Subscribe to enter draws and track your scores.</p>
              </div>
              <Link href="/subscribe" className="btn-primary text-sm">Subscribe now</Link>
            </>
          )}
        </div>
      </section>

      {/* ── Module 2 & 3: Scores + Charity (side by side) ── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Module 2: Score entry */}
        <section className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" />
              <h2 className="font-medium text-white text-sm">My scores</h2>
            </div>
            <Link href="/scores" className="text-xs text-white/30 hover:text-white/60 transition flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {scores && scores.length > 0 ? (
            <div className="space-y-2">
              {scores.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/20 w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm text-white">{formatDate(s.played_on)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-medium text-white">{s.score}</span>
                    <span className="text-xs text-white/30">pts</span>
                  </div>
                </div>
              ))}
              {scores.length < 5 && (
                <p className="text-xs text-white/25 text-center pt-2">
                  Add {5 - scores.length} more score{5 - scores.length !== 1 ? 's' : ''} to fill your window
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-white/30 text-sm">No scores yet</p>
              <Link href="/scores" className="btn-primary text-sm mt-4 inline-flex">Add your first score</Link>
            </div>
          )}
        </section>

        {/* Module 3: Charity */}
        <section className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-charity-400" />
              <h2 className="font-medium text-white text-sm">My charity</h2>
            </div>
            <Link href="/charity" className="text-xs text-white/30 hover:text-white/60 transition flex items-center gap-1">
              Change <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {charitySelection ? (
            <div>
              <p className="font-medium text-white">
                {(charitySelection.charities as { name: string } | null)?.name}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-white/40">Your contribution</span>
                <span className="font-medium text-charity-400">{charitySelection.contribution_pct}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-charity-500 transition-all"
                  style={{ width: `${charitySelection.contribution_pct}%` }}
                />
              </div>
              <p className="text-xs text-white/25 mt-2">
                of your subscription fee goes directly to this charity
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-white/30 text-sm">No charity selected</p>
              <Link href="/charity" className="btn-primary text-sm mt-4 inline-flex">Choose a charity</Link>
            </div>
          )}
        </section>
      </div>

      {/* ── Module 4: Participation summary ──────────────── */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-white/30 mb-3">Participation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="card-solid text-center py-5">
            <p className="font-display text-3xl font-bold text-white">{drawsEntered}</p>
            <p className="text-xs text-white/30 mt-1 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" /> Draws entered
            </p>
          </div>
          <div className="card-solid text-center py-5">
            <p className="font-display text-3xl font-bold text-white">{scores?.length ?? 0}</p>
            <p className="text-xs text-white/30 mt-1 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Scores on record
            </p>
          </div>
          <div className="card-solid text-center py-5 col-span-2 md:col-span-1">
            {upcomingDraw ? (
              <>
                <p className="text-xs text-white/30 mb-1">Latest draw</p>
                <p className="font-medium text-white text-sm">{formatDate(upcomingDraw.draw_date)}</p>
                <div className="flex justify-center gap-1.5 mt-2">
                  {(upcomingDraw.winning_numbers as number[]).map((n, i) => (
                    <span key={i} className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 text-xs font-mono font-medium flex items-center justify-center">
                      {n}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-display text-3xl font-bold text-white">—</p>
                <p className="text-xs text-white/30 mt-1">No draws yet</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Module 5: Winnings overview ─────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-white/30">Winnings</h2>
          <Link href="/draws" className="text-xs text-white/30 hover:text-white/60 transition flex items-center gap-1">
            View all draws <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentWinnings && recentWinnings.length > 0 ? (
          <>
            <div className="card mb-3 flex items-center gap-4">
              <TrendingUp className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/40">Total prize money won</p>
                <p className="font-display text-2xl font-bold text-white">
                  {formatCurrency(totalWon * 100)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {recentWinnings.map(w => (
                <div key={w.id} className="card-solid flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white">
                      {(w.prize_tiers as { match_count: number } | null)?.match_count}-number match
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      Draw: {formatDate((w.draws as { draw_date: string } | null)?.draw_date ?? '')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(w.prize_amount * 100)}</p>
                    <span className={cn('text-xs', {
                      'text-amber-400':  w.payout_status === 'pending' && w.verification_status === 'approved',
                      'text-brand-400':  w.payout_status === 'paid',
                      'text-white/30':   w.verification_status === 'pending',
                      'text-red-400':    w.verification_status === 'rejected',
                    })}>
                      {w.verification_status === 'pending' && 'Awaiting verification'}
                      {w.verification_status === 'approved' && w.payout_status === 'pending' && 'Payout pending'}
                      {w.payout_status === 'paid' && 'Paid'}
                      {w.verification_status === 'rejected' && 'Rejected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card text-center py-10">
            <Trophy className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No winnings yet — keep playing!</p>
            <p className="text-white/20 text-xs mt-1">Your scores are automatically entered into every monthly draw.</p>
          </div>
        )}
      </section>
    </div>
  )
}
