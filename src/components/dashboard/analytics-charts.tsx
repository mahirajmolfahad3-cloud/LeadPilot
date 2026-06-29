'use client'

import { Lead } from '@/types'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

interface AnalyticsChartsProps {
  leads: Lead[]
}

const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6366f1']

export function AnalyticsCharts({ leads }: AnalyticsChartsProps) {
  // Leads over last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return {
      name: format(date, 'MMM'),
      leads: leads.filter(l => isWithinInterval(new Date(l.created_at), { start, end })).length,
      won: leads.filter(l => l.status === 'won' && isWithinInterval(new Date(l.created_at), { start, end })).length,
    }
  })

  // Lead sources
  const sourceMap: Record<string, number> = {}
  leads.forEach(l => { sourceMap[l.source] = (sourceMap[l.source] || 0) + 1 })
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Status breakdown
  const statusMap: Record<string, number> = {}
  leads.forEach(l => { statusMap[l.status] = (statusMap[l.status] || 0) + 1 })
  const statusData = Object.entries(statusMap).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    value,
  }))

  // Won vs Lost
  const won = leads.filter(l => l.status === 'won').length
  const lost = leads.filter(l => l.status === 'lost').length
  const wonLostData = [
    { name: 'Won', value: won },
    { name: 'Lost', value: lost },
  ].filter(d => d.value > 0)

  const tooltipStyle = {
    contentStyle: {
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 8,
      fontSize: 12,
    },
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <p className="text-muted-foreground">No data to display yet. Add some leads to see analytics.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Leads over time */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-1">Leads Over Time</h3>
        <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={months}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="New leads" />
            <Line type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Won" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lead sources */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-1">Lead Sources</h3>
        <p className="text-xs text-muted-foreground mb-4">Where your leads come from</p>
        {sourceData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Won vs Lost */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-1">Won vs Lost</h3>
        <p className="text-xs text-muted-foreground mb-4">Closed deal outcomes</p>
        {wonLostData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">No closed deals yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={wonLostData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {wonLostData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status breakdown */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-1">Pipeline Breakdown</h3>
        <p className="text-xs text-muted-foreground mb-4">Leads by current status</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Leads">
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
