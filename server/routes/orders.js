const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD || process.env.ADMIN_PASSWORD
  }
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
    
    const itemsHtml = populatedOrder.items.map(i => `<li>${i.qty}x ${i.name}</li>`).join('');
    transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, 
      subject: `New Order Alert! #${populatedOrder.id.toString().slice(-6).toUpperCase()}`,
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
