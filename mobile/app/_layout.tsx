import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import * as SecureStore from 'expo-secure-store';
import { restoreToken } from '../src/store/slices/authSlice';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  useEffect(() => {
    
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await SecureStore.getItemAsync('orderking_token');
      } catch (e) {
        
      }
      store.dispatch(restoreToken(token));
    };
    bootstrapAsync();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Slot />
    </Provider>
  );
}
