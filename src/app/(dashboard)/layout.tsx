import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { getInitials } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const name     = profile?.full_name ?? null
  const initials = getInitials(name ?? user.email)

  return (
    <div className="flex min-h-screen bg-surface-950">
      <DashboardNav userName={name} initials={initials} />
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 max-w-5xl w-full">
        {children}
      </main>
    </div>
  )
}
