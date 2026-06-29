'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lead } from '@/types'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.enum(['website', 'facebook', 'referral', 'instagram', 'linkedin', 'other']),
  service: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']),
  priority: z.enum(['low', 'medium', 'high']),
  notes: z.string().optional(),
  follow_up_date: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface LeadFormProps {
  lead?: Lead
  userId: string
}

export function LeadForm({ lead, userId }: LeadFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      phone: lead?.phone ?? '',
      company: lead?.company ?? '',
      source: lead?.source ?? 'website',
      service: lead?.service ?? '',
      status: lead?.status ?? 'new',
      priority: lead?.priority ?? 'medium',
      notes: lead?.notes ?? '',
      follow_up_date: lead?.follow_up_date ? lead.follow_up_date.split('T')[0] : '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...data,
        user_id: userId,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        notes: data.notes || null,
        follow_up_date: data.follow_up_date || null,
        updated_at: new Date().toISOString(),
      }

      if (lead) {
        const { error } = await supabase.from('leads').update(payload).eq('id', lead.id)
        if (error) throw error
        // Log activity
        await supabase.from('lead_activity').insert({
          lead_id: lead.id, user_id: userId,
          type: 'updated', description: 'Lead information updated',
        })
      } else {
        const { data: newLead, error } = await supabase.from('leads').insert(payload).select().single()
        if (error) throw error
        await supabase.from('lead_activity').insert({
          lead_id: newLead.id, user_id: userId,
          type: 'created', description: 'Lead created',
        })
      }
      router.push('/dashboard/leads')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" placeholder="John Smith" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@company.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1 (555) 000-0000" {...register('phone')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Inc." {...register('company')} />
        </div>

        <div className="space-y-2">
          <Label>Source</Label>
          <Select defaultValue={watch('source')} onValueChange={(v) => setValue('source', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service Interested In</Label>
          <Input id="service" placeholder="Website redesign, SEO..." {...register('service')} />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue={watch('status')} onValueChange={(v) => setValue('status', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select defaultValue={watch('priority')} onValueChange={(v) => setValue('priority', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="follow_up_date">Follow-up Date</Label>
          <Input id="follow_up_date" type="date" {...register('follow_up_date')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Add any relevant details about this lead..." rows={4} {...register('notes')} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {lead ? 'Save changes' : 'Add lead'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
