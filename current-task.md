# current-task.md — homo-digital-app

## Current task
Project setup — initialize Expo app with correct stack.

## Steps
- [ ] npx create-expo-app@latest homo-digital-app --template blank-typescript
- [ ] Install dependencies: nativewind, zustand, react-query, expo-secure-store, expo-notifications, expo-router
- [ ] Configure NativeWind (tailwind.config.js, babel.config.js)
- [ ] Configure Expo Router (app directory structure)
- [ ] Create auth store (Zustand)
- [ ] Create login screen
- [ ] Connect to POST /v1/auth/login
- [ ] Route to agent or client view based on role

## Next after setup
- Client: My Applications screen (GET /v1/user-offers?status=applied)
- Client: Sync Report screen
- Push notification registration
