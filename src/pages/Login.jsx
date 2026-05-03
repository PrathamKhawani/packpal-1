import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, LOGIN_ROLES } from '../contexts/AppContext';
import { motion } from 'framer-motion';
import { Map, Lock, User, ChevronRight, Sparkles, Globe } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(LOGIN_ROLES[0]);
  const [error, setError] = useState('');
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const success = login(username, password, role);
    if (success) {
      navigate(`/${role}/dashboard`);
    } else {
      setError(`Invalid credentials. Use password: ${role}123`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-content">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="visual-logo"
          >
            <Map size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            PackPal <span className="premium-badge">PREMIUM</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="visual-tagline"
          >
            Elevate your travel experience with AI-powered organization and team collaboration.
          </motion.p>
          
          <div className="visual-features">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="feature-item glass">
              <Sparkles size={20} /> <span>AI Itinerary Generator</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="feature-item glass">
              <Globe size={20} /> <span>Real-time Team Sync</span>
            </motion.div>
          </div>
        </div>
        <div className="visual-overlay" />
      </div>

      <div className="login-form-area">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="login-card glass"
        >
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your trip dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="error-banner">{error}</motion.div>}
            
            <div className="input-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={18} className="icon" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="icon" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Role (Demo Environment)</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                {LOGIN_ROLES.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Sign In <ChevronRight size={18} />
            </button>
          </form>

          <div className="demo-hint card">
            <p><strong>Demo Access:</strong> use <span>{role}123</span> as password.</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: hsl(var(--bg));
          overflow: hidden;
        }
        .login-visual {
          flex: 1.2;
          background: hsl(var(--p));
          background: linear-gradient(135deg, hsl(var(--p-dark)) 0%, hsl(var(--p)) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
          position: relative;
        }
        .visual-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.1;
        }
        .visual-content {
          max-width: 500px;
          z-index: 1;
        }
        .visual-logo {
          width: 80px;
          height: 80px;
          background: white;
          color: hsl(var(--p));
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .visual-content h1 {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .premium-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: hsla(0,0%,100%,0.2);
          border: 1px solid hsla(0,0%,100%,0.3);
          border-radius: 4px;
          font-weight: 800;
          margin-top: 1rem;
        }
        .visual-tagline {
          font-size: 1.25rem;
          opacity: 0.9;
          line-height: 1.6;
          margin-bottom: 3rem;
        }
        .visual-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9375rem;
        }
        .login-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-image: radial-gradient(hsl(var(--p) / 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem;
          border-radius: var(--radius-lg);
        }
        .form-header {
          margin-bottom: 2.5rem;
        }
        .form-header h2 {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }
        .form-header p {
          color: hsl(var(--text-muted));
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--text-muted));
        }
        .input-with-icon input {
          width: 100%;
          padding-left: 3rem;
        }
        .login-btn {
          height: 52px;
          font-size: 1.125rem;
          margin-top: 1rem;
        }
        .error-banner {
          padding: 0.75rem 1rem;
          background: hsla(var(--danger) / 0.1);
          color: hsl(var(--danger));
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid hsla(var(--danger) / 0.2);
        }
        .demo-hint {
          margin-top: 2.5rem;
          padding: 1rem;
          font-size: 0.8125rem;
          background: hsla(var(--text) / 0.02);
          text-align: center;
        }
        .demo-hint span {
          color: hsl(var(--p));
          font-weight: 700;
        }
        @media (max-width: 900px) {
          .login-visual { display: none; }
        }
      `}</style>
    </div>
  );
}
