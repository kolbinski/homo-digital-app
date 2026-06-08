import { View, Text, TouchableOpacity } from 'react-native'
import { Linking } from 'react-native'
import type { UserOffer, SalaryEntry } from '../types/userOffer'
import { formatNum } from '../utils/formatNum'

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  agent_withdrawn: 'Withdrawn',
  recruiter_rejected: 'Rejected',
  offer_received: 'Offer',
  accepted: 'Accepted',
  client_withdrawn: 'Withdrawn',
}

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-[#f0f0f0] text-[#4a4a4a]',
  agent_withdrawn: 'bg-red-100 text-red-700',
  recruiter_rejected: 'bg-red-100 text-red-700',
  offer_received: 'bg-green-100 text-green-700',
  accepted: 'bg-green-200 text-green-800',
  client_withdrawn: 'bg-red-100 text-red-700',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function SalaryLine({ entry }: { entry: SalaryEntry }) {
  const deltaPositive = entry.delta > 0
  const deltaColor = deltaPositive ? 'text-orange-500' : 'text-red-600'
  const deltaSign = deltaPositive ? '+' : ''

  return (
    <Text className="text-sm text-[#1a1a1a] mt-0.5">
      {entry.currency} {entry.type}{' '}
      {formatNum(entry.min)} – {formatNum(entry.max)}{' '}
      {entry.delta !== 0 && (
        <Text className={deltaColor}>
          {deltaSign}{formatNum(entry.delta)}
        </Text>
      )}
    </Text>
  )
}

interface Props {
  offer: UserOffer
}

export function OfferCard({ offer }: Props) {
  const statusLabel = STATUS_LABELS[offer.status] ?? offer.status
  const statusColor = STATUS_COLORS[offer.status] ?? 'bg-[#f0f0f0] text-[#4a4a4a]'

  return (
    <TouchableOpacity
      className="bg-white border border-[#f0f0f0] rounded-xl mx-4 mb-3 p-4"
      activeOpacity={0.7}
      onPress={() => Linking.openURL(offer.offer_url)}
    >
      <View className="flex-row items-start justify-between mb-1">
        <View className="flex-1 mr-2">
          <Text className="text-base font-medium text-[#1a1a1a]" numberOfLines={2}>
            {offer.offer_title}
          </Text>
          <Text className="text-sm text-[#4a4a4a] mt-0.5">
            @ {offer.company_name}
          </Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full ${statusColor}`}>
          <Text className="text-xs font-medium">{statusLabel}</Text>
        </View>
      </View>

      <Text className="text-sm text-[#4a4a4a] mt-1">
        {offer.work_model}{offer.city ? ` · ${offer.city}` : ''}
      </Text>

      {offer.salary.length > 0 && (
        <View className="mt-2">
          {offer.salary.map((entry, i) => (
            <SalaryLine key={i} entry={entry} />
          ))}
        </View>
      )}

      {offer.role_fit ? (
        <Text className="text-xs text-[#4a4a4a] mt-2" numberOfLines={2}>
          {offer.role_fit}
        </Text>
      ) : null}

      <Text className="text-xs text-[#4a4a4a] mt-2">
        {formatDate(offer.created_at)}
      </Text>
    </TouchableOpacity>
  )
}
