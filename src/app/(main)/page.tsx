import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Check, Trophy, Heart, Target, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-950/80 backdrop-blur">
        <span className="font-display text-xl font-bold">
          Golf<span className="text-brand-400">Gives</span>
        </span>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary text-sm py-2">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm py-2">Sign in</Link>
              <Link href="/signup" className="btn-primary text-sm py-2">Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center">
        <p className="section-eyebrow mb-4">Play. Win. Give.</p>
        <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight text-balance max-w-3xl mx-auto">
          Golf that means<br />
          <span className="text-brand-400">something more.</span>
        </h1>
        <p className="mt-6 text-white/50 text-xl max-w-xl mx-auto text-balance">
          Track your Stableford scores, enter monthly prize draws, and give to the charity you love — all in one subscription.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Start playing and giving
          </Link>
          <Link href="#how-it-works" className="btn-ghost text-base px-8 py-4">
            How it works
          </Link>
        </div>
        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm">
          {[['2,400+', 'Members'], ['£18,200', 'Given to charity'], ['£4,500', 'Largest jackpot won'], ['12', 'Charities supported']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-3xl font-bold text-brand-400">{v}</p>
              <p className="text-white/30 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow mb-3">How it works</p>
            <h2 className="font-display text-4xl font-bold">Three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Log your scores', desc: 'Enter up to 5 Stableford scores. They become your monthly draw numbers automatically.' },
              { icon: Trophy, title: 'Win prizes', desc: 'Match 3, 4, or 5 numbers to win. The jackpot rolls over every month nobody wins all 5.' },
              { icon: Heart, title: 'Give to charity', desc: 'Pick any charity from our directory. At least 10% of your subscription goes straight to them.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card group hover:border-white/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4 group-hover:bg-brand-500/25 transition">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-medium text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize pool */}
      <section className="py-24 px-6 border-t border-white/5 bg-surface-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-eyebrow mb-3">Monthly draws</p>
          <h2 className="font-display text-4xl font-bold mb-12">How prizes are split</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { match: '5-number match', pct: '40%', tag: 'Jackpot', tagClass: 'badge-green', note: 'Rolls over if no winner' },
              { match: '4-number match', pct: '35%', tag: 'Second prize', tagClass: 'badge-blue', note: 'Split equally among winners' },
              { match: '3-number match', pct: '25%', tag: 'Third prize', tagClass: 'badge-gray', note: 'Split equally among winners' },
            ].map(({ match, pct, tag, tagClass, note }) => (
              <div key={match} className="card-solid text-center py-6">
                <span className={`${tagClass} mb-3 inline-flex`}>{tag}</span>
                <p className="font-display text-4xl font-bold text-white">{pct}</p>
                <p className="text-xs text-white/40 mt-1">{match}</p>
                <p className="text-xs text-white/20 mt-3">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-5xl font-bold mb-4">
            Ready to play<br />
            <span className="text-brand-400">and give?</span>
          </h2>
          <p className="text-white/40 mb-8">
            From £9.99/month. Choose your charity. Cancel anytime.
          </p>
          <div className="space-y-3 text-sm text-left max-w-xs mx-auto mb-10">
            {['Monthly prize draws included', 'Score tracking dashboard', 'Charity of your choice', 'No hidden fees'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/60">
                <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <Link href="/signup" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
        <span className="font-display font-bold text-white/40">GolfGives</span>
        <div className="flex gap-6">
          <Link href="/charities" className="hover:text-white/50 transition">Charities</Link>
          <Link href="/terms" className="hover:text-white/50 transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white/50 transition">Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
