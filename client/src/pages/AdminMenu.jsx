import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function AdminMenu() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchMenu();
  }, [user, navigate]);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu/all');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item completely?')) return;
    try {
      await api.delete(`/menu/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEditInit = (item) => {
    setIsEditing(item._id);
    setEditForm(item);
  };

  const handleEditSave = async () => {
    try {
      const res = await api.patch(`/menu/${isEditing}`, editForm);
      setItems(prev => prev.map(i => i._id === isEditing ? res.data : i));
      setIsEditing(null);
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/menu', editForm);
      setItems(prev => [...prev, res.data]);
      setShowAddModal(false);
      setEditForm({});
    } catch (err) {
      alert('Add failed');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-20 pt-24">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold font-serif text-brand-dark flex items-center gap-2">
          ⚙️ Menu Management
        </h2>
        <button 
          onClick={() => { setEditForm({ name: '', price: 0, category: 'momos', subcategory: 'steamed', veg: true, available: true }); setShowAddModal(true); }}
          className="bg-brand-orange text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-xs">
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Type</th>
              <th className="p-4">Availability</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => isEditing === item._id ? (
              <tr key={item._id} className="border-b bg-orange-50 transition-colors">
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    <input className="w-full p-2 border border-brand-amber/50 rounded-lg outline-none focus:ring-1 focus:ring-brand-orange" placeholder="Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <input className="w-full p-2 border border-brand-amber/50 rounded-lg outline-none text-xs" placeholder="Image URL" value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} />
                  </div>
                </td>
                <td className="p-3">
                  <select className="p-2 border border-brand-amber/50 rounded-lg w-full outline-none" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                    <option value="momos">Momos</option><option value="noodles">Noodles</option><option value="rice">Rice</option><option value="starters">Starters</option><option value="soup">Soup</option>
                  </select>
                </td>
                <td className="p-3"><input type="number" className="w-full p-2 border border-brand-amber/50 rounded-lg outline-none" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} /></td>
                <td className="p-3">
                  <select className="p-2 border border-brand-amber/50 rounded-lg w-full outline-none" value={editForm.veg} onChange={e => setEditForm({...editForm, veg: e.target.value === 'true'})}>
                    <option value="true">Veg</option><option value="false">Non-Veg</option>
                  </select>
                </td>
                <td className="p-3">
                   <select className="p-2 border border-brand-amber/50 rounded-lg w-full outline-none" value={editForm.available} onChange={e => setEditForm({...editForm, available: e.target.value === 'true'})}>
                    <option value="true">Active</option><option value="false">Hidden</option>
                  </select>
                </td>
                <td className="p-3 flex justify-end gap-2 items-center h-full pt-4">
                  <button onClick={handleEditSave} className="text-white bg-green-500 p-2 rounded-lg shadow-sm hover:scale-105 transition-transform"><Save size={16} /></button>
                  <button onClick={() => setIsEditing(null)} className="text-white bg-red-500 p-2 rounded-lg shadow-sm hover:scale-105 transition-transform"><X size={16} /></button>
                </td>
              </tr>
            ) : (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 shadow-sm border border-gray-100"
                      onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + item.name + '&background=fef3c7&color=d97706'} 
                    />
                    <span className="font-bold text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 capitalize">{item.category}</td>
                <td className="p-4 font-bold text-gray-800">₹{item.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${item.veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.veg ? 'Veg' : 'Non-Veg'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${item.available ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {item.available ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleEditInit(item)} className="p-2 text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded-lg transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-4 border border-brand-amber/30">
            <h3 className="text-2xl font-bold text-brand-dark flex items-center gap-2 border-b pb-3 mb-2">
              <Plus className="text-brand-orange" /> Add Menu Item
            </h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
              <input required placeholder="Momos..." className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-brand-orange outline-none" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
              <input required type="number" placeholder="120" className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-brand-orange outline-none" value={editForm.price || ''} onChange={e=>setEditForm({...editForm, price: Number(e.target.value)})} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                 <select className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-brand-orange outline-none" value={editForm.category} onChange={e=>setEditForm({...editForm, category: e.target.value})}>
                    <option value="momos">Momos</option><option value="noodles">Noodles</option><option value="rice">Rice</option><option value="starters">Starters</option><option value="soup">Soup</option>
                 </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                 <select className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-brand-orange outline-none" value={editForm.veg} onChange={e=>setEditForm({...editForm, veg: e.target.value === 'true'})}>
                    <option value="true">Veg</option><option value="false">Non-Veg</option>
                 </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
              <textarea placeholder="Delicious authentic..." className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-brand-orange outline-none resize-none h-20" value={editForm.description || ''} onChange={e=>setEditForm({...editForm, description: e.target.value})} />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Weight / Qty</label>
                <input placeholder="e.g. 200gm" className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 outline-none" value={editForm.weight || ''} onChange={e=>setEditForm({...editForm, weight: e.target.value})} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                 <input placeholder="https://..." className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 outline-none" value={editForm.imageUrl || ''} onChange={e=>setEditForm({...editForm, imageUrl: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={()=>setShowAddModal(false)} className="flex-1 p-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 p-3 font-bold text-white bg-brand-orange rounded-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">Save Item</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
