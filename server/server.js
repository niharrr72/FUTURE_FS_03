require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const Order = require('./models/Order');

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

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/darjeeling_momos')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
    const activeOrders = await Order.find({ status: { $nin: ['delivered', 'picked_up'] } });
    if (activeOrders.length === 0) return;

    const now = Date.now();

    for (const order of activeOrders) {
      const timeSinceUpdate = now - new Date(order.updatedAt).getTime();
      
      if (timeSinceUpdate >= PROGRESSION_INTERVAL_MS) {
        let nextStatus;

        if (order.orderType === 'pickup') {
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
          order.status = nextStatus;
          await order.save(); // Advances the updatedAt timestamp automatically

          // Broadcast to everyone listening (Customers and Admin)
          io.emit('order:statusUpdate', order);
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
