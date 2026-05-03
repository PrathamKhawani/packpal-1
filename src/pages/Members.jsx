import React, { useState } from 'react';
import { useApp, LOGIN_ROLES } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Trash2, Mail, Shield, 
  Search, Filter, X, ChevronDown, MoreHorizontal, ShieldCheck
} from 'lucide-react';

export default function Members() {
  const { members, addMember, deleteMember, permissions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMember, setNewMember] = useState({ name: '', email: '', role: LOGIN_ROLES[2] });

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = permissions.includes('manage_users');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    addMember(newMember);
    setIsModalOpen(false);
    setNewMember({ name: '', email: '', role: LOGIN_ROLES[2] });
  };

  return (
    <div className="members-page-compact">
      <header className="members-header-compact glass">
        <div className="header-info">
          <h2>Team Members</h2>
          <p>{members.length} collaborators active</p>
        </div>
        <div className="header-actions-group">
            <div className="search-pill glass">
                <Search size={12} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." />
            </div>
            {canManage && (
                <button className="btn-add-ico" onClick={() => setIsModalOpen(true)}><Plus size={16} /></button>
            )}
        </div>
      </header>

      <div className="members-grid-ultra">
        {filteredMembers.map((member, idx) => (
          <motion.div 
            key={member.id}
            className="member-card-ultra glass"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
          >
            <div className="m-top">
                <div className="m-avatar-sm">{member.name[0].toUpperCase()}</div>
                <div className={`m-badge ${member.role}`}>{member.role}</div>
            </div>
            <div className="m-body">
                <h4>{member.name}</h4>
                <p>{member.email}</p>
            </div>
            <div className="m-foot">
                <button className="m-btn-ico"><Mail size={12} /></button>
                {canManage && member.id !== 'me' && (
                    <button className="m-btn-ico del" onClick={() => deleteMember(member.id)}><Trash2 size={12} /></button>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-compact" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="modal-box-compact glass" onClick={e => e.stopPropagation()}>
              <h3>Invite Member</h3>
              <form onSubmit={handleSubmit}>
                <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required />
                <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required />
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                  {LOGIN_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="modal-btns">
                    <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="primary">Invite</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .members-page-compact { display: flex; flex-direction: column; gap: 1rem; }
        .members-header-compact { padding: 0.75rem 1rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .members-header-compact h2 { font-size: 1.1rem; color: hsl(var(--p)); }
        .members-header-compact p { font-size: 0.7rem; color: hsl(var(--text-muted)); }
        
        .header-actions-group { display: flex; gap: 0.75rem; align-items: center; }
        .search-pill { display: flex; align-items: center; gap: 8px; padding: 4px 10px; border-radius: 100px; background: hsla(var(--text) / 0.03); }
        .search-pill input { background: none; border: none; font-size: 0.75rem; color: inherit; outline: none; width: 120px; }
        .btn-add-ico { width: 32px; height: 32px; border-radius: 50%; border: none; background: hsl(var(--p)); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .members-grid-ultra { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
        .member-card-ultra { padding: 1rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.75rem; }
        .m-top { display: flex; justify-content: space-between; align-items: center; }
        .m-avatar-sm { width: 28px; height: 28px; border-radius: 8px; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; }
        .m-badge { font-size: 0.55rem; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: hsla(var(--text) / 0.05); }
        .m-badge.owner { color: hsl(var(--p)); background: hsla(var(--p) / 0.1); }
        .m-body h4 { font-size: 0.8125rem; margin-bottom: 2px; }
        .m-body p { font-size: 0.7rem; color: hsl(var(--text-muted)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .m-foot { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .m-btn-ico { width: 24px; height: 24px; border-radius: 6px; border: 1px solid hsla(var(--border) / 0.5); background: transparent; color: hsl(var(--text-muted)); cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .m-btn-ico:hover { color: hsl(var(--text)); background: hsla(var(--text) / 0.05); }
        .m-btn-ico.del:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.05); }

        .modal-box-compact { width: 100%; max-width: 320px; padding: 1.5rem; border-radius: 16px; }
        .modal-box-compact h3 { margin-bottom: 1rem; font-size: 1rem; }
        .modal-box-compact form { display: flex; flex-direction: column; gap: 0.75rem; }
        .modal-box-compact input, .modal-box-compact select { padding: 0.5rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.8125rem; }
        .modal-btns { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
        .modal-btns button { padding: 0.5rem 1rem; border-radius: 8px; border: none; font-size: 0.75rem; cursor: pointer; font-weight: 700; }
        .modal-btns .primary { background: hsl(var(--p)); color: #fff; }
      `}</style>
    </div>
  );
}
