import { useAuthStore } from '../store/authStore'
import type { UserOffer, OfferStatus, OfferSource } from '../types/userOffer'

const API_URL = process.env.EXPO_PUBLIC_API_URL

interface GetOffersParams {
  status?: OfferStatus
  source?: OfferSource
  page?: number
}

async function getOffers(params: GetOffersParams = {}): Promise<UserOffer[]> {
  const token = useAuthStore.getState().token
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.source && params.source !== 'all') query.set('source', params.source)
  if (params.page) query.set('page', String(params.page))

  const res = await fetch(`${API_URL}/v1/user-offers?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) {
    useAuthStore.getState().clearAuth()
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return res.json()
}

export const userOffersService = { getOffers }
