import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  Globe, Zap, Heart, MapPin as PinIcon, ArrowRight,
  MessageSquare, Send, X, Bot, User, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig, theme } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Ready to refine your journey? I can swap activities, suggest hotels, or answer any destination queries.' }
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
      setHeroImg(`https://source.unsplash.com/featured/1600x900?${encodeURIComponent(itinerary.destination)}&t=${Date.now()}`);
    }
  }, [itinerary]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      alert(err.message || 'Itinerary generation failed. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const generateDirectly = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing. Add VITE_GEMINI_API_KEY to your .env file.");
    
    const model = await discoverModel(apiKey);

    const prompt = `Generate a ${form.days}-day travel itinerary for ${form.destination}. Budget: ₹${form.budget}. Vibe: ${form.vibe}. 
    Return ONLY JSON: {
      "destination": "${form.destination}",
      "summary": "Captivating 1-sentence hook.",
      "lodgingSuggestions": [{ "name": "...", "type": "Luxury/Boutique", "priceRange": "₹...", "why": "..." }],
      "mustTryFoods": [{ "dish": "...", "description": "..." }],
      "days": [{
        "day": 1, "theme": "...", 
        "activities": [{ "time": "9:00 AM", "activity": "...", "description": "...", "type": "sightseeing", "cost": 0, "lat": 0, "lng": 0 }],
        "diningHighlights": [{ "name": "...", "cuisine": "...", "specialty": "..." }]
      }]
    }`;

    try {
        const result = await callGemini(model, apiKey, prompt);
        setItinerary(result);
    } catch (e) {
        throw new Error("AI failed to generate itinerary. Please try again.");
    }
  };

  const discoverModel = async (key) => {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();
        return data.models?.find(m => m.name.includes("1.5-flash"))?.name.split("/").pop() || "gemini-1.5-flash";
    } catch (e) { return "gemini-1.5-flash"; }
  };

  const callGemini = async (model, key, prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192,
                response_mime_type: "application/json"
            }
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("The AI returned an empty response. This might be due to safety filters.");

    // Robust Sanitization: Handle markdown and whitespace
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        // Attempt direct parse first
        return JSON.parse(raw);
    } catch (e) {
        // Fallback: extract the largest { ... } block
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("The AI provided text but no valid itinerary data. Please try again.");
        return JSON.parse(match[0]);
    }
  };

  const handleChat = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setChatLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
        const model = await discoverModel(apiKey);
        
        const prompt = `
            You are a Travel Concierge. Current Itinerary: ${JSON.stringify(itinerary || "None")}.
            User Request: "${userMsg}"
            
            RULES:
            1. If modifying itinerary, return the FULL updated JSON wrapped in <json>...</json> AND text confirmation.
            2. For questions, reply with inspiring, concise text.
            3. Always maintain the high-end tone.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) return;

        const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/);
        let textResponse = raw.replace(/<json>[\s\S]*?<\/json>/g, '').trim();

        if (jsonMatch) {
            try {
                setItinerary(JSON.parse(jsonMatch[1]));
                textResponse = textResponse || "I've successfully tailored your itinerary to your request.";
            } catch (e) { console.error("Chat JSON fail", e); }
        }

        setMessages(prev => [...prev, { role: 'bot', content: textResponse }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'bot', content: "My apologies, I'm having trouble processing that right now." }]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="itinerary-page-v4">
      {/* Editorial Hero */}
      <section className="hero-editorial" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-scrim" />
        <div className="hero-body-v4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hero-badge-v4">
             <Globe size={14} /> EXPLORER'S EDITION
          </motion.div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {itinerary?.destination || 'Untitled Journey'}
          </motion.h1>
          <p className="hero-tagline-v4">{itinerary?.summary || 'Crafting a bespoke travel narrative for the modern wanderer.'}</p>
          
          <div className="hero-meta-v4">
            <div className="meta-pill"><Calendar size={14} /> <span>{form.days} DAYS</span></div>
            <div className="meta-pill"><Wallet size={14} /> <span>₹{(form.budget/1000).toFixed(0)}K</span></div>
            <div className="meta-pill"><TrendingUp size={14} /> <span>{form.vibe.toUpperCase()}</span></div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="main-content-v4">
        {/* Floating Controls Sidebar */}
        <div className="sidebar-v4 no-print">
            <div className="glass-card-v4 controls-box">
                <div className="box-title">ARCHITECT CONTROLS</div>
                <div className="input-v4">
                    <label>Destination</label>
                    <input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="e.g. Kyoto, Japan" />
                </div>
                <div className="input-v4">
                    <label>Duration (Days)</label>
                    <input type="number" value={form.days} onChange={e => setForm({...form, days: e.target.value})} />
                </div>
                <div className="input-v4">
                    <label>Travel Vibe</label>
                    <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                        <option value="balanced">Balanced</option>
                        <option value="adventure">Intrepid</option>
                        <option value="relaxed">Serene</option>
                        <option value="luxury">Luxury</option>
                        <option value="budget">Backpacker</option>
                    </select>
                </div>
                <button className={`btn-primary-v4 ${loading ? 'loading' : ''}`} onClick={generateAI}>
                    {loading ? <RefreshCw className="spin" size={16} /> : <><Sparkles size={16} /> GENERATE STORY</>}
                </button>
            </div>

            {itinerary && (
                <>
                <motion.div className="glass-card-v4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="box-title"><Hotel size={12} /> LODGING SELECTIONS</div>
                    <div className="v-list-v4">
                        {itinerary.lodgingSuggestions?.map((h, i) => (
                            <div key={i} className="v-item-v4">
                                <strong>{h.name}</strong>
                                <span>{h.type} • {h.priceRange}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div className="glass-card-v4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="box-title"><Utensils size={12} /> CULINARY NOTES</div>
                    <div className="v-list-v4">
                        {itinerary.mustTryFoods?.map((f, i) => (
                            <div key={i} className="v-item-v4">
                                <strong>{f.dish}</strong>
                                <p>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
                </>
            )}
        </div>

        {/* Narrative Timeline */}
        <div className="timeline-v4">
            {!itinerary && !loading && (
                <div className="empty-state-v4 glass">
                    <Layers size={64} className="ghost-icon" />
                    <h2>The Canvas is Ready</h2>
                    <p>Enter a destination and let the AI Architect sketch your perfect journey.</p>
                </div>
            )}

            {itinerary && itinerary.days.map((day, idx) => (
                <motion.div key={idx} className={`day-v4 ${expandedDay === idx ? 'expanded' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
                    <div className="day-header-v4" onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                        <div className="day-num-v4">{day.day.toString().padStart(2, '0')}</div>
                        <div className="day-info-v4">
                            <h4>{day.theme}</h4>
                            <p>{day.activities.length} curated experiences</p>
                        </div>
                        <div className="day-toggle-v4">{expandedDay === idx ? <ChevronDown /> : <ChevronRight />}</div>
                    </div>

                    <AnimatePresence>
                        {expandedDay === idx && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="day-body-v4">
                                <div className="activities-v4">
                                    {day.activities.map((act, i) => (
                                        <div key={i} className="act-row-v4">
                                            <div className="act-time-v4">{act.time}</div>
                                            <div className="act-content-v4">
                                                <h5>{act.activity}</h5>
                                                <p>{act.description}</p>
                                                <div className="act-tags-v4">
                                                    <span className="type-tag">{act.type}</span>
                                                    {act.cost > 0 && <span className="cost-tag">₹{act.cost}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {day.diningHighlights && (
                                    <div className="gastronomy-v4">
                                        <div className="sub-title-v4"><Utensils size={10} /> RECOMMENDED DINING</div>
                                        <div className="dining-grid-v4">
                                            {day.diningHighlights.map((d, i) => (
                                                <div key={i} className="dining-card-v4 glass">
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
        </div>

        {/* Floating Map Perspective */}
        <div className="map-column-v4 no-print">
            <div className="sticky-map-v4 glass">
                <div className="map-head-v4"><MapIcon size={14} /> <span>GEOGRAPHIC CONTEXT</span></div>
                <div className="map-body-v4">
                    <TripMap activities={itinerary?.days?.flatMap(d => d.activities) || []} />
                </div>
            </div>
        </div>
      </div>

      {/* Floating Concierge */}
      <div className="concierge-fab-v4 no-print">
         <button className="btn-fab-v4" onClick={() => setShowChat(true)}>
            <MessageSquare size={26} />
            <div className="fab-badge-v4">AI</div>
         </button>
      </div>

      <AnimatePresence>
        {showChat && (
            <motion.div className="chat-window-v4 glass" initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}>
                <div className="chat-head-v4">
                    <div className="head-info-v4">
                        <Bot size={20} className="bot-ico" />
                        <div>
                            <h4>AI Concierge</h4>
                            <span>Tailoring your journey...</span>
                        </div>
                    </div>
                    <button className="chat-close" onClick={() => setShowChat(false)}><X size={20} /></button>
                </div>
                
                <div className="chat-body-v4">
                    {messages.map((m, i) => (
                        <div key={i} className={`chat-bubble-v4 ${m.role}`}>
                            <div className="bubble-content">{m.content}</div>
                        </div>
                    ))}
                    {chatLoading && <div className="chat-bubble-v4 bot loading-dots"><span>.</span><span>.</span><span>.</span></div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-foot-v4">
                    <input 
                        placeholder="Swap Day 1 lunch with a cafe..." 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                    />
                    <button className="btn-send-v4" onClick={handleChat} disabled={chatLoading}><Send size={18} /></button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .itinerary-page-v4 { display: flex; flex-direction: column; gap: 0; background-color: hsl(var(--bg)); position: relative; }
        
        /* Editorial Hero */
        .hero-editorial { height: 500px; position: relative; display: flex; align-items: flex-end; background-size: cover; background-position: center; background-attachment: fixed; overflow: hidden; }
        .hero-scrim { position: absolute; inset: 0; background: linear-gradient(to top, hsl(var(--bg)), rgba(0,0,0,0.4) 40%, transparent); }
        .hero-body-v4 { position: relative; z-index: 2; width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 4rem 4rem; }
        .hero-badge-v4 { display: inline-flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); background: hsla(var(--p) / 0.1); padding: 4px 12px; border-radius: 100px; margin-bottom: 1rem; border: 1px solid hsla(var(--p) / 0.2); }
        .hero-body-v4 h1 { font-size: 6rem; font-weight: 950; letter-spacing: -0.06em; line-height: 0.85; margin-bottom: 1.5rem; text-transform: uppercase; color: hsl(var(--text)); }
        .hero-tagline-v4 { font-size: 1.1rem; color: hsl(var(--text-muted)); max-width: 600px; font-weight: 500; margin-bottom: 2rem; }
        .hero-meta-v4 { display: flex; gap: 1rem; }
        .meta-pill { display: flex; align-items: center; gap: 8px; background: var(--glass-bg); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 12px; border: 1px solid var(--glass-border); font-size: 0.75rem; font-weight: 800; }

        /* Main Content Grid */
        .main-content-v4 { display: grid; grid-template-columns: 320px 1fr 380px; gap: 2rem; max-width: 1400px; margin: 0 auto; padding: 2rem 4rem 10rem; width: 100%; }
        
        .glass-card-v4 { background: var(--glass-bg); backdrop-filter: blur(24px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-md); }
        .box-title { font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }
        
        .input-v4 { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
        .input-v4 label { font-size: 0.6rem; font-weight: 900; color: hsl(var(--text-muted)); text-transform: uppercase; }
        .input-v4 input, .input-v4 select { background: hsla(var(--text) / 0.04); border: 1px solid hsl(var(--border)); padding: 0.75rem 1rem; border-radius: 14px; font-size: 0.85rem; font-weight: 600; color: inherit; outline: none; transition: 0.2s; }
        .input-v4 input:focus { border-color: hsl(var(--p)); background: var(--bg-card); }
        .row-v4 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .btn-primary-v4 { width: 100%; padding: 1.25rem; border-radius: 16px; border: none; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 25px hsla(var(--p) / 0.3); transition: 0.3s; }
        .btn-primary-v4:hover { transform: translateY(-3px); box-shadow: 0 15px 35px hsla(var(--p) / 0.4); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .v-item-v4 { margin-bottom: 1rem; }
        .v-item-v4 strong { font-size: 0.8rem; font-weight: 800; display: block; }
        .v-item-v4 span, .v-item-v4 p { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 600; line-height: 1.4; }

        /* Timeline v4 */
        .timeline-v4 { display: flex; flex-direction: column; gap: 1rem; }
        .day-v4 { background: var(--glass-bg); border-radius: 32px; border: 1px solid var(--glass-border); overflow: hidden; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .day-v4.expanded { border-color: hsla(var(--p) / 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        
        .day-header-v4 { padding: 2rem; display: flex; align-items: center; gap: 2rem; cursor: pointer; transition: 0.3s; }
        .day-header-v4:hover { background: hsla(var(--text) / 0.02); }
        .day-num-v4 { font-size: 3rem; font-weight: 950; color: hsla(var(--text) / 0.05); font-family: 'Outfit'; line-height: 1; }
        .day-info-v4 { flex: 1; }
        .day-info-v4 h4 { font-size: 1.5rem; font-weight: 900; color: hsl(var(--text)); margin-bottom: 4px; }
        .day-info-v4 p { font-size: 0.8rem; font-weight: 700; color: hsl(var(--p)); text-transform: uppercase; letter-spacing: 0.05em; }
        .day-toggle-v4 { width: 44px; height: 44px; border-radius: 14px; background: hsla(var(--text) / 0.05); display: flex; align-items: center; justify-content: center; color: hsl(var(--text-muted)); }

        .day-body-v4 { padding: 0 2.5rem 2.5rem; }
        .activities-v4 { display: flex; flex-direction: column; border-left: 1px solid hsla(var(--border) / 0.8); padding-left: 2rem; margin-left: 1rem; }
        .act-row-v4 { position: relative; padding-bottom: 2.5rem; }
        .act-row-v4::before { content: ''; position: absolute; left: -34px; top: 12px; width: 5px; height: 5px; border-radius: 50%; background: hsl(var(--p)); box-shadow: 0 0 0 4px hsla(var(--p) / 0.2); }
        .act-time-v4 { font-size: 0.7rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 8px; }
        .act-content-v4 h5 { font-size: 1.125rem; font-weight: 850; margin-bottom: 8px; }
        .act-content-v4 p { font-size: 0.9375rem; color: hsl(var(--text-muted)); line-height: 1.6; }
        .act-tags-v4 { display: flex; gap: 8px; margin-top: 12px; }
        .type-tag { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; background: hsla(var(--text) / 0.05); padding: 3px 10px; border-radius: 6px; }
        .cost-tag { font-size: 0.75rem; font-weight: 800; color: hsl(var(--success)); }

        .gastronomy-v4 { margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 2rem; }
        .sub-title-v4 { font-size: 0.7rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }
        .dining-grid-v4 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .dining-card-v4 { padding: 1.25rem; border-radius: 20px; display: flex; flex-direction: column; gap: 4px; }

        /* Map v4 */
        .sticky-map-v4 { position: sticky; top: 2rem; height: 600px; border-radius: 32px; overflow: hidden; display: flex; flex-direction: column; }
        .map-head-v4 { padding: 1.25rem 1.5rem; font-size: 0.7rem; font-weight: 900; border-bottom: 1px solid var(--glass-border); }
        .map-body-v4 { flex: 1; }

        /* Floating AI Concierge */
        .concierge-fab-v4 { position: fixed; bottom: 3rem; right: 3rem; z-index: 100; }
        .btn-fab-v4 { width: 72px; height: 72px; border-radius: 24px; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; border: none; box-shadow: 0 15px 40px hsla(var(--p) / 0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: 0.4s; }
        .btn-fab-v4:hover { transform: translateY(-5px) rotate(5deg); }
        .fab-badge-v4 { position: absolute; top: -8px; right: -8px; background: #fff; color: hsl(var(--p)); font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 100px; border: 2px solid hsl(var(--p)); }

        .chat-window-v4 { position: fixed; right: 3rem; bottom: 8.5rem; width: 400px; height: 600px; border-radius: 32px; display: flex; flex-direction: column; overflow: hidden; z-index: 101; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
        .chat-head-v4 { padding: 1.5rem; background: hsla(var(--p) / 0.1); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; }
        .head-info-v4 { display: flex; align-items: center; gap: 12px; }
        .bot-ico { color: hsl(var(--p)); }
        .head-info-v4 h4 { font-size: 1rem; font-weight: 900; }
        .head-info-v4 span { font-size: 0.7rem; color: hsl(var(--text-muted)); }
        
        .chat-body-v4 { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; }
        .chat-bubble-v4 { max-width: 85%; padding: 1rem 1.25rem; border-radius: 20px; font-size: 0.9rem; line-height: 1.5; font-weight: 500; }
        .chat-bubble-v4.user { align-self: flex-end; background: hsl(var(--p)); color: #fff; border-bottom-right-radius: 4px; }
        .chat-bubble-v4.bot { align-self: flex-start; background: hsla(var(--text) / 0.05); border-bottom-left-radius: 4px; }
        
        .chat-foot-v4 { padding: 1.25rem; border-top: 1px solid var(--glass-border); display: flex; gap: 12px; }
        .chat-foot-v4 input { flex: 1; background: hsla(var(--text) / 0.04); border: 1px solid var(--glass-border); padding: 0.8rem 1.25rem; border-radius: 16px; font-size: 0.9rem; outline: none; }
        .btn-send-v4 { width: 48px; height: 48px; border-radius: 14px; background: hsl(var(--p)); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        @media (max-width: 1400px) {
            .main-content-v4 { grid-template-columns: 280px 1fr; padding: 2rem; }
            .map-column-v4 { display: none; }
            .hero-body-v4 { padding: 0 2rem 4rem; }
            .hero-body-v4 h1 { font-size: 4rem; }
        }
      `}</style>
    </div>
  );
}
