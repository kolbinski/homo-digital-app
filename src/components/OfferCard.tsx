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

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function SalaryLine({ entry }: { entry: SalaryEntry }) {
  const deltaPositive = entry.delta > 0
  const deltaColor = deltaPositive ? '#f97316' : '#dc2626'
  const deltaSign = deltaPositive ? '+' : ''

  return (
    <Text style={styles.salaryLine}>
      {entry.currency} {entry.type}{' '}
      {formatNum(entry.min)} – {formatNum(entry.max)}{' '}
      {entry.delta !== 0 && (
        <Text style={{ color: deltaColor }}>
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
  const badgeBg = STATUS_BG[offer.status] ?? '#f0f0f0'
  const badgeText = STATUS_TEXT[offer.status] ?? '#4a4a4a'

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => Linking.openURL(offer.offer_url)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.offerTitle} numberOfLines={2}>
            {offer.offer_title}
          </Text>
          <Text style={styles.company}>@ {offer.company_name}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.workModel}>
        {offer.work_model}{offer.city ? ` · ${offer.city}` : ''}
      </Text>

      {offer.salary.length > 0 && (
        <View style={styles.salaryBlock}>
          {offer.salary.map((entry, i) => (
            <SalaryLine key={i} entry={entry} />
          ))}
        </View>
      )}

      {offer.role_fit ? (
        <Text style={styles.roleFit} numberOfLines={2}>{offer.role_fit}</Text>
      ) : null}

      <Text style={styles.date}>{formatDate(offer.created_at)}</Text>
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
  workModel: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 4,
  },
  salaryBlock: {
    marginTop: 8,
  },
  salaryLine: {
    fontSize: 14,
    color: '#1a1a1a',
    marginTop: 2,
  },
  roleFit: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 8,
  },
})
