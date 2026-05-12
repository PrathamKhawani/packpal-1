import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, FileText, Lock, Eye, Plus, Search, Filter, 
  X, Upload, Download, Trash2, MoreHorizontal, File, Image
} from 'lucide-react';

export default function Vault() {
  const { vaultDocs, addVaultDoc, deleteVaultDoc } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDoc, setNewDoc] = useState({ name: '', type: 'PDF' });

  const filteredDocs = vaultDocs.filter(doc => 
    (doc.name || doc.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.name) return;
    addVaultDoc(newDoc);
    setIsModalOpen(false);
    setNewDoc({ name: '', type: 'PDF' });
  };

  const getFileIcon = (type) => {
    switch (type.toUpperCase()) {
      case 'PDF': return <FileText size={14} className="text-danger" />;
      case 'JPG':
      case 'PNG': return <Image size={14} className="text-primary" />;
      default: return <File size={14} className="text-muted" />;
    }
  };

  return (
    <div className="vault-page-compact">
      <header className="vault-header-compact glass">
        <div className="header-info">
          <h2>Secure Vault</h2>
          <p>{vaultDocs.length} assets encrypted</p>
        </div>
        <div className="header-actions">
          <button className="btn-add-ico" onClick={() => setIsModalOpen(true)}><Upload size={16} /></button>
        </div>
      </header>

      <div className="vault-search-container glass">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Search tactical assets..." 
          />
          <div className="search-shortcut">/</div>
        </div>
        <button className="btn-filter-vault"><Filter size={14} /></button>
      </div>

      <div className="vault-list-modern glass">
        <div className="list-head">
            <span className="col-ico"></span>
            <span className="col-name">DOCUMENT IDENTIFIER</span>
            <span className="col-type">TYPE</span>
            <span className="col-status">SYNC</span>
            <span className="col-act"></span>
        </div>
        <div className="list-body">
            {filteredDocs.length === 0 ? (
                <div className="empty-vault-state">
                    <Shield size={32} />
                    <p>No secure assets found</p>
                </div>
            ) : (
                filteredDocs.map((doc, idx) => (
                    <motion.div 
                      key={doc.id} 
                      className="list-row-modern" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                        <div className="col-ico">{getFileIcon(doc.type)}</div>
                        <div className="col-name">
                            <span className="doc-name">{doc.name}</span>
                            <span className="doc-meta">ID: {doc.id?.slice(0, 8)}</span>
                        </div>
                        <div className="col-type"><span className="badge-modern">{doc.type}</span></div>
                        <div className="col-status">
                            <div className="sync-indicator">
                                <Lock size={10} />
                                <span>SECURE</span>
                            </div>
                        </div>
                        <div className="col-act">
                            <button className="row-btn-modern" onClick={() => deleteVaultDoc(doc.id)}><Trash2 size={12} /></button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-compact" onClick={() => setIsModalOpen(false)}>
            <motion.div className="modal-box-modern glass" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header-modern">
                <h3>Upload Secure Asset</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form-modern">
                <div className="input-field">
                    <label>ASSET NAME</label>
                    <input placeholder="Enter identifier..." value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} required />
                </div>
                <div className="input-field">
                    <label>CLASSIFICATION</label>
                    <select value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})}>
                        <option value="PDF">PDF Document</option>
                        <option value="JPG">Image (JPG/PNG)</option>
                        <option value="DOC">Word Doc</option>
                        <option value="KEY">Encryption Key</option>
                    </select>
                </div>
                <div className="modal-actions-modern">
                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-submit">Initialize Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .vault-page-compact { display: flex; flex-direction: column; gap: 1rem; max-width: 1000px; margin: 0 auto; padding: 1rem; }
        
        .vault-header-compact { padding: 1rem 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; background: hsla(var(--bg-card) / 0.4); }
        .vault-header-compact h2 { font-size: 1.5rem; font-weight: 800; color: hsl(var(--text)); letter-spacing: -0.02em; }
        .vault-header-compact p { font-size: 0.85rem; color: hsl(var(--text-muted)); font-weight: 500; }
        
        .btn-add-ico { 
            width: 40px; height: 40px; border-radius: 12px; background: hsl(var(--p)); color: white; border: none; 
            display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
            box-shadow: 0 4px 12px hsla(var(--p) / 0.2);
        }
        .btn-add-ico:hover { transform: translateY(-2px); box-shadow: 0 6px 16px hsla(var(--p) / 0.3); }

        /* Search Container */
        .vault-search-container { 
            display: flex; gap: 0.75rem; padding: 0.5rem; border-radius: 16px; align-items: center;
        }
        .search-input-wrapper { 
            flex: 1; position: relative; display: flex; align-items: center; background: hsla(var(--text) / 0.03); border-radius: 12px; padding: 0 1rem; border: 1px solid transparent; transition: 0.2s;
        }
        .search-input-wrapper:focus-within { background: white; border-color: hsl(var(--p)); box-shadow: 0 0 0 4px hsla(var(--p) / 0.15); }
        
        .search-icon { color: hsl(var(--text-muted)); }
        .search-input-wrapper input { 
            flex: 1; padding: 0.75rem 0.5rem; border: none; background: none; font-size: 0.9rem; color: hsl(var(--text)); outline: none; font-weight: 500;
        }
        .search-shortcut { font-size: 0.7rem; font-weight: 800; color: hsl(var(--text-muted)); background: hsla(var(--text) / 0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid hsla(var(--text) / 0.1); }

        .btn-filter-vault { width: 38px; height: 38px; border-radius: 10px; border: 1px solid hsla(var(--text) / 0.1); background: none; color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; }

        /* Modern List */
        .vault-list-modern { border-radius: 20px; overflow: hidden; background: hsla(var(--bg-card) / 0.4); }
        .list-head { display: flex; padding: 1rem 1.5rem; background: hsla(var(--text) / 0.03); border-bottom: 1px solid hsla(var(--border) / 0.5); font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.1em; }
        
        .list-row-modern { display: flex; padding: 0.75rem 1.5rem; border-bottom: 1px solid hsla(var(--border) / 0.3); align-items: center; transition: 0.2s; }
        .list-row-modern:hover { background: hsla(var(--text) / 0.02); }

        .col-ico { width: 50px; display: flex; justify-content: center; }
        .col-name { flex: 1; display: flex; flex-direction: column; }
        .doc-name { font-size: 0.95rem; font-weight: 700; color: hsl(var(--text)); }
        .doc-meta { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 500; }

        .col-type { width: 80px; }
        .badge-modern { font-size: 0.65rem; font-weight: 800; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); padding: 2px 8px; border-radius: 6px; }
        
        .col-status { width: 100px; display: flex; justify-content: center; }
        .sync-indicator { display: flex; align-items: center; gap: 4px; font-size: 0.6rem; font-weight: 800; color: hsl(var(--success)); background: hsla(var(--success) / 0.1); padding: 2px 8px; border-radius: 100px; }

        .col-act { width: 50px; display: flex; justify-content: flex-end; }
        .row-btn-modern { width: 32px; height: 32px; border-radius: 8px; background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .row-btn-modern:hover { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); }

        .empty-vault-state { padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: hsl(var(--text-muted)); }
        .empty-vault-state p { font-size: 0.9rem; font-weight: 500; }

        /* Modal Modern */
        .modal-overlay-compact { position: fixed; inset: 0; background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-box-modern { width: 100%; max-width: 450px; background: white; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .modal-header-modern { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header-modern h3 { font-size: 1.25rem; font-weight: 800; }
        .close-btn { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; }

        .modal-form-modern { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-field label { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .input-field input, .input-field select { padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid hsla(var(--text) / 0.1); background: hsla(var(--text) / 0.02); font-size: 0.9rem; outline: none; width: 100%; }
        .input-field input:focus { border-color: hsl(var(--p)); background: white; }

        .modal-actions-modern { display: flex; gap: 1rem; margin-top: 1rem; }
        .btn-cancel { flex: 1; padding: 0.75rem; border-radius: 12px; border: none; background: none; font-weight: 700; cursor: pointer; }
        .btn-submit { flex: 2; padding: 0.75rem; border-radius: 12px; border: none; background: hsl(var(--p)); color: white; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px hsla(var(--p) / 0.2); }

        @media (max-width: 600px) {
          .list-head { display: none; }
          .list-row-modern { flex-wrap: wrap; gap: 0.5rem; position: relative; padding: 1rem; }
          .col-ico { display: none; }
          .col-name { width: 100%; }
          .col-status { justify-content: flex-start; }
          .col-act { position: absolute; top: 1rem; right: 1rem; width: auto; }
          .vault-hero { padding: 1.5rem; flex-direction: column; align-items: flex-start; gap: 1rem; }
          .vh-left h1 { font-size: 2rem; }
          .modal-box-modern { padding: 1.5rem; max-width: 95%; }
        }
      `}</style>
    </div>
  );
}
