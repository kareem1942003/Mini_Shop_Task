import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../src/store/api/productsApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../src/store/slices/cartSlice';
import type { Product } from '../../src/store/api/productsApi';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data, isLoading, refetch: refetchProducts } = useGetProductsQuery({
    page: 1,
    limit: 50,
    search: search || undefined,
    category_id: selectedCategory,
  }, { pollingInterval: 3000 });
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProducts(), refetchCategories()]);
    setIsRefreshing(false);
  };

  const dispatch = useDispatch();
  const products: Product[] = data?.data?.products || [];
  const categories = categoriesData?.data || [];

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    }));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.placeholder]}>
          <Text style={styles.placeholderText}>🛍️</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OrderKing</Text>
        <Text style={styles.subtitle}>Find your favorite products</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <FlatList
        data={[{ id: 'all', name: 'All' }, ...categories]}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        keyExtractor={(item) => item.id || 'all'}
        renderItem={({ item }) => {
          const isActive = selectedCategory === item.id || (item.id === 'all' && selectedCategory === undefined);
          return (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.id === 'all' ? undefined : item.id)}
              style={{
                height: 38,
                paddingHorizontal: 18,
                borderRadius: 19,
                backgroundColor: isActive ? '#2563eb' : '#ffffff',
                borderWidth: 1,
                borderColor: isActive ? '#2563eb' : '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isActive ? '#ffffff' : '#6b7280',
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Products Grid */}
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  logo: { fontSize: 28, fontWeight: '800', color: '#2563eb' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  searchWrapper: { paddingHorizontal: 20, marginTop: 16 },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  categoryList: { paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  categoryTextActive: { color: '#fff' },
  productList: { paddingHorizontal: 12, paddingBottom: 20 },
  row: { gap: 12 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  productImage: { width: '100%', height: 140, backgroundColor: '#f3f4f6' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 40 },
  cardBody: { padding: 12 },
  productName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  productDesc: { fontSize: 12, color: '#9ca3af', marginTop: 4, lineHeight: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  price: { fontSize: 18, fontWeight: '800', color: '#2563eb' },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrapper: { paddingTop: 60, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#9ca3af' },
});
