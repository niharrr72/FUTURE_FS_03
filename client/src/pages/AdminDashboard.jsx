import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BellRing, Package, RefreshCw, ChefHat, Check } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders');
      }
    };
    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('order:new', (order) => {
      setOrders(prev => [order, ...prev]);
      setNewOrderAlert(true);
      setTimeout(() => setNewOrderAlert(false), 3000);
      
      // Play sound if possible
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play blocked'));
      } catch (e) {}
    });

    socket.on('order:statusUpdate', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, [user, navigate]);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const statuses = ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pt-24 md:pt-32 pb-20 min-h-screen">
      
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold font-serif text-brand-dark flex items-center gap-2">
          👨‍🍳 Admin Portal
        </h2>
        
        {newOrderAlert && (
          <div className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full flex items-center gap-2 animate-bounce border border-green-300">
            <BellRing size={18} /> New Order!
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No orders yet.</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-brand-amber/30 p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:shadow-md transition-shadow">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-lg uppercase ${order.orderType === 'delivery' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {order.orderType}
                  </span>
                  <span className="text-xs text-brand-muted">{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                
                <div className="flex flex-col gap-1 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 mb-1">
                     <span className="font-bold text-gray-500 uppercase text-xs">Purchased By (Account)</span>
                     <span className="font-semibold text-brand-dark">{order.customerId?.name || 'Guest User'} • {order.customerId?.phone || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between items-start text-sm">
                     <span className="font-bold text-brand-orange uppercase text-xs">Delivery To (Recipient)</span>
                     <div className="text-right">
                       <span className="font-bold text-brand-dark block">{order.customerName} • {order.phone}</span>
                       {order.orderType === 'delivery' && (
                         <span className="text-xs text-gray-500 block mt-0.5">📍 {order.deliveryAddress?.text}</span>
                       )}
                     </div>
                   </div>
                </div>
                
                <div className="mt-3 text-sm flex gap-2 flex-wrap">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-brand-cream border border-brand-amber/20 px-2 py-1 rounded-md text-brand-dark font-medium">
                      {item.qty}x {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-48">
                <p className="font-bold text-xl text-brand-orange text-right">₹{order.total}</p>
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full p-2 border-2 border-brand-amber/50 rounded-lg bg-gray-50 focus:ring-brand-orange font-semibold capitalize cursor-pointer text-brand-dark"
                >
                  {order.orderType === 'pickup' 
                    ? ['received', 'preparing', 'ready_for_pickup', 'picked_up'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)
                    : ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)
                  }
                </select>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
