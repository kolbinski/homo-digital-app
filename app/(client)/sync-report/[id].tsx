import { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ArrowCircleUp } from 'phosphor-react-native'
import { useSyncReport } from '../../../src/hooks/useSyncReports'
import { SyncReportOfferCard } from '../../../src/components/SyncReportOfferCard'
import { formatNum } from '../../../src/utils/formatNum'
import type { SyncReportOffer } from '../../../src/types/syncReport'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle}>{title}</Text>
  )
}

export default function SyncReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: sync, isLoading, isError } = useSyncReport(id)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const report = sync?.report
  const worthApplying: SyncReportOffer[] = report?.worth_applying ?? []
  const levelUp: SyncReportOffer[] = report?.level_up ?? []
  const scanned = report?.scanned

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: sync ? `Report for ${formatDate(sync.created_at)}` : 'Report',
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
          <Text style={styles.messageText}>Failed to load report.</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          onScroll={e => setShowScrollTop(e.nativeEvent.contentOffset.y > 200)}
          scrollEventThrottle={16}
        >
          {scanned != null && (
            <View style={styles.scannedBox}>
              <Text style={styles.scannedCount}>{formatNum(scanned)}</Text>
              <Text style={styles.scannedLabel}>new offers scanned</Text>
            </View>
          )}

          {worthApplying.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Worth applying" />
              {worthApplying.map(offer => (
                <SyncReportOfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          )}

          {levelUp.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Level up & earn more" />
              {levelUp.map(offer => (
                <SyncReportOfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          )}

          {worthApplying.length === 0 && levelUp.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.messageText}>No offers in this report.</Text>
            </View>
          )}
        </ScrollView>
      )}

      {showScrollTop && (
        <TouchableOpacity
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          style={styles.scrollTopButton}
        >
          <ArrowCircleUp size={28} color="#1a1a1a" />
        </TouchableOpacity>
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
  scannedBox: {
    backgroundColor: '#2563eb',
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  scannedCount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  scannedLabel: {
    color: '#bfdbfe',
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 24,
  },
  section: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingVertical: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
