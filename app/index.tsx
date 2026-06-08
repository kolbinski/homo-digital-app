import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../src/store/authStore'

export default function Index() {
  const router = useRouter()
  const { token, role } = useAuthStore()

  useEffect(() => {
    if (token === null) return // still hydrating
    if (!token) {
      router.replace('/(auth)/login')
    } else if (role === 'agent') {
      router.replace('/(agent)/dashboard')
    } else {
      router.replace('/(client)/applications')
    }
  }, [token, role])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#1a1a1a" />
    </View>
  )
}
