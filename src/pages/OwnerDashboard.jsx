import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';
import { 
  Briefcase, PlaneTakeoff, Navigation, Users, 
  CloudSun, TrendingUp, Clock, Compass, MapPin, 
  IndianRupee, Target, Globe, Edit3, X, Calendar,
  CloudRain, Zap, Sun, ShieldCheck, Flag
} from 'lucide-react';

export default function OwnerDashboard() {
  const { items, members, expenses, tripConfig, setTripConfig, theme, currentUser } = useApp();
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

  return (
    <div className="dash-container owner-theme">
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-card glass">
          <div className="hero-img-box" style={{ backgroundImage: `url(${heroImg})` }}>
            <div className="hero-gradient-overlay" />
            <div className="hero-content">
                <div className="hero-top-row">
                    <span className="hero-badge"><Globe size={10} /> {daysRemaining} DAYS TO DEPARTURE</span>
                    <div className="hero-time"><Clock size={12} /> {localTime} (Local)</div>
                </div>
                <div className="hero-title-area">
                    <h1>{tripConfig.destination}</h1>
                    <div className="mission-tag">MISSION STATUS: PREPARING</div>
                </div>
                <div className="hero-stats-row">
                    <div className="h-stat"><span>PACKING</span><strong>{packedPct}%</strong></div>
                    <div className="h-stat"><span>TEAM SIZE</span><strong>{members.length}</strong></div>
                    <div className="h-stat"><span>EXPENDED</span><strong>₹{(spent/1000).toFixed(1)}K</strong></div>
                </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="dash-bento">
        {/* Mission Briefing */}
        <motion.div 
          className="bento-card glass owner-brief-card" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gridColumn: 'span 4' }}
        >
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Target size={18} className="text-success" />
              <h3>MISSION CONTROL OVERVIEW</h3>
            </div>
            <span className="live-tag success">READY FOR DEPLOYMENT</span>
          </div>
          
          <div className="admin-grid">
            <div className="admin-stat-item">
              <Flag className="admin-icon success" />
              <div className="admin-info">
                <span className="admin-label">OBJECTIVES</span>
                <strong className="admin-value">8 / 12</strong>
                <span className="admin-growth">66% Complete</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <Users className="admin-icon success" />
              <div className="admin-info">
                <span className="admin-label">TEAM READINESS</span>
                <strong className="admin-value">OPTIMAL</strong>
                <span className="admin-growth text-success">All members online</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <ShieldCheck className="admin-icon success" />
              <div className="admin-info">
                <span className="admin-label">SECURITY STATUS</span>
                <strong className="admin-value">VERIFIED</strong>
                <span className="admin-growth text-success">Vault Secured</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <Zap className="admin-icon success" />
              <div className="admin-info">
                <span className="admin-label">EST. DEPLOYMENT</span>
                <strong className="admin-value">T-4 DAYS</strong>
                <span className="admin-growth">On Schedule</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Insight */}
        <motion.div className="bento-card glass" style={{ gridColumn: 'span 2' }}>
            <div className="card-head"><h3>FINANCIAL OPS</h3><span className="b-total">₹{tripConfig.budget.toLocaleString()}</span></div>
            <div className="b-body">
                <div className="b-spent">
                    <h2>₹{spent.toLocaleString()}</h2>
                    <p>Total Expended</p>
                </div>
                <div className="b-progress">
                    <div className="b-track"><motion.div initial={{ width: 0 }} animate={{ width: `${(spent/tripConfig.budget)*100}%` }} className="b-fill success-bg" /></div>
                    <div className="b-markers">
                        <span>{Math.round((spent/tripConfig.budget)*100)}% Used</span>
                        <span>Remaining: ₹{(tripConfig.budget - spent).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Packing Intelligence */}
        <motion.div className="bento-card glass" style={{ gridColumn: 'span 2' }}>
            <div className="card-head"><h3>GEAR READINESS</h3></div>
            <div className="gear-stats">
                <div className="g-item">
                    <div className="g-circle packed">
                        <svg viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsla(var(--success)/0.1)" strokeWidth="3" /><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--success))" strokeWidth="3" strokeDasharray={`${packedPct}, 100`} /></svg>
                        <span>{packedPct}%</span>
                    </div>
                    <div className="g-label">Equipment Packed</div>
                </div>
                <div className="g-checklist">
                    <div className="gc-row"><div className="gc-dot success" /> Tech Gear: 100%</div>
                    <div className="gc-row"><div className="gc-dot warning" /> Medical: 40%</div>
                    <div className="gc-row"><div className="gc-dot success" /> Docs: 100%</div>
                </div>
            </div>
        </motion.div>
      </div>

      <style>{`
        .owner-theme { --p: 142 70% 50%; }
        .hero-section { width: 100%; margin-bottom: 2rem; }
        .hero-card { border-radius: 24px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .hero-img-box { height: 300px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; }
        
        .hero-gradient-overlay { 
            position: absolute; inset: 0; 
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%); 
        }
        
        .hero-content { position: relative; width: 100%; padding: 2.5rem; color: #fff; z-index: 2; }
        .hero-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .hero-badge { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 900; background: hsla(var(--p)/0.2); color: hsl(var(--p-light)); padding: 6px 14px; border-radius: 100px; border: 1px solid hsla(var(--p)/0.4); letter-spacing: 0.15em; box-shadow: 0 0 15px hsla(var(--p)/0.2); }
        .hero-time { font-size: 0.75rem; font-weight: 800; color: hsla(255,255,255,0.7); display: flex; align-items: center; gap: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        
        .hero-title-area { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem; }
        .hero-title-area h1 { font-size: 4rem; font-weight: 900; letter-spacing: -0.05em; margin: 0; text-shadow: 0 0 30px rgba(0,0,0,0.8); line-height: 1; }
        .mission-tag { font-size: 0.8rem; font-weight: 800; color: hsl(var(--p-light)); letter-spacing: 0.15em; }
        
        .hero-stats-row { display: flex; gap: 4rem; border-top: 1px solid hsla(255,255,255,0.1); padding-top: 1.5rem; }
        .h-stat span { font-size: 0.7rem; font-weight: 800; color: hsla(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; }
        .h-stat strong { font-size: 2rem; font-weight: 900; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(255,255,255,0.2); }

        .success-bg { background: hsl(var(--success)) !important; box-shadow: 0 0 15px hsl(var(--success)); }
        
        .b-body { padding: 1.5rem; }
        .b-spent h2 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; color: #fff; margin-bottom: 0.25rem; }
        .b-spent p { font-size: 0.8rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        .b-progress { margin-top: 2rem; }
        .b-track { height: 8px; background: hsla(0,0,0,0.3); border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
        .b-fill { height: 100%; border-radius: 10px; position: relative; }
        .b-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, hsla(255,255,255,0.4), transparent); animation: shimmer 2s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        
        .b-markers { display: flex; justify-content: space-between; margin-top: 0.75rem; font-size: 0.75rem; font-weight: 700; color: hsl(var(--text-muted)); }

        .gear-stats { display: flex; gap: 2rem; align-items: center; padding: 1rem; }
        .g-item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .g-circle { width: 90px; height: 90px; position: relative; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; color: #fff; text-shadow: 0 0 10px hsla(var(--success)/0.5); }
        .g-circle svg { position: absolute; inset: 0; transform: rotate(-90deg); filter: drop-shadow(0 0 5px hsla(var(--success)/0.5)); }
        .g-label { font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .g-checklist { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; background: hsla(0,0,0,0.2); padding: 1rem; border-radius: 12px; border: 1px solid var(--glass-border); }
        .gc-row { font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 10px; color: #fff; }
        .gc-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }
        .gc-dot.success { background: hsl(var(--success)); color: hsl(var(--success)); }
        .gc-dot.warning { background: hsl(var(--warning)); color: hsl(var(--warning)); }
      `}</style>
    </div>
  );
}
