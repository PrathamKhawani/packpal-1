import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import '../styles/auth.css';

const ROLES = [
  { id:'owner',  icon:<Briefcase size={20}/>, label:'Trip Owner',  desc:'Plan missions, manage team & budget', color:'#4f46e5' },
  { id:'member', icon:<User size={20}/>,      label:'Team Member', desc:'Join missions, track packing & tasks', color:'#059669' },
];

/* Photos that burst out of the globe */
const PHOTOS = [
  { src:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=70&w=400&auto=format&fit=crop', city:'Kyoto', top:'-18%', left:'-28%', rot:'-12deg', delay:0.1 },
  { src:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=70&w=400&auto=format&fit=crop', city:'Paris', top:'-20%', right:'-26%', rot:'10deg', delay:0.15 },
  { src:'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=70&w=400&auto=format&fit=crop', city:'Dubai', top:'60%', left:'-24%', rot:'-8deg', delay:0.2 },
  { src:'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=70&w=400&auto=format&fit=crop', city:'NYC', top:'62%', right:'-22%', rot:'14deg', delay:0.1 },
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
  const smooth = useSpring(scrollYProgress, { stiffness:55, damping:18 });

  /* Globe cracks open — top half rises, bottom half lowers */
  const topHalfY   = useTransform(smooth, [0.05, 0.45], ['0%', '-55%']);
  const botHalfY   = useTransform(smooth, [0.05, 0.45], ['0%',  '55%']);
  const globeGlow  = useTransform(smooth, [0.05, 0.30], [0, 1]);
  /* Photos burst out */
  const photoScale = useTransform(smooth, [0.32, 0.55], [0, 1]);
  const photoOp    = useTransform(smooth, [0.32, 0.52], [0, 1]);
  /* Globe shrinks */
  const globeScale = useTransform(smooth, [0.55, 0.80], [1, 0.5]);
  const globeOp    = useTransform(smooth, [0.68, 0.85], [1, 0]);
  /* Form rises */
  const formOp     = useTransform(smooth, [0.68, 0.92], [0, 1]);
  const formY      = useTransform(smooth, [0.68, 0.92], [60, 0]);
  /* Hero */
  const heroOp     = useTransform(smooth, [0, 0.16], [1, 0]);
  const heroY2     = useTransform(smooth, [0, 0.20], [0, -40]);
  const hintOp     = useTransform(smooth, [0, 0.08], [1, 0]);

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    if (!fullName||!email||!password||!confirm) { setError('Please fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const r = await register(email, password, role, fullName);
    if (r.success) { setSuccess(true); setTimeout(()=>navigate('/login'), 3500); }
    else setError(r.message || 'Registration failed.');
  };

  return (
    <div className="gp-root">
      <div className="gp-bg" aria-hidden="true">
        <div className="gp-orb gp-orb1"/><div className="gp-orb gp-orb2"/><div className="gp-orb gp-orb3"/>
      </div>

      <div ref={containerRef} className="gp-scroller">
        <div className="gp-canvas">
          <div className="gp-sticky">

            {/* Hero */}
            <motion.div className="gp-hero" style={{ opacity:heroOp, y:heroY2 }}>
              <div className="gp-hero-pill">🌍 Join 12,400+ Elite Operators</div>
              <h1>The world is yours.<br/><em>Start planning.</em></h1>
              <p>Scroll to crack open your world</p>
              <motion.div className="gp-scroll-arrow" style={{ opacity:hintOp }}
                animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:1.5 }}>↓</motion.div>
            </motion.div>

            {/* Globe + photo bursts */}
            <motion.div className="gp-globe-wrap" style={{ scale:globeScale, opacity:globeOp }}>
              <div className="gp-globe-scene">

                {/* Destination photos bursting out */}
                {PHOTOS.map((p,i) => (
                  <motion.div key={i} className="gp-photo-burst"
                    style={{ top:p.top, left:p.left, right:p.right, rotate:p.rot,
                      scale:photoScale, opacity:photoOp, transitionDelay:`${p.delay}s` }}>
                    <img src={p.src} alt={p.city} loading="lazy"/>
                    <div className="gp-photo-city">{p.city}</div>
                  </motion.div>
                ))}

                {/* Globe top half */}
                <motion.div className="gp-globe-half gp-globe-top" style={{ y:topHalfY }}>
                  <div className="gp-half-sphere gp-top-sphere">
                    <div className="gp-globe-grid"/>
                    <div className="gp-continent" style={{ top:'35%', left:'30%', width:'22%', height:'28%', borderRadius:'40% 60% 50% 50%' }}/>
                    <div className="gp-continent" style={{ top:'20%', left:'55%', width:'18%', height:'24%', borderRadius:'60% 40% 60% 40%' }}/>
                    <div className="gp-globe-shine"/>
                    <motion.div className="gp-globe-glow" style={{ opacity:globeGlow }}/>
                  </div>
                </motion.div>

                {/* Globe bottom half */}
                <motion.div className="gp-globe-half gp-globe-bot" style={{ y:botHalfY }}>
                  <div className="gp-half-sphere gp-bot-sphere">
                    <div className="gp-globe-grid"/>
                    <div className="gp-continent" style={{ top:'10%', left:'40%', width:'16%', height:'20%', borderRadius:'50%' }}/>
                    <div className="gp-continent" style={{ top:'30%', left:'60%', width:'14%', height:'18%', borderRadius:'50% 60% 40% 50%' }}/>
                  </div>
                </motion.div>

                {/* Equator crack glow */}
                <motion.div className="gp-equator" style={{ opacity:globeGlow }}/>
              </div>
            </motion.div>

            {/* Register form */}
            <motion.div className="gp-form-wrap" style={{ opacity:formOp, y:formY }}>
              <div className="gp-form-card">
                <Link to="/login" className="gp-back"><ArrowLeft size={14}/> Back to Sign In</Link>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="ok" className="gp-success" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                      <CheckCircle2 size={52} color="#10b981"/>
                      <h3>Welcome to PackPal!</h3>
                      <p>Check your email to verify. Redirecting...</p>
                      <div className="rp3-prog"><motion.div className="rp3-prog-fill" initial={{width:0}} animate={{width:'100%'}} transition={{duration:3.5}}/></div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                      <div className="gp-card-hd">
                        <div className="gp-logo">P</div>
                        <div>
                          <div className="gp-card-title">Create Your Account</div>
                          <div className="gp-card-sub">Join the PackPal operator network</div>
                        </div>
                      </div>

                      <div className="rp3-roles">
                        {ROLES.map(r => (
                          <button key={r.id} type="button" className={`rp3-role ${role===r.id?'active':''}`}
                            style={{'--rc':r.color}} onClick={()=>setRole(r.id)}>
                            <div className="rp3-role-ico">{r.icon}</div>
                            <div className="rp3-role-txt"><strong>{r.label}</strong><span>{r.desc}</span></div>
                            {role===r.id && <CheckCircle2 size={16} className="rp3-role-check"/>}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {error && <motion.div className="lp3-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}><AlertCircle size={14}/>{error}</motion.div>}
                      </AnimatePresence>

                      <form onSubmit={handleRegister} className="gp-form" noValidate>
                        <div className="rp3-row">
                          <div className="rp3-field">
                            <label>Full Name</label>
                            <div className="rp3-iw"><User size={15} className="rp3-ico"/>
                              <input type="text" placeholder="John Doe" value={fullName} onChange={e=>setFullName(e.target.value)} autoComplete="name"/>
                            </div>
                          </div>
                          <div className="rp3-field">
                            <label>Email</label>
                            <div className="rp3-iw"><Mail size={15} className="rp3-ico"/>
                              <input type="email" placeholder="you@co.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                            </div>
                          </div>
                        </div>
                        <div className="rp3-row">
                          <div className="rp3-field">
                            <label>Password</label>
                            <div className="rp3-iw"><Lock size={15} className="rp3-ico"/>
                              <input type={show?'text':'password'} placeholder="Min 6 chars" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/>
                              <button type="button" className="rp3-eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                            </div>
                          </div>
                          <div className="rp3-field">
                            <label>Confirm</label>
                            <div className="rp3-iw"><Lock size={15} className="rp3-ico"/>
                              <input type={show?'text':'password'} placeholder="Repeat" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password"/>
                            </div>
                          </div>
                        </div>
                        <motion.button type="submit" className="lp3-submit" disabled={authLoading}
                          whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                          {authLoading ? <Loader2 size={19} className="lp3-spin"/> : <><span>Deploy My Account</span><ChevronRight size={18}/></>}
                        </motion.button>
                      </form>
                      <div className="gp-footer">Already have an account? <Link to="/login">Sign in →</Link></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="pp-progress" style={{ scaleX:scrollYProgress }}/>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; }
        .gp-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; background:#060a14; }
        .gp-bg  { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
        .gp-orb { position:absolute; border-radius:50%; filter:blur(80px); }
        .gp-orb1 { width:600px; height:600px; background:rgba(5,150,105,0.12); top:-200px; right:-100px; }
        .gp-orb2 { width:500px; height:500px; background:rgba(99,102,241,0.1); bottom:-150px; left:-80px; }
        .gp-orb3 { width:400px; height:400px; background:rgba(236,72,153,0.07); top:40%; left:50%; transform:translate(-50%,-50%); }
        .gp-scroller { position:relative; z-index:1; width:100%; height:100%; overflow-y:scroll; }
        .gp-scroller::-webkit-scrollbar { display:none; }
        .gp-canvas { height:520vh; }
        .gp-sticky { position:sticky; top:0; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden; }

        /* Hero */
        .gp-hero { position:absolute; top:10%; left:50%; transform:translateX(-50%); text-align:center; z-index:20; white-space:nowrap; pointer-events:none; }
        .gp-hero-pill { display:inline-block; padding:7px 18px; border-radius:100px; background:rgba(255,255,255,0.07); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.12); color:rgba(255,255,255,0.85); font-size:0.78rem; font-weight:700; margin-bottom:1.5rem; }
        .gp-hero h1 { font-size:clamp(2.5rem,6vw,5rem); font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1.05; margin:0 0 1rem; }
        .gp-hero h1 em { font-style:normal; background:linear-gradient(90deg,#34d399,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .gp-hero p { color:rgba(255,255,255,0.4); font-size:0.95rem; margin:0 0 1rem; }
        .gp-scroll-arrow { font-size:1.5rem; color:rgba(255,255,255,0.3); display:block; }

        /* Globe wrap */
        .gp-globe-wrap { position:absolute; z-index:10; display:flex; align-items:center; justify-content:center; }
        .gp-globe-scene { position:relative; width:380px; height:380px; }
        .gp-globe-half { position:absolute; left:0; right:0; height:50%; overflow:hidden; }
        .gp-globe-top { top:0; }
        .gp-globe-bot { bottom:0; top:auto; }

        .gp-half-sphere {
          width:380px; height:380px; border-radius:50%; position:relative; overflow:hidden;
          background:radial-gradient(circle at 35% 35%, #1a4fd6 0%, #0a2a8a 50%, #060f3a 100%);
          box-shadow:inset -20px -10px 40px rgba(0,0,0,0.4), 0 0 60px rgba(59,130,246,0.2);
        }
        .gp-top-sphere { border-radius:190px 190px 0 0; }
        .gp-bot-sphere { border-radius:0 0 190px 190px; position:absolute; bottom:0; }

        .gp-globe-grid {
          position:absolute; inset:0; border-radius:inherit;
          background:repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,0.06) 28px,rgba(255,255,255,0.06) 29px),
                      repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,0.06) 28px,rgba(255,255,255,0.06) 29px);
        }
        .gp-continent { position:absolute; background:rgba(34,197,94,0.45); border:1px solid rgba(22,163,74,0.3); border-radius:50%; }
        .gp-globe-shine { position:absolute; top:8%; left:15%; width:35%; height:35%; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,0.18),transparent 70%); }
        .gp-globe-glow { position:absolute; inset:-10px; border-radius:50%; background:radial-gradient(circle,rgba(59,130,246,0.3),transparent 70%); }
        .gp-equator { position:absolute; top:50%; left:-4%; right:-4%; height:3px; background:linear-gradient(90deg,transparent,rgba(99,246,200,0.8),transparent); transform:translateY(-50%); border-radius:2px; box-shadow:0 0 16px rgba(99,246,200,0.6); }

        /* Destination photos */
        .gp-photo-burst { position:absolute; z-index:20; pointer-events:none; }
        .gp-photo-burst img { width:130px; height:90px; object-fit:cover; border-radius:14px; display:block; border:2px solid rgba(255,255,255,0.3); box-shadow:0 12px 36px rgba(0,0,0,0.5); }
        .gp-photo-city { text-align:center; margin-top:6px; font-size:0.68rem; font-weight:800; color:rgba(255,255,255,0.7); letter-spacing:0.08em; text-transform:uppercase; }

        /* Form card */
        .gp-form-wrap { position:absolute; z-index:30; width:100%; display:flex; justify-content:center; padding:0 1.5rem; pointer-events:none; }
        .gp-form-card { width:100%; max-width:500px; pointer-events:auto; background:rgba(255,255,255,0.95); backdrop-filter:blur(40px); border:1px solid rgba(255,255,255,0.9); border-radius:28px; padding:2.25rem; box-shadow:0 32px 64px rgba(0,0,0,0.4); }
        .gp-back { display:inline-flex; align-items:center; gap:5px; color:#9ca3af; font-size:0.75rem; font-weight:600; text-decoration:none; margin-bottom:1.25rem; transition:color 0.2s; }
        .gp-back:hover { color:#111827; }
        .gp-card-hd { display:flex; align-items:center; gap:0.875rem; margin-bottom:1.5rem; }
        .gp-logo { width:44px; height:44px; border-radius:13px; background:linear-gradient(135deg,#4f46e5,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:900; color:#fff; box-shadow:0 8px 20px rgba(79,70,229,0.38); flex-shrink:0; }
        .gp-card-title { font-size:1rem; font-weight:800; color:#111827; }
        .gp-card-sub   { font-size:0.75rem; color:#9ca3af; }
        .gp-form { display:flex; flex-direction:column; gap:0.875rem; }
        .gp-footer { text-align:center; margin-top:1.25rem; font-size:0.875rem; color:#9ca3af; }
        .gp-footer a { color:#4f46e5; font-weight:700; text-decoration:none; }
        .gp-success { text-align:center; padding:1.5rem 0; }
        .gp-success h3 { font-size:1.5rem; font-weight:800; color:#111827; margin:1rem 0 0.5rem; }
        .gp-success p  { color:#6b7280; font-size:0.875rem; margin:0 0 1.5rem; }

        @media(max-width:640px) {
          .gp-globe-scene { width:260px; height:260px; }
          .gp-half-sphere { width:260px; height:260px; }
          .gp-top-sphere { border-radius:130px 130px 0 0; }
          .gp-bot-sphere { border-radius:0 0 130px 130px; }
          .gp-photo-burst { display:none; }
          .gp-form-card { padding:1.75rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
