require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const baseMenuItems = [
  // CHICKEN MOMOS
  { name: "Chicken Kurkure Momos",   category: "momos", subcategory: "chicken", price: 160, weight: "200gm", description: "Crispy and crunchy batter-fried juicy chicken momos served with spicy red chutney.", imageUrl: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&q=80" },
  { name: "Chicken Dragon Momo",     category: "momos", subcategory: "chicken", price: 140, weight: "200gm", description: "Spicy tossed chicken momos rich with garlic and chilli sauce." },
  { name: "Chicken Singapuri Momo",  category: "momos", subcategory: "chicken", price: 140, weight: "200gm" },
  { name: "Chicken Thai Momo",       category: "momos", subcategory: "chicken", price: 140, weight: "200gm" },
  { name: "Chicken Manchurian Momo", category: "momos", subcategory: "chicken", price: 140, weight: "200gm", description: "Soft chicken momos dunked in a generous serving of hot garlic Manchurian gravy.", imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80" },
  { name: "Chicken Pan Fried Momo",  category: "momos", subcategory: "chicken", price: 120, weight: "180gm", description: "Golden pan-fried chicken momos slightly crispy on the outside.", imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80" },
  { name: "Chicken Fried Momo",      category: "momos", subcategory: "chicken", price: 110, weight: "180gm" },
  { name: "Chicken Steam Momo",      category: "momos", subcategory: "chicken", price: 100, weight: "150gm", description: "Classic steamed chicken momos, light and flavorful.", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=500&q=80" },

  // VEG MOMOS
  { name: "Veg Kurkure Momos",   category: "momos", subcategory: "veg", price: 160, weight: "200gm", description: "Crunchy battered veg momos loaded with fresh veggies and paneer.", imageUrl: "https://plus.unsplash.com/premium_photo-1664115160877-e6f9a0715eef?w=500&q=80" },
  { name: "Veg Dragon Momo",     category: "momos", subcategory: "veg", price: 140, weight: "200gm" },
  { name: "Veg Singapuri Momo",  category: "momos", subcategory: "veg", price: 140, weight: "200gm" },
  { name: "Veg Thai Momo",       category: "momos", subcategory: "veg", price: 140, weight: "200gm" },
  { name: "Veg Manchurian Momo", category: "momos", subcategory: "veg", price: 140, weight: "200gm" },
  { name: "Veg Pan Fried Momo",  category: "momos", subcategory: "veg", price: 120, weight: "180gm", description: "Delightful pan-fried veg momos with a subtle smoky crisp.", imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80" },
  { name: "Veg Fried Momo",      category: "momos", subcategory: "veg", price: 110, weight: "180gm" },
  { name: "Veg Steam Momo",      category: "momos", subcategory: "veg", price: 100, weight: "150gm", description: "Soft, pillowy steamed momos packed with cabbage, carrot, and fine veggies.", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?w=500&q=80" },

  // VEG RICE & NOODLES
  { name: "Veg Hakka Noodles",     category: "noodles", subcategory: "veg", price: 120, weight: "300gm", description: "Classic street-style Hakka noodles tossed with soy sauce and veggies.", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
  { name: "Veg Pan Fried Noodles", category: "noodles", subcategory: "veg", price: 140, weight: "300gm" },
  { name: "Veg Mixed Noodles",     category: "noodles", subcategory: "veg", price: 140, weight: "350gm" },
  { name: "Veg Paneer Noodles",    category: "noodles", subcategory: "veg", price: 140, weight: "350gm" },
  { name: "Veg Triple Rice",       category: "noodles", subcategory: "veg", price: 130, weight: "350gm" },
  { name: "Veg Mix Rice",          category: "noodles", subcategory: "veg", price: 130, weight: "350gm", description: "Fluffy mixed veg fried rice packed with green beans, carrots, and sweet corn.", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80" },
  { name: "Veg Schezwan Noodles",  category: "noodles", subcategory: "veg", price: 140, weight: "300gm" },
  { name: "Veg Noodles",           category: "noodles", subcategory: "veg", price: 120, weight: "300gm" },
  { name: "Veg Rice",              category: "noodles", subcategory: "veg", price: 110, weight: "300gm" },

  // NON VEG RICE & NOODLES
  { name: "Chicken Hakka Noodles",       category: "noodles", subcategory: "chicken", price: 150, weight: "350gm", description: "Wok-tossed Hakka noodles packed with juicy scrambled eggs and chicken chunks.", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
  { name: "Chicken Fried Rice",          category: "noodles", subcategory: "chicken", price: 120, weight: "350gm", description: "Comforting fried rice cooked with soy sauce, egg bits, and tender chicken.", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80" },
  { name: "Chicken Schezwan Rice",       category: "noodles", subcategory: "chicken", price: 130, weight: "350gm" },
  { name: "Chicken Triple Fried Rice",   category: "noodles", subcategory: "chicken", price: 140, weight: "400gm" },
  { name: "Chicken Noodles",             category: "noodles", subcategory: "chicken", price: 120, weight: "350gm" },
  { name: "Chicken Schezwan Noodles",    category: "noodles", subcategory: "chicken", price: 130, weight: "350gm" },
  { name: "Chicken Thukpa",              category: "noodles", subcategory: "chicken", price: 120, weight: "400gm", description: "Tibetan style hearty noodle soup rich with chicken broth and veggies.", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
  { name: "Chicken Chopcy",              category: "noodles", subcategory: "chicken", price: 170, weight: "350gm" },

  // CHICKEN STARTERS
  { name: "Pepper Chicken Dry",    category: "starters", subcategory: "chicken", price: 140, weight: "250gm" },
  { name: "Chilly Chicken Dry",    category: "starters", subcategory: "chicken", price: 140, weight: "250gm", description: "Indo-Chinese favorite! Batter-fried tossed in garlic, soy, and chilli.", imageUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80" },
  { name: "Chilly Chicken Gravy",  category: "starters", subcategory: "chicken", price: 140, weight: "300gm" },
  { name: "Dragon Chicken",        category: "starters", subcategory: "chicken", price: 140, weight: "250gm" },
  { name: "Chicken Manchurian",    category: "starters", subcategory: "chicken", price: 140, weight: "250gm" },
  { name: "Chicken Lolilop",       category: "starters", subcategory: "chicken", price: 170, weight: "300gm", description: "Juicy chicken wings shaped like lollipops, fried and tossed in hot sauce.", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&q=80" },

  // VEG STARTERS
  { name: "Dragon Potato",     category: "starters", subcategory: "veg", price: 110, weight: "200gm" },
  { name: "Pepper Potato",     category: "starters", subcategory: "veg", price: 110, weight: "200gm" },
  { name: "Manchurian",        category: "starters", subcategory: "veg", price: 110, weight: "250gm", description: "Vegetable dumplings cooked in a dark soy and garlic Manchurian sauce.", imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&q=80" },
  { name: "Chilly Potato",     category: "starters", subcategory: "veg", price: 110, weight: "200gm" },
  { name: "Chilly Paneer",     category: "starters", subcategory: "veg", price: 110, weight: "250gm", description: "Soft paneer cubes tossed with fresh bell peppers and spicy sauce.", imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },
  { name: "Crispy Noodles",    category: "starters", subcategory: "veg", price: 160, weight: "200gm" },
  { name: "Honey Chilly Potato", category: "starters", subcategory: "veg", price: 120, weight: "250gm", description: "Sweet and spicy potato wedges glazed in honey-chilli sauce.", imageUrl: "https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=500&q=80" },

  // SOUPS
  { name: "Manchow Chicken Soup", category: "soup", subcategory: "chicken", price: 90, weight: "300ml", description: "Dark brown Indian Chinese soup with chicken and crispy noodles on top.", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
  { name: "Hot & Chicken Soup",   category: "soup", subcategory: "chicken", price: 90, weight: "300ml" },
  { name: "Veg Manchow Soup",     category: "soup", subcategory: "veg", price: 90, weight: "300ml" },
  { name: "Veg Hot & Sour Soup",  category: "soup", subcategory: "veg", price: 90, weight: "300ml", description: "Spicy and tangy thick veg soup loaded with bamboo shoots and mushrooms.", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
  { name: "Veg Thukpa",           category: "soup", subcategory: "veg", price: 110, weight: "400ml" },
  { name: "Chicken Pasta",        category: "soup", subcategory: "chicken", price: 160, weight: "350gm" }
];

const menuItems = baseMenuItems.map(item => ({
  ...item,
  veg: item.subcategory === 'veg',
  description: item.description || `Delicious ${item.name} prepared fresh with authentic spices.`,
  imageUrl: item.imageUrl || "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&q=80"
}));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/darjeeling_momos');
    console.log('Connected to MongoDB.');

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log('Seeded menu items successfully with descriptions and weights.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
