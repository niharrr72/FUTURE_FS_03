const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: { type: String }, // Stores Supabase UUID
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  items: [orderItemSchema],
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  deliveryAddress: {
    text: String,
    mapsLink: String
  },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'ready_for_pickup', 'picked_up'],
    default: 'received'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
