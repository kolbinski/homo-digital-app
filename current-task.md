# current-task.md — homo-digital-app

## Current task
Project setup — COMPLETE.

## Completed
- [x] npx create-expo-app@latest . --template blank-typescript
- [x] Install dependencies: nativewind, zustand, react-query, expo-secure-store, expo-notifications, expo-router
- [x] Configure NativeWind (tailwind.config.js, babel.config.js, metro.config.js, global.css)
- [x] Configure Expo Router (app/ directory, _layout.tsx, index.tsx)
- [x] Create auth store (Zustand + SecureStore hydration)
- [x] Create login screen with email/password form
- [x] POST /v1/auth/login with role-based redirect
- [x] Stub screens: (client)/applications, (agent)/dashboard
- [x] formatNum() utility
- [x] npx tsc --noEmit → 0 errors

## Next
- Client: My Applications screen (GET /v1/user-offers?status=applied)
  - Offer cards with title, company, work model, location, salary, status, date
  - Filters: status select, source select
- Client: Sync Report screen (GET /v1/user-syncs/:id)
- Push notification registration on login → POST /v1/push-tokens
- Agent: Dashboard screen (list of clients)
- Agent: Client detail screen
