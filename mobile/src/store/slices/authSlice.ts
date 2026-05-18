import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      SecureStore.setItemAsync('orderking_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      SecureStore.deleteItemAsync('orderking_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    restoreToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout, setLoading, restoreToken } = authSlice.actions;
export default authSlice.reducer;
