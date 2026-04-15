const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // momos, noodles, starters, soup
  subcategory: { type: String, required: true }, // veg, chicken
  price: { type: Number, required: true },
  description: { type: String },
  weight: { type: String },
  imageUrl: { type: String },
  available: { type: Boolean, default: true },
  veg: { type: Boolean, default: true } // true for veg, false for non-veg
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
