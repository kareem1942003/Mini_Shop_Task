import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/AppError';
import {
  ProductQuery,
  CreateProductInput,
  UpdateProductInput,
} from './products.schemas';

/**
 * List products with optional search, category filter, and pagination.
 * When show_all is true (admin), returns all products including inactive.
 * When show_all is false (public/mobile), only returns active products.
 */
export async function listProducts(query: ProductQuery) {
  const { page, limit, search, category_id, show_all } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let builder = supabase
    .from('products')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // Only filter by is_active for public requests (not admin)
  if (!show_all) {
    builder = builder.eq('is_active', true);
  }

  if (search) {
    builder = builder.ilike('name', `%${search}%`);
  }

  if (category_id) {
    builder = builder.eq('category_id', category_id);
  }

  const { data, error, count } = await builder;

  if (error) throw new AppError(error.message, 500);

  return {
    products: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

/**
 * Get a single product by ID (must be active).
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) throw new AppError('Product not found', 404);
  return data;
}

/**
 * Create a new product (admin only).
 */
export async function createProduct(input: CreateProductInput) {
  // Validate that the referenced category exists
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('id', input.category_id)
    .single();

  if (!category) throw new AppError('Category not found', 404);

  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select('*, categories(id, name, slug)')
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}

/**
 * Update a product (admin only).
 */
export async function updateProduct(id: string, input: UpdateProductInput) {
  // Check product exists (including inactive for admin)
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) throw new AppError('Product not found', 404);

  // If updating category, validate it exists
  if (input.category_id) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', input.category_id)
      .single();

    if (!category) throw new AppError('Category not found', 404);
  }

  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select('*, categories(id, name, slug)')
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}

/**
 * Soft-delete a product by setting is_active = false.
 */
export async function deleteProduct(id: string) {
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!existing) throw new AppError('Product not found', 404);

  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new AppError(error.message, 500);
  return true;
}

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadProductImage(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const uniqueName = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from('product_images')
    .upload(uniqueName, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw new AppError(`Image upload failed: ${error.message}`, 400);

  const { data: urlData } = supabase.storage
    .from('product_images')
    .getPublicUrl(uniqueName);

  return urlData.publicUrl;
}
