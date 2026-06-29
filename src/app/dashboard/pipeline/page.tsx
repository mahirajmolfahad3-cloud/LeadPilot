import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { PipelineBoard } from '@/components/leads/pipeline-board'

export default async function PipelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: leads } = await supabase
    .from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  return (
    <div>
      <Header user={user} title="Pipeline" />
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Drag and drop leads between stages to update their status.</p>
        </div>
        <PipelineBoard initialLeads={leads ?? []} userId={user.id} />
      </div>
    </div>
  )
}
