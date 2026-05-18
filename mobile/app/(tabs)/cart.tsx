import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../src/store/slices/cartSlice';
import type { CartItem } from '../../src/store/slices/cartSlice';
import { useCreateOrderMutation } from '../../src/store/api/ordersApi';
import { useRouter } from 'expo-router';
import type { RootState } from '../../src/store';

export default function CartScreen() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const total = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      const orderItems = items.map((item: CartItem) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      await createOrder({ items: orderItems }).unwrap();
      dispatch(clearCart());
      Alert.alert('Success! 🎉', 'Your order has been placed successfully!', [
        { text: 'View Orders', onPress: () => router.push('/(tabs)/orders') },
        { text: 'OK' },
      ]);
    } catch (err: any) {
      Alert.alert('Order Failed', err.data?.message || 'Something went wrong');
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.placeholder]}>
          <Text style={{ fontSize: 24 }}>🛍️</Text>
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>

      <View style={styles.qtyControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => dispatch(updateQuantity({ product_id: item.product_id, quantity: item.quantity - 1 }))}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => dispatch(updateQuantity({ product_id: item.product_id, quantity: item.quantity + 1 }))}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.product_id))}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(clearCart())}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={{ fontSize: 60 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse products and add items to your cart</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product_id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkoutText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  clearText: { fontSize: 14, color: '#ef4444', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 12,
  },
  itemImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#f3f4f6' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  itemPrice: { fontSize: 14, color: '#2563eb', fontWeight: '600', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#374151' },
  qtyText: { fontSize: 16, fontWeight: '700', color: '#111827', minWidth: 20, textAlign: 'center' },
  removeText: { fontSize: 18, color: '#ef4444', fontWeight: '600', paddingLeft: 4 },
  emptyWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af' },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  totalValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  checkoutBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
