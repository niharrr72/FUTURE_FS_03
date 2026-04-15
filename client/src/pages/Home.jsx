import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MapPin, Clock, Phone, ChevronRight, Plus, Info } from 'lucide-react';
import api from '../api/axios';

export default function Home() {
  const { user, addToCart } = useStore();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  console.log('Home Component: current user is', user);

  useEffect(() => {
    if (!user) {
      console.log('Home: No user found, redirecting to /login');
      navigate('/login');
      return;
    }
    console.log('Home: User found, fetching menu...');
    api.get('/menu').then(res => {
      setItems(res.data);
    }).catch(console.error);
  }, [user]);

  const handleOrderClick = () => {
    navigate('/login');
  };

  // --- LOGGED IN DASHBOARD VIEW ---
  if (user) {
    const tabs = [
      { id: 'all', label: 'All Items' },
      { id: 'momos', label: 'Momos' },
      { id: 'noodles', label: 'Noodles' },
      { id: 'rice', label: 'Rice' },
      { id: 'starters', label: 'Starters' },
      { id: 'soup', label: 'Soups' }
    ];

    const filteredItems = items
      .filter(item => activeTab === 'all' || item.category === activeTab)
      .slice(0, 15); // Show up to 15 items in the filtered view

    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen pt-24 px-4 md:px-8 pb-32">
        
        {/* Dynamic Greeting & Saved Address Header */}
        <div className="w-full mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shadow-inner border border-orange-200">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-dark">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-brand-muted font-medium">What would you like to order today?</p>
              </div>
            </div>

            {/* Default Saved Address display underneath logo/greeting */}
            <div className="mt-2 inline-flex items-center gap-2 text-brand-dark bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-full w-max text-sm font-semibold hover:border-brand-orange transition-colors cursor-pointer" onClick={() => { useStore.getState().setCartOpen(true) }}>
              <MapPin size={16} className="text-brand-orange" />
              {user.savedAddress?.text ? user.savedAddress.text : 'Please save an address during checkout.'}
            </div>
          </div>
        </div>

        {/* Interactive Steamer Menu CTA Box */}
        <div 
          onClick={() => navigate('/menu')}
          className="w-full relative overflow-hidden bg-gradient-to-r from-brand-orange to-amber-500 rounded-3xl p-8 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all mb-12 shadow-md flex items-center justify-between"
        >
          <div className="relative z-10 text-white">
            <h2 className="text-3xl font-bold font-serif mb-2">The Steamer Menu 🥟</h2>
            <p className="text-white/90 font-medium">Experience our famous 4-tier interactive bamboo steamer. Build your cart interactively!</p>
            <div className="mt-4 inline-flex items-center gap-1 bg-white text-brand-orange font-bold px-5 py-2 rounded-full hover:bg-orange-50 transition-colors shadow-sm">
              Open Steamer <ChevronRight size={18} />
            </div>
          </div>
          {/* Decorative steam rings */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Trending grid: Zomato/Swiggy style layout */}
        <div className="w-full">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-200 pb-4 gap-4">
             <h2 className="text-2xl font-bold text-brand-dark">Most Ordered 🔥</h2>
             
             {/* Category Tabs */}
             <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0">
               {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-brand-orange text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-brand-orange'}`}
                 >
                   {tab.label}
                 </button>
               ))}
             </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredItems.map((item, idx) => (
               <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  
                  {/* Image Header */}
                  <div className="relative w-full h-44 overflow-hidden bg-orange-50 flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                   </div>

                  {/* Body details */}
                  <div className="px-4 pt-3 pb-4 flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start mb-1">
                       <h3 className="font-bold text-lg text-brand-dark leading-snug pr-2">{item.name}</h3>
                       <div className={`w-4 h-4 rounded-sm border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex-shrink-0 flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                       </div>
                    </div>
                    

                     <p className="text-sm text-gray-400 line-clamp-2 flex-1 leading-snug">{item.description}</p>
                    {item.weight && (
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400 mt-2 cursor-help" title="Portion size">
                        <Info size={14} /> {item.weight}
                      </div>
                    )}
                     <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                       <span className="font-extrabold text-gray-800 text-lg">&#8377;{item.price}</span>
                       <button onClick={() => addToCart(item)} className="bg-white text-green-700 font-bold text-sm px-4 py-1.5 rounded-xl shadow-sm border-2 border-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center gap-1 active:scale-95">ADD <Plus size={14} /></button>
                     </div>
                   </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    );
  }

  // --- LOGGED OUT GUEST VIEW (Original Landing) ---
  return (
    <div className="w-full mx-auto min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-brand-amber/10 to-brand-cream pb-20">
      
      {/* Steam Animations generated via JS for random placement */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i} 
          className="steam-particle" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${100 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }} 
        />
      ))}

      <div className="z-10 flex flex-col items-center text-center px-6 animate-fade-in">
        
        {/* Logo Mark SVG */}
        <div className="w-32 h-32 mb-4 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-brand-amber text-6xl">
          🥟
        </div>

        <h1 className="text-4xl font-serif font-extrabold text-brand-dark mb-2 tracking-tight">
          Darjeeling Momos
        </h1>

        <div className="flex flex-col gap-2 text-sm text-brand-muted font-medium mb-8 bg-white/70 p-4 rounded-xl backdrop-blur-sm shadow-sm border border-brand-amber/20">
          <p className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-brand-orange" />
            54, Pillayar Koil St, Potheri - 603203 Near Ark Bistro
          </p>
          <p className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-brand-orange" />
            11:00 AM – 10:30 PM
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone size={16} className="text-brand-orange" />
            8348492077 / 9593619979
          </p>
        </div>

        <div className="w-full max-w-lg flex gap-4 mt-4">
          <button 
            onClick={handleOrderClick}
            className="flex-1 bg-brand-orange text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xl">🛵</span>
            Order Delivery
          </button>
          
          <button 
            onClick={handleOrderClick}
            className="flex-1 bg-white border-2 border-brand-orange text-brand-orange py-4 rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-xl">🏃</span>
            Pickup
          </button>
        </div>

        {/* Marquee Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-brand-dark text-brand-amber py-2 overflow-hidden flex whitespace-nowrap text-sm font-semibold">
          <div className="animate-marquee inline-block">
             Free Home Delivery • Open till 10:30 PM • Call 9593619979 • 
             Free Home Delivery • Open till 10:30 PM • Call 9593619979 • 
          </div>
        </div>

      </div>
    </div>
  );
}

