import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Notifications from 'expo-notifications'
import { useLastNotificationResponse } from 'expo-notifications'
import { useAuthStore } from '../src/store/authStore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
})

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const router = useRouter()
  const lastNotificationResponse = useLastNotificationResponse()

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (lastNotificationResponse) {
      const data = lastNotificationResponse.notification.request.content.data
      if (data?.type === 'sync_complete' && data?.user_sync_id) {
        router.push('/(client)/sync-report/' + data.user_sync_id)
      } else if (data?.type === 'sync_complete') {
        router.push('/(client)/sync-reports')
      }
    }
  }, [lastNotificationResponse])

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data
      if (data?.type === 'applied') {
        router.push('/(client)/applications')
      }
      if (data?.type === 'sync_complete') {
        if (data.user_sync_id) {
          router.push('/(client)/sync-report/' + data.user_sync_id)
        } else {
          router.push('/(client)/sync-reports')
        }
      }
    })
    return () => sub.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
