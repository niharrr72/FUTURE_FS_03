require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const menuItems = [
  // TIER 1: MOMOS
  { name: 'Chicken Steam Momos', category: 'momos', description: 'Classic Darjeeling style steamed chicken momos (10 pcs)', price: 120, is_veg: false, image_url: '/images/VegChicken%20Steam%20Momos.jpg', tier: 1 },
  { name: 'Veg Steam Momos', category: 'momos', description: 'Steamed momos loaded with fresh seasonal veggies (10 pcs)', price: 100, is_veg: true, image_url: '/images/VegChicken%20Steam%20Momos.jpg', tier: 1 },
  { name: 'Paneer Steam Momos', category: 'momos', description: 'Soft paneer and herb filled steamed momos (10 pcs)', price: 130, is_veg: true, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=500&q=80', tier: 1 },
  { name: 'Chicken Fried Momos', category: 'momos', description: 'Crispy deep-fried chicken momos served with spicy chutney', price: 140, is_veg: false, image_url: '/images/Chicken%20Fried%20Momos.jpg', tier: 1 },
  { name: 'Veg Fried Momos', category: 'momos', description: 'Golden crispy deep-fried veg momos', price: 120, is_veg: true, image_url: '/images/vegfriedmomos.png', tier: 1 },
  { name: 'Paneer Fried Momos', category: 'momos', description: 'Crispy fried paneer momos', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80', tier: 1 },
  { name: 'Chicken Pan Fried Momos', category: 'momos', description: 'Pan fried chicken momos tossed in our special signature sauce', price: 150, is_veg: false, image_url: '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', tier: 1 },
  { name: 'Veg Pan Fried Momos', category: 'momos', description: 'Pan fried veg momos in tangy and spicy sauce', price: 130, is_veg: true, image_url: '/images/Pan%20Fried%20VegPan%20Fried%20Chicken%20Momos.jpg', tier: 1 },
  { name: 'Chicken Manchurian Momos', category: 'momos', description: 'Chicken momos tossed in classic indo-chinese manchurian sauce', price: 160, is_veg: false, image_url: '/images/Chicken%20Manchurian%20Momos.jpg', tier: 1 },
  { name: 'Veg Manchurian Momos', category: 'momos', description: 'Veg momos tossed in dark manchurian gravy', price: 140, is_veg: true, image_url: '/images/Veg%20Manchurian%20Momos.jpg', tier: 1 },
  { name: 'Chicken Schezwan Momos', category: 'momos', description: 'Spicy chicken momos tossed in fiery schezwan sauce', price: 160, is_veg: false, image_url: 'https://images.unsplash.com/photo-1563245339-dfc3202e82f7?w=500&q=80', tier: 1 },
  { name: 'Chicken Jhol Momo', category: 'momos', description: 'Momos served in a traditional spicy sesame and tomato broth', price: 170, is_veg: false, image_url: 'https://images.unsplash.com/photo-1625220101773-0ca4b2790b20?w=500&q=80', tier: 1 },
  { name: 'Veg Jhol Momo', category: 'momos', description: 'Veg momos in satisfying traditional jhol broth', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1625220101773-0ca4b2790b20?w=500&q=80', tier: 1 },
  
  // TIER 2: NOODLES
  { name: 'Chicken Fried Noodles', category: 'noodles', description: 'Wok tossed chicken and egg noodles with veggies', price: 150, is_veg: false, image_url: '/images/Chicken%20Fried%20Noodles.jpg', tier: 2 },
  { name: 'Veg Chowmein', category: 'noodles', description: 'Authentic street-style veg chowmein', price: 130, is_veg: true, image_url: '/images/Chowmein%20Veg%20Noodles.jpg', tier: 2 },
  { name: 'Egg Fried Noodles', category: 'noodles', description: 'Noodles tossed with scrambled eggs and spices', price: 140, is_veg: false, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=80', tier: 2 },
  { name: 'Paneer Noodles', category: 'noodles', description: 'Noodles with soft paneer cubes and veggies', price: 160, is_veg: true, image_url: 'https://images.unsplash.com/photo-1617093275098-a1488f763ba0?w=500&q=80', tier: 2 },
  { name: 'Schezwan Chicken Noodles', category: 'noodles', description: 'Spicy wok-tossed chicken noodles in schezwan sauce', price: 170, is_veg: false, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80', tier: 2 },
  { name: 'Mixed Fried Noodles', category: 'noodles', description: 'Power packed noodles with chicken, egg and veggies', price: 190, is_veg: false, image_url: 'https://images.unsplash.com/photo-1617093275098-a1488f763ba0?w=500&q=80', tier: 2 },

  // TIER 3: RICE & STARTERS
  { name: 'Chicken Fried Rice', category: 'rice', description: 'Classic wok-tossed chicken fried rice', price: 160, is_veg: false, image_url: '/images/Chicken%20Fried%20Rice.jpg', tier: 3 },
  { name: 'Veg Fried Rice', category: 'rice', description: 'Aromatic veg fried rice with fine chopped veggies', price: 140, is_veg: true, image_url: '/images/Veg%20Fried%20Rice%20Veg%20Mix%20rice.png', tier: 3 },
  { name: 'Schezwan Chicken Rice', category: 'rice', description: 'Fiery chicken fried rice tossed in schezwan peppers', price: 180, is_veg: false, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80', tier: 3 },
  { name: 'Chicken Lollypop', category: 'starters', description: 'Spicy coated deep fried chicken lollypop (6 pcs)', price: 200, is_veg: false, image_url: '/images/Chicken%20Lollypop.jpg', tier: 3 },
  { name: 'Honey Chilly Potato', category: 'starters', description: 'Crispy finger fries tossed in honey and chili sauce', price: 150, is_veg: true, image_url: 'https://images.unsplash.com/photo-1585692461937-251f2fbc5cf2?w=500&q=80', tier: 3 },
  { name: 'Chilly Chicken (Dry)', category: 'starters', description: 'Semi-dry spicy chicken chunks with bell peppers', price: 180, is_veg: false, image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80', tier: 3 },
  { name: 'Chilly Paneer (Dry)', category: 'starters', description: 'Indo-chinese style spicy paneer cubes', price: 170, is_veg: true, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80', tier: 3 },
  { name: 'Chicken 65', category: 'starters', description: 'South-indian style tempered spicy fried chicken', price: 190, is_veg: false, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&q=80', tier: 3 },

  // TIER 4: SOUPS & CHOP SUEY
  { name: 'Chicken Thukpa', category: 'soup', description: 'Authentic Himalayan noodle soup with tender chicken chunks', price: 160, is_veg: false, image_url: '/images/Thukpa.jpg', tier: 4 },
  { name: 'Veg Thukpa', category: 'soup', description: 'Authentic Himalayan noodle soup with garden fresh veggies', price: 140, is_veg: true, image_url: '/images/Thukpa.jpg', tier: 4 },
  { name: 'Chicken Chop Suey', category: 'soup', description: 'American style crispy noodles with chicken and egg gravy', price: 180, is_veg: false, image_url: '/images/Chopcy.png', tier: 4 },
  { name: 'Veg Chop Suey', category: 'soup', description: 'Crispy fried noodles topped with mixed vegetable gravy', price: 160, is_veg: true, image_url: '/images/Chopcy.png', tier: 4 },
  { name: 'Chicken Clear Soup', category: 'soup', description: 'Light and healthy chicken stock soup with mild spices', price: 100, is_veg: false, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80', tier: 4 },
  { name: 'Veg Hot & Sour Soup', category: 'soup', description: 'Spicy and tangy oriental soup with fresh veggies', price: 90, is_veg: true, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80', tier: 4 }
];

async function seed() {
  console.log('Cleaning existing menu items...');
  const { error: deleteError } = await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error cleaning table:', deleteError);
    return;
  }

  console.log(`Inserting ${menuItems.length} menu items...`);
  const { data, error } = await supabase.from('menu_items').insert(
    menuItems.map(item => ({
      ...item,
      is_veg: item.is_veg, // Keep the boolean
      available: true
    }))
  );

  if (error) {
    console.error('Error seeding menu:', error);
  } else {
    console.log('Menu seeded successfully!');
  }
}

seed();
