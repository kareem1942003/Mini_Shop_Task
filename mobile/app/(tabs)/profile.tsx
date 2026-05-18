import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 36 }}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginTop: 20,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#eff6ff', justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  name: { fontSize: 20, fontWeight: '700', color: '#111827' },
  email: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  logoutBtn: {
    marginHorizontal: 20, marginTop: 24,
    backgroundColor: '#fee2e2', paddingVertical: 16,
    borderRadius: 14, alignItems: 'center',
  },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '700' },
});
