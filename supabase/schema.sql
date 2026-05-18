-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- ==========================================
-- TABLES
-- ==========================================

-- PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, product_id)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- ==========================================
-- AUTH SETUP & TRIGGERS
-- ==========================================

-- Trigger to automatically create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Helper function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'admin'::user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Products Policies
CREATE POLICY "Active products viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin());

-- Orders Policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.is_admin());

-- ==========================================
-- STORAGE BUCKET
-- ==========================================

-- Create product_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('product_images', 'product_images', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Product images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images' AND public.is_admin());
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product_images' AND public.is_admin());
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product_images' AND public.is_admin());
