import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Shield, Compass, Flag, 
  Map, Users, Zap, Briefcase,
  ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function MissionBrief() {
  return (
    <div className="brief-container">
      <header className="page-header">
        <div className="header-info">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>Mission <span className="text-glow">Briefing</span></motion.h1>
          <p>Strategic overview and objective management for the current operation.</p>
        </div>
        <div className="header-badge">
          <Target size={16} />
          <span>OBJECTIVE: ACTIVE</span>
        </div>
      </header>

      <div className="brief-grid">
        <div className="brief-main glass">
          <div className="section-head">
            <Flag size={20} className="text-p" />
            <h3>PRIMARY OBJECTIVES</h3>
          </div>
          <div className="objective-list">
            <ObjectiveItem status="complete" text="Secure logistics and transportation assets" />
            <ObjectiveItem status="active" text="Verify team deployment readiness" />
            <ObjectiveItem status="pending" text="Coordinate final mission arrival protocols" />
          </div>

          <div className="section-head" style={{ marginTop: '2.5rem' }}>
            <Map size={20} className="text-p" />
            <h3>STRATEGIC MAP</h3>
          </div>
          <div className="map-placeholder">
            <div className="map-ui">
              <div className="map-point start" />
              <div className="map-path" />
              <div className="map-point end" />
              <div className="map-overlay">GRID SECTOR 7G - READY FOR DEPLOYMENT</div>
            </div>
          </div>
        </div>

        <div className="brief-side">
          <div className="side-card glass">
            <div className="section-head">
              <Users size={18} />
              <h3>TEAM STATUS</h3>
            </div>
            <div className="team-status-list">
              <TeamRow name="Sarah (Member)" status="Ready" color="var(--success)" />
              <TeamRow name="Mike (Member)" status="Standby" color="var(--warning)" />
              <TeamRow name="Admin (Admin)" status="Online" color="var(--p)" />
            </div>
          </div>

          <div className="side-card glass alert">
            <div className="section-head">
              <AlertCircle size={18} />
              <h3>MISSION RISK</h3>
            </div>
            <div className="risk-level">
              <div className="risk-bar"><div className="risk-fill" /></div>
              <div className="risk-label">LOW (NORMAL OPERATIONS)</div>
            </div>
          </div>

          <button className="redeploy-btn">
            <Zap size={18} />
            RE-AUTHORIZE MISSION
          </button>
        </div>
      </div>

      <style>{`
        .brief-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 2.5rem; font-weight: 900; }
        .text-glow { color: hsl(var(--p)); text-shadow: 0 0 15px hsla(var(--p) / 0.3); }
        .header-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; color: #fff; background: hsl(var(--p)); padding: 6px 14px; border-radius: 100px; box-shadow: 0 5px 15px hsla(var(--p) / 0.3); }
        
        .brief-grid { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; }
        .brief-main { padding: 2.5rem; border-radius: 32px; }
        .section-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .section-head h3 { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.1em; color: hsl(var(--text-muted)); }
        
        .objective-list { display: flex; flex-direction: column; gap: 1rem; }
        .objective-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: hsla(var(--text) / 0.03); border-radius: 18px; border: 1px solid hsla(var(--text) / 0.05); }
        .obj-status { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; }
        .obj-text { font-size: 1rem; font-weight: 600; }
        
        .map-placeholder { height: 240px; background: hsla(var(--text) / 0.03); border-radius: 24px; border: 1px solid hsla(var(--text) / 0.05); position: relative; overflow: hidden; }
        .map-ui { height: 100%; width: 100%; position: relative; padding: 3rem; display: flex; align-items: center; justify-content: space-between; }
        .map-point { width: 16px; height: 16px; border-radius: 50%; background: hsl(var(--p)); box-shadow: 0 0 20px hsl(var(--p)); position: relative; }
        .map-point.end { background: hsl(var(--success)); box-shadow: 0 0 20px hsl(var(--success)); }
        .map-path { position: absolute; left: 3.5rem; right: 3.5rem; height: 2px; background: dashed hsl(var(--text-muted)); border-top: 2px dashed hsla(var(--text) / 0.1); }
        .map-overlay { position: absolute; bottom: 1rem; left: 1rem; font-size: 0.6rem; font-weight: 900; background: hsla(0,0%,0%,0.7); color: #fff; padding: 4px 10px; border-radius: 4px; }

        .brief-side { display: flex; flex-direction: column; gap: 1.5rem; }
        .side-card { padding: 1.5rem; border-radius: 24px; }
        .team-status-list { display: flex; flex-direction: column; gap: 1rem; }
        .team-row { display: flex; justify-content: space-between; align-items: center; }
        .team-row span { font-size: 0.85rem; font-weight: 600; }
        .team-status-badge { font-size: 0.7rem; font-weight: 800; padding: 2px 10px; border-radius: 6px; }

        .risk-level { display: flex; flex-direction: column; gap: 0.75rem; }
        .risk-bar { height: 6px; background: hsla(var(--text) / 0.05); border-radius: 10px; overflow: hidden; }
        .risk-fill { height: 100%; width: 25%; background: hsl(var(--success)); }
        .risk-label { font-size: 0.65rem; font-weight: 900; color: hsl(var(--success)); }

        .redeploy-btn { width: 100%; padding: 1.25rem; border-radius: 20px; border: none; background: hsl(var(--text)); color: hsl(var(--bg)); font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: 0.3s; }
        .redeploy-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px hsla(0,0%,0%,0.2); }

        @media (max-width: 1024px) { .brief-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function ObjectiveItem({ status, text }) {
  const isComplete = status === 'complete';
  const isActive = status === 'active';
  return (
    <div className={`objective-item ${isActive ? 'active' : ''}`}>
      <div className="obj-status">
        {isComplete ? <CheckCircle2 size={20} className="text-success" /> : <div className="event-dot" style={{ background: isActive ? 'hsl(var(--p))' : 'hsl(var(--text-muted))' }} />}
      </div>
      <span className={`obj-text ${isComplete ? 'text-muted line-through' : ''}`}>{text}</span>
    </div>
  );
}

function TeamRow({ name, status, color }) {
  return (
    <div className="team-row">
      <span>{name}</span>
      <span className="team-status-badge" style={{ background: `${color}20`, color: color }}>{status}</span>
    </div>
  );
}
