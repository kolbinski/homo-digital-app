import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../src/store/authStore'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export default function LoginScreen() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.message ?? 'Login failed. Check your credentials.')
        return
      }
      const data = await res.json()
      const { token, role, user_id, agent_id } = data
      await setAuth(token, role, user_id ?? agent_id)
      if (role === 'agent') {
        router.replace('/(agent)/dashboard')
      } else {
        router.replace('/(client)/applications')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-[#1a1a1a] mb-2">Homo Digital</Text>
        <Text className="text-base text-[#4a4a4a] mb-10">Sign in to your account</Text>

        <Text className="text-sm font-medium text-[#1a1a1a] mb-1">Email</Text>
        <TextInput
          className="border border-[#f0f0f0] rounded-lg px-4 py-3 mb-4 text-[#1a1a1a] bg-[#f9f9f9]"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="you@example.com"
          placeholderTextColor="#4a4a4a"
        />

        <Text className="text-sm font-medium text-[#1a1a1a] mb-1">Password</Text>
        <TextInput
          className="border border-[#f0f0f0] rounded-lg px-4 py-3 mb-6 text-[#1a1a1a] bg-[#f9f9f9]"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          placeholder="••••••••"
          placeholderTextColor="#4a4a4a"
        />

        {error && (
          <Text className="text-red-600 text-sm mb-4">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-[#1a1a1a] rounded-lg py-4 items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign in</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
