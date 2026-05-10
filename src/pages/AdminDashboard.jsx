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
            padding: 3rem; 
            border-radius: 24px; 
            background: 
              radial-gradient(circle at 100% 0%, hsla(var(--p)/0.15) 0%, transparent 40%),
              linear-gradient(135deg, hsla(0,0,0,0.4), hsla(0,0,0,0.1));
            border: 1px solid var(--glass-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: inset 0 1px 0 hsla(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .admin-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10z' fill='rgba(255,255,255,0.02)' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 0.5;
            z-index: 0;
        }

        .hero-content, .hero-stats { position: relative; z-index: 1; }
        
        .admin-hero h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 0.5rem; color: #fff; text-shadow: 0 0 30px hsla(var(--p)/0.5); }
        .admin-hero p { color: hsl(var(--text-muted)); font-weight: 600; font-size: 1.1rem; }
        .hero-badge { display: inline-block; font-size: 0.65rem; font-weight: 900; color: #fff; background: hsla(var(--p)/0.2); border: 1px solid hsla(var(--p)/0.4); padding: 4px 12px; border-radius: 100px; letter-spacing: 0.15em; margin-bottom: 1.25rem; box-shadow: 0 0 15px hsla(var(--p)/0.3); }
        
        .hero-stats { display: flex; gap: 4rem; }
        .h-stat { display: flex; flex-direction: column; position: relative; }
        .h-stat span { font-size: 0.7rem; font-weight: 800; color: hsl(var(--p-light)); letter-spacing: 0.1em; margin-bottom: 4px; text-transform: uppercase; }
        .h-stat strong { font-size: 2rem; font-weight: 900; color: #fff; letter-spacing: -0.02em; }

        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
        .card-head h3 { font-size: 1rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: #fff; }
        .live-tag { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; color: hsl(var(--p-light)); background: hsla(var(--p)/0.1); padding: 4px 8px; border-radius: 6px; border: 1px solid hsla(var(--p)/0.3); animation: pulse 2s infinite; }
        
        .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .admin-stat-item { padding: 1.5rem; background: hsla(0,0,0,0.3); border-radius: 16px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 1rem; transition: 0.3s; box-shadow: inset 0 1px 0 hsla(255,255,255,0.02); }
        .admin-stat-item:hover { transform: translateY(-4px); background: hsla(0,0,0,0.5); border-color: hsla(var(--p)/0.3); box-shadow: inset 0 1px 0 hsla(255,255,255,0.05), 0 10px 20px rgba(0,0,0,0.3); }
        
        .admin-icon { width: 44px; height: 44px; background: hsla(var(--p)/0.1); color: hsl(var(--p-light)); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid hsla(var(--p)/0.2); box-shadow: 0 0 15px hsla(var(--p)/0.2); }
        .admin-icon.success { background: hsla(var(--success)/0.1); color: hsl(var(--success)); border-color: hsla(var(--success)/0.2); box-shadow: 0 0 15px hsla(var(--success)/0.2); }
        .admin-icon.warning { background: hsla(var(--warning)/0.1); color: hsl(var(--warning)); border-color: hsla(var(--warning)/0.2); box-shadow: 0 0 15px hsla(var(--warning)/0.2); }

        .admin-info { display: flex; flex-direction: column; }
        .admin-label { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-value { font-size: 1.75rem; font-weight: 900; color: #fff; margin: 4px 0; }
        .admin-growth { font-size: 0.75rem; font-weight: 700; color: hsl(var(--success)); display: flex; align-items: center; gap: 4px; }

        .health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .health-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: hsla(0,0,0,0.3); border-radius: 16px; border: 1px solid var(--glass-border); transition: 0.3s; }
        .health-item:hover { background: hsla(0,0,0,0.5); }
        .health-item span { font-size: 0.85rem; font-weight: 700; flex: 1; color: #fff; }
        .health-status { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .mini-logs { display: flex; flex-direction: column; gap: 0.75rem; }
        .log-entry { display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 600; padding: 0.75rem 1rem; background: hsla(0,0,0,0.2); border-radius: 12px; border: 1px solid var(--glass-border); transition: 0.3s; }
        .log-entry:hover { background: hsla(0,0,0,0.4); }
        .log-entry em { font-size: 0.7rem; color: hsl(var(--text-muted)); margin-left: auto; font-weight: 700; }
        .log-entry.warning { border-color: hsla(var(--warning)/0.3); background: hsla(var(--warning)/0.05); }

        .map-placeholder { position: relative; height: 100%; min-height: 250px; border-radius: 16px; background: hsla(0,0,0,0.4); overflow: hidden; border: 1px solid var(--glass-border); box-shadow: inset 0 0 40px rgba(0,0,0,0.8); }
        .map-grid { position: absolute; inset: 0; background-image: radial-gradient(hsla(var(--p)/0.3) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.5; }
        .pulse-point { 
            position: absolute; 
            width: 8px; 
            height: 8px; 
            background: hsl(var(--p-light)); 
            border-radius: 50%; 
            box-shadow: 0 0 20px hsl(var(--p-light));
            animation: pulse-ring 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 hsla(var(--p-light)/0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 20px hsla(var(--p-light)/0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 hsla(var(--p-light)/0); }
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
