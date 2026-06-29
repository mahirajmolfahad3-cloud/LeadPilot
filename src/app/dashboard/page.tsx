import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { LeadCard } from '@/components/leads/lead-card'
import { Users, TrendingUp, Bell, Trophy, ArrowRight } from 'lucide-react'
import { Lead } from '@/types'
import { formatDate, isFollowUpOverdue, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allLeads: Lead[] = leads ?? []
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const totalLeads = allLeads.length
  const newThisMonth = allLeads.filter(l => l.created_at >= startOfMonth).length
  const converted = allLeads.filter(l => l.status === 'won').length
  const followUpsDue = allLeads.filter(l => {
    if (!l.follow_up_date) return false
    const d = new Date(l.follow_up_date)
    return d <= now && l.status !== 'won' && l.status !== 'lost'
  }).length

  const recentLeads = allLeads.slice(0, 5)
  const overdueLeads = allLeads.filter(l =>
    isFollowUpOverdue(l.follow_up_date) && l.status !== 'won' && l.status !== 'lost'
  ).slice(0, 3)

  const pipeline = ['new', 'contacted', 'qualified', 'proposal_sent', 'won'] as const
  const pipelineCounts = pipeline.map(stage => ({
    stage,
    count: allLeads.filter(l => l.status === stage).length,
  }))

  return (
    <div>
      <Header user={user} title="Overview" />
      <div className="p-6 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Leads" value={totalLeads} icon={Users} description="All time" colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <StatsCard title="New This Month" value={newThisMonth} icon={TrendingUp} description={new Date().toLocaleString('default', { month: 'long' })} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
          <StatsCard title="Follow-ups Due" value={followUpsDue} icon={Bell} description="Needs attention" colorClass={followUpsDue > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'} />
          <StatsCard title="Converted" value={converted} icon={Trophy} description="Won deals" colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Sales Pipeline</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pipeline" className="gap-1 text-sm">View board <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pipelineCounts.map(({ stage, count }, i) => (
              <div key={stage} className="flex items-center gap-2 shrink-0">
                <div className="text-center min-w-[90px]">
                  <div className={cn('rounded-lg p-4 mb-2', STATUS_COLORS[stage])}>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{STATUS_LABELS[stage]}</p>
                </div>
                {i < pipelineCounts.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent Leads</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/leads" className="gap-1 text-sm">View all <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
            {recentLeads.length === 0 ? (
              <div className="rounded-xl border bg-card p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium">No leads yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first lead to get started.</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/leads/new">Add a lead</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Follow-ups Due</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/followups" className="gap-1 text-sm">View all <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
            {overdueLeads.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No overdue follow-ups.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueLeads.map(lead => (
                  <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 p-4 hover:shadow-sm transition-shadow">
                      <Bell className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{lead.name}</p>
                        {lead.service && <p className="text-xs text-muted-foreground truncate">{lead.service}</p>}
                        <p className="text-xs text-red-500 mt-1">Due: {formatDate(lead.follow_up_date)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
