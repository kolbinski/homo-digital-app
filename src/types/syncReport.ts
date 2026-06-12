import type { SalaryEntry } from './userOffer'

export interface SyncReportOffer {
  id: string
  title: string
  company: string
  url?: string
  score: number
  role_fit?: string
  salary?: SalaryEntry[]
  work_model?: string
  city?: string
  source?: string
  missing_skills?: string[]
  matched_reasons?: { pros: string[]; cons: string[] } | null
  skills_to_learn?: string[]
  status?: string | null
  cl_url?: string | null
  cl_status?: string | null
}

export interface SyncReportData {
  worth_applying: SyncReportOffer[]
  level_up: SyncReportOffer[]
  worth_considering?: SyncReportOffer[]
  scanned?: number
}

export interface SyncReportSummary {
  id: string
  created_at: string
  report: SyncReportData
}
