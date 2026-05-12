import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

const AppContext = createContext();

// Define Login Roles - exactly 3 as requested
export const LOGIN_ROLES = ['admin', 'owner', 'member'];

// Role Hierarchy (Permissions)
export const ROLE_PERMISSIONS = {
  admin: ['view', 'edit', 'delete', 'manage_users', 'view_reports', 'view_analytics'],
  owner: ['view', 'edit', 'delete', 'manage_users', 'view_reports'],
  member: ['view', 'edit']
};

// Default Tactical Database (20 items)
const INITIAL_TACTICAL_DATA = [
  { id: 'def1', name: 'Tactical GPS Unit', category: 'tech', status: 'packed', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def2', name: 'Waterproof Hard Shell', category: 'clothing', status: 'pending', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def3', name: 'Solar Power Bank 20k', category: 'tech', status: 'pending', assignedTo: 'Mike', created_at: new Date().toISOString() },
  { id: 'def4', name: 'Emergency Rations (72h)', category: 'food', status: 'pending', assignedTo: 'Sarah', created_at: new Date().toISOString() },
  { id: 'def5', name: 'First Aid Trauma Kit', category: 'hygiene', status: 'packed', assignedTo: 'Admin', created_at: new Date().toISOString() },
  { id: 'def6', name: 'Noise-Cancelling Comms', category: 'tech', status: 'pending', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def7', name: 'Leatherman Multi-tool', category: 'tech', status: 'packed', assignedTo: 'Mike', created_at: new Date().toISOString() },
  { id: 'def8', name: 'Tactical Recon Boots', category: 'clothing', status: 'pending', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def9', name: 'Water Purification Tabs', category: 'hygiene', status: 'pending', assignedTo: 'Sarah', created_at: new Date().toISOString() },
  { id: 'def10', name: 'Night Vision Monocular', category: 'tech', status: 'pending', assignedTo: 'Admin', created_at: new Date().toISOString() },
  { id: 'def11', name: 'High-Calorie Energy Gels', category: 'food', status: 'packed', assignedTo: 'Mike', created_at: new Date().toISOString() },
  { id: 'def12', name: '550 Paracord (50ft)', category: 'tech', status: 'pending', assignedTo: 'Sarah', created_at: new Date().toISOString() },
  { id: 'def13', name: 'Thermal Base Layers', category: 'clothing', status: 'pending', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def14', name: 'Ferrocerium Fire Starter', category: 'tech', status: 'packed', assignedTo: 'Admin', created_at: new Date().toISOString() },
  { id: 'def15', name: 'Signal Mirror & Whistle', category: 'tech', status: 'pending', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def16', name: 'Tactical Hard-Knuckle Gloves', category: 'clothing', status: 'pending', assignedTo: 'Mike', created_at: new Date().toISOString() },
  { id: 'def17', name: 'Bio-Degradable Wet Wipes', category: 'hygiene', status: 'packed', assignedTo: 'Sarah', created_at: new Date().toISOString() },
  { id: 'def18', name: 'Topographic Mission Map', category: 'tech', status: 'pending', assignedTo: 'Admin', created_at: new Date().toISOString() },
  { id: 'def19', name: 'Tactical LED Flashlight', category: 'tech', status: 'packed', assignedTo: 'You', created_at: new Date().toISOString() },
  { id: 'def20', name: 'Hydration Bladder 3L', category: 'hygiene', status: 'pending', assignedTo: 'Mike', created_at: new Date().toISOString() }
];

// Helper — build a normalized user object from a Supabase session user
const buildUser = (supaUser) => {
  if (!supaUser) return null;
  const meta = supaUser.user_metadata || {};
  const role = meta.role || 'member';
  const username = meta.full_name || supaUser.email?.split('@')[0] || 'User';
  return {
    id: supaUser.id,
    email: supaUser.email,
    username,
    full_name: username,
    role,
    avatar: username.charAt(0).toUpperCase(),
    apiBase: `/api/${role}`,
  };
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('packpal_theme') || 'light');
  const [isLoading, setIsLoading] = useState(true); // start true — wait for Supabase session check
  const [authLoading, setAuthLoading] = useState(false); // individual auth action loading
  const [currentUser, setCurrentUser] = useState(null);

  const DEFAULT_TRIP_CONFIG = {
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    tripType: 'balanced',
    totalMembers: 2,
    notes: '',
    setupComplete: false
  };

  const [tripConfig, setTripConfig] = useState(() => {
    const saved = localStorage.getItem('packpal_tripConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_TRIP_CONFIG, ...parsed };
    }
    return DEFAULT_TRIP_CONFIG;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('packpal_items');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length >= 15 ? parsed : INITIAL_TACTICAL_DATA;
  });

  // Forced Data Sync Effect
  useEffect(() => {
    if (items.length < 15) {
      setItems(INITIAL_TACTICAL_DATA);
      localStorage.setItem('packpal_items', JSON.stringify(INITIAL_TACTICAL_DATA));
    }
  }, [items.length]);

  const [expenses, setExpenses] = useState(() => {
    const e = localStorage.getItem('packpal_expenses');
    return e ? JSON.parse(e) : [
      { id: '1', description: 'Flight Tickets', amount: 45000, payer: 'You', category: 'transport', created_at: new Date().toISOString() },
      { id: '2', description: 'Hotel Deposit', amount: 12000, payer: 'Sarah', category: 'accommodation', created_at: new Date().toISOString() },
      { id: '3', description: 'Dinner @ Le Meurice', amount: 8500, payer: 'Mike', category: 'food', created_at: new Date().toISOString() }
    ];
  });

  const [vaultDocs, setVaultDocs] = useState(() => {
    const v = localStorage.getItem('packpal_vault');
    return v ? JSON.parse(v) : [
      { id: 'v1', name: 'Passport Copy', type: 'PDF', created_at: new Date().toISOString() },
      { id: 'v2', name: 'Travel Insurance', type: 'PDF', created_at: new Date().toISOString() },
      { id: 'v3', name: 'Hotel Booking Confirmation', type: 'PDF', created_at: new Date().toISOString() }
    ];
  });

  const [members, setMembers] = useState(() => {
    const m = localStorage.getItem('packpal_members');
    return m ? JSON.parse(m) : [
      { id: 'admin', name: 'Admin Boss', role: 'admin', email: 'admin@packpal.com' },
      { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
      { id: 'sarah', name: 'Sarah', role: 'member', email: 'sarah@example.com' },
      { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' }
    ];
  });

  const [activityLog, setActivityLog] = useState(() => {
    const log = localStorage.getItem('packpal_activityLog');
    return log ? JSON.parse(log) : [
      { id: '1', user: 'AI', text: 'System initialized. Ready for deployment.', time: new Date(Date.now() - 3600000).toISOString(), color: 'hsl(var(--p))' }
    ];
  });

  const [categories] = useState([
    { id: 'all', name: 'All Items', icon: 'list' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt' },
    { id: 'hygiene', name: 'Hygiene', icon: 'droplet' },
    { id: 'tech', name: 'Tech Gear', icon: 'laptop' },
    { id: 'food', name: 'Food & Snacks', icon: 'utensils' }
  ]);

  // ─── Supabase Auth Listener ────────────────────────────────────────────────
  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(buildUser(session?.user ?? null));
      setIsLoading(false);
    });

    // Subscribe to auth state changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(buildUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('packpal_theme', theme);
  }, [theme]);

  // Sync non-auth state to LocalStorage
  useEffect(() => { localStorage.setItem('packpal_items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('packpal_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('packpal_vault', JSON.stringify(vaultDocs)); }, [vaultDocs]);
  useEffect(() => { localStorage.setItem('packpal_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('packpal_tripConfig', JSON.stringify(tripConfig)); }, [tripConfig]);
  useEffect(() => { localStorage.setItem('packpal_activityLog', JSON.stringify(activityLog)); }, [activityLog]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');


  // ─── Auth Actions (Real Supabase) ──────────────────────────────────────────

  /**
   * Sign in with email + password.
   * Returns { success: true } or { success: false, message: string }
   */
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Register with email + password + role + full_name.
   * Role is stored in user_metadata so it persists with the Supabase session.
   * Returns { success: true } or { success: false, message: string }
   */
  const register = async (email, password, role, fullName) => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName || email.split('@')[0] }
        }
      });
      if (error) return { success: false, message: error.message };

      // After sign-up, also add to the local members list so they appear in Members panel
      const newMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: fullName || email.split('@')[0],
        role,
        email
      };
      setMembers(prev => [...prev, newMember]);

      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Sign out the current user.
   */
  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('packpal_tripConfig');
  };

  const resetTrip = () => {
    const fresh = { ...DEFAULT_TRIP_CONFIG };
    setTripConfig(fresh);
    localStorage.setItem('packpal_tripConfig', JSON.stringify(fresh));
  };


  // ─── Data Loading (Expanded) ──────────────────────────────────────────────
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Auth check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsLoading(false); return; }

      // 2. Parallel Fetch
      const [itmsRes, expsRes, vltRes, cfgRes, memRes] = await Promise.all([
        supabase.from('checklist_items').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('vault_docs').select('*').order('created_at', { ascending: false }),
        supabase.from('trip_config').select('*').single(),
        supabase.from('profiles').select('*')
      ]);

      if (itmsRes.data) setItems(itmsRes.data.map(i => ({ ...i, assignedTo: i.assigned_to })));
      if (expsRes.data) setExpenses(expsRes.data.map(e => ({ ...e, payer: e.paid_by })));
      if (vltRes.data) setVaultDocs(vltRes.data.map(d => ({ ...d, name: d.name || d.title, type: d.type || d.description })));
      
      if (cfgRes.data) {
        setTripConfig({ ...cfgRes.data, setupComplete: true });
      } else {
        // Fallback for new trips
        const saved = localStorage.getItem('packpal_tripConfig');
        if (saved) setTripConfig(JSON.parse(saved));
      }

      if (memRes.data) {
        setMembers(memRes.data.map(m => ({ ...m, name: m.full_name || m.username || m.email })));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using LocalStorage fallbacks.', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── CRUD Operations ──────────────────────────────────────────────────────

  // Trip Config Sync
  const updateTripConfig = async (config) => {
    const updated = { ...tripConfig, ...config };
    setTripConfig(updated);
    localStorage.setItem('packpal_tripConfig', JSON.stringify(updated));

    if (currentUser) {
      try {
        const { error } = await supabase.from('trip_config').upsert({
          id: currentUser.id, // One config per owner
          ...updated,
          owner_id: currentUser.id,
          updated_at: new Date().toISOString()
        });
        if (!error) logActivity(`Updated mission parameters: ${config.tripName || 'Global Config'}`, 'hsl(var(--p))');
      } catch (e) {
        console.error('Trip config sync failed', e);
      }
    }
  };

  // Checklist Items
  const addItem = async (item) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), status: 'pending', created_at: new Date().toISOString() };
    setItems([newItem, ...items]);
    logActivity(`Added "${item.name}" to packing list`, 'hsl(var(--success))');

    if (currentUser) {
      try {
        const { data, error } = await supabase.from('checklist_items').insert([{
          name: item.name,
          category: item.category,
          assigned_to: item.assignedTo || 'me',
          status: 'pending',
          user_id: currentUser.id
        }]).select();
        if (!error && data) setItems([data[0], ...items.filter(i => i.id !== newItem.id)]);
      } catch (e) {}
    }
  };

  const updateItemStatus = async (id, status) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
    if (status === 'packed') logActivity(`Packed an item`, 'hsl(var(--p))');

    if (currentUser) {
      try { await supabase.from('checklist_items').update({ status }).eq('id', id); } catch (e) {}
    }
  };

  // Expenses
  const addExpense = async (exp) => {
    const newExp = { ...exp, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    setExpenses([newExp, ...expenses]);
    logActivity(`Logged expense: ₹${exp.amount}`, 'hsl(var(--warning))');

    if (currentUser) {
      try {
        const { data, error } = await supabase.from('expenses').insert([{
          description: exp.description,
          amount: parseFloat(exp.amount),
          paid_by: exp.payer || currentUser.username,
          category: exp.category || 'general',
          user_id: currentUser.id
        }]).select();
        if (!error && data) setExpenses([data[0], ...expenses.filter(e => e.id !== newExp.id)]);
      } catch (e) {}
    }
  };

  // Activity Log
  const logActivity = (text, color = 'hsl(var(--p))') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      user: currentUser?.username?.charAt(0).toUpperCase() || 'SYS',
      text,
      time: new Date().toISOString(),
      color
    };
    setActivityLog(prev => [newLog, ...prev].slice(0, 50));

    // Optional: Real-time sync to Supabase activity_log table
    if (currentUser) {
      supabase.from('activity_log').insert([{
        user_id: currentUser.id,
        content: text,
        color: color,
        username: currentUser.username
      }]).then();
    }
  };

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser, login, register, logout,
      authLoading,
      items, setItems, addItem, updateItemStatus,
      expenses, setExpenses, addExpense,
      vaultDocs, setVaultDocs, addVaultDoc, deleteVaultDoc,
      members, setMembers, addMember, deleteMember,
      tripConfig, setTripConfig: updateTripConfig, resetTrip,
      categories,
      theme, toggleTheme,
      isLoading,
      activityLog, logActivity,
      refreshData: loadData,
      permissions: ROLE_PERMISSIONS[currentUser?.role] || ROLE_PERMISSIONS.member
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
