import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

export type Role = 'agent' | 'client'

interface AuthState {
  token: string | null
  role: Role | null
  userId: string | null
  setAuth: (token: string, role: Role, userId?: string) => void
  clearAuth: () => void
  hydrate: () => Promise<void>
}

const TOKEN_KEY = 'auth_token'
const ROLE_KEY = 'auth_role'
const USER_ID_KEY = 'auth_user_id'

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  userId: null,

  setAuth: async (token, role, userId) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    await SecureStore.setItemAsync(ROLE_KEY, role)
    if (userId) await SecureStore.setItemAsync(USER_ID_KEY, userId)
    set({ token, role, userId: userId ?? null })
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(ROLE_KEY)
    await SecureStore.deleteItemAsync(USER_ID_KEY)
    set({ token: null, role: null, userId: null })
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY)
      const role = await SecureStore.getItemAsync(ROLE_KEY) as Role | null
      const userId = await SecureStore.getItemAsync(USER_ID_KEY)
      if (token && role) {
        set({ token, role, userId })
      }
    } catch {
      // SecureStore unavailable (web/dev) — stay unauthenticated
    }
  },
}))
