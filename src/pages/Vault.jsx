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

      <div className="search-row-compact glass">
        <Search size={12} />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search vault..." />
      </div>

      <div className="vault-list-compact glass">
        <div className="list-head">
            <span className="col-ico"></span>
            <span className="col-name">DOCUMENT</span>
            <span className="col-type">TYPE</span>
            <span className="col-status">ST</span>
            <span className="col-act"></span>
        </div>
        <div className="list-body">
            {filteredDocs.map((doc, idx) => (
                <motion.div key={doc.id} className="list-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="col-ico">{getFileIcon(doc.type)}</div>
                    <div className="col-name">{doc.name}</div>
                    <div className="col-type"><span className="badge-sm">{doc.type}</span></div>
                    <div className="col-status"><Lock size={10} style={{ color: 'hsl(var(--success))' }} /></div>
                    <div className="col-act">
                        <button className="row-btn" onClick={() => deleteVaultDoc(doc.id)}><Trash2 size={10} /></button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-compact" onClick={() => setIsModalOpen(false)}>
            <motion.div className="modal-box-compact glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={e => e.stopPropagation()}>
              <h3>Upload Secure File</h3>
              <form onSubmit={handleSubmit}>
                <input placeholder="File Name" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} required />
                <select value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})}>
                  <option value="PDF">PDF Document</option>
                  <option value="JPG">Image (JPG/PNG)</option>
                  <option value="DOC">Word Doc</option>
                </select>
                <div className="modal-btns">
                    <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="primary">Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .vault-page-compact { display: flex; flex-direction: column; gap: 0.75rem; }
        .vault-header-compact { padding: 0.75rem 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .vault-header-compact h2 { font-size: 1.1rem; color: hsl(var(--p)); }
        .vault-header-compact p { font-size: 0.75rem; }

        .vault-list-compact { border-radius: 12px; overflow: hidden; }
        .list-head { display: flex; padding: 0.6rem 1rem; background: hsla(var(--text) / 0.03); border-bottom: 1px solid hsla(var(--border) / 0.5); font-size: 0.55rem; font-weight: 900; color: hsl(var(--text-muted)); letter-spacing: 0.05em; }
        .list-row { display: flex; padding: 0.5rem 1rem; border-bottom: 1px solid hsla(var(--border) / 0.3); align-items: center; transition: 0.2s; }
        .list-row:hover { background: hsla(var(--text) / 0.02); }

        .col-ico { width: 30px; display: flex; justify-content: center; }
        .col-name { flex: 1; font-size: 0.8125rem; font-weight: 600; }
        .col-type { width: 60px; }
        .col-status { width: 40px; display: flex; justify-content: center; }
        .col-act { width: 40px; display: flex; justify-content: flex-end; }
        
        .badge-sm { font-size: 0.55rem; font-weight: 800; background: hsla(var(--text) / 0.05); color: hsl(var(--text-muted)); padding: 1px 6px; border-radius: 4px; text-transform: uppercase; }
        
        .row-btn { background: none; border: none; color: hsl(var(--text-muted)); cursor: pointer; opacity: 0; transition: 0.2s; }
        .list-row:hover .row-btn { opacity: 1; }
        .row-btn:hover { color: hsl(var(--danger)); }
      `}</style>
    </div>
  );
}
