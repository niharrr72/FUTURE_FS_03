import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Phone, Mail, MapPin, Lock, Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, token, setUser } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:            user?.name     || '',
    email:           user?.email    || '',
    phone:           user?.phone    || '',
    addressText:     user?.savedAddress?.text     || '',
    addressMapsLink: user?.savedAddress?.mapsLink || '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  if (!user || user.role === 'admin') {
    navigate('/');
    return null;
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSuccess(''); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name:  form.name,
        email: form.email,
        phone: form.phone,
        savedAddress: {
          text:     form.addressText,
          mapsLink: form.addressMapsLink,
        },
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword     = form.newPassword;
      }

      const res = await api.patch('/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update zustand store with new user data
      setUser(res.data.user, token);
      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  const Field = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete }) => (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon size={16} className="absolute left-4 text-gray-400 flex-shrink-0" />
        <input
          type={type} autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl outline-none transition"
          style={{ padding: '0.875rem 1rem 0.875rem 2.75rem',
                   border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#111', fontSize: '0.95rem' }}
          onFocus={e => e.target.style.borderColor = '#F97316'}
          onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back button */}
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-medium mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Menu
        </button>

        {/* Header card */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 mb-6 flex items-center gap-4 shadow-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
            <p className="text-white/80 text-sm font-medium">{user.phone}</p>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Personal Info section */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-700 mb-4 uppercase tracking-wide">Personal Info</h2>
            <div className="flex flex-col gap-4">
              <Field icon={User}  label="Full Name"    value={form.name}  onChange={v => set('name', v)}  placeholder="Your name" />
              <Field icon={Phone} label="Phone Number" type="tel"   value={form.phone} onChange={v => set('phone', v)} placeholder="9876543210" autoComplete="tel" />
              <Field icon={Mail}  label="Email"        type="email" value={form.email} onChange={v => set('email', v)} placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>

          {/* Saved Address section */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-700 mb-4 uppercase tracking-wide">Saved Address</h2>
            <div className="flex flex-col gap-4">
              <Field icon={MapPin} label="Address" value={form.addressText} onChange={v => set('addressText', v)} placeholder="Door no, Street, Area, City" />
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Google Maps Link (optional)
                </label>
                <input
                  type="url" placeholder="https://maps.google.com/..."
                  value={form.addressMapsLink}
                  onChange={e => set('addressMapsLink', e.target.value)}
                  className="w-full rounded-xl outline-none transition"
                  style={{ padding: '0.875rem 1rem', border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#111', fontSize: '0.9rem' }}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>
          </div>

          {/* Change Password section */}
          <div className="px-6 py-4">
            <h2 className="text-base font-extrabold text-gray-700 mb-1 uppercase tracking-wide">Change Password</h2>
            <p className="text-xs text-gray-400 mb-4">Leave blank to keep your current password</p>
            <div className="flex flex-col gap-4">
              <Field icon={Lock} label="Current Password" type="password" value={form.currentPassword} onChange={v => set('currentPassword', v)} placeholder="Your current password" autoComplete="current-password" />
              <Field icon={Lock} label="New Password"     type="password" value={form.newPassword}     onChange={v => set('newPassword', v)}     placeholder="Min 6 characters"      autoComplete="new-password" />
              <Field icon={Lock} label="Confirm New Password" type="password" value={form.confirmPassword} onChange={v => set('confirmPassword', v)} placeholder="Repeat new password" autoComplete="new-password" />
            </div>
          </div>

          {/* Feedback */}
          {success && (
            <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                 style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D' }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                 style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Save button */}
          <div className="px-6 pb-6">
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 font-extrabold rounded-xl transition-all active:scale-95"
              style={{ padding: '1rem', background: '#EA580C', color: '#fff', fontSize: '1rem',
                       opacity: saving ? 0.6 : 1, boxShadow: '0 4px 20px rgba(234,88,12,0.3)' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
