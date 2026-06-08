import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ArrowSquareOut, CurrencyCircleDollar } from 'phosphor-react-native'
import type { SyncReportOffer } from '../types/syncReport'
import type { SalaryEntry } from '../types/userOffer'
import { formatNum } from '../utils/formatNum'

const SOURCE_ICONS: Record<string, ReturnType<typeof require>> = {
  justjoin: require('../../assets/sources/justjoin.png'),
  nofluffjobs: require('../../assets/sources/nofluffjobs.png'),
}

function getScoreStyle(score: number) {
  if (score >= 70) return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }
  if (score >= 50) return { bg: '#fefce8', text: '#a16207', border: '#fef08a' }
  return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' }
}

function SalaryLine({ entry }: { entry: SalaryEntry }) {
  const hasRange = entry.min != null && entry.max != null
  if (!hasRange) return null
  return (
    <View style={styles.salaryRow}>
      <CurrencyCircleDollar size={14} color="#9ca3af" />
      <Text style={styles.salaryLine}>
        {[entry.currency, entry.type].filter(Boolean).join(' ')}{' '}
        {formatNum(entry.min!)} – {formatNum(entry.max!)}
      </Text>
    </View>
  )
}

interface Props {
  offer: SyncReportOffer
}

export function SyncReportOfferCard({ offer }: Props) {
  const router = useRouter()
  const scoreStyle = getScoreStyle(offer.score)
  const sourceIcon = offer.source ? SOURCE_ICONS[offer.source] : null

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {sourceIcon && <Image source={sourceIcon} style={styles.sourceIcon} />}
        {offer.score > 0 && (
          <View style={[styles.scoreBadge, { backgroundColor: scoreStyle.bg, borderColor: scoreStyle.border }]}>
            <Text style={[styles.scoreBadgeText, { color: scoreStyle.text }]}>
              {offer.score}%
            </Text>
          </View>
        )}
        <Text style={styles.titleText} numberOfLines={2}>
          <Text style={styles.titleBold}>{offer.title}</Text>
          <Text style={styles.titleCompany}> @ {offer.company}</Text>
        </Text>
      </View>

      {offer.salary && offer.salary.length > 0 && (
        <View style={styles.salaryBlock}>
          {offer.salary.map((entry, i) => (
            <SalaryLine key={i} entry={entry} />
          ))}
        </View>
      )}

      {offer.role_fit ? (
        <Text style={styles.roleFit} numberOfLines={2}>{offer.role_fit}</Text>
      ) : null}

      {(offer.city || offer.work_model) && (
        <View style={styles.metaRow}>
          {offer.city && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{offer.city}</Text>
            </View>
          )}
          {offer.work_model && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{offer.work_model}</Text>
            </View>
          )}
        </View>
      )}

      {(() => {
        const missingSkills = [
          ...(offer.missing_skills ?? []),
          ...(offer.skills_to_learn ?? []),
        ].filter((v, i, a) => a.indexOf(v) === i)
        return missingSkills.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Missing: </Text>
            {missingSkills.map(skill => (
              <View key={skill} style={{ backgroundColor: '#fef2f2', borderWidth: 0.5, borderColor: '#fecaca', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 11, color: '#dc2626' }}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : null
      })()}

      {offer.url ? (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/offer', params: { url: offer.url } })}
          style={styles.viewOfferButton}
        >
          <Text style={styles.viewOfferText}>View offer</Text>
          <ArrowSquareOut size={14} color="#2563eb" />
        </TouchableOpacity>
      ) : null}
    </View>
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
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  sourceIcon: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  scoreBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  titleBold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  titleCompany: {
    color: '#9ca3af',
    fontWeight: '400',
  },
  salaryBlock: {
    marginTop: 8,
    gap: 4,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  salaryLine: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  roleFit: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metaBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewOfferButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  viewOfferText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '500',
  },
})
