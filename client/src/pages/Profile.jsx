import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Phone, Mail, MapPin, Lock, Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const Field = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, disabled = false, note }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center">
      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {note && <span className="text-[10px] text-orange-500 font-bold uppercase">{note}</span>}
    </div>
    <div className="relative flex items-center">
      <Icon size={16} className={`absolute left-4 ${disabled ? 'text-gray-300' : 'text-gray-400'} flex-shrink-0`} />
      <input
        type={type} autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={e => !disabled && onChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-xl outline-none transition ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        style={{ padding: '0.875rem 1rem 0.875rem 2.75rem',
                 border: `1.5px solid ${disabled ? '#F3F4F6' : '#E5E7EB'}`, 
                 background: disabled ? '#F9FAFB' : '#fff', 
                 color: disabled ? '#9CA3AF' : '#111', 
                 fontSize: '0.95rem' }}
        onFocus={e => !disabled && (e.target.style.borderColor = '#F97316')}
        onBlur={e  => !disabled && (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  </div>
);

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

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === 'admin';

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
      };

      if (isAdmin) {
        payload.phone = form.phone;
      } else {
        payload.email = form.email;
        payload.savedAddress = {
          text:     form.addressText,
          mapsLink: form.addressMapsLink,
        };
      }

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword     = form.newPassword;
      }

      const res = await api.patch('/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user, token);
      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* Back button */}
        <button onClick={() => navigate(isAdmin ? '/admin' : '/')}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-6 transition-colors group">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
          Back to {isAdmin ? 'Admin Dashboard' : 'Home'}
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200 rotate-3 transform transition hover:rotate-0">
            <User size={40} className="text-white" />
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                {user.role} Account
              </span>
              <span className="text-gray-400 text-sm font-medium">{isAdmin ? user.email : user.phone}</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            
            {/* Settings Sections */}
            <div className="p-8 space-y-8">
              
              {/* Profile Details */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Security & Profile</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field icon={User} label="Full Name" value={form.name} onChange={v => set('name', v)} placeholder="John Doe" />
                  
                  {isAdmin ? (
                    <>
                      <Field icon={Mail} label="Email Address" value={form.email} disabled note="Locked" />
                      <Field icon={Phone} label="Contact Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="9876543210" />
                    </>
                  ) : (
                    <>
                      <Field icon={Phone} label="Phone Number" value={form.phone} disabled note="Locked" />
                      <Field icon={Mail} label="Email Address" value={form.email} onChange={v => set('email', v)} placeholder="john@example.com" />
                    </>
                  )}
                </div>
              </section>

              {/* Address Section (Client Only) */}
              {!isAdmin && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                    <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Saved Address</h2>
                  </div>
                  <div className="space-y-6">
                    <Field icon={MapPin} label="Primary Address" value={form.addressText} onChange={v => set('addressText', v)} placeholder="Door no, Street, Area, City" />
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Google Maps Location
                      </label>
                      <input
                        type="url" placeholder="Paste your location link here..."
                        value={form.addressMapsLink}
                        onChange={e => set('addressMapsLink', e.target.value)}
                        className="w-full rounded-xl outline-none transition px-4 py-3 border-[1.5px] border-gray-200 focus:border-orange-500 bg-gray-50 text-sm"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Security Section */}
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Update Password</h2>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-6">Only fill these if you want to change your current password</p>
                
                <div className="space-y-6">
                  <Field icon={Lock} label="Current Password" type="password" value={form.currentPassword} onChange={v => set('currentPassword', v)} placeholder="••••••••" autoComplete="current-password" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field icon={Lock} label="New Password" type="password" value={form.newPassword} onChange={v => set('newPassword', v)} placeholder="Min 6 chars" autoComplete="new-password" />
                    <Field icon={Lock} label="Confirm Password" type="password" value={form.confirmPassword} onChange={v => set('confirmPassword', v)} placeholder="Repeat password" autoComplete="new-password" />
                  </div>
                </div>
              </section>

            </div>

            {/* Status Messages */}
            <div className="px-8 space-y-4">
              {success && (
                <div className="flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold bg-green-50 border border-green-100 text-green-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CheckCircle size={18} /> {success}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold bg-red-50 border border-red-100 text-red-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-8 pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full h-16 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-orange-200 flex items-center justify-center gap-3"
              >
                {saving ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={22} />
                    SAVE PROFILE SETTINGS
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
