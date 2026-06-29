import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { LeadForm } from '@/components/leads/lead-form'

interface EditLeadPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: lead } = await supabase
    .from('leads').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!lead) notFound()

  return (
    <div>
      <Header user={user} title="Edit Lead" />
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Edit: {lead.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">Update the details for this lead.</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LeadForm lead={lead} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
