import { useState } from 'react'
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../src/store/authStore'
import { useApplications } from '../../src/hooks/useApplications'
import { OfferCard } from '../../src/components/OfferCard'
import type { OfferStatus, OfferSource, UserOffer } from '../../src/types/userOffer'

const STATUS_OPTIONS: { label: string; value: OfferStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Applied', value: 'applied' },
  { label: 'Offer', value: 'offer_received' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'recruiter_rejected' },
  { label: 'Withdrawn', value: 'agent_withdrawn' },
]

const SOURCE_OPTIONS: { label: string; value: OfferSource }[] = [
  { label: 'All', value: 'all' },
  { label: 'JustJoin', value: 'justjoin' },
  { label: 'NoFluffJobs', value: 'nofluffjobs' },
]

function FilterPill({ label, active, onPress }: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default function ApplicationsScreen() {
  const router = useRouter()
  const { token, role } = useAuthStore()
  const [status, setStatus] = useState<OfferStatus | undefined>(undefined)
  const [source, setSource] = useState<OfferSource>('all')

  if (!token || role !== 'client') {
    router.replace('/(auth)/login')
    return null
  }

  const { data, isLoading, isError, refetch, isFetching } = useApplications(status, source)

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {STATUS_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.label}
              label={opt.label}
              active={status === opt.value}
              onPress={() => setStatus(opt.value)}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, styles.filterRowTop]}>
          {SOURCE_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={source === opt.value}
              onPress={() => setSource(opt.value)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.messageText}>Failed to load. Pull to refresh.</Text>
        </View>
      ) : (
        <FlatList<UserOffer>
          data={data ?? []}
          keyExtractor={(item) => item.user_offer_id}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={styles.listContent}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.messageText}>No applications yet.</Text>
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
  header: {
    backgroundColor: '#fff',
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  filters: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterRowTop: {
    marginTop: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a4a4a',
  },
  pillTextActive: {
    color: '#fff',
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
    paddingHorizontal: 24,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
})
