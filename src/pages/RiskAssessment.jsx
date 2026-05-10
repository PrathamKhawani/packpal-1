import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Wind, CheckCircle2, Navigation, Activity, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function RiskAssessment() {
  const { tripConfig } = useApp();

  const risks = [
    { id: 1, title: 'Weather Volatility', status: 'Elevated', desc: 'Forecast indicates high winds and heavy rain in 48h.', icon: <Wind size={16} />, color: 'warning', pct: 60 },
    { id: 2, title: 'Resource Readiness', status: 'Optimal', desc: 'Critical gear and documents verified for deployment.', icon: <CheckCircle2 size={16} />, color: 'success', pct: 95 },
    { id: 3, title: 'Terrain Difficulty', status: 'Moderate', desc: 'Mission path includes remote regions with limited signal.', icon: <Navigation size={16} />, color: 'p', pct: 45 },
    { id: 4, title: 'Budget Threshold', status: 'Critical', desc: 'Current expenditure is at 92% of mission budget.', icon: <ShieldAlert size={16} />, color: 'danger', pct: 92 },
  ];

  const colorMap = {
    warning: { bg: 'hsla(var(--warning)/0.1)', text: 'hsl(var(--warning))', bar: 'hsl(var(--warning))' },
    success: { bg: 'hsla(var(--success)/0.1)', text: 'hsl(var(--success))', bar: 'hsl(var(--success))' },
    p:       { bg: 'hsla(var(--p)/0.1)',       text: 'hsl(var(--p))',       bar: 'hsl(var(--p))' },
    danger:  { bg: 'hsla(var(--danger)/0.1)',   text: 'hsl(var(--danger))', bar: 'hsl(var(--danger))' },
  };

  return (
    <div className="risk-container">
      {/* Page Header */}
      <header className="risk-page-header">
        <div>
          <div className="risk-tag"><Zap size={11} /> RISK_ASSESSMENT_V2</div>
          <h1 className="risk-title">Tactical <span style={{ color: 'hsl(var(--p))' }}>Risk Analysis</span></h1>
          <p className="risk-sub">Operational evaluation for <strong>{tripConfig.destination}</strong> deployment.</p>
        </div>
        <div className="score-box">
          <div className="score-circle">
            <svg viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--p))" strokeWidth="3" strokeDasharray="84, 100" strokeLinecap="round" />
            </svg>
            <div className="score-label">
              <strong>84%</strong>
              <span>READY</span>
            </div>
          </div>
        </div>
      </header>

      {/* Risk Cards */}
      <div className="risk-grid">
        {risks.map((risk, idx) => (
          <motion.div
            key={risk.id}
            className="risk-card"
            style={{ '--card-accent': colorMap[risk.color].text }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            <div className="risk-card-top">
              <div className="risk-icon" style={{ background: colorMap[risk.color].bg, color: colorMap[risk.color].text }}>
                {risk.icon}
              </div>
              <div className="risk-card-info">
                <div className="risk-card-header">
                  <h3>{risk.title}</h3>
                  <span className="risk-status-badge" style={{ background: colorMap[risk.color].bg, color: colorMap[risk.color].text }}>
                    {risk.status}
                  </span>
                </div>
                <p>{risk.desc}</p>
              </div>
            </div>
            <div className="risk-card-bar">
              <div className="risk-bar-bg">
                <div className="risk-bar-fill" style={{ width: `${risk.pct}%`, background: colorMap[risk.color].bar }} />
              </div>
              <span className="risk-pct" style={{ color: colorMap[risk.color].text }}>{risk.pct}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mitigation Panel */}
      <div className="mitigation-panel">
        <div className="mit-header">
          <div className="mit-icon"><Activity size={16} /></div>
          <div>
            <h3>Mitigation Protocols</h3>
            <span>Recommended actions for identified risks</span>
          </div>
          <div className="mit-badge">3 Active</div>
        </div>
        <div className="mit-list">
          {[
            { icon: <TrendingUp size={14} />, text: 'Enable satellite backup for high-altitude zones.', tag: 'TERRAIN' },
            { icon: <AlertTriangle size={14} />, text: 'Reallocate 15% budget from leisure to emergency logistics.', tag: 'BUDGET' },
            { icon: <Wind size={14} />, text: 'Daily weather sync mandated for all team members.', tag: 'WEATHER' },
          ].map((item, i) => (
            <div key={i} className="mit-item">
              <div className="mit-item-icon">{item.icon}</div>
              <span className="mit-item-text">{item.text}</span>
              <span className="mit-item-tag">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .risk-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1000px; margin: 0 auto; }

        .risk-page-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem; background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
        .risk-tag { font-size: 0.6rem; font-weight: 700; background: hsla(var(--p)/0.1); color: hsl(var(--p)); padding: 3px 10px; border-radius: 100px; display: inline-flex; align-items: center; gap: 5px; margin-bottom: 0.5rem; }
        .risk-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 0.25rem; color: hsl(var(--text)); }
        .risk-sub { font-size: 0.875rem; color: hsl(var(--text-muted)); margin: 0; }
        
        .score-box { flex-shrink: 0; }
        .score-circle { position: relative; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; }
        .score-circle svg { position: absolute; inset: 0; transform: rotate(-90deg); }
        .score-label { display: flex; flex-direction: column; align-items: center; }
        .score-label strong { font-size: 1.35rem; font-weight: 800; color: hsl(var(--text)); line-height: 1; }
        .score-label span { font-size: 0.5rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.07em; }

        .risk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .risk-card { background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: var(--shadow-sm); transition: 0.2s; border-left: 3px solid var(--card-accent, hsl(var(--border))); }
        .risk-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
        .risk-card-top { display: flex; gap: 0.875rem; align-items: flex-start; }
        .risk-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .risk-card-info { flex: 1; min-width: 0; }
        .risk-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; gap: 0.5rem; }
        .risk-card-header h3 { font-size: 0.9rem; font-weight: 700; color: hsl(var(--text)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .risk-status-badge { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 100px; flex-shrink: 0; }
        .risk-card-info p { font-size: 0.78rem; color: hsl(var(--text-muted)); line-height: 1.45; margin: 0; }
        .risk-card-bar { display: flex; align-items: center; gap: 0.75rem; }
        .risk-bar-bg { flex: 1; height: 5px; background: hsl(var(--bg)); border-radius: 10px; overflow: hidden; }
        .risk-bar-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
        .risk-pct { font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }

        .mitigation-panel { background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--shadow-sm); }
        .mit-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid hsl(var(--border)); }
        .mit-icon { width: 34px; height: 34px; border-radius: var(--radius-sm); background: hsla(var(--p)/0.1); color: hsl(var(--p)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mit-header div h3 { font-size: 0.9rem; font-weight: 700; color: hsl(var(--text)); margin: 0 0 1px; }
        .mit-header div span { font-size: 0.75rem; color: hsl(var(--text-muted)); }
        .mit-badge { margin-left: auto; font-size: 0.65rem; font-weight: 700; background: hsla(var(--p)/0.1); color: hsl(var(--p)); padding: 3px 10px; border-radius: 100px; flex-shrink: 0; }
        .mit-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .mit-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: hsl(var(--bg)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); }
        .mit-item-icon { color: hsl(var(--p)); flex-shrink: 0; }
        .mit-item-text { font-size: 0.825rem; font-weight: 500; color: hsl(var(--text)); flex: 1; }
        .mit-item-tag { font-size: 0.58rem; font-weight: 700; color: hsl(var(--text-muted)); background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }

        @media (max-width: 768px) { .risk-grid { grid-template-columns: 1fr; } .risk-page-header { flex-direction: column; gap: 1rem; } }
      `}</style>
    </div>
  );
}
