import Link from 'next/link'
import { signUp } from '@/lib/auth/actions'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams

  if (params.message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Check your inbox</h1>
          <p className="mt-3 text-white/50">{params.message}</p>
          <Link href="/login" className="btn-secondary mt-8 inline-flex">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-surface-900 border-r border-white/5">
        <Link href="/" className="text-white font-display text-2xl font-bold">
          Golf<span className="text-brand-400">Gives</span>
        </Link>
        <div className="space-y-6">
          {[
            { title: 'Enter monthly draws', desc: 'Your Stableford scores enter you automatically into prize draws every month.' },
            { title: 'Win real prizes', desc: '3, 4, and 5-number match prizes — jackpot rolls over until someone wins.' },
            { title: 'Give to charity', desc: 'Choose any charity from our directory. At least 10% of your subscription goes directly to them.' },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" style={{ height: '1.25rem' }} />
              <div>
                <p className="font-medium text-white text-sm">{title}</p>
                <p className="text-white/40 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs">Join 2,400+ golfers already playing and giving.</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden text-white font-display text-xl font-bold mb-8 block">
              Golf<span className="text-brand-400">Gives</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-white/50 text-sm">Start playing, winning, and giving today</p>
          </div>

          {params.error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {params.error}
            </div>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label className="label" htmlFor="full_name">Full name</label>
              <input id="full_name" name="full_name" type="text" required autoComplete="name"
                className="input" placeholder="Jamie Robertson" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={8}
                autoComplete="new-password" className="input" placeholder="At least 8 characters" />
            </div>

            <button type="submit" className="btn-primary w-full mt-2">
              Create account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-white/30">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white/60 transition">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-white/60 transition">Privacy Policy</Link>.
          </p>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
