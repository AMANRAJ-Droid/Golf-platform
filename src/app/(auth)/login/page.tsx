import Link from 'next/link'
import { signIn } from '@/lib/auth/actions'

interface Props {
  searchParams: Promise<{ error?: string; message?: string; redirectTo?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-surface-900 border-r border-white/5">
        <Link href="/" className="text-white font-display text-2xl font-bold tracking-tight">
          Golf<span className="text-brand-400">Gives</span>
        </Link>
        <div>
          <p className="font-display text-5xl font-bold text-white leading-tight text-balance">
            Every round you play,<br />
            <span className="text-brand-400">someone wins.</span>
          </p>
          <p className="mt-4 text-white/50 text-lg">
            Track your Stableford scores, enter monthly draws, and give to the charity you love.
          </p>
        </div>
        <div className="flex gap-8">
          {[['2,400+', 'Active members'], ['£18,200', 'Given to charity'], ['Monthly', 'Prize draws']].map(([stat, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-bold text-brand-400">{stat}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden text-white font-display text-xl font-bold mb-8 block">
              Golf<span className="text-brand-400">Gives</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-white/50 text-sm">Sign in to your account to continue</p>
          </div>

          {params.error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {params.error}
            </div>
          )}
          {params.message && (
            <div className="mb-6 rounded-xl border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-400">
              {params.message}
            </div>
          )}

          <form action={signIn} className="space-y-4">
            {params.redirectTo && (
              <input type="hidden" name="redirectTo" value={params.redirectTo} />
            )}
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="input" placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs text-white/40 hover:text-white/70 transition">
                  Forgot password?
                </Link>
              </div>
              <input id="password" name="password" type="password" required autoComplete="current-password"
                className="input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            No account?{' '}
            <Link href="/signup" className="text-brand-400 hover:text-brand-300 transition">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
