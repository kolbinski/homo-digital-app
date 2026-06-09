import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowCircleUp,
  Files,
  Funnel,
  Gear,
  XCircleIcon,
} from 'phosphor-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useApplications } from '../../src/hooks/useApplications';
import {
  OfferCard,
  userOfferToCardProps,
} from '../../src/components/OfferCard';
import { LogoutModal } from '../../src/components/LogoutModal';
import type {
  OfferSource,
  OfferStatus,
  UserOffer,
} from '../../src/types/userOffer';

const STATUS_OPTIONS: { label: string; value: OfferStatus }[] = [
  { label: 'Applied', value: 'applied' },
  { label: 'Offer received', value: 'offer_received' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected by recruiter', value: 'recruiter_rejected' },
  { label: 'Withdrawn (agent)', value: 'agent_withdrawn' },
  { label: 'Withdrawn (me)', value: 'client_withdrawn' },
];

const SOURCE_OPTIONS: { label: string; value: OfferSource }[] = [
  { label: 'All', value: 'all' },
  { label: 'JustJoin', value: 'justjoin' },
  { label: 'NoFluffJobs', value: 'nofluffjobs' },
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDateLabel(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatSectionTitle(d: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, now)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return formatDateLabel(d);
}

type Section = { title: string; data: UserOffer[] };

function groupByDate(offers: UserOffer[]): Section[] {
  const sorted = [...offers].sort((a, b) => {
    const aTime = new Date(a.applied_at ?? a.matched_at).getTime();
    const bTime = new Date(b.applied_at ?? b.matched_at).getTime();
    return bTime - aTime;
  });

  const map: Record<string, UserOffer[]> = {};
  for (const offer of sorted) {
    const d = new Date(offer.applied_at ?? offer.matched_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!map[key]) map[key] = [];
    map[key].push(offer);
  }

  return Object.entries(map).map(([, items]) => ({
    title: formatSectionTitle(
      new Date(items[0].applied_at ?? items[0].matched_at),
    ),
    data: items,
  }));
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
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
  );
}

export default function ApplicationsScreen() {
  const router = useRouter();
  const { token, role, hydrated, clearAuth } = useAuthStore();
  const [status, setStatus] = useState<OfferStatus>('applied');
  const [source, setSource] = useState<OfferSource>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionListRef = useRef<SectionList<UserOffer, Section>>(null);

  useEffect(() => {
    if (hydrated && (!token || role !== 'client')) {
      router.replace('/(auth)/login');
    }
  }, [hydrated, token, role]);

  const { data, isLoading, isError, refetch, isFetching } = useApplications(
    status,
    source,
    selectedDate,
  );

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await clearAuth();
    router.replace('/(auth)/login');
  };

  const sections = groupByDate(data ?? []);

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: 'My Applications',
          headerLeft: () => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 32, height: 32, marginRight: 12 }}
                resizeMode="contain"
              />
            </View>
          ),
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.headerBar,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => setFiltersVisible(v => !v)}>
                {filtersVisible ? (
                  <XCircleIcon size={32} color="#1a1a1a" />
                ) : (
                  <Funnel size={32} color="#1a1a1a" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(client)/sync-reports')}
              >
                <Files size={32} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(client)/settings')}
              >
                <Gear size={32} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(null);
                setShowPicker(false);
              }}
              style={styles.unspecifiedButton}
            >
              <Text style={styles.unspecifiedText}>
                Unspecified (last 30 days)
              </Text>
            </TouchableOpacity>
            <DateTimePicker
              value={selectedDate ?? new Date()}
              mode="date"
              display="inline"
              maximumDate={new Date()}
              onChange={(_, date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowPicker(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>

      {filtersVisible && (
        <View style={styles.filtersPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {STATUS_OPTIONS.map(opt => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                active={status === opt.value}
                onPress={() => setStatus(opt.value)}
              />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {SOURCE_OPTIONS.map(opt => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                active={source === opt.value}
                onPress={() => setSource(opt.value)}
              />
            ))}
          </ScrollView>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.pill, selectedDate ? styles.pillActive : null]}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedDate ? styles.pillTextActive : null,
                ]}
              >
                {selectedDate ? formatDateLabel(selectedDate) : 'Last 30 days'}
              </Text>
            </TouchableOpacity>
            {selectedDate && (
              <TouchableOpacity
                onPress={() => setSelectedDate(null)}
                activeOpacity={0.7}
              >
                <XCircleIcon size={38} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.messageText}>
            Failed to load. Pull to refresh.
          </Text>
        </View>
      ) : (
        <SectionList<UserOffer, Section>
          ref={sectionListRef}
          sections={sections}
          keyExtractor={item => item.user_offer_id}
          renderItem={({ item }) => (
            <OfferCard {...userOfferToCardProps(item)} />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          stickySectionHeadersEnabled={false}
          onScroll={e => setShowScrollTop(e.nativeEvent.contentOffset.y > 200)}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.messageText}>No applications yet.</Text>
            </View>
          }
        />
      )}

      {showScrollTop && (
        <TouchableOpacity
          onPress={() =>
            sectionListRef.current
              ?.getScrollResponder()
              ?.scrollTo({ y: 0, animated: true })
          }
          style={styles.scrollTopButton}
        >
          <ArrowCircleUp size={28} color="#1a1a1a" />
        </TouchableOpacity>
      )}
    </View>
  );
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersPanel: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
    gap: 8,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#000',
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  unspecifiedButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  unspecifiedText: {
    color: '#6b7280',
    fontSize: 15,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 60,
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
});
