import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

const AppContext = createContext();

// Define Login Roles - only these roles can access the application
export const LOGIN_ROLES = ['owner', 'admin', 'member', 'viewer'];

// Role Hierarchy (Permissions)
export const ROLE_PERMISSIONS = {
  owner: ['view', 'edit', 'delete', 'manage_users', 'view_reports'],
  admin: ['view', 'edit', 'delete', 'view_reports'],
  member: ['view', 'edit'],
  viewer: ['view']
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('packpal_theme') || 'light');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('packpal_currentUser');
    return user ? JSON.parse(user) : null;
  });

  const [tripConfig, setTripConfig] = useState(() => {
    const saved = localStorage.getItem('packpal_tripConfig');
    return saved ? JSON.parse(saved) : {
      destination: 'Paris, France',
      startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 50000
    };
  });

  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('packpal_items')) || []);
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
      { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
      { id: 'sarah', name: 'Sarah', role: 'admin', email: 'sarah@example.com' },
      { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' },
      { id: 'alex', name: 'Alex', role: 'member', email: 'alex@example.com' },
      { id: 'tom', name: 'Tom', role: 'viewer', email: 'tom@example.com' }
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('packpal_theme', theme);
  }, [theme]);

  // Sync to LocalStorage (Fallback System)
  useEffect(() => { localStorage.setItem('packpal_items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('packpal_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('packpal_vault', JSON.stringify(vaultDocs)); }, [vaultDocs]);
  useEffect(() => { localStorage.setItem('packpal_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('packpal_tripConfig', JSON.stringify(tripConfig)); }, [tripConfig]);
  useEffect(() => { localStorage.setItem('packpal_activityLog', JSON.stringify(activityLog)); }, [activityLog]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const logActivity = (text, color = 'hsl(var(--p))') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      user: currentUser?.username?.charAt(0).toUpperCase() || 'SYS',
      text,
      time: new Date().toISOString(),
      color
    };
    setActivityLog(prev => [newLog, ...prev].slice(0, 50));
  };

  const login = (username, password, role) => {
    if (!LOGIN_ROLES.includes(role)) return false;
    
    if (password === `${role}123`) {
      const user = { 
        username, 
        role, 
        id: role, 
        avatar: username.charAt(0).toUpperCase(),
        // Link to role-based API path
        apiBase: `/api/${role}`
      };
      setCurrentUser(user);
      localStorage.setItem('packpal_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('packpal_currentUser');
  };

  // Helper for role-prefixed API calls (Simulated)
  const roleApiCall = async (table, action, payload = null) => {
    const role = currentUser?.role || 'guest';
    console.log(`[API Call] ${role}/${table} -> ${action}`);
    
    // In a real production app, this would hit /api/${role}/${table}
    // For this demo, we use Supabase with a LocalStorage fallback
    try {
      if (action === 'select') {
        const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return { data, error: null };
      }
      // Add other actions if needed
    } catch (e) {
      console.warn(`Supabase ${action} failed for ${table}, using LocalStorage.`, e);
      return { data: null, error: e, isFallback: true };
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const itmsRes = await roleApiCall('checklist_items', 'select');
      const expsRes = await roleApiCall('expenses', 'select');
      const vltRes = await roleApiCall('vault_docs', 'select');

      if (itmsRes.data) setItems(itmsRes.data.map(i => ({ ...i, assignedTo: i.assigned_to })));
      if (expsRes.data) setExpenses(expsRes.data.map(e => ({ ...e, payer: e.paid_by })));
      if (vltRes.data) setVaultDocs(vltRes.data.map(d => ({ 
        ...d, 
        name: d.name || d.title, 
        type: d.type || d.description || 'PDF' 
      })));

    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations - Checklists
  const addItem = async (item) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase.from('checklist_items').insert([{
        name: item.name,
        category: item.category,
        assigned_to: item.assignedTo || 'me',
        status: 'pending'
      }]).select();
      if (!error && data) {
        setItems([data[0], ...items]);
        logActivity(`Added "${item.name}" to packing list`, 'hsl(var(--success))');
        return { data, error };
      }
    } catch (e) {}
    
    // Fallback
    setItems([newItem, ...items]);
    logActivity(`Added "${item.name}" to packing list`, 'hsl(var(--success))');
    return { data: [newItem], error: null };
  };

  const updateItem = async (id, updates) => {
    try {
      const { data, error } = await supabase.from('checklist_items').update({
        name: updates.name,
        category: updates.category,
        assigned_to: updates.assignedTo,
        status: updates.status
      }).eq('id', id).select();
      if (!error && data) {
        setItems(items.map(i => i.id === id ? { ...data[0], assignedTo: data[0].assigned_to } : i));
        return { data, error };
      }
    } catch (e) {}
    
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
    return { data: null, error: null };
  };

  const deleteItem = async (id) => {
    try {
      await supabase.from('checklist_items').delete().eq('id', id);
    } catch (e) {}
    setItems(items.filter(i => i.id !== id));
  };

  const updateItemStatus = async (id, status) => {
    try {
      await supabase.from('checklist_items').update({ status }).eq('id', id);
    } catch (e) {}
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
    if (status === 'packed') logActivity(`Packed an item`, 'hsl(var(--p))');
  };

  // CRUD Operations - Expenses
  const addExpense = async (exp) => {
    const newExp = {
      ...exp,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase.from('expenses').insert([{
        description: exp.description,
        amount: parseFloat(exp.amount),
        paid_by: exp.payer || currentUser.username,
        category: exp.category || 'general'
      }]).select();
      if (!error && data) {
        setExpenses([data[0], ...expenses]);
        logActivity(`Logged expense: ₹${exp.amount} for ${exp.description}`, 'hsl(var(--warning))');
        return { data, error };
      }
    } catch (e) {}
    
    setExpenses([newExp, ...expenses]);
    logActivity(`Logged expense: ₹${exp.amount} for ${exp.description}`, 'hsl(var(--warning))');
    return { data: [newExp], error: null };
  };

  const deleteExpense = async (id) => {
    try {
      await supabase.from('expenses').delete().eq('id', id);
    } catch (e) {}
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // CRUD Operations - Members
  const addMember = (member) => {
    const newM = { ...member, id: Math.random().toString(36).substr(2, 9) };
    setMembers([newM, ...members]);
    logActivity(`Added team member: ${member.name}`, 'hsl(var(--p-light))');
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // CRUD Operations - Vault
  const addVaultDoc = async (doc) => {
    const newDoc = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase.from('vault_docs').insert([{
        title: doc.name, // Mapping UI name to DB title
        description: doc.type
      }]).select();
      if (!error && data) {
        const savedDoc = {
          ...data[0],
          name: data[0].name || data[0].title,
          type: data[0].type || data[0].description
        };
        setVaultDocs([savedDoc, ...vaultDocs]);
        logActivity(`Uploaded document to Vault: ${doc.name}`, 'hsl(var(--danger))');
        return { data: [savedDoc], error };
      }
    } catch (e) {}
    
    setVaultDocs([newDoc, ...vaultDocs]);
    logActivity(`Uploaded document to Vault: ${doc.name}`, 'hsl(var(--danger))');
    return { data: [newDoc], error: null };
  };

  const deleteVaultDoc = async (id) => {
    try {
      await supabase.from('vault_docs').delete().eq('id', id);
    } catch (e) {}
    setVaultDocs(vaultDocs.filter(d => d.id !== id));
  };

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      items, setItems, addItem, deleteItem, updateItem, updateItemStatus,
      expenses, setExpenses, addExpense, deleteExpense,
      vaultDocs, setVaultDocs, addVaultDoc, deleteVaultDoc,
      members, setMembers, addMember, deleteMember,
      tripConfig, setTripConfig,
      categories,
      theme, toggleTheme,
      isLoading,
      activityLog, logActivity,
      refreshData: loadData,
      permissions: ROLE_PERMISSIONS[currentUser?.role] || ROLE_PERMISSIONS.viewer
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
