import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Lead } from '@/types'
import { Bell, Calendar, Building2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default async function FollowupsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .not('follow_up_date', 'is', null)
    .not('status', 'in', '("won","lost")')
    .order('follow_up_date', { ascending: true })

  const allLeads: Lead[] = leads ?? []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const overdue = allLeads.filter(l => l.follow_up_date && new Date(l.follow_up_date) < today)
  const dueToday = allLeads.filter(l => {
    if (!l.follow_up_date) return false
    const d = new Date(l.follow_up_date)
    return d >= today && d < tomorrow
  })
  const upcoming = allLeads.filter(l => l.follow_up_date && new Date(l.follow_up_date) >= tomorrow)

  function LeadSection({ title, leads, variant }: { title: string; leads: Lead[]; variant: 'overdue' | 'today' | 'upcoming' }) {
    if (leads.length === 0) return null
    return (
      <div className="space-y-3">
        <h2 className={cn(
          'font-semibold text-sm uppercase tracking-wider',
          variant === 'overdue' ? 'text-red-500' : variant === 'today' ? 'text-amber-500' : 'text-muted-foreground'
        )}>
          {title} · {leads.length}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map(lead => (
            <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
              <div className={cn(
                'flex gap-3 rounded-xl border p-4 hover:shadow-sm transition-all',
                variant === 'overdue' ? 'border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/5' :
                variant === 'today' ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/5' :
                'bg-card'
              )}>
                <Bell className={cn(
                  'h-4 w-4 mt-0.5 shrink-0',
                  variant === 'overdue' ? 'text-red-500' : variant === 'today' ? 'text-amber-500' : 'text-muted-foreground'
                )} />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium text-sm">{lead.name}</p>
                  {lead.company && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {lead.company}
                    </p>
                  )}
                  {lead.service && <p className="text-xs text-muted-foreground">{lead.service}</p>}
                  <div className="flex items-center justify-between pt-1">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[lead.status])}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                    <span className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      variant === 'overdue' ? 'text-red-500' : variant === 'today' ? 'text-amber-600' : 'text-muted-foreground'
                    )}>
                      <Calendar className="h-3 w-3" /> {formatDate(lead.follow_up_date)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header user={user} title="Follow-ups" />
      <div className="p-6 space-y-8">
        {allLeads.length === 0 ? (
          <div className="rounded-xl border bg-card p-16 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500/40 mb-4" />
            <h3 className="font-semibold mb-1">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              No follow-ups scheduled. Set follow-up dates when adding or editing leads.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/leads">View leads</Link>
            </Button>
          </div>
        ) : (
          <>
            <LeadSection title="Overdue" leads={overdue} variant="overdue" />
            <LeadSection title="Due today" leads={dueToday} variant="today" />
            <LeadSection title="Upcoming" leads={upcoming} variant="upcoming" />
          </>
        )}
      </div>
    </div>
  )
}
