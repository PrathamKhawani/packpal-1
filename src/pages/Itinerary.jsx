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
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response received:", text);
        throw new Error("AI server returned an invalid response. Please check if your GEMINI_API_KEY is configured in Vercel.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setItinerary(data);
    } catch (err) {
      alert(err.message || 'Failed to generate itinerary. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const allActivities = itinerary?.days?.flatMap(day => day.activities) || [];
  const handlePrint = () => window.print();

  return (
    <div className="itinerary-page-compact">
      <div className="itinerary-header-compact glass no-print">
        <div className="header-info">
          <h2>AI Trip Planner</h2>
          <p>Custom plan for {form.destination || 'your next adventure'}</p>
        </div>
        <div className="header-actions">
            {itinerary && (
                <>
                    <button className="btn-ico" onClick={handlePrint}><Download size={16} /></button>
                    <button className="btn-ico"><Share2 size={16} /></button>
                </>
            )}
        </div>
      </div>

      <div className={`itinerary-content-compact ${itinerary ? 'has-itinerary' : ''}`}>
        <div className="planner-form glass">
          <div className="form-grid-compact">
            <div className="field">
              <label><MapPin size={12} /> Dest</label>
              <input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
            </div>
            <div className="field">
              <label><Calendar size={12} /> Days</label>
              <input type="number" value={form.days} onChange={e => setForm({...form, days: parseInt(e.target.value)})} />
            </div>
            <div className="field">
              <label><Wallet size={12} /> Budget</label>
              <input type="number" value={form.budget} onChange={e => setForm({...form, budget: parseInt(e.target.value)})} />
            </div>
            <div className="field">
              <label><Compass size={12} /> Vibe</label>
              <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                <option value="balanced">Balanced</option>
                <option value="adventure">Adventure</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>
          <button className={`btn-gen ${loading ? 'loading' : ''}`} onClick={generateAI} disabled={loading}>
            {loading ? 'Crafting...' : <><Sparkles size={14} /> Generate Plan</>}
          </button>
        </div>

        {itinerary && (
          <div className="itinerary-layout-compact">
            <div className="itinerary-list">
              {itinerary.days.map((day, idx) => (
                <div key={idx} className={`day-card-compact glass ${expandedDay === idx ? 'active' : ''}`}>
                  <div className="day-header" onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                    <div className="day-meta">
                      <span className="day-num">DAY {day.day}</span>
                      <h4>{day.theme}</h4>
                    </div>
                    {expandedDay === idx ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  
                  <AnimatePresence>
                    {expandedDay === idx && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="day-content">
                        {day.activities.map((act, i) => (
                          <div key={i} className="act-row">
                            <div className="act-time"><Clock size={10} /> {act.time}</div>
                            <div className="act-body">
                              <h5>{act.activity}</h5>
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

            <div className="itinerary-map-sidebar">
              <div className="map-card glass">
                <div className="map-head"><MapIcon size={12} /> <span>Route Preview</span></div>
                <div className="map-view-wrapper"><TripMap activities={allActivities} /></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .itinerary-page-compact { display: flex; flex-direction: column; gap: 1rem; }
        .itinerary-header-compact { padding: 1rem 1.25rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .header-info h2 { font-size: 1.25rem; font-weight: 800; color: hsl(var(--p)); }
        .header-info p { font-size: 0.75rem; color: hsl(var(--text-muted)); }
        .header-actions { display: flex; gap: 0.5rem; }
        .btn-ico { width: 32px; height: 32px; border-radius: 8px; border: 1px solid hsla(var(--border) / 0.8); background: transparent; color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-ico:hover { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }

        .itinerary-content-compact { display: flex; flex-direction: column; gap: 1rem; }
        .planner-form { padding: 1rem; border-radius: 12px; }
        .form-grid-compact { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .field { display: flex; flex-direction: column; gap: 4px; }
        .field label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
        .field input, .field select { padding: 0.5rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.8125rem; outline: none; }
        .btn-gen { width: 100%; padding: 0.75rem; border-radius: 8px; border: none; background: hsl(var(--p)); color: #fff; font-weight: 800; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .itinerary-layout-compact { display: grid; grid-template-columns: 1fr 300px; gap: 1rem; align-items: start; }
        .itinerary-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .day-card-compact { border-radius: 10px; overflow: hidden; }
        .day-header { padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .day-header:hover { background: hsla(var(--text) / 0.02); }
        .day-num { font-size: 0.6rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: 0.05em; }
        .day-header h4 { font-size: 0.9375rem; }
        
        .day-content { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid hsla(var(--border) / 0.5); padding-top: 1rem; }
        .act-row { display: flex; gap: 1rem; position: relative; }
        .act-row::before { content: ''; position: absolute; left: 5px; top: 15px; bottom: -15px; width: 1px; background: hsla(var(--border) / 0.5); }
        .act-row:last-child::before { display: none; }
        .act-time { min-width: 60px; font-size: 0.65rem; font-weight: 800; color: hsl(var(--p)); display: flex; align-items: center; gap: 4px; }
        .act-body h5 { font-size: 0.8125rem; margin-bottom: 2px; }
        .act-body p { font-size: 0.75rem; color: hsl(var(--text-muted)); line-height: 1.4; }
        .act-cost { font-size: 0.65rem; font-weight: 800; color: hsl(var(--success)); background: hsla(var(--success) / 0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; }

        .itinerary-map-sidebar { position: sticky; top: 1rem; }
        .map-card { border-radius: 12px; overflow: hidden; height: 400px; display: flex; flex-direction: column; }
        .map-head { padding: 0.5rem 0.75rem; font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); display: flex; align-items: center; gap: 6px; border-bottom: 1px solid hsla(var(--border) / 0.5); }
        .map-view-wrapper { flex: 1; min-height: 0; }

        @media (max-width: 900px) {
            .itinerary-layout-compact { grid-template-columns: 1fr; }
            .itinerary-map-sidebar { position: static; height: 300px; order: -1; }
        }

        @media print {
            .no-print { display: none !important; }
            .planner-form { display: none !important; }
            .itinerary-map-sidebar { display: none !important; }
            .itinerary-layout-compact { display: block !important; }
            .day-card-compact { page-break-inside: avoid; border: 1px solid #eee !important; margin-bottom: 10px; }
            .day-content { display: flex !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
}
