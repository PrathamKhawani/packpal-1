import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, Users, Wallet, 
  Shield, LogOut, Map, Sun, Moon, Compass,
  ChevronLeft, Menu, Search, Bell, Command, ChevronDown,
  User as UserIcon, Settings as SettingsIcon, Lock, CheckSquare
} from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, theme, toggleTheme } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: `/${currentUser?.role}/dashboard`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'itinerary', icon: <Compass size={18} />, label: 'Itinerary', path: `/${currentUser?.role}/itinerary`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'checklists', icon: <CheckSquare size={18} />, label: 'Checklists', path: `/${currentUser?.role}/checklists`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'expenses', icon: <Wallet size={18} />, label: 'Expenses', path: `/${currentUser?.role}/expenses`, roles: ['owner', 'admin', 'member'] },
    { id: 'vault', icon: <Lock size={18} />, label: 'Vault', path: `/${currentUser?.role}/vault`, roles: ['owner', 'admin'] },
    { id: 'members', icon: <Users size={18} />, label: 'Team', path: `/${currentUser?.role}/members`, roles: ['owner'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <div className="layout-root">
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
                                <div className="notif-item unread">
                                    <div className="n-icon"><Compass size={14} /></div>
                                    <div className="n-text"><strong>Trip Updated</strong><p>Your Paris itinerary was modified.</p><span>2m ago</span></div>
                                </div>
                                <div className="notif-item">
                                    <div className="n-icon"><Users size={14} /></div>
                                    <div className="n-text"><strong>New Member</strong><p>Sarah joined your workspace.</p><span>1h ago</span></div>
                                </div>
                                <div className="notif-item">
                                    <div className="n-icon"><Wallet size={14} /></div>
                                    <div className="n-text"><strong>Expense Added</strong><p>Flight tickets logged by Admin.</p><span>Yesterday</span></div>
                                </div>
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
                                <button className="p-item"><SettingsIcon size={14} /> Account Settings</button>
                                <button className="p-item"><Lock size={14} /> Privacy & Security</button>
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

      <style>{`
        .layout-root { display: flex; min-height: 100vh; background: hsl(var(--bg)); color: hsl(var(--text)); transition: background 0.3s ease; }
        
        /* Premium Sidebar */
        .sidebar-premium { 
          background: var(--glass-bg);
          backdrop-filter: blur(20px); 
          border-right: 1px solid var(--glass-border); 
          display: flex; 
          flex-direction: column; 
          height: 100vh; 
          position: sticky; 
          top: 0; 
          z-index: 50; 
        }
        
        .sidebar-header { padding: 1.5rem 1rem; }
        .logo-box { display: flex; align-items: center; gap: 0.75rem; }
        .logo-icon { 
          width: 34px; 
          height: 34px; 
          background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); 
          border-radius: 10px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #fff; 
          box-shadow: 0 4px 12px hsla(var(--p) / 0.3);
        }
        .logo-box span { font-size: 1.2rem; font-weight: 850; letter-spacing: -0.04em; color: hsl(var(--text)); }

        .sidebar-nav { flex: 1; padding: 0 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 0.75rem; 
          padding: 0.6rem 0.75rem; 
          border-radius: 10px; 
          color: hsl(var(--text-muted)); 
          text-decoration: none; 
          font-weight: 600; 
          font-size: 0.85rem; 
          transition: 0.2s; 
          position: relative;
        }
        .nav-item:hover { background: hsla(var(--text) / 0.04); color: hsl(var(--text)); }
        .nav-item.active { color: hsl(var(--p)); background: hsla(var(--p) / 0.08); }
        .nav-icon { 
          width: 28px; 
          height: 28px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 8px; 
          transition: 0.2s;
        }
        .nav-item.active .nav-icon { background: hsla(var(--p) / 0.05); color: hsl(var(--p)); }
        
        .nav-pill { 
          position: absolute; 
          left: 0; 
          width: 3px; 
          height: 16px; 
          background: hsl(var(--p)); 
          border-radius: 0 4px 4px 0; 
          box-shadow: 0 0 10px hsl(var(--p));
        }

        .sidebar-footer { padding: 1rem; border-top: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .user-pill { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
        .user-avatar { 
          width: 32px; 
          height: 32px; 
          border-radius: 8px; 
          background: hsl(var(--p)); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          color: #fff; 
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .user-meta { min-width: 0; }
        .user-meta p { font-size: 0.8rem; font-weight: 700; color: hsl(var(--text)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-meta span { font-size: 0.65rem; color: hsl(var(--text-muted)); font-weight: 700; text-transform: uppercase; }
        .logout-btn { background: transparent; border: none; color: hsl(var(--text-muted)); cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; flex-shrink: 0; }
        .logout-btn:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }

        .main-viewport { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .main-header { 
            height: 56px; 
            padding: 0 1.5rem; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            z-index: 40; 
        }
        .page-view { flex: 1; overflow-y: auto; padding: 1.5rem; }
        
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .mobile-toggle { display: none; background: none; border: none; color: hsl(var(--text)); cursor: pointer; }
        .search-pill { position: relative; width: 220px; }
        .search-pill input { 
            width: 100%; 
            padding: 0.45rem 0.75rem 0.45rem 2rem; 
            border-radius: 10px; 
            border: 1px solid hsl(var(--border)); 
            background: hsla(var(--text) / 0.02); 
            color: hsl(var(--text));
            outline: none; 
            transition: 0.2s; 
            font-size: 0.8rem; 
        }
        .search-pill input:focus { border-color: hsl(var(--p)); background: var(--bg-card); box-shadow: 0 0 0 4px hsla(var(--p) / 0.05); }
        .s-icon { position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }

        .header-right { display: flex; align-items: center; gap: 0.5rem; }
        .header-btn, .theme-toggle { 
            width: 34px; 
            height: 34px; 
            border-radius: 8px; 
            border: none; 
            background: hsla(var(--text) / 0.03); 
            color: hsl(var(--text)); 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: 0.2s; 
        }
        .header-btn:hover, .theme-toggle:hover { background: hsla(var(--text) / 0.06); }
        .sep { width: 1px; height: 16px; background: hsl(var(--border)); margin: 0 0.25rem; }
        .profile-btn { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            padding: 3px 8px 3px 3px; 
            border-radius: 100px; 
            background: hsla(var(--text) / 0.03); 
            border: 1px solid hsl(var(--border)); 
            cursor: pointer; 
            transition: 0.2s; 
        }
        .avatar-sm { width: 26px; height: 26px; border-radius: 50%; background: hsl(var(--p)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; }
        .chevron { color: hsl(var(--text-muted)); }

        @media (max-width: 1024px) {
          .mobile-toggle { display: block; }
          .search-pill { display: none; }
          .sidebar-premium { position: fixed; left: -240px; transition: left 0.3s ease; height: 100vh; width: 240px !important; }
          .sidebar-premium.collapsed { left: 0; }
        }
        
        /* Dropdown Styles */
        .relative-container { position: relative; display: flex; align-items: center; }
        .notif-badge { position: absolute; top: 0px; right: 0px; background: hsl(var(--p)); color: #fff; font-size: 0.5rem; font-weight: 900; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid var(--glass-bg); pointer-events: none; }
        
        .dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--glass-bg); backdrop-filter: blur(24px); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; z-index: 100; display: flex; flex-direction: column; }
        .notif-menu { width: 320px; }
        .profile-menu { width: 220px; }
        
        .drop-header { padding: 1rem; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; }
        .drop-header h4 { font-size: 0.9rem; font-weight: 800; margin: 0; }
        .mark-read { font-size: 0.65rem; font-weight: 700; color: hsl(var(--p)); cursor: pointer; transition: 0.2s; }
        .mark-read:hover { text-decoration: underline; }
        
        .drop-content { max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; }
        .notif-item { padding: 1rem; border-bottom: 1px solid var(--glass-border); display: flex; gap: 0.75rem; cursor: pointer; transition: 0.2s; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: hsla(var(--text) / 0.03); }
        .notif-item.unread { background: hsla(var(--p) / 0.05); }
        .n-icon { width: 32px; height: 32px; border-radius: 10px; background: hsla(var(--p) / 0.1); color: hsl(var(--p)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .n-text { flex: 1; min-width: 0; }
        .n-text strong { font-size: 0.8rem; display: block; margin-bottom: 2px; }
        .n-text p { font-size: 0.75rem; color: hsl(var(--text-muted)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
        .n-text span { font-size: 0.6rem; color: hsl(var(--text-muted)); font-weight: 700; display: block; margin-top: 4px; opacity: 0.7; }
        
        .profile-head { flex-direction: row; justify-content: flex-start; gap: 10px; background: hsla(var(--p) / 0.05); }
        .avatar-md { width: 40px; height: 40px; border-radius: 12px; background: hsl(var(--p)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; }
        .p-info strong { font-size: 0.85rem; display: block; }
        .p-info span { font-size: 0.65rem; color: hsl(var(--p)); font-weight: 800; text-transform: uppercase; }
        
        .p-links { padding: 0.5rem; }
        .p-item { width: 100%; text-align: left; background: none; border: none; padding: 0.6rem 0.75rem; font-size: 0.8rem; font-weight: 600; color: hsl(var(--text)); border-radius: 10px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .p-item:hover { background: hsla(var(--text) / 0.05); }
        .p-sep { height: 1px; background: var(--glass-border); margin: 0.25rem 0; }
        .p-item.danger { color: hsl(var(--danger)); }
        .p-item.danger:hover { background: hsla(var(--danger) / 0.1); }
      `}</style>
    </div>
  );
}
