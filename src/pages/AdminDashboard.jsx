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
    <div className="dash-container admin-theme">
      <header className="admin-hero glass">
        <div className="hero-content">
            <div className="hero-badge">SYSTEM STATUS: OPTIMAL</div>
            <h1>Command Center</h1>
            <p>Global Platform Intelligence & Governance</p>
        </div>
        <div className="hero-stats">
            <div className="h-stat"><span>LATENCY</span><strong>12ms</strong></div>
            <div className="h-stat"><span>UPTIME</span><strong>{uptime}%</strong></div>
            <div className="h-stat"><span>LOAD</span><strong>0.42</strong></div>
        </div>
      </header>

      <div className="dash-bento">
        {/* Platform Metrics */}
        <motion.div 
          className="bento-card glass admin-intel-card" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gridColumn: 'span 4' }}
        >
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={18} className="text-p" />
              <h3>PLATFORM METRICS</h3>
            </div>
            <span className="live-tag">REAL-TIME</span>
          </div>
          
          <div className="admin-grid">
            <div className="admin-stat-item">
              <Users className="admin-icon" />
              <div className="admin-info">
                <span className="admin-label">TOTAL OPERATORS</span>
                <strong className="admin-value">{members.length * 42}</strong>
                <span className="admin-growth"><Growth size={12} /> +12%</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <Globe className="admin-icon" />
              <div className="admin-info">
                <span className="admin-label">ACTIVE MISSIONS</span>
                <strong className="admin-value">1,284</strong>
                <span className="admin-growth"><Growth size={12} /> +5.4%</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <Database className="admin-icon" />
              <div className="admin-info">
                <span className="admin-label">STORAGE CLOUD</span>
                <strong className="admin-value">84.2 GB</strong>
                <span className="admin-growth">82% Capacity</span>
              </div>
            </div>
            <div className="admin-stat-item">
              <Activity className="admin-icon" />
              <div className="admin-info">
                <span className="admin-label">API REQUESTS</span>
                <strong className="admin-value">24.5k</strong>
                <span className="admin-growth">Last 24h</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div className="bento-card glass" style={{ gridColumn: 'span 2' }}>
            <div className="card-head"><h3>SYSTEM HEALTH</h3></div>
            <div className="health-grid">
                <HealthItem icon={<Server size={14} />} label="API Server" status="Online" color="success" />
                <HealthItem icon={<Database size={14} />} label="PostgreSQL" status="Online" color="success" />
                <HealthItem icon={<Cpu size={14} />} label="ML Engine" status="Idle" color="warning" />
                <HealthItem icon={<Network size={14} />} label="CDN" status="Global" color="p" />
            </div>
        </motion.div>

        {/* Security Alerts */}
        <motion.div className="bento-card glass" style={{ gridColumn: 'span 2' }}>
            <div className="card-head"><h3>SECURITY LOGS</h3></div>
            <div className="mini-logs">
                <div className="log-entry">
                    <Lock size={12} className="text-success" />
                    <span>Firewall updated: v4.2.1</span>
                    <em>2m ago</em>
                </div>
                <div className="log-entry warning">
                    <AlertTriangle size={12} />
                    <span>Suspicious IP: 192.168.1.1</span>
                    <em>15m ago</em>
                </div>
                <div className="log-entry">
                    <ShieldCheck size={12} className="text-p" />
                    <span>Deep scan completed: Clear</span>
                    <em>1h ago</em>
                </div>
            </div>
        </motion.div>

        {/* Global Traffic Map Placeholder */}
        <motion.div className="bento-card glass" style={{ gridColumn: 'span 4', height: '200px' }}>
            <div className="card-head"><h3>GLOBAL ACTIVITY MAP</h3></div>
            <div className="map-placeholder">
                <div className="map-grid"></div>
                <div className="pulse-point" style={{ top: '30%', left: '20%' }}></div>
                <div className="pulse-point" style={{ top: '50%', left: '70%' }}></div>
                <div className="pulse-point" style={{ top: '40%', left: '50%' }}></div>
            </div>
        </motion.div>
      </div>

      <style>{`
        .admin-theme { --p: 217 91% 60%; }
        .admin-hero { 
            padding: 2.5rem; 
            border-radius: 24px; 
            background: linear-gradient(135deg, hsla(var(--p) / 0.1), transparent);
            border: 1px solid hsla(var(--p) / 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .admin-hero h1 { font-size: 3rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 0.5rem; }
        .admin-hero p { color: hsl(var(--text-muted)); font-weight: 600; }
        .hero-badge { font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 1rem; }
        
        .hero-stats { display: flex; gap: 3rem; }
        .h-stat { display: flex; flex-direction: column; }
        .h-stat span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); }
        .h-stat strong { font-size: 1.5rem; font-weight: 900; }

        .health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .health-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: hsla(var(--text) / 0.03); border-radius: 12px; }
        .health-item span { font-size: 0.8rem; font-weight: 600; flex: 1; }
        .health-status { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        
        .mini-logs { display: flex; flex-direction: column; gap: 0.75rem; }
        .log-entry { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; font-weight: 600; padding: 0.5rem 0; border-bottom: 1px solid hsla(var(--text) / 0.05); }
        .log-entry:last-child { border-bottom: none; }
        .log-entry em { font-size: 0.65rem; color: hsl(var(--text-muted)); margin-left: auto; }
        .log-entry.warning { color: hsl(var(--warning)); }

        .map-placeholder { position: relative; height: 100%; border-radius: 12px; background: hsla(var(--text) / 0.02); overflow: hidden; }
        .map-grid { position: absolute; inset: 0; background-image: radial-gradient(hsla(var(--p) / 0.2) 1px, transparent 1px); background-size: 20px 20px; }
        .pulse-point { 
            position: absolute; 
            width: 8px; 
            height: 8px; 
            background: hsl(var(--p)); 
            border-radius: 50%; 
            box-shadow: 0 0 0 0 hsla(var(--p) / 0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 hsla(var(--p) / 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px hsla(var(--p) / 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 hsla(var(--p) / 0); }
        }
      `}</style>
    </div>
  );
}

function HealthItem({ icon, label, status, color }) {
    return (
        <div className="health-item">
            <div className={`admin-icon ${color}`} style={{ width: '28px', height: '28px', padding: '6px' }}>{icon}</div>
            <span>{label}</span>
            <div className={`health-status text-${color}`}>{status}</div>
        </div>
    );
}
