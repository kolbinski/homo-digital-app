import { useAuthStore } from '../store/authStore'
import type { SyncReportSummary } from '../types/syncReport'

const API_URL = process.env.EXPO_PUBLIC_API_URL

async function getSyncs(): Promise<SyncReportSummary[]> {
  const token = useAuthStore.getState().token
  const res = await fetch(`${API_URL}/v1/user-syncs`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) {
    useAuthStore.getState().clearAuth()
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.syncs ?? data ?? []
}

async function getSyncById(id: string): Promise<SyncReportSummary> {
  const token = useAuthStore.getState().token
  const res = await fetch(`${API_URL}/v1/user-syncs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) {
    useAuthStore.getState().clearAuth()
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const userSyncsService = { getSyncs, getSyncById }
