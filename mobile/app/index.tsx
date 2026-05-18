import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../src/store';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
