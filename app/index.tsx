import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuthStore } from '../src/store/authStore'

export default function Index() {
  const router = useRouter()
  const { token, role, hydrated } = useAuthStore()

  useEffect(() => {
    if (!hydrated) return
    if (!token) {
      router.replace('/(auth)/login')
    } else if (role === 'agent') {
      router.replace('/(agent)/dashboard')
    } else {
      router.replace('/(client)/applications')
    }
  }, [hydrated, token, role])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1a1a1a" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
})
