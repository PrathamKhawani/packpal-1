import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  MapPin as Pin, Heart, Info as InfoIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig, theme } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [form, setForm] = useState({ 
    destination: tripConfig.destination || '', 
    days: 3, 
    budget: tripConfig.budget || 50000, 
    vibe: 'balanced' 
  });

  const generateAI = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } catch (e) {
        return await generateDirectly();
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          return await generateDirectly();
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

  const generateDirectly = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Local API Key missing. Please add VITE_GEMINI_API_KEY to your .env file.");

    let modelName = "gemini-1.5-flash"; 
    try {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelsData = await modelsRes.json();
        if (modelsData.models) {
            const bestModel = modelsData.models.find(m => m.name.includes("1.5-flash") || m.name.includes("flash")) || modelsData.models[0];
            modelName = bestModel.name.split("/").pop();
        }
    } catch (e) {}

    const prompt = `Generate a ${form.days}-day itinerary for ${form.destination}. Budget: ₹${form.budget}. Return ONLY JSON: {
      "destination": "${form.destination}",
      "lodgingSuggestions": [{ "name": "...", "type": "...", "priceRange": "...", "why": "..." }],
      "mustTryFoods": [{ "dish": "...", "description": "..." }],
      "days": [{
        "day": 1, "theme": "...", 
        "activities": [{ "time": "9:00 AM", "activity": "...", "description": "...", "cost": 0, "lat": 0, "lng": 0 }],
        "diningHighlights": [{ "name": "...", "cuisine": "...", "specialty": "..." }]
      }]
    }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return valid data.");
    setItinerary(JSON.parse(jsonMatch[0]));
  };

  const allActivities = itinerary?.days?.flatMap(day => day.activities) || [];
  const handlePrint = () => window.print();

  return (
    <div className="it-root">
      {/* Search Header */}
      <div className="it-header glass no-print">
        <div className="h-info">
          <h2>AI Travel Architect</h2>
          <p>Designing your perfect escape to <span>{form.destination}</span></p>
        </div>
        <div className="h-actions">
           {itinerary && <button className="btn-circ" onClick={handlePrint}><Download size={16} /></button>}
           <button className="btn-circ"><Share2 size={16} /></button>
        </div>
      </div>

      <div className="it-layout">
        {/* Left: Input & Global Context */}
        <div className="it-sidebar no-print">
          <div className="card-mini glass">
             <h3>MISSION PARAMETERS</h3>
             <div className="mini-form">
                <div className="m-field">
                    <label><MapPin size={10} /> WHERE</label>
                    <input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
                </div>
                <div className="m-row">
                    <div className="m-field">
                        <label><Calendar size={10} /> DAYS</label>
                        <input type="number" value={form.days} onChange={e => setForm({...form, days: e.target.value})} />
                    </div>
                    <div className="m-field">
                        <label><TrendingUp size={10} /> VIBE</label>
                        <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                            <option value="balanced">Balanced</option>
                            <option value="adventure">Hardcore</option>
                            <option value="relaxed">Relaxed</option>
                        </select>
                    </div>
                </div>
                <button className={`btn-primary-it ${loading ? 'loading' : ''}`} onClick={generateAI}>
                    {loading ? 'CALCULATING...' : <><Sparkles size={14} /> GENERATE</>}
                </button>
             </div>
          </div>

          {itinerary && (
              <>
                <motion.div className="card-mini glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3><Hotel size={12} /> RECOMMENDED STAY</h3>
                    {itinerary.lodgingSuggestions?.map((h, i) => (
                        <div key={i} className="lodging-item">
                            <div className="l-head"><strong>{h.name}</strong> <span>{h.priceRange}</span></div>
                            <p>{h.why}</p>
                        </div>
                    ))}
                </motion.div>

                <motion.div className="card-mini glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <h3><Utensils size={12} /> CULINARY MUST-TRY</h3>
                    <div className="food-grid">
                        {itinerary.mustTryFoods?.map((f, i) => (
                            <div key={i} className="food-pill">
                                <strong>{f.dish}</strong>
                                <span>{f.description}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
              </>
          )}
        </div>

        {/* Center: Itinerary Feed */}
        <div className="it-feed">
            {!itinerary && !loading && (
                <div className="empty-state glass">
                    <Compass size={48} className="icon-anim" />
                    <h3>Ready for Takeoff?</h3>
                    <p>Enter your details and let our AI build a high-fidelity itinerary for your next trip.</p>
                </div>
            )}

            {itinerary && itinerary.days.map((day, idx) => (
                <motion.div key={idx} className={`day-card-v2 glass ${expandedDay === idx ? 'active' : ''}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <div className="day-header-v2" onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                        <div className="day-info">
                            <span className="day-badge">DAY {day.day}</span>
                            <h4>{day.theme}</h4>
                        </div>
                        <div className="day-arr">{expandedDay === idx ? <ChevronDown /> : <ChevronRight />}</div>
                    </div>
                    
                    <AnimatePresence>
                        {expandedDay === idx && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="day-content-v2">
                                <div className="activities-list">
                                    {day.activities.map((act, i) => (
                                        <div key={i} className="activity-row-v2">
                                            <div className="a-time">{act.time}</div>
                                            <div className="a-point" />
                                            <div className="a-main">
                                                <h5>{act.activity}</h5>
                                                <p>{act.description}</p>
                                                <div className="a-meta">
                                                    <span className={`a-type ${act.type}`}>{act.type}</span>
                                                    {act.cost > 0 && <span className="a-cost">₹{act.cost}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {day.diningHighlights && (
                                    <div className="dining-section">
                                        <h5><Utensils size={10} /> GASTRONOMY</h5>
                                        <div className="dining-grid">
                                            {day.diningHighlights.map((d, i) => (
                                                <div key={i} className="dining-card glass">
                                                    <strong>{d.name}</strong>
                                                    <span>{d.specialty} • {d.cuisine}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>

        {/* Right: Map View */}
        <div className="it-map-view no-print">
            <div className="map-sticky glass">
                <div className="map-top">
                    <MapIcon size={14} /> <span>LIVE ROUTE</span>
                </div>
                <div className="map-container-it">
                    <TripMap activities={allActivities} />
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .it-root { display: flex; flex-direction: column; gap: 1rem; }
        .it-header { padding: 1rem 1.5rem; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .h-info h2 { font-size: 1.25rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: -0.02em; }
        .h-info p { font-size: 0.75rem; color: hsl(var(--text-muted)); }
        .h-info p span { color: hsl(var(--text)); font-weight: 700; }
        .btn-circ { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--glass-border); background: transparent; color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-circ:hover { background: hsla(var(--p) / 0.1); color: hsl(var(--p)); }

        .it-layout { display: grid; grid-template-columns: 240px 1fr 300px; gap: 1rem; align-items: start; }
        
        .card-mini { padding: 1rem; border-radius: 14px; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .card-mini h3 { font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
        
        .mini-form { display: flex; flex-direction: column; gap: 0.75rem; }
        .m-field { display: flex; flex-direction: column; gap: 4px; }
        .m-field label { font-size: 0.55rem; font-weight: 800; color: hsl(var(--text-muted)); }
        .m-field input, .m-field select { background: hsla(var(--text) / 0.03); border: 1px solid hsl(var(--border)); border-radius: 8px; padding: 0.4rem 0.6rem; font-size: 0.75rem; color: inherit; outline: none; }
        .m-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        
        .btn-primary-it { width: 100%; padding: 0.6rem; border-radius: 8px; border: none; background: hsl(var(--p)); color: #fff; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 10px hsla(var(--p) / 0.3); }

        .lodging-item { border-left: 2px solid hsla(var(--p) / 0.3); padding-left: 0.75rem; }
        .l-head { display: flex; justify-content: space-between; align-items: center; }
        .l-head strong { font-size: 0.75rem; }
        .l-head span { font-size: 0.6rem; background: hsla(var(--p) / 0.1); padding: 1px 4px; border-radius: 4px; }
        .lodging-item p { font-size: 0.65rem; color: hsl(var(--text-muted)); margin-top: 2px; }

        .food-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .food-pill { display: flex; flex-direction: column; background: hsla(var(--text) / 0.03); padding: 0.5rem; border-radius: 8px; }
        .food-pill strong { font-size: 0.7rem; }
        .food-pill span { font-size: 0.6rem; color: hsl(var(--text-muted)); }

        /* Feed */
        .empty-state { height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; border-radius: 20px; color: hsl(var(--text-muted)); }
        .icon-anim { color: hsl(var(--p)); opacity: 0.5; margin-bottom: 1rem; }

        .day-card-v2 { border-radius: 16px; margin-bottom: 0.75rem; overflow: hidden; }
        .day-header-v2 { padding: 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
        .day-header-v2:hover { background: hsla(var(--text) / 0.02); }
        .day-badge { font-size: 0.55rem; font-weight: 900; background: hsl(var(--p)); color: #fff; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px; display: inline-block; }
        .day-info h4 { font-size: 0.9375rem; font-weight: 800; }
        
        .day-content-v2 { padding: 0 1rem 1rem; border-top: 1px solid var(--glass-border); padding-top: 1rem; }
        .activity-row-v2 { display: flex; gap: 1rem; position: relative; padding-bottom: 1.5rem; }
        .activity-row-v2::before { content: ''; position: absolute; left: 63px; top: 12px; bottom: 0; width: 1px; background: hsla(var(--border) / 0.5); }
        .activity-row-v2:last-child::before { display: none; }
        .a-time { min-width: 60px; font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); padding-top: 2px; }
        .a-point { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--p)); margin-top: 6px; z-index: 2; box-shadow: 0 0 0 3px hsla(var(--p) / 0.1); }
        .a-main h5 { font-size: 0.8125rem; font-weight: 700; }
        .a-main p { font-size: 0.75rem; color: hsl(var(--text-muted)); margin-top: 2px; }
        .a-meta { display: flex; gap: 0.5rem; margin-top: 4px; }
        .a-type { font-size: 0.55rem; font-weight: 900; text-transform: uppercase; padding: 1px 5px; border-radius: 3px; background: hsla(var(--text) / 0.05); }
        .a-cost { font-size: 0.6rem; font-weight: 800; color: hsl(var(--success)); }

        .dining-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--glass-border); }
        .dining-section h5 { font-size: 0.6rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px; }
        .dining-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .dining-card { padding: 0.5rem; border-radius: 8px; display: flex; flex-direction: column; }
        .dining-card strong { font-size: 0.7rem; }
        .dining-card span { font-size: 0.6rem; color: hsl(var(--text-muted)); }

        .map-sticky { position: sticky; top: 0; height: 500px; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
        .map-top { padding: 0.75rem; font-size: 0.6rem; font-weight: 900; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid var(--glass-border); }
        .map-container-it { flex: 1; min-height: 0; }

        @media (max-width: 1200px) {
            .it-layout { grid-template-columns: 200px 1fr; }
            .it-map-view { display: none; }
        }
        @media (max-width: 768px) {
            .it-layout { grid-template-columns: 1fr; }
            .it-sidebar { order: -1; }
        }
      `}</style>
    </div>
  );
}
