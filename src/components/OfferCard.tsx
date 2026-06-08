import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowSquareOut, CurrencyCircleDollar } from 'phosphor-react-native';
import type { UserOffer, SalaryEntry } from '../types/userOffer';
import type { SyncReportOffer } from '../types/syncReport';
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

export interface OfferCardProps {
  score: number;
  source?: string;
  title: string;
  company: string;
  city?: string | null;
  work_model?: string | null;
  salary: SalaryEntry[];
  role_fit?: string | null;
  missing_skills?: string[];
  skills_to_learn?: string[];
  url: string;
}

export function userOfferToCardProps(offer: UserOffer): OfferCardProps {
  return {
    score: offer.claude_score,
    source: offer.source,
    title: offer.offer_title,
    company: offer.offer_company,
    city: offer.city,
    work_model: offer.work_model,
    salary: offer.salary,
    role_fit: offer.claude_role_fit,
    missing_skills: offer.claude_missing_skills,
    skills_to_learn: offer.skills_to_learn,
    url: offer.offer_url,
  };
}

export function syncOfferToCardProps(offer: SyncReportOffer): OfferCardProps {
  return {
    score: offer.score,
    source: offer.source,
    title: offer.title,
    company: offer.company,
    city: offer.city,
    work_model: offer.work_model,
    salary: offer.salary ?? [],
    role_fit: offer.role_fit,
    missing_skills: offer.missing_skills,
    skills_to_learn: offer.skills_to_learn,
    url: offer.url ?? '',
  };
}

export function OfferCard(props: OfferCardProps) {
  const router = useRouter();
  const {
    score,
    source,
    title,
    company,
    city,
    work_model,
    salary,
    role_fit,
    missing_skills,
    skills_to_learn,
    url,
  } = props;
  const scoreStyle = getScoreStyle(score);
  const sourceIcon = source ? SOURCE_ICONS[source] : null;

  const hasSalary =
    salary &&
    salary.length > 0 &&
    salary.some(s => s.min !== null || s.max !== null);

  const mergedMissingSkills = [
    ...(missing_skills ?? []),
    ...(skills_to_learn ?? []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {sourceIcon && <Image source={sourceIcon} style={styles.sourceIcon} />}
        {score > 0 && (
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor: scoreStyle.bg,
                borderColor: scoreStyle.border,
              },
            ]}
          >
            <Text style={[styles.scoreBadgeText, { color: scoreStyle.text }]}>
              {score}%
            </Text>
          </View>
        )}
        <Text style={styles.titleText}>
          <Text style={styles.titleBold}>{title}</Text>
          <Text style={styles.titleCompany}>
            {' @\u00A0'}
            {company}
          </Text>
        </Text>
      </View>

      {(city || work_model) && (
        <View style={styles.tagsRow}>
          {work_model && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{work_model}</Text>
            </View>
          )}
          {city && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{city}</Text>
            </View>
          )}
        </View>
      )}

      {!hasSalary ? (
        <Text style={styles.salaryNotDisclosed}>Salary not disclosed</Text>
      ) : (
        <View style={styles.salaryBlock}>
          {salary
            .filter(s => s.min !== null || s.max !== null)
            .map((entry, i) => (
              <SalaryLine key={i} entry={entry} />
            ))}
        </View>
      )}

      {role_fit ? <Text style={styles.roleFit}>{role_fit}</Text> : null}

      {mergedMissingSkills.length > 0 && (
        <View style={styles.missingRow}>
          <Text style={styles.missingLabel}>Missing: </Text>
          {mergedMissingSkills.map(skill => (
            <View key={skill} style={styles.missingBadge}>
              <Text style={styles.missingText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}

      {url ? (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/offer', params: { url } })}
          style={styles.viewOfferButton}
        >
          <Text style={styles.viewOfferText}>View offer</Text>
          <ArrowSquareOut size={14} color="#2563eb" />
        </TouchableOpacity>
      ) : null}
    </View>
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tagBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    color: '#6b7280',
  },
  salaryNotDisclosed: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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
    marginTop: 4,
  },
  missingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  missingLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  missingBadge: {
    backgroundColor: '#fef2f2',
    borderWidth: 0.5,
    borderColor: '#fecaca',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  missingText: {
    fontSize: 11,
    color: '#dc2626',
  },
  viewOfferButton: {
    marginTop: 6,
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
});
