import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, CheckCircle2, Circle, X, 
  Filter, Search, Download, ChevronDown, Check, Tag
} from 'lucide-react';

export default function Checklists() {
  const { items, categories, members, addItem, deleteItem, updateItemStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: 'all', assignedTo: 'me' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;
    await addItem(newItem);
    setNewItem({ name: '', category: 'all', assignedTo: 'me' });
    setShowAddModal(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="checklists-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header-compact">
        <div className="header-info">
          <h2 className="section-title">Packing Checklist</h2>
          <p className="section-subtitle">{items.length} items total • {items.filter(i => i.status === 'packed').length} packed</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      <div className="table-controls glass">
        <div className="search-box-compact">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="filter-btn"><Filter size={14} /> Filter</button>
          <button className="filter-btn">Category <ChevronDown size={14} /></button>
        </div>
      </div>

      <div className="card glass no-padding overflow-hidden">
        <table className="compact-table">
          <thead>
            <tr>
              <th width="40">Status</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th className="text-right" width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const cat = categories.find(c => c.id === item.category)?.name || 'Other';
                const mbr = members.find(m => m.id === item.assignedTo)?.name || 'Unassigned';
                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={item.status === 'packed' ? 'row-packed' : ''}
                  >
                    <td>
                      <button 
                        className={`check-btn ${item.status === 'packed' ? 'checked' : ''}`}
                        onClick={() => updateItemStatus(item.id, item.status === 'pending' ? 'packed' : 'pending')}
                      >
                        {item.status === 'packed' && <Check size={12} />}
                      </button>
                    </td>
                    <td className="item-name-cell">
                      <span className="item-text">{item.name}</span>
                    </td>
                    <td>
                      <span className="badge badge-category">
                        <Tag size={10} /> {cat}
                      </span>
                    </td>
                    <td>
                      <div className="assignee-cell">
                        <div className="avatar-xs">{mbr.charAt(0)}</div>
                        <span>{mbr}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="row-actions">
                        <button className="action-icon-btn"><Edit2 size={14} /></button>
                        <button className="action-icon-btn delete" onClick={() => deleteItem(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
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
                <h3>Add New Item</h3>
                <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd} className="modal-form">
                <div className="input-group">
                  <label>Item Name</label>
                  <input 
                    autoFocus
                    placeholder="e.g. Hiking Boots"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="modal-row">
                  <div className="input-group">
                    <label>Category</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Assign To</label>
                    <select value={newItem.assignedTo} onChange={e => setNewItem({...newItem, assignedTo: e.target.value})}>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .checklists-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-compact { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-title { font-size: 1.75rem; font-weight: 800; }
        .section-subtitle { font-size: 0.8125rem; color: hsl(var(--text-muted)); font-weight: 600; }
        
        .table-controls { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: 12px; }
        .search-box-compact { display: flex; align-items: center; gap: 0.75rem; color: hsl(var(--text-muted)); flex: 1; max-width: 400px; }
        .search-box-compact input { border: none; background: transparent; outline: none; font-size: 0.875rem; width: 100%; color: hsl(var(--text)); }
        .filter-group { display: flex; gap: 0.5rem; }
        .filter-btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { background: hsla(var(--p) / 0.05); }

        .compact-table { width: 100%; border-collapse: collapse; text-align: left; }
        .compact-table th { padding: 1rem; font-size: 0.75rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid hsla(var(--border) / 0.5); }
        .compact-table td { padding: 0.75rem 1rem; font-size: 0.875rem; border-bottom: 1px solid hsla(var(--border) / 0.3); }
        .row-packed { background: hsla(var(--success) / 0.02); }
        .row-packed .item-text { text-decoration: line-through; opacity: 0.5; }

        .check-btn { width: 22px; height: 22px; border-radius: 6px; border: 2px solid hsl(var(--border)); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: white; }
        .check-btn.checked { background: hsl(var(--success)); border-color: hsl(var(--success)); }
        
        .badge-category { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); }
        
        .assignee-cell { display: flex; align-items: center; gap: 0.625rem; }
        .avatar-xs { width: 22px; height: 22px; border-radius: 50%; background: hsl(var(--p)); color: white; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }

        .row-actions { display: flex; gap: 0.25rem; opacity: 0; transition: 0.2s; justify-content: flex-end; }
        tr:hover .row-actions { opacity: 1; }
        .action-icon-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; }
        .action-icon-btn:hover { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }
        .action-icon-btn.delete:hover { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); }

        .modal-overlay { position: fixed; inset: 0; background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .text-right { text-align: right; }
      `}</style>
    </motion.div>
  );
}
