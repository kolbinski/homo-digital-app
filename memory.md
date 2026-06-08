# memory.md — homo-digital-app

## Project status
🟡 In setup — repo created, no code yet.

## Key decisions
- Expo Router for navigation (file-based, recommended for new projects)
- NativeWind for styling (Tailwind classes in React Native)
- Zustand for auth state (token, role, user_id)
- React Query for server state (caching, refetch)
- expo-secure-store for JWT storage (not AsyncStorage — more secure)
- expo-notifications for push (Expo Push API, free tier)

## API integration
- Base URL: https://job-matcher-api-production.up.railway.app
- Auth: POST /v1/auth/login (unified for agent + client)
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
