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
    <div className="expenses-page-compact">
      <header className="expenses-header-compact glass">
        <div className="header-info">
          <h2>Expenses</h2>
          <p>Total: <strong>₹{totalSpent.toLocaleString()}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn-ico" onClick={() => setShowAddModal(true)}><Plus size={16} /></button>
        </div>
      </header>

      <div className="summary-compact glass">
        <div className="s-track"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalSpent/budget)*100, 100)}%` }} className="s-fill" /></div>
        <div className="s-labels">
          <div className="s-lab"><span>Spent</span><strong>₹{totalSpent.toLocaleString()}</strong></div>
          <div className="s-lab"><span>Left</span><strong>₹{Math.max(budget-totalSpent,0).toLocaleString()}</strong></div>
          <div className="s-lab"><span>Cap</span><strong>₹{budget.toLocaleString()}</strong></div>
        </div>
      </div>

      <div className="search-row-compact glass">
        <Search size={12} />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search expenses..." />
      </div>

      <div className="expenses-grid-ultra">
        <AnimatePresence>
          {filteredExpenses.map((exp, idx) => (
            <motion.div 
              key={exp.id} 
              className="expense-card-ultra glass"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div className="e-top">
                <span className="e-cat">{exp.category}</span>
                <button className="e-del" onClick={() => deleteExpense(exp.id)}><Trash2 size={12} /></button>
              </div>
              <div className="e-mid">
                <h5>{exp.description}</h5>
                <h3>₹{parseFloat(exp.amount).toLocaleString()}</h3>
              </div>
              <div className="e-foot">
                <span>{exp.paid_by || exp.payer}</span>
                <span>{new Date(exp.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay-compact" onClick={() => setShowAddModal(false)}>
            <motion.div className="modal-box-compact glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={e => e.stopPropagation()}>
              <h3>New Expense</h3>
              <form onSubmit={handleAdd}>
                <input placeholder="Description" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} required />
                <div className="row">
                    <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                    <select value={newExpense.payer} onChange={e => setNewExpense({...newExpense, payer: e.target.value})}>
                      {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                <div className="modal-btns">
                    <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button type="submit" className="primary">Add</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .expenses-page-compact { display: flex; flex-direction: column; gap: 0.75rem; }
        .expenses-header-compact { padding: 0.75rem 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .expenses-header-compact h2 { font-size: 1.1rem; color: hsl(var(--p)); }
        .expenses-header-compact p { font-size: 0.75rem; }
        
        .summary-compact { padding: 0.75rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem; }
        .s-track { height: 4px; background: hsla(var(--text) / 0.05); border-radius: 2px; overflow: hidden; }
        .s-fill { height: 100%; background: hsl(var(--p)); }
        .s-labels { display: flex; justify-content: space-between; }
        .s-lab { display: flex; flex-direction: column; }
        .s-lab span { font-size: 0.55rem; color: hsl(var(--text-muted)); font-weight: 800; text-transform: uppercase; }
        .s-lab strong { font-size: 0.8125rem; }

        .search-row-compact { display: flex; align-items: center; gap: 8px; padding: 0.5rem 0.75rem; border-radius: 10px; }
        .search-row-compact input { border: none; background: none; font-size: 0.75rem; color: inherit; outline: none; flex: 1; }

        .expenses-grid-ultra { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
        .expense-card-ultra { padding: 0.875rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem; }
        .e-top { display: flex; justify-content: space-between; }
        .e-cat { font-size: 0.55rem; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); }
        .e-del { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; }
        .e-del:hover { color: hsl(var(--danger)); }
        .e-mid h5 { font-size: 0.75rem; color: hsl(var(--text-muted)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .e-mid h3 { font-size: 1.1rem; font-weight: 800; margin-top: 2px; }
        .e-foot { display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: 700; color: hsla(var(--text-muted) / 0.8); margin-top: 0.25rem; border-top: 1px solid hsla(var(--border) / 0.5); padding-top: 0.5rem; }

        .modal-box-compact .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
