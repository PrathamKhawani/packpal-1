import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';

const PINS = [
  { label:'Tokyo',    top:'30%', left:'76%', delay:0    },
  { label:'Paris',    top:'28%', left:'48%', delay:0.1  },
  { label:'New York', top:'38%', left:'20%', delay:0.2  },
  { label:'Mumbai',   top:'48%', left:'67%', delay:0.15 },
  { label:'Dubai',    top:'44%', left:'58%', delay:0.05 },
  { label:'Sydney',   top:'72%', left:'82%', delay:0.25 },
];

const ROLES = [
  { id:'owner',  icon:<Briefcase size={18}/>, label:'Trip Owner',   desc:'Lead missions, manage team' },
  { id:'member', icon:<User size={18}/>,      label:'Team Member',  desc:'Join & collaborate' },
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [show, setShow]         = useState(false);
  const [role, setRole]         = useState('member');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const { register, authLoading } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Globe rotates
  const globeRot   = useTransform(smooth, [0, 0.55], [0, 38]);
  const globeScale = useTransform(smooth, [0.52, 0.80], [1, 0.55]);
  const globeY     = useTransform(smooth, [0.52, 0.80], [0, -140]);
  const globeOp    = useTransform(smooth, [0.68, 0.85], [1, 0]);
  // Pins appear
  const pinOp      = useTransform(smooth, [0.20, 0.48], [0, 1]);
  const pinScale   = useTransform(smooth, [0.20, 0.48], [0.4, 1]);
  // Hero
  const heroOp     = useTransform(smooth, [0, 0.16], [1, 0]);
  const heroY      = useTransform(smooth, [0, 0.18], [0, -35]);
  // Form
  const formOp     = useTransform(smooth, [0.70, 0.94], [0, 1]);
  const formY      = useTransform(smooth, [0.70, 0.94], [70, 0]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !confirm) { setError('Please fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const r = await register(email, password, role, fullName);
    if (r.success) { setSuccess(true); setTimeout(() => navigate('/login'), 3200); }
    else setError(r.message || 'Registration failed.');
  };

  return (
    <div className="rx-root">
      <div ref={containerRef} className="rx-scroller">
        <div className="rx-canvas">
          <div className="rx-sticky">

            <div className="rx-grid-bg" aria-hidden="true"/>

            {/* Hero text */}
            <motion.div className="rx-hero" style={{ opacity: heroOp, y: heroY }}>
              <div className="rx-pill">🌍 Join 12,400+ Elite Operators</div>
              <h1>The Whole World<br/><em>In One Platform.</em></h1>
              <p>Scroll to discover your destinations ↓</p>
            </motion.div>

            {/* 3D Globe */}
            <motion.div className="rx-globe-wrap" style={{ scale: globeScale, y: globeY, opacity: globeOp }}>
              <motion.div className="rx-globe" style={{ rotateY: globeRot }}>
                {/* Latitude lines */}
                {[0,30,60,120,150,180].map(deg => (
                  <div key={deg} className="rx-lat-line" style={{ transform:`rotateY(${deg}deg)` }}/>
                ))}
                {/* Longitude lines */}
                {[-60,-30,0,30,60].map(deg => (
                  <div key={deg} className="rx-lon-line" style={{ top:`${50+deg}%` }}/>
                ))}
                {/* Continent blobs */}
                <div className="rx-continent" style={{ top:'35%', left:'42%', width:'12%', height:'18%', borderRadius:'40% 60% 50% 50%' }}/>
                <div className="rx-continent" style={{ top:'30%', left:'62%', width:'14%', height:'20%', borderRadius:'60% 40% 60% 40%' }}/>
                <div className="rx-continent" style={{ top:'38%', left:'18%', width:'10%', height:'16%', borderRadius:'50% 50% 40% 60%' }}/>
                <div className="rx-continent" style={{ top:'58%', left:'70%', width:'9%', height:'12%', borderRadius:'50%' }}/>
                <div className="rx-continent" style={{ top:'55%', left:'45%', width:'8%', height:'10%', borderRadius:'50%' }}/>
              </motion.div>

              {/* Destination pins */}
              {PINS.map((p, i) => (
                <motion.div
                  key={i}
                  className="rx-pin"
                  style={{ top: p.top, left: p.left, opacity: pinOp, scale: pinScale }}
                  transition={{ delay: p.delay }}
                >
                  <div className="rx-pin-dot"/>
                  <div className="rx-pin-label">{p.label}</div>
                  <div className="rx-pin-pulse"/>
                </motion.div>
              ))}

              {/* Orbit ring */}
              <div className="rx-orbit"/>
            </motion.div>

            {/* Register Form */}
            <motion.div className="rx-form-wrap" style={{ opacity: formOp, y: formY }}>
              <div className="rx-form-card">
                <Link to="/login" className="rx-back"><ArrowLeft size={13}/> Back to Sign In</Link>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="ok" className="rx-success" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                      <CheckCircle2 size={48} color="#10b981"/>
                      <h3>Welcome, Operator!</h3>
                      <p>Check your email to verify your account.</p>
                      <div className="rx-prog"><motion.div className="rx-prog-fill" initial={{width:0}} animate={{width:'100%'}} transition={{duration:3.2}}/></div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                      <div className="rx-header">
                        <div className="rx-logo">✦</div>
                        <h2>Create Account</h2>
                        <p>Join the PackPal operator network</p>
                      </div>

                      {/* Role pills */}
                      <div className="rx-roles">
                        {ROLES.map(r => (
                          <button key={r.id} type="button" className={`rx-role ${role===r.id?'active':''}`} onClick={()=>setRole(r.id)}>
                            <div className="rx-role-ico">{r.icon}</div>
                            <div><strong>{r.label}</strong><span>{r.desc}</span></div>
                            {role===r.id && <CheckCircle2 size={15} className="rx-check"/>}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div className="rx-error" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                            <AlertCircle size={14}/>{error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleRegister} className="rx-form">
                        <div className="rx-row">
                          <div className="rx-field">
                            <label>Full Name</label>
                            <div className="rx-iw"><User size={15} className="rx-ico"/>
                              <input type="text" placeholder="John Doe" value={fullName} onChange={e=>setFullName(e.target.value)}/>
                            </div>
                          </div>
                          <div className="rx-field">
                            <label>Email</label>
                            <div className="rx-iw"><Mail size={15} className="rx-ico"/>
                              <input type="email" placeholder="you@co.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                            </div>
                          </div>
                        </div>
                        <div className="rx-row">
                          <div className="rx-field">
                            <label>Password</label>
                            <div className="rx-iw"><Lock size={15} className="rx-ico"/>
                              <input type={show?'text':'password'} placeholder="Min 6 chars" value={password} onChange={e=>setPassword(e.target.value)}/>
                              <button type="button" className="rx-eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={13}/>:<Eye size={13}/>}</button>
                            </div>
                          </div>
                          <div className="rx-field">
                            <label>Confirm</label>
                            <div className="rx-iw"><Lock size={15} className="rx-ico"/>
                              <input type={show?'text':'password'} placeholder="Repeat" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                            </div>
                          </div>
                        </div>
                        <motion.button type="submit" className="rx-submit" disabled={authLoading} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                          {authLoading ? <Loader2 size={18} className="rx-spin"/> : <><span>Deploy My Account</span><ChevronRight size={18}/></>}
                        </motion.button>
                      </form>
                      <div className="rx-trust"><Shield size={12}/> End-to-end encrypted · SOC 2 compliant</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="rx-progress" style={{ scaleX: scrollYProgress }}/>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .rx-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; }
        .rx-scroller { width:100%; height:100%; overflow-y:scroll; }
        .rx-scroller::-webkit-scrollbar { width:0; }
        .rx-canvas { height:550vh; }
        .rx-sticky {
          position:sticky; top:0; height:100vh;
          display:flex; align-items:center; justify-content:center; overflow:hidden;
          background:radial-gradient(ellipse 100% 70% at 50% -5%, rgba(16,185,129,0.07) 0%, transparent 65%),
                      radial-gradient(ellipse 60% 60% at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 60%), #f0f4f8;
        }
        .rx-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
        }

        /* Hero */
        .rx-hero { position:absolute; top:10%; left:50%; transform:translateX(-50%); text-align:center; z-index:2; white-space:nowrap; }
        .rx-pill { display:inline-block; padding:6px 18px; border-radius:100px; background:#fff; border:1px solid #e5e7eb; font-size:0.75rem; font-weight:700; color:#10b981; letter-spacing:0.04em; margin-bottom:1.25rem; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .rx-hero h1 { font-size:clamp(2.2rem,5vw,4rem); font-weight:900; color:#111827; letter-spacing:-0.04em; line-height:1.1; margin:0 0 1rem; }
        .rx-hero h1 em { font-style:normal; color:#10b981; }
        .rx-hero p { color:#9ca3af; font-size:0.95rem; }

        /* Globe */
        .rx-globe-wrap { position:absolute; z-index:3; width:340px; height:340px; }
        .rx-globe {
          width:100%; height:100%; border-radius:50%;
          background:linear-gradient(135deg,#dbeafe 0%,#bfdbfe 30%,#93c5fd 60%,#60a5fa 100%);
          box-shadow:inset -20px -10px 40px rgba(0,0,0,0.12), 0 20px 60px rgba(59,130,246,0.25);
          position:relative; overflow:hidden;
          transform-style:preserve-3d;
        }
        .rx-lat-line { position:absolute; top:0; bottom:0; left:50%; width:1px; background:rgba(255,255,255,0.25); transform-origin:center; }
        .rx-lon-line { position:absolute; left:5%; right:5%; height:1px; background:rgba(255,255,255,0.2); }
        .rx-continent { position:absolute; background:rgba(34,197,94,0.5); border:1px solid rgba(22,163,74,0.3); }

        /* Orbit ring */
        .rx-orbit {
          position:absolute; inset:-20px;
          border-radius:50%; border:1px dashed rgba(99,102,241,0.3);
          animation:rx-spin 12s linear infinite;
        }
        @keyframes rx-spin { to{transform:rotate(360deg);} }

        /* Pins */
        .rx-pin { position:absolute; z-index:5; display:flex; flex-direction:column; align-items:center; gap:3px; }
        .rx-pin-dot { width:10px; height:10px; border-radius:50%; background:#ef4444; border:2px solid #fff; box-shadow:0 2px 6px rgba(239,68,68,0.5); }
        .rx-pin-label { background:#fff; border:1px solid #e5e7eb; border-radius:6px; padding:2px 8px; font-size:0.65rem; font-weight:700; color:#111827; box-shadow:0 2px 8px rgba(0,0,0,0.08); white-space:nowrap; }
        .rx-pin-pulse { position:absolute; top:0; left:50%; transform:translate(-50%); width:10px; height:10px; border-radius:50%; background:rgba(239,68,68,0.3); animation:rx-pulse 1.6s infinite; }
        @keyframes rx-pulse { 0%{transform:translate(-50%) scale(1);opacity:0.8} 100%{transform:translate(-50%) scale(3);opacity:0} }

        /* Form */
        .rx-form-wrap { position:absolute; z-index:6; width:100%; display:flex; justify-content:center; padding:0 1.5rem; pointer-events:none; }
        .rx-form-card { width:100%; max-width:500px; background:#fff; border:1px solid #e5e7eb; border-radius:24px; padding:2.25rem; box-shadow:0 24px 48px rgba(0,0,0,0.1); pointer-events:auto; }
        .rx-back { display:inline-flex; align-items:center; gap:5px; color:#9ca3af; font-size:0.75rem; font-weight:600; text-decoration:none; margin-bottom:1.25rem; transition:color 0.2s; }
        .rx-back:hover { color:#111827; }
        .rx-header { text-align:center; margin-bottom:1.5rem; }
        .rx-logo { width:44px; height:44px; margin:0 auto 0.875rem; border-radius:14px; background:linear-gradient(135deg,#059669,#10b981); display:flex; align-items:center; justify-content:center; font-size:1.3rem; color:#fff; box-shadow:0 8px 20px rgba(16,185,129,0.35); }
        .rx-header h2 { font-size:1.4rem; font-weight:800; color:#111827; margin:0 0 0.3rem; letter-spacing:-0.02em; }
        .rx-header p { color:#9ca3af; font-size:0.85rem; }
        .rx-roles { display:flex; flex-direction:column; gap:0.625rem; margin-bottom:1.25rem; }
        .rx-role { position:relative; display:flex; align-items:center; gap:0.875rem; padding:0.875rem 1rem; background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px; cursor:pointer; text-align:left; transition:all 0.2s; font-family:inherit; }
        .rx-role:hover { border-color:#10b981; background:#f0fdf4; }
        .rx-role.active { border-color:#10b981; background:#f0fdf4; }
        .rx-role-ico { width:34px; height:34px; border-radius:10px; background:#dcfce7; display:flex; align-items:center; justify-content:center; color:#16a34a; flex-shrink:0; }
        .rx-role strong { display:block; font-size:0.82rem; font-weight:700; color:#111827; margin-bottom:1px; }
        .rx-role span { font-size:0.72rem; color:#9ca3af; }
        .rx-check { position:absolute; right:1rem; color:#10b981; }
        .rx-error { display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.875rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; color:#dc2626; font-size:0.82rem; margin-bottom:1rem; }
        .rx-form { display:flex; flex-direction:column; gap:0.875rem; }
        .rx-row { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .rx-field { display:flex; flex-direction:column; gap:0.35rem; }
        .rx-field label { font-size:0.73rem; font-weight:600; color:#374151; }
        .rx-iw { position:relative; }
        .rx-ico { position:absolute; left:0.8rem; top:50%; transform:translateY(-50%); color:#d1d5db; pointer-events:none; }
        .rx-iw input { width:100%; height:42px; padding:0 0.875rem 0 2.5rem; background:#f9fafb; border:1px solid #e5e7eb; border-radius:11px; color:#111827; font-size:0.84rem; outline:none; transition:0.2s; box-sizing:border-box; font-family:inherit; }
        .rx-iw input::placeholder { color:#d1d5db; }
        .rx-iw input:focus { border-color:#10b981; background:#fff; box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
        .rx-eye { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; color:#9ca3af; cursor:pointer; display:flex; padding:3px; }
        .rx-submit { width:100%; height:48px; border-radius:13px; border:none; background:linear-gradient(135deg,#059669,#10b981); color:#fff; font-weight:800; font-size:0.9rem; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer; box-shadow:0 10px 24px rgba(16,185,129,0.35); margin-top:0.25rem; }
        .rx-submit:hover { box-shadow:0 14px 32px rgba(16,185,129,0.45); }
        .rx-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .rx-trust { text-align:center; margin-top:1rem; color:#9ca3af; font-size:0.7rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; }
        .rx-success { text-align:center; padding:1.5rem 0; }
        .rx-success h3 { font-size:1.5rem; font-weight:800; color:#111827; margin:1rem 0 0.5rem; }
        .rx-success p { color:#6b7280; font-size:0.875rem; margin:0 0 1.5rem; }
        .rx-prog { height:4px; background:#e5e7eb; border-radius:10px; overflow:hidden; }
        .rx-prog-fill { height:100%; background:linear-gradient(90deg,#10b981,#059669); }
        .rx-spin { animation:rx-rotate 0.8s linear infinite; }
        @keyframes rx-rotate { to{transform:rotate(360deg);} }
        .rx-progress { position:fixed; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#10b981,#6366f1); transform-origin:left; z-index:99; }

        @media(max-width:640px) {
          .rx-globe-wrap { width:240px; height:240px; }
          .rx-row { grid-template-columns:1fr; }
          .rx-form-card { padding:1.75rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
