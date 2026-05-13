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
  Target, Zap as Adventure, Heart as Relaxing, Palette as Culture, Globe,
  BarChart3, Database, PieChart, ShieldCheck, TrendingUp as Growth, Flag
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
    <div className="member-dashboard">
      <header className="member-hero glass">
        <div className="hero-content">
          <div className="hero-badge">TEAM MEMBER STATUS: ACTIVE</div>
          <h1 className="hero-dest">{tripConfig.destination || 'Mission Pending'}</h1>
          <p className="hero-trip-name">{tripConfig.tripName}</p>
          <div className="hero-stats">
            <div className="h-stat"><span>PACKED</span><strong>{packedPct}%</strong></div>
            <div className="h-stat"><span>DAYS TO GO</span><strong>{daysRemaining > 0 ? daysRemaining : '0'}</strong></div>
            <div className="h-stat"><span>TEAM SIZE</span><strong>{members.length}</strong></div>
          </div>
        </div>
      </header>

      <div className="member-grid">
        {/* Weather Card */}
        <motion.div className="bento-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-head"><h3>LOCAL WEATHER</h3></div>
          <div className="w-body">
            <div className="w-main">
              <div className="w-icon">{weather.icon}</div>
              <div className="w-info">
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

        {/* Intelligence Feed */}
        <motion.div className="bento-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-head"><h3>MISSION INTEL</h3></div>
          <div className="intel-list">
            {activityLog.slice(0, 5).map(log => (
              <div key={log.id} className="intel-row">
                <div className="intel-avatar" style={{ background: log.color }}>{log.user}</div>
                <div className="intel-info">
                  <p>{log.text}</p>
                  <span>{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="quick-links">
          <button className="qa-card glass" onClick={() => navigate('/member/mission-brief')}>
            <Target />
            <span>Mission Brief</span>
          </button>
          <button className="qa-card glass" onClick={() => navigate('/member/itinerary')}>
            <Compass />
            <span>Itinerary</span>
          </button>
          <button className="qa-card glass" onClick={() => navigate('/member/checklists')}>
            <Briefcase />
            <span>Packing List</span>
          </button>
        </div>
      </div>

      <style>{`
        .member-dashboard { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        
        .member-hero { 
          padding: 3rem; border-radius: 24px; 
          background: linear-gradient(135deg, hsla(var(--p)/.1) 0%, transparent 50%), url('${heroImg}');
          background-size: cover; background-position: center; position: relative; overflow: hidden;
          color: #fff;
        }
        .member-hero::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 0; }
        .hero-content { position: relative; z-index: 1; }
        .hero-dest { font-size: 3rem; font-weight: 900; margin: 0.5rem 0; letter-spacing: -0.04em; }
        .hero-trip-name { font-size: 1rem; font-weight: 600; opacity: 0.8; margin-bottom: 2rem; }
        .hero-stats { display: flex; gap: 4rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1.5rem; }
        .hero-badge { font-size: 0.6rem; font-weight: 800; background: hsla(0,0%,100%,0.1); padding: 4px 12px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.2); width: fit-content; }

        .member-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .bento-card { padding: 1.75rem; border-radius: 20px; }
        .card-head h3 { font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; margin-bottom: 1.5rem; }

        .w-main { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
        .w-info h2 { font-size: 2.5rem; font-weight: 900; margin: 0; }
        .w-strip { display: flex; justify-content: space-between; border-top: 1px solid hsla(var(--border), 0.5); padding-top: 1.25rem; }
        .wf-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .wf-item span { font-size: 0.65rem; font-weight: 700; color: hsl(var(--text-muted)); }

        .intel-list { display: flex; flex-direction: column; gap: 1rem; }
        .intel-row { display: flex; gap: 1rem; align-items: center; padding: 0.75rem; background: hsla(var(--bg), 0.5); border-radius: 12px; border: 1px solid hsla(var(--border), 0.3); }
        .intel-avatar { width: 32px; height: 32px; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
        .intel-info p { font-size: 0.85rem; font-weight: 600; margin: 0; }
        .intel-info span { font-size: 0.7rem; opacity: 0.6; }

        .quick-links { grid-column: span 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .qa-card { 
          display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 2rem; border-radius: 20px;
          cursor: pointer; transition: 0.2s; color: hsl(var(--text-muted)); border: 1px solid hsla(var(--border), 0.5);
        }
        .qa-card:hover { border-color: hsl(var(--p)); color: hsl(var(--p)); background: hsla(var(--p)/.05); transform: translateY(-4px); }
        .qa-card span { font-size: 0.85rem; font-weight: 700; }

        @media (max-width: 768px) {
          .member-grid { grid-template-columns: 1fr; gap: 1rem; }
          .quick-links { grid-template-columns: repeat(2, 1fr); grid-column: span 1; }
          .hero-dest { font-size: 1.75rem; }
          .hero-stats { flex-direction: row; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
          .h-stat { flex: 1; min-width: 100px; }
          .h-stat strong { font-size: 1.1rem; }
          .member-hero { padding: 1.5rem; border-radius: 16px; margin: 0; }
          .w-strip { flex-wrap: wrap; gap: 0.75rem; }
          .qa-card { padding: 1.25rem; }
        }
        @media (max-width: 480px) {
          .hero-dest { font-size: 1.5rem; }
          .quick-links { grid-template-columns: 1fr; }
          .hero-stats { gap: 0.75rem; }
          .h-stat { min-width: 80px; }
          .h-stat strong { font-size: 1rem; }
        }
      `}</style>
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
        .dash-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
        
        /* Hero Styling */
        .hero-section { width: 100%; }
        .hero-card { border-radius: 24px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .hero-img-box { height: 280px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; }
        .hero-gradient-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%); }
        .hero-content { position: relative; width: 100%; padding: 2rem 2.5rem; color: #fff; }
        .hero-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .hero-badge { font-size: 0.65rem; font-weight: 700; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); padding: 4px 12px; border-radius: 100px; display: flex; align-items: center; gap: 6px; }
        .hero-time { font-size: 0.75rem; font-weight: 600; color: hsl(var(--text-muted)); display: flex; align-items: center; gap: 6px; }
        .hero-title-area { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
        .hero-title-area h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; margin: 0; color: hsl(var(--text)); line-height: 1; }
        .edit-dest-btn { background: hsl(var(--bg)); border: 1px solid hsl(var(--border)); color: hsl(var(--text)); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-shadow: var(--shadow-sm); }
        .edit-dest-btn:hover { background: hsl(var(--bg-card)); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .hero-stats-row { display: flex; gap: 4rem; border-top: 1px solid hsl(var(--border)); padding-top: 1.5rem; }
        .h-stat { display: flex; flex-direction: column; }
        .h-stat span { font-size: 0.7rem; font-weight: 600; color: hsl(var(--text-muted)); text-transform: uppercase; margin-bottom: 4px; display: block; }
        .h-stat strong { font-size: 1.5rem; font-weight: 800; color: hsl(var(--text)); }

        /* Bento Grid */
        .dash-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .bento-card { border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid hsl(var(--border)); transition: 0.2s; background: hsl(var(--bg-card)); box-shadow: var(--shadow-sm); }
        .bento-card:hover { transform: translateY(-2px); border-color: hsl(var(--text-muted)); box-shadow: var(--shadow-card); }
        .card-head { display: flex; justify-content: space-between; align-items: center; }
        .card-head h3 { font-size: 0.75rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; margin: 0; }

        /* Weather Card */
        .weather-card { grid-column: span 1; }
        .w-main { display: flex; align-items: center; gap: 1rem; }
        .w-icon-large { color: hsl(var(--p)); }
        .w-temp h2 { font-size: 2rem; font-weight: 800; line-height: 1; color: hsl(var(--text)); margin: 0; }
        .w-temp p { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; text-transform: uppercase; margin: 0; }
        .w-strip { display: flex; justify-content: space-between; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid hsl(var(--border)); }
        .wf-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .wf-item span { font-size: 0.65rem; font-weight: 600; color: hsl(var(--text-muted)); text-transform: uppercase; }
        .wf-item strong { font-size: 0.85rem; color: hsl(var(--text)); font-weight: 700; }

        /* DNA Card */
        .dna-card { grid-column: span 1; align-items: center; }
        .radar-svg { width: 100%; height: 160px; }
        .r-grid { fill: none; stroke: hsl(var(--border)); stroke-width: 1; }
        .r-area { fill: hsla(var(--p) / 0.1); stroke: hsl(var(--p)); stroke-width: 2; }
        .r-label { fill: hsl(var(--text-muted)); font-size: 8px; font-weight: 600; text-transform: uppercase; }

        /* Budget Card */
        .budget-card { grid-column: span 2; }
        .b-total { font-size: 0.85rem; font-weight: 600; color: hsl(var(--text-muted)); background: hsl(var(--bg)); padding: 4px 12px; border-radius: 100px; border: 1px solid hsl(var(--border)); }
        .b-spent h2 { font-size: 2.25rem; font-weight: 800; color: hsl(var(--text)); line-height: 1.1; margin: 0; }
        .b-spent p { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 600; text-transform: uppercase; margin: 0; }
        .b-progress { margin-top: 1.5rem; }
        .b-track { height: 8px; background: hsl(var(--bg)); border-radius: 10px; overflow: hidden; }
        .b-fill { height: 100%; background: hsl(var(--p)); border-radius: 10px; position: relative; }
        .b-markers { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: hsl(var(--text-muted)); margin-top: 0.5rem; }

        /* Intel Card */
        .intel-card { grid-column: span 2; }
        .intel-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }
        .intel-row { display: flex; gap: 1rem; align-items: center; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: hsl(var(--bg)); transition: 0.2s; }
        .intel-row:hover { background: hsla(var(--text)/0.02); }
        .intel-avatar { width: 32px; height: 32px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .intel-info p { font-size: 0.85rem; font-weight: 600; margin: 0 0 2px 0; color: hsl(var(--text)); }
        .intel-info span { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 600; text-transform: uppercase; }

        /* Quick Access */
        .quick-access-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; grid-column: span 2; }
        .qa-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid hsl(var(--border)); cursor: pointer; padding: 1.5rem; border-radius: var(--radius-md); transition: 0.2s; color: hsl(var(--text-muted)); background: hsl(var(--bg-card)); }
        .qa-item:hover { color: hsl(var(--p)); background: hsla(var(--p)/0.05); border-color: hsla(var(--p)/0.3); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .qa-item span { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .qa-item svg { width: 24px; height: 24px; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-panel { width: 100%; max-width: 440px; padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid hsl(var(--border)); background: hsl(var(--bg-card)); box-shadow: var(--shadow-lg); }
        .m-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-head h3 { font-size: 1.25rem; font-weight: 700; color: hsl(var(--text)); margin: 0; }
        .m-head button { background: transparent; border: none; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; font-size: 1rem; }
        .m-head button:hover { color: hsl(var(--text)); }
        .input-field { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: hsl(var(--bg)); border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); margin-bottom: 1.5rem; }
        .input-field svg { color: hsl(var(--text-muted)); }
        .input-field input { background: none; border: none; outline: none; flex: 1; font-size: 0.95rem; color: hsl(var(--text)); }
        .m-submit-btn { width: 100%; padding: 1rem; border-radius: var(--radius-sm); border: none; background: hsl(var(--p)); color: white; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .m-submit-btn:hover { background: hsl(var(--p-dark)); }

        /* Admin Specific Overrides */
        .admin-intel-card { position: relative; overflow: hidden; }
        .live-tag.success { color: hsl(var(--success)); background: hsla(var(--success) / 0.1); }
        .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; padding: 1.5rem 0; }
        .admin-stat-item { display: flex; gap: 1rem; align-items: flex-start; }
        .admin-icon { width: 44px; height: 44px; background: hsla(var(--p) / 0.1); border-radius: var(--radius-sm); color: hsl(var(--p)); display: flex; align-items: center; justify-content: center; }
        .admin-icon.success { color: hsl(var(--success)); background: hsla(var(--success) / 0.1); }
        .admin-info { display: flex; flex-direction: column; gap: 2px; }
        .admin-label { font-size: 0.75rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .admin-value { font-size: 1.5rem; font-weight: 800; color: hsl(var(--text)); margin: 0; }
        .admin-growth { font-size: 0.75rem; font-weight: 600; color: hsl(var(--success)); display: flex; align-items: center; gap: 4px; }

        /* Mission Control Owner Card */
        .mc-owner-card { background: linear-gradient(135deg, hsla(var(--success)/.06) 0%, hsl(var(--bg-card)) 60%) !important; border: 1px solid hsla(var(--success)/.25) !important; }
        .mc-top-bar { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; }
        .mc-live-badge { display:inline-flex; align-items:center; gap:7px; font-size:0.58rem; font-weight:800; color:hsl(var(--success)); background:hsla(var(--success)/.1); border:1px solid hsla(var(--success)/.2); padding:3px 10px; border-radius:100px; letter-spacing:0.07em; margin-bottom:0.5rem; }
        .mc-live-dot { width:6px; height:6px; border-radius:50%; background:hsl(var(--success)); animation:mc-pulse 1.4s infinite; }
        @keyframes mc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.8)} }
        .mc-heading { font-size:0.78rem; font-weight:800; color:hsl(var(--text-muted)); letter-spacing:0.1em; margin:0; }
        .mc-readiness { display:flex; flex-direction:column; align-items:flex-end; }
        .mc-readiness strong { font-size:2rem; font-weight:800; color:hsl(var(--success)); line-height:1; }
        .mc-readiness span { font-size:0.55rem; font-weight:800; color:hsl(var(--text-muted)); letter-spacing:0.1em; }
        .mc-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
        .mc-stat { display:flex; gap:0.875rem; align-items:flex-start; padding:1rem; background:hsl(var(--bg)); border:1px solid hsl(var(--border)); border-radius:var(--radius-md); transition:0.2s; }
        .mc-stat:hover { border-color:hsl(var(--text-muted)); transform:translateY(-1px); }
        .mc-stat-icon { width:36px; height:36px; border-radius:8px; background:hsla(var(--success)/.1); color:hsl(var(--success)); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .mc-stat-icon.ready { background:hsla(var(--success)/.1); color:hsl(var(--success)); }
        .mc-stat-body { display:flex; flex-direction:column; gap:3px; flex:1; }
        .mc-stat-label { font-size:0.58rem; font-weight:800; color:hsl(var(--text-muted)); letter-spacing:0.08em; }
        .mc-stat-val { font-size:1.15rem; font-weight:800; color:hsl(var(--text)); line-height:1.1; }
        .mc-stat-sub { font-size:0.65rem; font-weight:600; color:hsl(var(--text-muted)); }
        .mc-stat-sub.success { color:hsl(var(--success)); }
        .mc-mini-bar { height:3px; background:hsl(var(--border)); border-radius:10px; overflow:hidden; margin-top:4px; }
        .mc-mini-fill { height:100%; border-radius:10px; }
        @media(max-width:1024px){ .mc-stats-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .mc-stats-grid { grid-template-columns:1fr; } }

        @media (max-width: 1024px) {
            .dash-bento { grid-template-columns: repeat(2, 1fr); }
            .admin-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
            .dash-bento { grid-template-columns: 1fr; }
            .admin-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            .hero-stats-row { gap: 1.5rem; flex-wrap: wrap; }
            .budget-card, .intel-card, .dna-card, .weather-card { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
