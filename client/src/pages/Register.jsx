import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', address: '' });
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        savedAddress: { text: formData.address }
      };
      const res = await api.post('/auth/register', payload);
      setUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 my-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-amber/20">
        
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Create Account</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Full Name" required
            className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="text" placeholder="Phone Number" required
            className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none"
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="email" placeholder="Email (optional)"
            className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <textarea 
            placeholder="Delivery Address (optional)"
            className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none resize-none"
            rows="2"
            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
          />

          <button type="submit" className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-orange-600 mt-2">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-6">
          Already have an account? <Link to="/login" className="text-brand-orange font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}
