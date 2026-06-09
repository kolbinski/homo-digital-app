import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'phosphor-react-native';
import { validateEmail } from '../../src/utils/validateEmail';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const BULLETS = [
  'We find the best job offers matching your profile',
  'We apply on your behalf — no copy-pasting CVs',
  'We negotiate salary so you get the best deal',
  'You stay in control and see every step',
];

export default function JoinScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRequestAccess() {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);
    setLoading(true);
    setError(null);
    try {
      console.log('Sending prospect:', { email, notes, role: 'client' });
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/prospects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, notes, role: 'client' }),
        },
      );
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response body:', JSON.stringify(data));
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color="#16a34a" weight="fill" />
          <Text style={styles.successTitle}>Thank you!</Text>
          <Text style={styles.successSubtitle}>We will contact you soon.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={8}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Homo Digital</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Homo Digital</Text>

          <Text style={styles.whyTitle}>Why join Homo Digital?</Text>

          <View style={styles.bulletList}>
            {BULLETS.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Your email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="you@example.com"
            placeholderTextColor="#4a4a4a"
          />
          {emailError && (
            <Text
              style={{
                color: '#ef4444',
                fontSize: 12,
                marginTop: -10,
                marginBottom: 10,
              }}
            >
              {emailError}
            </Text>
          )}

          <Text style={styles.label}>Tell us about yourself</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
            placeholder="Your background, what kind of job you're looking for..."
            placeholderTextColor="#4a4a4a"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleRequestAccess}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Request access</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  logo: {
    width: 150,
    height: 94,
    borderRadius: 16,
    marginBottom: 12,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 28,
  },
  whyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 28,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    color: '#9ca3af',
    fontSize: 16,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  textarea: {
    height: 100,
    paddingTop: 12,
    marginBottom: 24,
  },
  error: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 8,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
