require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const supabase = require('./config/supabase'); // Directly query Supabase

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;

// --- Auto Order Progression Cron Job ---
const PROGRESSION_INTERVAL_MS = 6 * 60 * 1000; // Strictly 6 minutes per rules

setInterval(async () => {
  try {
    const { data: activeOrders, error } = await supabase
      .from('orders')
      .select(`
        *,
        custom_users (
          name, phone
        )
      `)
      .not('status', 'in', '("delivered","picked_up")');

    if (error || !activeOrders || activeOrders.length === 0) return;

    const now = Date.now();

    for (const order of activeOrders) {
      const timeSinceUpdate = now - new Date(order.updated_at).getTime();
      
      if (timeSinceUpdate >= PROGRESSION_INTERVAL_MS) {
        let nextStatus;

        if (order.order_type === 'pickup') {
          const pickupFlow = ['received', 'preparing', 'ready_for_pickup', 'picked_up'];
          const currentIndex = pickupFlow.indexOf(order.status);
          
          if (currentIndex !== -1 && currentIndex < pickupFlow.length - 1) {
             nextStatus = pickupFlow[currentIndex + 1];
          } else if (['ready', 'out_for_delivery'].includes(order.status)) {
             nextStatus = 'ready_for_pickup'; // Migrate wrongly labeled test orders
          }
        } else {
          const deliveryFlow = ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
          const currentIndex = deliveryFlow.indexOf(order.status);
          
          if (currentIndex !== -1 && currentIndex < deliveryFlow.length - 1) {
             nextStatus = deliveryFlow[currentIndex + 1];
          }
        }

        if (nextStatus) {
          const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: nextStatus, updated_at: new Date().toISOString() })
            .eq('id', order.id)
            .select(`
              *,
              custom_users (
                name, phone
              )
            `)
            .single();

          if (!updateError) {
            // Re-map to camelCase to match frontend models expected by socket events
            const mappedOrder = {
              _id: updatedOrder.id,
              id: updatedOrder.id,
              customerId: updatedOrder.custom_users ? {
                _id: updatedOrder.customer_id,
                name: updatedOrder.custom_users.name,
                phone: updatedOrder.custom_users.phone
              } : updatedOrder.customer_id,
              customerName: updatedOrder.customer_name,
              phone: updatedOrder.phone,
              items: updatedOrder.items,
              orderType: updatedOrder.order_type,
              deliveryAddress: updatedOrder.delivery_address,
              total: updatedOrder.total,
              status: updatedOrder.status,
              createdAt: updatedOrder.created_at,
              updatedAt: updatedOrder.updated_at
            };

            // Broadcast to everyone listening (Customers and Admin)
            io.emit('order:statusUpdate', mappedOrder);
          }
        }
      }
    }
  } catch (error) {
    console.error('Auto-progression error:', error);
  }
}, 10000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
