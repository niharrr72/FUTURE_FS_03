import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { X, Eye, EyeOff, ChevronRight, MapPin, Clock, Smartphone, Truck, User, ShieldCheck } from 'lucide-react';

const E = {
  momo:    String.fromCodePoint(0x1F95F), // 🥟
  rice:    String.fromCodePoint(0x1F35A), // 🍚
  noodle:  String.fromCodePoint(0x1F35C), // 🍜
  chicken: String.fromCodePoint(0x1F357), // 🍗
  soup:    String.fromCodePoint(0x1F372), // 🍲
  dash:    '\u2014',
};

export default function Login() {
  const { setUser } = useStore();
  const navigate    = useNavigate();

  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode]           = useState('customer'); // 'customer' | 'admin'
  const [tab, setTab]             = useState('login');    // 'login' | 'register'
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const [loginData, setLoginData] = useState({ phone: '', email: '', password: '' });
  const [regData, setRegData]     = useState({ name: '', email: '', phone: '', password: '' });

  const switchMode = (m) => { setMode(m); setTab('login'); setError(''); };
  const switchTab  = (t) => { setTab(t);  setError(''); };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true);
    console.log('Attempting login for:', isAdmin ? loginData.email : loginData.phone);
    
    try {
      const payload = isAdmin
        ? { email: loginData.email, password: loginData.password, isAdminLogin: true }
        : { phone: loginData.phone, password: loginData.password };
        
      const res = await api.post('/auth/login', payload);
      console.log('Login response:', res.data);

      if (isAdmin && res.data.user?.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      
      setUser(res.data.user, res.data.token);
      
      // Give store a tiny millisecond to settle
      setTimeout(() => {
        const target = res.data.user?.role === 'admin' ? '/admin' : '/';
        console.log('Navigating to:', target);
        navigate(target);
      }, 100);

    } catch (err) { 
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials or connection error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', regData);
      setUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  // Flame wall config
  const flames = [
    { left:'-2%',  w:'26%', h:'230px', delay:'0s',   dur:'1.8s' },
    { left:'10%',  w:'26%', h:'255px', delay:'0.3s', dur:'1.5s' },
    { left:'21%',  w:'28%', h:'245px', delay:'0.7s', dur:'2.0s' },
    { left:'33%',  w:'26%', h:'260px', delay:'0.2s', dur:'1.7s' },
    { left:'44%',  w:'28%', h:'240px', delay:'0.5s', dur:'1.6s' },
    { left:'55%',  w:'26%', h:'255px', delay:'0.9s', dur:'2.0s' },
    { left:'66%',  w:'28%', h:'248px', delay:'0.4s', dur:'1.8s' },
    { left:'77%',  w:'26%', h:'238px', delay:'0.6s', dur:'1.5s' },
    { left:'88%',  w:'18%', h:'230px', delay:'0.1s', dur:'1.9s' },
  ];
  const tips = [
    { left:'6%',  w:'18%', h:'155px', delay:'0.4s', dur:'1.3s' },
    { left:'25%', w:'20%', h:'170px', delay:'0.7s', dur:'1.6s' },
    { left:'44%', w:'18%', h:'160px', delay:'0.2s', dur:'1.4s' },
    { left:'63%', w:'20%', h:'165px', delay:'0.9s', dur:'1.5s' },
    { left:'82%', w:'16%', h:'155px', delay:'0.5s', dur:'1.3s' },
  ];

  const isAdmin = mode === 'admin';

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT HERO ──────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col justify-center px-12 lg:px-20 py-16 overflow-hidden"
           style={{ background: 'linear-gradient(155deg,#FCD34D 0%,#F97316 40%,#C2410C 100%)' }}>

        <div className="absolute inset-0 opacity-25 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 25% 35%,#FFF7CD 0%,transparent 55%)' }} />

        {/* ── ORBITING FOOD FIRE PIT ── */}
        <div className="absolute hidden lg:block right-[24%] top-[45%] -translate-y-1/2" style={{ zIndex: 0 }}>
          <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{ animation: 'orbitRotate 36s linear infinite' }}>
            {[
              E.momo, E.rice, E.noodle, E.chicken, E.soup
            ].map((icon, i) => {
              const angle = (i * 360 / 5) * (Math.PI / 180);
              const radius = 260; // Spread out more
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div key={i} className="absolute w-32 h-32 ml-[-64px] mt-[-64px] flex items-center justify-center transition-opacity pointer-events-none"
                     style={{
                       transform: `translate(${x}px, ${y}px)`,
                       filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))',
                       fontSize: '90px' // huge emojis
                     }}>
                  <div style={{ animation: 'orbitCounterRotate 36s linear infinite' }}>
                    {icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FIRE WALL */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height:'280px', zIndex:1 }}>
          <div className="absolute bottom-0 left-0 right-0"
               style={{ height:'52px', background:'linear-gradient(to top,#3d0800,#8b1a00,#c03500)' }} />
          {flames.map((f,i) => (
            <div key={i} className="absolute bottom-0" style={{
              left:f.left, width:f.w, height:f.h,
              background:'linear-gradient(to top,#b82200 0%,#e85500 25%,#ff8800 55%,#ffcc00 80%,transparent 100%)',
              borderRadius:'48% 52% 45% 48% / 82% 82% 18% 18%',
              opacity:0.9, filter:'blur(6px)',
              animation:`fireWave ${f.dur} ${f.delay} infinite alternate ease-in-out`,
            }} />
          ))}
          {tips.map((f,i) => (
            <div key={`t-${i}`} className="absolute bottom-0" style={{
              left:f.left, width:f.w, height:f.h,
              background:'linear-gradient(to top,#ffdd00 0%,#fffff0 55%,transparent 100%)',
              borderRadius:'50% 50% 35% 35% / 75% 75% 25% 25%',
              opacity:0.6, filter:'blur(3px)',
              animation:`fireWave ${f.dur} ${f.delay} infinite alternate ease-in-out`,
            }} />
          ))}
          {Array.from({ length:30 }).map((_,i) => (
            <div key={`e-${i}`} className="absolute rounded-full" style={{
              left:`${(i*33+9)%100}%`, bottom:`${48+(i*19)%75}px`,
              width:`${2+(i%3)}px`, height:`${2+(i%3)}px`,
              background:['#ffffff','#FFD700','#FF8C00','#FF3300'][i%4],
              animation:`emberRise ${1.3+(i%7)*0.3}s ${((i*0.21)%2.2).toFixed(2)}s infinite ease-out`,
              boxShadow:`0 0 5px 2px ${i%2===0?'#FFD70088':'#FF550066'}`,
            }} />
          ))}
        </div>

        {/* Brand Content */}
        <div className="relative max-w-lg" style={{ zIndex:10 }}>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border-4 border-white/50 rounded-2xl flex items-center justify-center shadow-2xl mb-6"
               style={{ fontSize:'2.5rem' }}>{E.momo}</div>

          <h1 className="font-extrabold text-white leading-tight mb-4"
              style={{ fontSize:'clamp(2.4rem,5vw,3.5rem)', fontFamily:'Georgia,serif', textShadow:'0 4px 20px rgba(0,0,0,0.35)' }}>
            Darjeeling<br /><span style={{ color:'#FEF3C7' }}>Momos</span>
          </h1>

          <p className="text-white/90 font-medium mb-4 leading-relaxed"
             style={{ fontSize:'1.05rem', textShadow:'0 2px 8px rgba(0,0,0,0.25)', maxWidth:'380px' }}>
            Authentic Himalayan dumplings, freshly steamed {E.dash} delivered hot to your door.
          </p>

          <div className="flex flex-col gap-2 mb-8">
            {[
              { Icon:MapPin,     text:'54, Pillayar Koil St, Potheri - 603203 Near Ark Bistro' },
              { Icon:Clock,      text:'Open daily \u00B7 11:00 AM \u2013 10:30 PM' },
              { Icon:Smartphone, text:'8348492077 / 9593619979' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 font-semibold"
                   style={{ color:'rgba(255,255,255,0.82)', fontSize:'0.88rem' }}>
                <Icon size={15} style={{ color:'#FDE68A', flexShrink:0 }} />{text}
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full font-bold border border-white/40"
               style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)', color:'#fff', fontSize:'0.88rem' }}>
            <Truck size={16} style={{ color:'#FDE68A' }} />Free Home Delivery on all orders!
          </div>

          <button onClick={() => setPanelOpen(true)}
            className="group flex items-center gap-3 font-extrabold rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background:'#fff', color:'#EA580C', fontSize:'1.1rem', padding:'1rem 2rem',
                     boxShadow:'0 8px 40px rgba(0,0,0,0.25)' }}>
            Order Now <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── BACKDROP ────────────────────────────────────────────── */}
      <div onClick={() => setPanelOpen(false)} style={{
        position:'fixed', inset:0, zIndex:20, background:'rgba(0,0,0,0.3)',
        backdropFilter:'blur(2px)', opacity:panelOpen?1:0,
        pointerEvents:panelOpen?'auto':'none', transition:'opacity 0.4s',
      }} />

      {/* ── SLIDING PANEL ───────────────────────────────────────── */}
      <div style={{
        position:'fixed', right:0, top:0, bottom:0,
        width:'100%', maxWidth:'430px',
        background:'#fff', zIndex:30, display:'flex', flexDirection:'column',
        boxShadow:'-8px 0 40px rgba(0,0,0,0.2)',
        transform:panelOpen?'translateX(0)':'translateX(100%)',
        transition:'transform 0.48s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Panel header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-gray-100">
          <div>
            <p style={{ fontSize:'0.7rem', fontWeight:800, color:'#FB923C', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'2px' }}>
              Welcome to
            </p>
            <h2 style={{ fontSize:'1.45rem', fontWeight:800, color:'#1c1c1c' }}>Darjeeling Momos</h2>
          </div>
          <button onClick={() => setPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={22} className="text-gray-400" />
          </button>
        </div>

        {/* ── CUSTOMER / ADMIN MODE SELECTOR ── */}
        <div className="px-8 pt-5 pb-3">
          <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#9CA3AF', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>
            Login as
          </p>
          <div className="flex gap-3">
            {[
              { key:'customer', Icon:User,        label:'Customer' },
              { key:'admin',    Icon:ShieldCheck,  label:'Admin'    },
            ].map(({ key, Icon, label }) => (
              <button key={key} onClick={() => switchMode(key)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all duration-200"
                style={{
                  borderColor: mode===key ? '#EA580C' : '#E5E7EB',
                  background:  mode===key ? '#FFF7ED' : '#F9FAFB',
                  color:       mode===key ? '#EA580C' : '#6B7280',
                  boxShadow:   mode===key ? '0 2px 12px rgba(234,88,12,0.15)' : 'none',
                }}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SIGN IN / CREATE ACCOUNT TABS (Customer only) ── */}
        {!isAdmin && (
          <div className="flex mx-8 mt-3 bg-gray-100 rounded-xl p-1 gap-1">
            {[['login','Sign In'],['register','Create Account']].map(([key, label]) => (
              <button key={key} onClick={() => switchTab(key)}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
                style={{
                  background: tab===key ? '#fff' : 'transparent',
                  color:      tab===key ? '#EA580C' : '#9CA3AF',
                  boxShadow:  tab===key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mx-8 mt-3 px-4 py-3 rounded-xl flex items-center gap-2"
               style={{ background:'#FFF7ED', border:'1.5px solid #FED7AA' }}>
            <ShieldCheck size={16} style={{ color:'#EA580C', flexShrink:0 }} />
            <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#9A3412' }}>
              Admin access only — use your admin credentials to sign in.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-8 mt-3 text-sm font-medium px-4 py-3 rounded-xl"
               style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626' }}>
            {error}
          </div>
        )}

        {/* ── LOGIN FORM (Customer + Admin) ── */}
        {(tab === 'login' || isAdmin) && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 px-8 pt-5 pb-8 flex-1 overflow-y-auto">
            {(isAdmin
              ? [{ label:'Admin Email', type:'email',    key:'email',    placeholder:'admin@example.com', autoComplete:'email' }]
              : [{ label:'Phone Number', type:'tel',     key:'phone',    placeholder:'9876543210',        autoComplete:'tel'   }]
            ).concat([
              { label:'Password', type:showPass?'text':'password', key:'password', placeholder:isAdmin?'Admin password':'••••••••', autoComplete:'current-password' },
            ]).map(({ label, type, key, placeholder, autoComplete }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.7rem', fontWeight:800, color:'#9CA3AF', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  {label}
                </label>
                <div className="relative">
                  <input type={type} required autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={loginData[key]}
                    onChange={e => setLoginData({ ...loginData, [key]: e.target.value })}
                    className="w-full rounded-xl outline-none transition"
                    style={{ padding:'0.875rem 1rem', paddingRight:key==='password'?'3rem':'1rem',
                             border:'1.5px solid #E5E7EB', background:'#F9FAFB', color:'#111', fontSize:'0.95rem' }}
                    onFocus={e => e.target.style.borderColor='#F97316'}
                    onBlur={e  => e.target.style.borderColor='#E5E7EB'}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="mt-2 w-full font-extrabold rounded-xl transition-all active:scale-95"
              style={{ padding:'1rem', background: isAdmin?'#1E293B':'#EA580C', color:'#fff',
                       fontSize:'1rem', opacity:loading?0.6:1,
                       boxShadow: isAdmin?'0 4px 20px rgba(30,41,59,0.3)':'0 4px 20px rgba(234,88,12,0.35)' }}>
              {loading ? 'Signing in...' : isAdmin ? 'Access Admin Portal  \u2192' : 'Sign In  \u2192'}
            </button>

            {!isAdmin && (
              <p className="text-center text-sm text-gray-400">
                No account?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="font-bold" style={{ color:'#EA580C' }}>Create one</button>
              </p>
            )}
          </form>
        )}

        {/* ── REGISTER FORM (Customer only) ── */}
        {tab === 'register' && !isAdmin && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4 px-8 pt-5 pb-8 flex-1 overflow-y-auto">
            {[
              { label:'Full Name', type:'text',     key:'name',     placeholder:'Your full name' },
              { label:'Email',     type:'email',    key:'email',    placeholder:'you@example.com' },
              { label:'Phone',     type:'tel',      key:'phone',    placeholder:'9876543210' },
              { label:'Password',  type:showPass?'text':'password', key:'password', placeholder:'Min 6 characters' },
            ].map(({ label, type, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.7rem', fontWeight:800, color:'#9CA3AF', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  {label}
                </label>
                <div className="relative">
                  <input type={type} required placeholder={placeholder}
                    value={regData[key]}
                    onChange={e => setRegData({ ...regData, [key]: e.target.value })}
                    className="w-full rounded-xl outline-none transition"
                    style={{ padding:'0.875rem 1rem', paddingRight:key==='password'?'3rem':'1rem',
                             border:'1.5px solid #E5E7EB', background:'#F9FAFB', color:'#111', fontSize:'0.95rem' }}
                    onFocus={e => e.target.style.borderColor='#F97316'}
                    onBlur={e  => e.target.style.borderColor='#E5E7EB'}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="mt-2 w-full font-extrabold rounded-xl transition-all active:scale-95"
              style={{ padding:'1rem', background:'#EA580C', color:'#fff', fontSize:'1rem',
                       opacity:loading?0.6:1, boxShadow:'0 4px 20px rgba(234,88,12,0.35)' }}>
              {loading ? 'Creating account...' : 'Create Account  \u2192'}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')}
                className="font-bold" style={{ color:'#EA580C' }}>Sign in</button>
            </p>
          </form>
        )}
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes fireWave {
          0%   { transform: scaleX(1)    scaleY(1)    skewX(0deg); }
          25%  { transform: scaleX(1.04) scaleY(1.07) skewX(2deg); }
          55%  { transform: scaleX(0.97) scaleY(0.94) skewX(-2deg); }
          80%  { transform: scaleX(1.05) scaleY(1.05) skewX(1.5deg); }
          100% { transform: scaleX(1.01) scaleY(1.01) skewX(-0.5deg); }
        }
        @keyframes emberRise {
          0%   { transform: translateY(0px)   translateX(0px)  scale(1);    opacity: 1; }
          35%  { transform: translateY(-80px)  translateX(6px)  scale(0.8);  opacity: 0.85; }
          70%  { transform: translateY(-160px) translateX(-4px) scale(0.5);  opacity: 0.45; }
          100% { transform: translateY(-240px) translateX(10px) scale(0.15); opacity: 0; }
        }
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitCounterRotate {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
