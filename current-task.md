# current-task.md — homo-digital-app

## Current task
Client: My Applications screen — COMPLETE.

## Completed
- [x] npx create-expo-app@latest . --template blank-typescript
- [x] Install dependencies: nativewind, zustand, react-query, expo-secure-store, expo-notifications, expo-router
- [x] Configure NativeWind (tailwind.config.js, babel.config.js, metro.config.js, global.css)
- [x] Configure Expo Router (app/ directory, _layout.tsx, index.tsx)
- [x] Create auth store (Zustand + SecureStore hydration)
- [x] Create login screen with email/password form
- [x] POST /v1/auth/login with role-based redirect
- [x] formatNum() utility
- [x] src/types/userOffer.ts — UserOffer, SalaryEntry, OfferStatus, OfferSource types
- [x] src/services/userOffers.ts — getOffers() with status/source/page params + 401 handling
- [x] src/hooks/useApplications.ts — React Query hook, staleTime 5min
- [x] src/components/OfferCard.tsx — full card with salary lines, delta coloring, date, status badge
- [x] app/(client)/applications.tsx — header, filter pills (status + source), FlatList, pull-to-refresh, loading/error/empty states
- [x] npx tsc --noEmit → 0 errors

## Screen completion summary
Screen: My Applications — /(client)/applications
Data source: GET /v1/user-offers
Role: client
OV checkpoints passed: loading ✅ error ✅ empty ✅ pull-to-refresh ✅ formatNum ✅ delta color ✅ auth guard ✅ no inline styles ✅ 0 TS errors ✅
Push notifications: no
Observable signal: filter pills change → new fetch; offer tap → opens browser
Lessons learned: none

## Next
- Client: Sync Report screen (GET /v1/user-syncs/:id)
- Push notification registration on login → POST /v1/push-tokens
- Agent: Dashboard screen (list of clients)
- Agent: Client detail screen
