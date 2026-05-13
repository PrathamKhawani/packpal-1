import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, CheckCircle2, ArrowDown, ArrowLeft, Shield, Globe, Plane, Mountain, Waves } from 'lucide-react';

const SCENES = [
  { bg:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=90&w=2000&auto=format&fit=crop', label:'Beaches', emoji:'🏖️' },
  { bg:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=90&w=2000&auto=format&fit=crop', label:'Mountains', emoji:'🏔️' },
  { bg:'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=90&w=2000&auto=format&fit=crop', label:'Cities', emoji:'🌆' },
];

const ROLES = [
  { id:'owner',  icon:<Briefcase size={20}/>, label:'Trip Owner',  desc:'Plan & lead missions, manage team & finances', color:'#6366f1' },
  { id:'member', icon:<User size={20}/>,      label:'Team Member', desc:'Join missions, manage packing & itinerary',  color:'#10b981' },
];

const PERKS = [
  'AI-Generated Itineraries in seconds',
  'End-to-end encrypted document vault',
  'Real-time team expense tracking',
  'Risk & weather intelligence',
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
  const [sceneIdx, setSceneIdx] = useState(0);
  const { register, authLoading } = useApp();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 });

  const bgY       = useTransform(smooth, [0, 1], ['0%', '22%']);
  const heroOp    = useTransform(smooth, [0, 0.30], [1, 0]);
  const heroY     = useTransform(smooth, [0, 0.35], ['0%', '-28%']);
  const midOp     = useTransform(smooth, [0.28, 0.55], [0, 1]);
  const formOp    = useTransform(smooth, [0.52, 0.88], [0, 1]);
  const formY2    = useTransform(smooth, [0.52, 0.88], [70, 0]);
  const perksX    = useTransform(smooth, [0.15, 0.48], ['-40px', '0px']);
  const perksOp   = useTransform(smooth, [0.15, 0.45], [0, 1]);

  // Auto-cycle bg scenes
  React.useEffect(() => {
    const id = setInterval(() => setSceneIdx(i => (i+1) % SCENES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName||!email||!password||!confirm) { setError('Please fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const r = await register(email, password, role, fullName);
    if (r.success) { setSuccess(true); setTimeout(() => navigate('/login'), 3200); }
    else setError(r.message || 'Registration failed.');
  };

  return (
    <div className="rv-root">
      <div ref={containerRef} className="rv-scroll">
        <div className="rv-canvas">
          <div className="rv-sticky">

            {/* Background — crossfades between scenes */}
            <motion.div className="rv-bg" style={{ y: bgY }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={sceneIdx}
                  src={SCENES[sceneIdx].bg}
                  alt="Travel scene"
                  className="rv-bg-img"
                  initial={{ opacity:0, scale:1.08 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }}
                  transition={{ duration:1.5, ease:'easeOut' }}
                />
              </AnimatePresence>
            </motion.div>
            <div className="rv-overlay"/>

            {/* Scene selector dots */}
            <div className="rv-scene-dots">
              {SCENES.map((s,i) => (
                <button key={i} className={`rv-dot ${i===sceneIdx?'active':''}`} onClick={()=>setSceneIdx(i)}>
                  <span>{s.emoji}</span>
                </button>
              ))}
            </div>

            {/* HERO */}
            <motion.div className="rv-hero" style={{ opacity:heroOp, y:heroY }}>
              <motion.div className="rv-hero-tag" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
                <Plane size={14}/> Start your first mission
              </motion.div>
              <motion.h1 className="rv-hero-title" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
                Adventures are<br/><span className="rv-grad">better together.</span>
              </motion.h1>
              <motion.p className="rv-hero-sub" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.7}}>
                Join thousands of teams coordinating extraordinary journeys on PackPal.
              </motion.p>
              <motion.div className="rv-scroll-cta" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}>
                <span>Scroll to create account</span>
                <motion.div className="rv-scroll-ring" animate={{y:[0,10,0]}} transition={{repeat:Infinity,duration:1.6,ease:'easeInOut'}}>
                  <ArrowDown size={22}/>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* MID — perks list */}
            <motion.div className="rv-mid" style={{ opacity:midOp }}>
              <motion.div className="rv-perks-wrap" style={{ x:perksX, opacity:perksOp }}>
                <div className="rv-perks-title">Why 12,400 teams choose PackPal</div>
                {PERKS.map((p,i) => (
                  <motion.div key={i} className="rv-perk"
                    initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}}
                    transition={{delay:i*0.1,duration:0.5}} viewport={{once:true}}
                  >
                    <CheckCircle2 size={18} color="#6366f1"/>{p}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Mid fade to light */}
            <motion.div className="rv-light-fade" style={{ opacity: formOp }}/>

            {/* REGISTER FORM */}
            <motion.div className="rv-form-wrap" style={{ opacity:formOp, y:formY2 }}>
              <div className="rv-form-card">
                <Link to="/login" className="rv-back"><ArrowLeft size={14}/> Back to Sign In</Link>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="ok" className="rv-success" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                      <div className="rv-success-icon"><CheckCircle2 size={52}/></div>
                      <h3>Welcome to PackPal!</h3>
                      <p>Check your email to verify your account. Redirecting to sign in...</p>
                      <div className="rv-prog"><motion.div className="rv-prog-fill" initial={{width:0}} animate={{width:'100%'}} transition={{duration:3.2}}/></div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                      <div className="rv-card-hd">
                        <div className="rv-logo">P</div>
                        <div>
                          <div className="rv-card-title">Create Your Account</div>
                          <div className="rv-card-sub">Join the PackPal operator network</div>
                        </div>
                      </div>

                      {/* Role selector */}
                      <div className="rv-roles">
                        {ROLES.map(r => (
                          <button key={r.id} type="button" className={`rv-role ${role===r.id?'active':''}`}
                            style={{'--rc': r.color}} onClick={()=>setRole(r.id)}>
                            <div className="rv-role-ico">{r.icon}</div>
                            <div className="rv-role-txt">
                              <strong>{r.label}</strong>
                              <span>{r.desc}</span>
                            </div>
                            {role===r.id && <CheckCircle2 size={16} className="rv-check"/>}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div className="rv-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                            <AlertCircle size={14}/>{error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleRegister} className="rv-form">
                        <div className="rv-row">
                          <div className="rv-field">
                            <label>Full Name</label>
                            <div className="rv-iw"><User size={15} className="rv-ico"/>
                              <input type="text" placeholder="John Doe" value={fullName} onChange={e=>setFullName(e.target.value)}/>
                            </div>
                          </div>
                          <div className="rv-field">
                            <label>Email Address</label>
                            <div className="rv-iw"><Mail size={15} className="rv-ico"/>
                              <input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                            </div>
                          </div>
                        </div>
                        <div className="rv-row">
                          <div className="rv-field">
                            <label>Password</label>
                            <div className="rv-iw"><Lock size={15} className="rv-ico"/>
                              <input type={show?'text':'password'} placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)}/>
                              <button type="button" className="rv-eye" onClick={()=>setShow(!show)}>{show?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                            </div>
                          </div>
                          <div className="rv-field">
                            <label>Confirm Password</label>
                            <div className="rv-iw"><Lock size={15} className="rv-ico"/>
                              <input type={show?'text':'password'} placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                            </div>
                          </div>
                        </div>

                        <motion.button type="submit" className="rv-submit" disabled={authLoading} whileHover={{scale:1.02,boxShadow:'0 20px 40px rgba(99,102,241,0.45)'}} whileTap={{scale:0.97}}>
                          {authLoading ? <Loader2 size={19} className="rv-spin"/> : <><span>Deploy My Account</span><ChevronRight size={19}/></>}
                        </motion.button>
                      </form>

                      <div className="rv-trust-row">
                        <Shield size={12}/> End-to-end encrypted &nbsp;·&nbsp; SOC 2 compliant &nbsp;·&nbsp; GDPR ready
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="rv-prog-bar" style={{ scaleX: scrollYProgress }}/>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .rv-root { width:100vw; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; }
        .rv-scroll { width:100%; height:100%; overflow-y:scroll; }
        .rv-scroll::-webkit-scrollbar { display:none; }
        .rv-canvas { height:530vh; }

        .rv-sticky {
          position:sticky; top:0; height:100vh;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }

        /* Background */
        .rv-bg { position:absolute; inset:-10%; z-index:0; }
        .rv-bg-img { width:100%; height:100%; object-fit:cover; }
        .rv-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(160deg, rgba(5,10,30,0.65) 0%, rgba(10,15,45,0.55) 50%, rgba(5,10,30,0.72) 100%);
        }

        /* Scene dots */
        .rv-scene-dots { position:absolute; top:1.5rem; right:1.5rem; z-index:20; display:flex; gap:0.5rem; }
        .rv-dot { padding:6px 12px; border-radius:100px; border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.1); backdrop-filter:blur(8px); cursor:pointer; font-size:0.9rem; transition:all 0.3s; }
        .rv-dot.active { background:rgba(255,255,255,0.25); border-color:rgba(255,255,255,0.5); }

        /* Hero */
        .rv-hero { position:absolute; z-index:10; text-align:center; bottom:12%; left:50%; transform:translateX(-50%); width:100%; max-width:700px; padding:0 2rem; pointer-events:none; }
        .rv-hero-tag { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:100px; background:rgba(255,255,255,0.12); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.9); font-size:0.78rem; font-weight:700; margin-bottom:1.5rem; letter-spacing:0.03em; }
        .rv-hero-title { font-size:clamp(2.8rem,6vw,5.2rem); font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1.05; margin:0 0 1.25rem; text-shadow:0 4px 24px rgba(0,0,0,0.4); }
        .rv-grad { background:linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .rv-hero-sub { font-size:1.05rem; color:rgba(255,255,255,0.7); line-height:1.65; max-width:480px; margin:0 auto 2rem; }
        .rv-scroll-cta { display:flex; flex-direction:column; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.5); font-size:0.78rem; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; pointer-events:auto; }
        .rv-scroll-ring { width:44px; height:44px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.6); }

        /* Mid perks */
        .rv-mid { position:absolute; z-index:15; left:5%; pointer-events:none; }
        .rv-perks-wrap { background:rgba(255,255,255,0.08); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.2); border-radius:20px; padding:1.5rem 2rem; }
        .rv-perks-title { font-size:0.72rem; font-weight:800; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:1rem; }
        .rv-perk { display:flex; align-items:center; gap:0.75rem; color:#fff; font-size:0.9rem; font-weight:600; margin-bottom:0.75rem; }
        .rv-perk:last-child { margin-bottom:0; }

        /* Light fade */
        .rv-light-fade { position:absolute; inset:0; z-index:20; background:linear-gradient(180deg,rgba(248,250,252,0) 0%,rgba(248,250,252,0.97) 100%); pointer-events:none; }

        /* Form */
        .rv-form-wrap { position:absolute; z-index:30; width:100%; display:flex; justify-content:center; padding:0 1.5rem; pointer-events:none; }
        .rv-form-card { width:100%; max-width:500px; pointer-events:auto; background:rgba(255,255,255,0.93); backdrop-filter:blur(40px) saturate(200%); border:1px solid rgba(255,255,255,0.85); border-radius:28px; padding:2.25rem; box-shadow:0 32px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9); }
        .rv-back { display:inline-flex; align-items:center; gap:5px; color:#9ca3af; font-size:0.75rem; font-weight:600; text-decoration:none; margin-bottom:1.25rem; transition:color 0.2s; }
        .rv-back:hover { color:#111827; }
        .rv-card-hd { display:flex; align-items:center; gap:0.875rem; margin-bottom:1.5rem; }
        .rv-logo { width:44px; height:44px; border-radius:13px; flex-shrink:0; background:linear-gradient(135deg,#4f46e5,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:900; color:#fff; box-shadow:0 8px 20px rgba(79,70,229,0.38); }
        .rv-card-title { font-size:1rem; font-weight:800; color:#111827; }
        .rv-card-sub { font-size:0.75rem; color:#9ca3af; }

        /* Roles */
        .rv-roles { display:flex; flex-direction:column; gap:0.625rem; margin-bottom:1.25rem; }
        .rv-role { position:relative; display:flex; align-items:center; gap:0.875rem; padding:0.875rem 1rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; cursor:pointer; text-align:left; transition:all 0.2s; font-family:inherit; }
        .rv-role:hover { border-color:var(--rc); background:color-mix(in srgb,var(--rc) 5%,#fff); }
        .rv-role.active { border-color:var(--rc); background:color-mix(in srgb,var(--rc) 6%,#fff); }
        .rv-role-ico { width:36px; height:36px; border-radius:10px; background:color-mix(in srgb,var(--rc) 12%,#fff); display:flex; align-items:center; justify-content:center; color:var(--rc); flex-shrink:0; border:1px solid color-mix(in srgb,var(--rc) 20%,transparent); }
        .rv-role-txt strong { display:block; font-size:0.83rem; font-weight:700; color:#111827; margin-bottom:1px; }
        .rv-role-txt span { font-size:0.72rem; color:#9ca3af; line-height:1.35; display:block; }
        .rv-check { position:absolute; right:1rem; color:var(--rc); }

        /* Error */
        .rv-error { display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.875rem; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; color:#dc2626; font-size:0.82rem; margin-bottom:1rem; }

        /* Form fields */
        .rv-form { display:flex; flex-direction:column; gap:0.875rem; }
        .rv-row { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .rv-field { display:flex; flex-direction:column; gap:0.35rem; }
        .rv-field label { font-size:0.75rem; font-weight:700; color:#374151; }
        .rv-iw { position:relative; }
        .rv-ico { position:absolute; left:0.8rem; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .rv-iw input { width:100%; height:44px; padding:0 0.875rem 0 2.5rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:11px; color:#111827; font-size:0.875rem; outline:none; transition:all 0.2s; box-sizing:border-box; font-family:inherit; }
        .rv-iw input::placeholder { color:#cbd5e1; }
        .rv-iw input:focus { border-color:#6366f1; background:#fff; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
        .rv-eye { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; color:#9ca3af; cursor:pointer; display:flex; padding:3px; }
        .rv-submit { width:100%; height:50px; border-radius:13px; border:none; background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; font-weight:800; font-size:0.9rem; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer; box-shadow:0 12px 28px rgba(99,102,241,0.36); margin-top:0.25rem; }
        .rv-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .rv-trust-row { text-align:center; margin-top:1rem; color:#9ca3af; font-size:0.7rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; }

        /* Success */
        .rv-success { text-align:center; padding:1.5rem 0; }
        .rv-success-icon { color:#10b981; margin-bottom:1rem; }
        .rv-success h3 { font-size:1.5rem; font-weight:800; color:#111827; margin:0 0 0.5rem; }
        .rv-success p { color:#6b7280; font-size:0.875rem; margin:0 0 1.5rem; line-height:1.5; }
        .rv-prog { height:4px; background:#e5e7eb; border-radius:10px; overflow:hidden; }
        .rv-prog-fill { height:100%; background:linear-gradient(90deg,#6366f1,#10b981); }

        .rv-spin { animation:rv-rot 0.8s linear infinite; }
        @keyframes rv-rot { to{transform:rotate(360deg);} }
        .rv-prog-bar { position:fixed; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#ec4899,#f59e0b); transform-origin:left; z-index:9999; }

        @media(max-width:640px) {
          .rv-row { grid-template-columns:1fr; }
          .rv-form-card { padding:1.75rem 1.25rem; }
          .rv-mid { display:none; }
          .rv-hero-title { font-size:2.5rem; }
        }
      `}</style>
    </div>
  );
}
