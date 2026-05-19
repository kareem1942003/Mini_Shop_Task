import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetMyOrdersQuery } from '../../src/store/api/ordersApi';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped: { bg: '#e0e7ff', text: '#3730a3' },
  delivered: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function OrdersScreen() {
  const { data, isLoading, refetch } = useGetMyOrdersQuery({ page: 1, limit: 50 }, { pollingInterval: 3000 });
  const orders = data?.data?.orders || [];

  const renderOrder = ({ item }: { item: any }) => {
    const color = statusColors[item.status] || { bg: '#f3f4f6', text: '#374151' };
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>#{item.id.split('-')[0]}</Text>
          <View style={[styles.badge, { backgroundColor: color.bg }]}>
            <Text style={[styles.badgeText, { color: color.text }]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          {item.order_items?.map((oi: any, index: number) => (
            <Text key={oi.id || oi.product_id || index} style={styles.itemText}>
              {oi.quantity}× {oi.products?.name || 'Product'} — ${(oi.quantity * oi.unit_price).toFixed(2)}
            </Text>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          <Text style={styles.total}>${item.total_amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={{ fontSize: 60 }}>📦</Text>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>Place your first order from the home screen</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 15, fontWeight: '700', color: '#111827' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  cardBody: { gap: 4, marginBottom: 12 },
  itemText: { fontSize: 13, color: '#6b7280' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 },
  date: { fontSize: 13, color: '#9ca3af' },
  total: { fontSize: 18, fontWeight: '800', color: '#111827' },
  loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrapper: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af' },
});
