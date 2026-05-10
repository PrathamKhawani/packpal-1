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
    <div className="od-root">

      {/* ── Hero ── */}
      <motion.div className="od-hero" style={{ backgroundImage: `url(${heroImg})` }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="od-hero-overlay" />
        <div className="od-hero-content">
          <div className="od-hero-top">
            <span className="od-hero-badge"><Globe size={10} /> {daysRemaining > 0 ? `${daysRemaining} DAYS TO DEPARTURE` : 'MISSION ACTIVE'}</span>
            <div className="od-hero-time"><Clock size={12} /> {localTime}</div>
          </div>
          {tripConfig.tripName && <div className="od-hero-trip-name">{tripConfig.tripName}</div>}
          <h1 className="od-hero-dest">{tripConfig.destination}</h1>
          {tripDays && <div className="od-hero-dates"><Calendar size={12} /> {startFmt} → {endFmt} · {tripDays} days</div>}
          <div className="od-hero-stats">
            <div className="od-hs"><span>PACKED</span><strong>{packedPct}%</strong></div>
            <div className="od-hs"><span>TEAM</span><strong>{tripConfig.totalMembers || members.length}</strong></div>
            <div className="od-hs"><span>EXPENDED</span><strong>₹{(spent/1000).toFixed(1)}K</strong></div>
            {tripDays && <div className="od-hs"><span>DURATION</span><strong>{tripDays}d</strong></div>}
          </div>
        </div>
      </motion.div>

      {/* ── Mission Control Card ── */}
      <motion.div className="od-mc-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="od-mc-header">
          <div>
            <div className="od-mc-badge"><span className="od-live-dot" />LIVE — MISSION ACTIVE</div>
            <h2 className="od-mc-title">MISSION CONTROL</h2>
          </div>
          <div className="od-mc-header-right">
            <div className="od-readiness-ring">
              <svg viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" className="od-ring-track" />
                <circle cx="36" cy="36" r="28" className="od-ring-fill" strokeDasharray={`${packedPct * 1.76} 176`} strokeDashoffset="44" />
              </svg>
              <div className="od-ring-label"><strong>{packedPct}%</strong><span>PACKED</span></div>
            </div>
            <button className="od-edit-btn" onClick={() => navigate('/owner/trip-setup')}>
              <Settings size={14} /> Edit Mission
            </button>
          </div>
        </div>

        <div className="od-mc-grid">
          <div className="od-mc-stat">
            <div className="od-mcs-icon"><Flag size={16} /></div>
            <div className="od-mcs-body">
              <span className="od-mcs-label">OBJECTIVES</span>
              <strong className="od-mcs-val">8 / 12</strong>
              <div className="od-mcs-bar"><motion.div className="od-mcs-fill" style={{background:'hsl(var(--success))'}} initial={{width:0}} animate={{width:'66%'}} transition={{delay:0.4,duration:0.7}} /></div>
            </div>
          </div>
          <div className="od-mc-stat">
            <div className="od-mcs-icon green"><Users size={16} /></div>
            <div className="od-mcs-body">
              <span className="od-mcs-label">TEAM READINESS</span>
              <strong className="od-mcs-val">OPTIMAL</strong>
              <span className="od-mcs-sub green">All members online</span>
            </div>
          </div>
          <div className="od-mc-stat">
            <div className="od-mcs-icon green"><ShieldCheck size={16} /></div>
            <div className="od-mcs-body">
              <span className="od-mcs-label">SECURITY</span>
              <strong className="od-mcs-val">VERIFIED</strong>
              <span className="od-mcs-sub green">Vault Secured</span>
            </div>
          </div>
          <div className="od-mc-stat">
            <div className="od-mcs-icon"><Zap size={16} /></div>
            <div className="od-mcs-body">
              <span className="od-mcs-label">DEPLOYMENT</span>
              <strong className="od-mcs-val">{daysRemaining > 0 ? `T‑${daysRemaining}d` : 'ACTIVE'}</strong>
              <span className="od-mcs-sub">{daysRemaining > 0 ? 'On Schedule' : 'Mission live'}</span>
            </div>
          </div>
        </div>

        {/* Date + Budget row */}
        <div className="od-mc-footer-row">
          <div className="od-mcf-item">
            <Calendar size={13} />
            <span className="od-mcf-label">TRIP WINDOW</span>
            <strong>{startFmt} → {endFmt}{tripDays ? ` (${tripDays} days)` : ''}</strong>
          </div>
          <div className="od-mcf-divider" />
          <div className="od-mcf-item">
            <IndianRupee size={13} />
            <span className="od-mcf-label">BUDGET</span>
            <strong>₹{budget.toLocaleString()}</strong>
          </div>
          <div className="od-mcf-divider" />
          <div className="od-mcf-budget-bar">
            <span className="od-mcf-label">BURN RATE</span>
            <div className="od-burn-track">
              <motion.div className="od-burn-fill" style={{ background: spentPct > 80 ? 'hsl(var(--danger))' : 'hsl(var(--success))' }}
                initial={{ width: 0 }} animate={{ width: `${spentPct}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
            </div>
            <span className="od-burn-pct" style={{ color: spentPct > 80 ? 'hsl(var(--danger))' : 'hsl(var(--success))' }}>{spentPct}% used</span>
          </div>
        </div>
      </motion.div>

      {/* ── Lower Cards ── */}
      <div className="od-lower-grid">
        {/* Financial */}
        <motion.div className="od-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="od-card-head"><h3>FINANCIAL OPS</h3><span className="od-badge">₹{budget.toLocaleString()}</span></div>
          <div className="od-fin-body">
            <div>
              <h2 className="od-fin-spent">₹{spent.toLocaleString()}</h2>
              <p className="od-fin-label">Total Expended</p>
            </div>
            <div className="od-fin-progress">
              <div className="od-fin-track">
                <motion.div className="od-fin-fill" initial={{ width: 0 }} animate={{ width: `${spentPct}%` }} transition={{ delay: 0.6, duration: 0.8 }} />
              </div>
              <div className="od-fin-markers">
                <span>{spentPct}% used</span>
                <span>₹{(budget - spent).toLocaleString()} left</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gear Readiness */}
        <motion.div className="od-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="od-card-head"><h3>GEAR READINESS</h3></div>
          <div className="od-gear-body">
            <div className="od-gear-ring">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsla(var(--success)/.12)" strokeWidth="5" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--success))" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${packedPct * 2.01} 201`} strokeDashoffset="50" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
              </svg>
              <div className="od-gr-label"><strong>{packedPct}%</strong><span>Packed</span></div>
            </div>
            <div className="od-gear-list">
              <div className="od-gl-row"><div className="od-gl-dot green" />Tech Gear: 100%</div>
              <div className="od-gl-row"><div className="od-gl-dot warning" />Medical: 40%</div>
              <div className="od-gl-row"><div className="od-gl-dot green" />Documents: 100%</div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .od-root { display: flex; flex-direction: column; gap: 1.25rem; max-width: 1100px; margin: 0 auto; }

        /* Hero */
        .od-hero { border-radius: 18px; overflow: hidden; background-size: cover; background-position: center; position: relative; min-height: 240px; display: flex; align-items: flex-end; border: 1px solid hsl(var(--border)); }
        .od-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, hsl(var(--bg-card)) 0%, hsla(var(--bg-card),.55) 50%, hsla(var(--bg-card),.1) 100%); }
        .od-hero-content { position: relative; z-index: 2; width: 100%; padding: 1.75rem 2rem; }
        .od-hero-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .od-hero-badge { font-size: 0.6rem; font-weight: 800; display: flex; align-items: center; gap: 6px; background: hsla(var(--p)/.1); color: hsl(var(--p)); padding: 4px 12px; border-radius: 100px; border: 1px solid hsla(var(--p)/.2); }
        .od-hero-time { font-size: 0.72rem; font-weight: 600; color: hsl(var(--text-muted)); display: flex; align-items: center; gap: 6px; }
        .od-hero-dest { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 0.4rem; color: hsl(var(--text)); line-height: 1; }
        .od-hero-trip-name { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: hsl(var(--p)); margin-bottom: 0.3rem; }
        .od-hero-dates { font-size: 0.78rem; font-weight: 700; color: hsl(var(--text-muted)); display: flex; align-items: center; gap: 7px; margin-bottom: 1.25rem; }
        .od-hero-stats { display: flex; gap: 3rem; border-top: 1px solid hsl(var(--border)); padding-top: 1.25rem; }
        .od-hs { display: flex; flex-direction: column; }
        .od-hs span { font-size: 0.6rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px; }
        .od-hs strong { font-size: 1.5rem; font-weight: 800; color: hsl(var(--text)); }

        /* Mission Control Card */
        .od-mc-card { background: linear-gradient(135deg, hsla(var(--success)/.06) 0%, hsl(var(--bg-card)) 65%); border: 1px solid hsla(var(--success)/.25); border-radius: 16px; padding: 1.75rem; box-shadow: var(--shadow-card); }
        .od-mc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .od-mc-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.58rem; font-weight: 800; color: hsl(var(--success)); background: hsla(var(--success)/.1); border: 1px solid hsla(var(--success)/.2); padding: 4px 12px; border-radius: 100px; letter-spacing: 0.07em; margin-bottom: 0.4rem; }
        .od-live-dot { width: 6px; height: 6px; border-radius: 50%; background: hsl(var(--success)); animation: od-pulse 1.4s infinite; }
        @keyframes od-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .od-mc-title { font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; margin: 0; }
        .od-mc-header-right { display: flex; align-items: center; gap: 1.25rem; }

        /* Readiness ring */
        .od-readiness-ring { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
        .od-readiness-ring svg { width: 72px; height: 72px; transform: rotate(-90deg); }
        .od-ring-track { fill: none; stroke: hsl(var(--border)); stroke-width: 5; }
        .od-ring-fill { fill: none; stroke: hsl(var(--success)); stroke-width: 5; stroke-linecap: round; }
        .od-ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .od-ring-label strong { font-size: 1rem; font-weight: 800; color: hsl(var(--text)); line-height: 1; }
        .od-ring-label span { font-size: 0.4rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.08em; }

        .od-edit-btn { display: flex; align-items: center; gap: 6px; padding: 0.55rem 1rem; border: 1px solid hsl(var(--border)); border-radius: 8px; background: hsl(var(--bg-card)); color: hsl(var(--text-muted)); font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.15s; white-space: nowrap; }
        .od-edit-btn:hover { border-color: hsl(var(--p)); color: hsl(var(--p)); background: hsla(var(--p)/.05); }

        /* MC stat grid */
        .od-mc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.875rem; margin-bottom: 1.25rem; }
        .od-mc-stat { display: flex; gap: 0.75rem; align-items: flex-start; padding: 1rem; background: hsl(var(--bg)); border: 1px solid hsl(var(--border)); border-radius: 12px; transition: 0.2s; }
        .od-mc-stat:hover { border-color: hsl(var(--text-muted)); transform: translateY(-1px); }
        .od-mcs-icon { width: 34px; height: 34px; border-radius: 8px; background: hsla(var(--success)/.1); color: hsl(var(--success)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .od-mcs-icon.green { background: hsla(var(--success)/.1); color: hsl(var(--success)); }
        .od-mcs-body { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .od-mcs-label { font-size: 0.55rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.08em; }
        .od-mcs-val { font-size: 1.05rem; font-weight: 800; color: hsl(var(--text)); line-height: 1.1; }
        .od-mcs-sub { font-size: 0.62rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .od-mcs-sub.green { color: hsl(var(--success)); }
        .od-mcs-bar { height: 3px; background: hsl(var(--border)); border-radius: 10px; overflow: hidden; margin-top: 5px; }
        .od-mcs-fill { height: 100%; border-radius: 10px; }

        /* Footer row */
        .od-mc-footer-row { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 1.25rem 0; border-top: 1px solid hsl(var(--border)); flex-wrap: wrap; }
        .od-mcf-item { display: flex; align-items: center; gap: 8px; color: hsl(var(--text-muted)); }
        .od-mcf-label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: hsl(var(--text-muted)); }
        .od-mcf-item strong { font-size: 0.82rem; font-weight: 700; color: hsl(var(--text)); }
        .od-mcf-divider { width: 1px; height: 28px; background: hsl(var(--border)); flex-shrink: 0; }
        .od-mcf-budget-bar { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 140px; }
        .od-burn-track { height: 4px; background: hsl(var(--border)); border-radius: 10px; overflow: hidden; }
        .od-burn-fill { height: 100%; border-radius: 10px; }
        .od-burn-pct { font-size: 0.65rem; font-weight: 800; }

        /* Lower grid */
        .od-lower-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .od-card { background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); border-radius: 14px; padding: 1.25rem; box-shadow: var(--shadow-sm); }
        .od-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .od-card-head h3 { font-size: 0.62rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }
        .od-badge { font-size: 0.72rem; font-weight: 700; color: hsl(var(--text-muted)); background: hsl(var(--bg)); padding: 3px 10px; border-radius: 100px; border: 1px solid hsl(var(--border)); }

        /* Financial */
        .od-fin-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .od-fin-spent { font-size: 2rem; font-weight: 800; color: hsl(var(--text)); line-height: 1; margin: 0; }
        .od-fin-label { font-size: 0.72rem; font-weight: 600; color: hsl(var(--text-muted)); text-transform: uppercase; margin: 0; }
        .od-fin-track { height: 7px; background: hsl(var(--bg)); border-radius: 10px; overflow: hidden; }
        .od-fin-fill { height: 100%; border-radius: 10px; background: hsl(var(--success)); }
        .od-fin-markers { display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 600; color: hsl(var(--text-muted)); margin-top: 0.4rem; }

        /* Gear */
        .od-gear-body { display: flex; gap: 1.5rem; align-items: center; }
        .od-gear-ring { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
        .od-gear-ring svg { width: 80px; height: 80px; }
        .od-gr-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .od-gr-label strong { font-size: 1.1rem; font-weight: 800; color: hsl(var(--text)); line-height: 1; }
        .od-gr-label span { font-size: 0.52rem; font-weight: 700; color: hsl(var(--text-muted)); }
        .od-gear-list { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; background: hsl(var(--bg)); padding: 0.875rem; border-radius: 10px; border: 1px solid hsl(var(--border)); }
        .od-gl-row { font-size: 0.8rem; font-weight: 600; color: hsl(var(--text)); display: flex; align-items: center; gap: 8px; }
        .od-gl-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .od-gl-dot.green { background: hsl(var(--success)); }
        .od-gl-dot.warning { background: hsl(var(--warning)); }

        @media(max-width: 900px) { .od-mc-grid { grid-template-columns: repeat(2, 1fr); } .od-lower-grid { grid-template-columns: 1fr; } }
        @media(max-width: 600px) { .od-mc-grid { grid-template-columns: 1fr 1fr; } .od-hero-stats { gap: 1.5rem; flex-wrap: wrap; } .od-mc-footer-row { gap: 1rem; } }
      `}</style>
    </div>
  );
}
