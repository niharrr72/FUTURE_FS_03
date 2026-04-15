import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { FileText, CheckCircle, ChefHat, CheckSquare, Bike, Package, X } from 'lucide-react';
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

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-brand-amber/20 mb-6 font-sans">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <div>
            <p className="text-sm text-brand-muted font-bold tracking-tight">Order #{currentOrder._id.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-gray-400 font-medium">{new Date(currentOrder.createdAt).toLocaleString()}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border 
            ${currentOrder.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-brand-cream text-brand-orange border-brand-amber/20'}`}>
            {currentOrder.status === 'cancelled' ? 'Cancelled' : currentOrder.orderType}
          </div>
        </div>

        {currentOrder.status === 'cancelled' ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl shadow-red-100 overflow-hidden relative">
              <X size={48} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-red-600 mb-2 tracking-tight">Order Cancelled</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">This order has been successfully cancelled. If you already made a payment, please contact support for a refund.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-8 py-6">
            <div className="absolute left-9 top-8 bottom-8 w-[1.5px] bg-gray-100" />
            
            {stages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="relative flex items-center gap-6 z-10 transition-all">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isCompleted ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-100 text-gray-200'}
                    ${isCurrent ? 'ring-4 ring-orange-50 scale-110' : ''}
                  `}>
                    <Icon size={16} strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className={`text-base font-black tracking-tight ${isCurrent ? 'text-brand-orange' : isCompleted ? 'text-brand-dark' : 'text-gray-300'}`}>
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase text-brand-amber tracking-widest mt-0.5 animate-pulse">
                        Step In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-amber/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50" />
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
          <h3 className="text-lg font-black text-gray-800 tracking-tight">Order Summary</h3>
          {['received', 'preparing'].includes(currentOrder.status) && (
            <button 
              onClick={async () => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  try {
                    await api.patch(`/orders/cancel/${currentOrder._id}`);
                  } catch (err) {
                    alert(err.response?.data?.message || 'Failed to cancel order');
                  }
                }
              }}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-100 active:scale-95 shadow-sm"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="space-y-4">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.qty}</span>
              </div>
              <span className="font-black text-gray-700">₹{item.price * item.qty}</span>
            </div>
          ))}
          
          <div className="pt-6 border-t border-gray-100 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
              <span className="text-2xl font-black text-brand-orange tracking-tight">₹{currentOrder.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
