import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../src/store/api/authApi';
import { setCredentials } from '../../src/store/slices/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.data?.message || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.logo}>OrderKing</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 36, fontWeight: '800', color: '#2563eb' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
  form: { gap: 16 },
  inputWrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14, color: '#6b7280' },
  linkBold: { color: '#2563eb', fontWeight: '600' },
});
