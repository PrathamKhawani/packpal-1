import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Briefcase, ChevronRight,
  ArrowLeft, CheckCircle2, Eye, EyeOff,
  AlertCircle, Loader2, Globe, Shield, Zap, Sparkles
} from 'lucide-react';

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
  { icon: <Shield size={20} />, title: 'Encrypted Vault Storage', desc: 'All your documents secured end-to-end' },
  { icon: <Zap size={20} />, title: 'Real-time Synchronization', desc: 'Instant updates across your entire team' },
  { icon: <Sparkles size={20} />, title: 'AI-Powered Insights', desc: 'Smart packing suggestions for every trip' },
];

const ROLES = [
  {
    id: 'owner',
    icon: <Briefcase size={20} />,
    label: 'Trip Owner',
    desc: 'Plan & manage trips, invite team members, handle finances',
  },
  {
    id: 'member',
    icon: <User size={20} />,
    label: 'Team Member',
    desc: 'View itineraries, manage your checklist, join missions',
  },
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, loginWithGoogle, authLoading } = useApp();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    const result = await register(email, password, role, fullName);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    const result = await loginWithGoogle(role);
    if (!result.success) { setError(result.message || 'Google sign-up failed.'); setGoogleLoading(false); }
  };

  return (
    <div className="auth-root">
      {/* ── Left panel ── */}
      <div className="auth-left">
        <Particles />
        <div className="auth-left-inner">
          <motion.div className="auth-brand" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="auth-logo"><Globe size={26} /></div>
            <span className="auth-logo-text">PackPal</span>
          </motion.div>

          <motion.div className="auth-hero-text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1>Start Your<br /><span className="auth-gradient-text">Next Mission.</span></h1>
            <p>Create your account and start organising your next expedition with precision and power.</p>
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

      {/* ── Right panel ── */}
      <div className="auth-right">
        <motion.div className="auth-card"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" className="auth-success-state"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="auth-success-icon"><CheckCircle2 size={52} /></div>
                <h3>Account Created!</h3>
                <p>Verification email sent. Redirecting to sign in…</p>
                <div className="auth-success-bar"><motion.div className="auth-success-fill" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} /></div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="auth-card-header">
                  <h2>Create account</h2>
                  <p>Join PackPal and start your first mission</p>
                </div>

                {/* Google */}
                <motion.button className="auth-google-btn" onClick={handleGoogle}
                  disabled={googleLoading || authLoading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  id="register-google-btn">
                  {googleLoading
                    ? <Loader2 size={18} className="auth-spin" />
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                  }
                  <span>Continue with Google</span>
                </motion.button>

                <div className="auth-divider"><span>or register with email</span></div>

                <AnimatePresence>
                  {error && (
                    <motion.div className="auth-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <AlertCircle size={15} /><span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Role selector */}
                <div className="auth-role-section">
                  <p className="auth-role-label">Select your role</p>
                  <div className="auth-role-grid">
                    {ROLES.map(r => (
                      <button key={r.id} type="button"
                        className={`auth-role-card ${role === r.id ? 'active' : ''}`}
                        onClick={() => setRole(r.id)}
                        id={`role-${r.id}`}>
                        <div className="auth-role-icon">{r.icon}</div>
                        <div>
                          <strong>{r.label}</strong>
                          <span>{r.desc}</span>
                        </div>
                        {role === r.id && <div className="auth-role-check"><CheckCircle2 size={16} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleRegister} className="auth-form" id="register-form">
                  {/* Full Name */}
                  <div className="auth-field">
                    <label htmlFor="reg-name">Full name</label>
                    <div className="auth-input-wrap">
                      <User size={16} className="auth-field-icon" />
                      <input id="reg-name" type="text" placeholder="John Doe"
                        value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="auth-field">
                    <label htmlFor="reg-email">Email address</label>
                    <div className="auth-input-wrap">
                      <Mail size={16} className="auth-field-icon" />
                      <input id="reg-email" type="email" placeholder="you@example.com"
                        value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                    </div>
                  </div>

                  {/* Password row */}
                  <div className="auth-two-col">
                    <div className="auth-field">
                      <label htmlFor="reg-password">Password</label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-field-icon" />
                        <input id="reg-password" type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 chars" value={password}
                          onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                        <button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="auth-field">
                      <label htmlFor="reg-confirm">Confirm</label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-field-icon" />
                        <input id="reg-confirm" type={showConfirm ? 'text' : 'password'}
                          placeholder="Repeat password" value={confirm}
                          onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
                        <button type="button" className="auth-eye" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <motion.button type="submit" className="auth-submit-btn" disabled={authLoading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} id="register-submit-btn">
                    {authLoading
                      ? <Loader2 size={18} className="auth-spin" />
                      : <><span>Create Account</span><ChevronRight size={18} /></>
                    }
                  </motion.button>
                </form>

                <p className="auth-switch-link">Already have an account? <Link to="/login">Sign in</Link></p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .auth-root { display:flex; min-height:100vh; width:100vw; font-family:'Inter',system-ui,sans-serif; background:#0a0a0f; color:#fff; overflow:hidden; }

        /* Left */
        .auth-left { flex:1.1; position:relative; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#0d0d1a 0%,#0f1629 40%,#0a0f1e 100%); overflow:hidden; padding:3rem; }
        .auth-left::before { content:''; position:absolute; top:-30%; left:-20%; width:80%; height:80%; background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%); pointer-events:none; }
        .auth-left::after { content:''; position:absolute; bottom:-20%; right:-10%; width:60%; height:60%; background:radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 70%); pointer-events:none; }

        .pp-particles { position:absolute; inset:0; pointer-events:none; }
        .pp-particle { position:absolute; border-radius:50%; background:rgba(99,102,241,.7); animation:pp-float linear infinite; }
        @keyframes pp-float { 0%{transform:translateY(0) scale(1);opacity:0} 10%{opacity:1} 90%{opacity:.5} 100%{transform:translateY(-100px) scale(.5);opacity:0} }

        .auth-left-inner { position:relative; z-index:1; max-width:480px; width:100%; display:flex; flex-direction:column; gap:2.5rem; }
        .auth-brand { display:flex; align-items:center; gap:.75rem; }
        .auth-logo { width:44px; height:44px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(99,102,241,.4); }
        .auth-logo-text { font-size:1.5rem; font-weight:800; color:#fff; letter-spacing:-.03em; }

        .auth-hero-text h1 { font-size:3rem; font-weight:900; line-height:1.1; letter-spacing:-.03em; color:#fff; margin:0 0 1rem 0; }
        .auth-gradient-text { background:linear-gradient(90deg,#6366f1,#a78bfa,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .auth-hero-text p { color:rgba(255,255,255,.55); font-size:1.05rem; line-height:1.6; margin:0; }

        .auth-features { display:flex; flex-direction:column; gap:1.25rem; }
        .auth-feature-row { display:flex; align-items:flex-start; gap:1rem; padding:1rem 1.25rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:14px; transition:.2s; }
        .auth-feature-row:hover { background:rgba(99,102,241,.08); border-color:rgba(99,102,241,.2); }
        .auth-feature-icon { width:38px; height:38px; flex-shrink:0; background:rgba(99,102,241,.15); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#818cf8; }
        .auth-feature-row strong { font-size:.9rem; font-weight:700; color:#fff; display:block; margin-bottom:2px; }
        .auth-feature-row p { font-size:.8rem; color:rgba(255,255,255,.45); margin:0; }

        .auth-left-footer { display:flex; align-items:center; gap:1rem; color:rgba(255,255,255,.45); font-size:.85rem; }
        .auth-left-footer strong { color:rgba(255,255,255,.7); }
        .auth-avatars { display:flex; }
        .auth-avatar-pill { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:2px solid #0d0d1a; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; color:#fff; }

        /* Right */
        .auth-right { flex:0 0 520px; display:flex; align-items:center; justify-content:center; background:#0e0e16; padding:2rem; border-left:1px solid rgba(255,255,255,.06); overflow-y:auto; }
        .auth-card { width:100%; max-width:440px; padding: 0.5rem 0; }

        .auth-back-link { display:inline-flex; align-items:center; gap:.5rem; color:rgba(255,255,255,.35); font-size:.8rem; font-weight:600; text-decoration:none; margin-bottom:1.5rem; transition:.15s; }
        .auth-back-link:hover { color:rgba(255,255,255,.7); }

        .auth-card-header { margin-bottom:1.5rem; }
        .auth-card-header h2 { font-size:1.75rem; font-weight:800; color:#fff; margin:0 0 .4rem 0; letter-spacing:-.02em; }
        .auth-card-header p { color:rgba(255,255,255,.4); font-size:.9rem; margin:0; }

        .auth-google-btn { width:100%; height:48px; border-radius:12px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.05); color:#fff; font-size:.9rem; font-weight:600; font-family:'Inter',system-ui,sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.75rem; transition:all .2s; }
        .auth-google-btn:hover:not(:disabled) { background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.2); }
        .auth-google-btn:disabled { opacity:.6; cursor:not-allowed; }

        .auth-divider { display:flex; align-items:center; gap:1rem; margin:1.25rem 0; color:rgba(255,255,255,.25); font-size:.8rem; }
        .auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.08); }

        .auth-error { display:flex; align-items:center; gap:.6rem; padding:.875rem 1rem; background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.25); border-radius:10px; color:#f87171; font-size:.85rem; font-weight:500; margin-bottom:1rem; }

        /* Role selector */
        .auth-role-section { margin-bottom:1.25rem; }
        .auth-role-label { font-size:.8rem; font-weight:600; color:rgba(255,255,255,.4); margin:0 0 .75rem 0; }
        .auth-role-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
        .auth-role-card { position:relative; display:flex; flex-direction:column; gap:.6rem; padding:1rem; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:14px; cursor:pointer; text-align:left; transition:all .2s; color:#fff; font-family:'Inter',system-ui,sans-serif; }
        .auth-role-card:hover { background:rgba(99,102,241,.06); border-color:rgba(99,102,241,.2); }
        .auth-role-card.active { background:rgba(99,102,241,.1); border-color:rgba(99,102,241,.5); }
        .auth-role-icon { width:34px; height:34px; background:rgba(99,102,241,.15); border-radius:9px; display:flex; align-items:center; justify-content:center; color:#818cf8; }
        .auth-role-card.active .auth-role-icon { background:rgba(99,102,241,.25); color:#a5b4fc; }
        .auth-role-card strong { font-size:.85rem; font-weight:700; display:block; margin-bottom:2px; }
        .auth-role-card span { font-size:.72rem; color:rgba(255,255,255,.4); line-height:1.4; display:block; }
        .auth-role-check { position:absolute; top:.75rem; right:.75rem; color:#6366f1; }

        /* Form */
        .auth-form { display:flex; flex-direction:column; gap:1rem; }
        .auth-field { display:flex; flex-direction:column; gap:.45rem; }
        .auth-field label { font-size:.8rem; font-weight:600; color:rgba(255,255,255,.55); }
        .auth-two-col { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }

        .auth-input-wrap { position:relative; }
        .auth-field-icon { position:absolute; left:.9rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.3); pointer-events:none; }
        .auth-input-wrap input { width:100%; height:46px; padding:0 1rem 0 2.75rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:12px; color:#fff; font-size:.875rem; font-family:'Inter',system-ui,sans-serif; outline:none; transition:.2s; box-sizing:border-box; }
        .auth-input-wrap input::placeholder { color:rgba(255,255,255,.2); }
        .auth-input-wrap input:focus { border-color:rgba(99,102,241,.6); background:rgba(99,102,241,.06); box-shadow:0 0 0 4px rgba(99,102,241,.1); }

        .auth-eye { position:absolute; right:.9rem; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,.3); cursor:pointer; display:flex; align-items:center; padding:4px; transition:color .15s; }
        .auth-eye:hover { color:rgba(255,255,255,.6); }

        .auth-submit-btn { width:100%; height:50px; border-radius:12px; border:none; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-size:.95rem; font-weight:700; font-family:'Inter',system-ui,sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem; box-shadow:0 8px 24px rgba(99,102,241,.35); transition:all .2s; margin-top:.25rem; }
        .auth-submit-btn:hover:not(:disabled) { box-shadow:0 12px 32px rgba(99,102,241,.5); transform:translateY(-1px); }
        .auth-submit-btn:disabled { opacity:.7; cursor:not-allowed; }

        .auth-switch-link { text-align:center; margin-top:1.25rem; font-size:.875rem; color:rgba(255,255,255,.35); }
        .auth-switch-link a { color:#818cf8; font-weight:600; text-decoration:none; margin-left:.25rem; transition:.15s; }
        .auth-switch-link a:hover { color:#a5b4fc; }

        /* Success state */
        .auth-success-state { text-align:center; padding:3rem 1rem; }
        .auth-success-icon { color:#34d399; margin-bottom:1.5rem; }
        .auth-success-state h3 { font-size:1.75rem; font-weight:800; color:#fff; margin:0 0 .5rem 0; }
        .auth-success-state p { color:rgba(255,255,255,.45); margin:0 0 2rem 0; }
        .auth-success-bar { height:3px; background:rgba(255,255,255,.08); border-radius:10px; overflow:hidden; }
        .auth-success-fill { height:100%; background:linear-gradient(90deg,#6366f1,#34d399); border-radius:10px; }

        .auth-spin { animation:auth-rotate .8s linear infinite; }
        @keyframes auth-rotate { to { transform:rotate(360deg); } }

        @media (max-width:1024px) { .auth-left { display:none; } .auth-right { flex:1; border-left:none; background:#0a0a0f; } }
        @media (max-width:480px) { .auth-right { padding:1.5rem; } .auth-two-col { grid-template-columns:1fr; } .auth-role-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
