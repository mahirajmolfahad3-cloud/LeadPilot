import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Lead } from '@/types'
import { TrendingUp, Target, Users, Trophy } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: leads } = await supabase
    .from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: true })

  const allLeads: Lead[] = leads ?? []
  const total = allLeads.length
  const won = allLeads.filter(l => l.status === 'won').length
  const lost = allLeads.filter(l => l.status === 'lost').length
  const closed = won + lost
  const conversionRate = closed > 0 ? Math.round((won / closed) * 100) : 0
  const active = allLeads.filter(l => l.status !== 'won' && l.status !== 'lost').length

  return (
    <div>
      <Header user={user} title="Analytics" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Leads" value={total} icon={Users} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <StatsCard title="Active Pipeline" value={active} icon={TrendingUp} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
          <StatsCard title="Conversion Rate" value={`${conversionRate}%`} icon={Target} description="Won / (Won + Lost)" colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
          <StatsCard title="Won Deals" value={won} icon={Trophy} colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        </div>
        <AnalyticsCharts leads={allLeads} />
      </div>
    </div>
  )
}
