'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Target, Trophy, Heart, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scores',    label: 'My Scores',  icon: Target },
  { href: '/draws',     label: 'Draws',      icon: Trophy },
  { href: '/charity',   label: 'Charity',    icon: Heart },
]

interface Props {
  userName: string | null
  initials: string
}

export function DashboardNav({ userName, initials }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface-900 border-r border-white/5 p-5">
        <Link href="/" className="font-display text-xl font-bold text-white mb-10 block">
          Golf<span className="text-brand-400">Gives</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                pathname.startsWith(href)
                  ? 'bg-brand-500/15 text-brand-400 font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-medium text-brand-400 flex-shrink-0">
              {initials}
            </div>
            <p className="text-sm text-white/70 truncate">{userName ?? 'Golfer'}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition w-full">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-950/90 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-white">
          Golf<span className="text-brand-400">Gives</span>
        </Link>
        <button onClick={() => setOpen(v => !v)} className="p-2 text-white/60 hover:text-white transition">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-surface-950/95 backdrop-blur pt-16 p-5 flex flex-col">
          <nav className="space-y-1 flex-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-base transition',
                  pathname.startsWith(href)
                    ? 'bg-brand-500/15 text-brand-400 font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>
          <form action={signOut} className="mt-4">
            <button type="submit" className="flex items-center gap-3 px-4 py-3 text-sm text-white/30 w-full">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </>
  )
}
