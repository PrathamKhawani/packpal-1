import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Briefcase, ChevronRight,
  ArrowLeft, CheckCircle2, Eye, EyeOff,
  AlertCircle, Loader2, Globe, Shield, Zap
} from 'lucide-react';

const ROLES = [
  { id: 'owner', icon: <Briefcase size={18} />, label: 'Trip Owner', desc: 'Manage trips & team' },
  { id: 'member', icon: <User size={18} />, label: 'Member', desc: 'Join mission & view' },
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, authLoading } = useApp();
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

  return (
    <div className="auth-v2-root">
      <div className="auth-v2-container">
        <motion.div 
          className="auth-v2-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link to="/login" className="auth-v2-back">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success" 
                className="auth-v2-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="auth-v2-success-icon"><CheckCircle2 size={48} /></div>
                <h3>Account Created!</h3>
                <p>Verification email sent. Redirecting to sign in...</p>
                <div className="auth-v2-progress"><motion.div className="auth-v2-progress-fill" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} /></div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="auth-v2-header">
                  <div className="auth-v2-logo">
                    <Globe size={24} strokeWidth={2.5} />
                  </div>
                  <h1>Create Account</h1>
                  <p>Join the elite mission control platform.</p>
                </div>

                {error && (
                  <div className="auth-v2-alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="auth-v2-role-select">
                  {ROLES.map(r => (
                    <button 
                      key={r.id}
                      className={`auth-v2-role-pill ${role === r.id ? 'active' : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRegister} className="auth-v2-form">
                  <div className="auth-v2-field">
                    <label>Full Name</label>
                    <div className="auth-v2-input-box">
                      <User size={18} />
                      <input type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="auth-v2-field">
                    <label>Work Email</label>
                    <div className="auth-v2-input-box">
                      <Mail size={18} />
                      <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="auth-v2-row">
                    <div className="auth-v2-field">
                      <label>Password</label>
                      <div className="auth-v2-input-box">
                        <Lock size={18} />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 chars" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="button" className="auth-v2-eye" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="auth-v2-field">
                      <label>Confirm</label>
                      <div className="auth-v2-input-box">
                        <Lock size={18} />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Repeat" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="auth-v2-submit" disabled={authLoading}>
                    {authLoading ? <Loader2 size={20} className="auth-v2-spin" /> : <>Create Account <ChevronRight size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="auth-v2-badges">
          <div className="auth-v2-badge"><Shield size={14} /> Encrypted Data</div>
          <div className="auth-v2-badge"><Zap size={14} /> Team Sync</div>
        </div>
      </div>

      <style>{`
        .auth-v2-root {
          min-height: 100vh;
          width: 100vw;
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          color: #111827;
          padding: 2rem;
          overflow: hidden;
        }

        .auth-v2-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-v2-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 24px;
          padding: 2.25rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .auth-v2-back {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-v2-back:hover { color: #111827; }

        .auth-v2-header { text-align: center; margin-bottom: 1.5rem; }

        .auth-v2-logo {
          width: 44px;
          height: 44px;
          background: #6366F1;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 12px -3px rgba(99, 102, 241, 0.3);
        }

        .auth-v2-header h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.25rem; }
        .auth-v2-header p { color: #6B7280; font-size: 0.875rem; }

        .auth-v2-alert {
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          color: #B91C1C;
          padding: 0.625rem 0.875rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 1.25rem;
        }

        .auth-v2-role-select {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .auth-v2-role-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #4B5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-v2-role-pill.active {
          background: #EEF2FF;
          border-color: #6366F1;
          color: #4F46E5;
        }

        .auth-v2-form { display: flex; flex-direction: column; gap: 1rem; }
        .auth-v2-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .auth-v2-field label { font-size: 0.75rem; font-weight: 600; color: #374151; }

        .auth-v2-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .auth-v2-input-box { position: relative; display: flex; align-items: center; }
        .auth-v2-input-box svg { position: absolute; left: 0.875rem; color: #9CA3AF; pointer-events: none; }

        .auth-v2-input-box input {
          width: 100%;
          background: #F9FAFB;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 0.625rem 0.875rem 0.625rem 2.5rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: all 0.2s;
        }

        .auth-v2-input-box input:focus {
          background: #FFFFFF;
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .auth-v2-eye {
          position: absolute; right: 0.625rem;
          background: none; border: none; color: #9CA3AF; cursor: pointer; display: flex; padding: 0.25rem;
        }

        .auth-v2-submit {
          margin-top: 0.5rem;
          background: #111827;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.75rem;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-v2-submit:hover { background: #1F2937; transform: translateY(-1px); }

        .auth-v2-success { text-align: center; padding: 1rem 0; }
        .auth-v2-success-icon { color: #10B981; margin-bottom: 1rem; }
        .auth-v2-success h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-v2-success p { color: #6B7280; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .auth-v2-progress { height: 4px; background: #F3F4F6; border-radius: 10px; overflow: hidden; }
        .auth-v2-progress-fill { height: 100%; background: #10B981; }

        .auth-v2-badges { display: flex; justify-content: center; gap: 1.25rem; }
        .auth-v2-badge { display: flex; align-items: center; gap: 0.375rem; font-size: 0.7rem; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; }

        .auth-v2-spin { animation: auth-spin-rotate 1s linear infinite; }
        @keyframes auth-spin-rotate { to { transform: rotate(360deg); } }

        @media (max-height: 850px) {
          .auth-v2-root { padding: 1rem; align-items: center; }
          .auth-v2-card { padding: 1.75rem; }
          .auth-v2-header { margin-bottom: 1rem; }
          .auth-v2-logo { margin-bottom: 0.75rem; width: 38px; height: 38px; }
          .auth-v2-form { gap: 0.75rem; }
          .auth-v2-role-select { margin-bottom: 1rem; }
        }
      `}</style>
    </div>
  );
}
