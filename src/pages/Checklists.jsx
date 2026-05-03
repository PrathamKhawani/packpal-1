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
    <div className="checklists-page-compact">
      <header className="checklists-header-compact glass">
        <div className="header-info">
          <h2>Checklist</h2>
          <p>{items.filter(i => i.status === 'packed').length}/{items.length} packed</p>
        </div>
        <div className="header-actions">
          <button className="btn-add-ico" onClick={() => setShowAddModal(true)}><Plus size={16} /></button>
        </div>
      </header>

      <div className="search-row-compact glass">
        <Search size={12} />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search items..." />
      </div>

      <div className="items-list-compact glass">
        <div className="list-head">
            <span className="col-status">ST</span>
            <span className="col-name">ITEM</span>
            <span className="col-cat">CAT</span>
            <span className="col-user">WHO</span>
            <span className="col-act"></span>
        </div>
        <div className="list-body">
            {filteredItems.map((item, idx) => {
                const cat = categories.find(c => c.id === item.category)?.name || 'Other';
                const mbr = members.find(m => m.id === item.assignedTo)?.name || '...';
                return (
                    <motion.div key={item.id} className={`list-row ${item.status === 'packed' ? 'packed' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="col-status">
                            <button className={`check-btn-sm ${item.status === 'packed' ? 'checked' : ''}`} onClick={() => updateItemStatus(item.id, item.status === 'pending' ? 'packed' : 'pending')}>
                                {item.status === 'packed' && <Check size={10} />}
                            </button>
                        </div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-cat"><span className="badge-sm">{cat}</span></div>
                        <div className="col-user"><div className="avatar-xs">{mbr[0]}</div></div>
                        <div className="col-act">
                            <button className="row-btn del" onClick={() => deleteItem(item.id)}><Trash2 size={10} /></button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay-compact" onClick={() => setShowAddModal(false)}>
            <motion.div className="modal-box-compact glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={e => e.stopPropagation()}>
              <h3>Add Item</h3>
              <form onSubmit={handleAdd}>
                <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <div className="row">
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={newItem.assignedTo} onChange={e => setNewItem({...newItem, assignedTo: e.target.value})}>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
        .checklists-page-compact { display: flex; flex-direction: column; gap: 0.75rem; }
        .checklists-header-compact { padding: 0.75rem 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .checklists-header-compact h2 { font-size: 1.1rem; color: hsl(var(--p)); }
        .checklists-header-compact p { font-size: 0.75rem; }

        .items-list-compact { border-radius: 12px; overflow: hidden; }
        .list-head { display: flex; padding: 0.6rem 1rem; background: hsla(var(--text) / 0.03); border-bottom: 1px solid hsla(var(--border) / 0.5); font-size: 0.55rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .list-row { display: flex; padding: 0.5rem 1rem; border-bottom: 1px solid hsla(var(--border) / 0.3); align-items: center; transition: 0.2s; }
        .list-row:hover { background: hsla(var(--text) / 0.02); }
        .list-row.packed { opacity: 0.5; }
        .list-row.packed .col-name { text-decoration: line-through; }

        .col-status { width: 30px; }
        .col-name { flex: 1; font-size: 0.8125rem; font-weight: 600; }
        .col-cat { width: 80px; }
        .col-user { width: 40px; display: flex; justify-content: center; }
        .col-act { width: 40px; display: flex; justify-content: flex-end; }

        .check-btn-sm { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid hsla(var(--border) / 0.8); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; }
        .check-btn-sm.checked { background: hsl(var(--success)); border-color: hsl(var(--success)); }
        
        .badge-sm { font-size: 0.55rem; font-weight: 800; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); padding: 1px 6px; border-radius: 4px; text-transform: uppercase; }
        .avatar-xs { width: 20px; height: 20px; border-radius: 50%; background: hsla(var(--p) / 0.15); color: hsl(var(--p)); font-size: 0.6rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
        
        .row-btn { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; opacity: 0; transition: 0.2s; }
        .list-row:hover .row-btn { opacity: 1; }
        .row-btn.del:hover { color: hsl(var(--danger)); }

        .modal-box-compact .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
