import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  Globe, Zap, Heart, MapPin as PinIcon, ArrowRight,
  MessageSquare, Send, X, Bot, User, RefreshCw, Layers,
  AlertTriangle, Navigation, Coffee, Camera, Music, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "I'm your AI Travel Architect. Want to swap a museum for a beach, or find the best local coffee? Just ask." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const [form, setForm] = useState({ 
    destination: tripConfig.destination || '', 
    days: 3, 
    budget: tripConfig.budget || 50000, 
    vibe: 'balanced' 
  });

  const [heroImg, setHeroImg] = useState('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600');

  useEffect(() => {
    if (itinerary?.destination) {
      setHeroImg(`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600`); // Realistic default
      const q = encodeURIComponent(itinerary.destination);
      setHeroImg(`https://source.unsplash.com/featured/1600x900?${q},travel,city&t=${Date.now()}`);
    }
  }, [itinerary]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAI = async () => {
    setLoading(true);
    setErrorDetails(null);
    try {
      // Priority 1: Vercel Serverless Function
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        const data = await res.json();
        setItinerary(data);
        return;
      }
      
      // Priority 2: Direct Frontend Fallback (Retry 3 times with different models)
      console.warn("Server route failed, switching to high-reliability frontend engine...");
      await generateDirectlyWithRetry();
      
    } catch (err) {
      console.error("Critical Generation Error:", err);
      setErrorDetails(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDirectlyWithRetry = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing. Please check your .env file.");

    let availableModels = ["gemini-1.5-flash", "gemini-1.5-pro"]; // Default safe list
    
    try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listRes.json();
        if (listData.models) {
            // Get all models that support generateContent and have 'gemini' in name
            availableModels = listData.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.split("/").pop());
            
            // Re-order to prioritize Flash for speed
            availableModels.sort((a, b) => a.includes("flash") ? -1 : 1);
        }
    } catch (e) {
        console.warn("Model discovery failed, using default list.", e);
    }

    let lastError = null;

    for (const model of availableModels) {
        try {
            console.log(`Attempting generation with ${model}...`);
            const prompt = `Generate a travel itinerary for ${form.destination}. Duration: ${form.days} days. Budget: ₹${form.budget}. Vibe: ${form.vibe}. Return ONLY a JSON object: {"destination": "${form.destination}", "summary": "...", "lodgingSuggestions": [{"name": "...", "type": "...", "priceRange": "...", "why": "..."}], "mustTryFoods": [{"dish": "...", "description": "..."}], "days": [{"day": 1, "theme": "...", "activities": [{"time": "...", "activity": "...", "description": "...", "type": "sightseeing", "cost": 0, "lat": 0, "lng": 0}], "diningHighlights": [{"name": "...", "cuisine": "...", "specialty": "..."}]}]}. Use real GPS coordinates.`;
            
            const result = await callGeminiAPI(model, apiKey, prompt);
            setItinerary(result);
            return; // Success!
        } catch (e) {
            console.warn(`${model} failed:`, e);
            lastError = e;
        }
    }
    throw lastError || new Error("All AI models failed. Please verify your internet connection and API key.");
  };

  const callGeminiAPI = async (model, key, prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, response_mime_type: "application/json" }
        })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(`${model}: ${data.error.message}`);
    
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error(`${model}: Empty content`);

    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`${model}: No JSON structure found`);
    return JSON.parse(match[0]);
  };

  const handleChat = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setChatLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
        const prompt = `Itinerary: ${JSON.stringify(itinerary)}. Request: "${userMsg}". Reply as Travel Concierge. If changing itinerary, return FULL JSON in <json>...</json>.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/);
        let textResponse = raw.replace(/<json>[\s\S]*?<\/json>/g, '').trim();

        if (jsonMatch) {
            setItinerary(JSON.parse(jsonMatch[1]));
            textResponse = textResponse || "Itinerary updated!";
        }
        setMessages(prev => [...prev, { role: 'bot', content: textResponse }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble with the connection." }]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="wander-container">
      {/* Real-World App Header */}
      <header className="wander-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-gradient" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="location-chip">
            <MapPin size={12} /> {form.destination.toUpperCase() || 'PLANNING TRIP'}
          </motion.div>
          <h1>{itinerary?.destination || 'Your Next Adventure'}</h1>
          <p>{itinerary?.summary || 'Experience the world like never before with AI-curated journeys.'}</p>
          <div className="hero-badges">
             <div className="h-badge"><span>{form.days}</span> Days</div>
             <div className="h-badge"><span>{form.vibe}</span> Trip</div>
          </div>
        </div>
      </header>

      <div className="wander-grid">
        {/* Architect Sidebar */}
        <aside className="wander-sidebar">
          <div className="architect-card glass">
            <div className="card-label">ARCHITECT CONTROLS</div>
            <div className="w-field">
              <label>DESTINATION</label>
              <div className="w-input"><Globe size={14} /><input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="Paris, France" /></div>
            </div>
            <div className="w-field">
              <label>DURATION</label>
              <div className="w-input"><Calendar size={14} /><input type="number" value={form.days} onChange={e => setForm({...form, days: e.target.value})} /></div>
            </div>
            <div className="w-field">
              <label>VIBE</label>
              <div className="w-input"><TrendingUp size={14} />
                <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                  <option value="balanced">Balanced</option>
                  <option value="adventure">Hardcore Adventure</option>
                  <option value="relaxed">Slow Travel</option>
                  <option value="luxury">Ultra Luxury</option>
                  <option value="budget">Backpacker Style</option>
                </select>
              </div>
            </div>
            <button className={`w-btn-primary ${loading ? 'loading' : ''}`} onClick={generateAI}>
              {loading ? <RefreshCw className="spin" size={16} /> : <><Sparkles size={16} /> BUILD ITINERARY</>}
            </button>

            {errorDetails && (
              <div className="error-box">
                <AlertTriangle size={14} />
                <p>{errorDetails}</p>
              </div>
            )}
          </div>

          {itinerary && (
            <motion.div className="lodging-card glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card-label"><Hotel size={12} /> WHERE TO STAY</div>
              {itinerary.lodgingSuggestions?.map((l, i) => (
                <div key={i} className="l-item">
                  <strong>{l.name}</strong>
                  <span>{l.type} • {l.priceRange}</span>
                </div>
              ))}
            </motion.div>
          )}
        </aside>

        {/* Timeline Feed */}
        <main className="wander-feed">
          {!itinerary && !loading && (
            <div className="wander-empty glass">
              <Navigation size={48} className="float-anim" />
              <h2>No Itinerary Found</h2>
              <p>Configure your Architect Controls on the left to start planning your perfect getaway.</p>
            </div>
          )}

          {itinerary && itinerary.days.map((day, dIdx) => (
            <div key={dIdx} className={`wander-day ${expandedDay === dIdx ? 'open' : ''}`}>
              <div className="day-bar" onClick={() => setExpandedDay(expandedDay === dIdx ? -1 : dIdx)}>
                <div className="day-num">DAY {day.day}</div>
                <div className="day-title">
                   <h4>{day.theme}</h4>
                   <div className="day-stats">{day.activities.length} Stops • Local Dining</div>
                </div>
                <div className="day-arrow">{expandedDay === dIdx ? <ChevronDown /> : <ChevronRight />}</div>
              </div>

              <AnimatePresence>
                {expandedDay === dIdx && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="day-body">
                    <div className="timeline-v5">
                      {day.activities.map((act, aIdx) => (
                        <div key={aIdx} className="t-row">
                          <div className="t-time">{act.time}</div>
                          <div className="t-line"><div className="t-dot" /></div>
                          <div className="t-content">
                             <div className="t-header">
                                <h5>{act.activity}</h5>
                                <div className="t-type">{act.type}</div>
                             </div>
                             <p>{act.description}</p>
                             <div className="t-footer">
                                {act.cost > 0 && <span className="t-cost">Estimated ₹{act.cost}</span>}
                                <span className="t-action"><PinIcon size={10} /> View Map</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="gastronomy-box">
                       <div className="g-title"><Utensils size={10} /> DINING SELECTIONS</div>
                       <div className="g-grid">
                          {day.diningHighlights?.map((dn, di) => (
                            <div key={di} className="g-card glass">
                               <strong>{dn.name}</strong>
                               <p>{dn.specialty} • {dn.cuisine}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </main>

        {/* Live Map Sidebar */}
        <aside className="wander-map-aside">
          <div className="sticky-map glass">
            <div className="map-label"><MapIcon size={12} /> REAL-TIME NAVIGATION</div>
            <div className="map-view-it">
               <TripMap activities={itinerary?.days?.flatMap(d => d.activities) || []} />
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Concierge Assistant */}
      <div className="bot-trigger no-print">
        <button className="bot-btn" onClick={() => setShowChat(true)}>
           <div className="bot-avatar"><Bot size={28} /></div>
           <div className="bot-pulse" />
        </button>
      </div>

      <AnimatePresence>
        {showChat && (
          <motion.div className="bot-panel glass" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}>
            <div className="bot-header">
               <div className="bh-user">
                  <div className="avatar-mini"><Bot size={16} /></div>
                  <div>
                    <h4>Trip Concierge</h4>
                    <span>Active Now</span>
                  </div>
               </div>
               <button className="close-bot" onClick={() => setShowChat(false)}><X size={20} /></button>
            </div>
            
            <div className="bot-chat">
               {messages.map((m, i) => (
                 <div key={i} className={`chat-bubble ${m.role}`}>
                    {m.content}
                 </div>
               ))}
               {chatLoading && <div className="chat-bubble bot typing">...</div>}
               <div ref={chatEndRef} />
            </div>

            <div className="bot-footer">
               <input placeholder="Ask me to swap a place..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
               <button onClick={handleChat} disabled={chatLoading}><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .wander-container { display: flex; flex-direction: column; gap: 2rem; background: hsl(var(--bg)); padding-bottom: 5rem; }
        
        .wander-hero { height: 450px; background-size: cover; background-position: center; position: relative; border-radius: 40px; margin: 0 1rem; overflow: hidden; display: flex; align-items: center; padding: 0 4rem; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 60%); }
        .hero-content { position: relative; z-index: 2; color: #fff; max-width: 700px; }
        .location-chip { display: inline-flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 900; background: hsl(var(--p)); color: #fff; padding: 5px 15px; border-radius: 100px; margin-bottom: 1.5rem; letter-spacing: 0.1em; }
        .hero-content h1 { font-size: 5rem; font-weight: 950; letter-spacing: -0.05em; line-height: 0.9; margin-bottom: 1.5rem; }
        .hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 2rem; }
        .hero-badges { display: flex; gap: 1rem; }
        .h-badge { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; border: 1px solid rgba(255,255,255,0.1); }
        .h-badge span { color: hsl(var(--p-light)); }

        .wander-grid { display: grid; grid-template-columns: 300px 1fr 340px; gap: 1.5rem; padding: 0 1rem; align-items: start; }
        .card-label { font-size: 0.65rem; font-weight: 950; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
        
        .architect-card { padding: 1.5rem; border-radius: 24px; }
        .w-field { margin-bottom: 1rem; }
        .w-field label { font-size: 0.6rem; font-weight: 900; color: hsl(var(--text-muted)); margin-bottom: 6px; display: block; }
        .w-input { display: flex; align-items: center; gap: 10px; background: hsla(var(--text) / 0.04); border: 1px solid hsl(var(--border)); padding: 0.7rem 1rem; border-radius: 12px; color: inherit; }
        .w-input input, .w-input select { background: none; border: none; outline: none; font-size: 0.85rem; font-weight: 600; width: 100%; color: inherit; }
        
        .w-btn-primary { width: 100%; padding: 1rem; border-radius: 16px; background: hsl(var(--p)); color: #fff; border: none; font-weight: 900; font-size: 0.8rem; cursor: pointer; transition: 0.3s; margin-top: 1rem; box-shadow: 0 10px 25px hsla(var(--p) / 0.4); }
        .error-box { margin-top: 1rem; padding: 0.75rem; border-radius: 12px; background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); font-size: 0.65rem; display: flex; gap: 8px; align-items: center; }

        .lodging-card { padding: 1.5rem; border-radius: 24px; margin-top: 1.5rem; }
        .l-item { margin-bottom: 1rem; }
        .l-item strong { display: block; font-size: 0.85rem; font-weight: 800; }
        .l-item span { font-size: 0.7rem; color: hsl(var(--text-muted)); }

        .wander-day { border-radius: 30px; background: var(--glass-bg); border: 1px solid var(--glass-border); margin-bottom: 1rem; overflow: hidden; transition: 0.3s; }
        .day-bar { padding: 1.5rem 2rem; display: flex; align-items: center; gap: 2rem; cursor: pointer; }
        .day-num { font-size: 0.75rem; font-weight: 950; background: hsl(var(--p)); color: #fff; padding: 4px 12px; border-radius: 8px; }
        .day-title h4 { font-size: 1.5rem; font-weight: 900; line-height: 1.2; }
        .day-stats { font-size: 0.8rem; color: hsl(var(--text-muted)); font-weight: 600; margin-top: 2px; }
        
        .day-body { padding: 0 2rem 2.5rem; }
        .timeline-v5 { border-left: 1px dashed hsla(var(--border) / 0.8); margin-left: 5px; padding-left: 2rem; }
        .t-row { position: relative; padding-bottom: 2rem; }
        .t-dot { position: absolute; left: -36px; top: 8px; width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--p)); box-shadow: 0 0 0 4px hsla(var(--p) / 0.1); }
        .t-time { font-size: 0.7rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 4px; }
        .t-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .t-header h5 { font-size: 1.1rem; font-weight: 850; }
        .t-type { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; background: hsla(var(--text) / 0.05); padding: 3px 10px; border-radius: 6px; }
        .t-content p { font-size: 0.95rem; color: hsl(var(--text-muted)); line-height: 1.6; }
        .t-footer { display: flex; gap: 15px; margin-top: 10px; font-size: 0.75rem; font-weight: 800; }
        .t-cost { color: hsl(var(--success)); }
        .t-action { color: hsl(var(--p)); cursor: pointer; display: flex; align-items: center; gap: 4px; }

        .gastronomy-box { margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 2rem; }
        .g-title { font-size: 0.65rem; font-weight: 950; color: hsl(var(--p)); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .g-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .g-card { padding: 1.25rem; border-radius: 20px; }

        .sticky-map { position: sticky; top: 1.5rem; height: 600px; border-radius: 40px; overflow: hidden; display: flex; flex-direction: column; }
        .map-label { padding: 1.25rem; font-size: 0.7rem; font-weight: 950; border-bottom: 1px solid var(--glass-border); }
        .map-view-it { flex: 1; }

        /* Bot Realism */
        .bot-trigger { position: fixed; bottom: 3rem; right: 3rem; z-index: 1000; }
        .bot-btn { width: 72px; height: 72px; border-radius: 50%; border: none; background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; }
        .bot-avatar { color: hsl(var(--p)); z-index: 2; position: relative; }
        .bot-pulse { position: absolute; inset: 0; border-radius: 50%; border: 4px solid hsla(var(--p) / 0.3); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

        .bot-panel { position: fixed; right: 3rem; bottom: 8.5rem; width: 400px; height: 550px; border-radius: 35px; overflow: hidden; z-index: 1001; display: flex; flex-direction: column; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
        .bot-header { padding: 1.5rem; background: hsla(var(--p) / 0.1); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; }
        .bh-user { display: flex; align-items: center; gap: 12px; }
        .avatar-mini { width: 32px; height: 32px; background: hsl(var(--p)); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .bh-user h4 { font-size: 1rem; font-weight: 900; }
        .bh-user span { font-size: 0.7rem; color: hsl(var(--success)); font-weight: 800; display: flex; align-items: center; gap: 4px; }
        .bh-user span::before { content: ''; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }

        .bot-chat { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
        .chat-bubble { max-width: 85%; padding: 1rem 1.25rem; border-radius: 20px; font-size: 0.9rem; font-weight: 500; line-height: 1.5; }
        .chat-bubble.user { align-self: flex-end; background: hsl(var(--p)); color: #fff; border-bottom-right-radius: 4px; }
        .chat-bubble.bot { align-self: flex-start; background: hsla(var(--text) / 0.05); border-bottom-left-radius: 4px; }

        .bot-footer { padding: 1.25rem; border-top: 1px solid var(--glass-border); display: flex; gap: 10px; }
        .bot-footer input { flex: 1; background: hsla(var(--text) / 0.05); border: 1px solid var(--glass-border); padding: 0.8rem 1.25rem; border-radius: 15px; font-size: 0.9rem; outline: none; }
        .bot-footer button { width: 48px; height: 48px; background: hsl(var(--p)); color: #fff; border: none; border-radius: 15px; cursor: pointer; }

        @media (max-width: 1400px) {
            .wander-grid { grid-template-columns: 280px 1fr; }
            .wander-map-aside { display: none; }
            .hero-content h1 { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
}
