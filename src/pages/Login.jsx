import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, Map, Shield, Wallet, BarChart3, Users, Zap } from 'lucide-react';

const FEATURES = [
  { icon: <Map size={20}/>,       label: 'AI Itinerary',  color: '#6366f1', x: -260, y: -180 },
  { icon: <Shield size={20}/>,    label: 'Secure Vault',  color: '#0ea5e9', x:  240, y: -200 },
  { icon: <Wallet size={20}/>,    label: 'Finance Ops',   color: '#10b981', x: -300, y:   20 },
  { icon: <BarChart3 size={20}/>, label: 'Analytics',     color: '#f59e0b', x:  280, y:   10 },
  { icon: <Users size={20}/>,     label: 'Team Control',  color: '#ec4899', x: -200, y:  200 },
  { icon: <Zap size={20}/>,       label: 'Risk Intel',    color: '#8b5cf6', x:  200, y:  190 },
];

// Latch component
const Latch = ({ side }) => (
  <div style={{
    position:'absolute', top:'50%', [side]: -14,
    transform:'translateY(-50%)',
    width:14, height:28, borderRadius:4,
    background:'linear-gradient(180deg,#c8a96e,#a07840)',
    boxShadow:'0 2px 6px rgba(0,0,0,0.25)',
    display:'flex', alignItems:'center', justifyContent:'center'
  }}>
    <div style={{ width:6, height:6, borderRadius:'50%', background:'#7a5a2a' }}/>
  </div>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Lid opens
  const lidRotate  = useTransform(smooth, [0.05, 0.42], [0, -112]);
  const lidShadow  = useTransform(smooth, [0.05, 0.42], [0, 0.5]);
  // Case scales down + moves up when form appears
  const caseScale  = useTransform(smooth, [0.58, 0.82], [1, 0.55]);
  const caseY      = useTransform(smooth, [0.58, 0.82], [0, -160]);
  const caseOpacity= useTransform(smooth, [0.70, 0.88], [1, 0]);
  // Feature cards fly out
  const featureScale  = useTransform(smooth, [0.38, 0.58], [0, 1]);
  const featureOpacity= useTransform(smooth, [0.38, 0.56], [0, 1]);
  // Form rises
  const formY      = useTransform(smooth, [0.70, 0.94], [80, 0]);
  const formOpacity= useTransform(smooth, [0.68, 0.92], [0, 1]);
  // Hero text
  const heroOpacity= useTransform(smooth, [0, 0.15], [1, 0]);
  const heroY      = useTransform(smooth, [0, 0.20], [0, -40]);

  useEffect(() => {
    if (currentUser) navigate(`/${currentUser.role}/dashboard`, { replace: true });
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const r = await login(email, password);
    if (!r.success) setError(r.message || 'Authentication failed.');
  };

  return (
    <div className="lx-root">
      <div ref={containerRef} className="lx-scroller">

        {/* ═══ TALL SCROLL CANVAS ═══ */}
        <div className="lx-canvas">

          {/* Sticky 3D Stage */}
          <div className="lx-sticky">

            {/* Background grid */}
            <div className="lx-grid-bg" aria-hidden="true"/>

            {/* Hero headline */}
            <motion.div className="lx-hero-text" style={{ opacity: heroOpacity, y: heroY }}>
              <div className="lx-pill">✦ Enterprise Travel Platform</div>
              <h1>Your Mission.<br/><em>Perfectly Packed.</em></h1>
              <p>Scroll to open the briefcase ↓</p>
            </motion.div>

            {/* 3D Briefcase + Flying cards */}
            <motion.div className="lx-case-wrapper" style={{ scale: caseScale, y: caseY, opacity: caseOpacity }}>
              <div className="lx-case-scene">

                {/* Feature cards orbiting out */}
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={i}
                    className="lx-feat-chip"
                    style={{
                      '--chip-color': f.color,
                      opacity: featureOpacity,
                      scale: featureScale,
                      x: useTransform(smooth, [0.38, 0.58], [0, f.x]),
                      y: useTransform(smooth, [0.38, 0.58], [0, f.y]),
                      rotate: useTransform(smooth, [0.38, 0.58], [0, (i % 2 === 0 ? -8 : 8)]),
                      transitionDelay: `${i * 0.04}s`,
                    }}
                  >
                    <div className="lx-chip-icon">{f.icon}</div>
                    <span>{f.label}</span>
                  </motion.div>
                ))}

                {/* === BRIEFCASE === */}
                <div className="lx-case-body">
                  <Latch side="left"/>
                  <Latch side="right"/>

                  {/* Handle */}
                  <div className="lx-handle"/>

                  {/* Lid (rotates open) */}
                  <motion.div className="lx-case-lid" style={{ rotateX: lidRotate }}>
                    <div className="lx-lid-face">
                      <div className="lx-lid-brand">PackPal</div>
                      <div className="lx-lid-tag"/>
                    </div>
                    <div className="lx-lid-inner"/>
                  </motion.div>

                  {/* Base */}
                  <div className="lx-case-base">
                    <div className="lx-base-inner">
                      <div className="lx-base-text">Mission Essentials</div>
                      <div className="lx-base-dots">
                        {Array.from({length:12}).map((_,i) => <div key={i} className="lx-dot"/>)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case shadow */}
                <motion.div className="lx-case-shadow" style={{ opacity: lidShadow }}/>
              </div>
            </motion.div>

            {/* Login Form (rises as case fades) */}
            <motion.div className="lx-form-wrap" style={{ opacity: formOpacity, y: formY }}>
              <div className="lx-form-card">
                <div className="lx-form-badge">
                  <div className="lx-form-logo">P</div>
                  <div>
                    <div className="lx-form-title">PackPal</div>
                    <div className="lx-form-sub">Mission Control Platform</div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div className="lx-error" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <AlertCircle size={14}/>{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="lx-form">
                  <div className="lx-field">
                    <label>Work Email</label>
                    <div className="lx-iw">
                      <Mail size={16} className="lx-ico"/>
                      <input type="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                    </div>
                  </div>
                  <div className="lx-field">
                    <div className="lx-flabel">
                      <label>Password</label>
                      <a href="#" className="lx-forgot">Forgot?</a>
                    </div>
                    <div className="lx-iw">
                      <Lock size={16} className="lx-ico"/>
                      <input type={show?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
                      <button type="button" className="lx-eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                    </div>
                  </div>
                  <motion.button type="submit" className="lx-submit" disabled={authLoading} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                    {authLoading ? <Loader2 size={18} className="lx-spin"/> : <><span>Open Mission Control</span><ChevronRight size={18}/></>}
                  </motion.button>
                </form>

                <p className="lx-switch">No account? <Link to="/register">Create one →</Link></p>
              </div>
            </motion.div>

            {/* Scroll progress bar */}
            <motion.div className="lx-progress" style={{ scaleX: scrollYProgress }}/>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .lx-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; background:#f0f2f7; }
        .lx-scroller { width:100%; height:100%; overflow-y:scroll; }
        .lx-scroller::-webkit-scrollbar { width:0; }

        /* Tall canvas to give scroll room */
        .lx-canvas { height:550vh; position:relative; }

        /* Sticky stage fills viewport */
        .lx-sticky {
          position:sticky; top:0; height:100vh;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
          background: radial-gradient(ellipse 100% 80% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%), #f0f2f7;
        }

        /* Subtle grid */
        .lx-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image: linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        /* Hero text */
        .lx-hero-text {
          position:absolute; top:12%; left:50%; transform:translateX(-50%);
          text-align:center; z-index:2; white-space:nowrap;
        }
        .lx-pill {
          display:inline-block; padding:6px 18px; border-radius:100px;
          background:#fff; border:1px solid #e5e7eb;
          font-size:0.75rem; font-weight:700; color:#6366f1; letter-spacing:0.04em;
          margin-bottom:1.25rem; box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }
        .lx-hero-text h1 {
          font-size:clamp(2.2rem,5vw,4rem); font-weight:900;
          color:#111827; letter-spacing:-0.04em; line-height:1.1; margin:0 0 1rem;
        }
        .lx-hero-text h1 em { font-style:normal; color:#6366f1; }
        .lx-hero-text p { color:#9ca3af; font-size:0.95rem; margin:0; }

        /* ── 3D BRIEFCASE ─────────────────────────────── */
        .lx-case-wrapper { position:absolute; z-index:3; display:flex; align-items:center; justify-content:center; }
        .lx-case-scene { position:relative; perspective:1000px; width:320px; height:240px; }

        .lx-case-body { position:relative; width:320px; height:240px; filter:drop-shadow(0 30px 50px rgba(0,0,0,0.18)); }

        /* Handle */
        .lx-handle {
          position:absolute; top:-24px; left:50%; transform:translateX(-50%);
          width:80px; height:22px;
          border:3px solid #b08040; border-bottom:none; border-radius:12px 12px 0 0;
          background:transparent;
        }

        /* Lid */
        .lx-case-lid {
          position:absolute; top:0; left:0; right:0;
          height:115px; transform-origin:bottom center;
          transform-style:preserve-3d; z-index:2;
        }
        .lx-lid-face {
          position:absolute; inset:0;
          background:linear-gradient(160deg,#c8964a 0%,#a0722a 60%,#8a5e1e 100%);
          border-radius:12px 12px 4px 4px;
          border:2px solid #7a5018;
          display:flex; align-items:center; justify-content:center;
          box-shadow:inset 0 2px 8px rgba(255,255,255,0.15), inset 0 -4px 12px rgba(0,0,0,0.2);
        }
        .lx-lid-brand {
          font-size:1.5rem; font-weight:900; color:rgba(255,255,255,0.85);
          letter-spacing:0.08em; text-transform:uppercase;
          text-shadow:0 1px 4px rgba(0,0,0,0.4);
        }
        .lx-lid-tag {
          position:absolute; bottom:12px; right:16px;
          width:32px; height:20px; border-radius:4px;
          background:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.4);
        }
        .lx-lid-inner {
          position:absolute; inset:0; transform:rotateX(180deg);
          background:linear-gradient(180deg,#f8e8c8,#f0d8a0);
          border-radius:12px 12px 4px 4px;
          border:2px solid #d4aa60;
        }

        /* Base */
        .lx-case-base {
          position:absolute; bottom:0; left:0; right:0;
          height:130px;
          background:linear-gradient(160deg,#b07830 0%,#8a5e1e 100%);
          border-radius:4px 4px 14px 14px;
          border:2px solid #7a5018; border-top:none;
          box-shadow:inset 0 4px 12px rgba(0,0,0,0.2);
          overflow:hidden;
        }
        .lx-base-inner { padding:1rem; }
        .lx-base-text { font-size:0.65rem; font-weight:800; color:rgba(255,255,255,0.5); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.5rem; }
        .lx-base-dots { display:flex; flex-wrap:wrap; gap:6px; }
        .lx-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.2); }

        .lx-case-shadow { position:absolute; bottom:-20px; left:10%; right:10%; height:20px; background:radial-gradient(ellipse,rgba(0,0,0,0.25),transparent 70%); border-radius:50%; }

        /* Feature chips */
        .lx-feat-chip {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          background:#fff; border:1px solid #e5e7eb;
          border-radius:14px; padding:0.6rem 1rem;
          display:flex; align-items:center; gap:0.5rem;
          font-size:0.8rem; font-weight:700; color:#111827;
          box-shadow:0 8px 24px rgba(0,0,0,0.1);
          white-space:nowrap; pointer-events:none; z-index:4;
        }
        .lx-chip-icon {
          width:34px; height:34px; border-radius:10px;
          background:color-mix(in srgb,var(--chip-color) 12%,#fff);
          border:1px solid color-mix(in srgb,var(--chip-color) 25%,transparent);
          display:flex; align-items:center; justify-content:center;
          color:var(--chip-color);
        }

        /* ── FORM ─────────────────────────────────────── */
        .lx-form-wrap { position:absolute; z-index:5; width:100%; display:flex; justify-content:center; padding:0 1.5rem; pointer-events:none; }
        .lx-form-card {
          width:100%; max-width:420px; background:#fff;
          border:1px solid #e5e7eb; border-radius:24px; padding:2.25rem;
          box-shadow:0 24px 48px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.04);
          pointer-events:auto;
        }
        .lx-form-badge { display:flex; align-items:center; gap:0.875rem; margin-bottom:1.75rem; }
        .lx-form-logo {
          width:44px; height:44px; border-radius:14px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          display:flex; align-items:center; justify-content:center;
          color:#fff; font-size:1.2rem; font-weight:900;
          box-shadow:0 8px 20px rgba(99,102,241,0.35); flex-shrink:0;
        }
        .lx-form-title { font-size:1.1rem; font-weight:800; color:#111827; }
        .lx-form-sub { font-size:0.75rem; color:#9ca3af; font-weight:500; }

        .lx-error { display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.875rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; color:#dc2626; font-size:0.82rem; margin-bottom:1rem; }
        .lx-form { display:flex; flex-direction:column; gap:1rem; }
        .lx-field { display:flex; flex-direction:column; gap:0.4rem; }
        .lx-field label, .lx-flabel label { font-size:0.78rem; font-weight:600; color:#374151; }
        .lx-flabel { display:flex; justify-content:space-between; align-items:center; }
        .lx-forgot { font-size:0.78rem; color:#6366f1; text-decoration:none; font-weight:500; }
        .lx-iw { position:relative; }
        .lx-ico { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:#d1d5db; pointer-events:none; }
        .lx-iw input {
          width:100%; height:46px; padding:0 1rem 0 2.75rem;
          background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;
          color:#111827; font-size:0.875rem; outline:none; transition:0.2s;
          box-sizing:border-box; font-family:inherit;
        }
        .lx-iw input::placeholder { color:#d1d5db; }
        .lx-iw input:focus { border-color:#6366f1; background:#fff; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
        .lx-eye { position:absolute; right:0.875rem; top:50%; transform:translateY(-50%); background:none; border:none; color:#9ca3af; cursor:pointer; display:flex; padding:4px; }
        .lx-submit {
          width:100%; height:50px; margin-top:0.25rem; border-radius:13px; border:none;
          background:linear-gradient(135deg,#4f46e5,#6366f1);
          color:#fff; font-weight:800; font-size:0.9rem; font-family:inherit;
          display:flex; align-items:center; justify-content:center; gap:0.5rem;
          cursor:pointer; box-shadow:0 10px 28px rgba(99,102,241,0.35);
          transition:box-shadow 0.2s;
        }
        .lx-submit:hover { box-shadow:0 16px 36px rgba(99,102,241,0.45); }
        .lx-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .lx-switch { text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#9ca3af; }
        .lx-switch a { color:#6366f1; font-weight:700; text-decoration:none; }
        .lx-switch a:hover { text-decoration:underline; }

        .lx-spin { animation:lx-rot 0.8s linear infinite; }
        @keyframes lx-rot { to{transform:rotate(360deg);} }

        /* Progress bar */
        .lx-progress {
          position:fixed; bottom:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#6366f1,#ec4899);
          transform-origin:left; z-index:99;
        }

        @media(max-width:640px) {
          .lx-case-scene { transform:scale(0.75); }
          .lx-form-card { padding:1.75rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
