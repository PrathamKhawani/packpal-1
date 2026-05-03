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
      case 'PDF': return <FileText size={16} className="text-danger" />;
      case 'JPG':
      case 'PNG': return <Image size={16} className="text-primary" />;
      default: return <File size={16} className="text-muted" />;
    }
  };

  return (
    <motion.div 
      className="vault-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header-compact">
        <div className="header-info">
          <h2 className="section-title">Document Vault</h2>
          <p className="section-subtitle">{vaultDocs.length} documents stored securely</p>
        </div>
        <div className="header-actions">
          <div className="vault-status-badge">
            <Lock size={12} /> <span>End-to-end Encrypted</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Upload File
          </button>
        </div>
      </header>

      <div className="table-controls glass">
        <div className="search-box-compact">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><Filter size={14} /> Filter</button>
      </div>

      <div className="card glass no-padding overflow-hidden">
        <table className="compact-table">
          <thead>
            <tr>
              <th width="40">Icon</th>
              <th>Document Name</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-right" width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredDocs.map((doc, idx) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td>{getFileIcon(doc.type)}</td>
                  <td className="item-name-cell">
                    <span className="item-text font-semibold">{doc.name}</span>
                  </td>
                  <td>
                    <span className="badge-type">{doc.type}</span>
                  </td>
                  <td>
                    <div className="vault-lock-status">
                      <Lock size={10} className="text-success" />
                      <span>Encrypted</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="row-actions">
                      <button className="action-icon-btn"><Download size={14} /></button>
                      <button className="action-icon-btn delete" onClick={() => deleteVaultDoc(doc.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredDocs.length === 0 && (
          <div className="empty-vault-state">
            <Shield size={32} />
            <p>Your vault is empty</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(true)}>Upload First Document</button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="modal-content card glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Upload Document</h3>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
              </div>
              <div className="upload-zone">
                <Upload size={32} className="text-muted" />
                <p>Drag & drop files here or <span>browse</span></p>
              </div>
              <form onSubmit={handleSubmit} className="modal-form" style={{ marginTop: '1.5rem' }}>
                <div className="input-group">
                  <label>Document Title</label>
                  <input 
                    autoFocus
                    required
                    placeholder="e.g. Passport Copy"
                    value={newDoc.name}
                    onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>File Type</label>
                  <select value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})}>
                    <option value="PDF">PDF Document</option>
                    <option value="JPG">Image (JPG)</option>
                    <option value="PNG">Image (PNG)</option>
                    <option value="DOC">Word Doc</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Complete Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .vault-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-compact { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-title { font-size: 1.75rem; font-weight: 800; }
        .section-subtitle { font-size: 0.8125rem; color: hsl(var(--text-muted)); font-weight: 600; }

        .vault-status-badge { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 700; color: hsl(var(--success)); background: hsla(var(--success) / 0.1); padding: 4px 8px; border-radius: 6px; margin-bottom: 0.5rem; }
        
        .badge-type { font-size: 0.65rem; font-weight: 800; color: hsl(var(--text-muted)); background: hsla(var(--text) / 0.05); padding: 2px 6px; border-radius: 4px; }
        
        .vault-lock-status { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 500; }

        .upload-zone { border: 2px dashed hsla(var(--border) / 0.5); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; background: hsla(var(--text) / 0.02); transition: 0.2s; cursor: pointer; }
        .upload-zone:hover { border-color: hsl(var(--p)); background: hsla(var(--p) / 0.02); }
        .upload-zone p { font-size: 0.875rem; color: hsl(var(--text-muted)); }
        .upload-zone p span { color: hsl(var(--p)); font-weight: 700; text-decoration: underline; }

        .empty-vault-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; gap: 1rem; color: hsl(var(--text-muted)); }
        .empty-vault-state svg { opacity: 0.2; }
        
        .table-controls { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: 12px; }
        .search-box-compact { display: flex; align-items: center; gap: 0.75rem; color: hsl(var(--text-muted)); flex: 1; max-width: 400px; }
        .search-box-compact input { border: none; background: transparent; outline: none; font-size: 0.875rem; width: 100%; color: hsl(var(--text)); }
        .filter-btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { background: hsla(var(--p) / 0.05); }

        .compact-table { width: 100%; border-collapse: collapse; text-align: left; }
        .compact-table th { padding: 1rem; font-size: 0.75rem; font-weight: 700; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid hsla(var(--border) / 0.5); }
        .compact-table td { padding: 0.75rem 1rem; font-size: 0.875rem; border-bottom: 1px solid hsla(var(--border) / 0.3); }

        .row-actions { display: flex; gap: 0.25rem; opacity: 0; transition: 0.2s; justify-content: flex-end; }
        tr:hover .row-actions { opacity: 1; }
        .action-icon-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; }
        .action-icon-btn:hover { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }
        .action-icon-btn.delete:hover { background: hsla(var(--danger) / 0.1); color: hsl(var(--danger)); }

        .modal-overlay { position: fixed; inset: 0; background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .text-right { text-align: right; }
      `}</style>
    </motion.div>
  );
}
