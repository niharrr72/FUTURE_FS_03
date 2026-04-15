require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const menuItems = [
  // TIER 1: MOMOS
  { name: 'Chicken Steam Momos', category: 'momos', description: 'Darjeeling style steamed chicken dumplings (10 pcs)', price: 120, is_veg: false, image_url: 'https://images.unsplash.com/photo-1625220101773-0ca4b2790b20?w=600&q=80', tier: 1 },
  { name: 'Veg Steam Momos', category: 'momos', description: 'Fresh garden vegetable steamed dumplings (10 pcs)', price: 100, is_veg: true, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=600&q=80', tier: 1 },
  { name: 'Paneer Steam Momos', category: 'momos', description: 'Creamy paneer and herb filled dumplings (10 pcs)', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80', tier: 1 },
  { name: 'Chicken Fried Momos', category: 'momos', description: 'Deep fried crispy chicken dumplings', price: 140, is_veg: false, image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80', tier: 1 },
  { name: 'Veg Fried Momos', category: 'momos', description: 'Deep fried crispy vegetable dumplings', price: 120, is_veg: true, image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb47795?w=600&q=80', tier: 1 },
  { name: 'Paneer Fried Momos', category: 'momos', description: 'Crispy fried paneer dumplings', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80', tier: 1 },
  { name: 'Chicken Pan Fried Momos', category: 'momos', description: 'Pan fried momos tossed in spicy schezwan gravy', price: 150, is_veg: false, image_url: 'https://images.unsplash.com/photo-1563245339-dfc3202e82f7?w=600&q=80', tier: 1 },
  { name: 'Veg Pan Fried Momos', category: 'momos', description: 'Pan fried veg momos in tangy garlic sauce', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1563245339-dfc3202e82f7?w=600&q=80', tier: 1 },
  { name: 'Chicken Manchurian Momos', category: 'momos', description: 'Momos tossed in dark manchurian gravy', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', tier: 1 },
  { name: 'Veg Manchurian Momos', category: 'momos', description: 'Veg momos in satisfying manchurian sauce', price: 140, is_veg: true, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', tier: 1 },
  { name: 'Jhol Momo Chicken', category: 'momos', description: 'Nepalese style momo served in cold spicy sesame soup', price: 170, is_veg: false, image_url: 'https://images.unsplash.com/photo-1625220101773-0ca4b2790b20?w=600&q=80', tier: 1 },
  { name: 'Kothey Momo Chicken', category: 'momos', description: 'Half-steamed half-fried signature dumplings', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80', tier: 1 },

  // TIER 2: NOODLES
  { name: 'Chicken Fried Noodles', category: 'noodles', description: 'Classic Hakka style chicken noodles', price: 150, is_veg: false, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', tier: 2 },
  { name: 'Veg Chowmein', category: 'noodles', description: 'Wok tossed street style veg noodles', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80', tier: 2 },
  { name: 'Schezwan Chicken Noodles', category: 'noodles', description: 'Spicy wok tossed noodles with chicken', price: 170, is_veg: false, image_url: 'https://images.unsplash.com/photo-1617093275098-a1488f763ba0?w=600&q=80', tier: 2 },
  { name: 'Egg Noodles', category: 'noodles', description: 'Noodles tossed with fried eggs and crisp veggies', price: 140, is_veg: false, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80', tier: 2 },
  { name: 'Burmese Khow Suey (Chicken)', category: 'noodles', description: 'Coconut milk based noodle soup with condiments', price: 220, is_veg: false, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', tier: 2 },

  // TIER 3: RICE & STARTERS
  { name: 'Chicken Fried Rice', category: 'rice', description: 'Aromatic basmati tossed with chicken and egg', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80', tier: 3 },
  { name: 'Veg Fried Rice', category: 'rice', description: 'Classic veg fried rice with spring onions', price: 140, is_veg: true, image_url: 'https://images.unsplash.com/photo-1626500155519-747de0694181?w=600&q=80', tier: 3 },
  { name: 'Schezwan Egg Rice', category: 'rice', description: 'Spicy egg rice with dry red chillies', price: 150, is_veg: false, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80', tier: 3 },
  { name: 'Chicken Lollypop (6 pcs)', category: 'starters', description: 'Spicy chicken drummettes served with schezwan dip', price: 200, is_veg: false, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80', tier: 3 },
  { name: 'Honey Chilli Potato', category: 'starters', description: 'Crispy sesame potato fingers in honey glaze', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1585692461937-251f2fbc5cf2?w=600&q=80', tier: 3 },
  { name: 'Chicken 65', category: 'starters', description: 'Tempered spicy fried chicken cubes', price: 190, is_veg: false, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&q=80', tier: 3 },
  { name: 'Spring Roll (Veg)', category: 'starters', description: 'Crispy rolls filled with shredded vegetables', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265da4?w=600&q=80', tier: 3 },
  { name: 'Chicken Wings (Peri Peri)', category: 'starters', description: 'Succulent wings tossed in spicy peri peri dust', price: 180, is_veg: false, image_url: 'https://images.unsplash.com/photo-1527477396000-dcad79589a19?w=600&q=80', tier: 3 },

  // TIER 4: SOUP & CHOP SUEY
  { name: 'Chicken Thukpa', category: 'soup', description: 'Traditional Himalayan noodle soup with chicken', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', tier: 4 },
  { name: 'Veg Thukpa', category: 'soup', description: 'Warm and comforting vegetable noodle soup', price: 140, is_veg: true, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', tier: 4 },
  { name: 'Chicken Hot & Sour Soup', category: 'soup', description: 'Tangy and spicy thick soup with egg drops', price: 110, is_veg: false, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', tier: 4 },
  { name: 'Veg Sweet Corn Soup', category: 'soup', description: 'Creamy sweet corn soup with minced veggies', price: 100, is_veg: true, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', tier: 4 },
  { name: 'Chicken American Chop Suey', category: 'soup', description: 'Crispy noodles with chicken gravy and fried egg on top', price: 200, is_veg: false, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', tier: 4 }
];

async function seed() {
  console.log('Clearing existing menu...');
  await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log(`Inserting ${menuItems.length} premium items...`);
  const { error } = await supabase.from('menu_items').insert(menuItems);

  if (error) {
    console.error('Seeding failed:', error);
  } else {
    console.log('Full Darjeeling Menu Restored Successfully!');
  }
}

seed();
