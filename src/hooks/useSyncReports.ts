import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { userSyncsService } from '../services/userSyncs'

export function useSyncReports() {
  const { token } = useAuthStore()
  return useQuery({
    queryKey: ['syncReports'],
    queryFn: () => userSyncsService.getSyncs(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSyncReport(id: string) {
  const { token } = useAuthStore()
  return useQuery({
    queryKey: ['syncReport', id],
    queryFn: () => userSyncsService.getSyncById(id),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  })
}
