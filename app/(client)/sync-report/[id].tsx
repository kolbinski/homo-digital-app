import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useSyncReport } from '../../../src/hooks/useSyncReports'
import { SyncReportOfferCard } from '../../../src/components/SyncReportOfferCard'
import { formatNum } from '../../../src/utils/formatNum'
import type { SyncReportOffer } from '../../../src/types/syncReport'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

interface SectionHeaderProps {
  title: string
  color: string
  bg: string
  border: string
}

function SectionHeader({ title, color, bg, border }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
  )
}

export default function SyncReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: sync, isLoading, isError } = useSyncReport(id)

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {scanned != null && (
            <Text style={styles.scannedText}>
              Scanned: {formatNum(scanned)} offers
            </Text>
          )}

          {worthApplying.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Worth applying"
                color="#15803d"
                bg="#f0fdf4"
                border="#bbf7d0"
              />
              {worthApplying.map(offer => (
                <SyncReportOfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          )}

          {levelUp.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Level up & earn more"
                color="#c2410c"
                bg="#fff7ed"
                border="#fed7aa"
              />
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
  scannedText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 24,
  },
  section: {
    gap: 0,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
