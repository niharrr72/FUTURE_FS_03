import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { FileText, CheckCircle, ChefHat, CheckSquare, Bike, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Tracker() {
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/my/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders');
      }
    };

    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('order:statusUpdate', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, [user, navigate]);

  const currentOrder = orderId ? orders.find(o => o._id === orderId) : orders[0];

  const stages = currentOrder?.orderType === 'pickup' 
    ? [
        { id: 'received', label: 'Order Received', icon: FileText },
        { id: 'preparing', label: 'Preparing Food', icon: ChefHat },
        { id: 'ready_for_pickup', label: 'Ready for Pickup', icon: Package },
        { id: 'picked_up', label: 'Picked Up', icon: CheckCircle },
      ]
    : [
        { id: 'received', label: 'Order Received', icon: FileText },
        { id: 'preparing', label: 'Preparing Food', icon: ChefHat },
        { id: 'ready', label: 'Ready / Packed', icon: CheckSquare },
        { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle },
      ];

  if (!currentOrder) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 mt-10 text-center">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">No active orders</h2>
        <button onClick={() => navigate('/menu')} className="text-brand-orange font-bold hover:underline">
          Go to Menu
        </button>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex(s => s.id === currentOrder.status);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-10 pb-20">
      <h2 className="text-2xl font-bold font-serif text-brand-dark mb-6">Order Tracking</h2>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-brand-amber/20 mb-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <div>
            <p className="text-sm text-brand-muted font-bold">Order #{currentOrder._id.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-gray-400">{new Date(currentOrder.createdAt).toLocaleString()}</p>
          </div>
          <div className="bg-brand-cream text-brand-orange px-3 py-1 rounded-lg text-sm font-bold uppercase border border-brand-amber/20">
            {currentOrder.orderType}
          </div>
        </div>

        <div className="relative pl-6 space-y-8 py-4">
          {/* Vertical line */}
          <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-gray-100" />
          
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="relative flex items-center gap-4 z-10 transition-all">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 
                  ${isCompleted ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white border-gray-200 text-gray-300'}
                  ${isCurrent ? 'animate-pulse-amber shadow-[0_0_0_4px_rgba(251,191,36,0.2)] scale-110' : ''}
                `}>
                  <Icon size={14} />
                </div>
                <div>
                  <h4 className={`font-bold ${isCurrent ? 'text-brand-orange' : isCompleted ? 'text-brand-dark' : 'text-gray-400'}`}>
                    {stage.label}
                  </h4>
                  {isCurrent && stage.id === 'preparing' && (
                    <p className="text-xs text-brand-amber font-semibold mt-1">Preparing your food...</p>
                  )}
                  {isCurrent && stage.id === 'out_for_delivery' && (
                    <p className="text-xs text-brand-amber font-semibold mt-1">Arriving shortly!</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-amber/20">
        <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Order Items</h3>
        <div className="space-y-2">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="font-medium text-brand-dark">{item.qty}x {item.name}</span>
              <span className="text-brand-muted">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t mt-3 font-bold text-lg text-brand-dark">
            <span>Total</span>
            <span className="text-brand-orange">₹{currentOrder.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
