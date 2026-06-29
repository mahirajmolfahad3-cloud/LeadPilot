'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Calendar, GripVertical } from 'lucide-react'
import { Lead, LeadStatus } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { cn, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, formatDate } from '@/lib/utils'

const COLUMNS: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']

const COLUMN_STYLES: Record<LeadStatus, string> = {
  new: 'border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/5',
  contacted: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-900/5',
  qualified: 'border-purple-200 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/5',
  proposal_sent: 'border-orange-200 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-900/5',
  won: 'border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/5',
  lost: 'border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/5',
}

const HEADER_STYLES: Record<LeadStatus, string> = {
  new: 'text-blue-700 dark:text-blue-400',
  contacted: 'text-yellow-700 dark:text-yellow-400',
  qualified: 'text-purple-700 dark:text-purple-400',
  proposal_sent: 'text-orange-700 dark:text-orange-400',
  won: 'text-green-700 dark:text-green-400',
  lost: 'text-red-700 dark:text-red-400',
}

interface PipelineBoardProps {
  initialLeads: Lead[]
  userId: string
}

export function PipelineBoard({ initialLeads, userId }: PipelineBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null)
  const supabase = createClient()

  const leadsInColumn = (status: LeadStatus) => leads.filter(l => l.status === status)

  function handleDragStart(e: React.DragEvent, leadId: string) {
    e.dataTransfer.setData('leadId', leadId)
    setDragging(leadId)
  }

  function handleDragEnd() {
    setDragging(null)
    setDragOver(null)
  }

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault()
    setDragOver(status)
  }

  async function handleDrop(e: React.DragEvent, newStatus: LeadStatus) {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('leadId')
    setDragging(null)
    setDragOver(null)

    const lead = leads.find(l => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    await supabase.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', leadId)
    await supabase.from('lead_activity').insert({
      lead_id: leadId, user_id: userId,
      type: 'status_changed',
      description: `Moved to ${STATUS_LABELS[newStatus]}`,
    })
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-200px)]">
      {COLUMNS.map(status => {
        const colLeads = leadsInColumn(status)
        const isOver = dragOver === status
        return (
          <div
            key={status}
            className={cn(
              'flex-shrink-0 w-72 rounded-xl border-2 transition-all',
              COLUMN_STYLES[status],
              isOver && 'ring-2 ring-primary ring-offset-2 scale-[1.01]'
            )}
            onDragOver={e => handleDragOver(e, status)}
            onDrop={e => handleDrop(e, status)}
          >
            {/* Column header */}
            <div className="p-3 border-b border-current/10">
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-semibold', HEADER_STYLES[status])}>
                  {STATUS_LABELS[status]}
                </span>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', HEADER_STYLES[status], 'bg-current/10')}>
                  {colLeads.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[100px]">
              {colLeads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={e => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'rounded-lg border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing select-none transition-all',
                    dragging === lead.id && 'opacity-40 scale-95'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-medium text-sm hover:text-primary transition-colors block truncate"
                        onClick={e => e.stopPropagation()}
                        draggable={false}
                      >
                        {lead.name}
                      </Link>
                      {lead.company && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                          <Building2 className="h-3 w-3 shrink-0" /> {lead.company}
                        </p>
                      )}
                      {lead.service && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.service}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className={cn('inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium', PRIORITY_COLORS[lead.priority])}>
                          {PRIORITY_LABELS[lead.priority]}
                        </span>
                        {lead.follow_up_date && (
                          <span className={cn('flex items-center gap-0.5 text-xs', new Date(lead.follow_up_date) < new Date() ? 'text-red-500' : 'text-muted-foreground')}>
                            <Calendar className="h-3 w-3" /> {formatDate(lead.follow_up_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {colLeads.length === 0 && (
                <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-current/20">
                  <p className="text-xs text-muted-foreground">Drop here</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
