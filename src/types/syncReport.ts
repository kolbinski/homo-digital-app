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
  skills_to_learn?: string[]
  status?: string | null
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
