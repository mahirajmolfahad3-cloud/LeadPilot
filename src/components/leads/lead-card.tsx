'use client'

import Link from 'next/link'
import { Building2, Mail, Phone, Calendar, ArrowRight } from 'lucide-react'
import { Lead } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, PRIORITY_LABELS, formatDate, isFollowUpOverdue } from '@/lib/utils'

interface LeadCardProps {
  lead: Lead
}

export function LeadCard({ lead }: LeadCardProps) {
  const overdue = isFollowUpOverdue(lead.follow_up_date)

  return (
    <Link href={`/dashboard/leads/${lead.id}`}>
      <div className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold leading-none">{lead.name}</p>
            {lead.company && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" /> {lead.company}
              </p>
            )}
          </div>
          <div className="flex gap-1.5 shrink-0">
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[lead.status])}>
              {STATUS_LABELS[lead.status]}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1">
          {lead.email && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" /> {lead.email}
            </p>
          )}
          {lead.phone && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" /> {lead.phone}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t">
          <div className="flex items-center gap-2">
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', PRIORITY_COLORS[lead.priority])}>
              {PRIORITY_LABELS[lead.priority]}
            </span>
            {lead.service && (
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{lead.service}</span>
            )}
          </div>
          {lead.follow_up_date && (
            <p className={cn('flex items-center gap-1 text-xs', overdue ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
              <Calendar className="h-3 w-3" /> {formatDate(lead.follow_up_date)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
