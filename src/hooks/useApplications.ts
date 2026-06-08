import { useQuery } from '@tanstack/react-query'
import { userOffersService } from '../services/userOffers'
import type { OfferStatus, OfferSource } from '../types/userOffer'

export function useApplications(status?: OfferStatus, source?: OfferSource) {
  return useQuery({
    queryKey: ['applications', status, source],
    queryFn: () => userOffersService.getOffers({ status, source }),
    staleTime: 5 * 60 * 1000,
  })
}
