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
    // ADMIN MODULES (Supreme Control)
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Command Center', path: `/admin/dashboard`, roles: ['admin'] },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Platform Analytics', path: `/admin/analytics`, roles: ['admin'] },
    { id: 'members', icon: <Users size={18} />, label: 'Operator Control', path: `/admin/members`, roles: ['admin'] },
    { id: 'system-logs', icon: <Shield size={18} />, label: 'System Audit', path: `/admin/system-logs`, roles: ['admin'] },
    { id: 'vault', icon: <Lock size={18} />, label: 'Secure Vault', path: `/admin/vault`, roles: ['admin'] },
    { id: 'risk-assessment', icon: <Activity size={18} />, label: 'Risk Analysis', path: `/admin/risk-assessment`, roles: ['admin'] },
    
    // OWNER MODULES
    { id: 'dashboard', icon: <Compass size={18} />, label: 'Mission Control', path: `/owner/dashboard`, roles: ['owner'] },
    
    // SHARED TACTICAL (Admin + Owner)
    { id: 'mission-brief', icon: <Target size={18} />, label: 'Tactical Brief', path: `/${currentUser?.role}/mission-brief`, roles: ['admin', 'owner'] },
    { id: 'expenses', icon: <Wallet size={18} />, label: 'Financial Ops', path: `/${currentUser?.role}/expenses`, roles: ['admin', 'owner'] },
    
    // SHARED (Admin + Owner + Member)
    { id: 'itinerary', icon: <Map size={18} />, label: 'Itinerary Planning', path: `/${currentUser?.role}/itinerary`, roles: ['admin', 'owner', 'member'] },
    { id: 'checklists', icon: <CheckSquare size={18} />, label: 'Checklist Protocols', path: `/${currentUser?.role}/checklists`, roles: ['admin', 'owner', 'member'] },
    
    // MEMBER SPECIFIC
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Member View', path: `/member/dashboard`, roles: ['member'] },
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
        <header className="main-header glass">
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
                        <motion.div className="dropdown-menu notif-menu glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
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
                        <motion.div className="dropdown-menu profile-menu glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
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
                <motion.div className="modal-content glass" initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}>
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
        .layout-root { display: flex; min-height: 100vh; background: hsl(var(--bg)); color: hsl(var(--text)); transition: background 0.3s ease; }
        
        /* Floating Frosted Sidebar */
        .sidebar-premium { 
          background: var(--glass-bg);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
          border-right: 1px solid var(--glass-border); 
          display: flex; 
          flex-direction: column; 
          height: 100vh; 
          position: sticky; 
          top: 0; 
          z-index: 100;
          box-shadow: 10px 0 30px rgba(0,0,0,0.2);
        }
        
        .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; }
        .logo-box { display: flex; align-items: center; gap: 0.75rem; }
        .logo-icon { 
          width: 38px; 
          height: 38px; 
          background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #fff; 
          box-shadow: 0 4px 12px hsla(var(--p) / 0.4), inset 0 1px 0 hsla(255,255,255,0.3);
        }
        .logo-box span { font-size: 1.35rem; font-weight: 900; letter-spacing: -0.05em; color: #fff; text-shadow: 0 0 20px hsla(255,255,255,0.2); }

        .sidebar-nav { flex: 1; padding: 1.5rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 0.85rem 1rem; 
          border-radius: 14px; 
          color: hsl(var(--text-muted)); 
          text-decoration: none; 
          font-weight: 700; 
          font-size: 0.85rem; 
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
          position: relative;
          border: 1px solid transparent;
        }
        .nav-item:hover { background: hsla(255, 255, 255, 0.04); color: hsl(var(--text)); transform: translateX(4px); }
        .nav-item.active { 
            color: #fff; 
            background: linear-gradient(90deg, hsla(var(--p)/0.15), transparent);
            border: 1px solid hsla(var(--p)/0.2);
            box-shadow: inset 0 1px 0 hsla(255,255,255,0.05);
        }
        .nav-icon { 
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 10px; 
          transition: 0.3s;
        }
        .nav-item.active .nav-icon { color: hsl(var(--p-light)); filter: drop-shadow(0 0 10px hsla(var(--p)/0.8)); }
        
        .nav-pill { 
          position: absolute; 
          left: 0; 
          top: 0;
          height: 100%;
          width: 4px; 
          background: hsl(var(--p)); 
          box-shadow: 0 0 15px hsl(var(--p));
        }

        .sidebar-footer { padding: 1.25rem; border-top: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: hsla(0,0,0,0.1); }
        .user-pill { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
        .user-avatar { 
          width: 36px; 
          height: 36px; 
          border-radius: 10px; 
          background: hsl(var(--p)); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          color: #fff; 
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 4px 10px hsla(var(--p)/0.3);
        }
        .user-meta { min-width: 0; }
        .user-meta p { font-size: 0.85rem; font-weight: 800; color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-meta span { font-size: 0.65rem; color: hsl(var(--p)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
        .logout-btn { background: hsla(255,255,255,0.03); border: 1px solid var(--glass-border); color: hsl(var(--text-muted)); cursor: pointer; padding: 8px; border-radius: 10px; transition: 0.3s; flex-shrink: 0; }
        .logout-btn:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); border-color: hsla(var(--danger)/0.3); }

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
            border-bottom: 1px solid var(--glass-border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .page-view { flex: 1; overflow-y: auto; padding: 2.5rem; position: relative; z-index: 1; }
        
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .mobile-toggle { display: none; background: hsla(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; padding: 6px; color: hsl(var(--text)); cursor: pointer; }
        .search-pill { position: relative; width: 280px; }
        .search-pill input { 
            width: 100%; 
            padding: 0.6rem 1rem 0.6rem 2.5rem; 
            border-radius: 100px; 
            border: 1px solid var(--glass-border); 
            background: hsla(0,0,0,0.2); 
            color: hsl(var(--text));
            outline: none; 
            transition: 0.3s; 
            font-size: 0.85rem; 
            font-weight: 500;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .search-pill input:focus { border-color: hsl(var(--p)); background: hsla(0,0,0,0.4); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 4px hsla(var(--p)/0.15); }
        .s-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }

        .header-right { display: flex; align-items: center; gap: 0.75rem; }
        .header-btn, .theme-toggle { 
            width: 40px; 
            height: 40px; 
            border-radius: 12px; 
            border: 1px solid var(--glass-border); 
            background: hsla(255,255,255,0.03); 
            color: hsl(var(--text)); 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: 0.3s; 
        }
        .header-btn:hover, .theme-toggle:hover { background: hsla(255,255,255,0.08); border-color: hsla(255,255,255,0.15); transform: translateY(-1px); }
        .sep { width: 1px; height: 20px; background: var(--glass-border); margin: 0 0.5rem; }
        
        .profile-btn { 
            display: flex; 
            align-items: center; 
            gap: 0.75rem; 
            padding: 4px 12px 4px 4px; 
            border-radius: 100px; 
            background: hsla(255,255,255,0.03); 
            border: 1px solid var(--glass-border); 
            cursor: pointer; 
            transition: 0.3s; 
        }
        .profile-btn:hover { background: hsla(255,255,255,0.08); }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; box-shadow: 0 0 10px hsla(var(--p)/0.5); }
        .chevron { color: hsl(var(--text-muted)); }

        @media (max-width: 1024px) {
          .mobile-toggle { display: block; }
          .search-pill { display: none; }
          .sidebar-premium { position: fixed; left: -260px; transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1); width: 260px !important; }
          .sidebar-premium.collapsed { left: 0; }
          .page-view { padding: 1.5rem; }
          .main-header { padding: 0 1rem; }
        }
        
        /* Dropdown Styles */
        .relative-container { position: relative; display: flex; align-items: center; }
        .notif-badge { position: absolute; top: -4px; right: -4px; background: hsl(var(--p)); color: #fff; font-size: 0.6rem; font-weight: 900; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid hsl(var(--bg)); pointer-events: none; box-shadow: 0 0 10px hsla(var(--p)/0.5); }
        
        .dropdown-menu { position: absolute; top: calc(100% + 15px); right: 0; background: var(--glass-bg); backdrop-filter: blur(40px) saturate(150%); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: var(--shadow-card), var(--glass-glow); overflow: hidden; z-index: 100; display: flex; flex-direction: column; }
        .notif-menu { width: 340px; }
        .profile-menu { width: 240px; }
        
        .drop-header { padding: 1.25rem; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; background: hsla(0,0,0,0.1); }
        .drop-header h4 { font-size: 0.95rem; font-weight: 800; margin: 0; color: #fff; }
        .mark-read { font-size: 0.7rem; font-weight: 700; color: hsl(var(--p)); cursor: pointer; transition: 0.2s; }
        .mark-read:hover { color: hsl(var(--p-light)); text-decoration: underline; }
        
        .drop-content { max-height: 350px; overflow-y: auto; display: flex; flex-direction: column; }
        .notif-item { padding: 1.25rem; border-bottom: 1px solid var(--glass-border); display: flex; gap: 1rem; cursor: pointer; transition: 0.2s; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: hsla(255,255,255,0.03); }
        .notif-item.unread { background: hsla(var(--p) / 0.08); }
        .n-icon { width: 36px; height: 36px; border-radius: 12px; background: hsla(var(--p) / 0.15); color: hsl(var(--p-light)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid hsla(var(--p)/0.2); box-shadow: inset 0 1px 0 hsla(255,255,255,0.1); }
        .n-text { flex: 1; min-width: 0; }
        .n-text strong { font-size: 0.85rem; display: block; margin-bottom: 4px; color: #fff; }
        .n-text p { font-size: 0.8rem; color: hsl(var(--text-muted)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .n-text span { font-size: 0.65rem; color: hsl(var(--p)); font-weight: 800; display: block; margin-top: 6px; }
        
        .profile-head { flex-direction: row; justify-content: flex-start; gap: 12px; background: hsla(var(--p) / 0.1); }
        .avatar-md { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; box-shadow: 0 4px 12px hsla(var(--p)/0.4); }
        .p-info strong { font-size: 0.9rem; display: block; color: #fff; }
        .p-info span { font-size: 0.7rem; color: hsl(var(--p-light)); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .p-links { padding: 0.75rem; }
        .p-item { width: 100%; text-align: left; background: none; border: none; padding: 0.75rem 1rem; font-size: 0.85rem; font-weight: 600; color: hsl(var(--text-muted)); border-radius: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
        .p-item:hover { background: hsla(255,255,255,0.05); color: #fff; }
        .p-sep { height: 1px; background: var(--glass-border); margin: 0.5rem 0; }
        .p-item.danger { color: hsl(var(--danger)); }
        .p-item.danger:hover { background: hsla(var(--danger) / 0.15); color: hsl(var(--danger)); border: 1px solid hsla(var(--danger)/0.2); }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 440px; max-width: 90%; background: var(--glass-bg); backdrop-filter: blur(40px) saturate(150%); border-radius: 24px; border: 1px solid var(--glass-border); overflow: hidden; box-shadow: var(--shadow-card), var(--glass-glow); }
        .modal-header { padding: 1.5rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: hsla(0,0,0,0.2); }
        .modal-header h3 { margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff; }
        .close-btn { background: hsla(255,255,255,0.05); border: 1px solid var(--glass-border); width: 32px; height: 32px; border-radius: 10px; font-size: 1rem; font-weight: 900; color: hsl(var(--text-muted)); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { background: hsla(255,255,255,0.1); color: #fff; }
        .modal-body { padding: 1.5rem; }
        .settings-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .s-field { display: flex; flex-direction: column; gap: 0.6rem; }
        .s-field label { font-size: 0.75rem; font-weight: 800; color: hsl(var(--text-muted)); text-transform: uppercase; letter-spacing: 0.05em; }
        .s-field input { padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px solid var(--glass-border); background: hsla(0,0,0,0.2); color: hsl(var(--text)); font-size: 0.95rem; outline: none; transition: 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
        .s-field input:focus { border-color: hsl(var(--p)); background: hsla(0,0,0,0.4); box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 4px hsla(var(--p)/0.15); }
        .s-field input:disabled { opacity: 0.5; cursor: not-allowed; }
        .s-toggle { display: flex; justify-content: space-between; align-items: center; background: hsla(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid var(--glass-border); }
        .s-toggle strong { font-size: 0.95rem; display: block; color: #fff; margin-bottom: 4px; }
        .s-toggle p { font-size: 0.8rem; color: hsl(var(--text-muted)); margin: 0; }
        .s-btn { width: 100%; padding: 1rem; border-radius: 12px; background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); color: #fff; font-weight: 800; font-size: 0.95rem; border: 1px solid hsla(255,255,255,0.2); box-shadow: inset 0 1px 0 hsla(255,255,255,0.2), 0 8px 24px hsla(var(--p)/0.3); cursor: pointer; margin-top: 1rem; transition: 0.3s; }
        .s-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: inset 0 1px 0 hsla(255,255,255,0.3), 0 12px 32px hsla(var(--p)/0.4); }
      `}</style>
    </div>
  );
}
