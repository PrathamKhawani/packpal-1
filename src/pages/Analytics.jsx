import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Shield, 
  Activity, Globe, Database, Zap, 
  ArrowUpRight, PieChart, Layers
} from 'lucide-react';

export default function Analytics() {
  return (
    <div className="analytics-container">
      <header className="page-header">
        <div className="header-info">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>System <span className="text-glow">Analytics</span></motion.h1>
          <p>Global platform performance and security monitoring.</p>
        </div>
        <div className="header-status">
          <div className="status-item">
            <Shield size={16} className="text-success" />
            <span>ENCRYPTION: AES-256</span>
          </div>
          <div className="status-item">
            <Zap size={16} className="text-warning" />
            <span>LATENCY: 12ms</span>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard icon={<Users />} label="Total Users" value="12,840" growth="+12%" />
        <StatCard icon={<Globe />} label="Active Sessions" value="1,204" growth="+5.4%" />
        <StatCard icon={<Database />} label="Data Usage" value="84.2 GB" growth="+8%" />
        <StatCard icon={<Activity />} label="Uptime" value="99.99%" growth="Stable" />
      </div>

      <div className="charts-row">
        <div className="chart-card glass">
          <div className="chart-head">
            <h3>USER GROWTH</h3>
            <Layers size={16} />
          </div>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[60, 80, 45, 90, 70, 100, 85].map((h, i) => (
                <motion.div 
                  key={i} 
                  className="bar" 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card glass">
          <div className="chart-head">
            <h3>SECURITY EVENTS</h3>
            <Shield size={16} />
          </div>
          <div className="events-list">
            <EventRow type="success" text="System Patch Applied" time="2h ago" />
            <EventRow type="warning" text="Unauthorized Access Attempt Blocked" time="5h ago" />
            <EventRow type="info" text="Database Backup Completed" time="12h ago" />
            <EventRow type="success" text="New User Verified" time="1d ago" />
          </div>
        </div>
      </div>

      <style>{`
        .analytics-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 2.5rem; font-weight: 900; }
        .text-glow { color: hsl(var(--p)); text-shadow: 0 0 15px hsla(var(--p) / 0.3); }
        .header-status { display: flex; gap: 1.5rem; }
        .status-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); background: hsla(var(--text) / 0.05); padding: 6px 12px; border-radius: 100px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .stat-card { background: hsla(var(--bg-card) / 0.4); padding: 1.5rem; border-radius: 24px; border: 1px solid hsla(var(--text) / 0.05); display: flex; gap: 1rem; align-items: center; }
        .stat-icon { width: 48px; height: 48px; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-size: 1.5rem; font-weight: 900; }
        .stat-growth { font-size: 0.65rem; font-weight: 700; color: hsl(var(--success)); margin-top: 2px; }

        .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .chart-card { padding: 2rem; border-radius: 32px; display: flex; flex-direction: column; gap: 1.5rem; }
        .chart-head { display: flex; justify-content: space-between; align-items: center; }
        .chart-head h3 { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.1em; color: hsl(var(--text-muted)); }
        
        .chart-placeholder { height: 200px; display: flex; align-items: flex-end; padding-top: 2rem; }
        .bar-chart { display: flex; align-items: flex-end; gap: 1rem; height: 100%; width: 100%; }
        .bar { flex: 1; background: linear-gradient(to top, hsl(var(--p)), hsl(var(--p-light))); border-radius: 8px 8px 0 0; }
        
        .events-list { display: flex; flex-direction: column; gap: 1rem; }
        .event-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: hsla(var(--text) / 0.03); border-radius: 16px; border: 1px solid hsla(var(--text) / 0.05); }
        .event-text { font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; }
        .event-dot { width: 8px; height: 8px; border-radius: 50%; }
        .event-time { font-size: 0.7rem; font-weight: 700; color: hsl(var(--text-muted)); }
        
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, growth }) {
  return (
    <motion.div className="stat-card" whileHover={{ y: -5 }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-growth">{growth}</span>
      </div>
    </motion.div>
  );
}

function EventRow({ type, text, time }) {
  const colors = { success: 'hsl(var(--success))', warning: 'hsl(var(--warning))', info: 'hsl(var(--p))' };
  return (
    <div className="event-row">
      <div className="event-text">
        <div className="event-dot" style={{ background: colors[type] }} />
        {text}
      </div>
      <span className="event-time">{time}</span>
    </div>
  );
}
