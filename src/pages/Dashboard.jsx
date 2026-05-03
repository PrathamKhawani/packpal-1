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

const RadarChart = ({ data }) => {
  const points = data.map((d, i) => {
    const angle = (i * 360) / data.length;
    const r = (d.value / 100) * 32;
    const x = 50 + r * Math.cos((angle - 90) * (Math.PI / 180));
    const y = 50 + r * Math.sin((angle - 90) * (Math.PI / 180));
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="radar-chart">
      <circle cx="50" cy="50" r="32" className="radar-grid" />
      <circle cx="50" cy="50" r="24" className="radar-grid" />
      <circle cx="50" cy="50" r="16" className="radar-grid" />
      <circle cx="50" cy="50" r="8" className="radar-grid" />
      <polygon points={points} className="radar-area" />
      {data.map((d, i) => {
        const angle = (i * 360) / data.length;
        const x = 50 + 40 * Math.cos((angle - 90) * (Math.PI / 180));
        const y = 50 + 40 * Math.sin((angle - 90) * (Math.PI / 180));
        return <g key={i}><text x={x} y={y} className="radar-label">{d.label[0]}</text></g>;
      })}
    </svg>
  );
};

export default function Dashboard() {
  const { items, members, expenses, tripConfig, setTripConfig } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDest, setTempDest] = useState(tripConfig.destination);
  const [weather, setWeather] = useState({ temp: 24, desc: 'Partly Cloudy', icon: <CloudSun size={24} />, forecast: [] });
  const [heroImg, setHeroImg] = useState('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200');

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setHeroImg(`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200`);
        setHeroImg(`https://source.unsplash.com/featured/800x400?${encodeURIComponent(tripConfig.destination)}&t=${Date.now()}`);

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
              if (c <= 3) return { desc: 'Clear', icon: <Sun size={24} /> };
              if (c <= 48) return { desc: 'Cloudy', icon: <CloudSun size={24} /> };
              if (c <= 67) return { desc: 'Rainy', icon: <CloudRain size={24} /> };
              return { desc: 'Stormy', icon: <Zap size={24} /> };
            };

            const daily = weatherData.daily.temperature_2m_max.slice(1, 5).map((t, i) => ({
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
    <div className="dashboard-compact">
      <div className="ultra-bg-compact" style={{ backgroundImage: `url(${heroImg})` }} />

      <div className="bento-grid-compact">
        {/* Compact Hero */}
        <motion.div 
          className="bento-item-compact hero-compact"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="hero-overlay-compact">
            <div className="hero-content-compact">
              <div className="badge-compact"><Target size={10} /> UPCOMING</div>
              <div className="hero-title-compact">
                <h1>{tripConfig.destination}</h1>
                <button className="btn-edit-compact" onClick={() => setIsEditing(true)}><Edit3 size={14} /></button>
              </div>
              <p className="hero-subtext-compact">In {daysRemaining} days • {members.length} Members</p>
              <div className="hero-quick-stats">
                <div className="hq-stat"><strong>{packedPct}%</strong><span>Packed</span></div>
                <div className="hq-stat"><strong>₹{(spent/1000).toFixed(1)}k</strong><span>Spent</span></div>
              </div>
            </div>
            <div className="hero-img-compact" style={{ backgroundImage: `url(${heroImg})` }}>
              <div className="img-vignette" />
            </div>
          </div>
        </motion.div>

        {/* Compact Weather */}
        <motion.div 
          className="bento-item-compact glass-compact weather-compact"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-main-compact">
            <div className="w-ico">{weather.icon}</div>
            <div className="w-val">
              <span className="w-t">{weather.temp}°</span>
              <span className="w-d">{weather.desc}</span>
            </div>
          </div>
          <div className="w-forecast-compact">
            {weather.forecast.map((f, i) => (
              <div key={i} className="wf-day">
                <span>{f.day}</span>
                <strong>{f.temp}°</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trip DNA */}
        <motion.div 
          className="bento-item-compact glass-compact dna-compact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sec-header-compact"><h3>TRIP DNA</h3></div>
          <div className="dna-viz">
            <RadarChart data={[
              { label: 'Adv', value: 85 },
              { label: 'Rel', value: 40 },
              { label: 'Cul', value: 70 },
              { label: 'Foo', value: 95 },
              { label: 'Bud', value: 60 }
            ]} />
            <div className="dna-tags">
              <div className="dna-tag"><Adventure size={10} /> 85%</div>
              <div className="dna-tag"><Culture size={10} /> 70%</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Grid */}
        <div className="bento-item-compact quick-actions-compact">
          <button className="qa-btn glass-compact"><Compass size={16} /><span>Explorer</span></button>
          <button className="qa-btn glass-compact"><PlaneTakeoff size={16} /><span>Travel</span></button>
          <button className="qa-btn glass-compact"><Users size={16} /><span>Split</span></button>
          <button className="qa-btn glass-compact"><IndianRupee size={16} /><span>Cash</span></button>
        </div>

        {/* Intelligence Feed */}
        <motion.div 
          className="bento-item-compact glass-compact col-span-2 intel-compact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="sec-header-compact"><h3>INTEL</h3></div>
          <div className="intel-scroll">
            {[
              { u: 'JD', t: 'Tent packed', time: '2m', c: 'hsl(var(--p))' },
              { u: 'SYS', t: 'Rain alert', time: '1h', c: 'hsl(var(--danger))' },
              { u: 'SK', t: 'Doc uploaded', time: '3h', c: 'hsl(var(--warning))' }
            ].map((item, i) => (
              <div key={i} className="intel-item">
                <div className="intel-avatar" style={{ background: item.c }}>{item.u}</div>
                <p>{item.t}</p>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Budget Health */}
        <motion.div 
          className="bento-item-compact glass-compact col-span-2 budget-compact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="sec-header-compact">
            <h3>BUDGET</h3>
            <span>₹{tripConfig.budget.toLocaleString()}</span>
          </div>
          <div className="budget-core">
            <div className="b-main">
              <span className="b-val">₹{spent.toLocaleString()}</span>
              <div className="b-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${(spent/tripConfig.budget)*100}%` }} className="b-fill" /></div>
            </div>
            <div className="b-subs">
              <div className="b-sub"><span>Left</span><strong>₹{Math.max(tripConfig.budget-spent,0).toLocaleString()}</strong></div>
              <div className="b-sub"><span>Burn</span><strong>{Math.round((spent/tripConfig.budget)*100)}%</strong></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="modal-overlay-compact" onClick={() => setIsEditing(false)}>
            <motion.div 
              className="modal-box-compact glass-compact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-top">
                <h2>Reroute</h2>
                <button onClick={() => setIsEditing(false)}><X size={16} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); setTripConfig({...tripConfig, destination: tempDest}); setIsEditing(false); }}>
                <input value={tempDest} onChange={e => setTempDest(e.target.value)} placeholder="Destination" />
                <button type="submit">UPDATE MISSION</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .dashboard-compact { position: relative; padding: 1.25rem; color: #fff; }
        .ultra-bg-compact { position: fixed; inset: 0; background-size: cover; background-position: center; filter: blur(80px) brightness(0.2); opacity: 0.5; z-index: -1; }
        
        .bento-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; max-width: 1200px; margin: 0 auto; }
        .bento-item-compact { border-radius: 16px; overflow: hidden; position: relative; }
        .glass-compact { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.06); }
        
        /* Hero */
        .hero-compact { grid-column: span 3; background: rgba(0,0,0,0.2); height: 180px; }
        .hero-overlay-compact { display: grid; grid-template-columns: 1fr 200px; height: 100%; }
        .hero-content-compact { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; }
        .badge-compact { display: flex; align-items: center; gap: 4px; background: hsla(var(--p) / 0.2); color: hsl(var(--p-light)); font-size: 0.55rem; font-weight: 900; padding: 2px 8px; border-radius: 100px; width: fit-content; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
        .hero-title-compact { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
        .hero-title-compact h1 { font-size: 2.25rem; line-height: 1; font-weight: 800; letter-spacing: -0.04em; }
        .btn-edit-compact { background: rgba(255,255,255,0.08); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .hero-subtext-compact { color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 600; margin-bottom: 1.25rem; }
        .hero-quick-stats { display: flex; gap: 2rem; }
        .hq-stat { display: flex; flex-direction: column; }
        .hq-stat strong { font-size: 1.1rem; font-weight: 800; }
        .hq-stat span { font-size: 0.6rem; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 800; }
        .hero-img-compact { background-size: cover; background-position: center; }
        .img-vignette { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.6), transparent); }

        /* Weather */
        .weather-compact { padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; }
        .w-main-compact { display: flex; align-items: center; gap: 0.75rem; }
        .w-ico { color: hsl(var(--p-light)); }
        .w-val { display: flex; flex-direction: column; }
        .w-t { font-size: 2rem; font-weight: 900; line-height: 1; }
        .w-d { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); }
        .w-forecast-compact { display: flex; justify-content: space-between; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .wf-day { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .wf-day span { font-size: 0.55rem; font-weight: 800; color: rgba(255,255,255,0.3); }
        .wf-day strong { font-size: 0.75rem; }

        /* Radar */
        .dna-compact { padding: 1rem; height: 180px; }
        .sec-header-compact h3 { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
        .radar-chart { width: 100%; height: 110px; }
        .radar-grid { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 0.5; }
        .radar-area { fill: hsla(var(--p) / 0.2); stroke: hsl(var(--p-light)); stroke-width: 1.5; }
        .radar-label { fill: rgba(255,255,255,0.3); font-size: 6px; font-weight: 800; }
        .dna-viz { display: flex; align-items: center; }
        .dna-tags { display: flex; flex-direction: column; gap: 8px; }
        .dna-tag { font-size: 0.6rem; font-weight: 800; display: flex; align-items: center; gap: 4px; color: rgba(255,255,255,0.5); }

        /* Quick Grid */
        .quick-actions-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .qa-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; transition: 0.2s; padding: 0.75rem; }
        .qa-btn:hover { background: rgba(255,255,255,0.08); }
        .qa-btn span { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.4); }

        /* Intel */
        .intel-compact { padding: 1.25rem; }
        .intel-scroll { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem; }
        .intel-item { display: flex; align-items: center; gap: 0.75rem; }
        .intel-avatar { width: 20px; height: 20px; border-radius: 6px; font-size: 0.55rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
        .intel-item p { font-size: 0.75rem; color: rgba(255,255,255,0.7); flex: 1; }
        .intel-item span { font-size: 0.6rem; color: rgba(255,255,255,0.3); font-weight: 700; }

        /* Budget */
        .budget-compact { padding: 1.25rem; }
        .budget-compact .sec-header-compact { display: flex; justify-content: space-between; }
        .budget-core { display: grid; grid-template-columns: 1fr 120px; gap: 1.5rem; margin-top: 0.75rem; }
        .b-val { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; }
        .b-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-top: 0.5rem; }
        .b-fill { height: 100%; background: hsl(var(--p)); }
        .b-subs { display: flex; flex-direction: column; gap: 0.5rem; }
        .b-sub { display: flex; justify-content: space-between; font-size: 0.65rem; }
        .b-sub span { color: rgba(255,255,255,0.3); font-weight: 800; }

        @media (max-width: 1024px) {
          .bento-grid-compact { grid-template-columns: 1fr 1fr; }
          .hero-compact, .intel-compact, .budget-compact { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .bento-grid-compact { grid-template-columns: 1fr; }
          .hero-compact, .intel-compact, .budget-compact { grid-column: span 1; }
          .hero-overlay-compact { grid-template-columns: 1fr; }
          .hero-img-compact { display: none; }
        }
      `}</style>
    </div>
  );
}
