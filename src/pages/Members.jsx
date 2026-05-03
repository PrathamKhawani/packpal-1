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
    <motion.div 
      className="members-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header-compact">
        <div className="header-info">
          <h2 className="section-title">Team Members</h2>
          <p className="section-subtitle">{members.length} members with system access</p>
        </div>
        <div className="header-actions">
          {canManage && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} /> Invite Member
            </button>
          )}
        </div>
      </header>

      <div className="table-controls glass">
        <div className="search-box-compact">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><Filter size={14} /> Filter</button>
      </div>

      <div className="members-grid-compact">
        <AnimatePresence>
          {filteredMembers.map((member, idx) => (
            <motion.div 
              key={member.id}
              className="member-card-compact glass"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="m-card-top">
                <div className="m-avatar-md">{member.name.charAt(0)}</div>
                <div className="m-actions">
                  {canManage && member.id !== 'me' && (
                    <button className="action-icon-btn delete" onClick={() => deleteMember(member.id)}><Trash2 size={12} /></button>
                  )}
                </div>
              </div>
              <div className="m-card-mid">
                <h3 className="m-name">{member.name}</h3>
                <p className="m-email"><Mail size={10} /> {member.email}</p>
              </div>
              <div className="m-card-bottom">
                <span className={`badge-role ${member.role}`}>
                  <ShieldCheck size={10} /> {member.role}
                </span>
                <button className="action-icon-btn"><MoreHorizontal size={14} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Member Modal */}
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
                <h3>Invite Member</h3>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    autoFocus
                    required
                    placeholder="e.g. Jane Doe"
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Role</label>
                  <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                    {LOGIN_ROLES.map(r => (
                      <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send Invite</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .members-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-compact { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-title { font-size: 1.75rem; font-weight: 800; }
        .section-subtitle { font-size: 0.8125rem; color: hsl(var(--text-muted)); font-weight: 600; }

        .members-grid-compact { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .member-card-compact { padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 1rem; transition: 0.2s; }
        .member-card-compact:hover { transform: translateY(-2px); border-color: hsla(var(--p) / 0.3); }
        .m-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .m-avatar-md { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-light))); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.125rem; }
        .action-icon-btn.delete { color: hsl(var(--text-muted)); opacity: 0; transition: 0.2s; }
        .member-card-compact:hover .action-icon-btn.delete { opacity: 1; }
        .action-icon-btn.delete:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }

        .m-name { font-size: 0.9375rem; font-weight: 700; margin-bottom: 0.125rem; }
        .m-email { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 500; display: flex; align-items: center; gap: 4px; }

        .m-card-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid hsla(var(--border) / 0.5); padding-top: 0.75rem; }
        .badge-role { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 800; color: hsl(var(--p)); background: hsla(var(--p) / 0.1); padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .badge-role.admin { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }
        .badge-role.member { color: hsl(var(--warning)); background: hsla(var(--warning) / 0.1); }
        .badge-role.viewer { color: hsl(var(--text-muted)); background: hsla(var(--text) / 0.05); }

        .table-controls { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: 12px; }
        .search-box-compact { display: flex; align-items: center; gap: 0.75rem; color: hsl(var(--text-muted)); flex: 1; max-width: 400px; }
        .search-box-compact input { border: none; background: transparent; outline: none; font-size: 0.875rem; width: 100%; color: hsl(var(--text)); }
        .filter-btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.02); font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { background: hsla(var(--p) / 0.05); }

        .modal-overlay { position: fixed; inset: 0; background: hsla(0, 0%, 0%, 0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
      `}</style>
    </motion.div>
  );
}
