import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useStore } from '../store/useStore';
import { Plus, X, Utensils } from 'lucide-react';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); 
  const { addToCart } = useStore();

  useEffect(() => {
    api.get('/menu').then(res => setItems(res.data)).catch(console.error);
  }, []);

  const tiers = [
    { id: 'momos', label: 'Momos', color: '#fcaa36' },
    { id: 'noodles', label: 'Noodles', color: '#ffcf54' },
    { id: 'rice', label: 'Rice', color: '#fcaa36' },
    { id: 'starters', label: 'Starters', color: '#ffcf54' },
    { id: 'soup', label: 'Soup', color: '#fcaa36' },
  ];
  const filteredItems = items.filter(item => {
    if (item.category !== selectedTier) return false;
    if (activeTab === 'veg' && !item.isVeg) return false;
    if (activeTab === 'chicken' && item.isVeg) return false;
    return true;
  });

  return (
    <div className={`w-full max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex p-6 pt-16 transition-all duration-500 ${selectedTier ? 'flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-16' : 'flex-col items-center justify-center relative'}`}>
      
      {/* Title Header: Only visible when no tier is selected, naturally in document flow */}
      {!selectedTier && (
        <div className="text-center mb-8 animate-fade-in w-full">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-brand-dark tracking-tight drop-shadow-sm">The Steamer Menu</h2>
          <p className="text-brand-orange font-bold mt-2 text-lg uppercase tracking-widest">Select a tier to open</p>
        </div>
      )}

      {/* Illustrated Steamer Container */}
      <div className={`relative w-full max-w-[380px] transition-all duration-500 flex flex-col items-center ${selectedTier ? 'md:w-1/3 scale-90 opacity-70 pointer-events-none md:pointer-events-auto md:opacity-100 mt-12' : 'scale-100'}`}>
        
        {/* Steam Animation */}
        {!selectedTier && <div className="steam-particle !top-[-60px] !w-40 !h-40 opacity-40" style={{ left: '50%', transform: 'translateX(-50%)' }} />}

        {/* --- ILLUSTRATED STEAMER COMPONENTS (METALLIC) --- */}

        {/* Lid */}
        <div className="relative w-full h-28 z-50 flex flex-col items-center drop-shadow-md cursor-pointer" onClick={() => setSelectedTier(null)}>
          {/* Metallic Lid Handle */}
          <div className="w-20 h-5 rounded-t-xl border-4 border-gray-800 -mb-1 z-10 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 shadow-inner" />
          
          {/* Metallic Lid Body */}
          <div className="w-full h-full rounded-t-[60px] border-4 border-gray-800 relative overflow-hidden flex items-end bg-gradient-to-tr from-gray-300 via-white to-gray-200">
             {/* Metallic Shine Highlight */}
             <div className="absolute left-8 -top-10 bottom-0 w-12 bg-white/70 skew-x-12 blur-[2px]" />
             {/* Rim reflection line */}
             <div className="w-full border-t-[5px] border-gray-400 opacity-60 absolute top-6" />
             {/* Bottom shadow gradient */}
             <div className="w-full h-3 bg-gradient-to-b from-transparent to-black/15 absolute bottom-0" />
          </div>
        </div>

        {/* Tiers */}
        {tiers.map((tier, index) => (
          <div 
            key={tier.id}
            onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
            className={`group relative w-[95%] h-[90px] -mt-2 cursor-pointer transition-all duration-300 ${selectedTier === tier.id ? '-translate-y-8 scale-[1.03] drop-shadow-2xl z-[60]' : ''}`}
            style={{ zIndex: 40 - index }}
          >
            {/* Metallic Side handles */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-7 h-14 border-4 border-gray-800 rounded-l-full group-hover:scale-[1.10] transition-transform bg-gradient-to-b from-gray-500 via-gray-300 to-gray-600 shadow-inner" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-7 h-14 border-4 border-gray-800 rounded-r-full group-hover:scale-[1.10] transition-transform bg-gradient-to-b from-gray-600 via-gray-300 to-gray-500 shadow-inner" />
            
            {/* Main body of tier (Painted Metal Effect) */}
            <div 
              className={`w-full h-full border-4 border-gray-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 shadow-md ${selectedTier === tier.id ? 'brightness-110' : 'group-hover:brightness-110'}`}
              style={{ backgroundColor: tier.color }}
            >
              {/* Metallic shading overlays for 3D painted look */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute left-10 -top-10 bottom-0 w-16 bg-white/20 skew-x-12 blur-[2px] pointer-events-none" />

              {/* Horizontal dark stripes with subtle highlight bevel */}
              <div className="w-3/4 h-3 bg-gray-800 rounded-full mb-4 opacity-90 group-hover:w-4/5 transition-all shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
              <div className="w-3/4 h-3 bg-gray-800 rounded-full opacity-90 group-hover:w-4/5 transition-all shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
              
              {/* Category Label overlay positioned directly on the box */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className={`bg-white/95 px-6 py-2 rounded-full font-extrabold text-gray-800 border-[3px] border-gray-800 shadow-xl text-lg transform transition-all duration-300 tracking-wide ${selectedTier === tier.id ? 'scale-[1.15] text-brand-orange border-brand-orange' : 'group-hover:scale-110 group-hover:text-brand-orange'}`}>
                   {tier.label}
                 </span>
              </div>
            </div>
          </div>
        ))}

        {/* Steamer Base containing the dial block (Metallic) */}
        <div className="relative w-[90%] h-[100px] border-4 border-gray-800 rounded-b-2xl flex items-center justify-center -mt-2 shadow-[0_15px_30px_rgba(0,0,0,0.4)] z-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700">
          
          {/* Base metallic shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-b-xl" />

          {/* Base left vertical stripe */}
          <div className="absolute left-8 w-3 h-12 bg-gray-900 rounded-full shadow-[1px_0_0_rgba(255,255,255,0.2)]" />
          
          {/* Dial Centerpiece (Metallic Bevel) */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 border-4 border-gray-900 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_0_4px_6px_rgba(0,0,0,0.3)]">
             {/* Small indicator dots around the dial */}
             <div className="w-4 h-4 bg-gray-800 rounded-full absolute -top-2.5 shadow-sm border border-gray-600" />
             <div className="w-4 h-4 bg-gray-800 rounded-full absolute -bottom-2.5 shadow-sm border border-gray-600" />
             <div className="w-4 h-4 bg-gray-800 rounded-full absolute -left-2.5 shadow-sm border border-gray-600" />
             <div className="w-4 h-4 bg-gray-800 rounded-full absolute -right-2.5 shadow-sm border border-gray-600" />
             
             {/* Glowing amber heat core inside the dial */}
             <div className={`w-6 h-6 rounded-full transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),_0_0_12px_#FBBF24] border border-brand-amber/50 ${selectedTier ? 'bg-amber-400 animate-pulse-amber' : 'bg-brand-amber'}`} />
          </div>
          
          {/* Base right vertical stripe */}
          <div className="absolute right-8 w-3 h-12 bg-gray-900 rounded-full shadow-[1px_0_0_rgba(255,255,255,0.2)]" />
        </div>

      </div>

      {/* Expanded Menu Panel (Desktop Side-by-side, Mobile Overlap) */}
      <div 
        className={`w-full md:w-2/3 max-w-3xl bg-white rounded-3xl shadow-2xl transition-all duration-500 flex flex-col overflow-hidden border border-brand-amber/20 
        ${selectedTier ? 'opacity-100 h-[80vh] translate-y-0 md:translate-x-0 mt-8 md:mt-0 md:w-3/4 max-w-4xl' : 'opacity-0 h-0 -translate-y-10 md:translate-y-0 md:translate-x-10 pointer-events-none absolute md:static'}`}
      >
        
        {/* Header */}
        <div className="bg-brand-cream p-6 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-brand-amber/20">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-brand-dark">
            {tiers.find(t => t.id === selectedTier)?.label}
          </h2>
          <button 
            onClick={() => { setSelectedTier(null); setActiveTab('all'); }} 
            className="p-2 bg-white hover:bg-gray-100 shadow-sm rounded-full text-brand-dark transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex bg-white px-6 py-4 gap-3 shadow-sm border-b border-gray-100 sticky top-[89px] z-10">
          {['all', 'veg', 'chicken'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-brand-orange text-white shadow-md' : 'bg-brand-cream border border-brand-amber/20 text-brand-muted hover:bg-orange-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/50">
          {filteredItems.map((item, idx) => (
            <div 
              key={item._id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-stretch animate-fade-in hover:shadow-md transition-all duration-300 group overflow-hidden min-h-[120px]"
              style={{ animationFillMode: 'both', animationDelay: `${idx * 50}ms` }}
            >
              {/* Square image thumbnail */}
              <div className="relative h-[120px] w-[160px] flex-shrink-0 overflow-hidden bg-orange-50">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.target.onerror=null; e.target.style.display='none'; }}
                />
              </div>

              {/* Name + Price */}
              <div className="flex flex-col justify-center flex-1 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${item.veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 leading-tight group-hover:text-orange-500 transition-colors text-base">{item.name}</h3>
                </div>
                {item.weight && <span className="text-xs text-gray-400 mb-0.5">{item.weight}</span>}
                <span className="font-extrabold text-orange-500 text-lg mt-1">&#8377;{item.price}</span>
              </div>
              
              {/* Add button */}
              <button 
                onClick={() => addToCart(item)}
                className="flex-shrink-0 w-16 bg-orange-50 border-l border-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center active:scale-95 text-lg font-bold"
              >
                <Plus size={22} />
              </button>
            </div>
          ))}
          {filteredItems.length === 0 && selectedTier && (
            <div className="text-center text-brand-muted mt-16 p-4">
              <Utensils size={64} className="mx-auto mb-4 opacity-30 text-brand-orange" />
              <p className="text-lg font-medium">No items found in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
