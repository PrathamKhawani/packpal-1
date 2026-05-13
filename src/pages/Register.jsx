import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, CheckCircle2, Globe2, ArrowLeft, Shield, Sparkles } from 'lucide-react';

const ROLES = [
  { id: 'owner', icon: <Briefcase size={20}/>, label: 'Trip Owner', desc: 'Create & lead missions, manage team, handle finances' },
  { id: 'member', icon: <User size={20}/>, label: 'Team Member', desc: 'Join missions, manage your packing, view itinerary' },
];

const FEATURES = [
  { emoji: '🗺️', title: 'AI-Generated Itineraries', desc: 'Powered by Gemini — tailored for your destination, budget, and vibe.' },
  { emoji: '🛡️', title: 'Military-Grade Vault', desc: 'Store documents, passports & permits with end-to-end encryption.' },
  { emoji: '💸', title: 'Real-Time Expense Ops', desc: 'Split costs, track budgets, and generate reports in seconds.' },
  { emoji: '⚡', title: 'Risk Intelligence', desc: 'Instant weather, alerts, and safety assessments for any destination.' },
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, authLoading } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.45], ['0%', '-25%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const feat1 = useTransform(scrollYProgress, [0.1, 0.5], [40, 0]);
  const feat2 = useTransform(scrollYProgress, [0.2, 0.6], [60, 0]);
  const formOp = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const formY = useTransform(scrollYProgress, [0.55, 0.85], ['50px', '0px']);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !confirm) { setError('Please fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const result = await register(email, password, role, fullName);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="rp-root">
      <div ref={containerRef} className="rp-scroll">

        {/* ── SECTION 1: Hero ── */}
        <section className="rp-hero">
          <motion.div className="rp-hero-inner" style={{ y: heroY, opacity: heroOp }}>
            <div className="rp-badge"><Sparkles size={14}/> Join 12,000+ Elite Operators</div>
            <h1 className="rp-headline">
              Your Next Mission<br/>
              <span className="rp-grad">Starts Here.</span>
            </h1>
            <p className="rp-sub">Create your free operator account and experience the future of coordinated travel.</p>
            <div className="rp-scroll-hint">
              <span>Scroll to explore</span>
              <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.4 }}>↓</motion.div>
            </div>
          </motion.div>

          {/* Animated mesh background */}
          <div className="rp-mesh" aria-hidden="true">
            {Array.from({length:6}).map((_,i) => (
              <motion.div key={i} className="rp-mesh-orb" style={{
                left:`${10+i*15}%`, top:`${20+i*10}%`,
                width:`${80+i*40}px`, height:`${80+i*40}px`,
                background:`radial-gradient(circle, ${['rgba(99,102,241,0.15)','rgba(139,92,246,0.12)','rgba(236,72,153,0.1)','rgba(14,165,233,0.1)','rgba(16,185,129,0.08)','rgba(245,158,11,0.08)'][i]}, transparent)`,
              }}
              animate={{ scale:[1,1.2,1], opacity:[0.6,1,0.6] }}
              transition={{ repeat:Infinity, duration:3+i*0.5, delay:i*0.3 }}
              />
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Features ── */}
        <section className="rp-features-section">
          <motion.div className="rp-features-header"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.4 }}
          >
            <h2>Everything you need</h2>
            <p>One platform for the entire mission lifecycle.</p>
          </motion.div>
          <div className="rp-features-grid">
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="rp-feature-card"
                initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, amount:0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y:-6, borderColor:'rgba(99,102,241,0.4)' }}
              >
                <div className="rp-feat-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Register Form ── */}
        <section className="rp-form-section">
          <motion.div className="rp-card" style={{ opacity:formOp, y:formY }}>
            <Link to="/login" className="rp-back"><ArrowLeft size={14}/> Back to Sign In</Link>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="ok" className="rp-success" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                  <CheckCircle2 size={52} color="#34d399"/>
                  <h3>Welcome aboard!</h3>
                  <p>Check your email to verify your account.<br/>Redirecting to sign in…</p>
                  <div className="rp-prog"><motion.div className="rp-prog-fill" initial={{width:0}} animate={{width:'100%'}} transition={{duration:3}}/></div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                  <div className="rp-card-header">
                    <div className="rp-logo"><Globe2 size={22}/></div>
                    <h2>Create Account</h2>
                    <p>Join the PackPal operator network</p>
                  </div>

                  {/* Role Selector */}
                  <div className="rp-roles">
                    {ROLES.map(r => (
                      <button key={r.id} type="button"
                        className={`rp-role-btn ${role===r.id?'active':''}`}
                        onClick={()=>setRole(r.id)}
                      >
                        <div className="rp-role-icon">{r.icon}</div>
                        <div className="rp-role-text">
                          <strong>{r.label}</strong>
                          <span>{r.desc}</span>
                        </div>
                        {role===r.id && <CheckCircle2 size={16} className="rp-check"/>}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div className="rp-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        <AlertCircle size={15}/>{error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleRegister} className="rp-form">
                    <div className="rp-row">
                      <div className="rp-field">
                        <label>Full Name</label>
                        <div className="rp-iw"><User size={15} className="rp-ico"/>
                          <input type="text" placeholder="John Doe" value={fullName} onChange={e=>setFullName(e.target.value)}/>
                        </div>
                      </div>
                      <div className="rp-field">
                        <label>Email</label>
                        <div className="rp-iw"><Mail size={15} className="rp-ico"/>
                          <input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                        </div>
                      </div>
                    </div>
                    <div className="rp-row">
                      <div className="rp-field">
                        <label>Password</label>
                        <div className="rp-iw"><Lock size={15} className="rp-ico"/>
                          <input type={show?'text':'password'} placeholder="Min. 6 chars" value={password} onChange={e=>setPassword(e.target.value)}/>
                          <button type="button" className="rp-eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                        </div>
                      </div>
                      <div className="rp-field">
                        <label>Confirm</label>
                        <div className="rp-iw"><Lock size={15} className="rp-ico"/>
                          <input type={show?'text':'password'} placeholder="Repeat" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                        </div>
                      </div>
                    </div>

                    <motion.button type="submit" className="rp-submit" disabled={authLoading} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                      {authLoading ? <Loader2 size={18} className="rp-spin"/> : <><span>Deploy My Account</span><ChevronRight size={18}/></>}
                    </motion.button>
                  </form>

                  <div className="rp-trust"><Shield size={13}/> Encrypted · SOC 2 · GDPR Ready</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .rp-root { width:100vw; height:100vh; overflow:hidden; background:#080810; font-family:'Inter',system-ui,sans-serif; }
        .rp-scroll { height:100%; overflow-y:scroll; scroll-snap-type:y mandatory; scroll-behavior:smooth; }
        .rp-scroll::-webkit-scrollbar { width:4px; }
        .rp-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

        /* Hero */
        .rp-hero { height:100vh; scroll-snap-align:start; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .rp-hero-inner { position:relative; z-index:2; text-align:center; max-width:680px; padding:0 2rem; }
        .rp-badge { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:100px; border:1px solid rgba(99,102,241,0.35); background:rgba(99,102,241,0.1); color:rgba(255,255,255,0.75); font-size:0.8rem; font-weight:600; margin-bottom:2rem; }
        .rp-headline { font-size:clamp(2.5rem,6vw,4.5rem); font-weight:900; letter-spacing:-0.04em; color:#fff; line-height:1.05; margin:0 0 1.25rem; }
        .rp-grad { background:linear-gradient(135deg,#ec4899,#8b5cf6,#6366f1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .rp-sub { color:rgba(255,255,255,0.45); font-size:1.05rem; line-height:1.6; margin:0 auto 2.5rem; max-width:480px; }
        .rp-scroll-hint { display:flex; flex-direction:column; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.25); font-size:0.75rem; letter-spacing:0.06em; text-transform:uppercase; }
        .rp-mesh { position:absolute; inset:0; pointer-events:none; }
        .rp-mesh-orb { position:absolute; border-radius:50%; filter:blur(40px); }

        /* Features */
        .rp-features-section { min-height:100vh; scroll-snap-align:start; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; background:linear-gradient(180deg,#080810,#0d0d1a); }
        .rp-features-header { text-align:center; margin-bottom:3rem; }
        .rp-features-header h2 { font-size:2.5rem; font-weight:900; color:#fff; letter-spacing:-0.03em; margin:0 0 0.75rem; }
        .rp-features-header p { color:rgba(255,255,255,0.45); font-size:1rem; }
        .rp-features-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; max-width:800px; width:100%; }
        .rp-feature-card { padding:2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:24px; transition:all 0.3s; cursor:default; }
        .rp-feat-emoji { font-size:2rem; margin-bottom:1rem; display:block; }
        .rp-feature-card h3 { font-size:1rem; font-weight:800; color:#fff; margin:0 0 0.5rem; }
        .rp-feature-card p { font-size:0.85rem; color:rgba(255,255,255,0.4); line-height:1.6; margin:0; }

        /* Form */
        .rp-form-section { min-height:100vh; scroll-snap-align:start; display:flex; align-items:center; justify-content:center; padding:4rem 2rem; background:linear-gradient(180deg,#0d0d1a,#080810); }
        .rp-card { width:100%; max-width:540px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:28px; padding:2.5rem; backdrop-filter:blur(20px); box-shadow:0 40px 80px rgba(0,0,0,0.4); position:relative; }
        .rp-back { display:inline-flex; align-items:center; gap:6px; color:rgba(255,255,255,0.3); font-size:0.78rem; font-weight:600; text-decoration:none; margin-bottom:1.5rem; transition:color 0.2s; }
        .rp-back:hover { color:rgba(255,255,255,0.6); }
        .rp-card-header { text-align:center; margin-bottom:1.75rem; }
        .rp-logo { width:48px; height:48px; margin:0 auto 1rem; border-radius:14px; background:linear-gradient(135deg,#ec4899,#8b5cf6); display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 12px 24px rgba(139,92,246,0.35); }
        .rp-card-header h2 { font-size:1.5rem; font-weight:800; color:#fff; margin:0 0 0.3rem; letter-spacing:-0.02em; }
        .rp-card-header p { color:rgba(255,255,255,0.4); font-size:0.875rem; }

        /* Roles */
        .rp-roles { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem; }
        .rp-role-btn { position:relative; display:flex; align-items:center; gap:1rem; padding:1rem 1.25rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; cursor:pointer; text-align:left; color:#fff; transition:all 0.2s; font-family:inherit; }
        .rp-role-btn:hover { background:rgba(99,102,241,0.07); border-color:rgba(99,102,241,0.25); }
        .rp-role-btn.active { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.5); }
        .rp-role-icon { width:38px; height:38px; border-radius:10px; background:rgba(99,102,241,0.15); display:flex; align-items:center; justify-content:center; color:#818cf8; flex-shrink:0; }
        .rp-role-btn.active .rp-role-icon { background:rgba(99,102,241,0.25); color:#a5b4fc; }
        .rp-role-text strong { display:block; font-size:0.875rem; font-weight:700; margin-bottom:2px; }
        .rp-role-text span { font-size:0.75rem; color:rgba(255,255,255,0.4); line-height:1.4; display:block; }
        .rp-check { position:absolute; right:1rem; top:50%; transform:translateY(-50%); color:#6366f1; }

        /* Error */
        .rp-error { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1rem; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); border-radius:12px; color:#f87171; font-size:0.82rem; margin-bottom:1rem; }

        /* Form fields */
        .rp-form { display:flex; flex-direction:column; gap:1rem; }
        .rp-row { display:grid; grid-template-columns:1fr 1fr; gap:0.875rem; }
        .rp-field { display:flex; flex-direction:column; gap:0.4rem; }
        .rp-field label { font-size:0.75rem; font-weight:600; color:rgba(255,255,255,0.45); }
        .rp-iw { position:relative; }
        .rp-ico { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.25); pointer-events:none; }
        .rp-iw input { width:100%; height:44px; padding:0 0.875rem 0 2.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-size:0.85rem; outline:none; transition:0.2s; box-sizing:border-box; font-family:inherit; }
        .rp-iw input::placeholder { color:rgba(255,255,255,0.2); }
        .rp-iw input:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.07); box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
        .rp-eye { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; display:flex; padding:3px; }
        .rp-submit { width:100%; height:50px; border-radius:14px; border:none; background:linear-gradient(135deg,#ec4899,#8b5cf6,#6366f1); color:#fff; font-weight:800; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer; box-shadow:0 12px 32px rgba(99,102,241,0.35); font-family:inherit; margin-top:0.25rem; }
        .rp-submit:disabled { opacity:0.7; cursor:not-allowed; }
        .rp-trust { text-align:center; margin-top:1.25rem; color:rgba(255,255,255,0.2); font-size:0.72rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; }

        /* Success */
        .rp-success { text-align:center; padding:2rem 0; }
        .rp-success h3 { font-size:1.75rem; font-weight:800; color:#fff; margin:1rem 0 0.5rem; }
        .rp-success p { color:rgba(255,255,255,0.45); margin:0 0 2rem; font-size:0.9rem; line-height:1.5; }
        .rp-prog { height:3px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; }
        .rp-prog-fill { height:100%; background:linear-gradient(90deg,#6366f1,#34d399); border-radius:10px; }

        .rp-spin { animation:rp-rot 0.8s linear infinite; }
        @keyframes rp-rot { to{transform:rotate(360deg);} }

        @media(max-width:640px) {
          .rp-row { grid-template-columns:1fr; }
          .rp-features-grid { grid-template-columns:1fr; }
          .rp-card { padding:2rem 1.25rem; }
          .rp-headline { font-size:2.5rem; }
        }
      `}</style>
    </div>
  );
}
