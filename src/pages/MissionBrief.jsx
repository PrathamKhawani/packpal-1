import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Shield, Flag, Map, Users, Zap, 
  ChevronRight, AlertCircle, CheckCircle2,
  Clock, Activity, TrendingUp, Radio, Lock,
  Crosshair, BarChart2, GitBranch, Terminal
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function MissionBrief() {
  const { items, members, tripConfig, activityLog, deleteMember } = useApp();
  const [openObj, setOpenObj] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const maxMembers = tripConfig?.totalMembers || 2;
  const isFull = members?.length >= maxMembers;

  // Dynamic Readiness calculation based on Checklist items
  const totalItems = items?.length || 0;
  const packedItems = items?.filter(i => i.status === 'packed').length || 0;
  const readinessPct = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  // Removed derived teamList since we map all members directly

  // Derive Objectives from Checklist (Top 4 pending/recent)
  const objList = items?.slice(0, 4).map(item => ({
    status: item.status === 'packed' ? 'complete' : 'pending',
    text: item.name,
    detail: `Category: ${item.category} | Assigned to: ${item.assignedTo}`,
    tag: item.category.toUpperCase()
  })) || [];

  // Timeline (Dynamic based on trip dates)
  const startDate = tripConfig?.startDate ? new Date(tripConfig.startDate) : new Date();
  const endDate = tripConfig?.endDate ? new Date(tripConfig.endDate) : new Date(startDate.getTime() + 86400000 * 3);
  const now = new Date();
  
  const timelineList = [
    { label: 'Briefing', date: 'T-2 Days', done: now >= new Date(startDate.getTime() - 86400000 * 2) },
    { label: 'Departure', date: startDate.toLocaleDateString(), done: now >= startDate },
    { label: 'Arrival', date: startDate.toLocaleDateString(), done: now >= startDate },
    { label: 'Debrief', date: endDate.toLocaleDateString(), done: now >= endDate },
  ];

  const risksList = [
    { label: 'Packing', pct: 100 - readinessPct, level: readinessPct > 70 ? 'LOW' : 'HIGH', colorVar: readinessPct > 70 ? 'var(--success)' : 'var(--danger)' },
    { label: 'Budget', pct: 30, level: 'CLEAR', colorVar: 'var(--p)' },
    { label: 'Logistics', pct: tripConfig?.setupComplete ? 10 : 80, level: tripConfig?.setupComplete ? 'LOW' : 'HIGH', colorVar: tripConfig?.setupComplete ? 'var(--success)' : 'var(--danger)' },
  ];

  return (
    <div className="mb-root">
      {/* ── Header ── */}
      <motion.header className="mb-header" initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <div className="mb-header-left">
          <div className="mb-eyebrow"><Radio size={10} className="pulse-ico" /> TACTICAL BRIEF — OPS ACTIVE</div>
          <h1 className="mb-title">Mission <span className="mb-accent">Control</span></h1>
          <p className="mb-sub">Strategic overview and objective management for the current operation.</p>
        </div>
        <div className="mb-header-right">
          <div className="readiness-ring">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" className="ring-track" />
              <circle cx="40" cy="40" r="32" className="ring-fill" strokeDasharray={`${Math.round(readinessPct * 2)} 200`} strokeDashoffset="42" />
            </svg>
            <div className="ring-label"><strong>{readinessPct}%</strong><span>READINESS</span></div>
          </div>
          <div className="header-stats">
            <div className="hs-item"><TrendingUp size={13}/><div><strong>{packedItems}/{totalItems}</strong><span>Packed</span></div></div>
            <div className="hs-item"><Activity size={13}/><div><strong>{members?.length || 0}</strong><span>Members</span></div></div>
            <div className="hs-item"><Clock size={13}/><div><strong>{tripConfig?.days || 3} Days</strong><span>Duration</span></div></div>
          </div>
        </div>
      </motion.header>

      {/* ── Body Grid ── */}
      <div className="mb-grid">

        {/* Left column */}
        <div className="mb-col-main">

          {/* Objectives */}
          <motion.section className="mb-card" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
            <div className="mc-label"><Flag size={13}/> PRIMARY OBJECTIVES</div>
            <div className="obj-list">
              {objList.map((o, i) => (
                <div key={i} className={`obj-item ${o.status} ${openObj===i ? 'open' : ''}`} onClick={() => setOpenObj(openObj===i ? null : i)}>
                  <div className="obj-main-row">
                    <div className="obj-icon-wrap">
                      {o.status === 'complete'
                        ? <CheckCircle2 size={16} className="ico-success" />
                        : <div className={`obj-dot ${o.status}`} />}
                    </div>
                    <div className="obj-body">
                      <span className="obj-tag">{o.tag}</span>
                      <p className={`obj-text ${o.status === 'complete' ? 'done' : ''}`}>{o.text}</p>
                    </div>
                    <ChevronRight size={14} className={`obj-chevron ${openObj===i ? 'rotated' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openObj === i && (
                      <motion.div className="obj-detail" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}>
                        {o.detail}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Deployment Overview */}
          <motion.section className="mb-card map-card" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <div className="mc-label"><Map size={13}/> DEPLOYMENT OVERVIEW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'hsl(var(--bg))', padding: '1.25rem', borderRadius: '10px', border: '1px solid hsl(var(--border))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 800 }}>DESTINATION</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'hsl(var(--text))' }}>{tripConfig?.destination ? tripConfig.destination.toUpperCase() : 'PENDING'}</span>
              </div>
              <div style={{ width: '100%', height: '1px', background: 'hsl(var(--border))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 800 }}>START DATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'hsl(var(--text))' }}>{tripConfig?.startDate ? new Date(tripConfig.startDate).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 800 }}>END DATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'hsl(var(--text))' }}>{tripConfig?.endDate ? new Date(tripConfig.endDate).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          </motion.section>

          {/* Timeline */}
          <motion.section className="mb-card" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
            <div className="mc-label"><GitBranch size={13}/> MISSION TIMELINE</div>
            <div className="tl-strip">
              {timelineList.map((s, i) => (
                <div key={i} className={`tl-step ${s.done ? 'done' : ''}`}>
                  <div className="tl-node">{s.done ? <CheckCircle2 size={13}/> : <div className="tl-dot" />}</div>
                  {i < timelineList.length-1 && <div className={`tl-line ${s.done ? 'done' : ''}`} />}
                  <span className="tl-label">{s.label}</span>
                  <span className="tl-date">{s.date}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right column */}
        <div className="mb-col-side">

          {/* Team Status */}
          <motion.section className="mb-card" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
            <div className="mc-label"><Users size={13}/> TEAM STATUS</div>
            <div className="team-list">
              {members?.length > 0 ? members.slice(0, maxMembers).map((m, i) => {
                const color = i === 0 ? 'p' : i === 1 ? 'success' : 'warning';
                return (
                  <div key={i} className="team-row">
                    <div className={`team-avatar ${color}`}>{m.name.substring(0, 2).toUpperCase()}</div>
                    <div className="team-info"><strong>{m.name}</strong><span>{m.role?.toUpperCase() || 'MEMBER'}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`team-badge ${color}`}>ONLINE</span>
                      <button 
                        onClick={() => deleteMember(m.id)}
                        style={{ background: 'none', border: 'none', color: 'hsl(var(--danger))', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                        title="Remove Member"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="team-row">
                  <div className="team-info"><strong>No team members</strong><span>Invite members to see them here.</span></div>
                </div>
              )}
            </div>
            {!isFull && (
              <motion.button 
                className="mb-cta" 
                style={{ marginTop: '1rem', background: copied ? 'hsl(var(--success))' : 'hsl(var(--p))' }}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/register');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <CheckCircle2 size={15}/> : <Users size={15}/>} 
                {copied ? 'COPIED INVITE LINK!' : `INVITE MEMBER (${members.length}/${maxMembers})`}
              </motion.button>
            )}
          </motion.section>

          {/* Risk Panel */}
          <motion.section className="mb-card" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}>
            <div className="mc-label"><AlertCircle size={13}/> RISK ASSESSMENT</div>
            <div className="risk-list">
              {risksList.map((r, i) => (
                <div key={i} className="risk-row">
                  <div className="risk-meta">
                    <span className="risk-label">{r.label}</span>
                    <span className="risk-level" style={{ color: r.colorVar }}>{r.level}</span>
                  </div>
                  <div className="risk-track">
                    <motion.div className="risk-bar" style={{ background: r.colorVar }}
                      initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ delay: 0.3+i*0.1, duration: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="risk-footer"><Shield size={12}/> Overall: <strong>LOW THREAT — NORMAL OPS</strong></div>
          </motion.section>

          {/* Mission Log */}
          <motion.section className="mb-card terminal-card" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}>
            <div className="mc-label"><Terminal size={13}/> MISSION LOG</div>
            <div className="terminal-body">
              {activityLog?.slice(0, 4).map((log, i) => (
                <div key={i} className="t-line-item">
                  <span style={{ color: log.color, marginRight: '4px' }}>→</span> {log.text}
                </div>
              ))}
              <div className="t-line-item t-cursor"><span className="t-green">_</span> Awaiting further actions...</div>
            </div>
          </motion.section>
        </div>
      </div>

      <style>{`
        .mb-root { display:flex; flex-direction:column; gap:1.5rem; max-width:1100px; margin:0 auto; }

        /* Header */
        .mb-header { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; background:hsl(var(--bg-card)); border:1px solid hsl(var(--border)); border-radius:16px; padding:2rem; box-shadow:var(--shadow-card); }
        .mb-eyebrow { font-size:0.6rem; font-weight:800; color:hsl(var(--p)); background:hsla(var(--p)/.08); border:1px solid hsla(var(--p)/.2); padding:4px 12px; border-radius:100px; display:inline-flex; align-items:center; gap:8px; margin-bottom:0.75rem; letter-spacing:0.06em; }
        .pulse-ico { animation: pulse-opacity 1.4s infinite; }
        @keyframes pulse-opacity { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .mb-title { font-size:2.25rem; font-weight:800; letter-spacing:-0.03em; line-height:1.1; margin-bottom:0.4rem; }
        .mb-accent { color:hsl(var(--p)); }
        .mb-sub { font-size:0.825rem; color:hsl(var(--text-muted)); }

        .mb-header-right { display:flex; align-items:center; gap:1.5rem; flex-shrink:0; }
        .readiness-ring { position:relative; width:80px; height:80px; flex-shrink:0; }
        .readiness-ring svg { width:80px; height:80px; transform:rotate(-90deg); }
        .ring-track { fill:none; stroke:hsl(var(--border)); stroke-width:5; }
        .ring-fill  { fill:none; stroke:hsl(var(--p)); stroke-width:5; stroke-linecap:round; transition:stroke-dasharray .6s; }
        .ring-label { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .ring-label strong { font-size:1.1rem; font-weight:800; color:hsl(var(--text)); line-height:1; }
        .ring-label span { font-size:0.42rem; font-weight:800; color:hsl(var(--text-muted)); letter-spacing:0.08em; }

        .header-stats { display:flex; flex-direction:column; gap:0.6rem; }
        .hs-item { display:flex; align-items:center; gap:0.6rem; padding:0.5rem 0.75rem; background:hsl(var(--bg)); border:1px solid hsl(var(--border)); border-radius:8px; color:hsl(var(--p)); }
        .hs-item div { display:flex; flex-direction:column; }
        .hs-item strong { font-size:0.8rem; font-weight:800; color:hsl(var(--text)); line-height:1.1; }
        .hs-item span { font-size:0.55rem; font-weight:700; color:hsl(var(--text-muted)); text-transform:uppercase; letter-spacing:0.06em; }

        /* Grid */
        .mb-grid { display:grid; grid-template-columns:1fr 280px; gap:1.25rem; }
        .mb-col-main { display:flex; flex-direction:column; gap:1.25rem; }
        .mb-col-side { display:flex; flex-direction:column; gap:1rem; }

        /* Card */
        .mb-card { background:hsl(var(--bg-card)); border:1px solid hsl(var(--border)); border-radius:14px; padding:1.25rem; box-shadow:var(--shadow-sm); }
        .mc-label { font-size:0.6rem; font-weight:800; color:hsl(var(--text-muted)); text-transform:uppercase; letter-spacing:0.1em; display:flex; align-items:center; gap:7px; margin-bottom:1rem; }

        /* Objectives */
        .obj-list { display:flex; flex-direction:column; gap:0.5rem; }
        .obj-item { border:1px solid hsl(var(--border)); border-radius:10px; overflow:hidden; cursor:pointer; transition:border-color .15s; }
        .obj-item:hover { border-color:hsl(var(--text-muted)); }
        .obj-item.open { border-color:hsla(var(--p)/.4); background:hsla(var(--p)/.03); }
        .obj-item.active { border-left:3px solid hsl(var(--p)); }
        .obj-item.complete { border-left:3px solid hsl(var(--success)); }
        .obj-main-row { display:flex; align-items:center; gap:0.75rem; padding:0.8rem 1rem; }
        .obj-icon-wrap { width:20px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .obj-dot { width:9px; height:9px; border-radius:50%; border:2px solid hsl(var(--border)); }
        .obj-dot.active { background:hsl(var(--p)); border-color:hsla(var(--p)/.3); }
        .obj-dot.pending { background:hsl(var(--border)); }
        .ico-success { color:hsl(var(--success)); }
        .obj-body { flex:1; display:flex; flex-direction:column; gap:2px; }
        .obj-tag { font-size:0.55rem; font-weight:800; color:hsl(var(--p)); letter-spacing:0.08em; }
        .obj-text { font-size:0.825rem; font-weight:600; color:hsl(var(--text)); }
        .obj-text.done { text-decoration:line-through; color:hsl(var(--text-muted)); }
        .obj-chevron { color:hsl(var(--text-muted)); transition:transform .2s; }
        .obj-chevron.rotated { transform:rotate(90deg); }
        .obj-detail { padding:0 1rem 0.75rem 2.75rem; font-size:0.775rem; color:hsl(var(--text-muted)); line-height:1.5; border-top:1px solid hsl(var(--border)); padding-top:0.6rem; overflow:hidden; }

        /* Map */
        .map-card {}
        .map-scene { height:150px; border:1px solid hsl(var(--border)); border-radius:10px; background:hsl(var(--bg)); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .map-grid-bg { position:absolute; inset:0; background-image:radial-gradient(hsl(var(--border)) 1px,transparent 1px); background-size:22px 22px; opacity:0.6; }
        .map-content { position:relative; z-index:1; display:flex; align-items:center; gap:0; width:55%; }
        .map-node { display:flex; flex-direction:column; align-items:center; gap:5px; }
        .map-node span { font-size:0.55rem; font-weight:800; color:hsl(var(--text-muted)); letter-spacing:0.08em; }
        .node-dot { width:12px; height:12px; border-radius:50%; background:hsl(var(--p)); box-shadow:0 0 0 4px hsla(var(--p)/.2); }
        .node-dot.green { background:hsl(var(--success)); box-shadow:0 0 0 4px hsla(var(--success)/.2); }
        .map-connector { flex:1; display:flex; align-items:center; }
        .connector-line { flex:1; height:2px; background:repeating-linear-gradient(90deg,hsl(var(--p)) 0,hsl(var(--p)) 5px,transparent 5px,transparent 10px); position:relative; }
        .connector-pulse { position:absolute; top:50%; transform:translateY(-50%); width:7px; height:7px; border-radius:50%; background:hsl(var(--p)); animation:move-dot 2s linear infinite; }
        @keyframes move-dot { 0%{left:0%} 100%{left:100%} }
        .map-badge { position:absolute; bottom:8px; left:10px; font-size:0.5rem; font-weight:800; background:hsl(var(--bg-card)); border:1px solid hsl(var(--border)); color:hsl(var(--text-muted)); padding:3px 8px; border-radius:4px; display:flex; align-items:center; gap:6px; letter-spacing:0.06em; }
        .live-dot { width:6px; height:6px; border-radius:50%; background:hsl(var(--success)); animation:pulse-opacity 1.5s infinite; }
        .map-coords { position:absolute; top:8px; right:10px; font-size:0.5rem; font-weight:700; color:hsl(var(--text-muted)); background:hsl(var(--bg-card)); border:1px solid hsl(var(--border)); padding:2px 7px; border-radius:4px; }

        /* Timeline */
        .tl-strip { display:flex; align-items:flex-start; }
        .tl-step { flex:1; display:flex; flex-direction:column; align-items:center; position:relative; }
        .tl-node { display:flex; align-items:center; justify-content:center; color:hsl(var(--p)); }
        .tl-dot { width:10px; height:10px; border-radius:50%; background:hsl(var(--border)); border:2px solid hsl(var(--bg-card)); }
        .tl-step.done .tl-dot { background:hsl(var(--p)); }
        .tl-line { position:absolute; top:6px; left:50%; width:100%; height:2px; background:hsl(var(--border)); z-index:0; }
        .tl-line.done { background:hsl(var(--p)); }
        .tl-label { font-size:0.65rem; font-weight:700; color:hsl(var(--text)); margin-top:6px; text-align:center; }
        .tl-date { font-size:0.58rem; color:hsl(var(--text-muted)); text-align:center; }

        /* Team */
        .team-list { display:flex; flex-direction:column; gap:0.5rem; }
        .team-row { display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.75rem; background:hsl(var(--bg)); border:1px solid hsl(var(--border)); border-radius:8px; }
        .team-avatar { width:30px; height:30px; border-radius:8px; font-size:0.6rem; font-weight:800; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .team-avatar.success { background:hsl(var(--success)); }
        .team-avatar.warning { background:hsl(var(--warning)); }
        .team-avatar.p { background:hsl(var(--p)); }
        .team-info { flex:1; display:flex; flex-direction:column; }
        .team-info strong { font-size:0.78rem; font-weight:700; color:hsl(var(--text)); }
        .team-info span { font-size:0.6rem; color:hsl(var(--text-muted)); }
        .team-badge { font-size:0.55rem; font-weight:800; padding:2px 7px; border-radius:100px; letter-spacing:0.06em; }
        .team-badge.success { background:hsla(var(--success)/.1); color:hsl(var(--success)); }
        .team-badge.warning { background:hsla(var(--warning)/.1); color:hsl(var(--warning)); }
        .team-badge.p { background:hsla(var(--p)/.1); color:hsl(var(--p)); }

        /* Risk */
        .risk-list { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:0.875rem; }
        .risk-row { display:flex; flex-direction:column; gap:4px; }
        .risk-meta { display:flex; justify-content:space-between; }
        .risk-label { font-size:0.72rem; font-weight:600; color:hsl(var(--text)); }
        .risk-level { font-size:0.6rem; font-weight:800; letter-spacing:0.06em; }
        .risk-track { height:4px; background:hsl(var(--bg)); border-radius:10px; overflow:hidden; }
        .risk-bar { height:100%; border-radius:10px; }
        .risk-footer { display:flex; align-items:center; gap:6px; font-size:0.7rem; color:hsl(var(--text-muted)); padding-top:0.75rem; border-top:1px solid hsl(var(--border)); }
        .risk-footer strong { font-size:0.65rem; font-weight:800; color:hsl(var(--text)); }

        /* Terminal */
        .terminal-card { background:hsl(220 15% 9%) !important; border-color:hsl(220 15% 18%) !important; }
        [data-theme="dark"] .terminal-card { background:hsl(220 15% 7%) !important; }
        .terminal-body { display:flex; flex-direction:column; gap:0.4rem; font-family:monospace; }
        .t-line-item { font-size:0.72rem; color:hsl(0 0% 70%); display:flex; align-items:center; gap:8px; }
        .t-green { color:#4ade80; }
        .t-yellow { color:#facc15; }
        .t-blue { color:#60a5fa; }
        .t-cursor { animation:blink-cursor 1s infinite; }
        @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }

        /* CTA */
        .mb-cta { width:100%; padding:0.9rem; border-radius:10px; border:none; background:hsl(var(--p)); color:#fff; font-weight:800; font-size:0.8rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; letter-spacing:0.06em; box-shadow:0 4px 16px hsla(var(--p)/.3); transition:0.2s; }
        .mb-cta:hover { background:hsl(var(--p-dark)); box-shadow:0 6px 20px hsla(var(--p)/.4); }

        @media(max-width:900px){ .mb-grid{ grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
