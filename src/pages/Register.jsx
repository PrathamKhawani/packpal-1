import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Briefcase, Eye, EyeOff,
  AlertCircle, Loader2, ChevronRight, CheckCircle2,
  ArrowLeft, Star, Shield, Globe, Map, Zap, BarChart3, Wallet, Users
} from 'lucide-react';
import '../styles/auth.css';

const ROLES = [
  { id:'owner',  icon:<Briefcase size={20}/>, label:'Trip Owner',  desc:'Plan & lead missions, manage team & budget', color:'#4f46e5' },
  { id:'member', icon:<User size={20}/>,      label:'Team Member', desc:'Join missions, coordinate packing & tasks',  color:'#059669' },
];

const FEATURES = [
  { icon:<Map size={18}/>,      color:'#6366f1', title:'AI Itinerary',  value:'Tokyo · 5d · ₹85k',    sub:'Ready in 3 secs',   rotate:'rotateY(-12deg) rotateX(5deg)'  },
  { icon:<Shield size={18}/>,   color:'#0ea5e9', title:'Secure Vault',  value:'Passport · Visa · Docs', sub:'256-bit encrypted',  rotate:'rotateY(10deg) rotateX(-4deg)'  },
  { icon:<Wallet size={18}/>,   color:'#10b981', title:'Expense Ops',   value:'₹1.24L of ₹2L',         sub:'62% · On track',     rotate:'rotateY(-8deg) rotateX(6deg)'   },
  { icon:<Users size={18}/>,    color:'#f59e0b', title:'Team Control',  value:'8 members active',       sub:'All checked in ✓',   rotate:'rotateY(14deg) rotateX(-5deg)'  },
  { icon:<BarChart3 size={18}/>,color:'#ec4899', title:'Analytics',     value:'Risk: LOW ✓',            sub:'Weather clear',      rotate:'rotateY(-10deg) rotateX(4deg)'  },
  { icon:<Zap size={18}/>,      color:'#8b5cf6', title:'Risk Intel',    value:'Operation Sundown',      sub:'T-minus 4 days',     rotate:'rotateY(12deg) rotateX(-6deg)'  },
];

const BG = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=85&w=1800&auto=format&fit=crop';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [show, setShow]         = useState(false);
  const [role, setRole]         = useState('member');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [mouse, setMouse]       = useState({ x:0, y:0 });
  const { register, authLoading } = useApp();
  const navigate = useNavigate();
  const rightRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = rightRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 14,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 9,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName||!email||!password||!confirm) { setError('Please fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const r = await register(email, password, role, fullName);
    if (r.success) { setSuccess(true); setTimeout(() => navigate('/login'), 3500); }
    else setError(r.message || 'Registration failed. Please try again.');
  };

  return (
    <main className="rp3-root">

      {/* ═══ LEFT — Register Form ═══ */}
      <section className="rp3-left" aria-label="Create your PackPal account">
        <div className="rp3-left-inner">

          <div className="rp3-brand">
            <div className="rp3-brand-icon">P</div>
            <span className="rp3-brand-name">PackPal</span>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="ok" className="rp3-success" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                <div className="rp3-success-ico"><CheckCircle2 size={56} color="#10b981"/></div>
                <h3>Welcome to PackPal!</h3>
                <p>A verification email has been sent. Redirecting you to sign in...</p>
                <div className="rp3-prog">
                  <motion.div className="rp3-prog-fill" initial={{width:0}} animate={{width:'100%'}} transition={{duration:3.5}}/>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="rp3-heading">
                  <h2>Create Your Account</h2>
                  <p>Join 12,400+ operators planning extraordinary missions worldwide.</p>
                </div>

                {/* Role selector */}
                <div className="rp3-roles">
                  {ROLES.map(r => (
                    <button
                      key={r.id} type="button"
                      className={`rp3-role ${role===r.id?'active':''}`}
                      style={{'--rc':r.color}}
                      onClick={()=>setRole(r.id)}
                    >
                      <div className="rp3-role-ico">{r.icon}</div>
                      <div className="rp3-role-txt">
                        <strong>{r.label}</strong>
                        <span>{r.desc}</span>
                      </div>
                      {role===r.id && <CheckCircle2 size={16} className="rp3-role-check"/>}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div className="rp3-error" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <AlertCircle size={15}/>{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleRegister} className="rp3-form" noValidate>
                  <div className="rp3-row">
                    <div className="rp3-field">
                      <label htmlFor="rp-name">Full Name</label>
                      <div className="rp3-iw">
                        <User size={16} className="rp3-ico"/>
                        <input id="rp-name" type="text" placeholder="John Doe" value={fullName} onChange={e=>setFullName(e.target.value)} autoComplete="name"/>
                      </div>
                    </div>
                    <div className="rp3-field">
                      <label htmlFor="rp-email">Email Address</label>
                      <div className="rp3-iw">
                        <Mail size={16} className="rp3-ico"/>
                        <input id="rp-email" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                      </div>
                    </div>
                  </div>

                  <div className="rp3-row">
                    <div className="rp3-field">
                      <label htmlFor="rp-pass">Password</label>
                      <div className="rp3-iw">
                        <Lock size={16} className="rp3-ico"/>
                        <input id="rp-pass" type={show?'text':'password'} placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/>
                        <button type="button" className="rp3-eye" onClick={()=>setShow(!show)}>
                          {show?<EyeOff size={15}/>:<Eye size={15}/>}
                        </button>
                      </div>
                    </div>
                    <div className="rp3-field">
                      <label htmlFor="rp-conf">Confirm Password</label>
                      <div className="rp3-iw">
                        <Lock size={16} className="rp3-ico"/>
                        <input id="rp-conf" type={show?'text':'password'} placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password"/>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit" className="rp3-submit"
                    disabled={authLoading}
                    whileHover={{ scale:1.02, boxShadow:'0 20px 44px rgba(99,102,241,0.5)' }}
                    whileTap={{ scale:0.97 }}
                  >
                    {authLoading
                      ? <Loader2 size={20} className="rp3-spin"/>
                      : <><span>Deploy My Account</span><ChevronRight size={18}/></>
                    }
                  </motion.button>
                </form>

                <div className="rp3-switch">
                  Already have an account?&nbsp;<Link to="/login">Sign in →</Link>
                </div>
                <div className="rp3-trust">
                  <span><Shield size={12}/> SOC 2 Type II</span>
                  <span><CheckCircle2 size={12}/> GDPR Ready</span>
                  <span><CheckCircle2 size={12}/> 256-bit AES</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ RIGHT — Cinematic Visual ═══ */}
      <section
        ref={rightRef}
        className="rp3-right"
        onMouseMove={handleMouseMove}
        aria-hidden="true"
      >
        <motion.div
          className="rp3-photo"
          animate={{ x:mouse.x*0.4, y:mouse.y*0.4 }}
          transition={{ type:'spring', stiffness:40, damping:12 }}
        >
          <img src={BG} alt="Global travel destinations" loading="eager" decoding="async"/>
        </motion.div>
        <div className="rp3-photo-overlay"/>

        <motion.div
          className="rp3-right-content"
          animate={{ x:mouse.x*-0.25, y:mouse.y*-0.18 }}
          transition={{ type:'spring', stiffness:40, damping:12 }}
        >
          <div className="rp3-right-headline">
            <div className="rp3-right-badge">
              <Star size={12} fill="currentColor"/> 12,400+ teams trust PackPal
            </div>
            <h2>Adventures are<br/>better when<br/><em>perfectly planned.</em></h2>
            <p>From Everest base camps to European city tours — PackPal handles the logistics so you focus on the experience.</p>
          </div>

          <div className="rp3-cards-grid">
            {FEATURES.map((f,i) => (
              <motion.div
                key={i}
                className="rp3-fcard"
                style={{ '--cc':f.color, '--rotate':f.rotate }}
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.15+i*0.1, duration:0.6, ease:'easeOut' }}
                whileHover={{ scale:1.06 }}
              >
                <div className="rp3-fcard-icon">{f.icon}</div>
                <div className="rp3-fcard-body">
                  <div className="rp3-fcard-title">{f.title}</div>
                  <div className="rp3-fcard-val">{f.value}</div>
                  <div className="rp3-fcard-sub">{f.sub}</div>
                </div>
                <div className="rp3-fcard-dot"/>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
