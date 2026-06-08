import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export async function registerPushToken(apiUrl: string, token: string): Promise<void> {
  if (!Device.isDevice) return

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied')
    return
  }

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync()

    await fetch(`${apiUrl}/v1/push-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: pushToken.data,
        platform: Platform.OS,
      }),
    })
  } catch (err) {
    console.log('Push token registration failed (non-critical):', err)
  }
}
