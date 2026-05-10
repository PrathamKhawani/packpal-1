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
    <div className="dash-container">
      {/* Hero Section - HIDDEN FOR ADMIN */}
      {currentUser?.role !== 'admin' && (
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
      )}

      {/* Bento Grid */}
      <div className="dash-bento">
        {/* Admin Business Intel - EXCLUSIVE TO ADMIN */}
        {currentUser?.role === 'admin' && (
          <motion.div 
            className="bento-card glass admin-intel-card" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ gridColumn: 'span 4', background: 'linear-gradient(135deg, hsla(var(--p) / 0.1) 0%, transparent 100%)', border: '1px solid hsla(var(--p) / 0.2)' }}
          >
            <div className="card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} className="text-p" />
                <h3>COMMAND CENTER ANALYTICS</h3>
              </div>
              <span className="live-tag">LIVE PLATFORM DATA</span>
            </div>
            
            <div className="admin-grid">
              <div className="admin-stat-item">
                <Users className="admin-icon" />
                <div className="admin-info">
                  <span className="admin-label">TOTAL OPERATORS</span>
                  <strong className="admin-value">{members.length * 42}</strong>
                  <span className="admin-growth"><Growth size={12} /> +12% this week</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <Globe className="admin-icon" />
                <div className="admin-info">
                  <span className="admin-label">ACTIVE MISSIONS</span>
                  <strong className="admin-value">1,284</strong>
                  <span className="admin-growth"><Growth size={12} /> +5.4%</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <Database className="admin-icon" />
                <div className="admin-info">
                  <span className="admin-label">DATA THROUGHPUT</span>
                  <strong className="admin-value">84.2 GB</strong>
                  <span className="admin-growth text-success">Optimal</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <IndianRupee className="admin-icon" />
                <div className="admin-info">
                  <span className="admin-label">PLATFORM REVENUE</span>
                  <strong className="admin-value">₹4.2M</strong>
                  <span className="admin-growth"><Growth size={12} /> +22.1%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Mission Control - EXCLUSIVE TO OWNER */}
        {currentUser?.role === 'owner' && (
          <motion.div 
            className="bento-card glass owner-brief-card" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ gridColumn: 'span 4', background: 'linear-gradient(135deg, hsla(var(--success) / 0.1) 0%, transparent 100%)', border: '1px solid hsla(var(--success) / 0.2)' }}
          >
            <div className="card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={18} className="text-success" />
                <h3>MISSION CONTROL OVERVIEW</h3>
              </div>
              <span className="live-tag success">READY FOR DEPLOYMENT</span>
            </div>
            
            <div className="admin-grid">
              <div className="admin-stat-item">
                <Flag className="admin-icon success" />
                <div className="admin-info">
                  <span className="admin-label">OBJECTIVES</span>
                  <strong className="admin-value">8 / 12</strong>
                  <span className="admin-growth">66% Complete</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <Users className="admin-icon success" />
                <div className="admin-info">
                  <span className="admin-label">TEAM READINESS</span>
                  <strong className="admin-value">OPTIMAL</strong>
                  <span className="admin-growth text-success">All members online</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <ShieldCheck className="admin-icon success" />
                <div className="admin-info">
                  <span className="admin-label">SECURITY STATUS</span>
                  <strong className="admin-value">VERIFIED</strong>
                  <span className="admin-growth text-success">Vault Secured</span>
                </div>
              </div>
              <div className="admin-stat-item">
                <Zap className="admin-icon success" />
                <div className="admin-info">
                  <span className="admin-label">DEPLOYMENT TIME</span>
                  <strong className="admin-value">T-4 DAYS</strong>
                  <span className="admin-growth">On Schedule</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Weather Card - HIDDEN FOR ADMIN */}
        {currentUser?.role !== 'admin' && (
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
        )}

        {/* Analytics/DNA Card - HIDDEN FOR ADMIN */}
        {currentUser?.role !== 'admin' && (
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
        )}

        {/* Financial Summary - HIDDEN FOR ADMIN */}
        {currentUser?.role !== 'admin' && (
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
        )}

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
            {currentUser?.role === 'admin' ? (
              <>
                <button className="qa-item glass" onClick={() => navigate(`/admin/analytics`)}><BarChart3 /> <span>Analytics</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/admin/members`)}><Users /> <span>Operators</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/admin/dashboard`)}><ShieldCheck /> <span>Security</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/admin/dashboard`)}><Database /> <span>System Logs</span></button>
              </>
            ) : (
              <>
                <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/mission-brief`)}><Target /> <span>Briefing</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/itinerary`)}><Compass /> <span>Explore</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/expenses`)}><IndianRupee /> <span>Wallet</span></button>
                <button className="qa-item glass" onClick={() => navigate(`/${currentUser?.role}/vault`)}><Briefcase /> <span>Vault</span></button>
              </>
            )}
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
        .dash-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
        
        /* Hero Styling */
        .hero-section { width: 100%; }
        .hero-card { border-radius: 24px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .hero-img-box { height: 280px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; }
        .hero-gradient-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%); }
        .hero-content { position: relative; width: 100%; padding: 2rem 2.5rem; color: #fff; }
        .hero-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .hero-badge { font-size: 0.65rem; font-weight: 900; background: hsla(var(--p) / 0.2); color: hsl(var(--p-light)); padding: 6px 14px; border-radius: 100px; border: 1px solid hsla(var(--p) / 0.4); letter-spacing: 0.15em; display: flex; align-items: center; gap: 6px; box-shadow: 0 0 15px hsla(var(--p)/0.2); }
        .hero-time { font-size: 0.75rem; font-weight: 800; color: hsla(255,255,255,0.7); display: flex; align-items: center; gap: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        .hero-title-area { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
        .hero-title-area h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em; margin: 0; text-shadow: 0 0 30px rgba(0,0,0,0.8); line-height: 1; color: #fff; }
        .edit-dest-btn { background: hsla(255,255,255,0.05); border: 1px solid hsla(255,255,255,0.2); color: #fff; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); transition: 0.3s; }
        .edit-dest-btn:hover { background: hsla(255,255,255,0.15); transform: rotate(15deg); }
        .hero-stats-row { display: flex; gap: 4rem; border-top: 1px solid hsla(255,255,255,0.1); padding-top: 1.5rem; }
        .h-stat { display: flex; flex-direction: column; }
        .h-stat span { font-size: 0.7rem; font-weight: 800; color: hsla(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; display: block; }
        .h-stat strong { font-size: 1.75rem; font-weight: 900; color: #fff; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(255,255,255,0.2); }

        /* Bento Grid */
        .dash-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .bento-card { border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid var(--glass-border); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); background: var(--glass-bg); backdrop-filter: blur(40px); }
        .bento-card:hover { transform: translateY(-4px); border-color: hsla(var(--p) / 0.3); box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 0 hsla(255,255,255,0.05); }
        .card-head { display: flex; justify-content: space-between; align-items: center; }
        .card-head h3 { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.15em; color: hsl(var(--text-muted)); text-transform: uppercase; }

        /* Weather Card */
        .weather-card { grid-column: span 1; }
        .w-main { display: flex; align-items: center; gap: 1rem; }
        .w-icon-large { color: hsl(var(--p-light)); filter: drop-shadow(0 0 10px hsla(var(--p)/0.5)); }
        .w-temp h2 { font-size: 2.5rem; font-weight: 900; line-height: 1; color: #fff; }
        .w-temp p { font-size: 0.8rem; color: hsl(var(--text-muted)); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .w-strip { display: flex; justify-content: space-between; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--glass-border); }
        .wf-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .wf-item span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; }
        .wf-item strong { font-size: 0.9rem; color: #fff; font-weight: 800; }

        /* DNA Card */
        .dna-card { grid-column: span 1; align-items: center; }
        .radar-svg { width: 100%; height: 160px; filter: drop-shadow(0 0 20px hsla(var(--p)/0.2)); }
        .r-grid { fill: none; stroke: var(--glass-border); stroke-width: 1; }
        .r-area { fill: hsla(var(--p) / 0.2); stroke: hsl(var(--p)); stroke-width: 2; }
        .r-label { fill: hsl(var(--text-muted)); font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Budget Card */
        .budget-card { grid-column: span 2; }
        .b-total { font-size: 0.85rem; font-weight: 800; color: hsl(var(--text-muted)); background: hsla(255,255,255,0.03); padding: 4px 12px; border-radius: 100px; border: 1px solid var(--glass-border); }
        .b-spent h2 { font-size: 3rem; font-weight: 900; letter-spacing: -0.02em; color: #fff; line-height: 1.1; }
        .b-spent p { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .b-progress { margin-top: 1.5rem; }
        .b-track { height: 10px; background: hsla(0,0,0,0.3); border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
        .b-fill { height: 100%; background: linear-gradient(90deg, hsl(var(--p)), hsl(var(--p-light))); border-radius: 10px; position: relative; }
        .b-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, hsla(255,255,255,0.4), transparent); animation: shimmer 2s infinite; }
        .b-markers { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); margin-top: 0.75rem; }

        /* Intel Card */
        .intel-card { grid-column: span 2; }
        .intel-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }
        .intel-row { display: flex; gap: 1rem; align-items: center; padding: 0.5rem; border-radius: 12px; transition: 0.3s; }
        .intel-row:hover { background: hsla(255,255,255,0.03); }
        .intel-avatar { width: 32px; height: 32px; border-radius: 10px; font-size: 0.75rem; font-weight: 900; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .intel-info p { font-size: 0.85rem; font-weight: 700; margin: 0 0 2px 0; color: #fff; }
        .intel-info span { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Quick Access */
        .quick-access-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; grid-column: span 2; }
        .qa-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; border: 1px solid var(--glass-border); cursor: pointer; padding: 1.5rem; border-radius: 20px; transition: 0.3s; color: hsl(var(--text-muted)); background: var(--glass-bg); backdrop-filter: blur(20px); }
        .qa-item:hover { color: #fff; background: hsla(var(--p) / 0.1); border-color: hsla(var(--p) / 0.3); transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .qa-item span { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .qa-item svg { width: 28px; height: 28px; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-panel { width: 100%; max-width: 440px; padding: 2.5rem; border-radius: 24px; border: 1px solid var(--glass-border); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .m-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .m-head h3 { font-size: 1.5rem; font-weight: 900; color: #fff; margin: 0; }
        .m-head button { background: hsla(255,255,255,0.05); border: 1px solid var(--glass-border); color: hsl(var(--text-muted)); width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .m-head button:hover { background: hsla(255,255,255,0.1); color: #fff; }
        .input-field { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: hsla(0,0,0,0.2); border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 1.5rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
        .input-field svg { color: hsl(var(--text-muted)); }
        .input-field input { background: none; border: none; outline: none; flex: 1; font-size: 1.05rem; color: #fff; font-weight: 700; }
        .m-submit-btn { width: 100%; padding: 1.25rem; border-radius: 16px; border: none; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; font-weight: 900; cursor: pointer; box-shadow: inset 0 1px 0 hsla(255,255,255,0.2), 0 10px 20px hsla(var(--p) / 0.3); transition: 0.3s; letter-spacing: 0.05em; font-size: 1rem; }
        .m-submit-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: inset 0 1px 0 hsla(255,255,255,0.3), 0 15px 30px hsla(var(--p) / 0.4); }

        /* Admin Specific Overrides */
        .admin-intel-card { position: relative; overflow: hidden; }
        .live-tag.success { color: hsl(var(--success)); background: hsla(var(--success) / 0.1); }
        .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; padding: 1.5rem 0; }
        .admin-stat-item { display: flex; gap: 1.25rem; align-items: flex-start; }
        .admin-icon { width: 48px; height: 48px; padding: 12px; background: hsla(var(--p) / 0.1); border: 1px solid hsla(var(--p)/0.2); border-radius: 14px; color: hsl(var(--p-light)); box-shadow: 0 0 15px hsla(var(--p)/0.2); }
        .admin-icon.success { color: hsl(var(--success)); background: hsla(var(--success) / 0.1); border-color: hsla(var(--success)/0.2); box-shadow: 0 0 15px hsla(var(--success)/0.2); }
        .admin-info { display: flex; flex-direction: column; gap: 4px; }
        .admin-label { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .admin-value { font-size: 1.75rem; font-weight: 900; color: #fff; margin: 0; }
        .admin-growth { font-size: 0.75rem; font-weight: 800; color: hsl(var(--success)); display: flex; align-items: center; gap: 4px; }

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
