# lessons.md — homo-digital-app

## React Native / Expo
- Use expo-secure-store for JWT, never AsyncStorage (not encrypted)
- NativeWind v4 requires babel plugin AND metro config changes — follow official docs
- Expo Router requires app/ directory (not src/app/) at project root
- expo-notifications requires physical device or EAS build — won't work in Expo Go for push
- Use Linking.openURL() to open offer URLs in device browser

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
