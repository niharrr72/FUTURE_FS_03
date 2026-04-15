import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, Package, Bike, ChefHat, FileText } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get(`/orders/my/${user.id}`)
      .then(res => {
        setOrders(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received': return <FileText size={18} className="text-gray-500" />;
      case 'preparing': return <ChefHat size={18} className="text-brand-amber" />;
      case 'ready': return <Package size={18} className="text-brand-orange" />;
      case 'out_for_delivery': return <Bike size={18} className="text-blue-500" />;
      case 'delivered': return <CheckCircle2 size={18} className="text-green-500" />;
      default: return <Clock size={18} />;
    }
  };

  const getStatusLabelText = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return <div className="p-10 text-center text-brand-muted">Loading your orders...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen pt-8 px-4 pb-32">
      <h1 className="text-3xl font-bold font-serif text-brand-dark mb-2">Order History</h1>
      <p className="text-brand-muted mb-8">View all your past and active orders below.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-brand-amber/20">
          <Package size={48} className="mx-auto text-brand-muted opacity-50 mb-4" />
          <h2 className="text-xl font-bold text-brand-dark mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders with us.</p>
          <button onClick={() => navigate('/menu')} className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition">
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const isCompleted = order.status === 'delivered';
            return (
              <div key={order._id} className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 ${isCompleted ? 'border-gray-200' : 'border-brand-amber text-brand-dark'}`}>
                
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-bold uppercase">
                      {order.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 font-medium">
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="mb-0.5">
                        <span className="font-bold">{item.qty}x</span> {item.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <span className="text-xs text-gray-400 font-bold block mt-1">+ {order.items.length - 2} more items</span>
                    )}
                  </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <div className="flex flex-col items-start md:items-end flex-1 md:flex-none">
                     <span className="text-2xl font-extrabold text-brand-dark mb-1">₹{order.total}</span>
                     
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${isCompleted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-brand-orange border-orange-200 animate-pulse-amber shadow-sm'}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabelText(order.status)}
                     </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/tracker/${order._id}`)}
                    className="flex justify-center items-center gap-1 bg-brand-dark text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-800 transition active:scale-95 whitespace-nowrap"
                  >
                    Track <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
