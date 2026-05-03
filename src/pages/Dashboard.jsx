import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, PlaneTakeoff, Navigation, Users, 
  CloudSun, TrendingUp, Clock, ArrowUpRight, 
  ArrowDownRight, Compass, MapPin, IndianRupee,
  Activity, Wind, Sun, Edit3, X, Calendar,
  CloudRain, Zap, Thermometer, Info, ChevronRight,
  Target, Zap as Adventure, Heart as Relaxing, Palette as Culture
} from 'lucide-react';

// Advanced Radar Chart for Trip "DNA"
const RadarChart = ({ data }) => {
  const points = data.map((d, i) => {
    const angle = (i * 360) / data.length;
    const r = (d.value / 100) * 40;
    const x = 50 + r * Math.cos((angle - 90) * (Math.PI / 180));
    const y = 50 + r * Math.sin((angle - 90) * (Math.PI / 180));
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="radar-chart">
      <circle cx="50" cy="50" r="40" className="radar-grid" />
      <circle cx="50" cy="50" r="30" className="radar-grid" />
      <circle cx="50" cy="50" r="20" className="radar-grid" />
      <circle cx="50" cy="50" r="10" className="radar-grid" />
      <polygon points={points} className="radar-area" />
      {data.map((d, i) => {
        const angle = (i * 360) / data.length;
        const x = 50 + 45 * Math.cos((angle - 90) * (Math.PI / 180));
        const y = 50 + 45 * Math.sin((angle - 90) * (Math.PI / 180));
        return <g key={i}><text x={x} y={y} className="radar-label">{d.label[0]}</text></g>;
      })}
    </svg>
  );
};

export default function Dashboard() {
  const { items, members, expenses, tripConfig, setTripConfig } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDest, setTempDest] = useState(tripConfig.destination);
  const [weather, setWeather] = useState({ temp: 24, desc: 'Partly Cloudy', icon: <CloudSun size={32} />, forecast: [] });
  const [heroImg, setHeroImg] = useState('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200');

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        // 1. Fetch Background Image
        setHeroImg(`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200`); // Fallback
        setHeroImg(`https://source.unsplash.com/featured/1200x600?${encodeURIComponent(tripConfig.destination)}&t=${Date.now()}`);

        // 2. Geocode & Weather
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
              if (c <= 3) return { desc: 'Clear', icon: <Sun size={32} /> };
              if (c <= 48) return { desc: 'Cloudy', icon: <CloudSun size={32} /> };
              if (c <= 67) return { desc: 'Rainy', icon: <CloudRain size={32} /> };
              return { desc: 'Stormy', icon: <Zap size={32} /> };
            };

            const daily = weatherData.daily.temperature_2m_max.slice(1, 6).map((t, i) => ({
              temp: Math.round(t),
              code: weatherData.daily.weathercode[i+1],
              day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(new Date().getDay() + i + 1) % 7]
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
    <div className="dashboard-ultra">
      {/* Dynamic Background Blur */}
      <div className="ultra-bg" style={{ backgroundImage: `url(${heroImg})` }} />

      <div className="bento-grid-ultra">
        {/* Immersive Hero */}
        <motion.div 
          className="bento-item-ultra hero-ultra"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="hero-overlay">
            <div className="hero-content-ultra">
              <div className="badge-premium"><Target size={12} /> UPCOMING TRIP</div>
              <div className="hero-title-group">
                <h1>{tripConfig.destination}</h1>
                <button className="btn-edit-ultra" onClick={() => setIsEditing(true)}><Edit3 size={18} /></button>
              </div>
              <p className="hero-subtitle">Departure in {daysRemaining} days • Team of {members.length} ready</p>
              <div className="hero-stats-row">
                <div className="h-stat"><strong>{packedPct}%</strong><span>Packed</span></div>
                <div className="h-stat"><strong>₹{spent.toLocaleString()}</strong><span>Invested</span></div>
                <div className="h-stat"><strong>{items.length}</strong><span>Items</span></div>
              </div>
            </div>
            <div className="hero-image-preview" style={{ backgroundImage: `url(${heroImg})` }}>
              <div className="image-blur-layer" />
            </div>
          </div>
        </motion.div>

        {/* Live Weather Forecast */}
        <motion.div 
          className="bento-item-ultra glass-ultra weather-ultra"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="weather-current-ultra">
            <div className="w-icon-ultra">{weather.icon}</div>
            <div className="w-info-ultra">
              <span className="w-temp-ultra">{weather.temp}°</span>
              <span className="w-desc-ultra">{weather.desc}</span>
            </div>
          </div>
          <div className="weather-forecast-strip">
            {weather.forecast.map((f, i) => (
              <div key={i} className="f-day">
                <span>{f.day}</span>
                <strong>{f.temp}°</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trip DNA Chart */}
        <motion.div 
          className="bento-item-ultra glass-ultra dna-ultra"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header-ultra">
            <h3>TRIP DNA</h3>
            <Info size={14} className="info-icon" />
          </div>
          <div className="dna-content">
            <RadarChart data={[
              { label: 'Adventure', value: 85 },
              { label: 'Relaxing', value: 40 },
              { label: 'Culture', value: 70 },
              { label: 'Food', value: 95 },
              { label: 'Budget', value: 60 }
            ]} />
            <div className="dna-legend">
              <div><Adventure size={12} /> Adventure <span>85%</span></div>
              <div><Relaxing size={12} /> Relaxing <span>40%</span></div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Grid */}
        <div className="bento-item-ultra quick-grid-ultra">
          <button className="quick-box glass-ultra">
            <div className="q-icon" style={{ background: 'hsla(var(--p) / 0.15)' }}><Compass size={20} /></div>
            <span>Explorer</span>
          </button>
          <button className="quick-box glass-ultra">
            <div className="q-icon" style={{ background: 'hsla(var(--success) / 0.15)' }}><PlaneTakeoff size={20} /></div>
            <span>Bookings</span>
          </button>
          <button className="quick-box glass-ultra">
            <div className="q-icon" style={{ background: 'hsla(var(--warning) / 0.15)' }}><Users size={20} /></div>
            <span>Splits</span>
          </button>
          <button className="quick-box glass-ultra">
            <div className="q-icon" style={{ background: 'hsla(var(--danger) / 0.15)' }}><IndianRupee size={20} /></div>
            <span>Currency</span>
          </button>
        </div>

        {/* Activity Intelligence */}
        <motion.div 
          className="bento-item-ultra glass-ultra activity-ultra col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header-ultra">
            <h3>INTEL FEED</h3>
            <button className="btn-all">FULL LOG <ChevronRight size={14} /></button>
          </div>
          <div className="intel-list">
            {[
              { user: 'John', text: 'Checked off "Medical Kit"', time: '2m ago', type: 'checklist' },
              { user: 'System', text: 'Weather alert: Rain expected Tuesday', time: '1h ago', type: 'alert' },
              { user: 'Sarah', text: 'Added new document to Vault', time: '3h ago', type: 'vault' }
            ].map((item, i) => (
              <div key={i} className="intel-row">
                <div className={`intel-type ${item.type}`} />
                <div className="intel-body">
                  <p><strong>{item.user}</strong> {item.text}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial Health */}
        <motion.div 
          className="bento-item-ultra glass-ultra budget-ultra col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header-ultra">
            <h3>FINANCIAL HEALTH</h3>
            <span className="budget-cap">CAP: ₹{tripConfig.budget.toLocaleString()}</span>
          </div>
          <div className="budget-metrics-ultra">
            <div className="metric-main">
              <span className="m-label">Total Burn</span>
              <span className="m-value">₹{spent.toLocaleString()}</span>
              <div className="m-progress-bar">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(spent / tripConfig.budget) * 100}%` }} 
                  className="m-progress-fill" 
                />
              </div>
            </div>
            <div className="metric-grid-ultra">
              <div className="m-sub"><span>Remaining</span><strong>₹{Math.max(tripConfig.budget - spent, 0).toLocaleString()}</strong></div>
              <div className="m-sub"><span>Daily Avg</span><strong>₹{Math.round(spent / 5).toLocaleString()}</strong></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Destination Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <motion.div 
              className="modal-content-ultra glass-ultra"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header-ultra">
                <h2>Re-Route Mission</h2>
                <button className="close-btn" onClick={() => setIsEditing(false)}><X size={20} /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setTripConfig({...tripConfig, destination: tempDest}); setIsEditing(false); }} className="modal-form-ultra">
                <div className="input-group-ultra">
                  <label>NEW DESTINATION</label>
                  <input autoFocus value={tempDest} onChange={e => setTempDest(e.target.value)} placeholder="Where are we heading?" />
                </div>
                <div className="input-group-ultra">
                  <label>START DATE</label>
                  <input type="date" value={tripConfig.startDate.split('T')[0]} onChange={e => setTripConfig({...tripConfig, startDate: new Date(e.target.value).toISOString()})} />
                </div>
                <button type="submit" className="btn-save-ultra">INITIALIZE MISSION</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .dashboard-ultra { position: relative; min-height: 100vh; padding: 2rem; color: #fff; overflow-x: hidden; }
        .ultra-bg { position: fixed; inset: 0; background-size: cover; background-position: center; filter: blur(100px) brightness(0.3); opacity: 0.6; z-index: -1; transform: scale(1.2); }
        
        .bento-grid-ultra { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: auto auto; gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
        .bento-item-ultra { border-radius: 24px; overflow: hidden; position: relative; }
        .glass-ultra { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        
        /* Hero */
        .hero-ultra { grid-column: span 3; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); }
        .hero-overlay { display: grid; grid-template-columns: 1.5fr 1fr; height: 320px; }
        .hero-content-ultra { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        .badge-premium { display: inline-flex; align-items: center; gap: 6px; background: hsla(var(--p) / 0.2); color: hsl(var(--p-light)); font-size: 0.65rem; font-weight: 800; padding: 4px 12px; border-radius: 100px; width: fit-content; margin-bottom: 1.5rem; letter-spacing: 0.05em; border: 1px solid hsla(var(--p) / 0.3); }
        .hero-title-group { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
        .hero-title-group h1 { font-size: 4rem; line-height: 1; letter-spacing: -0.04em; }
        .btn-edit-ultra { background: rgba(255,255,255,0.1); border: none; color: #fff; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .btn-edit-ultra:hover { background: hsla(var(--p) / 0.5); transform: rotate(15deg) scale(1.1); }
        .hero-subtitle { color: rgba(255,255,255,0.5); font-size: 1rem; margin-bottom: 2.5rem; }
        .hero-stats-row { display: flex; gap: 3rem; }
        .h-stat { display: flex; flex-direction: column; }
        .h-stat strong { font-size: 1.5rem; font-weight: 800; }
        .h-stat span { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700; }
        .hero-image-preview { position: relative; background-size: cover; background-position: center; border-left: 1px solid rgba(255,255,255,0.1); }
        .image-blur-layer { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.5), transparent); }

        /* Weather */
        .weather-ultra { padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; }
        .weather-current-ultra { display: flex; align-items: center; gap: 1.5rem; }
        .w-icon-ultra { font-size: 3rem; color: hsl(var(--p-light)); }
        .w-info-ultra { display: flex; flex-direction: column; }
        .w-temp-ultra { font-size: 3.5rem; font-weight: 800; line-height: 1; }
        .w-desc-ultra { font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.6); }
        .weather-forecast-strip { display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 16px; }
        .f-day { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .f-day span { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.4); }
        .f-day strong { font-size: 0.9rem; }

        /* Radar Chart */
        .dna-ultra { padding: 1.5rem; }
        .section-header-ultra { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header-ultra h3 { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
        .radar-chart { width: 100%; height: 180px; }
        .radar-grid { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 0.5; }
        .radar-area { fill: hsla(var(--p) / 0.3); stroke: hsl(var(--p-light)); stroke-width: 2; }
        .radar-label { fill: rgba(255,255,255,0.4); font-size: 8px; font-weight: 800; }
        .dna-content { display: flex; align-items: center; gap: 1rem; }
        .dna-legend { display: flex; flex-direction: column; gap: 12px; }
        .dna-legend div { font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); }
        .dna-legend span { margin-left: auto; color: #fff; }

        /* Quick Grid */
        .quick-grid-ultra { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .quick-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; border: none; cursor: pointer; transition: 0.3s; padding: 1.5rem; }
        .quick-box:hover { background: rgba(255,255,255,0.1); transform: translateY(-5px); }
        .q-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .quick-box span { font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.6); }

        /* Intel Feed */
        .activity-ultra { padding: 2rem; }
        .btn-all { background: none; border: none; color: hsl(var(--p-light)); font-size: 0.7rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .intel-list { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }
        .intel-row { display: flex; align-items: flex-start; gap: 1rem; }
        .intel-type { width: 4px; height: 32px; border-radius: 2px; }
        .intel-type.checklist { background: hsl(var(--p)); }
        .intel-type.alert { background: hsl(var(--danger)); }
        .intel-type.vault { background: hsl(var(--warning)); }
        .intel-body p { font-size: 0.875rem; color: rgba(255,255,255,0.8); }
        .intel-body span { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 600; }

        /* Budget */
        .budget-ultra { padding: 2rem; }
        .budget-cap { font-size: 0.7rem; font-weight: 900; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 6px; }
        .budget-metrics-ultra { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; margin-top: 1.5rem; }
        .metric-main { display: flex; flex-direction: column; gap: 4px; }
        .m-label { font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.4); }
        .m-value { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.02em; }
        .m-progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-top: 1rem; }
        .m-progress-fill { height: 100%; background: linear-gradient(to right, hsl(var(--p)), hsl(var(--p-light))); border-radius: 4px; }
        .metric-grid-ultra { display: flex; flex-direction: column; gap: 1rem; }
        .m-sub { display: flex; flex-direction: column; }
        .m-sub span { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .m-sub strong { font-size: 1.1rem; font-weight: 800; }

        /* Modal Ultra */
        .modal-content-ultra { width: 100%; max-width: 500px; padding: 3rem; border-radius: 32px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
        .modal-header-ultra { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .modal-header-ultra h2 { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; }
        .input-group-ultra { display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem; }
        .input-group-ultra label { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.5); letter-spacing: 0.1em; }
        .input-group-ultra input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 16px; color: #fff; font-size: 1.1rem; outline: none; transition: 0.3s; }
        .input-group-ultra input:focus { border-color: hsl(var(--p)); background: rgba(255,255,255,0.1); box-shadow: 0 0 20px hsla(var(--p) / 0.2); }
        .btn-save-ultra { width: 100%; padding: 1.25rem; border-radius: 16px; border: none; background: hsl(var(--p)); color: #fff; font-weight: 900; font-size: 1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 30px hsla(var(--p) / 0.4); }
        .btn-save-ultra:hover { transform: translateY(-3px); box-shadow: 0 15px 40px hsla(var(--p) / 0.5); }

        @media (max-width: 1200px) {
          .bento-grid-ultra { grid-template-columns: 1fr 1fr; }
          .hero-ultra, .activity-ultra, .budget-ultra { grid-column: span 2; }
          .hero-title-group h1 { font-size: 3rem; }
        }
        @media (max-width: 768px) {
          .bento-grid-ultra { grid-template-columns: 1fr; }
          .hero-ultra, .activity-ultra, .budget-ultra { grid-column: span 1; }
          .hero-overlay { grid-template-columns: 1fr; height: auto; }
          .hero-image-preview { display: none; }
          .hero-title-group h1 { font-size: 2.5rem; }
          .dashboard-ultra { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
