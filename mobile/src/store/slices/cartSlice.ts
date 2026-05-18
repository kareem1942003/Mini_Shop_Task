import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product_id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ product_id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.product_id === action.payload.product_id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.product_id !== action.payload.product_id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
