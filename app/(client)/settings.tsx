import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Envelope, Phone, WhatsappLogoIcon } from 'phosphor-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { LogoutModal } from '../../src/components/LogoutModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Agent {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { token, clearAuth } = useAuthStore();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(`${API_URL}/v1/agent/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAgent(data);
        }
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    }
    fetchAgent();
  }, [token]);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await clearAuth();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.headerBar,
        }}
      />

      <View style={styles.inner}>
        <Text style={styles.sectionTitle}>Your agent</Text>

        {loading ? (
          <View style={styles.agentCard}>
            <ActivityIndicator size="large" color="#1a1a1a" />
          </View>
        ) : agent ? (
          <View style={styles.agentCard}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              {agent.photo_url ? (
                <Image
                  source={{ uri: agent.photo_url }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                />
              ) : (
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#1a1a1a',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}
                  >
                    {agent.first_name[0]}
                    {agent.last_name[0]}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.agentName}>
                  {agent.first_name} {agent.last_name}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL(`mailto:${agent.email}`)}
              activeOpacity={0.7}
            >
              <Envelope size={16} color="#2563eb" />
              <Text style={styles.contactText}>{agent.email}</Text>
            </TouchableOpacity>

            {agent.phone && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => setShowPhoneModal(true)}
                activeOpacity={0.7}
              >
                <Phone size={16} color="#2563eb" />
                <Text style={styles.contactText}>{agent.phone}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.agentCard}>
            <Text style={styles.errorText}>Could not load agent info.</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPhoneModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhoneModal(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setShowPhoneModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '80%',
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: '#1a1a1a',
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              Contact {agent?.first_name ?? 'agent'}
            </Text>
            <TouchableOpacity
              style={styles.phoneOption}
              onPress={() => {
                setShowPhoneModal(false);
                Linking.openURL(`tel:${agent?.phone}`);
              }}
              activeOpacity={0.7}
            >
              <Phone size={18} color="#1a1a1a" />
              <Text style={styles.phoneOptionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.phoneOption}
              onPress={() => {
                setShowPhoneModal(false);
                Linking.openURL(
                  `whatsapp://send?phone=${agent?.phone?.replace('+', '')}`,
                );
              }}
              activeOpacity={0.7}
            >
              <WhatsappLogoIcon size={18} />
              <Text style={styles.phoneOptionText}>WhatsApp</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
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
  inner: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  agentCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 15,
    color: '#2563eb',
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  footer: {
    padding: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  phoneOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
