import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, Shield, Zap, Globe2, Users, BarChart3, Map } from 'lucide-react';

const CARDS = [
  { icon: <Map size={22}/>, label: 'AI Itinerary', color: '#6366f1', rotate: '-12deg', x: '-55%', y: '-30%' },
  { icon: <Shield size={22}/>, label: 'Secure Vault', color: '#0ea5e9', rotate: '8deg', x: '45%', y: '-40%' },
  { icon: <BarChart3 size={22}/>, label: 'Expense Ops', color: '#10b981', rotate: '-6deg', x: '-60%', y: '20%' },
  { icon: <Users size={22}/>, label: 'Team Control', color: '#f59e0b', rotate: '14deg', x: '50%', y: '15%' },
  { icon: <Zap size={22}/>, label: 'Risk Analysis', color: '#ef4444', rotate: '-3deg', x: '-20%', y: '55%' },
  { icon: <Globe2 size={22}/>, label: 'Mission Brief', color: '#8b5cf6', rotate: '10deg', x: '25%', y: '50%' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const card0Rot = useTransform(scrollYProgress, [0, 0.5], [0, -25]);
  const card1Rot = useTransform(scrollYProgress, [0, 0.5], [0, 20]);
  const card2Scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const formY = useTransform(scrollYProgress, [0.3, 0.7], ['60px', '0px']);
  const formOpacity = useTransform(scrollYProgress, [0.3, 0.65], [0, 1]);

  useEffect(() => {
    if (currentUser) navigate(`/${currentUser.role}/dashboard`, { replace: true });
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const result = await login(email, password);
    if (!result.success) setError(result.message || 'Authentication failed.');
  };

  return (
    <div className="lp-root">
      <div ref={containerRef} className="lp-scroll">

        {/* ── SECTION 1: Hero ── */}
        <section className="lp-hero">
          <motion.div className="lp-hero-inner" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              Enterprise Travel Platform
            </div>
            <h1 className="lp-headline">
              Mission Control.<br />
              <span className="lp-grad">Reimagined.</span>
            </h1>
            <p className="lp-sub">Plan, execute, and analyse every expedition — all in one intelligent workspace.</p>
            <div className="lp-scroll-hint">
              <span>Scroll to continue</span>
              <motion.div className="lp-arrow" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>↓</motion.div>
            </div>
          </motion.div>

          {/* 3D floating module cards */}
          <div className="lp-cards-scene">
            {CARDS.map((c, i) => (
              <motion.div
                key={i}
                className="lp-float-card"
                style={{
                  '--card-color': c.color,
                  left: `calc(50% + ${c.x})`,
                  top: `calc(50% + ${c.y})`,
                  rotate: c.rotate,
                  rotateX: i % 2 === 0 ? card0Rot : card1Rot,
                  scale: card2Scale,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.08, rotate: '0deg', zIndex: 10 }}
              >
                <div className="lp-float-icon">{c.icon}</div>
                <span>{c.label}</span>
              </motion.div>
            ))}
            {/* Central orb */}
            <motion.div
              className="lp-orb"
              animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </div>
        </section>

        {/* ── SECTION 2: Stats ── */}
        <section className="lp-stats-section">
          <motion.div
            className="lp-stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {[['12,400+','Operators Worldwide'],['4.9★','Avg. Rating'],['99.9%','Uptime SLA'],['140+','Countries']]
              .map(([val, label], i) => (
                <motion.div key={i} className="lp-stat" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <strong>{val}</strong>
                  <span>{label}</span>
                </motion.div>
              ))}
          </motion.div>
        </section>

        {/* ── SECTION 3: Login Form ── */}
        <section className="lp-form-section">
          <motion.div className="lp-card" style={{ y: formY, opacity: formOpacity }}>
            <div className="lp-card-header">
              <div className="lp-logo"><Globe2 size={22} /></div>
              <h2>Sign In to PackPal</h2>
              <p>Access your mission command centre</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div className="lp-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={15} />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="lp-form">
              <div className="lp-field">
                <label>Email Address</label>
                <div className="lp-input-wrap">
                  <Mail size={16} className="lp-ico" />
                  <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
              </div>

              <div className="lp-field">
                <div className="lp-field-top">
                  <label>Password</label>
                  <a href="#" className="lp-forgot">Forgot?</a>
                </div>
                <div className="lp-input-wrap">
                  <Lock size={16} className="lp-ico" />
                  <input type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" className="lp-eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                </div>
              </div>

              <motion.button type="submit" className="lp-submit" disabled={authLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {authLoading ? <Loader2 size={18} className="lp-spin" /> : <><span>Access Command Centre</span><ChevronRight size={18}/></>}
              </motion.button>
            </form>

            <div className="lp-divider"><span>New here?</span></div>
            <Link to="/register" className="lp-register-link">Create your operator account →</Link>

            <div className="lp-trust">
              <Shield size={13}/> 256-bit AES encrypted &nbsp;·&nbsp; SOC 2 compliant
            </div>
          </motion.div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .lp-root { width:100vw; height:100vh; overflow:hidden; background:#080810; font-family:'Inter',system-ui,sans-serif; }
        .lp-scroll { height:100%; overflow-y:scroll; scroll-snap-type:y mandatory; scroll-behavior:smooth; }
        .lp-scroll::-webkit-scrollbar { width:4px; }
        .lp-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

        /* Hero */
        .lp-hero { height:100vh; scroll-snap-align:start; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%), #080810; }
        .lp-hero-inner { position:relative; z-index:2; text-align:center; max-width:680px; padding:0 2rem; }
        .lp-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:100px; border:1px solid rgba(99,102,241,0.3); background:rgba(99,102,241,0.08); color:rgba(255,255,255,0.7); font-size:0.78rem; font-weight:600; letter-spacing:0.04em; margin-bottom:2rem; }
        .lp-badge-dot { width:7px; height:7px; border-radius:50%; background:#6366f1; box-shadow:0 0 8px #6366f1; animation:lp-pulse 2s infinite; }
        @keyframes lp-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .lp-headline { font-size:clamp(2.5rem,6vw,4.5rem); font-weight:900; letter-spacing:-0.04em; color:#fff; line-height:1.05; margin:0 0 1.25rem; }
        .lp-grad { background:linear-gradient(135deg,#6366f1,#a78bfa,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .lp-sub { color:rgba(255,255,255,0.45); font-size:1.1rem; line-height:1.6; max-width:480px; margin:0 auto 2.5rem; }
        .lp-scroll-hint { display:flex; flex-direction:column; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.3); font-size:0.78rem; letter-spacing:0.06em; text-transform:uppercase; }
        .lp-arrow { font-size:1.2rem; color:rgba(255,255,255,0.3); }

        /* 3D Cards */
        .lp-cards-scene { position:absolute; inset:0; perspective:1200px; pointer-events:none; z-index:1; }
        .lp-float-card {
          position:absolute; transform-origin:center center;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(12px); border-radius:18px; padding:1rem 1.25rem;
          display:flex; align-items:center; gap:0.6rem;
          color:#fff; font-size:0.8rem; font-weight:700;
          white-space:nowrap; pointer-events:auto; cursor:default;
          transform-style:preserve-3d;
          box-shadow:0 8px 32px rgba(0,0,0,0.3);
        }
        .lp-float-card:hover { background:rgba(255,255,255,0.09); border-color:rgba(255,255,255,0.25); transition:all 0.3s; }
        .lp-float-icon { width:36px; height:36px; border-radius:10px; background:color-mix(in srgb,var(--card-color) 20%,transparent); border:1px solid color-mix(in srgb,var(--card-color) 40%,transparent); display:flex; align-items:center; justify-content:center; color:var(--card-color); }
        .lp-orb { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%); border:1px solid rgba(99,102,241,0.15); pointer-events:none; }

        /* Stats */
        .lp-stats-section { height:100vh; scroll-snap-align:start; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg,#080810,#0d0d1a); }
        .lp-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; max-width:900px; width:100%; padding:0 2rem; }
        .lp-stat { text-align:center; padding:2.5rem 1.5rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:24px; }
        .lp-stat strong { display:block; font-size:2.5rem; font-weight:900; color:#fff; letter-spacing:-0.03em; margin-bottom:0.5rem; }
        .lp-stat span { font-size:0.85rem; color:rgba(255,255,255,0.4); font-weight:500; }

        /* Form Section */
        .lp-form-section { min-height:100vh; scroll-snap-align:start; display:flex; align-items:center; justify-content:center; padding:4rem 2rem; background:linear-gradient(180deg,#0d0d1a,#080810); }
        .lp-card { width:100%; max-width:440px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:28px; padding:2.5rem; backdrop-filter:blur(20px); box-shadow:0 40px 80px rgba(0,0,0,0.4); }
        .lp-card-header { text-align:center; margin-bottom:2rem; }
        .lp-logo { width:52px; height:52px; margin:0 auto 1rem; border-radius:16px; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 12px 24px rgba(99,102,241,0.4); }
        .lp-card-header h2 { font-size:1.6rem; font-weight:800; color:#fff; margin:0 0 0.4rem; letter-spacing:-0.02em; }
        .lp-card-header p { color:rgba(255,255,255,0.4); font-size:0.9rem; }
        .lp-error { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1rem; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); border-radius:12px; color:#f87171; font-size:0.83rem; font-weight:500; margin-bottom:1.25rem; }
        .lp-form { display:flex; flex-direction:column; gap:1.1rem; }
        .lp-field { display:flex; flex-direction:column; gap:0.45rem; }
        .lp-field-top { display:flex; justify-content:space-between; align-items:center; }
        .lp-field label { font-size:0.78rem; font-weight:600; color:rgba(255,255,255,0.5); }
        .lp-forgot { font-size:0.78rem; color:#818cf8; text-decoration:none; font-weight:500; }
        .lp-forgot:hover { color:#a5b4fc; }
        .lp-input-wrap { position:relative; }
        .lp-ico { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.25); pointer-events:none; }
        .lp-input-wrap input { width:100%; height:48px; padding:0 1rem 0 2.75rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; color:#fff; font-size:0.9rem; outline:none; transition:0.2s; box-sizing:border-box; font-family:inherit; }
        .lp-input-wrap input::placeholder { color:rgba(255,255,255,0.2); }
        .lp-input-wrap input:focus { border-color:rgba(99,102,241,0.7); background:rgba(99,102,241,0.08); box-shadow:0 0 0 4px rgba(99,102,241,0.12); }
        .lp-eye { position:absolute; right:0.9rem; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; display:flex; padding:4px; }
        .lp-eye:hover { color:rgba(255,255,255,0.6); }
        .lp-submit { width:100%; height:52px; margin-top:0.5rem; border-radius:14px; border:none; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-weight:800; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer; box-shadow:0 12px 32px rgba(99,102,241,0.4); font-family:inherit; }
        .lp-submit:disabled { opacity:0.7; cursor:not-allowed; }
        .lp-divider { text-align:center; margin:1.5rem 0 0.75rem; color:rgba(255,255,255,0.2); font-size:0.8rem; position:relative; }
        .lp-register-link { display:block; text-align:center; color:#818cf8; font-size:0.875rem; font-weight:600; text-decoration:none; transition:color 0.2s; }
        .lp-register-link:hover { color:#a5b4fc; }
        .lp-trust { text-align:center; margin-top:1.5rem; color:rgba(255,255,255,0.2); font-size:0.72rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
        .lp-spin { animation:lp-rotate 0.8s linear infinite; }
        @keyframes lp-rotate { to{transform:rotate(360deg);} }

        @media(max-width:900px) {
          .lp-stats-grid { grid-template-columns:repeat(2,1fr); }
          .lp-float-card { display:none; }
          .lp-float-card:nth-child(-n+2) { display:flex; }
        }
        @media(max-width:640px) {
          .lp-stats-section { height:auto; min-height:100vh; padding:4rem 1.5rem; }
          .lp-stats-grid { grid-template-columns:1fr 1fr; gap:1rem; }
          .lp-stat strong { font-size:2rem; }
          .lp-card { padding:2rem 1.5rem; }
          .lp-headline { font-size:2.4rem; }
        }
      `}</style>
    </div>
  );
}
