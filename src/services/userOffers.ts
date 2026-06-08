import { useAuthStore } from '../store/authStore'
import type { UserOffer, OfferStatus, OfferSource } from '../types/userOffer'

const API_URL = process.env.EXPO_PUBLIC_API_URL

interface GetOffersParams {
  userId: string
  status?: OfferStatus
  source?: OfferSource
  page?: number
}

async function getOffers(params: GetOffersParams): Promise<UserOffer[]> {
  const token = useAuthStore.getState().token
  const query = new URLSearchParams()
  query.append('client_id', params.userId)
  query.append('status', params.status ?? 'applied')
  if (params.source && params.source !== 'all') query.append('source', params.source)
  if (params.page) query.append('page', String(params.page))

  const fullUrl = `${API_URL}/v1/user-offers?${query.toString()}`
  console.log('API URL:', fullUrl)
  console.log('Token:', token ? `${token.slice(0, 20)}...` : 'null/empty')

  let res: Response
  try {
    res = await fetch(fullUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.log('API fetch error (network):', error)
    throw error
  }

  console.log('API response status:', res.status)

  if (res.status === 401) {
    useAuthStore.getState().clearAuth()
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.log('API error body:', body)
    throw new Error(`HTTP ${res.status}`)
  }

  return res.json()
}

export const userOffersService = { getOffers }
