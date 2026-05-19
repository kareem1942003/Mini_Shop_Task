import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedOrders() {
  console.log('Fetching products and profiles...');

  
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('is_active', true);

  if (productsError || !products || products.length === 0) {
    console.error('Error fetching products:', productsError?.message || 'No active products found');
    process.exit(1);
  }

  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('role', 'customer')
    .limit(1);

  if (profilesError || !profiles || profiles.length === 0) {
    console.error('Error fetching customer profile:', profilesError?.message || 'No customer profile found');
    process.exit(1);
  }

  const customerId = profiles[0].id;
  const customerName = profiles[0].name;
  console.log(`Found customer: ${customerName} (${customerId})`);

  
  console.log('Cleaning up existing orders...');
  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .eq('user_id', customerId);

  if (deleteError) {
    console.error('Error deleting old orders:', deleteError.message);
  }

  
  const mockOrders = [
    {
      status: 'pending',
      items: [
        { product_id: products[0].id, quantity: 2, unit_price: products[0].price },
        { product_id: products[1].id, quantity: 1, unit_price: products[1].price }
      ]
    },
    {
      status: 'processing',
      items: [
        { product_id: products[2].id, quantity: 1, unit_price: products[2].price }
      ]
    },
    {
      status: 'delivered',
      items: [
        { product_id: products[3].id, quantity: 1, unit_price: products[3].price },
        { product_id: (products[4] || products[0]).id, quantity: 3, unit_price: (products[4] || products[0]).price }
      ]
    }
  ];

  console.log('Inserting mock orders...');

  for (const mock of mockOrders) {
    
    const totalAmount = mock.items.reduce((sum, item) => sum + (Number(item.unit_price) * item.quantity), 0);

    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: customerId,
        status: mock.status,
        total_amount: Math.round(totalAmount * 100) / 100
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error(`Failed to insert order with status ${mock.status}:`, orderError?.message);
      continue;
    }

    
    const itemsToInsert = mock.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error(`Failed to insert items for order ${order.id}:`, itemsError.message);
      
      await supabase.from('orders').delete().eq('id', order.id);
    } else {
      console.log(`Successfully seeded order #${order.id.split('-')[0]} (Status: ${mock.status}, Total: $${order.total_amount})`);
    }
  }

  console.log('Mock orders seeding complete! 🎉');
}

seedOrders().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
