import { useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
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

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      className={`px-3 py-1.5 rounded-full mr-2 border ${
        active ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-[#f0f0f0]'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-[#4a4a4a]'}`}>
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
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="bg-white pt-14 pb-3 px-4 border-b border-[#f0f0f0]">
        <Text className="text-2xl font-bold text-[#1a1a1a]">My Applications</Text>
      </View>

      <View className="bg-white border-b border-[#f0f0f0] py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {STATUS_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.label}
              label={opt.label}
              active={status === opt.value}
              onPress={() => setStatus(opt.value)}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-2">
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
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-[#4a4a4a] text-center">
            Failed to load. Pull to refresh.
          </Text>
        </View>
      ) : (
        <FlatList<UserOffer>
          data={data ?? []}
          keyExtractor={(item) => item.user_offer_id}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-base text-[#4a4a4a]">No applications yet.</Text>
            </View>
          }
        />
      )}
    </View>
  )
}
