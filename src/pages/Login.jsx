import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2,
  ChevronRight, Shield, Star, Map, Wallet, Users, Zap, BarChart3, CheckCircle
} from 'lucide-react';
import '../styles/auth.css';

/* ── Social proof stats ── */
const STATS = [
  { value:'12,400+', label:'Operators' },
  { value:'4.9★',   label:'App Rating' },
  { value:'140+',   label:'Countries'  },
  { value:'99.9%',  label:'Uptime'     },
];

/* ── Feature preview cards (3D tilted) ── */
const FEATURES = [
  {
    icon:<Map size={18}/>, color:'#6366f1',
    title:'AI Itinerary', value:'Tokyo · 5d · ₹85k',
    sub:'Ready in 3 seconds', rotate:'rotateY(-14deg) rotateX(6deg)',
  },
  {
    icon:<Shield size={18}/>, color:'#0ea5e9',
    title:'Secure Vault', value:'Passport · Visa · Insurance',
    sub:'256-bit encrypted', rotate:'rotateY(12deg) rotateX(-4deg)',
  },
  {
    icon:<Wallet size={18}/>, color:'#10b981',
    title:'Expense Ops', value:'₹1.24L of ₹2L spent',
    sub:'62% · On track', rotate:'rotateY(-10deg) rotateX(8deg)',
  },
  {
    icon:<Users size={18}/>, color:'#f59e0b',
    title:'Team Control', value:'8 members active',
    sub:'All checked in ✓', rotate:'rotateY(15deg) rotateX(-6deg)',
  },
  {
    icon:<BarChart3 size={18}/>, color:'#ec4899',
    title:'Analytics', value:'Risk Score: LOW',
    sub:'Weather clear ✓', rotate:'rotateY(-8deg) rotateX(4deg)',
  },
  {
    icon:<Zap size={18}/>, color:'#8b5cf6',
    title:'Risk Intel', value:'Operation Sundown',
    sub:'T-minus 4 days', rotate:'rotateY(10deg) rotateX(-5deg)',
  },
];

const BG = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=85&w=1800&auto=format&fit=crop';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const [mouse, setMouse]       = useState({ x:0, y:0 });
  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const rightRef = useRef(null);

  useEffect(() => {
    if (currentUser) navigate(`/${currentUser.role}/dashboard`, { replace:true });
  }, [currentUser]);

  /* Mouse-move parallax on right panel */
  const handleMouseMove = (e) => {
    const rect = rightRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 16,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 10,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const r = await login(email, password);
    if (!r.success) setError(r.message || 'Authentication failed. Please try again.');
  };

  return (
    <main className="lp3-root">

      {/* ═══════════ LEFT PANEL — Login Form ═══════════ */}
      <section className="lp3-left" aria-label="Sign in to PackPal">
        <div className="lp3-left-inner">

          {/* Brand */}
          <div className="lp3-brand">
            <div className="lp3-brand-icon">P</div>
            <span className="lp3-brand-name">PackPal</span>
          </div>

          {/* Heading */}
          <div className="lp3-heading">
            <h1>Welcome back, Operator</h1>
            <p>Sign in to your mission control dashboard.</p>
          </div>

          {/* Trust stats row */}
          <div className="lp3-stats-row">
            {STATS.map((s,i) => (
              <div key={i} className="lp3-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="lp3-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <AlertCircle size={15}/>{error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="lp3-form" noValidate>
            <div className="lp3-field">
              <label htmlFor="lp-email">Work Email</label>
              <div className="lp3-iw">
                <Mail size={17} className="lp3-ico"/>
                <input
                  id="lp-email" type="email" autoComplete="email"
                  placeholder="name@company.com"
                  value={email} onChange={e=>setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="lp3-field">
              <div className="lp3-label-row">
                <label htmlFor="lp-pass">Password</label>
                <a href="#" className="lp3-forgot" tabIndex={0}>Forgot password?</a>
              </div>
              <div className="lp3-iw">
                <Lock size={17} className="lp3-ico"/>
                <input
                  id="lp-pass" type={show?'text':'password'} autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password} onChange={e=>setPassword(e.target.value)}
                />
                <button type="button" className="lp3-eye" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" className="lp3-submit"
              disabled={authLoading}
              whileHover={{ scale:1.02, boxShadow:'0 20px 44px rgba(99,102,241,0.5)' }}
              whileTap={{ scale:0.97 }}
              aria-label="Sign in to PackPal"
            >
              {authLoading
                ? <Loader2 size={20} className="lp3-spin"/>
                : <><span>Open Mission Control</span><ChevronRight size={18}/></>
              }
            </motion.button>
          </form>

          {/* Register link */}
          <div className="lp3-switch">
            New to PackPal?&nbsp;
            <Link to="/register">Create a free account →</Link>
          </div>

          {/* Trust badges */}
          <div className="lp3-trust">
            <span><CheckCircle size={12}/> SOC 2 Type II</span>
            <span><CheckCircle size={12}/> GDPR Ready</span>
            <span><CheckCircle size={12}/> 256-bit AES</span>
          </div>
        </div>
      </section>

      {/* ═══════════ RIGHT PANEL — Cinematic 3D Visual ═══════════ */}
      <section
        ref={rightRef}
        className="lp3-right"
        onMouseMove={handleMouseMove}
        aria-label="PackPal feature showcase"
      >
        {/* Photo bg with parallax */}
        <motion.div
          className="lp3-photo"
          animate={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}
          transition={{ type:'spring', stiffness:40, damping:12 }}
        >
          <img src={BG} alt="Travel adventure by PackPal" loading="eager" decoding="async"/>
        </motion.div>
        <div className="lp3-photo-overlay"/>

        {/* Right panel content */}
        <motion.div
          className="lp3-right-content"
          animate={{ x: mouse.x * -0.3, y: mouse.y * -0.2 }}
          transition={{ type:'spring', stiffness:40, damping:12 }}
        >
          {/* Headline over photo */}
          <div className="lp3-right-headline">
            <div className="lp3-right-badge">
              <Star size={12} fill="currentColor"/> Rated #1 Travel Ops Platform 2024
            </div>
            <h2>Every great<br/>expedition<br/><em>starts here.</em></h2>
            <p>Trusted by elite teams across 140+ countries for high-stakes travel coordination.</p>
          </div>

          {/* 3D Feature cards grid */}
          <div className="lp3-cards-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="lp3-fcard"
                style={{ '--cc':f.color, '--rotate':f.rotate }}
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.15 + i*0.1, duration:0.6, ease:'easeOut' }}
                whileHover={{ scale:1.06, z:20 }}
              >
                <div className="lp3-fcard-icon">{f.icon}</div>
                <div className="lp3-fcard-body">
                  <div className="lp3-fcard-title">{f.title}</div>
                  <div className="lp3-fcard-val">{f.value}</div>
                  <div className="lp3-fcard-sub">{f.sub}</div>
                </div>
                <div className="lp3-fcard-dot"/>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
