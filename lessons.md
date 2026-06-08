# lessons.md — homo-digital-app

## React Native / Expo
- Use expo-secure-store for JWT, never AsyncStorage (not encrypted)
- NativeWind v4 requires babel plugin AND metro config changes — follow official docs
- NativeWind v4 requires tailwindcss v3, NOT v4 (npm install -D tailwindcss@3)
- NativeWind v4 requires global.css with @tailwind directives + metro withNativeWind wrapper
- Expo Router requires app/ directory (not src/app/) at project root
- Expo Router: set package.json `main` to `expo-router/entry`, remove old index.ts and App.tsx
- expo-notifications requires physical device or EAS build — won't work in Expo Go for push
- Use Linking.openURL() to open offer URLs in device browser
- declarations.d.ts with `declare module '*.css' {}` needed for CSS import in TSC
- npm install of nativewind on Expo SDK 56 requires --legacy-peer-deps (react-dom peer dep conflict)
- create-expo-app refuses to init in a non-empty directory — move files out first, then restore
- FlatList: use keyExtractor with a stable unique id (user_offer_id), not array index
- contentContainerStyle on FlatList accepts plain object, not className — the one place inline style is unavoidable

## API
- Always use EXPO_PUBLIC_ prefix for env vars in Expo
- React Query v5: queryFn must be a function returning a promise, not the promise itself
- React Query: set staleTime to avoid excessive refetches on tab focus
- Handle 401 in service layer: clearAuth() + throw — React Query surfaces as isError
- 401 handling in service layer is cleaner than per-hook — single place to clear auth

## Formatting
- Always use formatNum() for number display, never toLocaleString()
- Salary delta: orange (text-orange-500) for positive, red (text-red-600) for negative
- Dates: format manually (D MMM YYYY) — no date-fns installed, keep bundle small

## General
- Test on physical device early — simulator misses many native behaviors
- EAS build needed for push notifications testing
