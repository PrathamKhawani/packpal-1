import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ChevronRight, Shield, Zap, 
  Globe, Eye, EyeOff, AlertCircle, Loader2
} from 'lucide-react';

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
          {/* Brand Header */}
          <div className="auth-v2-header">
            <div className="auth-v2-logo">
              <Globe size={24} strokeWidth={2.5} />
            </div>
            <h1>Welcome to PackPal</h1>
            <p>Enter your credentials to access mission control.</p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="auth-v2-alert"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="auth-v2-form">
            <div className="auth-v2-field">
              <label>Work Email</label>
              <div className="auth-v2-input-box">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-v2-field">
              <div className="auth-v2-label-row">
                <label>Password</label>
                <a href="#" className="auth-v2-link">Forgot password?</a>
              </div>
              <div className="auth-v2-input-box">
                <Lock size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="auth-v2-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-v2-submit"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 size={20} className="auth-v2-spin" />
              ) : (
                <>Sign In to Account <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-v2-footer">
            <span>New to the platform?</span>
            <Link to="/register" className="auth-v2-link-bold">Create an account</Link>
          </div>
        </motion.div>

        {/* Floating Badges */}
        <div className="auth-v2-badges">
          <div className="auth-v2-badge"><Shield size={14} /> Military-Grade Security</div>
          <div className="auth-v2-badge"><Zap size={14} /> Real-time Operations</div>
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
          gap: 2rem;
        }

        .auth-v2-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        }

        .auth-v2-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-v2-logo {
          width: 48px;
          height: 48px;
          background: #6366F1;
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
        }

        .auth-v2-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
        }

        .auth-v2-header p {
          color: #6B7280;
          font-size: 0.9375rem;
        }

        .auth-v2-alert {
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          color: #B91C1C;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .auth-v2-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .auth-v2-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .auth-v2-field label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
        }

        .auth-v2-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-v2-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-v2-input-box svg {
          position: absolute;
          left: 1rem;
          color: #9CA3AF;
          pointer-events: none;
        }

        .auth-v2-input-box input {
          width: 100%;
          background: #F9FAFB;
          border: 1px solid #D1D5DB;
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          font-size: 0.9375rem;
          color: #111827;
          outline: none;
          transition: all 0.2s;
        }

        .auth-v2-input-box input:focus {
          background: #FFFFFF;
          border-color: #6366F1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .auth-v2-eye {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          display: flex;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .auth-v2-eye:hover {
          color: #6B7280;
        }

        .auth-v2-submit {
          margin-top: 0.5rem;
          background: #111827;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.875rem;
          font-weight: 700;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-v2-submit:hover {
          background: #1F2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .auth-v2-submit:active {
          transform: translateY(0);
        }

        .auth-v2-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-v2-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6B7280;
        }

        .auth-v2-link {
          color: #6366F1;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-v2-link-bold {
          color: #111827;
          text-decoration: none;
          font-weight: 700;
          margin-left: 0.5rem;
        }

        .auth-v2-link:hover, .auth-v2-link-bold:hover {
          text-decoration: underline;
        }

        .auth-v2-badges {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .auth-v2-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-v2-spin {
          animation: auth-spin-rotate 1s linear infinite;
        }

        @keyframes auth-spin-rotate {
          to { transform: rotate(360deg); }
        }

        @media (max-height: 800px) {
          .auth-v2-root { padding: 1rem; align-items: center; }
          .auth-v2-card { padding: 2rem; }
          .auth-v2-header { margin-bottom: 1.5rem; }
          .auth-v2-logo { margin-bottom: 1rem; width: 44px; height: 44px; }
          .auth-v2-form { gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
