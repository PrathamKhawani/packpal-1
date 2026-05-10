import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, AlertCircle, CheckCircle, Info, Database, Lock, UserPlus } from 'lucide-react';

export default function SystemLogs() {
  const logs = [
    { id: 1, type: 'security', event: 'Unauthorized Login Attempt', details: 'Blocked IP 192.168.1.1', time: '2m ago', severity: 'high' },
    { id: 2, type: 'system', event: 'Database Backup', details: 'Automated backup completed', time: '15m ago', severity: 'low' },
    { id: 3, type: 'user', event: 'New Member Invited', details: 'sarah@example.com added to Platform', time: '1h ago', severity: 'medium' },
    { id: 4, type: 'access', event: 'Vault Access', details: 'Owner accessed Secure Documents', time: '2h ago', severity: 'medium' },
    { id: 5, type: 'system', event: 'API Version Update', details: 'v4.2.1 deployed to Production', time: 'Yesterday', severity: 'low' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'security': return <Lock size={14} />;
      case 'system': return <Database size={14} />;
      case 'user': return <UserPlus size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="logs-container admin-theme">
      <header className="logs-header glass">
        <div className="header-info">
            <div className="terminal-badge"><Terminal size={12} /> AUDIT_LOG_STREAM</div>
            <h2>System Audit Trail</h2>
            <p>Real-time platform activity and security monitoring.</p>
        </div>
        <div className="header-actions">
            <button className="btn-log secondary">Export CSV</button>
            <button className="btn-log primary">Clear Cache</button>
        </div>
      </header>

      <div className="logs-stream glass">
        {logs.map((log, idx) => (
          <motion.div 
            key={log.id}
            className={`log-row severity-${log.severity}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="log-type-icon">{getIcon(log.type)}</div>
            <div className="log-main">
                <div className="log-event">
                    <strong>{log.event}</strong>
                    <span className="log-time">{log.time}</span>
                </div>
                <div className="log-details">{log.details}</div>
            </div>
            <div className="log-severity-tag">{log.severity}</div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .logs-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        .logs-header { padding: 2rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid hsla(var(--p) / 0.2); }
        .terminal-badge { font-size: 0.6rem; font-weight: 900; background: #000; color: #0f0; padding: 4px 10px; border-radius: 4px; display: flex; align-items: center; gap: 8px; font-family: monospace; margin-bottom: 0.5rem; width: fit-content; }
        
        .header-actions { display: flex; gap: 1rem; }
        .btn-log { padding: 0.6rem 1.25rem; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; }
        .btn-log.primary { background: hsl(var(--p)); color: #fff; }
        .btn-log.secondary { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }
        
        .logs-stream { border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid hsla(var(--text) / 0.05); }
        .log-row { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 2rem; border-bottom: 1px solid hsla(var(--text) / 0.05); transition: 0.2s; }
        .log-row:last-child { border-bottom: none; }
        .log-row:hover { background: hsla(var(--text) / 0.02); }
        
        .log-type-icon { width: 32px; height: 32px; border-radius: 10px; background: hsla(var(--text) / 0.05); color: hsl(var(--text-muted)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .log-main { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .log-event { display: flex; justify-content: space-between; align-items: center; }
        .log-event strong { font-size: 0.9rem; }
        .log-time { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 600; }
        .log-details { font-size: 0.75rem; color: hsl(var(--text-muted)); }
        
        .log-severity-tag { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; }
        .severity-high .log-severity-tag { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); }
        .severity-medium .log-severity-tag { background: hsla(var(--warning) / 0.1); color: hsl(var(--warning)); }
        .severity-low .log-severity-tag { background: hsla(var(--success) / 0.1); color: hsl(var(--success)); }
        .severity-high .log-type-icon { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }
      `}</style>
    </div>
  );
}
