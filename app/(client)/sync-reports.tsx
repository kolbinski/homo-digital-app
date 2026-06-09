import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { ArrowCircleUp } from 'phosphor-react-native';
import { useSyncReports } from '../../src/hooks/useSyncReports';
import type { SyncReportSummary } from '../../src/types/syncReport';

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}

function SyncCard({
  sync,
  onPress,
}: {
  sync: SyncReportSummary;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.date}>{formatDate(sync.created_at)}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#16a34a' }}>
            {sync.report?.worth_applying?.length ?? 0}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: '#1a1a1a' }}>
          worth applying offers
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#fff7ed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ea580c' }}>
            {sync.report?.level_up?.length ?? 0}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: '#1a1a1a' }}>
          level up and earn more offers
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SyncReportsScreen() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList<SyncReportSummary>>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, isError, refetch } = useSyncReports();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setNavigating(false);
    }, []),
  );

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Reports',
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
          <Text style={styles.messageText}>Failed to load reports.</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data ?? []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SyncCard
              sync={item}
              onPress={() => {
                if (navigating) return;
                setNavigating(true);
                router.push(`/(client)/sync-report/${item.id}`);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          onScroll={e => setShowScrollTop(e.nativeEvent.contentOffset.y > 200)}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.messageText}>No sync reports yet.</Text>
            </View>
          }
        />
      )}

      {showScrollTop && (
        <TouchableOpacity
          onPress={() =>
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
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
