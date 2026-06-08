import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Notifications from 'expo-notifications'
import { useAuthStore } from '../src/store/authStore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
})

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
