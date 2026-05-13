import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, Plane, MapPin, Star } from 'lucide-react';
import '../styles/auth.css';

/* Flying stamps that burst out when passport opens */
const STAMPS = [
  { label:'TOKYO', sub:'Entry Granted', top:'15%', left:'-22%', rot:'-14deg', delay:0.1, color:'#6366f1' },
  { label:'PARIS', sub:'Approved', top:'10%', right:'-20%', rot:'12deg', delay:0.2, color:'#ec4899' },
  { label:'DUBAI', sub:'Stamped', top:'62%', left:'-18%', rot:'-8deg', delay:0.15, color:'#f59e0b' },
  { label:'BALI', sub:'Entry OK', top:'65%', right:'-16%', rot:'10deg', delay:0.25, color:'#10b981' },
  { label:'NYC', sub:'Cleared', top:'38%', left:'-26%', rot:'-18deg', delay:0.05, color:'#0ea5e9' },
  { label:'ROME', sub:'Welcome', top:'35%', right:'-24%', rot:'16deg', delay:0.3, color:'#8b5cf6' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });

  /* Cover opens: hinge on left, rotates -178deg */
  const coverRot   = useTransform(smooth, [0.04, 0.45], [0, -178]);
  const coverShad  = useTransform(smooth, [0.04, 0.45], [0, 1]);
  /* Stamps burst out after cover starts opening */
  const stampScale = useTransform(smooth, [0.30, 0.52], [0, 1]);
  const stampOp    = useTransform(smooth, [0.30, 0.52], [0, 1]);
  /* Hero text fades out */
  const heroOp     = useTransform(smooth, [0, 0.18], [1, 0]);
  const heroY      = useTransform(smooth, [0, 0.22], [0, -40]);
  /* Passport scale + move up for form reveal */
  const passScale  = useTransform(smooth, [0.55, 0.82], [1, 0.6]);
  const passY      = useTransform(smooth, [0.55, 0.82], [0, -120]);
  const passOp     = useTransform(smooth, [0.72, 0.88], [1, 0]);
  /* Form rises */
  const formOp     = useTransform(smooth, [0.70, 0.94], [0, 1]);
  const formY      = useTransform(smooth, [0.70, 0.94], [60, 0]);

  /* Scroll hint bounces until user scrolls */
  const hintOp     = useTransform(smooth, [0, 0.08], [1, 0]);

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
    <div className="pp-root">
      {/* Background gradient */}
      <div className="pp-bg" aria-hidden="true">
        <div className="pp-bg-orb pp-bg-orb1"/>
        <div className="pp-bg-orb pp-bg-orb2"/>
        <div className="pp-bg-orb pp-bg-orb3"/>
      </div>

      {/* Scroll container */}
      <div ref={containerRef} className="pp-scroller">
        <div className="pp-canvas">
          <div className="pp-sticky">

            {/* Hero headline */}
            <motion.div className="pp-hero" style={{ opacity: heroOp, y: heroY }}>
              <div className="pp-hero-pill"><Star size={13} fill="currentColor"/> 12,400+ Operators Worldwide</div>
              <h1>Your passport to<br/><em>perfect travel.</em></h1>
              <p>Scroll to open your mission briefing</p>
              <motion.div className="pp-scroll-arrow" style={{ opacity: hintOp }}
                animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:1.5 }}>
                ↓
              </motion.div>
            </motion.div>

            {/* ═══ PASSPORT 3D OBJECT ═══ */}
            <motion.div
              className="pp-passport-wrap"
              style={{ scale: passScale, y: passY, opacity: passOp }}
            >
              <div className="pp-passport-scene">

                {/* Flying stamps */}
                {STAMPS.map((s, i) => (
                  <motion.div
                    key={i}
                    className="pp-stamp"
                    style={{
                      top: s.top, left: s.left, right: s.right,
                      rotate: s.rot, '--sc': s.color,
                      scale: stampScale, opacity: stampOp,
                      transitionDelay: `${s.delay}s`,
                    }}
                  >
                    <div className="pp-stamp-inner">
                      <Plane size={12} className="pp-stamp-plane"/>
                      <div className="pp-stamp-city">{s.label}</div>
                      <div className="pp-stamp-sub">{s.sub}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Passport book */}
                <div className="pp-book">

                  {/* Spine */}
                  <div className="pp-spine"/>

                  {/* Back cover + right inside page (always visible) */}
                  <div className="pp-back-cover">
                    <div className="pp-page-right">
                      {/* Photo page design */}
                      <div className="pp-photo-page">
                        <div className="pp-photo-slot">
                          <div className="pp-photo-avatar">P</div>
                        </div>
                        <div className="pp-id-lines">
                          <div className="pp-id-label">OPERATOR</div>
                          <div className="pp-id-value">PackPal Mission Control</div>
                          <div className="pp-id-label">CLEARANCE</div>
                          <div className="pp-id-value">ALPHA LEVEL</div>
                          <div className="pp-mrz">
                            P&lt;PAKPACKPAL&lt;&lt;OPERATOR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                            A1234567890PAK991231M301231&lt;&lt;&lt;&lt;&lt;&lt;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Front cover — rotates open */}
                  <motion.div
                    className="pp-front-cover"
                    style={{ rotateY: coverRot }}
                  >
                    {/* Outside face of cover */}
                    <div className="pp-cover-front">
                      <div className="pp-cover-emblem">✦</div>
                      <div className="pp-cover-country">PACKPAL</div>
                      <div className="pp-cover-title">MISSION PASSPORT</div>
                      <div className="pp-cover-subtitle">OPERATOR CREDENTIALS</div>
                      <div className="pp-cover-stars">★ ★ ★</div>
                    </div>
                    {/* Inside face (backface of front cover) */}
                    <div className="pp-cover-inside">
                      <div className="pp-inside-header">PACKPAL · OFFICIAL USE ONLY</div>
                      <div className="pp-inside-stamp-grid">
                        {['JPN','FRA','UAE','USA','ITA','THA'].map(c => (
                          <div key={c} className="pp-mini-stamp">{c}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                </div>{/* end pp-book */}
              </div>{/* end pp-passport-scene */}
            </motion.div>{/* end passport-wrap */}

            {/* ═══ LOGIN FORM (rises as passport scales away) ═══ */}
            <motion.div className="pp-form-wrap" style={{ opacity: formOp, y: formY }}>
              <div className="pp-form-card">
                <div className="pp-form-top">
                  <div className="pp-form-logo">P</div>
                  <div>
                    <div className="pp-form-title">Sign in to PackPal</div>
                    <div className="pp-form-sub">Your mission control dashboard awaits</div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div className="lp3-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <AlertCircle size={15}/>{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="pp-form">
                  <div className="lp3-field">
                    <label htmlFor="pp-email">Work Email</label>
                    <div className="lp3-iw">
                      <Mail size={17} className="lp3-ico"/>
                      <input id="pp-email" type="email" placeholder="name@company.com"
                        value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                    </div>
                  </div>
                  <div className="lp3-field">
                    <div className="lp3-label-row">
                      <label htmlFor="pp-pass">Password</label>
                      <a href="#" className="lp3-forgot">Forgot?</a>
                    </div>
                    <div className="lp3-iw">
                      <Lock size={17} className="lp3-ico"/>
                      <input id="pp-pass" type={show?'text':'password'} placeholder="••••••••"
                        value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
                      <button type="button" className="lp3-eye" onClick={()=>setShow(!show)}>
                        {show?<EyeOff size={15}/>:<Eye size={15}/>}
                      </button>
                    </div>
                  </div>
                  <motion.button type="submit" className="lp3-submit" disabled={authLoading}
                    whileHover={{scale:1.02,boxShadow:'0 20px 44px rgba(99,102,241,0.5)'}} whileTap={{scale:0.97}}>
                    {authLoading ? <Loader2 size={20} className="lp3-spin"/> : <><span>Open Mission Control</span><ChevronRight size={18}/></>}
                  </motion.button>
                </form>

                <div className="pp-form-footer">
                  New here? <Link to="/register">Create operator account →</Link>
                </div>
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="pp-progress" style={{ scaleX: scrollYProgress }}/>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .pp-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; position:relative; background:#0a0814; }

        /* Ambient background orbs */
        .pp-bg { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
        .pp-bg-orb { position:absolute; border-radius:50%; filter:blur(80px); }
        .pp-bg-orb1 { width:600px; height:600px; background:rgba(99,102,241,0.18); top:-200px; left:-100px; }
        .pp-bg-orb2 { width:500px; height:500px; background:rgba(139,92,246,0.12); bottom:-150px; right:-100px; }
        .pp-bg-orb3 { width:400px; height:400px; background:rgba(236,72,153,0.08); top:50%; left:50%; transform:translate(-50%,-50%); }

        /* Scroller */
        .pp-scroller { position:relative; z-index:1; width:100%; height:100%; overflow-y:scroll; }
        .pp-scroller::-webkit-scrollbar { display:none; }
        .pp-canvas { height:520vh; }

        /* Sticky stage */
        .pp-sticky { position:sticky; top:0; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden; }

        /* Hero */
        .pp-hero { position:absolute; top:10%; left:50%; transform:translateX(-50%); text-align:center; z-index:20; white-space:nowrap; pointer-events:none; }
        .pp-hero-pill { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:100px; background:rgba(255,255,255,0.08); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.85); font-size:0.78rem; font-weight:700; margin-bottom:1.5rem; letter-spacing:0.03em; }
        .pp-hero h1 { font-size:clamp(2.5rem,6vw,5rem); font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1.05; margin:0 0 1rem; text-shadow:0 4px 32px rgba(0,0,0,0.5); }
        .pp-hero h1 em { font-style:normal; background:linear-gradient(90deg,#a78bfa,#818cf8,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .pp-hero p { color:rgba(255,255,255,0.45); font-size:0.95rem; margin:0 0 1.5rem; }
        .pp-scroll-arrow { font-size:1.5rem; color:rgba(255,255,255,0.35); display:block; }

        /* ── PASSPORT ───────────────────────────────────── */
        .pp-passport-wrap { position:absolute; z-index:10; display:flex; align-items:center; justify-content:center; }
        .pp-passport-scene { position:relative; perspective:2200px; perspective-origin:50% 45%; }

        /* Flying stamps */
        .pp-stamp { position:absolute; z-index:20; pointer-events:none; }
        .pp-stamp-inner {
          background:rgba(255,255,255,0.1); backdrop-filter:blur(16px);
          border:2px solid var(--sc); border-radius:12px;
          padding:0.5rem 0.875rem; text-align:center;
          box-shadow:0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.3);
        }
        .pp-stamp-plane { color:var(--sc); margin:0 auto 4px; display:block; }
        .pp-stamp-city { font-size:0.85rem; font-weight:900; color:#fff; letter-spacing:0.12em; }
        .pp-stamp-sub  { font-size:0.58rem; color:rgba(255,255,255,0.5); font-weight:600; letter-spacing:0.08em; margin-top:1px; }

        /* Passport book */
        .pp-book { position:relative; width:560px; height:400px; transform-style:preserve-3d; display:flex; filter:drop-shadow(0 40px 60px rgba(0,0,0,0.6)); }
        .pp-spine { width:28px; background:linear-gradient(180deg,#1a1060,#0d0840); border-radius:4px 0 0 4px; border-right:2px solid rgba(99,102,241,0.4); flex-shrink:0; }

        /* Back cover (right half — always visible) */
        .pp-back-cover { flex:1; background:linear-gradient(160deg,#12103a,#0d0840); border-radius:0 8px 8px 0; border:1px solid rgba(99,102,241,0.2); border-left:none; overflow:hidden; }
        .pp-page-right { height:100%; padding:1.5rem; display:flex; flex-direction:column; }
        .pp-photo-page { display:flex; gap:1.25rem; height:100%; }
        .pp-photo-slot { width:90px; flex-shrink:0; }
        .pp-photo-avatar { width:80px; height:96px; border-radius:8px; background:linear-gradient(135deg,#4f46e5,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:2.5rem; font-weight:900; color:#fff; border:2px solid rgba(99,102,241,0.5); }
        .pp-id-lines { flex:1; display:flex; flex-direction:column; gap:0.5rem; }
        .pp-id-label { font-size:0.6rem; font-weight:800; color:rgba(99,102,241,0.8); text-transform:uppercase; letter-spacing:0.1em; }
        .pp-id-value { font-size:0.78rem; font-weight:700; color:rgba(255,255,255,0.85); border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.25rem; }
        .pp-mrz { font-size:0.48rem; font-family:monospace; color:rgba(255,255,255,0.2); margin-top:auto; line-height:1.6; letter-spacing:0.03em; }

        /* Front cover — hinged on LEFT edge */
        .pp-front-cover {
          position:absolute; left:28px; top:0; width:calc(50% - 14px); height:100%;
          transform-origin:left center; transform-style:preserve-3d; z-index:5;
        }
        .pp-cover-front, .pp-cover-inside {
          position:absolute; inset:0; backface-visibility:hidden; border-radius:0 6px 6px 0;
        }
        .pp-cover-front {
          background:linear-gradient(160deg,#1e1070 0%,#110c50 60%,#0a0840 100%);
          border:1px solid rgba(99,102,241,0.3); border-left:none;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem;
          box-shadow:4px 0 20px rgba(0,0,0,0.5) inset;
        }
        .pp-cover-emblem { font-size:3rem; color:rgba(255,255,255,0.85); margin-bottom:0.5rem; filter:drop-shadow(0 0 12px rgba(99,102,241,0.8)); }
        .pp-cover-country { font-size:0.8rem; font-weight:800; color:rgba(255,255,255,0.7); letter-spacing:0.25em; text-transform:uppercase; }
        .pp-cover-title { font-size:1.2rem; font-weight:900; color:#fff; letter-spacing:0.08em; text-transform:uppercase; }
        .pp-cover-subtitle { font-size:0.55rem; color:rgba(255,255,255,0.4); letter-spacing:0.2em; text-transform:uppercase; }
        .pp-cover-stars { color:rgba(255,215,0,0.6); font-size:0.8rem; letter-spacing:0.3em; margin-top:0.5rem; }

        /* Inside face of cover (shows when open) */
        .pp-cover-inside {
          transform:rotateY(180deg);
          background:linear-gradient(160deg,#1a1260,#100e48);
          border:1px solid rgba(99,102,241,0.2); border-left:none;
          padding:1.5rem;
        }
        .pp-inside-header { font-size:0.55rem; font-weight:800; color:rgba(99,102,241,0.6); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:1rem; }
        .pp-inside-stamp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; }
        .pp-mini-stamp { border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:0.5rem; text-align:center; font-size:0.65rem; font-weight:800; color:rgba(255,255,255,0.5); letter-spacing:0.1em; }

        /* ── FORM ───────────────────────────────────────── */
        .pp-form-wrap { position:absolute; z-index:30; width:100%; display:flex; justify-content:center; padding:0 1.5rem; pointer-events:none; }
        .pp-form-card {
          width:100%; max-width:420px; pointer-events:auto;
          background:rgba(255,255,255,0.95); backdrop-filter:blur(40px);
          border:1px solid rgba(255,255,255,0.9); border-radius:28px;
          padding:2.25rem;
          box-shadow:0 32px 64px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2);
        }
        .pp-form-top { display:flex; align-items:center; gap:0.875rem; margin-bottom:1.75rem; }
        .pp-form-logo { width:46px; height:46px; border-radius:14px; background:linear-gradient(135deg,#4f46e5,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:1.3rem; font-weight:900; color:#fff; box-shadow:0 8px 20px rgba(79,70,229,0.4); flex-shrink:0; }
        .pp-form-title { font-size:1.05rem; font-weight:800; color:#111827; }
        .pp-form-sub   { font-size:0.75rem; color:#9ca3af; }
        .pp-form { display:flex; flex-direction:column; gap:1.1rem; }
        .pp-form-footer { text-align:center; margin-top:1.25rem; font-size:0.875rem; color:#9ca3af; }
        .pp-form-footer a { color:#4f46e5; font-weight:700; text-decoration:none; }
        .pp-form-footer a:hover { text-decoration:underline; }

        /* Progress */
        .pp-progress { position:fixed; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#ec4899,#f59e0b); transform-origin:left; z-index:9999; }

        @media(max-width:680px) {
          .pp-hero h1 { font-size: clamp(2rem, 8vw, 3rem); }
          .pp-book { width: 90vw; max-width: 340px; height: 60vw; max-height: 240px; }
          .pp-photo-avatar { width:60px; height:72px; font-size:1.8rem; }
          .pp-photo-slot { width: 70px; }
          .pp-id-value { font-size: 0.65rem; }
          .pp-mrz { font-size: 0.4rem; }
          .pp-cover-emblem { font-size:2rem; }
          .pp-cover-title { font-size:0.8rem; }
          .pp-cover-subtitle { font-size:0.45rem; }
          .pp-stamp { display:none; }
          .pp-form-card { padding:1.5rem 1rem; margin: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
