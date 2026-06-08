# lessons.md — homo-digital-app

## React Native / Expo
- **SDK version must match Expo Go on device** — Expo Go 54.0.8 requires SDK 54; SDK 56 will not load
- Downgrading SDK: `npm install expo@~54.0.0 --legacy-peer-deps` then manually pin all native modules to SDK 54 versions (npx expo install --fix fails without --legacy-peer-deps)
- **After any SDK downgrade, always run `npx expo install react react-native`** — this pins them to the exact versions Expo expects; `^` ranges left in package.json will resolve to newer versions that cause mismatch warnings
- SDK downgrade requires manual install of all mismatched packages — check `npx expo-doctor` output for the list
- **Auth hydration pattern: always use a `hydrated: boolean` flag in Zustand** — `token: null` is ambiguous (could mean "not yet loaded" or "no token"); without a flag, index.tsx blocks forever on first launch. Set `hydrated: true` in both the success and no-token branches of `hydrate()`, and in the catch block. Gate navigation on `if (!hydrated) return`, not `if (token === null) return`
- **NativeWind v4 is incompatible with Expo SDK 54 — do not use.** Babel peer dependency conflicts between react-native-reanimated (requires RN 0.83-0.86) and SDK 54 (uses RN 0.81.5) cannot be cleanly resolved
- **Use React Native StyleSheet for all styling** — it is the stable, zero-dependency approach for SDK 54
- StatusSheet color pattern: define STATUS_BG and STATUS_TEXT as plain hex string Record maps, apply via style prop — no className needed
- Salary delta color: use inline `{ color: '#f97316' }` for orange, `{ color: '#dc2626' }` for red
- `gap` in StyleSheet requires RN 0.71+ — supported in SDK 54 (RN 0.81.5)
- Expo Router requires app/ directory (not src/app/) at project root
- Expo Router: set package.json `main` to `expo-router/entry`, remove old index.ts and App.tsx
- expo-notifications requires physical device or EAS build — won't work in Expo Go for push
- Use react-native-webview + Expo Router push for in-app URL viewing — prefer over Linking.openURL() for offer URLs so users stay in the app
- npm install with --legacy-peer-deps needed throughout SDK 54 project
- create-expo-app refuses to init in a non-empty directory — move files out first, then restore
- FlatList: use keyExtractor with a stable unique id (user_offer_id), not array index

## API
- Always use EXPO_PUBLIC_ prefix for env vars in Expo
- React Query v5: queryFn must be a function returning a promise, not the promise itself
- React Query: set staleTime to avoid excessive refetches on tab focus
- Handle 401 in service layer: clearAuth() + throw — React Query surfaces as isError
- 401 handling in service layer is cleaner than per-hook — single place to clear auth

## Formatting
- Always use formatNum() for number display, never toLocaleString()
- Salary delta: orange (#f97316) for positive, red (#dc2626) for negative
- Dates: format manually (D MMM YYYY) — no date-fns installed, keep bundle small

## Auth / Navigation
- **Never call router.replace() during render** — causes "setState during render" warning/crash. Always wrap in useEffect: `useEffect(() => { if (hydrated && !token) router.replace(...) }, [hydrated, token])`
- **All hooks must be called before any conditional return** — React rules of hooks. If auth guard has an early return, move useState/useEffect/useQuery above it, not after
- **clearAuth() must set `hydrated: true`** — after logout, index.tsx gates on `hydrated`; if clearAuth only nulls the token without setting hydrated, the loader hangs on re-entry
- **Stack.Screen inside a screen component overrides root layout options** — root layout can use `headerShown: false` globally; individual screens opt in by rendering `<Stack.Screen options={{ headerShown: true, ... }}>` in their return
- **phosphor-react-native requires react-native-svg** — install both: `npx expo install react-native-svg && npm install phosphor-react-native --legacy-peer-deps`

## General
- Test on physical device early — simulator misses many native behaviors
- EAS build needed for push notifications testing
