import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Plus, Minus, ShoppingBag, MapPin, User as UserIcon, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CartDrawer() {
  const { cart, removeFromCart, updateCartQty, clearCart, user, isCartOpen, setCartOpen } = useStore();
  
  const [orderType, setOrderType] = useState('delivery');
  
  // Delivery Customizations
  const [deliveryTarget, setDeliveryTarget] = useState('me'); // 'me' or 'other'
  const [address, setAddress] = useState(user?.savedAddress?.text || '');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Sync address when user changes or drawer opens
  React.useEffect(() => {
    if (user?.savedAddress?.text && deliveryTarget === 'me') {
      setAddress(user.savedAddress.text);
    }
  }, [user, isCartOpen, deliveryTarget]);

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      const isCustom = deliveryTarget === 'other';
      const orderData = {
        customerId: user.id,
        customerName: isCustom ? customName : user.name,
        phone: isCustom ? customPhone : user.phone,
        items: cart,
        orderType,
        deliveryAddress: orderType === 'delivery' ? { text: address } : undefined,
        total,
      };

      await api.post('/orders', orderData);
      clearCart();
      setCartOpen(false);
      navigate('/tracker');
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed');
    }
  };

  if (!isCartOpen) return null;

  const isCheckoutDisabled = orderType === 'delivery' && (
    !address || 
    (deliveryTarget === 'other' && (!customName || !customPhone))
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      
      <div className="w-full max-w-md bg-white h-full relative z-10 flex flex-col shadow-2xl animate-fade-in border-l border-brand-amber/20">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-brand-cream/50">
          <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
            <ShoppingBag className="text-brand-orange" /> Checkout
          </h2>
          <button onClick={() => setCartOpen(false)} className="bg-gray-200 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="text-center text-brand-muted mt-20 flex flex-col items-center">
              <span className="text-5xl mb-4 grayscale opacity-60">🛒</span>
              <p className="text-xl">Your cart is empty.</p>
              <button 
                onClick={() => { setCartOpen(false); navigate('/menu'); }} 
                className="mt-6 bg-brand-orange text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-orange-600"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.menuItemId} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-brand-amber/10">
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-brand-dark text-lg leading-tight mb-1">{item.name}</span>
                    <span className="text-brand-amber font-extrabold">₹{item.price * item.qty}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-cream border border-brand-amber/20 rounded-lg p-1.5 shadow-inner">
                    <button onClick={() => updateCartQty(item.menuItemId, -1)} className="p-1 hover:text-red-500 text-brand-dark bg-white rounded-md shadow-sm"><Minus size={16} /></button>
                    <span className="font-bold w-4 text-center text-brand-dark">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.menuItemId, 1)} className="p-1 hover:text-green-500 text-brand-dark bg-white rounded-md shadow-sm"><Plus size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] relative pt-6 z-20">
            
            {/* Delivery/Pickup Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${orderType === 'delivery' ? 'bg-brand-orange text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                onClick={() => setOrderType('delivery')}
              >
                Delivery
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${orderType === 'pickup' ? 'bg-white text-brand-dark shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                onClick={() => setOrderType('pickup')}
              >
                Pickup
              </button>
            </div>

            {orderType === 'delivery' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5 flex flex-col gap-3">
                <span className="font-bold text-brand-dark mb-1 flex items-center justify-between">
                  Delivery Details
                </span>

                <div className="flex bg-gray-200 rounded-lg p-1 mb-1">
                  <button 
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md ${deliveryTarget === 'me' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500'}`}
                    onClick={() => setDeliveryTarget('me')}
                  >Deliver to Me</button>
                  <button 
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md ${deliveryTarget === 'other' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500'}`}
                    onClick={() => { setDeliveryTarget('other'); setAddress(''); }}
                  >Someone Else</button>
                </div>

                {deliveryTarget === 'other' && (
                  <div className="flex flex-col gap-2 border-b border-gray-200 pb-3 mb-1">
                    <div className="relative">
                      <UserIcon size={16} className="absolute top-3 left-3 text-brand-amber" />
                      <input 
                        type="text" placeholder="Recipient's Name" value={customName} onChange={e => setCustomName(e.target.value)}
                        className="w-full text-sm p-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute top-3 left-3 text-brand-amber" />
                      <input 
                        type="tel" placeholder="Recipient's Phone" value={customPhone} onChange={e => setCustomPhone(e.target.value)}
                        className="w-full text-sm p-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <MapPin size={18} className="absolute top-3 left-3 text-brand-amber" />
                  <textarea 
                    placeholder={deliveryTarget === 'me' ? "Your Address..." : "Delivery Address..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm p-2.5 pl-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-brand-orange resize-none"
                    rows="2"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between border-b border-gray-100 pb-2 mb-2 text-brand-muted font-medium">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3 mb-4 text-brand-dark font-bold text-lg">
              <span>Total Pay</span>
              <span className="text-brand-orange">₹{total}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckoutDisabled}
              className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-all active:scale-95"
            >
              Checkout Seamlessly
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
