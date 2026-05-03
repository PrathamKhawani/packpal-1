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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: `/${currentUser?.role}/dashboard`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'itinerary', icon: <Compass size={20} />, label: 'Itinerary', path: `/${currentUser?.role}/itinerary`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'checklists', icon: <CheckSquare size={20} />, label: 'Checklists', path: `/${currentUser?.role}/checklists`, roles: ['owner', 'admin', 'member', 'viewer'] },
    { id: 'expenses', icon: <Wallet size={20} />, label: 'Expenses', path: `/${currentUser?.role}/expenses`, roles: ['owner', 'admin', 'member'] },
    { id: 'vault', icon: <Lock size={20} />, label: 'Vault', path: `/${currentUser?.role}/vault`, roles: ['owner', 'admin'] },
    { id: 'members', icon: <Users size={20} />, label: 'Team', path: `/${currentUser?.role}/members`, roles: ['owner'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <div className="layout-container-ultra">
      {/* Premium Sidebar */}
      <motion.aside 
        className={`sidebar-premium ${isCollapsed ? 'collapsed' : ''}`}
        animate={{ width: isCollapsed ? 88 : 280 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="sidebar-header-ultra">
          <div className="logo-ultra">
              <div className="logo-icon-premium"><Map size={22} /></div>
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>PackPal</motion.span>}
          </div>
        </div>

        <nav className="sidebar-nav-ultra">
          {filteredItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`nav-item-ultra ${location.pathname.includes(item.id) ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">{item.icon}</div>
              {!isCollapsed && <span className="nav-label-ultra">{item.label}</span>}
              {!isCollapsed && location.pathname.includes(item.id) && (
                  <motion.div layoutId="active-pill" className="active-pill" />
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer-ultra">
          <div className="user-card-ultra">
              <div className="avatar-premium">{currentUser?.username?.[0].toUpperCase()}</div>
              {!isCollapsed && (
                  <div className="user-info-ultra">
                      <p>{currentUser?.username}</p>
                      <span>{currentUser?.role}</span>
                  </div>
              )}
          </div>
          <button className="btn-logout-ultra" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="main-wrapper-ultra">
        <header className="header-ultra glass">
          <div className="header-left">
            <button className="btn-collapse-mobile" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu size={20} />
            </button>
            <div className="search-bar-ultra">
              <Search size={14} className="search-icon" />
              <input type="text" placeholder="Search resources..." />
            </div>
          </div>

          <div className="header-right-ultra">
            <button className="btn-icon-premium" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="btn-icon-premium"><Bell size={18} /></button>
            <div className="divider-v" />
            <div className="user-profile-premium">
                <div className="avatar-sm-premium">{currentUser?.username?.[0].toUpperCase()}</div>
                <ChevronDown size={14} className="chevron-icon" />
            </div>
          </div>
        </header>

        <main className="page-content-ultra">
          <Outlet />
        </main>
      </div>

      <style>{`
        .layout-container-ultra { display: flex; min-height: 100vh; background: hsl(var(--bg)); color: hsl(var(--text)); }
        
        /* Premium Sidebar */
        .sidebar-premium { 
          background: rgba(255, 255, 255, 0.02); 
          backdrop-filter: blur(40px); 
          border-right: 1px solid rgba(255, 255, 255, 0.08); 
          display: flex; 
          flex-direction: column; 
          height: 100vh; 
          position: sticky; 
          top: 0; 
          z-index: 50; 
        }
        
        .sidebar-header-ultra { padding: 2.5rem 1.5rem; }
        .logo-ultra { display: flex; align-items: center; gap: 1rem; }
        .logo-icon-premium { 
          width: 44px; 
          height: 44px; 
          background: linear-gradient(135deg, hsl(var(--p)), hsl(var(--p-dark))); 
          border-radius: 14px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #fff; 
          box-shadow: 0 10px 25px hsla(var(--p) / 0.4);
        }
        .logo-ultra span { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; color: hsl(var(--text)); }

        .sidebar-nav-ultra { flex: 1; padding: 0 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item-ultra { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 0.875rem 1rem; 
          border-radius: 16px; 
          color: hsl(var(--text-muted)); 
          text-decoration: none; 
          font-weight: 700; 
          font-size: 0.9375rem; 
          transition: 0.3s; 
          position: relative;
        }
        .nav-item-ultra:hover { background: hsla(var(--text) / 0.05); color: hsl(var(--text)); }
        .nav-item-ultra.active { color: hsl(var(--p)); background: hsla(var(--p) / 0.1); }
        .nav-icon-wrapper { 
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 10px; 
          transition: 0.3s;
        }
        .nav-item-ultra.active .nav-icon-wrapper { background: hsla(var(--p) / 0.1); color: hsl(var(--p)); }
        
        .active-pill { 
          position: absolute; 
          left: 0; 
          width: 4px; 
          height: 20px; 
          background: hsl(var(--p)); 
          border-radius: 0 4px 4px 0; 
          box-shadow: 0 0 15px hsl(var(--p));
        }

        .sidebar-footer-ultra { padding: 1.5rem; border-top: 1px solid hsla(var(--border) / 0.5); display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .user-card-ultra { display: flex; align-items: center; gap: 1rem; flex: 1; }
        .avatar-premium { 
          width: 40px; 
          height: 40px; 
          border-radius: 12px; 
          background: hsl(var(--p)); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          color: #fff; 
          box-shadow: 0 5px 15px hsla(var(--p) / 0.3);
        }
        .user-info-ultra p { font-size: 0.875rem; font-weight: 700; color: hsl(var(--text)); margin: 0; }
        .user-info-ultra span { font-size: 0.7rem; color: hsl(var(--text-muted)); font-weight: 700; text-transform: uppercase; }
        .btn-logout-ultra { background: transparent; border: none; color: hsl(var(--text-muted)); cursor: pointer; padding: 8px; border-radius: 8px; transition: 0.2s; }
        .btn-logout-ultra:hover { color: hsl(var(--danger)); background: hsla(var(--danger) / 0.1); }

        .main-wrapper-ultra { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .header-ultra { height: 72px; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; background: hsla(var(--bg) / 0.8); backdrop-filter: blur(12px); z-index: 40; border-bottom: 1px solid hsla(var(--border) / 0.5); }
        .page-content-ultra { flex: 1; overflow-y: auto; padding: 2rem; }
        
        .header-left { display: flex; align-items: center; gap: 1.5rem; }
        .btn-collapse-mobile { display: none; background: none; border: none; color: hsl(var(--text)); cursor: pointer; }
        .search-bar-ultra { position: relative; width: 280px; }
        .search-bar-ultra input { width: 100%; padding: 0.625rem 1rem 0.625rem 2.5rem; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsla(var(--text) / 0.03); outline: none; transition: 0.2s; font-size: 0.875rem; }
        .search-bar-ultra input:focus { border-color: hsl(var(--p)); background: hsl(var(--bg-card)); box-shadow: 0 0 0 4px hsla(var(--p) / 0.1); }
        .search-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: hsl(var(--text-muted)); }

        .header-right-ultra { display: flex; align-items: center; gap: 0.75rem; }
        .btn-icon-premium { width: 40px; height: 40px; border-radius: 12px; border: none; background: hsla(var(--text) / 0.03); color: hsl(var(--text)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-icon-premium:hover { background: hsla(var(--text) / 0.06); transform: translateY(-1px); }
        .divider-v { width: 1px; height: 24px; background: hsla(var(--border) / 0.8); margin: 0 0.5rem; }
        .user-profile-premium { display: flex; align-items: center; gap: 0.75rem; padding: 4px 12px 4px 4px; border-radius: 100px; background: hsla(var(--text) / 0.03); border: 1px solid hsla(var(--border) / 0.5); cursor: pointer; transition: 0.2s; }
        .user-profile-premium:hover { background: hsla(var(--text) / 0.06); }
        .avatar-sm-premium { width: 32px; height: 32px; border-radius: 50%; background: hsl(var(--p)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8125rem; }
        .chevron-icon { color: hsl(var(--text-muted)); }

        @media (max-width: 1024px) {
          .btn-collapse-mobile { display: block; }
          .search-bar-ultra { display: none; }
          .sidebar-premium { position: fixed; left: -280px; transition: left 0.3s ease; height: 100vh; width: 280px !important; }
          .sidebar-premium.collapsed { left: 0; }
          .main-wrapper-ultra { width: 100%; }
        }
      `}</style>
    </div>
  );
}
