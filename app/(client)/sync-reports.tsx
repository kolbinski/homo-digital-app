import { useState, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Stack, useRouter, useFocusEffect } from 'expo-router'
import { useSyncReports } from '../../src/hooks/useSyncReports'
import type { SyncReportSummary } from '../../src/types/syncReport'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hh}:${mm}`
}

function SyncCard({ sync, onPress }: { sync: SyncReportSummary; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.date}>{formatDate(sync.created_at)}</Text>
      <View style={styles.counts}>
        <Text style={styles.countText}>
          Worth applying: <Text style={styles.countBold}>{sync.report?.worth_applying?.length ?? 0}</Text> offers
        </Text>
        <Text style={styles.countText}>
          Level up: <Text style={styles.countBold}>{sync.report?.level_up?.length ?? 0}</Text> offers
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function SyncReportsScreen() {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)
  const { data, isLoading, isError } = useSyncReports()

  useFocusEffect(
    useCallback(() => {
      setNavigating(false)
    }, [])
  )

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Reports',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.headerBar,
        }}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.messageText}>Failed to load reports.</Text>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SyncCard
              sync={item}
              onPress={() => {
                if (navigating) return
                setNavigating(true)
                router.push(`/(client)/sync-report/${item.id}`)
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.messageText}>No sync reports yet.</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerBar: {
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  messageText: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  counts: {
    gap: 4,
  },
  countText: {
    fontSize: 14,
    color: '#6b7280',
  },
  countBold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
})
