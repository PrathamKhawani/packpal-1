import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [form, setForm] = useState({ 
    destination: tripConfig.destination || '', 
    days: 3, 
    budget: tripConfig.budget || 0, 
    vibe: 'balanced' 
  });
  const [expandedDay, setExpandedDay] = useState(0);

  const generateAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setItinerary(data);
    } catch (err) {
      alert(err.message || 'Failed to generate itinerary. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  // Flatten all activities for the map
  const allActivities = itinerary?.days?.flatMap(day => day.activities) || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="itinerary-page">
      <div className="itinerary-header glass no-print">
        <div className="header-info">
          <h1>AI Trip Planner</h1>
          <p>Get a custom itinerary for {form.destination || 'your next adventure'}</p>
        </div>
        <div className="header-actions-group">
            {itinerary && (
                <>
                    <button className="btn btn-secondary btn-icon-text" onClick={handlePrint}><Download size={16} /> PDF</button>
                    <button className="btn btn-secondary btn-icon-text"><Share2 size={16} /> Share</button>
                </>
            )}
        </div>
      </div>

      <div className={`itinerary-content ${itinerary ? 'has-data' : ''}`}>
        <div className="form-section glass">
          <div className="input-grid">
            <div className="input-group">
              <label><MapPin size={14} /> Destination</label>
              <input 
                value={form.destination} 
                onChange={e => setForm({...form, destination: e.target.value})} 
                placeholder="Where to?" 
              />
            </div>
            <div className="input-group">
              <label><Calendar size={14} /> Duration (Days)</label>
              <input 
                type="number" 
                value={form.days} 
                onChange={e => setForm({...form, days: parseInt(e.target.value)})} 
              />
            </div>
            <div className="input-group">
              <label><Wallet size={14} /> Budget (₹)</label>
              <input 
                type="number" 
                value={form.budget} 
                onChange={e => setForm({...form, budget: parseInt(e.target.value)})} 
              />
            </div>
            <div className="input-group">
              <label><Compass size={14} /> Vibe</label>
              <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                <option value="balanced">Balanced</option>
                <option value="adventure">Adventure</option>
                <option value="relaxed">Relaxed</option>
                <option value="culture">Culture</option>
              </select>
            </div>
          </div>
          <button 
            className={`btn btn-primary generate-btn ${loading ? 'loading' : ''}`} 
            onClick={generateAI} 
            disabled={loading}
          >
            {loading ? 'Crafting Itinerary...' : <><Sparkles size={18} /> Generate with AI</>}
          </button>
        </div>

        {itinerary && (
          <div className="itinerary-layout-grid">
            <div className="days-list">
              {itinerary.days.map((day, idx) => (
                <div key={idx} className={`day-card glass ${expandedDay === idx ? 'expanded' : ''}`}>
                  <div className="day-header" onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                    <div className="day-info">
                      <span className="day-label">Day {day.day}</span>
                      <h3>{day.theme}</h3>
                    </div>
                    {expandedDay === idx ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  
                  <AnimatePresence>
                    {expandedDay === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="day-details"
                      >
                        {day.activities.map((act, i) => (
                          <div key={i} className="activity-item">
                            <div className="act-time"><Clock size={12} /> {act.time}</div>
                            <div className="act-content">
                              <h4>{act.activity}</h4>
                              <p>{act.description}</p>
                              {act.cost > 0 && <span className="act-cost">₹{act.cost}</span>}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="map-sidebar">
              <div className="map-container-inner glass">
                <div className="map-header">
                    <MapIcon size={16} />
                    <span>Interactive Route</span>
                </div>
                <TripMap activities={allActivities} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .itinerary-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .itinerary-header { padding: 1.5rem 2rem; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .header-info h1 { font-size: 1.75rem; color: hsl(var(--p)); }
        .header-info p { color: hsl(var(--text-muted)); font-size: 0.875rem; }
        .btn-icon-text { font-size: 0.75rem; padding: 0.5rem 0.875rem; }

        .itinerary-content { display: flex; flex-direction: column; gap: 1.5rem; transition: 0.3s; }
        .form-section { padding: 1.5rem; border-radius: 16px; }
        .input-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
        .generate-btn { width: 100%; padding: 1rem; font-size: 1rem; gap: 0.75rem; }
        .generate-btn.loading { opacity: 0.8; cursor: wait; }

        .itinerary-layout-grid { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; align-items: start; }
        .days-list { display: flex; flex-direction: column; gap: 1rem; }
        .day-card { border-radius: 12px; overflow: hidden; }
        .day-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
        .day-header:hover { background: hsla(var(--p) / 0.05); }
        .day-label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--p)); text-transform: uppercase; letter-spacing: 0.1em; }
        .day-info h3 { font-size: 1.125rem; margin-top: 0.25rem; }
        
        .day-details { padding: 0 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px solid hsla(var(--border) / 0.5); padding-top: 1.25rem; }
        .activity-item { display: flex; gap: 1.25rem; position: relative; }
        .activity-item::before { content: ''; position: absolute; left: 6px; top: 20px; bottom: -20px; width: 1px; background: hsla(var(--border) / 0.8); }
        .activity-item:last-child::before { display: none; }
        .act-time { min-width: 65px; font-size: 0.7rem; font-weight: 700; color: hsl(var(--p)); display: flex; align-items: center; gap: 0.375rem; height: fit-content; margin-top: 2px; }
        .act-content h4 { font-size: 0.9375rem; margin-bottom: 0.25rem; }
        .act-content p { font-size: 0.8125rem; color: hsl(var(--text-muted)); line-height: 1.5; }
        .act-cost { display: inline-block; margin-top: 0.5rem; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; background: hsla(var(--success) / 0.1); color: hsl(var(--success)); border-radius: 4px; }

        .map-sidebar { position: sticky; top: 1.5rem; }
        .map-container-inner { border-radius: 16px; overflow: hidden; height: 500px; display: flex; flex-direction: column; }
        .map-header { padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 800; color: hsl(var(--p)); display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid hsla(var(--border) / 0.5); }

        @media (max-width: 1100px) {
            .itinerary-layout-grid { grid-template-columns: 1fr; }
            .map-sidebar { position: static; height: 400px; order: -1; }
        }
        @media print {
            .no-print { display: none !important; }
            .form-section { display: none !important; }
            .map-sidebar { display: none !important; }
            .itinerary-layout-grid { display: block !important; }
            .day-card { page-break-inside: avoid; border: 1px solid #eee !important; margin-bottom: 1rem; }
            .day-details { display: flex !important; height: auto !important; opacity: 1 !important; }
            .layout-container { display: block !important; padding: 0 !important; }
            .sidebar { display: none !important; }
            .main-content { margin: 0 !important; padding: 0 !important; width: 100% !important; }
            .itinerary-page { gap: 0 !important; }
            h3, h4 { color: #000 !important; }
        }
      `}</style>
    </div>
  );
}
