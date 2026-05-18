import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/AppError';
import { CreateOrderInput, OrderQuery } from './orders.schemas';

/**
 * Create an order transactionally:
 * 1. Validate all products exist and are active
 * 2. Calculate totals on the backend (never trust client prices)
 * 3. Insert order + order_items
 */
export async function createOrder(userId: string, input: CreateOrderInput) {
  // 1. Fetch all referenced products in a single query
  const productIds = input.items.map((item) => item.product_id);

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, is_active')
    .in('id', productIds);

  if (productsError) throw new AppError(productsError.message, 500);

  // 2. Validate all products exist and are active
  const productMap = new Map(products?.map((p) => [p.id, p]));

  for (const item of input.items) {
    const product = productMap.get(item.product_id);
    if (!product) {
      throw new AppError(`Product ${item.product_id} not found`, 404);
    }
    if (!product.is_active) {
      throw new AppError(`Product "${product.name}" is no longer available`, 400);
    }
  }

  // 3. Calculate total securely on the backend
  let totalAmount = 0;
  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.product_id)!;
    const unitPrice = product.price;
    totalAmount += unitPrice * item.quantity;
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: unitPrice,
    };
  });

  totalAmount = Math.round(totalAmount * 100) / 100; // Avoid floating point issues

  // 4. Insert the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError || !order) throw new AppError('Failed to create order', 500);

  // 5. Insert order items
  const itemsWithOrderId = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId);

  if (itemsError) {
    // Rollback: delete the order if items failed
    await supabase.from('orders').delete().eq('id', order.id);
    throw new AppError('Failed to create order items', 500);
  }

  // 6. Return the full order
  return getOrderById(order.id);
}

/**
 * Get the current user's orders (paginated).
 */
export async function getMyOrders(userId: string, query: OrderQuery) {
  const { page, limit, status } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let builder = supabase
    .from('orders')
    .select('*, order_items(*, products(id, name, price, image_url))', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    builder = builder.eq('status', status);
  }

  const { data, error, count } = await builder;

  if (error) throw new AppError(error.message, 500);

  return {
    orders: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

/**
 * Get all orders — admin only (paginated).
 */
export async function getAllOrders(query: OrderQuery) {
  const { page, limit, status } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let builder = supabase
    .from('orders')
    .select('*, profiles(id, name), order_items(*, products(id, name, price, image_url))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    builder = builder.eq('status', status);
  }

  const { data, error, count } = await builder;

  if (error) throw new AppError(error.message, 500);

  return {
    orders: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

/**
 * Get a single order by ID with full items.
 */
export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(id, name, price, image_url)), profiles(id, name)')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('Order not found', 404);
  return data;
}

/**
 * Update order status — admin only.
 */
export async function updateOrderStatus(id: string, status: string) {
  const { data: existing } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', id)
    .single();

  if (!existing) throw new AppError('Order not found', 404);

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select('*, order_items(*, products(id, name, price, image_url)), profiles(id, name)')
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}
