const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Reuse existing admin credentials for mailing via Gmail. Requires a Google App Password to work natively.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD || process.env.ADMIN_PASSWORD
  }
});

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Populate the base customer info to see who ACTUALLY ordered it
    const populatedOrder = await Order.findById(order._id).populate('customerId', 'name phone email');

    // Emit real-time event to admin
    if (req.io) {
      req.io.emit('order:new', populatedOrder);
    }
    
    // Send background email alert
    const itemsHtml = populatedOrder.items.map(i => `<li>${i.qty}x ${i.name}</li>`).join('');
    transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // Admin notifies himself
      subject: `New Order Alert! #${populatedOrder._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <h2>New Order Received! 🥟</h2>
        <p><strong>Total Value:</strong> ₹${populatedOrder.total}</p>
        <p><strong>Purchased By Account:</strong> ${populatedOrder.customerId?.name || 'Guest'} (${populatedOrder.customerId?.phone || 'N/A'})</p>
        <hr/>
        <p><strong>Delivery To Name:</strong> ${populatedOrder.customerName}</p>
        <p><strong>Delivery Phone:</strong> ${populatedOrder.phone}</p>
        <p><strong>Type:</strong> ${populatedOrder.orderType}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
      `
    }).catch(err => console.log('Email block: requires App Password setup.'));

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('customerId', 'name phone');
    
    // Emit to customer tracking the order
    if (req.io) {
      req.io.emit('order:statusUpdate', order);
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
