export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
export type LeadPriority = 'low' | 'medium' | 'high'
export type LeadSource = 'website' | 'facebook' | 'referral' | 'instagram' | 'linkedin' | 'other'

export interface Lead {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  source: LeadSource
  service: string | null
  status: LeadStatus
  priority: LeadPriority
  notes: string | null
  follow_up_date: string | null
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: string
  lead_id: string
  user_id: string
  content: string
  created_at: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  user_id: string
  type: string
  description: string
  created_at: string
}

export interface DashboardStats {
  totalLeads: number
  newThisMonth: number
  followUpsDue: number
  converted: number
}
