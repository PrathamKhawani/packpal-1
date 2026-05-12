import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';
import { 
  Users, Globe, Database, ShieldCheck, 
  TrendingUp as Growth, Activity, Zap, 
  BarChart3, PieChart, Lock, AlertTriangle,
  Server, Cpu, Network
} from 'lucide-react';

export default function AdminDashboard() {
  const { members, activityLog } = useApp();
  const [uptime, setUptime] = useState(99.99);

  return (
    <div className="admin-container">
      <header className="admin-hero glass">
        <div className="hero-left">
          <div className="hero-badge">SYSTEM STATUS: OPERATIONAL</div>
          <h1>Command Center</h1>
          <p>Global Platform Governance & Strategic Intelligence</p>
        </div>
        <div className="hero-stats">
          <div className="h-stat">
            <span>NETWORK LATENCY</span>
            <strong>12ms</strong>
          </div>
          <div className="h-stat">
            <span>UPTIME</span>
            <strong>{uptime}%</strong>
          </div>
        </div>
      </header>

      <div className="admin-bento">
        {/* Platform Metrics */}
        <motion.div className="bento-card glass metrics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-head">
            <div className="head-label">
              <ShieldCheck size={18} className="text-p" />
              <h3>PLATFORM INTELLIGENCE</h3>
            </div>
            <span className="live-tag">LIVE SYNC</span>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-item">
              <Users className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">TOTAL OPERATORS</span>
                <strong className="metric-value">{members.length}</strong>
                <span className="metric-trend"><Growth size={12} /> +4% this week</span>
              </div>
            </div>
            <div className="metric-item">
              <Globe className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">ACTIVE MISSIONS</span>
                <strong className="metric-value">1,284</strong>
                <span className="metric-trend"><Growth size={12} /> +12% this week</span>
              </div>
            </div>
            <div className="metric-item">
              <Database className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">STORAGE UTILIZATION</span>
                <strong className="metric-value">64.2%</strong>
                <div className="mini-bar"><div className="mini-fill" style={{ width: '64.2%' }} /></div>
              </div>
            </div>
            <div className="metric-item">
              <Zap className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">API THROUGHPUT</span>
                <strong className="metric-value">245/s</strong>
                <span className="metric-trend">Peak performance</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Activity Map */}
        <motion.div className="bento-card glass map-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="card-head"><h3>GLOBAL ACTIVITY STREAM</h3></div>
          <div className="map-viz">
            <div className="map-grid-overlay" />
            <div className="pulse-point" style={{ top: '30%', left: '20%' }} />
            <div className="pulse-point" style={{ top: '55%', left: '75%' }} />
            <div className="pulse-point" style={{ top: '40%', left: '45%' }} />
            <div className="pulse-point" style={{ top: '70%', left: '30%' }} />
          </div>
        </motion.div>

        {/* System Logs */}
        <motion.div className="bento-card glass logs-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-head"><h3>SECURITY LOGS</h3></div>
          <div className="logs-stream">
            {activityLog.slice(0, 5).map(log => (
              <div key={log.id} className="log-line">
                <div className="log-bullet" style={{ background: log.color }} />
                <div className="log-body">
                  <span className="log-text">{log.text}</span>
                  <span className="log-time">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .admin-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        
        /* Hero */
        .admin-hero {
          padding: 3rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center;
          background: linear-gradient(135deg, hsla(var(--p)/.1) 0%, transparent 50%);
        }
        .hero-left h1 { font-size: 2.5rem; font-weight: 900; margin: 0.5rem 0; letter-spacing: -0.03em; }
        .hero-left p { font-size: 1rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .hero-badge { font-size: 0.6rem; font-weight: 800; color: hsl(var(--p)); background: hsla(var(--p)/.1); padding: 4px 12px; border-radius: 100px; border: 1px solid hsla(var(--p)/.2); }
        
        .hero-stats { display: flex; gap: 3rem; }
        .h-stat { display: flex; flex-direction: column; gap: 4px; }
        .h-stat span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .h-stat strong { font-size: 1.5rem; font-weight: 800; }

        /* Bento */
        .admin-bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.5rem; }
        .bento-card { padding: 1.75rem; border-radius: 20px; }
        
        .metrics-card { grid-column: span 6; }
        .map-card { grid-column: span 4; min-height: 300px; }
        .logs-card { grid-column: span 2; }

        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid hsla(var(--border), 0.5); padding-bottom: 1rem; }
        .card-head h3 { font-size: 0.8rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; margin: 0; }
        .head-label { display: flex; align-items: center; gap: 10px; }
        .live-tag { font-size: 0.6rem; font-weight: 800; color: hsl(var(--success)); background: hsla(var(--success)/.1); padding: 4px 10px; border-radius: 6px; }

        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .metric-item { background: hsla(var(--bg), 0.5); border: 1px solid hsla(var(--border), 0.5); padding: 1.5rem; border-radius: 16px; display: flex; flex-direction: column; gap: 1rem; }
        .metric-icon { width: 36px; height: 36px; background: hsla(var(--p)/.1); color: hsl(var(--p)); padding: 8px; border-radius: 10px; }
        .metric-label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .metric-value { font-size: 1.5rem; font-weight: 900; }
        .metric-trend { font-size: 0.7rem; font-weight: 600; color: hsl(var(--success)); display: flex; align-items: center; gap: 4px; }

        .mini-bar { height: 4px; background: hsla(var(--text)/.05); border-radius: 100px; overflow: hidden; margin-top: 4px; }
        .mini-fill { height: 100%; background: hsl(var(--p)); border-radius: 100px; }

        /* Map Viz */
        .map-viz { height: 100%; background: hsla(var(--bg), 0.5); border-radius: 16px; border: 1px solid hsla(var(--border), 0.5); position: relative; overflow: hidden; }
        .map-grid-overlay { position: absolute; inset: 0; background-image: radial-gradient(hsla(var(--border), 0.5) 1px, transparent 1px); background-size: 24px 24px; }
        .pulse-point { position: absolute; width: 8px; height: 8px; background: hsl(var(--p)); border-radius: 50%; box-shadow: 0 0 15px hsl(var(--p)); animation: map-pulse 2s infinite; }
        @keyframes map-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(2.5); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }

        /* Logs */
        .logs-stream { display: flex; flex-direction: column; gap: 0.75rem; }
        .log-line { display: flex; gap: 12px; align-items: center; padding: 0.75rem; background: hsla(var(--bg), 0.5); border-radius: 10px; border: 1px solid hsla(var(--border), 0.3); }
        .log-bullet { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .log-body { flex: 1; display: flex; justify-content: space-between; align-items: center; }
        .log-text { font-size: 0.75rem; font-weight: 600; color: hsl(var(--text)); }
        .log-time { font-size: 0.65rem; font-weight: 700; color: hsl(var(--text-muted)); }

        @media (max-width: 900px) {
          .admin-hero { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .map-card, .logs-card { grid-column: span 6; }
        }
        @media (max-width: 600px) {
          .metrics-grid { grid-template-columns: 1fr; }
          .hero-body h1 { font-size: 2.25rem; }
          .admin-hero { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );

}

function HealthItem({ icon, label, status, color }) {
    return (
        <div className="health-item">
            <div className={`admin-icon ${color !== 'p' ? color : ''}`} style={{ width: '36px', height: '36px' }}>{icon}</div>
            <span>{label}</span>
            <div className={`health-status text-${color}`}>{status}</div>
        </div>
    );
}
