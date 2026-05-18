-- ==========================================
-- SEED DATA
-- ==========================================

DO $$ 
DECLARE
  admin_uid UUID := uuid_generate_v4();
  customer_uid UUID := uuid_generate_v4();
  cat_electronics UUID := uuid_generate_v4();
  cat_clothing UUID := uuid_generate_v4();
  cat_home UUID := uuid_generate_v4();
BEGIN
  -- 1. Seed Auth Users (Admin and Customer)
  -- The password for both is 'password123'
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (admin_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@orderking.com', crypt('password123', gen_salt('bf')), now(), '{"name":"Admin Account", "role":"admin"}', now(), now()),
    (customer_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'customer@orderking.com', crypt('password123', gen_salt('bf')), now(), '{"name":"Customer Account", "role":"customer"}', now(), now());

  -- Note: The `handle_new_user` trigger will automatically populate the public.profiles table.

  -- 2. Seed 3 Categories
  INSERT INTO public.categories (id, name, slug) VALUES 
    (cat_electronics, 'Electronics', 'electronics'),
    (cat_clothing, 'Clothing', 'clothing'),
    (cat_home, 'Home & Garden', 'home-garden');

  -- 3. Seed 10 Products
  INSERT INTO public.products (name, description, price, category_id, is_active, image_url) VALUES 
    ('Smartphone Pro Max', 'Latest flagship smartphone with amazing camera and battery life.', 1099.99, cat_electronics, true, 'smartphone.png'),
    ('Wireless Noise-Cancelling Earbuds', 'Premium audio experience with active noise cancellation.', 199.99, cat_electronics, true, 'earbuds.png'),
    ('Ultra-Thin Gaming Laptop', 'High performance gaming laptop with dedicated GPU.', 1899.99, cat_electronics, true, 'laptop.png'),
    ('4K Smart TV 65"', 'Stunning 4K resolution with built-in smart apps.', 799.99, cat_electronics, true, 'tv.png'),
    
    ('Premium Cotton T-Shirt', 'Comfortable, breathable 100% cotton t-shirt in various colors.', 24.99, cat_clothing, true, 'tshirt.png'),
    ('Classic Denim Jeans', 'Straight fit blue denim jeans for everyday wear.', 59.99, cat_clothing, true, 'jeans.png'),
    ('Performance Running Shoes', 'Lightweight running shoes with memory foam insoles.', 119.99, cat_clothing, true, 'shoes.png'),
    
    ('Programmable Coffee Maker', '12-cup programmable drip coffee maker with glass carafe.', 89.99, cat_home, true, 'coffee.png'),
    ('High-Speed Blender', 'Powerful blender for smoothies, soups, and purees.', 149.99, cat_home, true, 'blender.png'),
    ('Robot Vacuum Cleaner', 'Smart robot vacuum with mapping and automatic docking.', 299.99, cat_home, true, 'vacuum.png');

END $$;
