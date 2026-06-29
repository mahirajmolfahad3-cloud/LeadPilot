import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { LeadCard } from '@/components/leads/lead-card'
import { Lead } from '@/types'
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn, STATUS_LABELS } from '@/lib/utils'

interface LeadsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { status, search } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  let query = supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  const { data: leads } = await query
  const allLeads: Lead[] = leads ?? []

  const filtered = search
    ? allLeads.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.company?.toLowerCase().includes(search.toLowerCase())
      )
    : allLeads

  const statuses = ['all', 'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'] as const

  return (
    <div>
      <Header user={user} title="Leads" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <Link
                key={s}
                href={`/dashboard/leads${s !== 'all' ? `?status=${s}` : ''}`}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  (s === 'all' && !status) || s === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
              </Link>
            ))}
          </div>
          <Button asChild size="sm" className="gap-2 shrink-0">
            <Link href="/dashboard/leads/new"><Plus className="h-4 w-4" /> Add Lead</Link>
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-16 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold mb-1">No leads found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {status ? `No leads with status "${STATUS_LABELS[status as keyof typeof STATUS_LABELS]}"` : 'Add your first lead to get started.'}
            </p>
            <Button asChild><Link href="/dashboard/leads/new">Add a lead</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(lead => <LeadCard key={lead.id} lead={lead} />)}
          </div>
        )}
      </div>
    </div>
  )
}
