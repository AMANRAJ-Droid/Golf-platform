import { createClient } from '@/lib/supabase/server'
import { addScore, deleteScore } from '@/lib/scores/actions'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { Trash2, Plus } from 'lucide-react'

export const metadata = { title: 'My Scores' }

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: scores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_on', { ascending: false })
    .limit(5)

  const today = new Date().toISOString().split('T')[0]
  const canAdd = (scores?.length ?? 0) < 5 || true  // trigger always replaces oldest

  return (
    <div className="space-y-8 animate-fade-in max-w-xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My scores</h1>
        <p className="mt-1 text-white/40 text-sm">
          Your 5 most recent Stableford scores. Adding a new one automatically removes the oldest.
        </p>
      </div>

      {/* Score list */}
      <div className="space-y-2">
        {scores && scores.length > 0 ? (
          scores.map((score, i) => (
            <div key={score.id} className="card-solid flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-mono text-xs text-white/20">{i + 1}</span>
                <div>
                  <p className="text-sm text-white">{formatDate(score.played_on)}</p>
                  <p className="text-xs text-white/30">Stableford</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-2xl font-medium text-white">{score.score}</p>
                  <p className="text-xs text-white/30">points</p>
                </div>
                <form action={deleteScore.bind(null, score.id)}>
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition opacity-0 group-hover:opacity-100"
                    title="Remove score"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-white/30 text-sm">No scores yet. Add your first round below.</p>
          </div>
        )}

        {/* Slot indicators */}
        {scores && scores.length < 5 && Array.from({ length: 5 - scores.length }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-dashed border-white/10 p-4 flex items-center gap-4">
            <span className="w-6 text-center font-mono text-xs text-white/10">{(scores.length) + i + 1}</span>
            <p className="text-sm text-white/20">Empty slot</p>
          </div>
        ))}
      </div>

      {/* Add score form */}
      <div className="card">
        <h2 className="font-medium text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-400" />
          Add a score
        </h2>
        <form action={addScore} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="score">
                Stableford points
              </label>
              <input
                id="score"
                name="score"
                type="number"
                min={1}
                max={45}
                required
                className="input"
                placeholder="e.g. 34"
              />
              <p className="text-xs text-white/25 mt-1.5">Between 1 and 45</p>
            </div>
            <div>
              <label className="label" htmlFor="played_on">
                Date played
              </label>
              <input
                id="played_on"
                name="played_on"
                type="date"
                required
                max={today}
                defaultValue={today}
                className="input"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Add score
          </button>
        </form>
      </div>

      {/* Info callout */}
      <div className="rounded-2xl border border-white/5 bg-white/3 p-4 text-xs text-white/30 space-y-1">
        <p>Your 5 scores are used as your draw entry numbers each month.</p>
        <p>Adding a 6th score automatically removes the oldest one.</p>
        <p>Scores must be between 1 and 45 (Stableford format).</p>
      </div>
    </div>
  )
}
