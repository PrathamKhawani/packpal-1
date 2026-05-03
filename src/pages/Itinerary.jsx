import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  Globe, Zap, Heart, MapPin as PinIcon, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [heroImg, setHeroImg] = useState('');
  const [form, setForm] = useState({ 
    destination: tripConfig.destination || '', 
    days: 3, 
    budget: tripConfig.budget || 50000, 
    vibe: 'balanced' 
  });

  useEffect(() => {
    if (form.destination) {
      setHeroImg(`https://source.unsplash.com/featured/1600x900?${encodeURIComponent(form.destination)}&t=${Date.now()}`);
    }
  }, [itinerary]);

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
    if (!apiKey) throw new Error("Local API Key missing.");

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
      "summary": "Short inspiring hook.",
      "lodgingSuggestions": [{ "name": "...", "type": "...", "priceRange": "...", "why": "..." }],
      "mustTryFoods": [{ "dish": "...", "description": "..." }],
      "days": [{
        "day": 1, "theme": "...", 
        "activities": [{ "time": "9:00 AM", "activity": "...", "description": "...", "type": "sightseeing", "cost": 0, "lat": 0, "lng": 0 }],
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

  return (
    <div className="it-v3-container">
      {/* Cinematic Hero Header */}
      <section className="it-hero" style={{ backgroundImage: `url(${heroImg || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600'})` }}>
        <div className="hero-overlay" />
        <div className="hero-content-v3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero-tag">
                <Globe size={12} /> EXPLORING {form.destination.toUpperCase()}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {itinerary ? `Journey through ${itinerary.destination}` : 'Design Your Escape'}
            </motion.h1>
            <p className="hero-sub">{itinerary?.summary || 'Define your parameters and let AI orchestrate your perfect adventure.'}</p>
            
            <div className="quick-stats-v3">
                <div className="qs-item"><span>{form.days}</span> DAYS</div>
                <div className="qs-item"><span>₹{(form.budget/1000).toFixed(0)}K</span> BUDGET</div>
                <div className="qs-item"><span>{form.vibe}</span> VIBE</div>
            </div>
        </div>
      </section>

      <div className="it-main-grid-v3">
        {/* Floating Controls Sidebar */}
        <aside className="it-controls-v3 no-print">
            <div className="glass-card-v3 controls-card">
                <h3>PLAN PARAMETERS</h3>
                <div className="f-group-v3">
                    <label>Destination</label>
                    <div className="f-input-v3"><MapPin size={14} /><input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} /></div>
                </div>
                <div className="f-row-v3">
                    <div className="f-group-v3">
                        <label>Days</label>
                        <input type="number" className="f-solo-v3" value={form.days} onChange={e => setForm({...form, days: e.target.value})} />
                    </div>
                    <div className="f-group-v3">
                        <label>Vibe</label>
                        <select className="f-solo-v3" value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                            <option value="balanced">Balanced</option>
                            <option value="adventure">Action</option>
                            <option value="relaxed">Zen</option>
                        </select>
                    </div>
                </div>
                <button className={`btn-generate-v3 ${loading ? 'loading' : ''}`} onClick={generateAI}>
                    {loading ? <div className="loader-v3" /> : <><Sparkles size={16} /> REBUILD ITINERARY</>}
                </button>
            </div>

            {itinerary && (
                <>
                <motion.div className="glass-card-v3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="card-head-v3"><Hotel size={14} /> <span>PREMIUM LODGING</span></div>
                    <div className="hotel-list-v3">
                        {itinerary.lodgingSuggestions?.map((h, i) => (
                            <div key={i} className="hotel-item-v3">
                                <strong>{h.name}</strong>
                                <p>{h.why}</p>
                                <span>{h.priceRange}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="glass-card-v3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="card-head-v3"><Utensils size={14} /> <span>LOCAL GEMS</span></div>
                    <div className="food-list-v3">
                        {itinerary.mustTryFoods?.map((f, i) => (
                            <div key={i} className="food-item-v3">
                                <strong>{f.dish}</strong>
                                <p>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
                </>
            )}
        </aside>

        {/* Timeline Feed */}
        <section className="it-timeline-v3">
            {!itinerary && !loading && (
                <div className="welcome-state-v3 glass">
                    <Zap size={48} className="zap-anim" />
                    <h2>Ready for Takeoff?</h2>
                    <p>Enter your destination and let our AI architect your next premium travel experience.</p>
                </div>
            )}

            {itinerary && itinerary.days.map((day, idx) => (
                <motion.div key={idx} className={`day-v3 ${expandedDay === idx ? 'active' : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <div className="day-toggle-v3" onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                        <div className="day-num-v3">DAY {day.day}</div>
                        <div className="day-meta-v3">
                            <h4>{day.theme}</h4>
                            <span>{day.activities.length} Activities • {day.diningHighlights?.length || 0} Dining</span>
                        </div>
                        <div className="day-icon-v3">{expandedDay === idx ? <ChevronDown /> : <ChevronRight />}</div>
                    </div>

                    <AnimatePresence>
                        {expandedDay === idx && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="day-details-v3">
                                <div className="activities-v3">
                                    {day.activities.map((act, i) => (
                                        <div key={i} className="act-v3">
                                            <div className="act-time-v3">{act.time}</div>
                                            <div className="act-line-v3">
                                                <div className="act-dot-v3" />
                                            </div>
                                            <div className="act-info-v3">
                                                <h5>{act.activity}</h5>
                                                <p>{act.description}</p>
                                                <div className="act-meta-v3">
                                                    <span className={`tag-v3 ${act.type}`}>{act.type}</span>
                                                    {act.cost > 0 && <span className="cost-v3">₹{act.cost}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {day.diningHighlights && (
                                    <div className="dining-v3">
                                        <div className="d-title-v3"><Utensils size={12} /> CULINARY HIGHLIGHTS</div>
                                        <div className="d-grid-v3">
                                            {day.diningHighlights.map((d, i) => (
                                                <div key={i} className="d-card-v3 glass">
                                                    <strong>{d.name}</strong>
                                                    <span>{d.cuisine} • {d.specialty}</span>
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
        </section>

        {/* Floating Map Sidebar */}
        <aside className="it-map-aside-v3 no-print">
            <div className="map-card-v3 glass">
                <div className="map-head-v3"><MapIcon size={14} /> <span>INTERACTIVE ROUTE</span></div>
                <div className="map-viewport-v3">
                    <TripMap activities={itinerary?.days?.flatMap(d => d.activities) || []} />
                </div>
            </div>
        </aside>
      </div>

      <style>{`
        .it-v3-container { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 5rem; }
        
        /* Hero Section */
        .it-hero { 
            height: 400px; 
            border-radius: 30px; 
            background-size: cover; 
            background-position: center; 
            position: relative; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            text-align: center;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2)); }
        .hero-content-v3 { position: relative; z-index: 2; max-width: 800px; padding: 2rem; color: #fff; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 900; background: hsla(var(--p) / 0.4); padding: 5px 15px; border-radius: 100px; border: 1px solid hsla(var(--p) / 0.5); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
        .hero-content-v3 h1 { font-size: 4.5rem; font-weight: 900; letter-spacing: -0.05em; line-height: 0.9; margin-bottom: 1.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.7); font-weight: 500; margin-bottom: 2rem; }
        .quick-stats-v3 { display: flex; justify-content: center; gap: 3rem; }
        .qs-item { display: flex; flex-direction: column; font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.5); }
        .qs-item span { font-size: 2rem; color: #fff; font-weight: 900; }

        /* Main Grid */
        .it-main-grid-v3 { display: grid; grid-template-columns: 300px 1fr 340px; gap: 1.5rem; align-items: start; }
        
        .glass-card-v3 { 
            background: var(--glass-bg); 
            backdrop-filter: blur(20px); 
            border: 1px solid var(--glass-border); 
            border-radius: 24px; 
            padding: 1.5rem; 
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow-sm);
        }
        .controls-card h3 { font-size: 0.7rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
        
        .f-group-v3 { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
        .f-group-v3 label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; }
        .f-input-v3 { display: flex; align-items: center; gap: 10px; background: hsla(var(--text) / 0.04); border: 1px solid hsl(var(--border)); padding: 0.6rem 1rem; border-radius: 12px; transition: 0.2s; }
        .f-input-v3:focus-within { border-color: hsl(var(--p)); background: var(--bg-card); }
        .f-input-v3 input { background: none; border: none; outline: none; color: inherit; font-size: 0.9rem; font-weight: 600; width: 100%; }
        .f-row-v3 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .f-solo-v3 { background: hsla(var(--text) / 0.04); border: 1px solid hsl(var(--border)); padding: 0.6rem 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600; outline: none; }

        .btn-generate-v3 { width: 100%; padding: 1.1rem; border-radius: 15px; border: none; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; font-weight: 900; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 25px hsla(var(--p) / 0.3); transition: 0.3s; }
        .btn-generate-v3:hover { transform: translateY(-3px); box-shadow: 0 15px 35px hsla(var(--p) / 0.4); }

        .card-head-v3 { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; font-weight: 900; color: hsl(var(--text)); margin-bottom: 1.25rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.75rem; }
        
        .hotel-item-v3, .food-item-v3 { margin-bottom: 1.25rem; }
        .hotel-item-v3 strong, .food-item-v3 strong { font-size: 0.85rem; font-weight: 700; color: hsl(var(--text)); display: block; }
        .hotel-item-v3 p, .food-item-v3 p { font-size: 0.75rem; color: hsl(var(--text-muted)); margin-top: 4px; line-height: 1.4; }
        .hotel-item-v3 span { font-size: 0.65rem; color: hsl(var(--p)); font-weight: 800; background: hsla(var(--p) / 0.1); padding: 2px 6px; border-radius: 4px; }

        /* Timeline v3 */
        .it-timeline-v3 { display: flex; flex-direction: column; gap: 1rem; }
        .day-v3 { border-radius: 28px; overflow: hidden; background: var(--glass-bg); border: 1px solid var(--glass-border); transition: 0.3s; }
        .day-v3.active { border-color: hsla(var(--p) / 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.05); }
        .day-toggle-v3 { padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; }
        .day-num-v3 { width: 64px; height: 64px; background: hsla(var(--p) / 0.1); border-radius: 20px; color: hsl(var(--p)); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; letter-spacing: 0.05em; border: 1px solid hsla(var(--p) / 0.2); }
        .day-meta-v3 { flex: 1; }
        .day-meta-v3 h4 { font-size: 1.25rem; font-weight: 850; margin-bottom: 4px; }
        .day-meta-v3 span { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; }
        .day-icon-v3 { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: hsl(var(--text-muted)); }

        .day-details-v3 { padding: 0 1.5rem 1.5rem; }
        .activities-v3 { display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 20px; }
        .act-v3 { display: flex; gap: 2rem; position: relative; padding-bottom: 2rem; }
        .act-time-v3 { min-width: 70px; font-size: 0.75rem; font-weight: 800; color: hsl(var(--p)); padding-top: 4px; }
        .act-line-v3 { position: relative; width: 1px; background: hsla(var(--border) / 0.8); }
        .act-v3:last-child .act-line-v3 { background: transparent; }
        .act-dot-v3 { position: absolute; top: 8px; left: -4px; width: 9px; height: 9px; border-radius: 50%; background: hsl(var(--p)); box-shadow: 0 0 0 4px hsla(var(--p) / 0.15); }
        .act-info-v3 h5 { font-size: 1rem; font-weight: 750; margin-bottom: 6px; }
        .act-info-v3 p { font-size: 0.85rem; color: hsl(var(--text-muted)); line-height: 1.6; }
        .act-meta-v3 { display: flex; gap: 10px; margin-top: 10px; }
        .tag-v3 { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; background: hsla(var(--text) / 0.05); padding: 3px 8px; border-radius: 6px; }
        .cost-v3 { font-size: 0.7rem; font-weight: 800; color: hsl(var(--success)); }

        .dining-v3 { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); }
        .d-title-v3 { font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .d-grid-v3 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .d-card-v3 { padding: 1rem; border-radius: 16px; display: flex; flex-direction: column; gap: 4px; }
        .d-card-v3 strong { font-size: 0.85rem; font-weight: 700; }
        .d-card-v3 span { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 600; }

        .map-card-v3 { border-radius: 30px; height: 600px; display: flex; flex-direction: column; overflow: hidden; position: sticky; top: 1.5rem; }
        .map-head-v3 { padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 900; border-bottom: 1px solid var(--glass-border); }
        .map-viewport-v3 { flex: 1; }

        @media (max-width: 1400px) {
            .it-main-grid-v3 { grid-template-columns: 260px 1fr; }
            .it-map-aside-v3 { display: none; }
        }
        @media (max-width: 1024px) {
            .it-main-grid-v3 { grid-template-columns: 1fr; }
            .it-hero h1 { font-size: 3rem; }
            .quick-stats-v3 { gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
