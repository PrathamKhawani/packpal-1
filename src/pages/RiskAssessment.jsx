import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Wind, CloudRain, AlertTriangle, CheckCircle2, Navigation, Activity, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function RiskAssessment() {
  const { tripConfig } = useApp();

  const risks = [
    { id: 1, title: 'Weather Volatility', status: 'Elevated', desc: 'Forecast indicates high winds and heavy rain in 48h.', icon: <Wind size={18} />, color: 'warning' },
    { id: 2, title: 'Resource Readiness', status: 'Optimal', desc: 'Critical gear and documents verified for deployment.', icon: <CheckCircle2 size={18} />, color: 'success' },
    { id: 3, title: 'Terrain Difficulty', status: 'Moderate', desc: 'Mission path includes remote regions with limited signal.', icon: <Navigation size={18} />, color: 'p' },
    { id: 4, title: 'Budget Threshold', status: 'Critical', desc: 'Current expenditure is at 92% of mission budget.', icon: <ShieldAlert size={18} />, color: 'danger' },
  ];

  return (
    <div className="risk-container owner-theme">
      <header className="risk-header glass">
        <div className="header-info">
            <div className="tactical-badge"><Zap size={12} /> RISK_ASSESSMENT_V2</div>
            <h2>Tactical Risk Analysis</h2>
            <p>Operational evaluation for {tripConfig.destination} deployment.</p>
        </div>
        <div className="risk-score glass">
            <span>READY SCORE</span>
            <strong>84%</strong>
        </div>
      </header>

      <div className="risk-grid">
        {risks.map((risk, idx) => (
          <motion.div 
            key={risk.id}
            className={`risk-card glass border-${risk.color}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`risk-icon-box bg-${risk.color}`}>
                {risk.icon}
            </div>
            <div className="risk-content">
                <div className="risk-top">
                    <h3>{risk.title}</h3>
                    <span className={`risk-status text-${risk.color}`}>{risk.status}</span>
                </div>
                <p>{risk.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mitigation-panel glass">
          <div className="m-head"><Activity size={16} /> <h3>MITIGATION PROTOCOLS</h3></div>
          <ul className="m-list">
              <li>Enable satellite backup for high-altitude zones.</li>
              <li>Reallocate 15% budget from leisure to emergency logistics.</li>
              <li>Daily weather sync mandated for all team members.</li>
          </ul>
      </div>

      <style>{`
        .risk-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
        .risk-header { padding: 2.5rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; border: 1px solid hsla(var(--p) / 0.2); }
        .tactical-badge { font-size: 0.6rem; font-weight: 900; background: hsl(var(--p)); color: #fff; padding: 4px 10px; border-radius: 4px; display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem; }
        
        .risk-score { padding: 1.5rem; border-radius: 20px; display: flex; flex-direction: column; align-items: center; border: 1px solid hsla(var(--p) / 0.3); background: hsla(var(--p) / 0.05); }
        .risk-score span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--p)); }
        .risk-score strong { font-size: 2rem; font-weight: 900; }

        .risk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .risk-card { padding: 1.5rem; border-radius: 20px; display: flex; gap: 1.25rem; align-items: center; }
        .risk-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .risk-content { flex: 1; }
        .risk-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
        .risk-top h3 { font-size: 1rem; font-weight: 800; }
        .risk-status { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; }
        .risk-content p { font-size: 0.75rem; color: hsl(var(--text-muted)); line-height: 1.4; }

        .mitigation-panel { padding: 1.5rem; border-radius: 20px; border: 1px solid hsla(var(--text) / 0.05); }
        .m-head { display: flex; align-items: center; gap: 0.75rem; color: hsl(var(--p)); margin-bottom: 1rem; }
        .m-head h3 { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.1em; }
        .m-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .m-list li { font-size: 0.85rem; font-weight: 600; padding-left: 1.5rem; position: relative; }
        .m-list li::before { content: '→'; position: absolute; left: 0; color: hsl(var(--p)); font-weight: 900; }

        .bg-success { background: hsl(var(--success)); }
        .bg-warning { background: hsl(var(--warning)); }
        .bg-danger { background: hsl(var(--danger)); }
        .bg-p { background: hsl(var(--p)); }
        
        .border-success { border-color: hsla(var(--success) / 0.2); }
        .border-warning { border-color: hsla(var(--warning) / 0.2); }
        .border-danger { border-color: hsla(var(--danger) / 0.2); }
        .border-p { border-color: hsla(var(--p) / 0.2); }

        @media (max-width: 768px) { .risk-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
