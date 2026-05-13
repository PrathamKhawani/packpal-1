import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2 } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SYSTEM_PROMPT = `You are PackPal AI — a brilliant, concise travel logistics assistant embedded in the PackPal platform. PackPal is an enterprise trip-planning SaaS with modules for Itinerary, Checklists, Expenses, Risk Assessment, Members, and Vault. 
Answer questions about travel planning, packing, budgeting, destinations, logistics, or any PackPal feature. Be sharp, professional, and helpful. Keep responses concise and well-formatted. Use bullet points or short paragraphs. Never break character.`;

export default function GlobalChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm **PackPal AI** ✦\n\nI can help with travel planning, packing advice, budgeting, itineraries, and any PackPal feature. What do you need?" }
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [...history, { role: 'user', parts: [{ text }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
          })
        }
      );
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble responding right now. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please check your internet and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  // Render markdown-lite: bold, bullets
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const bullet = bold.startsWith('• ') || bold.startsWith('- ') ? `<span class="gc-bullet">•</span> ${bold.slice(2)}` : bold;
      return <p key={i} dangerouslySetInnerHTML={{ __html: bullet }} style={{ margin: '2px 0' }} />;
    });
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        className="gc-fab"
        onClick={() => { setOpen(true); setMinimized(false); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: open && !minimized ? 'none' : 'flex' }}
        aria-label="Open PackPal AI"
      >
        <div className="gc-fab-icon"><Sparkles size={20} /></div>
        <div className="gc-fab-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`gc-window ${minimized ? 'gc-minimized' : ''}`}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="gc-header">
              <div className="gc-header-left">
                <div className="gc-avatar"><Bot size={16} /></div>
                <div>
                  <div className="gc-name">PackPal AI</div>
                  <div className="gc-status"><span className="gc-dot" />Always Active</div>
                </div>
              </div>
              <div className="gc-header-actions">
                <button className="gc-action-btn" onClick={() => setMinimized(!minimized)} title="Minimize">
                  <Minimize2 size={14} />
                </button>
                <button className="gc-action-btn" onClick={() => setOpen(false)} title="Close">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            {!minimized && (
              <>
                <div className="gc-body">
                  {messages.map((m, i) => (
                    <div key={i} className={`gc-msg gc-msg-${m.role}`}>
                      {m.role === 'bot' && <div className="gc-msg-avatar"><Bot size={13} /></div>}
                      <div className="gc-bubble">{renderText(m.text)}</div>
                      {m.role === 'user' && <div className="gc-msg-avatar gc-user-avatar"><User size={13} /></div>}
                    </div>
                  ))}
                  {loading && (
                    <div className="gc-msg gc-msg-bot">
                      <div className="gc-msg-avatar"><Bot size={13} /></div>
                      <div className="gc-bubble gc-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length === 1 && (
                  <div className="gc-quick">
                    {['Pack list for mountains', 'Budget tips for Europe', 'Best travel insurance'].map(q => (
                      <button key={q} className="gc-quick-btn" onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="gc-footer">
                  <input
                    ref={inputRef}
                    className="gc-input"
                    placeholder="Ask anything about travel or PackPal..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                    disabled={loading}
                  />
                  <button className="gc-send" onClick={send} disabled={loading || !input.trim()}>
                    {loading ? <Loader2 size={16} className="gc-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gc-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9000;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(99,102,241,0.45);
          position: fixed;
        }
        .gc-fab-icon { color: white; display: flex; }
        .gc-fab-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.4);
          animation: gc-pulse 2s infinite;
        }
        @keyframes gc-pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 0; } }

        .gc-window {
          position: fixed;
          bottom: 5.5rem;
          right: 2rem;
          z-index: 9001;
          width: 370px;
          max-height: calc(100vh - 120px);
          background: hsl(var(--bg-card, 0 0% 100%));
          border: 1px solid hsl(var(--border, 220 13% 91%));
          border-radius: 20px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .gc-minimized { max-height: auto; }

        .gc-header {
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .gc-header-left { display: flex; align-items: center; gap: 0.625rem; }
        .gc-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .gc-name { font-size: 0.875rem; font-weight: 700; color: white; }
        .gc-status { display: flex; align-items: center; gap: 0.35rem; font-size: 0.7rem; color: rgba(255,255,255,0.75); }
        .gc-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; display: inline-block; }
        .gc-header-actions { display: flex; gap: 0.25rem; }
        .gc-action-btn {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.15); border: none;
          color: white; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .gc-action-btn:hover { background: rgba(255,255,255,0.25); }

        .gc-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-height: 280px;
          max-height: 380px;
        }
        .gc-body::-webkit-scrollbar { width: 4px; }
        .gc-body::-webkit-scrollbar-thumb { background: hsl(var(--border,220 13% 91%)); border-radius: 2px; }

        .gc-msg { display: flex; gap: 0.5rem; align-items: flex-end; }
        .gc-msg-bot { flex-direction: row; }
        .gc-msg-user { flex-direction: row-reverse; }
        .gc-msg-avatar {
          width: 26px; height: 26px; border-radius: 8px;
          background: hsl(var(--bg, 0 0% 98%));
          border: 1px solid hsl(var(--border, 220 13% 91%));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: hsl(var(--text-muted, 220 9% 46%));
        }
        .gc-user-avatar { background: #6366f1; border-color: #6366f1; color: white; }

        .gc-bubble {
          max-width: 82%;
          padding: 0.625rem 0.875rem;
          border-radius: 14px;
          font-size: 0.8125rem;
          line-height: 1.55;
          color: hsl(var(--text, 220 9% 15%));
        }
        .gc-msg-bot .gc-bubble {
          background: hsl(var(--bg, 0 0% 98%));
          border: 1px solid hsl(var(--border, 220 13% 91%));
          border-bottom-left-radius: 4px;
        }
        .gc-msg-user .gc-bubble {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .gc-bubble p { margin: 2px 0; }
        .gc-bullet { color: #6366f1; font-weight: 700; }
        .gc-msg-user .gc-bubble .gc-bullet { color: rgba(255,255,255,0.8); }

        .gc-typing { display: flex; gap: 5px; align-items: center; padding: 0.75rem 1rem; }
        .gc-typing span {
          width: 7px; height: 7px; border-radius: 50%;
          background: hsl(var(--text-muted, 220 9% 46%));
          animation: gc-bounce 1.2s infinite;
        }
        .gc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .gc-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes gc-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }

        .gc-quick { padding: 0 1rem 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .gc-quick-btn {
          font-size: 0.7rem; font-weight: 600;
          padding: 0.375rem 0.75rem;
          border-radius: 100px;
          border: 1px solid hsl(var(--border, 220 13% 91%));
          background: hsl(var(--bg, 0 0% 98%));
          color: hsl(var(--text-muted, 220 9% 46%));
          cursor: pointer;
          transition: all 0.2s;
        }
        .gc-quick-btn:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.05); }

        .gc-footer {
          padding: 0.75rem;
          border-top: 1px solid hsl(var(--border, 220 13% 91%));
          display: flex;
          gap: 0.5rem;
          background: hsl(var(--bg-card, 0 0% 100%));
          flex-shrink: 0;
        }
        .gc-input {
          flex: 1;
          padding: 0.625rem 0.875rem;
          border-radius: 12px;
          border: 1px solid hsl(var(--border, 220 13% 91%));
          background: hsl(var(--bg, 0 0% 98%));
          color: hsl(var(--text, 220 9% 15%));
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .gc-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .gc-input::placeholder { color: hsl(var(--text-muted, 220 9% 46%)); }
        .gc-send {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .gc-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .gc-spin { animation: gc-rotate 1s linear infinite; }
        @keyframes gc-rotate { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .gc-window { width: calc(100vw - 2rem); right: 1rem; bottom: 5rem; }
          .gc-fab { right: 1rem; bottom: 1.5rem; }
        }
      `}</style>
    </>
  );
}
