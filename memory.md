# memory.md — homo-digital-app

## Project status
🟢 Setup complete — Expo app initialized, all base files in place.

## Key decisions
- Expo Router for navigation (file-based, recommended for new projects)
- NativeWind v4 for styling — requires tailwindcss v3 (not v4), babel plugin, metro withNativeWind wrapper, global.css entry point
- Zustand for auth state (token, role, user_id) — stored in SecureStore
- React Query v5 for server state (staleTime: 5min default)
- expo-secure-store for JWT storage (not AsyncStorage)
- expo-notifications for push (Expo Push API, free tier)
- package.json `main` set to `expo-router/entry` (not index.ts)
- declarations.d.ts added for CSS module type declarations

## API integration
- Base URL: https://job-matcher-api-production.up.railway.app (EXPO_PUBLIC_API_URL)
- Auth: POST /v1/auth/login → { token, role, user_id?, agent_id? }
- Client offers: GET /v1/user-offers?status=applied
- Sync reports: user_syncs table (new, added for mobile)
- Push tokens: POST /v1/push-tokens (to be implemented in API)

## Test accounts
- Agent: krzysztof.olbinski@homodigital.io / agent123
- Client (Marek): marek.wisniewski.it@gmail.com / client123
- Client (Teodor): TBD after onboarding

## Pending API work
- POST /v1/push-tokens endpoint (not yet implemented)
- GET /v1/user-syncs (not yet implemented)
- Push notification sending from syncService

## Related repos
- job-matcher-api: github.com/kolbinski/job-matcher-api
- homo-digital-extension: github.com/kolbinski/homo-digital-extension
