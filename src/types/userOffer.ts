export interface SalaryEntry {
  min: number | null
  max: number | null
  currency: string
  type: string | null
  delta: number | null
  delta_normalized: number | null
}

export interface UserOffer {
  user_offer_id: string
  offer_title: string
  offer_company: string
  offer_url: string
  claude_score: number
  claude_role_fit: string
  claude_missing_skills?: string[]
  claude_matched_reasons?: { pros: string[]; cons: string[] } | null
  skills_to_learn?: string[]
  salary: SalaryEntry[]
  source: string
  cv_language: string
  cv_url?: string | null
  cl_url?: string | null
  cl_status?: string | null
  status: string
  applied_at?: string
  matched_at: string
  created_at: string
  city?: string
  work_model?: string
}

export type OfferStatus =
  | 'applied'
  | 'agent_withdrawn'
  | 'recruiter_rejected'
  | 'offer_received'
  | 'accepted'
  | 'client_withdrawn'

export type OfferSource = 'all' | 'justjoin' | 'nofluffjobs'
