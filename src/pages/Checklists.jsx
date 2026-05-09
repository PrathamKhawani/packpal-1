import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Check, Search, Tag, 
  ChevronRight, LayoutGrid, 
  List, Package, Filter, AlertCircle,
  User as UserIcon, Calendar, CheckSquare,
  ChevronDown, X, Info, Shield, Zap, Sparkles,
  BarChart3, Activity, Layers, Target
} from 'lucide-react';

export default function Checklists() {
  const { 
    items, categories, members, addItem, 
    deleteItem, updateItemStatus, currentUser 
  } = useApp();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'list'
  const [filterCat, setFilterCat] = useState('all');
  const [newItem, setNewItem] = useState({ name: '', category: 'clothing', assignedTo: currentUser?.username || 'me' });

  // Statistics
  const totalItems = items.length;
  const packedItems = items.filter(i => i.status === 'packed').length;
  const progressPct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCat === 'all' || item.category === filterCat;
      return matchesSearch && matchesCat;
    });
  }, [items, searchTerm, filterCat]);

  const groupedItems = useMemo(() => {
    const groups = {};
    categories.forEach(cat => {
      const catItems = filteredItems.filter(i => i.category === cat.id);
      if (catItems.length > 0 || filterCat === 'all') {
        groups[cat.id] = {
          ...cat,
          items: catItems,
          packed: catItems.filter(i => i.status === 'packed').length,
          total: catItems.length
        };
      }
    });
    return Object.values(groups);
  }, [filteredItems, categories, filterCat]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    await addItem(newItem);
    setNewItem({ name: '', category: 'clothing', assignedTo: currentUser?.username || 'me' });
    setShowAddModal(false);
  };

  return (
    <div className="v3-mission-container">
      {/* Tactical Hub Header */}
      <header className="v3-mission-header">
        <div className="header-top-row">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mission-badge"
          >
            <Activity size={14} />
            <span>MISSION LIVE</span>
            <div className="pulse-dot" />
          </motion.div>
          
          <div className="header-actions">
             <button className="v3-btn-icon glass" title="Global Stats"><BarChart3 size={18} /></button>
             <button className="v3-btn-icon glass" title="Team Filter"><UserIcon size={18} /></button>
          </div>
        </div>

        <div className="header-main-grid">
          <div className="mission-info">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mission-title"
            >
              Inventory <span className="text-glow">Locker</span>
            </motion.h1>
            <p className="mission-desc">Strategic asset management and deployment verification.</p>
          </div>

          <div className="mission-stats-hub glass">
            <div className="hub-stat">
              <span className="hub-label">COMPLETION</span>
              <span className="hub-value">{progressPct}%</span>
              <div className="hub-progress">
                <motion.div 
                  className="hub-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="hub-divider" />
            <div className="hub-stat">
              <span className="hub-label">SYNCED ASSETS</span>
              <span className="hub-value">{packedItems} / {totalItems}</span>
              <div className="hub-icons">
                 <Shield size={14} className="icon-p" />
                 <Zap size={14} className="icon-w" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Control Console */}
      <div className="v3-console glass">
        <div className="console-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tactical assets..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="console-filters">
          <div className="filter-pills">
            {[{id: 'all', name: 'OVERVIEW'}, ...categories].map(cat => (
              <button 
                key={cat.id}
                className={`filter-pill ${filterCat === cat.id ? 'active' : ''}`}
                onClick={() => setFilterCat(cat.id)}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="console-actions">
            <div className="mode-toggle glass">
              <button className={viewMode === 'category' ? 'active' : ''} onClick={() => setViewMode('category')}><LayoutGrid size={18} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={18} /></button>
            </div>
            <button className="deploy-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              <span>DEPLOY ASSET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Grid */}
      <main className="v3-deployment-area">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div 
              key="empty"
              className="v3-empty-locker glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Layers size={64} className="empty-icon" />
              <h3>No Assets Detected</h3>
              <p>Your tactical scan returned zero results for the current parameters.</p>
              <button className="v3-btn-outline" onClick={() => { setSearchTerm(''); setFilterCat('all'); }}>RESET SCAN</button>
            </motion.div>
          ) : (
            <motion.div 
              key={viewMode + filterCat + searchTerm}
              className={`deployment-grid ${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {viewMode === 'category' ? (
                groupedItems.map(group => (
                  <AssetGroup 
                    key={group.id} 
                    group={group} 
                    onUpdate={updateItemStatus}
                    onDelete={deleteItem}
                  />
                ))
              ) : (
                <div className="list-layout">
                  {filteredItems.map(item => (
                    <AssetRow 
                      key={item.id} 
                      item={item} 
                      onUpdate={updateItemStatus}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Deployment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div 
              className="v3-modal glass"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title-box">
                  <div className="title-icon"><Plus size={24} /></div>
                  <div>
                    <h2>Asset Deployment</h2>
                    <p>Initialize new equipment into active inventory</p>
                  </div>
                </div>
                <button className="close-modal" onClick={() => setShowAddModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleAdd} className="modal-form">
                <div className="form-field">
                  <label>IDENTIFIER</label>
                  <div className="input-wrap">
                    <Target size={18} className="input-icon" />
                    <input 
                      autoFocus
                      placeholder="e.g. Tactical GPS Unit..." 
                      value={newItem.name} 
                      onChange={e => setNewItem({...newItem, name: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>CLASSIFICATION</label>
                    <div className="select-wrap">
                      <Tag size={18} className="input-icon" />
                      <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={16} className="select-arrow" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>OPERATOR</label>
                    <div className="select-wrap">
                      <UserIcon size={18} className="input-icon" />
                      <select value={newItem.assignedTo} onChange={e => setNewItem({...newItem, assignedTo: e.target.value})}>
                        {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                      <ChevronDown size={16} className="select-arrow" />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="v3-btn-text" onClick={() => setShowAddModal(false)}>ABORT</button>
                  <button type="submit" className="v3-btn-primary">CONFIRM DEPLOYMENT</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .v3-mission-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1300px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 6rem;
          color: hsl(var(--text));
        }

        /* Header Styles */
        .v3-mission-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .header-top-row { display: flex; justify-content: space-between; align-items: center; }
        .mission-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: hsla(var(--success) / 0.1);
          border: 1px solid hsla(var(--success) / 0.2);
          border-radius: 100px;
          color: hsl(var(--success));
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .pulse-dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } 100% { opacity: 1; transform: scale(1); } }

        .mission-title { font-size: 2.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 0.25rem; }
        .text-glow { color: hsl(var(--p)); text-shadow: 0 0 20px hsla(var(--p) / 0.2); }
        .mission-desc { font-size: 0.95rem; color: hsl(var(--text-muted)); font-weight: 500; }

        .header-main-grid { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; }
        .mission-stats-hub {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem 2rem;
          border-radius: 24px;
          background: hsla(var(--bg-card) / 0.4);
        }
        .hub-stat { display: flex; flex-direction: column; gap: 0.15rem; min-width: 120px; }
        .hub-label { font-size: 0.6rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.12em; }
        .hub-value { font-size: 1.5rem; font-weight: 900; font-variant-numeric: tabular-nums; }
        .hub-progress { height: 6px; background: hsla(var(--text) / 0.05); border-radius: 10px; overflow: hidden; margin-top: 0.5rem; }
        .hub-progress-fill { height: 100%; background: linear-gradient(to right, hsl(var(--p)), hsl(var(--p-light))); }
        .hub-divider { width: 1px; height: 60px; background: hsla(var(--text) / 0.1); }
        .hub-icons { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

        /* Console Styles */
        .v3-console {
          padding: 1.5rem;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: hsla(var(--bg-card) / 0.3);
        }
        .console-search { position: relative; }
        .console-search .search-icon { position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }
        .console-search input {
          width: 100%;
          padding: 1.25rem 1.5rem 1.25rem 3.5rem;
          background: hsla(var(--text) / 0.03);
          border: 1px solid hsla(var(--text) / 0.08);
          border-radius: 16px;
          font-size: 1rem;
          color: hsl(var(--text));
          outline: none;
          transition: 0.3s;
        }
        .console-search input:focus { background: white; border-color: hsl(var(--p)); box-shadow: 0 0 0 5px hsla(var(--p) / 0.08); }

        .console-filters { display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
        .filter-pills { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 4px; }
        .filter-pill {
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          background: hsla(var(--text) / 0.04);
          border: 1px solid transparent;
          color: hsl(var(--text-muted));
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .filter-pill:hover { background: hsla(var(--text) / 0.08); }
        .filter-pill.active { background: hsl(var(--text)); color: hsl(var(--bg)); }

        .console-actions { display: flex; align-items: center; gap: 1.5rem; }
        .mode-toggle { display: flex; padding: 4px; border-radius: 12px; }
        .mode-toggle button {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: none;
          background: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .mode-toggle button.active { background: hsl(var(--p)); color: white; }

        .deploy-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.75rem;
          background: hsl(var(--p));
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 900;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 10px 25px hsla(var(--p) / 0.2);
          transition: 0.3s;
        }
        .deploy-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 35px hsla(var(--p) / 0.3); }

        /* Grid Layouts */
        .deployment-grid.category { display: flex; flex-direction: column; gap: 2.5rem; }
        .group-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .group-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 0 1rem; }
        .group-title-box { display: flex; flex-direction: column; gap: 0.25rem; }
        .group-title-box h3 { font-size: 1.2rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
        .group-tag { font-size: 0.7rem; font-weight: 800; color: hsl(var(--p)); background: hsla(var(--p) / 0.1); padding: 2px 10px; border-radius: 100px; width: fit-content; }
        
        .group-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        /* Asset Card */
        .asset-card {
          background: hsla(var(--bg-card) / 0.5);
          border: 1px solid hsla(var(--text) / 0.08);
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .asset-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, hsla(var(--p) / 0.05) 0%, transparent 100%);
          opacity: 0;
          transition: 0.3s;
        }
        .asset-card:hover { transform: translateY(-4px); border-color: hsla(var(--p) / 0.2); background: white; box-shadow: 0 20px 40px hsla(0, 0%, 0%, 0.05); }
        .asset-card:hover::after { opacity: 1; }

        .check-box {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 2px solid hsla(var(--text) / 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          background: hsla(var(--text) / 0.02);
          flex-shrink: 0;
          z-index: 1;
        }
        .asset-card.packed .check-box { background: hsl(var(--success)); border-color: hsl(var(--success)); color: white; box-shadow: 0 5px 15px hsla(var(--success) / 0.3); }

        .asset-details { flex: 1; min-width: 0; z-index: 1; }
        .asset-label { display: block; font-size: 1.125rem; font-weight: 800; margin-bottom: 0.4rem; transition: 0.2s; }
        .asset-card.packed .asset-label { text-decoration: line-through; opacity: 0.5; }
        
        .asset-meta-row { display: flex; align-items: center; gap: 1rem; }
        .meta-badge { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: hsl(var(--text-muted)); }
        .meta-badge.operator { color: hsl(var(--p)); background: hsla(var(--p) / 0.08); padding: 2px 8px; border-radius: 6px; }

        .asset-ops { opacity: 0; transition: 0.2s; z-index: 1; }
        .asset-card:hover .asset-ops { opacity: 1; }
        .op-btn { 
          width: 36px; 
          height: 36px; 
          border-radius: 10px; 
          border: 1px solid hsla(var(--text) / 0.05);
          background: hsla(var(--text) / 0.02);
          color: hsl(var(--text-muted));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .op-btn:hover { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); border-color: hsla(var(--danger) / 0.1); }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: hsla(0, 0%, 0%, 0.6);
          backdrop-filter: blur(12px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .v3-modal {
          width: 100%;
          max-width: 560px;
          background: white;
          padding: 3rem;
          border-radius: 32px;
          position: relative;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }
        .modal-title-box { display: flex; gap: 1.5rem; }
        .title-icon { width: 56px; height: 56px; background: hsl(var(--p)); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px hsla(var(--p) / 0.3); }
        .modal-header h2 { font-size: 2rem; font-weight: 900; line-height: 1.1; margin-bottom: 0.25rem; }
        .modal-header p { color: hsl(var(--text-muted)); font-weight: 600; }
        .close-modal { width: 44px; height: 44px; border-radius: 12px; border: none; background: hsla(var(--text) / 0.05); color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .close-modal:hover { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); }

        .modal-form { display: flex; flex-direction: column; gap: 1.75rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-field { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-field label { font-size: 0.7rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.15em; }
        
        .input-wrap, .select-wrap { position: relative; }
        .input-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); opacity: 0.6; }
        .select-arrow { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); pointer-events: none; }
        
        .input-wrap input, .select-wrap select {
          width: 100%;
          padding: 1.125rem 1.25rem 1.125rem 3.5rem;
          border-radius: 16px;
          border: 1px solid hsla(var(--text) / 0.1);
          background: hsla(var(--text) / 0.02);
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--text));
          outline: none;
          transition: 0.2s;
          appearance: none;
        }
        .input-wrap input:focus, .select-wrap select:focus { border-color: hsl(var(--p)); background: white; box-shadow: 0 0 0 5px hsla(var(--p) / 0.1); }

        .modal-footer { display: flex; gap: 1.25rem; margin-top: 1.5rem; }
        .v3-btn-text { flex: 1; background: none; border: none; color: hsl(var(--text-muted)); font-weight: 800; cursor: pointer; transition: 0.2s; }
        .v3-btn-text:hover { color: hsl(var(--text)); }
        .v3-btn-primary { flex: 2; padding: 1.25rem; border-radius: 18px; border: none; background: hsl(var(--p)); color: white; font-weight: 900; cursor: pointer; box-shadow: 0 10px 30px hsla(var(--p) / 0.2); transition: 0.3s; }
        .v3-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 40px hsla(var(--p) / 0.3); }

        @media (max-width: 1024px) {
          .header-main-grid { grid-template-columns: 1fr; gap: 2rem; }
          .mission-stats-hub { width: 100%; justify-content: space-around; }
          .mission-title { font-size: 3rem; }
        }
        @media (max-width: 768px) {
          .console-filters { flex-direction: column; align-items: stretch; }
          .console-actions { justify-content: space-between; }
          .form-row { grid-template-columns: 1fr; }
          .group-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function AssetGroup({ group, onUpdate, onDelete }) {
  return (
    <div className="group-container">
      <div className="group-header">
        <div className="group-title-box">
          <span className="group-tag">{group.packed} / {group.total} VERIFIED</span>
          <h3>{group.name}</h3>
        </div>
      </div>
      <div className="group-cards">
        {group.items.map(item => (
          <AssetCardItem 
            key={item.id} 
            item={item} 
            onUpdate={onUpdate} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
}

function AssetCardItem({ item, onUpdate, onDelete }) {
  return (
    <motion.div 
      className={`asset-card ${item.status === 'packed' ? 'packed' : ''}`}
      whileTap={{ scale: 0.98 }}
      onClick={() => onUpdate(item.id, item.status === 'pending' ? 'packed' : 'pending')}
    >
      <div className="check-box">
        <AnimatePresence>
          {item.status === 'packed' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check size={20} strokeWidth={4} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="asset-details">
        <strong className="asset-label">{item.name}</strong>
        <div className="asset-meta-row">
          <div className="meta-badge operator">
            <UserIcon size={12} />
            <span>{item.assignedTo || 'Unassigned'}</span>
          </div>
          <div className="meta-badge">
            <Target size={12} />
            <span>{item.category.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="asset-ops">
        <button className="op-btn" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function AssetRow({ item, onUpdate, onDelete }) {
  return (
    <motion.div 
      className={`asset-card list-mode ${item.status === 'packed' ? 'packed' : ''}`}
      style={{ padding: '1rem 1.5rem' }}
      onClick={() => onUpdate(item.id, item.status === 'pending' ? 'packed' : 'pending')}
    >
      <div className="check-box" style={{ width: 28, height: 28 }}>
        {item.status === 'packed' && <Check size={16} strokeWidth={4} />}
      </div>
      <div className="asset-details" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <strong className="asset-label" style={{ marginBottom: 0, flex: 1 }}>{item.name}</strong>
        <div className="asset-meta-row">
          <div className="meta-badge operator">
            <UserIcon size={12} />
            <span>{item.assignedTo}</span>
          </div>
          <div className="meta-badge">
            <Tag size={12} />
            <span>{item.category}</span>
          </div>
        </div>
      </div>
      <div className="asset-ops">
        <button className="op-btn" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
