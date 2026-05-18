import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Home, ShoppingCart, Package, User } from 'lucide-react-native';

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const color = focused ? '#2563eb' : '#9ca3af';
  const cartItems = useSelector((state: any) => state.cart.items || []);
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  
  const getIcon = () => {
    switch (name) {
      case 'Home': return <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
      case 'Cart': return (
        <View style={{ position: 'relative' }}>
          <ShoppingCart size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      );
      case 'Orders': return <Package size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
      case 'Profile': return <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
      default: return null;
    }
  };

  return (
    <View style={styles.iconWrapper}>
      {getIcon()}
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} /> }} />
      <Tabs.Screen name="cart" options={{ tabBarIcon: ({ focused }) => <TabIcon name="Cart" focused={focused} /> }} />
      <Tabs.Screen name="orders" options={{ tabBarIcon: ({ focused }) => <TabIcon name="Orders" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 85,
    paddingTop: 12,
    paddingBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 60,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  labelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 10,
  },
});
