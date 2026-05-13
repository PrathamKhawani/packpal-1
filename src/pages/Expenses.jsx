import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Wallet, Calendar, User, X, 
  IndianRupee, Search, Filter, Download, Tag, TrendingUp
} from 'lucide-react';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, currentUser, members, tripConfig } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'food', payer: currentUser?.username || 'me' });

  const totalSpent = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const budget = tripConfig.budget || 50000;
  
  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    await addExpense(newExpense);
    setNewExpense({ description: '', amount: '', category: 'food', payer: currentUser?.username || 'me' });
    setShowAddModal(false);
  };

  return (
    <div className="expenses-container">
      <header className="expenses-hero glass">
        <div className="hero-left">
          <div className="hero-badge">FINANCIAL INTELLIGENCE</div>
          <h1>Mission Budget</h1>
          <p>Real-time burn rate and resource allocation tracking.</p>
        </div>
        <div className="hero-metrics">
          <div className="h-stat">
            <span>TOTAL BUDGET</span>
            <strong>₹{budget.toLocaleString()}</strong>
          </div>
          <div className="h-stat">
            <span>NET SPEND</span>
            <strong className="text-p">₹{totalSpent.toLocaleString()}</strong>
          </div>
        </div>
      </header>

      <div className="expenses-main">
        {/* Left Side: Ledger */}
        <div className="ledger-section">
          <div className="ledger-toolbar glass">
            <div className="search-box">
              <Search size={16} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search transactions..." />
            </div>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              <span>LOG EXPENSE</span>
            </button>
          </div>

          <div className="expense-grid">
            <AnimatePresence>
              {filteredExpenses.map((exp, idx) => (
                <motion.div 
                  key={exp.id} 
                  className="expense-card glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <div className="card-top">
                    <div className="cat-chip">{exp.category}</div>
                    <button className="del-btn" onClick={() => deleteExpense(exp.id)}><Trash2 size={14} /></button>
                  </div>
                  <div className="card-body">
                    <p className="exp-desc">{exp.description}</p>
                    <h3 className="exp-amt">₹{parseFloat(exp.amount).toLocaleString()}</h3>
                  </div>
                  <div className="card-foot">
                    <div className="payer">
                      <User size={12} />
                      <span>{exp.paid_by || exp.payer}</span>
                    </div>
                    <span className="date">{new Date(exp.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Analytics */}
        <div className="analytics-sidebar">
          <motion.div className="bento-card glass utilization-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card-head"><h3>BUDGET UTILIZATION</h3></div>
            <div className="util-viz">
              <div className="util-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsla(var(--border), 0.5)" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--p))" strokeWidth="8" strokeDasharray="283" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (Math.min(totalSpent/budget, 1) * 283) }} transition={{ duration: 1 }} strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div className="util-label">
                  <strong>{Math.round((totalSpent/budget)*100)}%</strong>
                  <span>SPENT</span>
                </div>
              </div>
            </div>
            <div className="util-footer">
              <div className="u-item"><span>REMAINING</span><strong>₹{Math.max(budget - totalSpent, 0).toLocaleString()}</strong></div>
            </div>
          </motion.div>

          <motion.div className="bento-card glass categories-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="card-head"><h3>DISTRIBUTION</h3></div>
            <div className="cat-list">
              {['food', 'travel', 'stay', 'misc'].map(cat => {
                const catTotal = expenses.filter(e => e.category === cat).reduce((a, b) => a + parseFloat(b.amount), 0);
                return (
                  <div key={cat} className="cat-row">
                    <div className="cat-label">
                      <Tag size={12} />
                      <span>{cat.toUpperCase()}</span>
                    </div>
                    <strong>₹{catTotal.toLocaleString()}</strong>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div className="modal-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={e => e.stopPropagation()}>
              <div className="m-head">
                <h2>New Transaction</h2>
                <button onClick={() => setShowAddModal(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="input-group">
                  <label>DESCRIPTION</label>
                  <input autoFocus placeholder="e.g. Dinner at Beach House" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} required />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>AMOUNT (₹)</label>
                    <input type="number" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>PAYER</label>
                    <select value={newExpense.payer} onChange={e => setNewExpense({...newExpense, payer: e.target.value})}>
                      {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>CATEGORY</label>
                  <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="food">Food & Beverage</option>
                    <option value="travel">Transport</option>
                    <option value="stay">Accommodation</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
                <button type="submit" className="m-submit-btn">LOG TRANSACTION</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .expenses-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        
        /* Hero */
        .expenses-hero {
          padding: 3rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center;
          background: linear-gradient(135deg, hsla(var(--p)/.1) 0%, transparent 50%);
        }
        .hero-left h1 { font-size: 2.5rem; font-weight: 900; margin: 0.5rem 0; letter-spacing: -0.03em; }
        .hero-left p { font-size: 1rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .hero-badge { font-size: 0.6rem; font-weight: 800; color: hsl(var(--p)); background: hsla(var(--p)/.1); padding: 4px 12px; border-radius: 100px; border: 1px solid hsla(var(--p)/.2); width: fit-content; }
        .hero-metrics { display: flex; gap: 4rem; }
        .h-stat { display: flex; flex-direction: column; gap: 4px; }
        .h-stat span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .h-stat strong { font-size: 1.75rem; font-weight: 800; }

        /* Main Layout */
        .expenses-main { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        
        /* Ledger Section */
        .ledger-section { display: flex; flex-direction: column; gap: 1.5rem; }
        .ledger-toolbar { padding: 1rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; }
        .search-box { display: flex; align-items: center; gap: 10px; background: hsla(var(--bg), 0.5); border: 1px solid hsla(var(--border), 0.5); padding: 0.75rem 1.25rem; border-radius: 12px; flex: 1; margin-right: 1.5rem; }
        .search-box input { border: none; background: none; color: inherit; font-size: 0.9rem; outline: none; width: 100%; }
        .add-btn { background: hsl(var(--p)); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px hsla(var(--p)/.2); }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px hsla(var(--p)/.3); }

        .expense-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .expense-card { padding: 1.5rem; border-radius: 20px; display: flex; flex-direction: column; gap: 1.25rem; transition: 0.2s; }
        .expense-card:hover { transform: translateY(-4px); border-color: hsl(var(--p)); }
        
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .cat-chip { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: hsl(var(--p)); background: hsla(var(--p)/.1); padding: 4px 10px; border-radius: 100px; }
        .del-btn { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; }
        .del-btn:hover { color: hsl(var(--danger)); }
        
        .exp-desc { font-size: 0.85rem; font-weight: 600; color: hsl(var(--text-muted)); margin: 0; }
        .exp-amt { font-size: 1.5rem; font-weight: 800; margin: 0; }
        
        .card-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid hsla(var(--border), 0.5); }
        .payer { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 700; color: hsl(var(--text-muted)); }
        .date { font-size: 0.7rem; font-weight: 700; color: hsl(var(--text-muted)); }

        /* Sidebar */
        .analytics-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .bento-card { padding: 1.5rem; border-radius: 20px; }
        .card-head h3 { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; margin: 0 0 1.5rem 0; }
        
        .util-ring { position: relative; width: 160px; height: 160px; margin: 0 auto; }
        .util-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .util-label strong { font-size: 2rem; font-weight: 900; }
        .util-label span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); }
        
        .util-footer { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid hsla(var(--border), 0.5); }
        .u-item { display: flex; flex-direction: column; gap: 2px; }
        .u-item span { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); }
        .u-item strong { font-size: 1.25rem; font-weight: 800; color: hsl(var(--success)); }

        .cat-list { display: flex; flex-direction: column; gap: 1rem; }
        .cat-row { display: flex; justify-content: space-between; align-items: center; }
        .cat-label { display: flex; align-items: center; gap: 10px; font-size: 0.7rem; font-weight: 800; }

        /* Modal Overrides */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-panel { width: 100%; max-width: 480px; padding: 3rem; border-radius: 32px; background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); box-shadow: 0 24px 50px rgba(0,0,0,0.2); }
        .m-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-head h2 { font-size: 1.5rem; font-weight: 900; margin: 0; }
        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
        .input-group label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .input-group input, .input-group select { padding: 1rem; border: 1px solid hsla(var(--border), 0.5); border-radius: 12px; background: hsla(var(--bg), 0.5); color: inherit; font-size: 1rem; outline: none; }
        .input-group input:focus { border-color: hsl(var(--p)); }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .m-submit-btn { width: 100%; padding: 1.25rem; background: hsl(var(--p)); color: white; border: none; border-radius: 16px; font-weight: 900; font-size: 0.9rem; cursor: pointer; margin-top: 1rem; }

        @media (max-width: 900px) {
          .expenses-main { grid-template-columns: 1fr; }
          .hero-metrics { gap: 2rem; }
        }
        @media (max-width: 640px) {
          .expenses-hero { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 2rem 1.5rem; }
          .hero-left h1 { font-size: 2rem; }
          .hero-metrics { width: 100%; justify-content: space-between; gap: 1rem; }
          .h-stat strong { font-size: 1.25rem; }
          .ledger-toolbar { flex-direction: column; gap: 1rem; align-items: stretch; padding: 0.75rem; }
          .search-box { margin-right: 0; padding: 0.6rem 1rem; }
          .expense-grid { grid-template-columns: 1fr; }
          .input-row { grid-template-columns: 1fr; gap: 0; }
          .modal-panel { padding: 2rem 1.5rem; border-radius: 20px; }
        }
      `}</style>
    </div>
  );
}
