'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function AddNoteForm({ leadId, userId }: { leadId: string; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    await supabase.from('lead_notes').insert({ lead_id: leadId, user_id: userId, content: content.trim() })
    await supabase.from('lead_activity').insert({
      lead_id: leadId, user_id: userId,
      type: 'note_added', description: 'Note added',
    })
    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a note about this lead..."
        rows={3}
      />
      <Button type="submit" size="sm" disabled={loading || !content.trim()} className="gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Save note
      </Button>
    </form>
  )
}
