import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, PlaneTakeoff, Users, 
  CloudSun, Clock, Compass, MapPin, 
  IndianRupee, Target, Globe, Calendar,
  CloudRain, Zap, Sun, ShieldCheck, Flag,
  Settings, TrendingUp, Activity
} from 'lucide-react';

export default function OwnerDashboard() {
  const { items, members, expenses, tripConfig, theme } = useApp();
  const navigate = useNavigate();
  const [heroImg, setHeroImg] = useState('');
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    setHeroImg(`https://source.unsplash.com/featured/1200x600?${encodeURIComponent(tripConfig.destination)}&t=${Date.now()}`);
    const timer = setInterval(() => setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, [tripConfig.destination]);

  const spent = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const packedPct = items.length ? Math.round((items.filter(i => i.status === 'packed').length / items.length) * 100) : 0;
  const daysRemaining = Math.ceil((new Date(tripConfig.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  const budget = tripConfig.budget || 50000;
  const spentPct = Math.min(100, Math.round((spent / budget) * 100));

  // Trip duration
  const tripDays = tripConfig.endDate
    ? Math.max(1, Math.ceil((new Date(tripConfig.endDate) - new Date(tripConfig.startDate)) / 86400000))
    : null;

  const startFmt = tripConfig.startDate
    ? new Date(tripConfig.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '—';
  const endFmt = tripConfig.endDate
    ? new Date(tripConfig.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="od-container">
      {/* ── MISSION HERO ── */}
      <motion.header className="od-hero glass" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroImg})` }}
      >
        <div className="od-hero-inner">
          <div className="od-hero-meta">
            <div className="od-badge-live">
              <span className="live-pulse" />
              {daysRemaining > 0 ? `DEPLOYMENT IN ${daysRemaining} DAYS` : 'MISSION LIVE'}
            </div>
            <div className="od-hero-time"><Clock size={14} /> {localTime}</div>
          </div>
          <div className="od-hero-title-group">
            <h1 className="od-hero-dest">{tripConfig.destination || 'Global Ops'}</h1>
            <p className="od-hero-subtitle">{tripConfig.tripName || 'Untitled Mission'}</p>
          </div>
          <div className="od-hero-footer">
            <div className="od-hero-stat">
              <Calendar size={14} />
              <span>{startFmt} — {endFmt}</span>
            </div>
            <div className="od-hero-stat">
              <Users size={14} />
              <span>{tripConfig.totalMembers || members.length} Operators</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="od-bento">
        {/* Readiness Core */}
        <motion.div className="bento-card glass od-readiness"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-head">
            <h3>MISSION READINESS</h3>
            <span className="readiness-pct">{packedPct}%</span>
          </div>
          <div className="readiness-body">
            <div className="readiness-ring-box">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="ring-track" />
                <circle cx="50" cy="50" r="45" className="ring-fill" 
                  strokeDasharray={`${packedPct * 2.82} 282`} 
                  strokeDashoffset="0" 
                />
              </svg>
              <div className="ring-content">
                <strong>{packedPct}<span>%</span></strong>
                <p>READY</p>
              </div>
            </div>
            <div className="readiness-metrics">
              <div className="metric-row">
                <span>Gear Packed</span>
                <strong>{items.filter(i => i.status === 'packed').length} / {items.length}</strong>
              </div>
              <div className="metric-row">
                <span>Team Assigned</span>
                <strong>{members.length}</strong>
              </div>
              <div className="metric-row">
                <span>Budget Status</span>
                <strong className={spentPct > 90 ? 'text-danger' : 'text-success'}>
                  {spentPct > 90 ? 'Critical' : 'Stable'}
                </strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Financial Overview */}
        <motion.div className="bento-card glass od-finance"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="card-head">
            <h3>FINANCIAL OPS</h3>
            <button className="icon-btn" onClick={() => navigate('/owner/expenses')}><TrendingUp size={16}/></button>
          </div>
          <div className="finance-body">
            <div className="main-expense">
              <span className="fin-label">TOTAL EXPENDED</span>
              <h2 className="fin-value">₹{spent.toLocaleString()}</h2>
            </div>
            <div className="fin-progress-section">
              <div className="fin-bar">
                <motion.div className="fin-fill" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${spentPct}%` }}
                  style={{ background: spentPct > 85 ? 'hsl(var(--danger))' : 'hsl(var(--p))' }}
                />
              </div>
              <div className="fin-details">
                <span>{spentPct}% of ₹{budget.toLocaleString()}</span>
                <strong>₹{(budget - spent).toLocaleString()} Left</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="bento-card glass od-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-head"><h3>STRATEGIC ACTIONS</h3></div>
          <div className="action-grid">
            <button onClick={() => navigate('/owner/trip-setup')} className="action-btn">
              <Settings size={18} />
              <span>Modify Mission</span>
            </button>
            <button onClick={() => navigate('/owner/mission-brief')} className="action-btn">
              <Target size={18} />
              <span>Briefing</span>
            </button>
            <button onClick={() => navigate('/owner/itinerary')} className="action-btn">
              <Compass size={18} />
              <span>Navigation</span>
            </button>
            <button onClick={() => navigate('/owner/expenses')} className="action-btn highlight">
              <IndianRupee size={18} />
              <span>Audit Funds</span>
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .od-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        
        /* Hero */
        .od-hero {
          height: 320px;
          border-radius: 24px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid hsla(var(--border), 0.3);
        }
        .od-hero-inner { position: relative; z-index: 2; width: 100%; color: #fff; }
        .od-hero-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .od-badge-live { 
          display: flex; align-items: center; gap: 10px; 
          background: hsla(0, 0%, 0%, 0.5); 
          backdrop-filter: blur(8px);
          padding: 6px 16px; 
          border-radius: 100px; 
          font-size: 0.65rem; 
          font-weight: 800; 
          letter-spacing: 0.1em;
          border: 1px solid hsla(255, 100%, 100%, 0.1);
        }
        .live-pulse { width: 8px; height: 8px; background: #ff4757; border-radius: 50%; box-shadow: 0 0 10px #ff4757; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        
        .od-hero-time { font-size: 0.85rem; font-weight: 600; opacity: 0.8; display: flex; align-items: center; gap: 6px; }
        
        .od-hero-dest { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.04em; margin: 0; line-height: 1; text-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .od-hero-subtitle { font-size: 1rem; font-weight: 600; opacity: 0.9; margin: 0.5rem 0 1.5rem; letter-spacing: 0.02em; }
        
        .od-hero-footer { display: flex; gap: 2rem; border-top: 1px solid hsla(255, 100%, 100%, 0.15); padding-top: 1.5rem; }
        .od-hero-stat { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; opacity: 0.85; }

        /* Bento */
        .od-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.5rem; }
        .bento-card { padding: 1.75rem; border-radius: 20px; display: flex; flex-direction: column; }
        
        .od-readiness { grid-column: span 3; }
        .od-finance { grid-column: span 3; }
        .od-actions { grid-column: span 6; }

        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .card-head h3 { font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; margin: 0; }
        .readiness-pct { font-size: 0.75rem; font-weight: 700; color: hsl(var(--p)); background: hsla(var(--p)/.1); padding: 4px 10px; border-radius: 6px; }

        .readiness-body { display: flex; align-items: center; gap: 2.5rem; }
        .readiness-ring-box { position: relative; width: 120px; height: 120px; }
        .readiness-ring-box svg { transform: rotate(-90deg); }
        .ring-track { fill: none; stroke: hsla(var(--text)/.05); stroke-width: 8; }
        .ring-fill { fill: none; stroke: hsl(var(--p)); stroke-width: 8; stroke-linecap: round; transition: 1s ease; }
        
        .ring-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-content strong { font-size: 1.75rem; font-weight: 900; line-height: 1; }
        .ring-content strong span { font-size: 0.85rem; opacity: 0.5; }
        .ring-content p { font-size: 0.55rem; font-weight: 800; letter-spacing: 0.1em; margin: 2px 0 0; color: hsl(var(--text-muted)); }

        .readiness-metrics { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .metric-row { display: flex; justify-content: space-between; border-bottom: 1px solid hsla(var(--border), 0.5); padding-bottom: 0.5rem; }
        .metric-row span { font-size: 0.8rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .metric-row strong { font-size: 0.85rem; font-weight: 700; }

        /* Finance */
        .finance-body { display: flex; flex-direction: column; gap: 2rem; justify-content: center; height: 100%; }
        .fin-label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; }
        .fin-value { font-size: 2.5rem; font-weight: 900; margin: 0.5rem 0; letter-spacing: -0.02em; }
        
        .fin-bar { height: 10px; background: hsla(var(--text)/.05); border-radius: 100px; overflow: hidden; margin-bottom: 0.75rem; }
        .fin-fill { height: 100%; border-radius: 100px; }
        .fin-details { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .fin-details strong { color: hsl(var(--text)); }

        /* Actions */
        .action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .action-btn { 
          display: flex; flex-direction: column; align-items: center; gap: 12px; 
          padding: 1.5rem; border-radius: 16px; border: 1px solid hsla(var(--border), 0.5);
          background: hsla(var(--bg), 0.3); color: hsl(var(--text-muted));
          cursor: pointer; transition: 0.2s;
        }
        .action-btn:hover { background: hsla(var(--p)/.05); border-color: hsl(var(--p)); color: hsl(var(--p)); transform: translateY(-2px); }
        .action-btn.highlight { background: hsla(var(--p)/.1); border-color: hsla(var(--p)/.3); color: hsl(var(--p)); }
        .action-btn span { font-size: 0.75rem; font-weight: 700; }

        @media (max-width: 900px) {
          .od-bento { grid-template-columns: 1fr; }
          .od-readiness, .od-finance { grid-column: span 6; }
          .action-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .action-grid { grid-template-columns: 1fr; }
          .od-hero-dest { font-size: 2.25rem; }
          .od-hero-meta { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .readiness-body { flex-direction: column; gap: 1.5rem; }
          .od-hero { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
