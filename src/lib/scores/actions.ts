'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const ScoreSchema = z.object({
  score:     z.coerce.number().int().min(1).max(45),
  played_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function addScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = ScoreSchema.safeParse({
    score:     formData.get('score'),
    played_on: formData.get('played_on'),
  })

  if (!parsed.success) {
    return { error: 'Invalid score. Must be between 1 and 45.' }
  }

  // Check active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) return { error: 'Active subscription required to log scores.' }

  const { error } = await supabase.from('golf_scores').insert({
    user_id:   user.id,
    score:     parsed.data.score,
    played_on: parsed.data.played_on,
  })

  if (error) return { error: error.message }

  revalidatePath('/scores')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteScore(scoreId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('golf_scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', user.id)  // RLS double-check

  if (error) return { error: error.message }

  revalidatePath('/scores')
  revalidatePath('/dashboard')
  return { success: true }
}
