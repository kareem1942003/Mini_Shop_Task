import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/AppError';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new AppError(error.message, 500);
  return data;
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('Category not found', 404);
  return data;
}

export async function createCategory(input: CreateCategoryInput) {
  
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', input.slug)
    .single();

  if (existing) throw new AppError('A category with this slug already exists', 409, 'CONFLICT');

  const { data, error } = await supabase
    .from('categories')
    .insert(input)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  
  await getCategoryById(id);

  
  if (input.slug) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', input.slug)
      .neq('id', id)
      .single();

    if (existing) throw new AppError('A category with this slug already exists', 409, 'CONFLICT');
  }

  const { data, error } = await supabase
    .from('categories')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
}

export async function deleteCategory(id: string) {
  await getCategoryById(id);

  
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
    .eq('is_active', true);

  if (count && count > 0) {
    throw new AppError(
      `Cannot delete category: ${count} active product(s) still reference it`,
      400,
      'CATEGORY_IN_USE'
    );
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new AppError(error.message, 500);
  return true;
}
