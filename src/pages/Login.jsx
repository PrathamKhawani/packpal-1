import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ChevronRight, Shield, Zap, Sparkles,
  Globe, Eye, EyeOff, AlertCircle, Loader2
} from 'lucide-react';

/* ─── Floating particle background ──────────────────────────── */
const Particles = () => (
  <div className="pp-particles" aria-hidden="true">
    {Array.from({ length: 18 }).map((_, i) => (
      <div key={i} className="pp-particle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${6 + Math.random() * 8}s`,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
        opacity: 0.15 + Math.random() * 0.3,
      }} />
    ))}
  </div>
);

const FEATURES = [
  { icon: <Shield size={20} />, title: 'Military-Grade Security', desc: 'End-to-end encryption for all your documents' },
  { icon: <Zap size={20} />, title: 'Real-time Sync', desc: 'Instant updates across your entire team' },
  { icon: <Sparkles size={20} />, title: 'AI-Powered Logistics', desc: 'Smart suggestions for every mission' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, authLoading, currentUser } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) navigate(`/${currentUser.role}/dashboard`, { replace: true });
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    const result = await login(email, password);
    if (!result.success) setError(result.message || 'Authentication failed.');
    // On success, onAuthStateChange fires → currentUser updates → useEffect above redirects
  };

  return (
    <div className="auth-root">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="auth-left">
        <Particles />
        <div className="auth-left-inner">
          <motion.div className="auth-brand" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="auth-logo"><Globe size={26} /></div>
            <span className="auth-logo-text">PackPal</span>
          </motion.div>

          <motion.div className="auth-hero-text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1>
              Your Mission.<br />
              <span className="auth-gradient-text">One Platform.</span>
            </h1>
            <p>Access your mission-critical travel assets and collaborate with your elite team in real time.</p>
          </motion.div>

          <div className="auth-features">
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="auth-feature-row"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="auth-left-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="auth-avatars">
              {['A', 'S', 'M', 'K', 'R'].map((l, i) => (
                <div key={i} className="auth-avatar-pill" style={{ zIndex: 5 - i, marginLeft: i > 0 ? '-10px' : '0' }}>{l}</div>
              ))}
            </div>
            <span>Join <strong>12,000+</strong> operators worldwide</span>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="auth-right">
        <motion.div className="auth-card"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your PackPal account</p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div className="auth-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={15} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="auth-form" id="login-form">
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-field-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-field-label-row">
                <label htmlFor="login-password">Password</label>
                <a href="#" className="auth-forgot" tabIndex={-1}>Forgot password?</a>
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-field-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={authLoading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              id="login-submit-btn"
            >
              {authLoading
                ? <Loader2 size={18} className="auth-spin" />
                : <><span>Sign In</span><ChevronRight size={18} /></>
              }
            </motion.button>
          </form>

          <p className="auth-switch-link">
            New to PackPal? <Link to="/register">Create an account</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .auth-root {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Inter', system-ui, sans-serif;
          background: #0a0a0f;
          color: #fff;
          overflow: hidden;
        }

        /* ── Left Panel ─────────────────────────────────────────── */
        .auth-left {
          flex: 1.1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d0d1a 0%, #0f1629 40%, #0a0f1e 100%);
          overflow: hidden;
          padding: 3rem;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-left::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Particles */
        .pp-particles { position: absolute; inset: 0; pointer-events: none; }
        .pp-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(99,102,241,0.7);
          animation: pp-float linear infinite;
        }
        @keyframes pp-float {
          0% { transform: translateY(0px) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }

        .auth-left-inner { position: relative; z-index: 1; max-width: 480px; width: 100%; display: flex; flex-direction: column; gap: 2.5rem; }

        .auth-brand { display: flex; align-items: center; gap: 0.75rem; }
        .auth-logo {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .auth-logo-text { font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; }

        .auth-hero-text h1 {
          font-size: 3rem; font-weight: 900; line-height: 1.1;
          letter-spacing: -0.03em; color: #fff; margin: 0 0 1rem 0;
        }
        .auth-gradient-text {
          background: linear-gradient(90deg, #6366f1, #a78bfa, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-hero-text p { color: rgba(255,255,255,0.55); font-size: 1.05rem; line-height: 1.6; margin: 0; }

        .auth-features { display: flex; flex-direction: column; gap: 1.25rem; }
        .auth-feature-row {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          transition: 0.2s;
        }
        .auth-feature-row:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.2); }
        .auth-feature-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          background: rgba(99,102,241,0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #818cf8;
        }
        .auth-feature-row strong { font-size: 0.9rem; font-weight: 700; color: #fff; display: block; margin-bottom: 2px; }
        .auth-feature-row p { font-size: 0.8rem; color: rgba(255,255,255,0.45); margin: 0; }

        .auth-left-footer { display: flex; align-items: center; gap: 1rem; color: rgba(255,255,255,0.45); font-size: 0.85rem; }
        .auth-left-footer strong { color: rgba(255,255,255,0.7); }
        .auth-avatars { display: flex; }
        .auth-avatar-pill {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: 2px solid #0d0d1a;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: #fff;
        }

        /* ── Right Panel ────────────────────────────────────────── */
        .auth-right {
          flex: 0 0 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e16;
          padding: 2rem;
          border-left: 1px solid rgba(255,255,255,0.06);
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
        }

        .auth-card-header { margin-bottom: 2rem; }
        .auth-card-header h2 { font-size: 1.75rem; font-weight: 800; color: #fff; margin: 0 0 0.4rem 0; letter-spacing: -0.02em; }
        .auth-card-header p { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin: 0; }

        /* Google btn */
        .auth-google-btn {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }
        .auth-google-btn:hover:not(:disabled) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }
        .auth-google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Divider */
        .auth-divider {
          display: flex; align-items: center; gap: 1rem;
          margin: 1.5rem 0;
          color: rgba(255,255,255,0.25); font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
        }

        /* Error */
        .auth-error {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.875rem 1rem;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          color: #f87171;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.25rem;
        }

        /* Form fields */
        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .auth-field label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.55); }
        .auth-field-label-row { display: flex; justify-content: space-between; align-items: center; }
        .auth-forgot { font-size: 0.8rem; color: #818cf8; text-decoration: none; font-weight: 500; transition: 0.15s; }
        .auth-forgot:hover { color: #a5b4fc; }

        .auth-input-wrap { position: relative; }
        .auth-field-icon {
          position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); pointer-events: none;
        }
        .auth-input-wrap input {
          width: 100%;
          height: 48px;
          padding: 0 1rem 0 2.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 0.9rem;
          font-family: 'Inter', system-ui, sans-serif;
          outline: none;
          transition: 0.2s;
          box-sizing: border-box;
        }
        .auth-input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-input-wrap input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }

        .auth-eye {
          position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer;
          display: flex; align-items: center; padding: 4px;
          transition: color 0.15s;
        }
        .auth-eye:hover { color: rgba(255,255,255,0.6); }

        /* Submit */
        .auth-submit-btn {
          width: 100%;
          height: 50px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .auth-submit-btn:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(99,102,241,0.5); transform: translateY(-1px); }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Footer link */
        .auth-switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: rgba(255,255,255,0.35); }
        .auth-switch-link a { color: #818cf8; font-weight: 600; text-decoration: none; margin-left: 0.25rem; transition: 0.15s; }
        .auth-switch-link a:hover { color: #a5b4fc; }

        /* Spinner */
        .auth-spin { animation: auth-rotate 0.8s linear infinite; }
        @keyframes auth-rotate { to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 1024px) {
          .auth-left { display: none; }
          .auth-right { flex: 1; border-left: none; background: #0a0a0f; }
        }
        @media (max-width: 480px) {
          .auth-right { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
