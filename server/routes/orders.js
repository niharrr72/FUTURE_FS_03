const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD || process.env.ADMIN_PASSWORD
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,
  socketTimeout: 15000
});

router.post('/', async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: req.body.customerId, // Using custom UUID
        customer_name: req.body.customerName,
        phone: req.body.phone,
        items: req.body.items,
        order_type: req.body.orderType,
        delivery_address: req.body.deliveryAddress,
        total: Number(req.body.total),
        status: req.body.status || 'received'
      })
      .select(`
        *,
        custom_users (
          name, phone, email
        )
      `)
      .single();

    if (error) throw error;
    
    // Convert to frontend camelCase expectations
    const populatedOrder = {
      _id: order.id,
      id: order.id,
      customerId: order.custom_users ? {
        _id: order.customer_id,
        name: order.custom_users.name,
        phone: order.custom_users.phone,
        email: order.custom_users.email
      } : order.customer_id,
      customerName: order.customer_name,
      phone: order.phone,
      items: order.items,
      orderType: order.order_type,
      deliveryAddress: order.delivery_address,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };

    if (req.io) {
      req.io.emit('order:new', populatedOrder);
    }
    
    // --- Email Notification ---
    try {
      const itemsList = Array.isArray(populatedOrder.items) ? populatedOrder.items : [];
      const itemsHtml = itemsList.map(i => `<li>${i.qty}x ${i.name}</li>`).join('');
      
      // Fire off email in background - DO NOT AWAIT to keep checkout instant
      transporter.sendMail({
        from: `Darjeeling Momos <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL, 
        subject: `New Order Alert! #${populatedOrder.id.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f97316;">New Order Received! 🥟</h2>
            <p style="font-size: 1.1rem;"><strong>Total Value:</strong> ₹${populatedOrder.total}</p>
            <p><strong>Customer:</strong> ${populatedOrder.customerId?.name || 'Guest'} (${populatedOrder.customerId?.phone || 'N/A'})</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p><strong>Recipient Name:</strong> ${populatedOrder.customerName}</p>
            <p><strong>Recipient Phone:</strong> ${populatedOrder.phone}</p>
            <p><strong>Order Type:</strong> <span style="text-transform: capitalize;">${populatedOrder.orderType}</span></p>
            <p><strong>Items:</strong></p>
            <ul style="background: #fdf2f2; padding: 15px 30px; border-radius: 10px;">${itemsHtml}</ul>
            <p style="font-size: 0.8rem; color: #999; margin-top: 30px;">Order ID: ${populatedOrder.id}</p>
          </div>
        `
      }).then(() => console.log('Admin email alert sent.')).catch(e => console.error('Email alert failed:', e.message));
    } catch (mailErr) {
      console.error('Email logic failed:', mailErr.message);
    }

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        custom_users (
          name, phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = orders.map(order => ({
      _id: order.id,
      id: order.id,
      customerId: order.custom_users ? {
        _id: order.customer_id,
        name: order.custom_users.name,
        phone: order.custom_users.phone
      } : order.customer_id,
      customerName: order.customer_name,
      phone: order.phone,
      items: order.items,
      orderType: order.order_type,
      deliveryAddress: order.delivery_address,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my/:customerId', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', req.params.customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = orders.map(order => ({
      _id: order.id,
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name,
      phone: order.phone,
      items: order.items,
      orderType: order.order_type,
      deliveryAddress: order.delivery_address,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Manually push updated_at to ensure progression sees the new timestamp
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select(`
        *,
        custom_users (
          name, phone
        )
      `)
      .single();
      
    if (error) throw error;

    const mappedOrder = {
      _id: order.id,
      id: order.id,
      customerId: order.custom_users ? {
        _id: order.customer_id,
        name: order.custom_users.name,
        phone: order.custom_users.phone
      } : order.customer_id,
      customerName: order.customer_name,
      phone: order.phone,
      items: order.items,
      orderType: order.order_type,
      deliveryAddress: order.delivery_address,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
    
    if (req.io) {
      req.io.emit('order:statusUpdate', mappedOrder);
    }
    
    res.json(mappedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
