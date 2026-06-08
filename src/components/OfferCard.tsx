import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native'
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

const STATUS_BG: Record<string, string> = {
  applied: '#f0f0f0',
  agent_withdrawn: '#fee2e2',
  recruiter_rejected: '#fee2e2',
  offer_received: '#dcfce7',
  accepted: '#bbf7d0',
  client_withdrawn: '#fee2e2',
}

const STATUS_TEXT: Record<string, string> = {
  applied: '#4a4a4a',
  agent_withdrawn: '#b91c1c',
  recruiter_rejected: '#b91c1c',
  offer_received: '#15803d',
  accepted: '#166534',
  client_withdrawn: '#b91c1c',
}

function SalaryLine({ entry }: { entry: SalaryEntry }) {
  const hasRange = entry.min != null && entry.max != null
  const hasDelta = entry.delta != null && entry.delta !== 0
  const deltaPositive = (entry.delta ?? 0) > 0
  const deltaSign = deltaPositive ? '+' : ''
  const showNormalized = entry.currency !== 'PLN' && entry.delta_normalized != null && entry.delta_normalized !== 0

  if (!hasRange) return null

  return (
    <Text style={styles.salaryLine}>
      {[entry.currency, entry.type].filter(Boolean).join(' ')}{' '}
      {formatNum(entry.min!)} – {formatNum(entry.max!)}
      {hasDelta && (
        <Text style={styles.deltaText}>
          {'  '}{deltaSign}{formatNum(entry.delta!)}
          {showNormalized ? ` (${formatNum(entry.delta_normalized!)} PLN)` : ''}
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
  const badgeBg = STATUS_BG[offer.status] ?? '#f0f0f0'
  const badgeText = STATUS_TEXT[offer.status] ?? '#4a4a4a'

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => offer.offer_url ? Linking.openURL(offer.offer_url) : undefined}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.offerTitle} numberOfLines={2}>
            {offer.offer_title}
          </Text>
          <Text style={styles.company}>@ {offer.offer_company}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.score}>{offer.claude_score}/100</Text>

      {offer.salary?.length > 0 && (
        <View style={styles.salaryBlock}>
          {offer.salary.map((entry, i) => (
            <SalaryLine key={i} entry={entry} />
          ))}
        </View>
      )}

      {offer.claude_role_fit ? (
        <Text style={styles.roleFit} numberOfLines={2}>{offer.claude_role_fit}</Text>
      ) : null}

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitleBlock: {
    flex: 1,
    marginRight: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  company: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  score: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 6,
  },
  salaryBlock: {
    marginTop: 8,
  },
  salaryLine: {
    fontSize: 14,
    color: '#1a1a1a',
    marginTop: 2,
  },
  deltaText: {
    color: '#f97316',
  },
  roleFit: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 8,
  },
})
