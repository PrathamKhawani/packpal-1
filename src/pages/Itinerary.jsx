import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, MapPin, Calendar, Wallet, 
  Sparkles, ChevronRight, ChevronDown, 
  Clock, Map as MapIcon, Download, Share2,
  Hotel, Utensils, Star, Info, TrendingUp,
  Globe, Zap, Heart, MapPin as PinIcon, ArrowRight,
  MessageSquare, Send, X, Bot, User, RefreshCw, Layers,
  AlertTriangle, Navigation, Coffee, Camera, Music, ShoppingBag,
  ExternalLink, CreditCard, Image as ImageIcon
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
    { role: 'bot', content: "I'm your AI Concierge. I can help you find booking links, swap places, or answer questions about your stay. How can I help?" }
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
      setHeroImg(`https://source.unsplash.com/featured/1600x900?${encodeURIComponent(itinerary.destination)},travel&t=${Date.now()}`);
    }
  }, [itinerary]);

  useEffect(() => {
    if (showChat) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  const generateAI = async () => {
    setLoading(true);
    setErrorDetails(null);
    try {
      // Direct Frontend Fallback (Retry Engine)
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
    if (!apiKey) throw new Error("API Key missing.");

    // Start with the most reliable v1beta models
    let availableModels = ["gemini-1.5-flash", "gemini-1.5-pro"]; 
    
    try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listRes.json();
        if (listData.models) {
            // Only use models that are 'flash' or 'pro' and are 1.5 versions
            const discovered = listData.models
                .filter(m => {
                    const name = m.name.toLowerCase();
                    return m.supportedGenerationMethods.includes("generateContent") && 
                           name.includes("1.5") && 
                           (name.includes("flash") || name.includes("pro")) &&
                           !name.includes("robotics") &&
                           !name.includes("preview");
                })
                .map(m => m.name.split("/").pop());
            
            if (discovered.length > 0) {
                availableModels = discovered;
                // Prioritize Flash for speed
                availableModels.sort((a, b) => a.includes("flash") ? -1 : 1);
            }
        }
    } catch (e) {
        console.warn("Discovery failed, sticking to stable 1.5 defaults.");
    }

    let lastError = null;
    for (const model of availableModels) {
        try {
            const prompt = `Generate a high-end itinerary for ${form.destination}. Duration: ${form.days} days. Budget: ₹${form.budget}. Vibe: ${form.vibe}. 
            CRITICAL: Return ONLY JSON. Every activity and hotel MUST have: "website", "bookingUrl", and "imageUrl" (use realistic unsplash links if unknown). 
            Schema: {
              "destination": "...", "summary": "...",
              "lodgingSuggestions": [{"name": "...", "type": "...", "price": "₹...", "website": "...", "bookingUrl": "...", "imageUrl": "...", "why": "..."}],
              "mustTryFoods": [{"dish": "...", "description": "...", "imageUrl": "..."}],
              "days": [{"day": 1, "theme": "...", "activities": [{"time": "...", "activity": "...", "description": "...", "type": "...", "cost": 0, "website": "...", "imageUrl": "...", "lat": 0, "lng": 0}], "diningHighlights": [{"name": "...", "cuisine": "...", "specialty": "...", "website": "..."}]}]
            }`;
            const result = await callGeminiAPI(model, apiKey, prompt);
            setItinerary(result);
            return;
        } catch (e) {
            console.error(`Attempt with ${model} failed:`, e);
            lastError = e;
        }
    }
    throw lastError || new Error("AI engine failed to find a compatible model. Check your API key.");
  };

  const callGeminiAPI = async (model, key, prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, response_mime_type: "application/json" }
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(raw);
  };

  const handleChat = async () => {
    if (!inputValue.trim() || chatLoading) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setChatLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
        const prompt = `Context Itinerary: ${JSON.stringify(itinerary)}. User: "${userMsg}". Reply as Concierge. If changing, wrap FULL JSON in <json>...</json>.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

        const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/);
        let textResponse = raw.replace(/<json>[\s\S]*?<\/json>/g, '').trim();

        if (jsonMatch) {
            try {
                const updated = JSON.parse(jsonMatch[1]);
                setItinerary(updated);
                textResponse = textResponse || "Itinerary updated!";
            } catch(e) { console.error("Chat JSON error", e); }
        }
        setMessages(prev => [...prev, { role: 'bot', content: textResponse }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'bot', content: "Connection error. Please check your API key." }]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="wander-root">
      {/* Editorial Hero */}
      <header className="wander-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay" />
        <div className="hero-body">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hero-loc-badge">
             <MapPin size={12} /> {form.destination.toUpperCase() || 'WORLD'}
          </motion.div>
          <h1>{itinerary?.destination || 'Plan Your Story'}</h1>
          <p>{itinerary?.summary || 'Tailored AI journeys with integrated booking and culinary guides.'}</p>
        </div>
      </header>

      <div className="wander-grid">
        {/* Architect Sidebar */}
        <aside className="wander-sidebar no-print">
          <div className="glass-card architect-box">
             <div className="box-label">ARCHITECT CONTROLS</div>
             <div className="w-field">
                <label>DESTINATION</label>
                <div className="w-input-v6"><Globe size={14} /><input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} /></div>
             </div>
             <div className="w-field">
                <label>DAYS</label>
                <div className="w-input-v6"><Calendar size={14} /><input type="number" value={form.days} onChange={e => setForm({...form, days: e.target.value})} /></div>
             </div>
             <div className="w-field">
                <label>VIBE</label>
                <div className="w-input-v6"><TrendingUp size={14} />
                    <select value={form.vibe} onChange={e => setForm({...form, vibe: e.target.value})}>
                        <option value="balanced">Balanced</option>
                        <option value="luxury">Luxury</option>
                        <option value="adventure">Adventure</option>
                        <option value="budget">Reasonable</option>
                    </select>
                </div>
             </div>
             <button className={`btn-primary-v6 ${loading ? 'loading' : ''}`} onClick={generateAI}>
                {loading ? <RefreshCw className="spin" size={16} /> : <><Sparkles size={16} /> BUILD JOURNEY</>}
             </button>
             {errorDetails && <div className="error-alert"><AlertTriangle size={14} /> {errorDetails}</div>}
          </div>

          {itinerary && (
            <motion.div className="glass-card lodging-box" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="box-label"><Hotel size={12} /> BEST STAYS</div>
               {itinerary.lodgingSuggestions?.map((h, i) => (
                   <div key={i} className="h-card-v6">
                      {h.imageUrl && <img src={h.imageUrl} alt={h.name} className="h-img" />}
                      <div className="h-info-v6">
                         <strong>{h.name}</strong>
                         <div className="h-price">{h.price} / night</div>
                         <p>{h.why}</p>
                         <div className="h-links">
                            <a href={h.website} target="_blank" rel="noreferrer"><ExternalLink size={10} /> Official</a>
                            <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="book-link"><CreditCard size={10} /> Book Now</a>
                         </div>
                      </div>
                   </div>
               ))}
            </motion.div>
          )}
        </aside>

        {/* Narrative Feed */}
        <main className="wander-main">
            {!itinerary && !loading && (
                <div className="empty-state-v6 glass">
                    <Navigation size={48} className="float-anim" />
                    <h2>The Atlas Awaits</h2>
                    <p>Enter a destination and duration to generate a connected itinerary.</p>
                </div>
            )}

            {itinerary && itinerary.days.map((day, dIdx) => (
                <div key={dIdx} className={`day-v6 ${expandedDay === dIdx ? 'expanded' : ''}`}>
                    <div className="day-head-v6" onClick={() => setExpandedDay(expandedDay === dIdx ? -1 : dIdx)}>
                        <div className="day-num-v6">D{day.day}</div>
                        <div className="day-text-v6">
                            <h4>{day.theme}</h4>
                            <span>{day.activities.length} Activities • Dining</span>
                        </div>
                        <div className="day-arr-v6">{expandedDay === dIdx ? <ChevronDown /> : <ChevronRight />}</div>
                    </div>

                    <AnimatePresence>
                        {expandedDay === dIdx && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="day-body-v6">
                                <div className="timeline-v6">
                                    {day.activities.map((act, aIdx) => (
                                        <div key={aIdx} className="a-row-v6">
                                            <div className="a-time-v6">{act.time}</div>
                                            <div className="a-connector-v6"><div className="a-dot-v6" /></div>
                                            <div className="a-main-v6">
                                                <div className="a-head-v6">
                                                    <h5>{act.activity}</h5>
                                                    <a href={act.website} target="_blank" rel="noreferrer"><ExternalLink size={12} /></a>
                                                </div>
                                                {act.imageUrl && <img src={act.imageUrl} alt={act.activity} className="a-img-v6" />}
                                                <p>{act.description}</p>
                                                <div className="a-meta-v6">
                                                    <span className="a-tag">{act.type}</span>
                                                    {act.cost > 0 && <span className="a-cost">₹{act.cost}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="dining-box-v6">
                                    <div className="box-label"><Utensils size={10} /> DINING HIGHLIGHTS</div>
                                    <div className="d-grid-v6">
                                        {day.diningHighlights?.map((dn, di) => (
                                            <div key={di} className="d-card-v6 glass">
                                                <strong>{dn.name}</strong>
                                                <span>{dn.cuisine} • {dn.specialty}</span>
                                                <a href={dn.website} target="_blank" rel="noreferrer" className="d-link">Website <ArrowRight size={10} /></a>
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

        {/* Geographic Sidebar */}
        <aside className="wander-map no-print">
            <div className="sticky-map-v6 glass">
                <div className="box-label"><MapIcon size={12} /> LIVE ROUTE</div>
                <div className="map-wrapper-v6">
                    <TripMap activities={itinerary?.days?.flatMap(d => d.activities) || []} />
                </div>
            </div>
        </aside>
      </div>

      {/* Floating Concierge Chat */}
      <div className="concierge-box no-print">
         <button className="concierge-trigger-v6" onClick={() => setShowChat(!showChat)}>
            <div className="bot-ico-v6"><Bot size={28} /></div>
            <div className="bot-status-v6" />
         </button>
      </div>

      <AnimatePresence>
        {showChat && (
            <motion.div className="chat-ui-v6 glass" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                <div className="chat-head-v6">
                    <div className="h-bot">
                        <div className="bot-min"><Bot size={16} /></div>
                        <div><h4>Travel Concierge</h4><span>Always Active</span></div>
                    </div>
                    <button onClick={() => setShowChat(false)}><X size={20} /></button>
                </div>
                
                <div className="chat-body-v6">
                    {messages.map((m, i) => (
                        <div key={i} className={`msg-v6 ${m.role}`}>
                            <div className="msg-content-v6">{m.content}</div>
                        </div>
                    ))}
                    {chatLoading && <div className="msg-v6 bot"><div className="typing-v6">...</div></div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-foot-v6">
                    <input 
                        placeholder="Ask for booking links..." 
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
        .wander-root { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 5rem; }
        
        .wander-hero { height: 400px; background-size: cover; background-position: center; border-radius: 40px; margin: 0 1rem; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 4rem; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%); }
        .hero-body { position: relative; z-index: 2; color: #fff; }
        .hero-loc-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 900; background: hsl(var(--p)); padding: 4px 12px; border-radius: 100px; margin-bottom: 1rem; }
        .hero-body h1 { font-size: 4rem; font-weight: 950; letter-spacing: -0.04em; line-height: 1; margin-bottom: 0.5rem; }
        .hero-body p { font-size: 1rem; color: rgba(255,255,255,0.7); }

        .wander-grid { display: grid; grid-template-columns: 320px 1fr 350px; gap: 1.5rem; padding: 0 1rem; align-items: start; }
        .box-label { font-size: 0.6rem; font-weight: 950; color: hsl(var(--p)); letter-spacing: 0.1em; margin-bottom: 1rem; display: flex; align-items: center; gap: 6px; }
        
        .glass-card { background: var(--glass-bg); backdrop-filter: blur(24px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 1.5rem; margin-bottom: 1.5rem; }
        
        .w-field { margin-bottom: 1rem; }
        .w-field label { font-size: 0.6rem; font-weight: 900; color: hsl(var(--text-muted)); margin-bottom: 4px; display: block; }
        .w-input-v6 { display: flex; align-items: center; gap: 10px; background: hsla(var(--text) / 0.04); border: 1px solid hsl(var(--border)); padding: 0.6rem 1rem; border-radius: 14px; }
        .w-input-v6 input, .w-input-v6 select { background: none; border: none; outline: none; font-size: 0.85rem; font-weight: 600; width: 100%; color: inherit; }
        
        .btn-primary-v6 { width: 100%; padding: 1rem; border-radius: 15px; background: hsl(var(--p)); color: #fff; font-weight: 900; border: none; cursor: pointer; box-shadow: 0 10px 25px hsla(var(--p) / 0.4); }

        .h-card-v6 { margin-bottom: 1.5rem; border-radius: 20px; overflow: hidden; background: hsla(var(--text) / 0.03); border: 1px solid var(--glass-border); }
        .h-img { width: 100%; height: 120px; object-fit: cover; }
        .h-info-v6 { padding: 1rem; }
        .h-info-v6 strong { font-size: 0.85rem; display: block; }
        .h-price { font-size: 0.7rem; color: hsl(var(--p)); font-weight: 800; margin-bottom: 4px; }
        .h-info-v6 p { font-size: 0.65rem; color: hsl(var(--text-muted)); line-height: 1.4; margin-bottom: 1rem; }
        .h-links { display: flex; gap: 8px; }
        .h-links a { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 4px; color: inherit; text-decoration: none; }
        .book-link { background: hsla(var(--p) / 0.1); border-color: hsla(var(--p) / 0.2) !important; color: hsl(var(--p)) !important; }

        .day-v6 { background: var(--glass-bg); border-radius: 30px; border: 1px solid var(--glass-border); margin-bottom: 1rem; overflow: hidden; }
        .day-head-v6 { padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; }
        .day-num-v6 { font-size: 0.8rem; font-weight: 950; background: hsl(var(--p)); color: #fff; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .day-text-v6 h4 { font-size: 1.25rem; font-weight: 900; }
        .day-text-v6 span { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; }
        
        .day-body-v6 { padding: 0 2rem 2rem; }
        .timeline-v6 { padding-left: 20px; border-left: 1px dashed var(--glass-border); margin-left: 5px; }
        .a-row-v6 { position: relative; padding-bottom: 2rem; }
        .a-dot-v6 { position: absolute; left: -34px; top: 12px; width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--p)); }
        .a-time-v6 { font-size: 0.7rem; font-weight: 900; color: hsl(var(--p)); margin-bottom: 6px; }
        .a-head-v6 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .a-head-v6 h5 { font-size: 1.1rem; font-weight: 850; }
        .a-img-v6 { width: 100%; height: 180px; object-fit: cover; border-radius: 16px; margin-bottom: 1rem; }
        .a-main-v6 p { font-size: 0.9rem; color: hsl(var(--text-muted)); line-height: 1.5; }
        .a-meta-v6 { display: flex; gap: 10px; margin-top: 10px; font-size: 0.75rem; font-weight: 800; }
        
        .dining-box-v6 { margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 2rem; }
        .d-grid-v6 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .d-card-v6 { padding: 1rem; border-radius: 16px; display: flex; flex-direction: column; }
        .d-link { font-size: 0.65rem; font-weight: 900; color: hsl(var(--p)); text-decoration: none; margin-top: 8px; display: flex; align-items: center; gap: 4px; }

        .sticky-map-v6 { position: sticky; top: 1.5rem; height: 600px; display: flex; flex-direction: column; overflow: hidden; border-radius: 40px; }
        .map-wrapper-v6 { flex: 1; }

        /* Chat Concierge v6 */
        .concierge-box { position: fixed; bottom: 3rem; right: 3rem; z-index: 1000; }
        .concierge-trigger-v6 { width: 72px; height: 72px; border-radius: 50%; background: #fff; border: none; box-shadow: 0 15px 40px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; }
        .bot-ico-v6 { color: hsl(var(--p)); }
        .bot-status-v6 { position: absolute; top: 0; right: 0; width: 16px; height: 16px; background: hsl(var(--success)); border: 3px solid #fff; border-radius: 50%; }

        .chat-ui-v6 { position: fixed; right: 3rem; bottom: 8.5rem; width: 380px; height: 500px; border-radius: 35px; overflow: hidden; display: flex; flex-direction: column; z-index: 1001; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
        .chat-head-v6 { padding: 1.25rem 1.5rem; background: hsla(var(--p) / 0.1); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
        .h-bot { display: flex; align-items: center; gap: 10px; }
        .bot-min { width: 32px; height: 32px; background: hsl(var(--p)); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .h-bot h4 { font-size: 0.9rem; font-weight: 900; }
        .h-bot span { font-size: 0.65rem; color: hsl(var(--success)); font-weight: 800; }

        .chat-body-v6 { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
        .msg-v6 { max-width: 85%; padding: 0.8rem 1.1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; line-height: 1.5; }
        .msg-v6.user { align-self: flex-end; background: hsl(var(--p)); color: #fff; border-bottom-right-radius: 4px; }
        .msg-v6.bot { align-self: flex-start; background: hsla(var(--text) / 0.05); border-bottom-left-radius: 4px; border: 1px solid var(--glass-border); }
        
        .chat-foot-v6 { padding: 1rem; border-top: 1px solid var(--glass-border); display: flex; gap: 10px; }
        .chat-foot-v6 input { flex: 1; background: hsla(var(--text) / 0.05); border: 1px solid var(--glass-border); padding: 0.75rem 1.25rem; border-radius: 15px; outline: none; font-size: 0.85rem; }
        .chat-foot-v6 button { width: 44px; height: 44px; background: hsl(var(--p)); color: #fff; border: none; border-radius: 12px; cursor: pointer; }

        @media (max-width: 1400px) { .wander-grid { grid-template-columns: 280px 1fr; } .wander-map { display: none; } }
        @media (max-width: 768px) { .chat-ui-v6 { width: calc(100% - 2rem); right: 1rem; } .wander-hero { padding: 2rem; } .hero-body h1 { font-size: 3rem; } }
      `}</style>
    </div>
  );
}
