import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { DeleteLeadButton } from '@/components/leads/delete-lead-button'
import { AddNoteForm } from '@/components/leads/add-note-form'
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Tag,
  Edit,
  ArrowLeft,
  Clock,
  FileText,
  Activity,
} from 'lucide-react'
import {
  cn,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
  formatDate,
} from '@/lib/utils'
import { LeadStatus, LeadPriority, LeadSource } from '@/types'

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!lead) notFound()

  const { data: notes } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: false })

  const { data: activities } = await supabase
    .from('lead_activity')
    .select('*')
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <Header user={user} />

      <div className="max-w-5xl space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard/leads">
              <ArrowLeft className="h-4 w-4" />
              Back to leads
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href={`/dashboard/leads/${lead.id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>

            <DeleteLeadButton leadId={lead.id} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
              <div>
                <h1 className="text-xl font-bold">{lead.name}</h1>

                {lead.company && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {lead.company}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    STATUS_COLORS[lead.status as LeadStatus]
                  )}
                >
                  {STATUS_LABELS[lead.status as LeadStatus]}
                </span>

                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    PRIORITY_COLORS[lead.priority as LeadPriority]
                  )}
                >
                  {PRIORITY_LABELS[lead.priority as LeadPriority]} priority
                </span>
              </div>

              <div className="space-y-2 border-t pt-2">
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {lead.email}
                  </a>
                )}

                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {lead.phone}
                  </a>
                )}

                {lead.service && (
                  <p className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {lead.service}
                  </p>
                )}

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 shrink-0" />
                  Source:{' '}
                  {SOURCE_LABELS[lead.source as LeadSource]}
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                {formatDate(lead.created_at)}
              </p>

              {lead.follow_up_date && (
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Follow-up:</span>

                  <span
                    className={
                      new Date(lead.follow_up_date) < new Date()
                        ? 'font-medium text-red-500'
                        : ''
                    }
                  >
                    {formatDate(lead.follow_up_date)}
                  </span>
                </p>
              )}
            </div>

            {lead.notes && (
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Initial Notes
                </p>

                <p className="whitespace-pre-wrap text-sm">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" />
                Add Note
              </h2>

              <AddNoteForm leadId={lead.id} userId={user.id} />
            </div>

            {notes && notes.length > 0 && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">
                  Notes ({notes.length})
                </h2>

                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg bg-muted/50 p-4"
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {note.content}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(note.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activities && activities.length > 0 && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-semibold">
                  <Activity className="h-4 w-4" />
                  Activity
                </h2>

                <div className="space-y-3">
                  {activities.map((activity, i) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />

                        {i < activities.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        )}
                      </div>

                      <div className="pb-3">
                        <p className="text-sm">{activity.description}</p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}