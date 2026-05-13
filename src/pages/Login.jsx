import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, ArrowDown, Map, Shield, Wallet, BarChart3, Users, Zap, Star, CheckCircle } from 'lucide-react';

/* ─── Feature cards shown floating in the parallax scene ── */
const CARDS = [
  {
    icon: <Map size={22}/>, color:'#6366f1', label:'AI Itinerary',
    preview: 'Tokyo · 5 days · ₹85,000',
    detail: 'Generated in 3 seconds',
    top:'12%', left:'4%', depth: 0.3,
  },
  {
    icon: <Shield size={22}/>, color:'#0ea5e9', label:'Secure Vault',
    preview: 'Passport · Visa · Insurance',
    detail: '256-bit AES encrypted',
    top:'8%', right:'4%', depth: 0.5,
  },
  {
    icon: <Wallet size={22}/>, color:'#10b981', label:'Expense Ops',
    preview: '₹1,24,500 of ₹2,00,000',
    detail: '62% budget used · on track',
    top:'55%', left:'2%', depth: 0.25,
  },
  {
    icon: <Users size={22}/>, color:'#f59e0b', label:'Team Control',
    preview: '8 members · 3 pending',
    detail: 'All checked in ✓',
    top:'60%', right:'2%', depth: 0.4,
  },
  {
    icon: <BarChart3 size={22}/>, color:'#ec4899', label:'Analytics',
    preview: 'Risk Score: LOW',
    detail: 'Weather clear · All green',
    top:'35%', left:'1%', depth: 0.2,
  },
  {
    icon: <Zap size={22}/>, color:'#8b5cf6', label:'Mission Brief',
    preview: 'Operation Sundown',
    detail: 'T-minus 4 days',
    top:'30%', right:'1%', depth: 0.35,
  },
];

/* ─── Trusted by section avatars ─ */
const TRUST = ['A','S','M','K','R','P'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 });

  /* Parallax layers */
  const bgY        = useTransform(smooth, [0, 1], ['0%', '25%']);
  const heroY      = useTransform(smooth, [0, 0.45], ['0%', '-30%']);
  const heroOp     = useTransform(smooth, [0, 0.35], [1, 0]);
  const overlayOp  = useTransform(smooth, [0, 0.5], [0.55, 0.75]);
  const formOp     = useTransform(smooth, [0.55, 0.88], [0, 1]);
  const formY2     = useTransform(smooth, [0.55, 0.88], [60, 0]);
  const midBgOp    = useTransform(smooth, [0.3, 0.55], [0, 1]);

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
    <div className="lv-root">
      <div ref={containerRef} className="lv-scroll">

        {/* ════════════════ SCENE 1: Cinematic Hero ════════════════ */}
        <section className="lv-scene">
          <div className="lv-sticky">

            {/* Background photo — parallax */}
            <motion.div className="lv-bg" style={{ y: bgY }}>
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=90&w=2000&auto=format&fit=crop"
                alt="Travel"
                className="lv-bg-img"
              />
            </motion.div>
            <motion.div className="lv-overlay" style={{ opacity: overlayOp }}/>

            {/* Floating feature cards — multi-depth parallax */}
            {CARDS.map((c, i) => {
              const cardY = useTransform(smooth, [0, 1], ['0px', `${c.depth * -180}px`]);
              const cardOp = useTransform(smooth, [0, 0.08, 0.48, 0.62], [0, 1, 1, 0]);
              return (
                <motion.div
                  key={i}
                  className="lv-fcard"
                  style={{
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    y: cardY,
                    opacity: cardOp,
                    '--cc': c.color,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: 'easeOut' }}
                >
                  <div className="lv-fcard-icon">{c.icon}</div>
                  <div className="lv-fcard-body">
                    <div className="lv-fcard-label">{c.label}</div>
                    <div className="lv-fcard-preview">{c.preview}</div>
                    <div className="lv-fcard-detail">{c.detail}</div>
                  </div>
                </motion.div>
              );
            })}

            {/* Hero text */}
            <motion.div className="lv-hero" style={{ y: heroY, opacity: heroOp }}>
              <motion.div
                className="lv-hero-badge"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              >
                <Star size={12} fill="currentColor"/> Rated #1 Trip Logistics Platform
              </motion.div>

              <motion.h1
                className="lv-hero-title"
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              >
                Every great trip<br/>
                <span className="lv-hero-accent">begins with a plan.</span>
              </motion.h1>

              <motion.p
                className="lv-hero-sub"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
              >
                PackPal orchestrates your entire expedition — from mission brief to expense report.
              </motion.p>

              <motion.div
                className="lv-trust"
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
              >
                <div className="lv-avatars">
                  {TRUST.map((l,i) => (
                    <div key={i} className="lv-av" style={{ marginLeft: i>0?'-10px':0, zIndex:6-i }}>{l}</div>
                  ))}
                </div>
                <span><strong>12,400+</strong> operators worldwide</span>
              </motion.div>

              {/* Scroll CTA */}
              <motion.div
                className="lv-scroll-cta"
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
              >
                <span>Scroll to sign in</span>
                <motion.div
                  className="lv-scroll-icon"
                  animate={{ y:[0, 10, 0] }}
                  transition={{ repeat:Infinity, duration:1.6, ease:'easeInOut' }}
                >
                  <ArrowDown size={22}/>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ─── Mid-section gradient ─── */}
            <motion.div className="lv-mid-gradient" style={{ opacity: midBgOp }}/>

            {/* ─── Login Form (floats in center when scrolled) ─── */}
            <motion.div
              className="lv-form-container"
              style={{ opacity: formOp, y: formY2 }}
            >
              <div className="lv-form-card">
                {/* Card header */}
                <div className="lv-card-top">
                  <div className="lv-card-logo">P</div>
                  <div>
                    <div className="lv-card-title">Sign in to PackPal</div>
                    <div className="lv-card-sub">Mission control awaits</div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div className="lv-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <AlertCircle size={15}/>{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="lv-form">
                  <div className="lv-field">
                    <label>Work Email</label>
                    <div className="lv-iw">
                      <Mail size={17} className="lv-ico"/>
                      <input type="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                    </div>
                  </div>

                  <div className="lv-field">
                    <div className="lv-field-row">
                      <label>Password</label>
                      <a href="#" className="lv-forgot">Forgot password?</a>
                    </div>
                    <div className="lv-iw">
                      <Lock size={17} className="lv-ico"/>
                      <input type={show?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
                      <button type="button" className="lv-eye" onClick={()=>setShow(!show)}>
                        {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="lv-submit"
                    disabled={authLoading}
                    whileHover={{ scale:1.02, boxShadow:'0 20px 40px rgba(99,102,241,0.45)' }}
                    whileTap={{ scale:0.97 }}
                  >
                    {authLoading
                      ? <Loader2 size={20} className="lv-spin"/>
                      : <><span>Open Mission Control</span><ChevronRight size={19}/></>
                    }
                  </motion.button>
                </form>

                <div className="lv-divider"><span>New to PackPal?</span></div>
                <Link to="/register" className="lv-reg-link">Create your operator account →</Link>

                <div className="lv-badges">
                  <span><CheckCircle size={12}/> SOC 2 Type II</span>
                  <span><CheckCircle size={12}/> GDPR Ready</span>
                  <span><CheckCircle size={12}/> 256-bit AES</span>
                </div>
              </div>
            </motion.div>

            {/* Scroll progress bar */}
            <motion.div className="lv-prog-bar" style={{ scaleX: scrollYProgress }}/>
          </div>
        </section>

        {/* Extra scroll height */}
        <div className="lv-spacer"/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .lv-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; }
        .lv-scroll { width:100%; height:100%; overflow-y:scroll; scroll-behavior:smooth; }
        .lv-scroll::-webkit-scrollbar { display:none; }

        .lv-scene { height:500vh; position:relative; }
        .lv-spacer { height:1px; }

        /* ── Sticky stage ── */
        .lv-sticky {
          position:sticky; top:0; height:100vh;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }

        /* ── Background photo ── */
        .lv-bg {
          position:absolute; inset:-10%; z-index:0;
        }
        .lv-bg-img {
          width:100%; height:100%; object-fit:cover;
          filter:saturate(1.1);
        }
        .lv-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(
            135deg,
            rgba(15,15,40,0.72) 0%,
            rgba(20,20,60,0.6) 50%,
            rgba(10,10,30,0.75) 100%
          );
        }
        .lv-mid-gradient {
          position:absolute; inset:0; z-index:2;
          background:linear-gradient(180deg, rgba(240,242,247,0) 0%, rgba(240,242,247,0.96) 100%);
          pointer-events:none;
        }

        /* ── Floating feature cards ── */
        .lv-fcard {
          position:absolute; z-index:10;
          background:rgba(255,255,255,0.12);
          backdrop-filter:blur(20px) saturate(180%);
          -webkit-backdrop-filter:blur(20px) saturate(180%);
          border:1px solid rgba(255,255,255,0.25);
          border-radius:20px; padding:1rem 1.25rem;
          display:flex; align-items:center; gap:0.875rem;
          min-width:220px;
          box-shadow:0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .lv-fcard-icon {
          width:44px; height:44px; border-radius:13px; flex-shrink:0;
          background:color-mix(in srgb, var(--cc) 20%, rgba(255,255,255,0.1));
          border:1px solid color-mix(in srgb, var(--cc) 35%, rgba(255,255,255,0.2));
          display:flex; align-items:center; justify-content:center;
          color:var(--cc); box-shadow:0 4px 12px color-mix(in srgb,var(--cc) 30%,transparent);
        }
        .lv-fcard-label { font-size:0.65rem; font-weight:800; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:0.06em; }
        .lv-fcard-preview { font-size:0.88rem; font-weight:700; color:#fff; margin:3px 0; }
        .lv-fcard-detail { font-size:0.72rem; color:rgba(255,255,255,0.55); }

        /* ── Hero text ── */
        .lv-hero {
          position:absolute; z-index:20; text-align:center;
          bottom:12%; left:50%; transform:translateX(-50%);
          width:100%; max-width:720px; padding:0 2rem;
          pointer-events:none;
        }
        .lv-hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:7px 18px; border-radius:100px;
          background:rgba(255,255,255,0.12); backdrop-filter:blur(10px);
          border:1px solid rgba(255,255,255,0.25);
          color:rgba(255,255,255,0.9); font-size:0.78rem; font-weight:700;
          letter-spacing:0.03em; margin-bottom:1.5rem;
        }
        .lv-hero-title {
          font-size:clamp(2.8rem,6vw,5.5rem); font-weight:900;
          color:#fff; letter-spacing:-0.04em; line-height:1.05;
          margin:0 0 1.25rem; text-shadow:0 4px 24px rgba(0,0,0,0.4);
        }
        .lv-hero-accent {
          background:linear-gradient(90deg,#a78bfa,#818cf8,#60a5fa);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .lv-hero-sub {
          font-size:1.1rem; color:rgba(255,255,255,0.7);
          line-height:1.65; margin:0 auto 2rem; max-width:500px;
          text-shadow:0 2px 12px rgba(0,0,0,0.4);
        }
        .lv-trust {
          display:inline-flex; align-items:center; gap:1rem;
          background:rgba(255,255,255,0.1); backdrop-filter:blur(10px);
          border:1px solid rgba(255,255,255,0.2); border-radius:100px;
          padding:10px 20px; margin-bottom:2rem;
          color:rgba(255,255,255,0.75); font-size:0.85rem;
        }
        .lv-trust strong { color:#fff; }
        .lv-avatars { display:flex; }
        .lv-av {
          width:30px; height:30px; border-radius:50%;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:2px solid rgba(255,255,255,0.4);
          display:flex; align-items:center; justify-content:center;
          font-size:0.7rem; font-weight:800; color:#fff;
        }
        .lv-scroll-cta {
          display:flex; flex-direction:column; align-items:center; gap:0.75rem;
          color:rgba(255,255,255,0.5); font-size:0.8rem; font-weight:600;
          letter-spacing:0.04em; text-transform:uppercase;
          pointer-events:auto;
        }
        .lv-scroll-icon {
          width:44px; height:44px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.3);
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,0.6);
        }

        /* ── Login Form ── */
        .lv-form-container {
          position:absolute; z-index:30; width:100%;
          display:flex; justify-content:center; padding:0 1.5rem;
          pointer-events:none;
        }
        .lv-form-card {
          width:100%; max-width:440px; pointer-events:auto;
          background:rgba(255,255,255,0.92);
          backdrop-filter:blur(40px) saturate(200%);
          -webkit-backdrop-filter:blur(40px) saturate(200%);
          border:1px solid rgba(255,255,255,0.8);
          border-radius:28px; padding:2.5rem;
          box-shadow:0 32px 64px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .lv-card-top { display:flex; align-items:center; gap:0.875rem; margin-bottom:1.75rem; }
        .lv-card-logo {
          width:46px; height:46px; border-radius:14px; flex-shrink:0;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          display:flex; align-items:center; justify-content:center;
          font-size:1.3rem; font-weight:900; color:#fff;
          box-shadow:0 8px 20px rgba(79,70,229,0.4);
        }
        .lv-card-title { font-size:1.05rem; font-weight:800; color:#111827; }
        .lv-card-sub { font-size:0.78rem; color:#9ca3af; font-weight:500; margin-top:1px; }

        .lv-error { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1rem; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; color:#dc2626; font-size:0.83rem; font-weight:500; margin-bottom:1.25rem; }
        .lv-form { display:flex; flex-direction:column; gap:1.1rem; }
        .lv-field { display:flex; flex-direction:column; gap:0.4rem; }
        .lv-field-row { display:flex; justify-content:space-between; align-items:center; }
        .lv-field label, .lv-field-row label { font-size:0.78rem; font-weight:700; color:#374151; }
        .lv-forgot { font-size:0.78rem; color:#6366f1; text-decoration:none; font-weight:600; }
        .lv-iw { position:relative; }
        .lv-ico { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .lv-iw input {
          width:100%; height:48px; padding:0 1rem 0 2.85rem;
          background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:13px;
          color:#111827; font-size:0.9rem; outline:none; transition:all 0.2s;
          box-sizing:border-box; font-family:inherit;
        }
        .lv-iw input::placeholder { color:#cbd5e1; }
        .lv-iw input:focus { border-color:#6366f1; background:#fff; box-shadow:0 0 0 4px rgba(99,102,241,0.12); }
        .lv-eye { position:absolute; right:0.9rem; top:50%; transform:translateY(-50%); background:none; border:none; color:#9ca3af; cursor:pointer; display:flex; padding:4px; }
        .lv-submit {
          width:100%; height:52px; margin-top:0.25rem; border-radius:14px; border:none;
          background:linear-gradient(135deg,#4f46e5,#6366f1,#818cf8);
          color:#fff; font-weight:800; font-size:0.95rem; font-family:inherit;
          display:flex; align-items:center; justify-content:center; gap:0.5rem;
          cursor:pointer; box-shadow:0 12px 28px rgba(99,102,241,0.38);
          transition:box-shadow 0.25s;
        }
        .lv-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .lv-divider { text-align:center; margin:1.5rem 0 0.875rem; color:#9ca3af; font-size:0.8rem; position:relative; }
        .lv-divider::before, .lv-divider::after { content:''; position:absolute; top:50%; width:30%; height:1px; background:#e5e7eb; }
        .lv-divider::before { left:0; }
        .lv-divider::after { right:0; }
        .lv-reg-link { display:block; text-align:center; color:#4f46e5; font-size:0.875rem; font-weight:700; text-decoration:none; transition:color 0.2s; }
        .lv-reg-link:hover { color:#6366f1; }
        .lv-badges { display:flex; justify-content:center; gap:1.25rem; margin-top:1.25rem; flex-wrap:wrap; }
        .lv-badges span { display:flex; align-items:center; gap:4px; font-size:0.7rem; color:#9ca3af; font-weight:600; }

        .lv-prog-bar { position:fixed; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#ec4899,#f59e0b); transform-origin:left; z-index:9999; }
        .lv-spin { animation:lv-rot 0.8s linear infinite; }
        @keyframes lv-rot { to{transform:rotate(360deg);} }

        @media(max-width:768px) {
          .lv-fcard { display:none; }
          .lv-fcard:nth-child(-n+3) { display:flex; min-width:160px; padding:0.75rem; }
          .lv-hero-title { font-size:2.6rem; }
          .lv-form-card { padding:2rem 1.25rem; }
        }
        @media(max-width:480px) {
          .lv-hero { bottom:8%; }
          .lv-fcard { display:none !important; }
          .lv-hero-title { font-size:2rem; }
        }
      `}</style>
    </div>
  );
}
