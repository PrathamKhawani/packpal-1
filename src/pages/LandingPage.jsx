import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Map, Shield, Wallet, Users, Zap, BarChart3, Star, CheckCircle, ChevronDown } from 'lucide-react';

/* ─── Each section: photo + feature description ─────── */
const FRAMES = [
  {
    img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=85&w=1400&auto=format&fit=crop',
    tag: 'AI Itinerary Generation',
    headline: 'Your perfect trip,\nplanned in seconds.',
    body: 'Describe your dream destination and PackPal AI crafts a full day-by-day itinerary — restaurants, transport, activities — instantly.',
    icon: <Map size={20}/>, color: '#6366f1', tilt: 'left',
    stat: { val:'3 sec', label:'Avg. generation time' },
  },
  {
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=85&w=1400&auto=format&fit=crop',
    tag: 'Real-time Expense Ops',
    headline: 'Every rupee.\nTracked perfectly.',
    body: 'Log expenses on the go, split costs across team members, set budget alerts, and generate finance reports for any expedition.',
    icon: <Wallet size={20}/>, color: '#10b981', tilt: 'right',
    stat: { val:'₹0 hidden fees', label:'Transparent tracking' },
  },
  {
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=85&w=1400&auto=format&fit=crop',
    tag: 'Team Coordination',
    headline: 'Your entire crew,\nin perfect sync.',
    body: 'Assign roles, manage packing checklists per member, track check-in status, and communicate mission updates in real-time.',
    icon: <Users size={20}/>, color: '#f59e0b', tilt: 'left',
    stat: { val:'500+', label:'Teams coordinated' },
  },
  {
    img: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=85&w=1400&auto=format&fit=crop',
    tag: 'Secure Document Vault',
    headline: 'Passports. Visas.\nAlways with you.',
    body: 'Store every critical document — encrypted and accessible only to you. Passports, visas, insurance, permits — all in one vault.',
    icon: <Shield size={20}/>, color: '#0ea5e9', tilt: 'right',
    stat: { val:'256-bit AES', label:'Military-grade encryption' },
  },
  {
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=85&w=1400&auto=format&fit=crop',
    tag: 'Risk Intelligence',
    headline: 'Go anywhere.\nWith confidence.',
    body: "Real-time weather, local safety alerts, travel advisories, and risk scores for every destination — so you're never caught off guard.",
    icon: <Zap size={20}/>, color: '#ec4899', tilt: 'left',
    stat: { val:'140+', label:'Countries monitored' },
  },
];

const TRUST = [
  { val: '12,400+', label: 'Active Operators' },
  { val: '4.9 / 5', label: 'Average Rating' },
  { val: '140+',    label: 'Countries' },
  { val: '99.9%',   label: 'Uptime SLA' },
];

/* ─── Single frame section ─────────────────────────── */
function FrameSection({ frame, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgRotateY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    frame.tilt === 'left'
      ? ['-28deg', '-6deg', '0deg', '8deg']
      : ['28deg', '6deg', '0deg', '-8deg']
  );
  const imgScale   = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.82, 1, 1, 0.9]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const textX      = useTransform(
    scrollYProgress, [0, 0.45, 1],
    frame.tilt === 'left' ? ['60px', '0px', '-30px'] : ['-60px', '0px', '30px']
  );
  const textOp     = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.95], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="lp-frame-section" aria-label={frame.tag}>
      <div className={`lp-frame-inner ${frame.tilt === 'right' ? 'lp-reverse' : ''}`}>

        {/* 3D Photo Frame */}
        <motion.div
          className="lp-photo-frame-wrap"
          style={{ rotateY: imgRotateY, scale: imgScale, opacity: imgOpacity }}
        >
          <div className="lp-photo-frame">
            <img src={frame.img} alt={frame.tag} loading="lazy" decoding="async"/>
            <div className="lp-photo-overlay-grad"/>
            {/* Floating stat badge */}
            <div className="lp-photo-badge" style={{ '--bc': frame.color }}>
              <div className="lp-badge-icon">{frame.icon}</div>
              <div>
                <strong>{frame.stat.val}</strong>
                <span>{frame.stat.label}</span>
              </div>
            </div>
          </div>
          {/* Frame shadow */}
          <div className="lp-frame-shadow"/>
        </motion.div>

        {/* Text content */}
        <motion.div className="lp-frame-text" style={{ x: textX, opacity: textOp }}>
          <div className="lp-frame-tag" style={{ '--tc': frame.color }}>
            {frame.icon} {frame.tag}
          </div>
          <h2 className="lp-frame-headline">
            {frame.headline.split('\n').map((l, i) => <span key={i}>{l}<br/></span>)}
          </h2>
          <p className="lp-frame-body">{frame.body}</p>
          <div className="lp-frame-number">
            <span className="lp-num" style={{ color: frame.color }}>{frame.stat.val}</span>
            <span className="lp-num-label">{frame.stat.label}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-page">

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=85&w=2000&auto=format&fit=crop"
            alt="PackPal — Travel Planning Platform"
            loading="eager"
          />
          <div className="lp-hero-overlay"/>
        </div>

        <div className="lp-hero-content">
          <motion.div
            className="lp-hero-badge"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          >
            <Star size={13} fill="currentColor"/> Rated #1 Travel Ops Platform · 12,400+ Teams
          </motion.div>
          <motion.h1
            className="lp-hero-title"
            initial={{ opacity:0, y:35 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          >
            Plan every mission.<br/>
            <span className="lp-hero-grad">Execute flawlessly.</span>
          </motion.h1>
          <motion.p
            className="lp-hero-sub"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
          >
            PackPal is the AI-powered platform for coordinating extraordinary travel — itineraries, expenses, documents, risk intelligence, and team management in one place.
          </motion.p>
          <motion.div
            className="lp-hero-cta"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.9 }}
          >
            <Link to="/register" className="lp-cta-primary">
              Start Free — No Credit Card <ArrowRight size={18}/>
            </Link>
            <Link to="/login" className="lp-cta-secondary">Sign In →</Link>
          </motion.div>
          <motion.div
            className="lp-scroll-hint"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
          >
            <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.6 }}>
              <ChevronDown size={24}/>
            </motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3D FRAME SECTIONS ═══════════════════════════ */}
      {FRAMES.map((frame, i) => (
        <FrameSection key={i} frame={frame} index={i}/>
      ))}

      {/* ═══ TRUST STATS ═════════════════════════════════ */}
      <section className="lp-trust-section" aria-label="PackPal trust statistics">
        <div className="lp-trust-inner">
          <motion.div
            className="lp-trust-heading"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
          >
            <h2>Trusted by elite teams worldwide</h2>
            <p>From corporate retreats to extreme expeditions — PackPal handles the complexity.</p>
          </motion.div>
          <div className="lp-trust-grid">
            {TRUST.map((t, i) => (
              <motion.div
                key={i} className="lp-trust-card"
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
              >
                <strong>{t.val}</strong>
                <span>{t.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AUTH CTA ════════════════════════════════════ */}
      <section className="lp-auth-section" aria-label="Get started with PackPal">
        <motion.div
          className="lp-auth-card"
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.7 }}
        >
          <div className="lp-auth-badge">✦ Join 12,400+ operators</div>
          <h2 className="lp-auth-title">Ready to run your next mission?</h2>
          <p className="lp-auth-sub">Create your free account in 30 seconds. No credit card required.</p>
          <div className="lp-auth-buttons">
            <Link to="/register" className="lp-auth-primary">
              Create Free Account <ArrowRight size={18}/>
            </Link>
            <Link to="/login" className="lp-auth-ghost">Already a member? Sign in</Link>
          </div>
          <div className="lp-auth-checks">
            {['SOC 2 Certified','256-bit Encryption','GDPR Compliant','Free forever plan'].map((c,i) => (
              <span key={i}><CheckCircle size={13}/>{c}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ STYLES ══════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .lp-page { font-family:'Inter',system-ui,sans-serif; background:#fff; overflow-x:hidden; }

        /* ── HERO ─────────────────────────────────────── */
        .lp-hero { position:relative; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .lp-hero-bg { position:absolute; inset:0; }
        .lp-hero-bg img { width:100%; height:100%; object-fit:cover; }
        .lp-hero-overlay { position:absolute; inset:0; background:linear-gradient(160deg,rgba(5,5,25,0.78),rgba(15,10,50,0.6),rgba(5,5,25,0.82)); }
        .lp-hero-content { position:relative; z-index:2; text-align:center; max-width:800px; padding:0 2rem; }
        .lp-hero-badge { display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border-radius:100px; background:rgba(255,255,255,0.1); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.9); font-size:0.8rem; font-weight:700; margin-bottom:2rem; letter-spacing:0.03em; }
        .lp-hero-title { font-size:clamp(2.8rem,7vw,6rem); font-weight:900; color:#fff; letter-spacing:-0.04em; line-height:1.05; margin-bottom:1.5rem; text-shadow:0 4px 32px rgba(0,0,0,0.4); }
        .lp-hero-grad { background:linear-gradient(90deg,#a78bfa,#818cf8,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .lp-hero-sub { font-size:1.1rem; color:rgba(255,255,255,0.65); line-height:1.7; max-width:600px; margin:0 auto 2.5rem; }
        .lp-hero-cta { display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3rem; }
        .lp-cta-primary { display:inline-flex; align-items:center; gap:0.5rem; padding:1rem 2rem; background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; font-weight:800; font-size:1rem; border-radius:14px; text-decoration:none; box-shadow:0 16px 36px rgba(99,102,241,0.45); transition:transform 0.2s,box-shadow 0.2s; }
        .lp-cta-primary:hover { transform:translateY(-2px); box-shadow:0 24px 48px rgba(99,102,241,0.55); }
        .lp-cta-secondary { color:rgba(255,255,255,0.7); font-weight:600; font-size:0.95rem; text-decoration:none; padding:0.5rem; border-bottom:1px solid rgba(255,255,255,0.3); transition:color 0.2s; }
        .lp-cta-secondary:hover { color:#fff; }
        .lp-scroll-hint { display:flex; flex-direction:column; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.4); font-size:0.75rem; letter-spacing:0.06em; text-transform:uppercase; }

        /* ── 3D FRAME SECTIONS ────────────────────────── */
        .lp-frame-section { min-height:100vh; display:flex; align-items:center; padding:6rem 2rem; background:#fff; }
        .lp-frame-section:nth-child(even) { background:#fafafa; }
        .lp-frame-inner { max-width:1200px; margin:0 auto; width:100%; display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; perspective:1200px; }
        .lp-reverse { direction:rtl; }
        .lp-reverse > * { direction:ltr; }

        /* 3D Photo Frame */
        .lp-photo-frame-wrap { position:relative; }
        .lp-photo-frame {
          position:relative; border-radius:24px; overflow:hidden;
          box-shadow:-24px 24px 60px rgba(0,0,0,0.18), 0 2px 0 rgba(255,255,255,0.8) inset;
          aspect-ratio:4/3;
          border:1px solid rgba(0,0,0,0.06);
          transform-style:preserve-3d;
        }
        .lp-photo-frame img { width:100%; height:100%; object-fit:cover; display:block; }
        .lp-photo-overlay-grad { position:absolute; inset:0; background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.5) 100%); }
        .lp-frame-shadow { position:absolute; bottom:-20px; left:8%; right:8%; height:20px; background:radial-gradient(ellipse,rgba(0,0,0,0.2),transparent 70%); border-radius:50%; filter:blur(6px); }

        /* Badge on photo */
        .lp-photo-badge { position:absolute; bottom:1.25rem; left:1.25rem; background:rgba(255,255,255,0.12); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.25); border-radius:14px; padding:0.75rem 1rem; display:flex; align-items:center; gap:0.75rem; }
        .lp-badge-icon { width:36px; height:36px; border-radius:10px; background:color-mix(in srgb,var(--bc) 20%,rgba(255,255,255,0.1)); display:flex; align-items:center; justify-content:center; color:var(--bc); border:1px solid color-mix(in srgb,var(--bc) 35%,transparent); flex-shrink:0; }
        .lp-photo-badge strong { display:block; font-size:0.85rem; font-weight:800; color:#fff; }
        .lp-photo-badge span { font-size:0.7rem; color:rgba(255,255,255,0.65); }

        /* Text side */
        .lp-frame-text { display:flex; flex-direction:column; gap:1.5rem; }
        .lp-frame-tag { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:100px; background:color-mix(in srgb,var(--tc) 10%,#fff); border:1px solid color-mix(in srgb,var(--tc) 25%,transparent); color:var(--tc); font-size:0.78rem; font-weight:800; letter-spacing:0.04em; width:fit-content; }
        .lp-frame-headline { font-size:clamp(2rem,4vw,3.2rem); font-weight:900; color:#0f0f1a; letter-spacing:-0.03em; line-height:1.1; }
        .lp-frame-body { font-size:1rem; color:#6b7280; line-height:1.75; max-width:420px; }
        .lp-frame-number { display:flex; align-items:baseline; gap:0.75rem; }
        .lp-num { font-size:2.5rem; font-weight:900; letter-spacing:-0.03em; }
        .lp-num-label { font-size:0.85rem; color:#9ca3af; font-weight:600; }

        /* ── TRUST ─────────────────────────────────────── */
        .lp-trust-section { padding:7rem 2rem; background:linear-gradient(135deg,#0f0f1a,#1a1040); }
        .lp-trust-inner { max-width:1100px; margin:0 auto; }
        .lp-trust-heading { text-align:center; margin-bottom:4rem; }
        .lp-trust-heading h2 { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:#fff; letter-spacing:-0.03em; margin-bottom:1rem; }
        .lp-trust-heading p { color:rgba(255,255,255,0.5); font-size:1rem; max-width:480px; margin:0 auto; }
        .lp-trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .lp-trust-card { text-align:center; padding:2.5rem 1rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; }
        .lp-trust-card strong { display:block; font-size:2.75rem; font-weight:900; color:#fff; letter-spacing:-0.04em; margin-bottom:0.5rem; background:linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .lp-trust-card span { font-size:0.85rem; color:rgba(255,255,255,0.4); font-weight:600; }

        /* ── AUTH CTA ──────────────────────────────────── */
        .lp-auth-section { padding:8rem 2rem; background:#fff; display:flex; justify-content:center; }
        .lp-auth-card { max-width:720px; width:100%; text-align:center; padding:4rem; background:linear-gradient(135deg,#f8f7ff,#f0f4ff); border:1px solid #e0e7ff; border-radius:32px; box-shadow:0 32px 64px rgba(99,102,241,0.1); }
        .lp-auth-badge { display:inline-block; padding:6px 18px; border-radius:100px; background:#e0e7ff; color:#4f46e5; font-size:0.8rem; font-weight:800; margin-bottom:1.5rem; letter-spacing:0.03em; }
        .lp-auth-title { font-size:clamp(2rem,5vw,3.5rem); font-weight:900; color:#0f0f1a; letter-spacing:-0.03em; line-height:1.1; margin-bottom:1rem; }
        .lp-auth-sub { font-size:1rem; color:#6b7280; margin-bottom:2.5rem; line-height:1.6; }
        .lp-auth-buttons { display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
        .lp-auth-primary { display:inline-flex; align-items:center; gap:0.5rem; padding:1rem 2rem; background:linear-gradient(135deg,#4f46e5,#6366f1); color:#fff; font-weight:800; font-size:1rem; border-radius:14px; text-decoration:none; box-shadow:0 12px 28px rgba(99,102,241,0.4); transition:transform 0.2s; }
        .lp-auth-primary:hover { transform:translateY(-2px); }
        .lp-auth-ghost { color:#6366f1; font-weight:600; font-size:0.9rem; text-decoration:none; border-bottom:1px solid #c7d2fe; padding-bottom:1px; }
        .lp-auth-checks { display:flex; justify-content:center; flex-wrap:wrap; gap:1.25rem; }
        .lp-auth-checks span { display:flex; align-items:center; gap:6px; font-size:0.78rem; color:#9ca3af; font-weight:600; }
        .lp-auth-checks svg { color:#6366f1; }

        /* ── RESPONSIVE ────────────────────────────────── */
        @media(max-width:900px) {
          .lp-frame-inner { grid-template-columns:1fr; gap:3rem; }
          .lp-reverse { direction:ltr; }
          .lp-trust-grid { grid-template-columns:repeat(2,1fr); }
          .lp-auth-card { padding:2.5rem 1.5rem; }
        }
        @media(max-width:600px) {
          .lp-frame-section { padding:4rem 1.25rem; }
          .lp-trust-grid { grid-template-columns:1fr 1fr; gap:1rem; }
          .lp-hero-title { font-size:2.5rem; }
        }
      `}</style>
    </div>
  );
}
