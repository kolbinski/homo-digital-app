import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { CurrencyCircleDollar } from 'phosphor-react-native';
import type { UserOffer, SalaryEntry } from '../types/userOffer';
import { formatNum } from '../utils/formatNum';

const SOURCE_ICONS: Record<string, ReturnType<typeof require>> = {
  justjoin: require('../../assets/sources/justjoin.png'),
  nofluffjobs: require('../../assets/sources/nofluffjobs.png'),
};

function getScoreStyle(score: number) {
  if (score >= 70) return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
  if (score >= 50) return { bg: '#fefce8', text: '#a16207', border: '#fef08a' };
  return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' };
}

function SalaryLine({ entry }: { entry: SalaryEntry }) {
  const hasRange = entry.min != null && entry.max != null;
  const hasDelta = entry.delta != null && entry.delta !== 0;
  const deltaPositive = (entry.delta ?? 0) > 0;
  const deltaSign = deltaPositive ? '+' : '';
  const showNormalized =
    entry.currency !== 'PLN' &&
    entry.delta_normalized != null &&
    entry.delta_normalized !== 0;

  if (!hasRange) return null;

  return (
    <View style={styles.salaryRow}>
      <CurrencyCircleDollar size={14} color="#9ca3af" />
      <Text style={styles.salaryLine}>
        {[entry.currency, entry.type].filter(Boolean).join(' ')}{' '}
        {formatNum(entry.min!)} – {formatNum(entry.max!)}
        {hasDelta && (
          <Text style={styles.deltaText}>
            {'  '}
            {deltaSign}
            {formatNum(entry.delta!)}
            {showNormalized
              ? ` (${formatNum(entry.delta_normalized!)} PLN)`
              : ''}
          </Text>
        )}
      </Text>
    </View>
  );
}

interface Props {
  offer: UserOffer;
}

export function OfferCard({ offer }: Props) {
  const scoreStyle = getScoreStyle(offer.claude_score);
  const sourceIcon = SOURCE_ICONS[offer.source];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        offer.offer_url ? Linking.openURL(offer.offer_url) : undefined
      }
    >
      <View style={styles.cardHeader}>
        {sourceIcon && <Image source={sourceIcon} style={styles.sourceIcon} />}
        <View
          style={[
            styles.scoreBadge,
            { backgroundColor: scoreStyle.bg, borderColor: scoreStyle.border },
          ]}
        >
          <Text style={[styles.scoreBadgeText, { color: scoreStyle.text }]}>
            {offer.claude_score}%
          </Text>
        </View>
        <Text style={styles.titleText} numberOfLines={2}>
          <Text style={styles.titleBold}>{offer.offer_title}</Text>
          <Text style={styles.titleCompany}> @&nbsp;{offer.offer_company}</Text>
        </Text>
      </View>

      {offer.salary?.length > 0 && (
        <View style={styles.salaryBlock}>
          {offer.salary.map((entry, i) => (
            <SalaryLine key={i} entry={entry} />
          ))}
        </View>
      )}

      {offer.claude_role_fit ? (
        <Text style={styles.roleFit} numberOfLines={2}>
          {offer.claude_role_fit}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
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
  deltaText: {
    color: '#f97316',
  },
  roleFit: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 8,
  },
});
