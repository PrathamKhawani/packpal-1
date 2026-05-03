import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, PlaneTakeoff, Navigation, Users, 
  CloudSun, TrendingUp, Clock, ArrowUpRight, 
  ArrowDownRight, Compass, MapPin, IndianRupee,
  Activity, Wind, Sun, Edit3, X, Calendar,
  CloudRain, Zap, Thermometer, Info, ChevronRight,
  Target, Zap as Adventure, Heart as Relaxing, Palette as Culture, Globe
} from 'lucide-react';

const RadarChart = ({ data, theme }) => {
  const points = data.map((d, i) => {
    const angle = (i * 360) / data.length;
    const r = (d.value / 100) * 32;
    const x = 50 + r * Math.cos((angle - 90) * (Math.PI / 180));
    const y = 50 + r * Math.sin((angle - 90) * (Math.PI / 180));
    return `${x},${y}`;
  }).join(' ');

  const isDark = theme === 'dark';

  return (
    <svg viewBox="0 0 100 100" className="radar-svg">
      <circle cx="50" cy="50" r="32" className="r-grid" />
      <circle cx="50" cy="50" r="24" className="r-grid" />
      <circle cx="50" cy="50" r="16" className="r-grid" />
      <polygon points={points} className="r-area" />
      {data.map((d, i) => {
        const angle = (i * 360) / data.length;
        const x = 50 + 42 * Math.cos((angle - 90) * (Math.PI / 180));
        const y = 50 + 42 * Math.sin((angle - 90) * (Math.PI / 180));
        return <text key={i} x={x} y={y} className="r-label">{d.label[0]}</text>;
      })}
    </svg>
  );
};

export default function Dashboard() {
  const { items, members, expenses, tripConfig, setTripConfig, theme, currentUser, activityLog } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDest, setTempDest] = useState(tripConfig.destination);
  const [tempDate, setTempDate] = useState(new Date(tripConfig.startDate).toISOString().split('T')[0]);
  const [weather, setWeather] = useState({ temp: 24, desc: 'Fetching...', icon: <CloudSun size={24} />, forecast: [] });
  const [heroImg, setHeroImg] = useState('');
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setHeroImg(`https://source.unsplash.com/featured/1200x600?${encodeURIComponent(tripConfig.destination)}&t=${Date.now()}`);

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(tripConfig.destination)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        
        if (geoData.results?.[0]) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,weathercode&timezone=auto`);
          const weatherData = await weatherRes.json();
          
          if (weatherData.current_weather) {
            const temp = Math.round(weatherData.current_weather.temperature);
            const code = weatherData.current_weather.weathercode;
            
            const getWeatherMeta = (c) => {
              if (c <= 3) return { desc: 'Sunny', icon: <Sun size={24} /> };
              if (c <= 48) return { desc: 'Cloudy', icon: <CloudSun size={24} /> };
              if (c <= 67) return { desc: 'Rainy', icon: <CloudRain size={24} /> };
              return { desc: 'Storm', icon: <Zap size={24} /> };
            };

            const daily = (weatherData.daily.temperature_2m_max || []).slice(1, 5).map((t, i) => ({
              temp: Math.round(t),
              day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() + i + 1) % 7]
            }));

            const current = getWeatherMeta(code);
            setWeather({ temp, desc: current.desc, icon: current.icon, forecast: daily });
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchTripData();
  }, [tripConfig.destination]);

  const spent = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const packedPct = items.length ? Math.round((items.filter(i => i.status === 'packed').length / items.length) * 100) : 0;
  const daysRemaining = Math.ceil((new Date(tripConfig.startDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="dash-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-card glass">
          <div className="hero-img-box" style={{ backgroundImage: `url(${heroImg})` }}>
            <div className="hero-gradient-overlay" />
            <div className="hero-content">
                <div className="hero-top-row">
                    <span className="hero-badge"><Globe size={10} /> {daysRemaining} DAYS TO DEPARTURE</span>
                    <div className="hero-time"><Clock size={12} /> {localTime} (Local)</div>
                </div>
                <div className="hero-title-area">
                    <h1>{tripConfig.destination}</h1>
                    <button className="edit-dest-btn" onClick={() => setIsEditing(true)}><Edit3 size={16} /></button>
                </div>
                <div className="hero-stats-row">
                    <div className="h-stat"><span>PACKING</span><strong>{packedPct}%</strong></div>
                    <div className="h-stat"><span>MEMBERS</span><strong>{members.length}</strong></div>
                    <div className="h-stat"><span>BUDGET</span><strong>₹{(spent/1000).toFixed(1)}K</strong></div>
                </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid */}
      <div className="dash-bento">
        {/* Weather Card */}
        <motion.div className="bento-card glass weather-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="card-head"><h3>WEATHER</h3></div>
            <div className="w-body">
                <div className="w-main">
                    <div className="w-icon-large">{weather.icon}</div>
                    <div className="w-temp">
                        <h2>{weather.temp}°</h2>
                        <p>{weather.desc}</p>
                    </div>
                </div>
                <div className="w-strip">
                    {weather.forecast.map((f, i) => (
                        <div key={i} className="wf-item">
                            <span>{f.day}</span>
                            <strong>{f.temp}°</strong>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>

        {/* Analytics/DNA Card */}
        <motion.div className="bento-card glass dna-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="card-head"><h3>TRIP VIBE</h3></div>
            <div className="dna-body">
                <RadarChart theme={theme} data={[
                  { label: 'Adventure', value: 80 },
                  { label: 'Relax', value: 30 },
                  { label: 'Food', value: 90 },
                  { label: 'Culture', value: 65 },
                  { label: 'Social', value: 50 }
                ]} />
            </div>
        </motion.div>

        {/* Financial Summary */}
        <motion.div className="bento-card glass budget-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <div className="card-head"><h3>FINANCES</h3><span className="b-total">₹{tripConfig.budget.toLocaleString()}</span></div>
            <div className="b-body">
                <div className="b-spent">
                    <h2>₹{spent.toLocaleString()}</h2>
                    <p>Total Spent</p>
                </div>
                <div className="b-progress">
                    <div className="b-track"><motion.div initial={{ width: 0 }} animate={{ width: `${(spent/tripConfig.budget)*100}%` }} className="b-fill" /></div>
                    <div className="b-markers">
                        <span>Spent: {Math.round((spent/tripConfig.budget)*100)}%</span>
                        <span>Left: ₹{(tripConfig.budget - spent).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Intelligence Feed */}
        <motion.div className="bento-card glass intel-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <div className="card-head"><h3>INTEL FEED</h3></div>
            <div className="intel-list">
                {activityLog.slice(0, 5).map((intel) => {
                    // Helper to format time relative to now
                    const diffMins = Math.floor((new Date() - new Date(intel.time)) / 60000);
                    let timeStr = 'Just now';
                    if (diffMins >= 1440) timeStr = `${Math.floor(diffMins / 1440)}d`;
                    else if (diffMins >= 60) timeStr = `${Math.floor(diffMins / 60)}h`;
                    else if (diffMins > 0) timeStr = `${diffMins}m`;

                    return (
                        <div key={intel.id} className="intel-row">
                            <div className="intel-avatar" style={{ background: intel.color }}>{intel.user}</div>
                            <div className="intel-info">
                                <p>{intel.text}</p>
                                <span>{timeStr} ago</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>

        {/* Activity Quick Access */}
        <div className="quick-access-grid">
            <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/itinerary`)}><Compass /> <span>Explore</span></button>
            <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/expenses`)}><IndianRupee /> <span>Wallet</span></button>
            <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/members`)}><Users /> <span>Social</span></button>
            <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/vault`)}><Briefcase /> <span>Vault</span></button>
        </div>
      </div>

      {/* Destination Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
            <motion.div className="modal-panel glass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="m-head"><h3>Trip Settings</h3><button onClick={() => setIsEditing(false)}><X size={16} /></button></div>
              <form onSubmit={e => { 
                  e.preventDefault(); 
                  setTripConfig({...tripConfig, destination: tempDest, startDate: new Date(tempDate).toISOString()}); 
                  setIsEditing(false); 
              }}>
                <div className="input-field">
                    <MapPin size={16} />
                    <input autoFocus value={tempDest} onChange={e => setTempDest(e.target.value)} placeholder="Enter city or country..." />
                </div>
                <div className="input-field">
                    <Calendar size={16} />
                    <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)} />
                </div>
                <button type="submit" className="m-submit-btn">REDEPLOY MISSION</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .dash-container { display: flex; flex-direction: column; gap: 1.25rem; max-width: 1200px; margin: 0 auto; }
        
        /* Hero Styling */
        .hero-section { width: 100%; }
        .hero-card { border-radius: 20px; overflow: hidden; border: 1px solid var(--glass-border); }
        .hero-img-box { height: 200px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; }
        .hero-gradient-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); }
        .hero-content { position: relative; width: 100%; padding: 1.5rem; color: #fff; }
        .hero-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .hero-badge { font-size: 0.6rem; font-weight: 900; background: hsla(var(--p) / 0.3); color: #fff; padding: 3px 10px; border-radius: 100px; border: 1px solid hsla(var(--p) / 0.5); letter-spacing: 0.05em; }
        .hero-time { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 4px; }
        .hero-title-area { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .hero-title-area h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; margin: 0; }
        .edit-dest-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .edit-dest-btn:hover { background: rgba(255,255,255,0.2); }
        .hero-stats-row { display: flex; gap: 2.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
        .h-stat { display: flex; flex-direction: column; }
        .h-stat span { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
        .h-stat strong { font-size: 1.25rem; font-weight: 900; }

        /* Bento Grid */
        .dash-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .bento-card { border-radius: 18px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid var(--glass-border); transition: 0.3s; }
        .bento-card:hover { transform: translateY(-2px); border-color: hsla(var(--p) / 0.2); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); }
        .card-head h3 { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.1em; color: hsl(var(--text-muted)); text-transform: uppercase; }

        /* Weather Card */
        .weather-card { grid-column: span 1; }
        .w-main { display: flex; align-items: center; gap: 1rem; }
        .w-icon-large { color: hsl(var(--p)); }
        .w-temp h2 { font-size: 2.25rem; font-weight: 900; line-height: 1; }
        .w-temp p { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 700; }
        .w-strip { display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid hsl(var(--border)); }
        .wf-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .wf-item span { font-size: 0.6rem; font-weight: 800; color: hsl(var(--text-muted)); }
        .wf-item strong { font-size: 0.85rem; }

        /* DNA Card */
        .dna-card { grid-column: span 1; align-items: center; }
        .radar-svg { width: 100%; height: 140px; }
        .r-grid { fill: none; stroke: hsl(var(--border)); stroke-width: 0.5; }
        .r-area { fill: hsla(var(--p) / 0.15); stroke: hsl(var(--p)); stroke-width: 2; filter: drop-shadow(0 0 5px hsla(var(--p) / 0.3)); }
        .r-label { fill: hsl(var(--text-muted)); font-size: 7px; font-weight: 800; text-transform: uppercase; }

        /* Budget Card */
        .budget-card { grid-column: span 2; }
        .budget-card .card-head { display: flex; justify-content: space-between; align-items: center; }
        .b-total { font-size: 0.8rem; font-weight: 800; color: hsl(var(--text-muted)); }
        .b-spent h2 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.02em; }
        .b-spent p { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 700; }
        .b-progress { margin-top: 0.5rem; }
        .b-track { height: 8px; background: hsla(var(--text) / 0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
        .b-fill { height: 100%; background: linear-gradient(to right, hsl(var(--p)), hsl(var(--p-light))); border-radius: 4px; }
        .b-markers { display: flex; justify-content: space-between; font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); }

        /* Intel Card */
        .intel-card { grid-column: span 2; }
        .intel-list { display: flex; flex-direction: column; gap: 1rem; }
        .intel-row { display: flex; gap: 0.875rem; align-items: center; }
        .intel-avatar { width: 24px; height: 24px; border-radius: 8px; font-size: 0.6rem; font-weight: 900; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .intel-info p { font-size: 0.8rem; font-weight: 600; margin: 0; color: hsl(var(--text)); }
        .intel-info span { font-size: 0.65rem; color: hsl(var(--text-muted)); font-weight: 700; }

        /* Quick Access */
        .quick-access-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; grid-column: span 2; }
        .qa-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; border: none; cursor: pointer; padding: 1.25rem; border-radius: 18px; transition: 0.2s; color: hsl(var(--text-muted)); }
        .qa-item:hover { color: hsl(var(--p)); background: hsla(var(--p) / 0.05); border-color: hsla(var(--p) / 0.2); }
        .qa-item span { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .qa-item svg { width: 20px; height: 20px; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: hsla(0,0%,0%,0.5); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-panel { width: 100%; max-width: 400px; padding: 2rem; border-radius: 24px; border: 1px solid var(--glass-border); }
        .m-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-head h3 { font-size: 1.25rem; font-weight: 850; }
        .input-field { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: hsla(var(--text) / 0.03); border-radius: 16px; border: 1px solid hsl(var(--border)); margin-bottom: 1.5rem; }
        .input-field input { background: none; border: none; outline: none; flex: 1; font-size: 1rem; color: hsl(var(--text)); font-weight: 600; }
        .m-submit-btn { width: 100%; padding: 1rem; border-radius: 16px; border: none; background: hsl(var(--p)); color: #fff; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px hsla(var(--p) / 0.3); transition: 0.2s; }
        .m-submit-btn:hover { transform: translateY(-2px); background: hsl(var(--p-dark)); }

        @media (max-width: 1024px) {
            .dash-bento { grid-template-columns: repeat(2, 1fr); }
            .hero-title-area h1 { font-size: 2rem; }
        }
        @media (max-width: 600px) {
            .dash-bento { grid-template-columns: 1fr; }
            .hero-stats-row { gap: 1.5rem; flex-wrap: wrap; }
            .budget-card, .intel-card, .dna-card, .weather-card { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
