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
import { useAuthStore } from '../../src/store/authStore';
import { registerPushToken } from '../../src/utils/registerPushToken';
import { validateEmail } from '../../src/utils/validateEmail';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleLogin() {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);
    if (!password) {
      setError('Password is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message ?? 'Login failed. Check your credentials.');
        return;
      }
      const data = await res.json();
      console.log('Login response:', JSON.stringify(data));
      const { token, role, user_id, agent_id } = data;
      await setAuth(token, role, user_id ?? agent_id);
      const { userId } = useAuthStore.getState();
      console.log('userId from store:', userId);
      await registerPushToken(API_URL!, token);
      if (role === 'agent') {
        router.replace('/(agent)/dashboard');
      } else {
        router.replace('/(client)/applications');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Homo Digital</Text>
        <Text style={styles.subtitle}>Your personal career agent.</Text>
        <Text style={styles.subtitle2}>
          We find the best job offers, apply on your behalf, and negotiate
          salary — so you don't have to.
        </Text>

        <Text style={styles.sectionLabel}>Sign in to your account</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => { setEmail(text); setEmailError(null); }}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="you@example.com"
          placeholderTextColor="#4a4a4a"
        />
        {emailError && (
          <Text style={{ color: '#ef4444', fontSize: 12, marginTop: -10, marginBottom: 10 }}>
            {emailError}
          </Text>
        )}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, styles.inputPassword]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          placeholder="••••••••"
          placeholderTextColor="#4a4a4a"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
          <View style={{ flex: 1, height: 0.5, backgroundColor: '#333' }} />
          <Text style={{ color: '#6b7280', fontSize: 13, marginHorizontal: 12 }}>or</Text>
          <View style={{ flex: 1, height: 0.5, backgroundColor: '#333' }} />
        </View>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => router.push('/(auth)/join')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Join</Text>
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
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logo: {
    width: 150,
    height: 94,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  subtitle2: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
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
  inputPassword: {
    marginBottom: 24,
  },
  error: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
