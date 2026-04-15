CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    is_veg BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    tier INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.custom_users(id),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    items JSONB NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
    delivery_address JSONB,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'ready_for_pickup', 'picked_up')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed basic menu (with images you uploaded)
INSERT INTO public.menu_items (name, category, description, price, is_veg, image_url, tier) VALUES
('Chicken Steam Momos', 'momos', 'Classic Darjeeling style steamed chicken momos', 120, false, '/images/VegChicken%20Steam%20Momos.jpg', 1),
('Veg Steam Momos', 'momos', 'Steamed momos loaded with fresh veggies', 100, true, '/images/VegChicken%20Steam%20Momos.jpg', 1),
('Chicken Fried Momos', 'momos', 'Crispy deep-fried chicken momos', 140, false, '/images/Chicken%20Fried%20Momos.jpg', 1),
('Veg Fried Momos', 'momos', 'Crispy deep-fried veg momos', 120, true, '/images/vegfriedmomos.png', 1),
('Chicken Pan Fried Momos', 'momos', 'Pan fried chicken momos in special sauce', 150, false, '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', 1),
('Veg Pan Fried Momos', 'momos', 'Pan fried veg momos in tangy sauce', 130, true, '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', 1),
('Chicken Manchurian Momos', 'momos', 'Chicken momos tossed in manchurian sauce', 160, false, '/images/Chicken%20Manchurian%20Momos.jpg', 1),
('Veg Manchurian Momos', 'momos', 'Veg momos tossed in manchurian sauce', 140, true, '/images/Veg%20Manchurian%20Momos.jpg', 1),
('Chicken Fried Noodles', 'noodles', 'Wok tossed chicken noodles', 150, false, '/images/Chicken%20Fried%20Noodles.jpg', 2),
('Veg Chowmein', 'noodles', 'Street style veg chowmein noodles', 130, true, '/images/Chowmein%20Veg%20Noodles.jpg', 2),
('Chicken Fried Rice', 'rice', 'Classic chicken fried rice', 160, false, '/images/Chicken%20Fried%20Rice.jpg', 3),
('Veg Fried Rice', 'rice', 'Classic veg fried rice', 140, true, '/images/Veg%20Fried%20Rice%20Veg%20Mix%20rice.png', 3),
('Chicken Lollypop', 'starters', 'Spicy coated deep fried chicken lollypop (6 pcs)', 200, false, '/images/Chicken%20Lollypop.jpg', 3),
('Honey Chilly Potato', 'starters', 'Crispy potatoes in sweet and spicy sauce', 150, true, 'https://images.unsplash.com/photo-1585692461937-251f2fbc5cf2?w=500&q=80', 3),
('Chicken Thukpa', 'soup', 'Authentic Himalayan noodle soup with chicken', 160, false, '/images/Thukpa.jpg', 4),
('Veg Thukpa', 'soup', 'Authentic Himalayan noodle soup with veggies', 140, true, '/images/Thukpa.jpg', 4),
('Chicken Chop Suey', 'soup', 'Crispy noodles topped with chicken gravy', 180, false, '/images/Chopcy.png', 4),
('Veg Chop Suey', 'soup', 'Crispy noodles topped with veg gravy', 160, true, '/images/Chopcy.png', 4);
