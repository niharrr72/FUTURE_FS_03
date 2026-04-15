import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, LogOut, Settings, ClipboardList, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout, cart } = useStore();

  // Don't render navbar at all when logged out — login page handles its own UI
  if (!user) return null;

  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 shadow-sm flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 flex justify-between items-center h-full">
        <Link to="/" className="text-xl font-bold text-brand-dark flex items-center gap-2">
          🥟 <span className="text-brand-orange">Darjeeling</span> Momos
        </Link>
        <div className="flex items-center gap-4">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="text-brand-dark font-medium hover:text-brand-orange flex items-center gap-1">
                <ClipboardList size={20} /> <span className="hidden sm:inline">Orders Portal</span>
              </Link>
              <Link to="/admin/menu" className="text-brand-dark font-medium hover:text-brand-orange flex items-center gap-1">
                <Settings size={20} /> <span className="hidden sm:inline">Menu Config</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/orders" className="text-brand-dark font-medium hover:text-brand-orange flex items-center gap-1">
                <ClipboardList size={20} /> <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link to="/menu" className="text-brand-dark font-medium hover:text-brand-orange">Menu</Link>
              <button onClick={() => useStore.getState().setCartOpen(true)} className="relative p-2 text-brand-dark hover:text-brand-orange">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-amber">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </>
          )}
          <button onClick={logout} className="text-brand-muted hover:text-brand-orange">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
