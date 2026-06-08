export interface SalaryEntry {
  min: number
  max: number
  currency: string
  type: string
  delta: number
  delta_normalized: number
}

export interface UserOffer {
  user_offer_id: string
  offer_title: string
  company_name: string
  work_model: string
  city: string | null
  salary: SalaryEntry[]
  claude_score: number
  role_fit: string
  offer_url: string
  cv_language: string
  status: string
  created_at: string
}

export type OfferStatus =
  | 'applied'
  | 'agent_withdrawn'
  | 'recruiter_rejected'
  | 'offer_received'
  | 'accepted'
  | 'client_withdrawn'

export type OfferSource = 'all' | 'justjoin' | 'nofluffjobs'
