# memory.md — homo-digital-app

## Project status
🟢 My Applications screen complete. SDK downgraded to 54 to match Expo Go 54.0.8 on device.

## Key decisions
- **Expo SDK 54** — pinned to match Expo Go 54.0.8 on device; never upgrade without updating Expo Go first
- Expo Router for navigation (file-based)
- NativeWind v4 — requires tailwindcss v3, babel plugin, metro withNativeWind, global.css
- Zustand for auth state (token, role, user_id) — stored in SecureStore
- React Query v5 for server state (staleTime: 5min default)
- expo-secure-store for JWT — 401 from API triggers clearAuth + redirect
- package.json `main` = `expo-router/entry`
- declarations.d.ts for CSS module types
- OfferStatus and OfferSource typed as union types in src/types/userOffer.ts
- 401 handling in service layer: clearAuth() + throw — screen catches via isError
- Filter state lives in screen component (useState), not in Zustand (local UI state)

## API integration
- Base URL: EXPO_PUBLIC_API_URL
- Auth: POST /v1/auth/login → { token, role, user_id?, agent_id? }
- Client offers: GET /v1/user-offers?status=&source= (both optional)
- Sync reports: GET /v1/user-syncs/:id (not yet implemented)
- Push tokens: POST /v1/push-tokens (not yet implemented in API)

## Test accounts
- Agent: krzysztof.olbinski@homodigital.io / agent123
- Client (Marek): marek.wisniewski.it@gmail.com / client123
- Client (Teodor): TBD after onboarding

## Pending API work
- POST /v1/push-tokens endpoint
- GET /v1/user-syncs endpoint

## Related repos
- job-matcher-api: github.com/kolbinski/job-matcher-api
- homo-digital-extension: github.com/kolbinski/homo-digital-extension
