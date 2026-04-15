require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const menuItems = [
  // TIER 1: MOMOS
  { name: 'Chicken Steam Momos', category: 'momos', description: 'Authentic Darjeeling style chicken steamed momos (10 pcs)', price: 120, is_veg: false, image_url: '/images/VegChicken%20Steam%20Momos.jpg', tier: 1 },
  { name: 'Veg Steam Momos', category: 'momos', description: 'Fresh vegetable steamed momos (10 pcs)', price: 100, is_veg: true, image_url: '/images/VegChicken%20Steam%20Momos.jpg', tier: 1 },
  { name: 'Paneer Steam Momos', category: 'momos', description: 'Creamy paneer and cilantro filled steamed dumplings', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1547928576-a4a33237bee3?w=600&q=80', tier: 1 },
  { name: 'Chicken Fried Momos', category: 'momos', description: 'Golden crispy fried chicken momos', price: 140, is_veg: false, image_url: '/images/Chicken%20Fried%20Momos.jpg', tier: 1 },
  { name: 'Veg Fried Momos', category: 'momos', description: 'Golden crispy fried vegetable momos', price: 120, is_veg: true, image_url: '/images/vegfriedmomos.png', tier: 1 },
  { name: 'Paneer Fried Momos', category: 'momos', description: 'Crispy fried paneer dumplings', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80', tier: 1 },
  { name: 'Chicken Pan Fried Momos', category: 'momos', description: 'Pan fried chicken momos tossed in spicy sauce', price: 150, is_veg: false, image_url: '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', tier: 1 },
  { name: 'Veg Pan Fried Momos', category: 'momos', description: 'Pan fried veg momos in tangy sauce', price: 130, is_veg: true, image_url: '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', tier: 1 },
  { name: 'Chicken Manchurian Momos', category: 'momos', description: 'Chicken momos tossed in classic manchurian gravy', price: 160, is_veg: false, image_url: '/images/Chicken%20Manchurian%20Momos.jpg', tier: 1 },
  { name: 'Veg Manchurian Momos', category: 'momos', description: 'Veg momos tossed in manchurian gravy', price: 140, is_veg: true, image_url: '/images/Veg%20Manchurian%20Momos.jpg', tier: 1 },
  { name: 'Chicken Schezwan Momos', category: 'momos', description: 'Momos tossed in fiery schezwan pepper sauce', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1563245339-dfc3202e82f7?w=600&q=80', tier: 1 },

  // TIER 2: NOODLES
  { name: 'Chicken Fried Noodles', category: 'noodles', description: 'Aromatic noodles tossed with chicken and egg', price: 150, is_veg: false, image_url: '/images/Chicken%20Fried%20Noodles.jpg', tier: 2 },
  { name: 'Veg Chowmein', category: 'noodles', description: 'Street-style veg noodles with fresh peppers', price: 130, is_veg: true, image_url: '/images/Chowmein%20%20Veg%20Noodles.jpg', tier: 2 },
  { name: 'Egg Fried Noodles', category: 'noodles', description: 'Wok tossed noodles with scrambled egg', price: 140, is_veg: false, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80', tier: 2 },
  { name: 'Paneer Noodles', category: 'noodles', description: 'Soft paneer cubes and vegetables tossed with noodles', price: 160, is_veg: true, image_url: 'https://images.unsplash.com/photo-1617093275098-a1488f763ba0?w=600&q=80', tier: 2 },

  // TIER 3: RICE & STARTERS
  { name: 'Chicken Fried Rice', category: 'rice', description: 'Classic chicken fried rice with spring onions', price: 160, is_veg: false, image_url: '/images/Chicken%20Fried%20Rice.jpg', tier: 3 },
  { name: 'Veg Fried Rice', category: 'rice', description: 'Healthy and aromatic vegetable fried rice', price: 140, is_veg: true, image_url: '/images/Veg%20Fried%20Rice%20Veg%20Mix%20rice.png', tier: 3 },
  { name: 'Chicken Lollypop', category: 'starters', description: 'Spicy deep fried chicken lollypop (6 pcs)', price: 200, is_veg: false, image_url: '/images/Chicken%20Lollypop.jpg', tier: 3 },
  { name: 'Honey Chilli Potato', category: 'starters', description: 'Crispy sesame potato in honey-chilli sauce', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1585692461937-251f2fbc5cf2?w=600&q=80', tier: 3 },
  { name: 'Chilly Chicken (Dry)', category: 'starters', description: 'Semi-dry spicy chicken chunks', price: 180, is_veg: false, image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80', tier: 3 },
  { name: 'Spring Roll (Veg)', category: 'starters', description: 'Crispy vegetable rolls served with dip', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265da4?w=600&q=80', tier: 3 },

  // TIER 4: SOUP & CHOP SUEY
  { name: 'Chicken Thukpa', category: 'soup', description: 'Traditional Himalayan chicken noodle soup', price: 160, is_veg: false, image_url: '/images/Thukpa.jpg', tier: 4 },
  { name: 'Veg Thukpa', category: 'soup', description: 'Comforting Himalayan vegetable noodle soup', price: 140, is_veg: true, image_url: '/images/Thukpa.jpg', tier: 4 },
  { name: 'Chicken Chop Suey', category: 'soup', description: 'Crispy noodles with chicken and egg gravy', price: 180, is_veg: false, image_url: '/images/Chopcy.png', tier: 4 },
  { name: 'Veg Chop Suey', category: 'soup', description: 'Crispy noodles with mixed vegetable gravy', price: 160, is_veg: true, image_url: '/images/Chopcy.png', tier: 4 }
];

async function seed() {
  console.log('Cleaning...');
  await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log(`Seeding ${menuItems.length} items with encoded paths...`);
  const { error } = await supabase.from('menu_items').insert(menuItems);
  if (error) console.error(error);
  else console.log('Sucessfully updated with your uploaded photos!');
}

seed();
