import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { userOffersService } from '../services/userOffers'
import type { OfferStatus, OfferSource } from '../types/userOffer'

export function useApplications(
  status?: OfferStatus,
  source?: OfferSource,
  date?: Date | null,
) {
  const { userId } = useAuthStore()

  return useQuery({
    queryKey: ['applications', userId, status, source, date?.toISOString() ?? null],
    queryFn: () => userOffersService.getOffers({
      userId: userId!,
      status,
      source,
      date: date ?? undefined,
    }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
