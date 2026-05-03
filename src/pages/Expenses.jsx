import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Wallet, Calendar, User, X, 
  IndianRupee, Search, Filter, Download, Tag, TrendingUp
} from 'lucide-react';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, currentUser, members } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'food', payer: currentUser?.username || 'me' });

  const totalSpent = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const budget = 50000;
  
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
    <motion.div 
      className="expenses-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header-compact">
        <div className="header-info">
          <h2 className="section-title">Trip Expenses</h2>
          <p className="section-subtitle">Total Spent: <strong>₹{totalSpent.toLocaleString()}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </header>

      {/* Summary Bar */}
      <div className="summary-bar-compact glass">
        <div className="s-item">
          <span className="s-label">Total Budget</span>
          <span className="s-value">₹{budget.toLocaleString()}</span>
        </div>
        <div className="s-divider" />
        <div className="s-item">
          <span className="s-label">Spent</span>
          <span className="s-value danger">₹{totalSpent.toLocaleString()}</span>
        </div>
        <div className="s-divider" />
        <div className="s-item">
          <span className="s-label">Remaining</span>
          <span className="s-value success">₹{(budget - totalSpent).toLocaleString()}</span>
        </div>
        <div className="s-chart">
          <div className="s-progress-track">
            <motion.div 
              className="s-progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent/budget)*100, 100)}%` }}
              style={{ backgroundColor: totalSpent > budget ? 'hsl(var(--danger))' : 'hsl(var(--p))' }}
            />
          </div>
        </div>
      </div>

      <div className="table-controls glass">
        <div className="search-box-compact">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><Filter size={14} /> Filter</button>
      </div>

      <div className="expenses-grid-compact">
        <AnimatePresence>
          {filteredExpenses.map((exp, idx) => (
            <motion.div 
              key={exp.id} 
              className="expense-card-compact glass"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="e-card-top">
                <span className="e-category">
                  <Tag size={10} /> {exp.category || 'Food'}
                </span>
                <button className="e-delete" onClick={() => deleteExpense(exp.id)}><Trash2 size={12} /></button>
              </div>
              <div className="e-card-mid">
                <p className="e-desc">{exp.description}</p>
                <h3 className="e-amount">₹{parseFloat(exp.amount).toLocaleString()}</h3>
              </div>
              <div className="e-card-bottom">
                <div className="e-meta"><User size={12} /> {exp.paid_by || exp.payer}</div>
                <div className="e-meta"><Calendar size={12} /> {new Date(exp.created_at || Date.now()).toLocaleDateString()}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div 
              className="modal-content card glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Add New Expense</h3>
                <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd} className="modal-form">
                <div className="input-group">
                  <label>Description</label>
                  <input 
                    autoFocus
                    required
                    placeholder="e.g. Flight Tickets"
                    value={newExpense.description}
                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>
                <div className="modal-row">
                  <div className="input-group">
                    <label>Amount (₹)</label>
                    <input 
                      type="number"
                      required
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Paid By</label>
                    <select value={newExpense.payer} onChange={e => setNewExpense({...newExpense, payer: e.target.value})}>
                      {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Expense</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .expenses-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-compact { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-title { font-size: 1.75rem; font-weight: 800; }
        .section-subtitle { font-size: 0.8125rem; color: hsl(var(--text-muted)); font-weight: 600; }

        .summary-bar-compact { display: flex; align-items: center; padding: 1rem 1.5rem; border-radius: 14px; gap: 2rem; }
        .s-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .s-label { font-size: 0.65rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        .s-value { font-size: 1.125rem; font-weight: 800; }
        .s-value.danger { color: hsl(var(--danger)); }
        .s-value.success { color: hsl(var(--success)); }
        .s-divider { width: 1px; height: 24px; background: hsla(var(--border) / 0.5); }
        .s-chart { flex: 1; display: flex; align-items: center; }
        .s-progress-track { height: 6px; background: hsla(var(--text) / 0.05); border-radius: 3px; flex: 1; overflow: hidden; }
        .s-progress-fill { height: 100%; border-radius: 3px; }

        .expenses-grid-compact { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .expense-card-compact { padding: 1rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.75rem; transition: 0.2s; }
        .expense-card-compact:hover { transform: translateY(-2px); border-color: hsla(var(--p) / 0.3); }
        .e-card-top { display: flex; justify-content: space-between; align-items: center; }
        .e-category { font-size: 0.65rem; font-weight: 800; color: hsl(var(--p)); background: hsla(var(--p) / 0.1); padding: 2px 6px; border-radius: 4px; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
        .e-delete { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; opacity: 0; transition: 0.2s; }
        .expense-card-compact:hover .e-delete { opacity: 1; }
        .e-delete:hover { color: hsl(var(--danger)); }
        .e-desc { font-size: 0.8125rem; font-weight: 600; color: hsl(var(--text-muted)); }
        .e-amount { font-size: 1.25rem; font-weight: 800; margin-top: 0.25rem; }
        .e-card-bottom { display: flex; justify-content: space-between; font-size: 0.65rem; font-weight: 600; color: hsl(var(--text-muted)); border-top: 1px solid hsla(var(--border) / 0.5); padding-top: 0.75rem; }
        .e-meta { display: flex; align-items: center; gap: 4px; }

        .table-controls { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: 12px; }
        .search-box-compact { display: flex; align-items: center; gap: 0.75rem; color: hsl(var(--text-muted)); flex: 1; max-width: 400px; }
        .search-box-compact input { border: none; background: transparent; outline: none; font-size: 0.875rem; width: 100%; color: hsl(var(--text)); }
        .filter-btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { background: hsla(var(--p) / 0.05); }

        .modal-overlay { position: fixed; inset: 0; background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
      `}</style>
    </motion.div>
  );
}
