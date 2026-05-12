import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Target, LayoutDashboard, ClipboardList, Users, Wallet, 
  Shield, LogOut, Map, Sun, Moon, Compass,
  ChevronLeft, Menu, Search, Bell, Command, ChevronDown,
  User as UserIcon, Settings as SettingsIcon, Lock, CheckSquare, Activity, Zap, AlertTriangle
} from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, theme, toggleTheme } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    // ── ADMIN PANEL (System-level, ordered by scope) ──────────────────────────
    { id: 'dashboard',       icon: <LayoutDashboard size={18} />, label: 'Command Center',    path: `/admin/dashboard`,        roles: ['admin'] },
    { id: 'analytics',       icon: <BarChart3 size={18} />,       label: 'Platform Analytics', path: `/admin/analytics`,        roles: ['admin'] },
    { id: 'members',         icon: <Users size={18} />,           label: 'Operator Control',   path: `/admin/members`,          roles: ['admin'] },
    { id: 'system-logs',     icon: <Shield size={18} />,          label: 'System Audit',       path: `/admin/system-logs`,      roles: ['admin'] },
    { id: 'vault',           icon: <Lock size={18} />,            label: 'Secure Vault',       path: `/admin/vault`,            roles: ['admin'] },
    { id: 'risk-assessment', icon: <Activity size={18} />,        label: 'Risk Analysis',      path: `/admin/risk-assessment`,  roles: ['admin'] },

    // ── OWNER PANEL (Trip-level, ordered by planning dependency) ─────────────
    { id: 'dashboard',     icon: <Compass size={18} />,    label: 'Mission Control',   path: `/owner/dashboard`,          roles: ['owner'] },
    { id: 'trip-setup',    icon: <SettingsIcon size={18} />, label: 'Trip Setup',       path: `/owner/trip-setup`,         roles: ['owner'] },
    { id: 'mission-brief', icon: <Target size={18} />,     label: 'Mission Brief',     path: `/owner/mission-brief`,      roles: ['owner'] },
    { id: 'itinerary',     icon: <Map size={18} />,        label: 'Itinerary',         path: `/owner/itinerary`,          roles: ['owner'] },
    { id: 'checklists',    icon: <CheckSquare size={18} />, label: 'Checklists',        path: `/owner/checklists`,         roles: ['owner'] },
    { id: 'expenses',      icon: <Wallet size={18} />,     label: 'Financial Ops',     path: `/owner/expenses`,           roles: ['owner'] },

    // ── MEMBER PANEL (Participation-level, ordered by relevance) ─────────────
    { id: 'dashboard',     icon: <LayoutDashboard size={18} />, label: 'Member View',   path: `/member/dashboard`,        roles: ['member'] },
    { id: 'mission-brief', icon: <Target size={18} />,          label: 'Mission Brief', path: `/member/mission-brief`,    roles: ['member'] },
    { id: 'itinerary',     icon: <Map size={18} />,             label: 'Itinerary',     path: `/member/itinerary`,        roles: ['member'] },
    { id: 'checklists',    icon: <CheckSquare size={18} />,     label: 'Checklists',    path: `/member/checklists`,       roles: ['member'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <div className="layout-root" data-role={currentUser?.role}>
      {/* Sidebar */}
      <motion.aside 
        className={`sidebar-premium ${isCollapsed ? 'collapsed' : ''}`}
        animate={{ width: isCollapsed ? 68 : 240 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="sidebar-header">
          <div className="logo-box">
              <div className="logo-icon"><Map size={18} /></div>
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>PackPal</motion.span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`nav-item ${location.pathname.includes(item.id) ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {!isCollapsed && location.pathname.includes(item.id) && (
                  <motion.div layoutId="nav-pill" className="nav-pill" />
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
              <div className="user-avatar">{currentUser?.username?.[0].toUpperCase()}</div>
              {!isCollapsed && (
                  <div className="user-meta">
                      <p>{currentUser?.username}</p>
                      <span>{currentUser?.role}</span>
                  </div>
              )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="main-viewport">
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu size={18} />
            </button>
            <div className="search-pill">
              <Search size={14} className="s-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative-container">
                <button className="header-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
                    <Bell size={16} />
                    <span className="notif-badge">3</span>
                </button>
                <AnimatePresence>
                    {showNotifications && (
                        <motion.div className="dropdown-menu notif-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                            <div className="drop-header">
                                <h4>Notifications</h4>
                                <span className="mark-read" onClick={() => setShowNotifications(false)}>Mark all as read</span>
                            </div>
                            <div className="drop-content">
                                {currentUser?.role === 'admin' ? (
                                    <>
                                        <div className="notif-item unread">
                                            <div className="n-icon"><Shield size={14} /></div>
                                            <div className="n-text"><strong>Security Alert</strong><p>Multiple login attempts detected.</p><span>2m ago</span></div>
                                        </div>
                                        <div className="notif-item">
                                            <div className="n-icon"><Users size={14} /></div>
                                            <div className="n-text"><strong>New Operator</strong><p>Sarah was added to the system.</p><span>1h ago</span></div>
                                        </div>
                                        <div className="notif-item">
                                            <div className="n-icon"><Zap size={14} /></div>
                                            <div className="n-text"><strong>System Patch</strong><p>Version 3.4.2 deployed successfully.</p><span>Yesterday</span></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="notif-item unread">
                                            <div className="n-icon"><Compass size={14} /></div>
                                            <div className="n-text"><strong>Mission Updated</strong><p>Your deployment itinerary was modified.</p><span>2m ago</span></div>
                                        </div>
                                        <div className="notif-item">
                                            <div className="n-icon"><Target size={14} /></div>
                                            <div className="n-text"><strong>Objective Met</strong><p>Tactical gear verification complete.</p><span>4h ago</span></div>
                                        </div>
                                        <div className="notif-item">
                                            <div className="n-icon"><Wallet size={14} /></div>
                                            <div className="n-text"><strong>Budget Alert</strong><p>New expense logged: ₹45,000.</p><span>Yesterday</span></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="sep" />
            
            {/* Profile Dropdown */}
            <div className="relative-container">
                <div className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)} title="Account Menu">
                    <div className="avatar-sm">{currentUser?.username?.[0].toUpperCase()}</div>
                    <ChevronDown size={12} className="chevron" />
                </div>
                <AnimatePresence>
                    {showProfileMenu && (
                        <motion.div className="dropdown-menu profile-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                            <div className="drop-header profile-head">
                                <div className="avatar-md">{currentUser?.username?.[0].toUpperCase()}</div>
                                <div className="p-info">
                                    <strong>{currentUser?.username}</strong>
                                    <span>{currentUser?.role}</span>
                                </div>
                            </div>
                            <div className="drop-content p-links">
                                <button className="p-item" onClick={() => { setActiveModal('account'); setShowProfileMenu(false); }}><SettingsIcon size={14} /> Account Settings</button>
                                <button className="p-item" onClick={() => { setActiveModal('privacy'); setShowProfileMenu(false); }}><Lock size={14} /> Privacy & Security</button>
                                <div className="p-sep" />
                                <button className="p-item danger" onClick={handleLogout}><LogOut size={14} /> Sign Out</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="page-view">
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {activeModal && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="modal-content" initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}>
                    <div className="modal-header">
                        <h3>{activeModal === 'account' ? 'Account Settings' : 'Privacy & Security'}</h3>
                        <button className="close-btn" onClick={() => setActiveModal(null)}>X</button>
                    </div>
                    <div className="modal-body">
                        {activeModal === 'account' && (
                            <div className="settings-form">
                                <div className="s-field">
                                    <label>Username</label>
                                    <input type="text" defaultValue={currentUser?.username} />
                                </div>
                                <div className="s-field">
                                    <label>Email Address</label>
                                    <input type="email" defaultValue={`${currentUser?.username.toLowerCase()}@packpal.com`} />
                                </div>
                                <div className="s-field">
                                    <label>Role</label>
                                    <input type="text" value={currentUser?.role.toUpperCase()} disabled />
                                </div>
                                <button className="s-btn" onClick={() => { alert('Settings saved successfully!'); setActiveModal(null); }}>Save Changes</button>
                            </div>
                        )}
                        {activeModal === 'privacy' && (
                            <div className="settings-form">
                                <div className="s-toggle">
                                    <div>
                                        <strong>Two-Factor Authentication</strong>
                                        <p>Secure your account with 2FA.</p>
                                    </div>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="s-toggle">
                                    <div>
                                        <strong>Public Profile</strong>
                                        <p>Allow others to find your travel logs.</p>
                                    </div>
                                    <input type="checkbox" />
                                </div>
                                <div className="s-field" style={{ marginTop: '1rem' }}>
                                    <label>Change Password</label>
                                    <input type="password" placeholder="New password" />
                                </div>
                                <button className="s-btn" onClick={() => { alert('Privacy settings updated!'); setActiveModal(null); }}>Update Security</button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      <style>{`
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
        }
        .logo-box span { font-size: 1.25rem; font-weight: 800; color: hsl(var(--text)); letter-spacing: -0.02em; }

        .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto; }
        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 0.75rem; 
          padding: 0.6rem 0.85rem; 
          border-radius: var(--radius-sm); 
          color: hsl(var(--text-muted)); 
          text-decoration: none; 
          font-weight: 600; 
          font-size: 0.85rem; 
          transition: all 0.2s ease; 
          position: relative;
        }
        .nav-item:hover { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }
        .nav-item.active { 
            color: hsl(var(--p)); 
            background: hsla(var(--p)/0.1);
        }
        .nav-icon { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        
        .sidebar-footer { padding: 1rem; border-top: 1px solid hsl(var(--border)); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .user-pill { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
        .user-avatar { 
          width: 32px; 
          height: 32px; 
          border-radius: var(--radius-sm); 
          background: hsl(var(--p)); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 700; 
          color: white; 
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .user-meta { min-width: 0; }
        .user-meta p { font-size: 0.85rem; font-weight: 600; color: hsl(var(--text)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-meta span { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 500; text-transform: capitalize; }
        .logout-btn { background: transparent; border: none; color: hsl(var(--text-muted)); cursor: pointer; padding: 6px; border-radius: var(--radius-sm); transition: 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .logout-btn:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }

        .main-viewport { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        
        .main-header { 
            height: var(--header-height); 
            padding: 0 2rem; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            z-index: 90; 
            position: sticky;
            top: 0;
            background: hsl(var(--bg));
            border-bottom: 1px solid hsl(var(--border));
        }
        
        .page-view { flex: 1; overflow-y: auto; padding: 2rem; position: relative; z-index: 1; }
        
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .mobile-toggle { display: none; background: transparent; border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); padding: 6px; color: hsl(var(--text)); cursor: pointer; }
        .search-pill { position: relative; width: 280px; }
        .search-pill input { 
            width: 100%; 
            padding: 0.5rem 1rem 0.5rem 2.25rem; 
            border-radius: 100px; 
            border: 1px solid hsl(var(--border)); 
            background: hsl(var(--bg-card)); 
            color: hsl(var(--text));
            outline: none; 
            transition: 0.2s; 
            font-size: 0.85rem; 
        }
        .search-pill input:focus { border-color: hsl(var(--p)); box-shadow: 0 0 0 3px hsla(var(--p)/0.1); }
        .s-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }

        .header-right { display: flex; align-items: center; gap: 0.75rem; }
        .header-btn, .theme-toggle { 
            width: 36px; 
            height: 36px; 
            border-radius: 50%; 
            border: 1px solid hsl(var(--border)); 
            background: hsl(var(--bg-card)); 
            color: hsl(var(--text-muted)); 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: 0.2s; 
        }
        .header-btn:hover, .theme-toggle:hover { color: hsl(var(--text)); border-color: hsl(var(--text-muted)); }
        .sep { width: 1px; height: 16px; background: hsl(var(--border)); margin: 0 0.25rem; }
        
        .profile-btn { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            padding: 4px; 
            border-radius: 100px; 
            background: transparent; 
            border: 1px solid transparent; 
            cursor: pointer; 
            transition: 0.2s; 
        }
        .profile-btn:hover { background: hsla(var(--text) / 0.05); }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: hsl(var(--p)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
        .chevron { color: hsl(var(--text-muted)); }

        @media (max-width: 1024px) {
          .mobile-toggle { display: block; }
          .search-pill { display: none; }
          .sidebar-premium { position: fixed; left: -260px; transition: left 0.3s ease; width: 260px !important; }
          .sidebar-premium.collapsed { left: 0; }
          .page-view { padding: 1.25rem; }
          .main-header { padding: 0 1rem; }
        }
        
        /* Dropdown Styles */
        .relative-container { position: relative; display: flex; align-items: center; }
        .notif-badge { position: absolute; top: -2px; right: -2px; background: hsl(var(--danger)); color: white; font-size: 0.6rem; font-weight: 800; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid hsl(var(--bg)); pointer-events: none; }
        
        .dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: hsl(var(--bg-card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); overflow: hidden; z-index: 100; display: flex; flex-direction: column; }
        .notif-menu { width: 320px; }
        .profile-menu { width: 220px; }
        
        .drop-header { padding: 1rem; border-bottom: 1px solid hsl(var(--border)); display: flex; align-items: center; justify-content: space-between; background: hsl(var(--bg)); }
        .drop-header h4 { font-size: 0.9rem; font-weight: 700; margin: 0; }
        .mark-read { font-size: 0.75rem; font-weight: 500; color: hsl(var(--p)); cursor: pointer; }
        .mark-read:hover { text-decoration: underline; }
        
        .drop-content { max-height: 350px; overflow-y: auto; display: flex; flex-direction: column; }
        .notif-item { padding: 1rem; border-bottom: 1px solid hsl(var(--border)); display: flex; gap: 0.75rem; cursor: pointer; transition: 0.2s; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: hsla(var(--text) / 0.02); }
        .notif-item.unread { background: hsla(var(--p) / 0.05); }
        .n-icon { width: 32px; height: 32px; border-radius: var(--radius-sm); background: hsla(var(--text) / 0.05); color: hsl(var(--text)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notif-item.unread .n-icon { background: hsla(var(--p) / 0.1); color: hsl(var(--p)); }
        .n-text { flex: 1; min-width: 0; }
        .n-text strong { font-size: 0.85rem; display: block; margin-bottom: 2px; color: hsl(var(--text)); }
        .n-text p { font-size: 0.8rem; color: hsl(var(--text-muted)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .n-text span { font-size: 0.7rem; color: hsl(var(--text-muted)); display: block; margin-top: 4px; }
        
        .profile-head { flex-direction: column; align-items: flex-start; gap: 10px; background: transparent; }
        .avatar-md { width: 40px; height: 40px; border-radius: var(--radius-sm); background: hsl(var(--p)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .p-info strong { font-size: 0.9rem; display: block; color: hsl(var(--text)); }
        .p-info span { font-size: 0.75rem; color: hsl(var(--text-muted)); font-weight: 500; text-transform: capitalize; }
        
        .p-links { padding: 0.5rem; }
        .p-item { width: 100%; text-align: left; background: none; border: none; padding: 0.6rem 0.75rem; font-size: 0.85rem; font-weight: 500; color: hsl(var(--text)); border-radius: var(--radius-sm); cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .p-item:hover { background: hsla(var(--text) / 0.05); }
        .p-sep { height: 1px; background: hsl(var(--border)); margin: 0.25rem 0; }
        .p-item.danger { color: hsl(var(--danger)); }
        .p-item.danger:hover { background: hsla(var(--danger) / 0.1); }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 400px; max-width: 90%; background: hsl(var(--bg-card)); border-radius: var(--radius-md); border: 1px solid hsl(var(--border)); overflow: hidden; box-shadow: var(--shadow-lg); }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid hsl(var(--border)); display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 700; }
        .close-btn { background: transparent; border: none; font-size: 1rem; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; }
        .close-btn:hover { color: hsl(var(--text)); }
        .modal-body { padding: 1.5rem; }
        .settings-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .s-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .s-field label { font-size: 0.75rem; font-weight: 600; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.02em; }
        .s-field input { padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid hsl(var(--border)); background: hsl(var(--bg)); color: hsl(var(--text)); font-size: 0.9rem; outline: none; transition: 0.2s; }
        .s-field input:focus { border-color: hsl(var(--p)); box-shadow: 0 0 0 3px hsla(var(--p)/0.1); }
        .s-field input:disabled { opacity: 0.6; cursor: not-allowed; }
        .s-toggle { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
        .s-toggle strong { font-size: 0.9rem; display: block; color: hsl(var(--text)); }
        .s-toggle p { font-size: 0.8rem; color: hsl(var(--text-muted)); margin: 0; }
        .s-btn { width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); background: hsl(var(--p)); color: white; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; transition: 0.2s; }
        .s-btn:hover { background: hsl(var(--p-dark)); }
      `}</style>
    </div>
  );
}
