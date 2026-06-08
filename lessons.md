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

## API
- Always use EXPO_PUBLIC_ prefix for env vars in Expo
- React Query: set staleTime to avoid excessive refetches on tab focus
- Handle 401 globally — clear token and redirect to login

## Formatting
- Always use formatNum() for number display, never toLocaleString()
- Salary delta: orange for positive, red for negative

## General
- Test on physical device early — simulator misses many native behaviors
- EAS build needed for push notifications testing
