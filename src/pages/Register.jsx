import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Shield, Briefcase, 
  ChevronRight, ArrowLeft, CheckCircle2, 
  Sparkles, Globe, Zap
} from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // 'owner' or 'member'
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register } = useApp();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = register(username, password, role);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container v3-theme">
      {/* Visual Side */}
      <div className="auth-visual glass-morph">
        <div className="visual-content">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="brand-icon"
          >
            <Globe size={48} />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join <span className="text-gradient">PackPal</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="visual-text"
          >
            Create your account and start organizing your next big expedition with precision.
          </motion.p>

          <div className="visual-perks">
            {[
              { icon: <Shield size={18} />, text: 'Encrypted Vault Storage' },
              { icon: <Zap size={18} />, text: 'Real-time Synchronization' },
              { icon: <Sparkles size={18} />, text: 'AI-Powered Insights' }
            ].map((perk, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="perk-item glass"
              >
                {perk.icon} <span>{perk.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="visual-background" />
      </div>

      {/* Form Side */}
      <div className="auth-form-area">
        <motion.div 
          className="auth-card glass"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          <div className="auth-header">
            <h2>Initialization</h2>
            <p>Select your operational role and credentials</p>
          </div>

          {isSuccess ? (
            <motion.div 
              className="success-state"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="success-icon"><CheckCircle2 size={48} /></div>
              <h3>Account Created</h3>
              <p>Redirecting to command center...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              {error && <div className="error-msg">{error}</div>}

              <div className="role-selection">
                <label className="section-label">SELECT OPERATIONAL ROLE</label>
                <div className="role-cards">
                  <button 
                    type="button" 
                    className={`role-card ${role === 'owner' ? 'active' : ''}`}
                    onClick={() => setRole('owner')}
                  >
                    <Briefcase size={24} />
                    <div className="role-info">
                      <strong>OWNER</strong>
                      <span>Manage trips & teams</span>
                    </div>
                  </button>
                  <button 
                    type="button" 
                    className={`role-card ${role === 'member' ? 'active' : ''}`}
                    onClick={() => setRole('member')}
                  >
                    <User size={24} />
                    <div className="role-info">
                      <strong>MEMBER</strong>
                      <span>Manage personal assets</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="v3-input-group">
                <label>IDENTIFIER</label>
                <div className="v3-input-box">
                  <User size={18} className="box-icon" />
                  <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="v3-input-group">
                <label>ACCESS CODE</label>
                <div className="v3-input-box">
                  <Lock size={18} className="box-icon" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="v3-submit-btn">
                DEPLOY ACCOUNT <ChevronRight size={18} />
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: hsl(var(--bg));
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .auth-visual {
          flex: 1.2;
          background: linear-gradient(135deg, hsl(var(--p-dark)) 0%, hsl(var(--p)) 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
        }

        .visual-background {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.1;
        }

        .visual-content {
          z-index: 1;
          max-width: 480px;
        }

        .brand-icon {
          width: 80px;
          height: 80px;
          background: white;
          color: hsl(var(--p));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .visual-content h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1.5rem; line-height: 1; }
        .text-gradient { background: linear-gradient(to right, #fff, #ffffffaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .visual-text { font-size: 1.25rem; opacity: 0.8; margin-bottom: 3rem; line-height: 1.6; }

        .visual-perks { display: flex; flex-direction: column; gap: 1rem; }
        .perk-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 16px; font-weight: 600; }

        .auth-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, hsla(var(--p) / 0.05) 0%, transparent 70%);
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          padding: 3.5rem;
          border-radius: 32px;
          position: relative;
        }

        .back-link {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: hsl(var(--text-muted));
          text-decoration: none;
          transition: 0.2s;
        }
        .back-link:hover { color: hsl(var(--p)); }

        .auth-header { margin-bottom: 2.5rem; }
        .auth-header h2 { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .auth-header p { color: hsl(var(--text-muted)); font-weight: 500; }

        .role-selection { margin-bottom: 2rem; }
        .section-label { font-size: 0.7rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.15em; margin-bottom: 1rem; display: block; }
        .role-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .role-card {
          padding: 1.5rem;
          border-radius: 16px;
          border: 2px solid hsla(var(--text) / 0.05);
          background: hsla(var(--text) / 0.02);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          color: hsl(var(--text-muted));
        }
        .role-card.active { border-color: hsl(var(--p)); background: hsla(var(--p) / 0.05); color: hsl(var(--p)); }
        .role-info strong { font-size: 1rem; display: block; }
        .role-info span { font-size: 0.75rem; opacity: 0.7; }

        .v3-input-group { margin-bottom: 1.5rem; }
        .v3-input-group label { font-size: 0.7rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.15em; margin-bottom: 0.75rem; display: block; }
        .v3-input-box { position: relative; }
        .box-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }
        .v3-input-box input {
          width: 100%;
          padding: 1.125rem 1.125rem 1.125rem 3.5rem;
          border-radius: 16px;
          border: 1px solid hsla(var(--text) / 0.1);
          background: hsla(var(--text) / 0.03);
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          transition: 0.2s;
          color: hsl(var(--text));
        }
        .v3-input-box input:focus { border-color: hsl(var(--p)); box-shadow: 0 0 0 5px hsla(var(--p) / 0.1); background: white; }

        .v3-submit-btn {
          width: 100%;
          height: 60px;
          border-radius: 18px;
          background: hsl(var(--p));
          color: white;
          border: none;
          font-weight: 900;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          box-shadow: 0 10px 30px hsla(var(--p) / 0.3);
          transition: all 0.3s;
          margin-top: 1rem;
        }
        .v3-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 40px hsla(var(--p) / 0.4); }

        .error-msg { padding: 1rem; background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); border-radius: 12px; margin-bottom: 1.5rem; font-size: 0.9rem; font-weight: 600; border: 1px solid hsla(var(--danger) / 0.1); }
        
        .success-state { text-align: center; padding: 2rem 0; }
        .success-icon { color: hsl(var(--success)); margin-bottom: 1.5rem; }
        .success-state h3 { font-size: 1.75rem; font-weight: 900; margin-bottom: 0.5rem; }
        .success-state p { color: hsl(var(--text-muted)); }

        @media (max-width: 1024px) {
          .auth-visual { display: none; }
          .auth-form-area { flex: 1; padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
