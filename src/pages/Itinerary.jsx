import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  Globe, Zap, Heart, MapPin as PinIcon, ArrowRight,
  MessageSquare, Send, X, Bot, User, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TripMap from '../components/TripMap';

export default function Itinerary() {
  const { tripConfig } = useApp();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [heroImg, setHeroImg] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI Travel Concierge. I can help you answer questions about your trip or even modify your itinerary—just ask!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [itinerary, messages]);

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
      alert(err.message || 'Failed to generate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const generateDirectly = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing.");
    const model = await discoverModel(apiKey);

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

    const res = await callGemini(model, apiKey, prompt);
    setItinerary(res);
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
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI response");
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
        const model = await discoverModel(apiKey);
        
        const prompt = `
            You are a Travel Concierge. Current Itinerary: ${JSON.stringify(itinerary || "None")}.
            User Question: "${userMsg}"
            
            RULES:
            1. If the user wants to change, remove, or add something to the itinerary, you MUST return the entire updated JSON itinerary wrapped in <json>...</json> tags, AND a brief text confirmation.
            2. If it is just a general question, just reply with helpful text.
            3. Be premium, concise, and helpful.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        // Check for JSON update
        const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/);
        let textResponse = raw.replace(/<json>[\s\S]*?<\/json>/g, '').trim();

        if (jsonMatch) {
            try {
                const newItinerary = JSON.parse(jsonMatch[1]);
                setItinerary(newItinerary);
                textResponse = textResponse || "I have updated your itinerary according to your request!";
            } catch (e) { console.error("Chat JSON parse fail", e); }
        }

        setMessages(prev => [...prev, { role: 'bot', content: textResponse }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I encountered an error while processing your request." }]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="it-v3-container">
      {/* Cinematic Hero Header */}
      <section className="it-hero" style={{ backgroundImage: `url(${heroImg || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600'})` }}>
        <div className="hero-overlay" />
        <div className="hero-content-v3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero-tag">
                <Globe size={12} /> EXPLORING {form.destination.toUpperCase() || 'THE WORLD'}
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
                </>
            )}
        </aside>

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
                                            <div className="act-line-v3"><div className="act-dot-v3" /></div>
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </section>

        <aside className="it-map-aside-v3 no-print">
            <div className="map-card-v3 glass">
                <div className="map-head-v3"><MapIcon size={14} /> <span>INTERACTIVE ROUTE</span></div>
                <div className="map-viewport-v3">
                    <TripMap activities={itinerary?.days?.flatMap(d => d.activities) || []} />
                </div>
            </div>
        </aside>
      </div>

      {/* Floating Chat Interface */}
      <div className="concierge-trigger no-print">
         <button className="btn-chat-v3" onClick={() => setShowChat(true)}>
            <MessageSquare size={24} />
            <span className="chat-badge-v3">AI</span>
         </button>
      </div>

      <AnimatePresence>
        {showChat && (
            <motion.div className="chat-panel-v3 glass" initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}>
                <div className="chat-header-v3">
                    <div className="ch-info">
                        <Bot size={20} />
                        <div>
                            <h4>Travel Concierge</h4>
                            <span>Powered by Gemini AI</span>
                        </div>
                    </div>
                    <button onClick={() => setShowChat(false)}><X size={20} /></button>
                </div>
                
                <div className="chat-messages-v3">
                    {messages.map((m, i) => (
                        <div key={i} className={`msg-v3 ${m.role}`}>
                            <div className="msg-ico">{m.role === 'bot' ? <Bot size={12} /> : <User size={12} />}</div>
                            <div className="msg-content">{m.content}</div>
                        </div>
                    ))}
                    {chatLoading && <div className="msg-v3 bot"><div className="loader-dots-v3"><span>.</span><span>.</span><span>.</span></div></div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-v3">
                    <input 
                        placeholder="Cancel Day 2 activity..." 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                    />
                    <button onClick={handleChat} disabled={chatLoading}><Send size={18} /></button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .it-v3-container { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 5rem; position: relative; }
        
        .it-hero { height: 400px; border-radius: 30px; background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2)); }
        .hero-content-v3 { position: relative; z-index: 2; max-width: 800px; padding: 2rem; color: #fff; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 900; background: hsla(var(--p) / 0.4); padding: 5px 15px; border-radius: 100px; border: 1px solid hsla(var(--p) / 0.5); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
        .hero-content-v3 h1 { font-size: 4.5rem; font-weight: 900; letter-spacing: -0.05em; line-height: 0.9; margin-bottom: 1.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.7); font-weight: 500; margin-bottom: 2rem; }
        .quick-stats-v3 { display: flex; justify-content: center; gap: 3rem; }
        .qs-item { display: flex; flex-direction: column; font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.5); }
        .qs-item span { font-size: 2rem; color: #fff; font-weight: 900; }

        .it-main-grid-v3 { display: grid; grid-template-columns: 300px 1fr 340px; gap: 1.5rem; align-items: start; }
        .glass-card-v3 { background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 24px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm); }
        .btn-generate-v3 { width: 100%; padding: 1.1rem; border-radius: 15px; border: none; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; font-weight: 900; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 25px hsla(var(--p) / 0.3); transition: 0.3s; }
        
        .it-timeline-v3 { display: flex; flex-direction: column; gap: 1rem; }
        .day-v3 { border-radius: 28px; overflow: hidden; background: var(--glass-bg); border: 1px solid var(--glass-border); transition: 0.3s; }
        .day-toggle-v3 { padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; }
        .day-num-v3 { width: 64px; height: 64px; background: hsla(var(--p) / 0.1); border-radius: 20px; color: hsl(var(--p)); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; border: 1px solid hsla(var(--p) / 0.2); }
        .day-meta-v3 h4 { font-size: 1.25rem; font-weight: 850; }

        .map-card-v3 { border-radius: 30px; height: 600px; display: flex; flex-direction: column; overflow: hidden; position: sticky; top: 1.5rem; }
        
        /* Chat Concierge */
        .concierge-trigger { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; }
        .btn-chat-v3 { width: 64px; height: 64px; border-radius: 20px; background: hsl(var(--p)); color: #fff; border: none; box-shadow: 0 10px 30px hsla(var(--p) / 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: 0.3s; }
        .btn-chat-v3:hover { transform: scale(1.1) rotate(5deg); }
        .chat-badge-v3 { position: absolute; top: -5px; right: -5px; background: #fff; color: hsl(var(--p)); font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 100px; border: 2px solid hsl(var(--p)); }

        .chat-panel-v3 { position: fixed; right: 1.5rem; bottom: 1.5rem; width: 360px; height: 500px; z-index: 101; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
        .chat-header-v3 { padding: 1rem 1.25rem; background: hsla(var(--p) / 0.1); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; }
        .ch-info { display: flex; align-items: center; gap: 10px; }
        .ch-info h4 { font-size: 0.85rem; font-weight: 800; }
        .ch-info span { font-size: 0.65rem; color: hsl(var(--text-muted)); }
        
        .chat-messages-v3 { flex: 1; padding: 1.25rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
        .msg-v3 { display: flex; gap: 10px; max-width: 85%; }
        .msg-v3.user { align-self: flex-end; flex-direction: row-reverse; }
        .msg-ico { width: 24px; height: 24px; border-radius: 8px; background: hsla(var(--text) / 0.05); display: flex; align-items: center; justify-content: center; }
        .msg-content { padding: 0.75rem 1rem; border-radius: 15px; font-size: 0.8rem; line-height: 1.4; background: hsla(var(--text) / 0.05); }
        .msg-v3.user .msg-content { background: hsl(var(--p)); color: #fff; border-bottom-right-radius: 4px; }
        .msg-v3.bot .msg-content { background: var(--bg-card); border-bottom-left-radius: 4px; border: 1px solid var(--glass-border); }

        .chat-input-v3 { padding: 1rem; border-top: 1px solid var(--glass-border); display: flex; gap: 10px; }
        .chat-input-v3 input { flex: 1; background: hsla(var(--text) / 0.04); border: 1px solid var(--glass-border); padding: 0.6rem 1rem; border-radius: 12px; font-size: 0.8rem; outline: none; }
        .chat-input-v3 button { width: 36px; height: 36px; border-radius: 10px; background: hsl(var(--p)); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .loader-dots-v3 { display: flex; gap: 4px; }
        .loader-dots-v3 span { animation: blink 1.4s infinite both; }
        .loader-dots-v3 span:nth-child(2) { animation-delay: 0.2s; }
        .loader-dots-v3 span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }

        @media (max-width: 1400px) { .it-main-grid-v3 { grid-template-columns: 260px 1fr; } .it-map-aside-v3 { display: none; } }
      `}</style>
    </div>
  );
}
