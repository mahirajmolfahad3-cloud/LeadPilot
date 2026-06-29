import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { LeadForm } from '@/components/leads/lead-form'

export default async function NewLeadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div>
      <Header user={user} title="Add Lead" />
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">New Lead</h2>
          <p className="text-sm text-muted-foreground mt-1">Fill in the details below to add a new lead.</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LeadForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}
