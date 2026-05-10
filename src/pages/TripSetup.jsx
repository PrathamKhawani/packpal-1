import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, Users, Compass,
  Zap, ChevronRight, CheckCircle2, ArrowRight,
  Globe, Mountain, Coffee, Briefcase, Sparkles,
  Info, Clock, Tag
} from 'lucide-react';

const TRIP_TYPES = [
  { id: 'adventure', label: 'Adventure',  icon: Mountain,  desc: 'Trekking, outdoor & thrills'  },
  { id: 'luxury',    label: 'Luxury',     icon: Sparkles,  desc: 'Premium stays & fine dining'  },
  { id: 'balanced',  label: 'Balanced',   icon: Compass,   desc: 'Mix of everything'            },
  { id: 'cultural',  label: 'Cultural',   icon: Coffee,    desc: 'Heritage, art & local life'   },
  { id: 'business',  label: 'Business',   icon: Briefcase, desc: 'Work-focused with comfort'    },
];

const STEPS = ['Trip Basics', 'Dates & Budget', 'Team & Vibe'];

export default function TripSetup() {
  const { tripConfig, setTripConfig, currentUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    tripName:       tripConfig.tripName       || '',
    destination:    tripConfig.destination    || '',
    startDate:      tripConfig.startDate && !isNaN(new Date(tripConfig.startDate)) ? new Date(tripConfig.startDate).toISOString().split('T')[0] : '',
    endDate:        tripConfig.endDate && !isNaN(new Date(tripConfig.endDate))     ? new Date(tripConfig.endDate).toISOString().split('T')[0]   : '',
    budget:         tripConfig.budget         || '',
    tripType:       tripConfig.tripType       || 'balanced',
    totalMembers:   tripConfig.totalMembers   || 2,
    notes:          tripConfig.notes          || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const tripDays = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000))
    : null;

  const canNext = [
    form.tripName.trim().length > 0 && form.destination.trim().length > 1,
    form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && form.budget,
    form.tripType && form.totalMembers >= 1,
  ];

  const handleFinish = () => {
    setTripConfig({
      ...tripConfig,
      tripName:      form.tripName,
      destination:   form.destination,
      startDate:     new Date(form.startDate).toISOString(),
      endDate:       new Date(form.endDate).toISOString(),
      budget:        parseFloat(form.budget),
      tripType:      form.tripType,
      totalMembers:  parseInt(form.totalMembers),
      notes:         form.notes,
      setupComplete: true,
    });
    navigate(`/${currentUser.role}/dashboard`);
  };

  // No skip — setup is mandatory for owners

  return (
    <div className="ts-root">
      <div className="ts-bg-pattern" />

      <motion.div className="ts-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="ts-head">
          <div className="ts-logo"><Globe size={18} /></div>
          <div>
            <div className="ts-eyebrow">PACKPAL — MISSION SETUP</div>
            <h1 className="ts-title">Configure Your <span className="ts-accent">Mission</span></h1>
            <p className="ts-sub">Fill in your trip details once — the entire platform personalises itself around your plan.</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="ts-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`ts-step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="ts-step-dot">
                {i < step ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
              </div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className={`ts-step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step Panels */}
        <AnimatePresence mode="wait">

          {/* ── STEP 0 — Trip Basics ── */}
          {step === 0 && (
            <motion.div key="s0" className="ts-panel" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="ts-field">
                <label><Tag size={13}/> Trip Name <span className="ts-required">*</span></label>
                <input
                  className="ts-input"
                  placeholder="e.g. Goa Summer Trip, Europe Backpack 2025..."
                  value={form.tripName}
                  onChange={e => set('tripName', e.target.value)}
                  autoFocus
                />
                <span className="ts-hint">A short name to identify this trip across the platform.</span>
              </div>
              <div className="ts-field">
                <label><MapPin size={13}/> Destination <span className="ts-required">*</span></label>
                <input
                  className="ts-input"
                  placeholder="e.g. Manali, Bali, Paris..."
                  value={form.destination}
                  onChange={e => set('destination', e.target.value)}
                />
                <span className="ts-hint">City, country, or region you're travelling to.</span>
              </div>
              <div className="ts-field">
                <label><Info size={13}/> Trip Notes (optional)</label>
                <textarea
                  className="ts-input ts-textarea"
                  placeholder="Any special goals, requirements, or context for this mission..."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP 1 — Dates & Budget ── */}
          {step === 1 && (
            <motion.div key="s1" className="ts-panel" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="ts-row2">
                <div className="ts-field">
                  <label><Calendar size={13}/> Start Date</label>
                  <input type="date" className="ts-input" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div className="ts-field">
                  <label><Calendar size={13}/> End Date</label>
                  <input type="date" className="ts-input" value={form.endDate} min={form.startDate} onChange={e => set('endDate', e.target.value)} />
                </div>
              </div>

              {tripDays && (
                <div className="ts-duration-badge">
                  <Clock size={13}/> <strong>{tripDays} day{tripDays > 1 ? 's' : ''}</strong> trip computed
                </div>
              )}

              <div className="ts-field">
                <label><Wallet size={13}/> Total Budget (₹)</label>
                <div className="ts-input-prefix">
                  <span>₹</span>
                  <input
                    type="number"
                    className="ts-input no-border"
                    placeholder="e.g. 80000"
                    value={form.budget}
                    onChange={e => set('budget', e.target.value)}
                  />
                </div>
                <span className="ts-hint">This is your total trip budget across all members.</span>
              </div>

              {form.budget && tripDays && (
                <div className="ts-budget-breakdown">
                  <div className="ts-bb-item"><span>Per day</span><strong>₹{Math.round(form.budget / tripDays).toLocaleString()}</strong></div>
                  <div className="ts-bb-item"><span>Per person/day</span><strong>₹{form.totalMembers > 0 ? Math.round(form.budget / tripDays / form.totalMembers).toLocaleString() : '—'}</strong></div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2 — Team & Vibe ── */}
          {step === 2 && (
            <motion.div key="s2" className="ts-panel" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="ts-field">
                <label><Users size={13}/> Total Members</label>
                <div className="ts-member-row">
                  <button className="ts-count-btn" onClick={() => set('totalMembers', Math.max(1, form.totalMembers - 1))}>−</button>
                  <div className="ts-count-display">
                    <strong>{form.totalMembers}</strong>
                    <span>people</span>
                  </div>
                  <button className="ts-count-btn" onClick={() => set('totalMembers', Math.min(50, form.totalMembers + 1))}>+</button>
                </div>
              </div>

              <div className="ts-field">
                <label><Zap size={13}/> Trip Vibe</label>
                <div className="ts-vibe-grid">
                  {TRIP_TYPES.map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        className={`ts-vibe-btn ${form.tripType === t.id ? 'selected' : ''}`}
                        onClick={() => set('tripType', t.id)}
                      >
                        <Icon size={18} />
                        <strong>{t.label}</strong>
                        <span>{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="ts-footer">
          <div className="ts-footer-left">
            <span className="ts-step-count">Step {step + 1} of {STEPS.length}</span>
          </div>
          <div className="ts-footer-right">
            {step > 0 && (
              <button className="ts-back-btn" onClick={() => setStep(s => s - 1)}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                className="ts-next-btn"
                disabled={!canNext[step]}
                onClick={() => setStep(s => s + 1)}
              >
                Next <ChevronRight size={16}/>
              </button>
            ) : (
              <button
                className="ts-finish-btn"
                disabled={!canNext[2]}
                onClick={handleFinish}
              >
                <ArrowRight size={16}/> Launch Mission
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .ts-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          background: hsl(var(--bg));
        }
        .ts-bg-pattern {
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, hsla(var(--p)/.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsla(var(--success)/.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .ts-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 680px;
          background: hsl(var(--bg-card));
          border: 1px solid hsl(var(--border));
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }

        /* Head */
        .ts-head { display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 2rem; }
        .ts-logo { width: 48px; height: 48px; border-radius: 14px; background: hsl(var(--p)); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ts-eyebrow { font-size: 0.58rem; font-weight: 800; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 0.3rem; }
        .ts-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 0.35rem; }
        .ts-accent { color: hsl(var(--p)); }
        .ts-sub { font-size: 0.825rem; color: hsl(var(--text-muted)); line-height: 1.5; margin: 0; }

        /* Steps */
        .ts-steps { display: flex; align-items: center; margin-bottom: 2rem; gap: 0; }
        .ts-step-item { display: flex; align-items: center; gap: 8px; flex: 1; }
        .ts-step-item:last-child { flex: none; }
        .ts-step-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid hsl(var(--border)); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); flex-shrink: 0; background: hsl(var(--bg)); transition: 0.2s; }
        .ts-step-item.active .ts-step-dot { border-color: hsl(var(--p)); background: hsl(var(--p)); color: #fff; }
        .ts-step-item.done .ts-step-dot { border-color: hsl(var(--success)); background: hsl(var(--success)); color: #fff; }
        .ts-step-item span { font-size: 0.72rem; font-weight: 700; color: hsl(var(--text-muted)); white-space: nowrap; }
        .ts-step-item.active span { color: hsl(var(--p)); }
        .ts-step-line { flex: 1; height: 2px; background: hsl(var(--border)); margin: 0 8px; border-radius: 2px; }
        .ts-step-line.done { background: hsl(var(--success)); }

        /* Panel */
        .ts-panel { min-height: 280px; display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }

        /* Fields */
        .ts-field { display: flex; flex-direction: column; gap: 6px; }
        .ts-field label { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.07em; display: flex; align-items: center; gap: 6px; }
        .ts-input { padding: 0.75rem 1rem; border: 1px solid hsl(var(--border)); border-radius: 10px; font-size: 0.9rem; font-weight: 600; color: hsl(var(--text)); background: hsl(var(--bg)); outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; width: 100%; }
        .ts-input:focus { border-color: hsl(var(--p)); box-shadow: 0 0 0 3px hsla(var(--p)/.15); }
        .ts-textarea { resize: vertical; min-height: 80px; }
        .ts-hint { font-size: 0.7rem; color: hsl(var(--text-muted)); }
        .ts-required { color: hsl(var(--danger)); margin-left: 2px; }
        .ts-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ts-step-count { font-size: 0.72rem; font-weight: 700; color: hsl(var(--text-muted)); }
        .ts-footer-left { display: flex; align-items: center; }

        /* Duration badge */
        .ts-duration-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 700; color: hsl(var(--p)); background: hsla(var(--p)/.08); border: 1px solid hsla(var(--p)/.2); padding: 6px 14px; border-radius: 100px; width: fit-content; }

        /* Budget prefix input */
        .ts-input-prefix { display: flex; align-items: center; border: 1px solid hsl(var(--border)); border-radius: 10px; overflow: hidden; background: hsl(var(--bg)); transition: border-color 0.2s, box-shadow 0.2s; }
        .ts-input-prefix:focus-within { border-color: hsl(var(--p)); box-shadow: 0 0 0 3px hsla(var(--p)/.15); }
        .ts-input-prefix span { padding: 0 1rem; font-size: 1rem; font-weight: 700; color: hsl(var(--text-muted)); border-right: 1px solid hsl(var(--border)); background: hsl(var(--bg-card)); }
        .ts-input.no-border { border: none; box-shadow: none; background: transparent; flex: 1; }
        .ts-input.no-border:focus { box-shadow: none; }

        /* Budget breakdown */
        .ts-budget-breakdown { display: flex; gap: 1rem; }
        .ts-bb-item { flex: 1; background: hsl(var(--bg)); border: 1px solid hsl(var(--border)); border-radius: 10px; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 2px; }
        .ts-bb-item span { font-size: 0.65rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.06em; }
        .ts-bb-item strong { font-size: 1.1rem; font-weight: 800; color: hsl(var(--p)); }

        /* Members counter */
        .ts-member-row { display: flex; align-items: center; gap: 1.5rem; }
        .ts-count-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid hsl(var(--border)); background: hsl(var(--bg)); color: hsl(var(--text)); font-size: 1.25rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.15s; }
        .ts-count-btn:hover { border-color: hsl(var(--p)); color: hsl(var(--p)); background: hsla(var(--p)/.05); }
        .ts-count-display { text-align: center; }
        .ts-count-display strong { font-size: 2.5rem; font-weight: 800; color: hsl(var(--text)); line-height: 1; display: block; }
        .ts-count-display span { font-size: 0.7rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; }

        /* Vibe Grid */
        .ts-vibe-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.6rem; }
        .ts-vibe-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 0.875rem 0.5rem; border: 1px solid hsl(var(--border)); border-radius: 12px; background: hsl(var(--bg)); cursor: pointer; transition: 0.15s; color: hsl(var(--text-muted)); }
        .ts-vibe-btn:hover { border-color: hsl(var(--p)); color: hsl(var(--p)); background: hsla(var(--p)/.05); }
        .ts-vibe-btn.selected { border-color: hsl(var(--p)); background: hsla(var(--p)/.08); color: hsl(var(--p)); }
        .ts-vibe-btn strong { font-size: 0.68rem; font-weight: 800; white-space: nowrap; }
        .ts-vibe-btn span { font-size: 0.55rem; color: hsl(var(--text-muted)); text-align: center; line-height: 1.3; display: none; }
        @media(min-width: 600px) { .ts-vibe-btn span { display: block; } }

        /* Footer */
        .ts-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid hsl(var(--border)); padding-top: 1.5rem; }
        .ts-footer-right { display: flex; gap: 0.75rem; align-items: center; }
        .ts-back-btn { padding: 0.7rem 1.25rem; border: 1px solid hsl(var(--border)); border-radius: 8px; background: hsl(var(--bg-card)); font-size: 0.82rem; font-weight: 700; color: hsl(var(--text)); cursor: pointer; transition: 0.15s; }
        .ts-back-btn:hover { border-color: hsl(var(--text-muted)); }
        .ts-next-btn { padding: 0.7rem 1.5rem; border: none; border-radius: 8px; background: hsl(var(--p)); color: #fff; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
        .ts-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ts-next-btn:not(:disabled):hover { background: hsl(var(--p-dark)); transform: translateY(-1px); }
        .ts-finish-btn { padding: 0.7rem 1.75rem; border: none; border-radius: 8px; background: hsl(var(--success)); color: #fff; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 16px hsla(var(--success)/.3); transition: 0.2s; }
        .ts-finish-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .ts-finish-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 20px hsla(var(--success)/.4); }

        @media(max-width: 480px) {
          .ts-card { padding: 1.5rem; }
          .ts-vibe-grid { grid-template-columns: repeat(3, 1fr); }
          .ts-row2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
