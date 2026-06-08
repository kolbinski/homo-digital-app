import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'phosphor-react-native'

export default function OfferScreen() {
  const { url } = useLocalSearchParams<{ url: string }>()
  const router = useRouter()

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  webview: {
    flex: 1,
  },
})
