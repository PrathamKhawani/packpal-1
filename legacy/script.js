document.addEventListener('DOMContentLoaded', function() {
    // ─────────────────────────────────────────────────────────
    // 1. DOM ELEMENTS
    // ─────────────────────────────────────────────────────────
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const currentRoleLabel = document.getElementById('current-role');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('nav li');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Checklist Elements
    const addItemBtn = document.getElementById('add-item-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const checklistItemsContainer = document.getElementById('checklist-items');
    const categoryTabsContainer = document.querySelector('.tabs-container');
    
    // Member Elements
    const addMemberBtn = document.getElementById('add-member-btn');
    const memberListContainer = document.querySelector('.members-list');
    
    // Expense Elements
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const expensesListEl = document.getElementById('expenses-list');
    const balancesListEl = document.getElementById('balances-list');
    
    // Vault Elements
    const addDocBtn = document.getElementById('add-doc-btn');
    const vaultGrid = document.getElementById('vault-grid');
    
    // Itinerary Elements
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    
    // Global Modals & Close
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Toast & Activity
    const notificationToast = document.getElementById('notification-toast');
    const activityFeed = document.getElementById('activity-feed');

    // ─────────────────────────────────────────────────────────
    // 2. CONFIG & STATE
    // ─────────────────────────────────────────────────────────
    const SUPABASE_URL = 'https://koslnldqdbcikqevgjaz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvc2xubGRxZGJjaWtxZXZnamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDQ3NjYsImV4cCI6MjA5MjAyMDc2Nn0.ThE2lqsMbGxirrmPUMjlxOxx3IditRUR13td5PxmeIU';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let sampleItems = [];
    let sampleExpenses = [];
    let vaultDocs = [];
    let sampleItinerary = null;
    
    let categories = JSON.parse(localStorage.getItem('packpal_categories')) || [
        { id: 'all', name: 'All Items', icon: 'list' },
        { id: 'clothing', name: 'Clothing', icon: 'tshirt' },
        { id: 'hygiene', name: 'Hygiene', icon: 'tooth' },
        { id: 'tech', name: 'Tech Gear', icon: 'laptop' },
        { id: 'food', name: 'Food & Snacks', icon: 'utensils' },
        { id: 'camping', name: 'Camping', icon: 'campground' },
        { id: 'beach', name: 'Beach Gear', icon: 'umbrella-beach' },
        { id: 'essentials', name: 'Essentials', icon: 'first-aid' }
    ];
    
    let members = JSON.parse(localStorage.getItem('packpal_members')) || [
        { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
        { id: 'sarah', name: 'Sarah', role: 'admin', email: 'sarah@example.com' },
        { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' },
        { id: 'emma', name: 'Emma', role: 'viewer', email: 'emma@example.com' }
    ];

    let currentUser = JSON.parse(localStorage.getItem('packpal_currentUser')) || null;
    let currentCategory = 'all';
    let currentView = 'dashboard';

    // ─────────────────────────────────────────────────────────
    // 3. INITIALIZATION
    // ─────────────────────────────────────────────────────────
    function init() {
        setupEventListeners();
        setupDemoLogin();
        
        if (currentUser) {
            loadSession(currentUser);
        } else {
            // Ensure login screen is active
            loginScreen.classList.add('active');
            mainScreen.classList.remove('active');
        }

        // Widgets
        initDarkMode();
        initParticles();
        initCurrencyConverter();
        initTemplates();
        initSettings();
        initOnboardingTour();
    }

    function setupEventListeners() {
        // App Flow
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => switchView(item.dataset.section));
        });

        // Modals
        closeModalButtons.forEach(btn => btn.addEventListener('click', closeAllModals));
        window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeAllModals(); });

        // Add Handlers
        if (addItemBtn) addItemBtn.addEventListener('click', () => showModal('add-item-modal'));
        if (addCategoryBtn) addCategoryBtn.addEventListener('click', () => showModal('add-category-modal'));
        if (addMemberBtn) addMemberBtn.addEventListener('click', () => showModal('add-member-modal'));
        if (addExpenseBtn) addExpenseBtn.addEventListener('click', () => { populateExpensePayers(); showModal('add-expense-modal'); });
        if (addDocBtn) addDocBtn.addEventListener('click', () => showModal('add-vault-modal'));
        if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', () => showModal('ai-generate-modal'));

        // Save Handlers
        document.getElementById('save-item-btn')?.addEventListener('click', saveNewItem);
        document.getElementById('save-category-btn')?.addEventListener('click', saveNewCategory);
        document.getElementById('invite-member-btn')?.addEventListener('click', inviteNewMember);
        document.getElementById('save-expense-btn')?.addEventListener('click', saveNewExpense);
        document.getElementById('save-vault-doc-btn')?.addEventListener('click', saveNewVaultDoc);
        document.getElementById('ai-submit-btn')?.addEventListener('click', generateAIItinerary);
        document.getElementById('save-edit-btn')?.addEventListener('click', saveEditItem);

        // Sidebar Nav for "New Group" placeholder
        document.getElementById('new-group-btn')?.addEventListener('click', () => showNotification("Group creation coming soon!"));

        // Weather search
        document.getElementById('fetch-weather-btn')?.addEventListener('click', () => {
            const city = document.getElementById('weather-city-input').value.trim();
            if (city) fetchWeatherForCity(city);
        });
        // Export logic
        document.getElementById('generate-export-btn')?.addEventListener('click', generateExport);
        document.getElementById('export-list-btn')?.addEventListener('click', () => showModal('export-modal'));
        
        // Category icon selection
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Settings Deletion
        document.getElementById('delete-trip-btn')?.addEventListener('click', deleteEntireTrip);
    }

    // ─────────────────────────────────────────────────────────
    // 4. AUTH & SESSION
    // ─────────────────────────────────────────────────────────
    async function handleLogin() {
        const username = usernameInput.value.trim();
        const role = roleSelect.value;
        const password = passwordInput.value.trim();

        if (!username || !password) return showNotification('Please enter credentials');
        if (password !== `${role}123`) return showNotification('Invalid credentials');

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        currentUser = { username, role, id: role };
        localStorage.setItem('packpal_currentUser', JSON.stringify(currentUser));
        
        await loadSession(currentUser);
        showNotification(`Welcome back, ${username}!`);
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('packpal_currentUser');
        mainScreen.classList.remove('active');
        loginScreen.classList.add('active');
        loginScreen.style.display = 'flex';
        mainScreen.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
    }

    async function loadSession(user) {
        loginScreen.classList.remove('active');
        loginScreen.style.display = 'none';
        mainScreen.classList.add('active');
        mainScreen.style.display = 'block';

        updateUIForRole(user.role);
        
        // Clear old activity
        if (activityFeed) activityFeed.innerHTML = '';
        addActivity('Logged in');

        // Pre-fetch data
        await loadDataFromSupabase();
        setupRealtimeSync();

        // Initial Renders
        renderDashboardStats();
        renderChecklistItems();
        updateCategoryTabs();
        renderMemberList();
        renderExpenses();
        renderVault();
        renderTemplates();
        if (sampleItinerary) renderItinerary(sampleItinerary);

        // Weather auto-load
        const lastCity = localStorage.getItem('packpal_destination');
        if (lastCity) fetchWeatherForCity(lastCity);

        // Tour check
        if (!localStorage.getItem('packpal_hasSeenTour')) {
            setTimeout(() => showModal('onboarding-modal'), 500);
        }
    }

    function updateUIForRole(role) {
        currentRoleLabel.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        const isOwner = role === 'owner';
        const isAdmin = role === 'admin';
        const isViewer = role === 'viewer';

        // Elements restricted to Owner/Admin
        document.querySelectorAll('.role-owner-admin').forEach(el => {
            el.style.display = (isOwner || isAdmin) ? '' : 'none';
        });

        // Elements restricted to Owner
        document.querySelectorAll('.role-owner-only').forEach(el => {
            el.style.display = isOwner ? '' : 'none';
        });

        // Nav Settings visibility
        const settingsNav = document.querySelector('[data-section="settings"]');
        if (settingsNav) settingsNav.style.display = (isOwner || isAdmin) ? '' : 'none';

        // Viewer specific: Disable all inputs/buttons except logout/sidebar
        if (isViewer) {
            document.querySelectorAll('input, select, textarea, .checklist-items button').forEach(el => {
                if (!el.classList.contains('close-modal') && el.id !== 'logout-btn' && el.id !== 'menu-toggle' && el.id !== 'dark-mode-toggle') {
                    el.disabled = true;
                }
            });
        } else {
            document.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = false);
        }

        // Toggle Dashboards
        const managerDash = document.querySelector('.manager-dashboard');
        const viewerDash = document.querySelector('.viewer-dashboard');
        if (managerDash && viewerDash) {
            if (isViewer) {
                managerDash.style.display = 'none';
                viewerDash.style.display = 'block';
            } else {
                managerDash.style.display = 'block';
                viewerDash.style.display = 'none';
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    // 5. DATA ENGINE (SUPABASE)
    // ─────────────────────────────────────────────────────────
    async function loadDataFromSupabase() {
        try {
            // Items
            let { data: itms, error: e1 } = await supabase.from('checklist_items').select('*');
            if (!e1 && itms) {
                sampleItems = itms.map(i => ({ ...i, assignedTo: i.assigned_to }));
                localStorage.setItem('packpal_fallback_items', JSON.stringify(sampleItems));
            } else {
                sampleItems = JSON.parse(localStorage.getItem('packpal_fallback_items')) || [];
            }

            // Expenses
            let { data: exps, error: e2 } = await supabase.from('expenses').select('*');
            if (!e2 && exps) {
                sampleExpenses = exps.map(e => ({ ...e, payer: e.paid_by }));
                localStorage.setItem('packpal_fallback_expenses', JSON.stringify(sampleExpenses));
            } else {
                sampleExpenses = JSON.parse(localStorage.getItem('packpal_fallback_expenses')) || [];
            }

            // Vault
            let { data: vlt, error: e3 } = await supabase.from('vault_docs').select('*');
            if (!e3 && vlt) {
                vaultDocs = vlt;
                localStorage.setItem('packpal_fallback_vault', JSON.stringify(vaultDocs));
            } else {
                vaultDocs = JSON.parse(localStorage.getItem('packpal_fallback_vault')) || [];
            }

            // Itinerary / Group State
            const { data: state } = await supabase.from('group_state').select('*').eq('id', 'active_trip');
            if (state && state[0]) {
                const s = state[0];
                if (s.itinerary_json) {
                    sampleItinerary = s.itinerary_json;
                    localStorage.setItem('packpal_fallback_itinerary', JSON.stringify(sampleItinerary));
                }
                // Load settings
                if (s.name) {
                    groupNameDisplay.textContent = s.name;
                    document.getElementById('group-name-input').value = s.name || 'My Group';
                }
            } else {
                sampleItinerary = JSON.parse(localStorage.getItem('packpal_fallback_itinerary')) || null;
            }
        } catch (err) {
            console.error('Core sync failed, falling back to local:', err);
            sampleItems = JSON.parse(localStorage.getItem('packpal_fallback_items')) || [];
            sampleExpenses = JSON.parse(localStorage.getItem('packpal_fallback_expenses')) || [];
            vaultDocs = JSON.parse(localStorage.getItem('packpal_fallback_vault')) || [];
            sampleItinerary = JSON.parse(localStorage.getItem('packpal_fallback_itinerary')) || null;
        }
    }

    function renderDashboardStats() {
        const total = sampleItems.length;
        const packed = sampleItems.filter(i => i.status === 'packed').length;
        const delivered = sampleItems.filter(i => i.status === 'delivered').length;
        
        const packedPct = total ? Math.round((packed / total) * 100) : 0;
        const deliveredPct = total ? Math.round((delivered / total) * 100) : 0;
        const unpackedPct = 100 - packedPct - deliveredPct;

        // Update Labels
        document.getElementById('total-items').textContent = total;
        document.getElementById('packed-items').innerHTML = `${packed} <span class="percentage">(${packedPct}%)</span>`;
        document.getElementById('delivered-items').innerHTML = `${delivered} <span class="percentage">(${deliveredPct}%)</span>`;
        document.getElementById('total-members').textContent = members.length;

        // Progress Chart
        const barPacked = document.querySelector('.progress.packed');
        const barDelivered = document.querySelector('.progress.delivered');
        if (barPacked) barPacked.style.width = `${packedPct}%`;
        if (barDelivered) barDelivered.style.width = `${deliveredPct}%`;

        // Legends
        const legend = document.querySelector('.chart-legend');
        if (legend) {
            legend.innerHTML = `
                <span><i class="fas fa-square packed"></i> Packed (${packedPct}%)</span>
                <span><i class="fas fa-square delivered"></i> Delivered (${deliveredPct}%)</span>
                <span><i class="fas fa-square unpacked"></i> Unpacked (${unpackedPct}%)</span>
            `;
        }

        // Viewer Dashboard (Upgraded)
        const viewerProgress = document.getElementById('viewer-progress-text');
        if (viewerProgress) {
            const myItems = sampleItems.filter(i => i.assignedTo === currentUser.id);
            const myPacked = myItems.filter(i => i.status === 'packed' || i.status === 'delivered').length;
            const myPct = myItems.length ? Math.round((myPacked / myItems.length) * 100) : 0;
            viewerProgress.innerHTML = `
                <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${packedPct}% Total Trip Packed</div>
                <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                    <i class="fas fa-user-check"></i> Your Personal Progress: ${myPacked}/${myItems.length} items (${myPct}%)
                </div>
            `;
        }
    }

    function setupRealtimeSync() {
        supabase.channel('packpal_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_items' }, () => {
                supabase.from('checklist_items').select('*').then(({data}) => {
                    if(data) {
                        sampleItems = data.map(i => ({ ...i, assignedTo: i.assigned_to }));
                        renderChecklistItems();
                        renderDashboardStats();
                        renderMemberList();
                    }
                });
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
                supabase.from('expenses').select('*').then(({data}) => {
                    if(data) {
                        sampleExpenses = data.map(e => ({ ...e, payer: e.paid_by }));
                        renderExpenses();
                    }
                });
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_docs' }, () => {
                supabase.from('vault_docs').select('*').then(({data}) => {
                    if(data) {
                        vaultDocs = data;
                        renderVault();
                    }
                });
            })
            .subscribe();
    }

    // ─────────────────────────────────────────────────────────
    // 6. MODULES - CHECKLIST
    // ─────────────────────────────────────────────────────────
    function renderChecklistItems() {
        if (!checklistItemsContainer) return;
        checklistItemsContainer.innerHTML = '';

        let displayItems = sampleItems.filter(item => {
            const catMatch = currentCategory === 'all' || item.category === currentCategory;
            const userMatch = currentUser.role !== 'member' || item.assignedTo === 'me';
            return catMatch && userMatch;
        });

        if (displayItems.length === 0) {
            checklistItemsContainer.innerHTML = '<div class="empty-state">No items found.</div>';
            return;
        }

        displayItems.forEach(item => {
            const catObj = categories.find(c => c.id === item.category);
            const mbrObj = members.find(m => m.id === item.assignedTo);
            const el = document.createElement('div');
            el.className = 'checklist-item';
            el.innerHTML = `
                <div class="item-name">
                    ${item.name} <span class="item-category">${catObj ? catObj.name : 'Other'}</span>
                </div>
                <div class="item-assigned">
                    <i class="fas fa-user-circle"></i> ${mbrObj ? mbrObj.name : 'Unassigned'}
                </div>
                <div class="item-status">
                    <span class="status-badge ${item.status}">${item.status}</span>
                </div>
                <div class="item-actions">
                    ${currentUser.role !== 'viewer' ? `
                        <button class="btn-icon" onclick="window.editItem('${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon" onclick="window.deleteItem('${item.id}')"><i class="fas fa-trash"></i></button>
                    ` : ''}
                </div>
            `;
            checklistItemsContainer.appendChild(el);
        });
    }

    window.editItem = function(id) {
        const item = sampleItems.find(i => i.id === id);
        if (!item) return;
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-assigned').value = item.assignedTo;
        document.getElementById('edit-item-status').value = item.status;
        document.getElementById('edit-item-quantity').value = item.quantity || 1;
        document.getElementById('edit-item-notes').value = item.notes || '';
        showModal('edit-item-modal');
    };

    window.deleteItem = async function(id) {
        if (!confirm('Delete this item?')) return;
        
        // Optimistic
        sampleItems = sampleItems.filter(i => i.id !== id);
        localStorage.setItem('packpal_fallback_items', JSON.stringify(sampleItems));
        renderChecklistItems();
        renderDashboardStats();

        const { error } = await supabase.from('checklist_items').delete().eq('id', id);
        if (error) showNotification('Deleted locally (Cloud sync failed)');
        else showNotification('Item deleted and synced');
    };

    async function saveNewItem() {
        const name = document.getElementById('item-name').value.trim();
        const category = document.getElementById('item-category').value;
        const assigned_to = document.getElementById('item-assigned').value;
        const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
        
        if (!name) return showNotification('Enter item name');

        const newItem = {
            id: 'local-' + Date.now(),
            name, category, assigned_to, assignedTo: assigned_to, quantity, status: 'unpacked'
        };

        // Optimistic
        sampleItems.push(newItem);
        localStorage.setItem('packpal_fallback_items', JSON.stringify(sampleItems));
        renderChecklistItems();
        renderDashboardStats();

        const { data, error } = await supabase.from('checklist_items').insert([{
            name, category, assigned_to, quantity, status: 'unpacked'
        }]).select();

        if (error) showNotification('Saved locally (Offline)');
        else {
            closeAllModals();
            addActivity(`Added item "${name}"`);
            showNotification('Item synced to cloud!');
        }
    }

    async function saveEditItem() {
        const id = document.getElementById('edit-item-id').value;
        const name = document.getElementById('edit-item-name').value.trim();
        const category = document.getElementById('edit-item-category').value;
        const assigned_to = document.getElementById('edit-item-assigned').value;
        const status = document.getElementById('edit-item-status').value;
        const quantity = parseInt(document.getElementById('edit-item-quantity').value) || 1;

        // Optimistic
        const idx = sampleItems.findIndex(i => i.id === id);
        if (idx !== -1) {
            sampleItems[idx] = { ...sampleItems[idx], name, category, assigned_to, assignedTo: assigned_to, status, quantity };
            localStorage.setItem('packpal_fallback_items', JSON.stringify(sampleItems));
            renderChecklistItems();
            renderDashboardStats();
        }

        const { error } = await supabase.from('checklist_items').update({
            name, category, assigned_to, status, quantity
        }).eq('id', id);

        if (error) showNotification('Updated locally (Offline)');
        else {
            closeAllModals();
            showNotification('Changes synced to cloud');
        }
    }

    function updateCategoryTabs() {
        if (!categoryTabsContainer) return;
        categoryTabsContainer.innerHTML = '';
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `tab ${currentCategory === cat.id ? 'active' : ''}`;
            btn.dataset.category = cat.id;
            btn.innerHTML = `${cat.icon ? `<i class="fas fa-${cat.icon}"></i> ` : ''}${cat.name}`;
            btn.onclick = () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = cat.id;
                renderChecklistItems();
            };
            categoryTabsContainer.appendChild(btn);
        });
    }

    async function saveNewCategory() {
        const name = document.getElementById('category-name').value.trim();
        const iconBtn = document.querySelector('.icon-option.active');
        const icon = iconBtn ? iconBtn.dataset.icon : 'tag';
        
        if (!name) return showNotification('Enter category name');

        const newCat = { id: name.toLowerCase().replace(/\s+/g, '-'), name, icon };
        categories.push(newCat);
        localStorage.setItem('packpal_categories', JSON.stringify(categories));
        
        // Sync to cloud
        await syncConfigurations();

        closeAllModals();
        updateCategoryTabs();
        showNotification(`Category "${name}" created`);
    }

    async function syncConfigurations() {
        // Save current members and categories to group state
        await supabase.from('group_state').upsert({
            id: 'active_trip',
            configs: { members, categories }
        });
    }

    // ─────────────────────────────────────────────────────────
    // 7. MODULES - MEMBERS
    // ─────────────────────────────────────────────────────────
    function renderMemberList() {
        if (!memberListContainer) return;
        memberListContainer.innerHTML = '';

        members.forEach(m => {
            // Updated stats calculation
            const assignedCount = sampleItems.filter(i => i.assignedTo === m.id).length;
            const packedCount = sampleItems.filter(i => i.assignedTo === m.id && (i.status === 'packed' || i.status === 'delivered')).length;

            const card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = `
                <div class="member-avatar"><i class="fas fa-user-circle"></i></div>
                <div class="member-info">
                    <h3>${m.name} (${m.role})</h3>
                    <p style="font-size: 0.85rem; opacity: 0.7;">${m.email}</p>
                </div>
                <div class="member-stats">
                    <div class="stat">
                        <span class="stat-label">Assigned</span>
                        <span class="stat-value" style="color: var(--primary-color); font-weight: 700;">${assignedCount}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Packed</span>
                        <span class="stat-value" style="color: var(--success-color); font-weight: 700;">${packedCount}</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn-icon"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            `;
            memberListContainer.appendChild(card);
        });
    }

    async function inviteNewMember() {
        const name = document.getElementById('member-name').value.trim();
        const email = document.getElementById('member-email').value.trim();
        const role = document.getElementById('member-role').value;
        if (!name || !email) return showNotification('Enter name and email');

        const newM = { id: email.split('@')[0], name, email, role };
        members.push(newM);
        localStorage.setItem('packpal_members', JSON.stringify(members));
        
        await syncConfigurations();

        closeAllModals();
        renderMemberList();
        showNotification(`Invitation sent to ${name}`);
    }

    // ─────────────────────────────────────────────────────────
    // 8. MODULES - EXPENSES
    // ─────────────────────────────────────────────────────────
    function renderExpenses() {
        if (!expensesListEl) return;
        expensesListEl.innerHTML = '';
        
        let total = 0;
        let pSpent = {};
        let pOwed = {};
        members.forEach(m => { pSpent[m.id] = 0; pOwed[m.id] = 0; });

        if (sampleExpenses.length === 0) {
            expensesListEl.innerHTML = '<div class="empty-state">No expenses.</div>';
        } else {
            sampleExpenses.forEach(exp => {
                const amt = parseFloat(exp.amount) || 0;
                total += amt;
                if (pSpent[exp.payer] !== undefined) pSpent[exp.payer] += amt;

                const inv = exp.involved && exp.involved.length > 0 ? exp.involved : members.map(m => m.id);
                const split = amt / (inv.length || 1);
                inv.forEach(pid => { if (pOwed[pid] !== undefined) pOwed[pid] += split; });

                const payerName = members.find(m => m.id === exp.payer)?.name || 'Unknown';
                const item = document.createElement('div');
                item.className = 'expense-item';
                item.innerHTML = `
                    <div class="expense-info">
                        <h4>${exp.description}</h4>
                        <div class="expense-meta">Paid by ${payerName} on ${exp.date}</div>
                    </div>
                    <div class="expense-amount-display">₹${amt.toFixed(2)}</div>
                    <button class="btn-icon" style="color:var(--danger-color)" onclick="window.deleteExpense('${exp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                expensesListEl.appendChild(item);
            });
        }

        document.getElementById('total-trip-cost').textContent = `₹${total.toFixed(2)}`;
        document.getElementById('cost-per-person').textContent = `~₹${(total / (members.length || 1)).toFixed(2)} avg`;

        // Balances
        if (balancesListEl) {
            balancesListEl.innerHTML = '';
            members.forEach(m => {
                const bal = pSpent[m.id] - pOwed[m.id];
                const type = bal >= 0 ? 'positive' : 'negative';
                const txt = bal > 0.01 ? `Gets back ₹${bal.toFixed(2)}` : (bal < -0.01 ? `Owes ₹${Math.abs(bal).toFixed(2)}` : 'Settled Up');
                const bEl = document.createElement('div');
                bEl.className = 'balance-item';
                bEl.innerHTML = `<div class="balance-user">${m.name}</div><div class="balance-amount ${type}">${txt}</div>`;
                balancesListEl.appendChild(bEl);
            });
        }
    }

    window.deleteExpense = async function(id) {
        if (!confirm('Delete expense?')) return;
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (error) showNotification('Delete failed');
        else showNotification('Expense deleted');
    };

    function populateExpensePayers() {
        const sel = document.getElementById('expense-payer');
        const grid = document.getElementById('expense-splitters');
        if (!sel || !grid) return;
        sel.innerHTML = ''; grid.innerHTML = '';
        members.forEach(m => {
            sel.innerHTML += `<option value="${m.id}">${m.name}</option>`;
            grid.innerHTML += `<div class="checkbox-item">
                <input type="checkbox" id="split-${m.id}" value="${m.id}" class="splitter-cb" checked>
                <label for="split-${m.id}">${m.name}</label>
            </div>`;
        });
    }

    async function saveNewExpense() {
        const desc = document.getElementById('expense-desc').value.trim();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paid_by = document.getElementById('expense-payer').value;
        const involved = Array.from(document.querySelectorAll('.splitter-cb:checked')).map(cb => cb.value);

        if (!desc || isNaN(amount)) return showNotification('Enter description and amount');
        if (involved.length === 0) return showNotification('Select splitters');

        const { error } = await supabase.from('expenses').insert([{
            description: desc, amount, paid_by, involved, date: new Date().toISOString().split('T')[0]
        }]);

        if (error) showNotification('Failed to save expense');
        else {
            closeAllModals();
            showNotification('Expense added!');
            addActivity(`Added expense: ${desc}`);
            document.getElementById('expense-desc').value = '';
            document.getElementById('expense-amount').value = '';
        }
    }

    // ─────────────────────────────────────────────────────────
    // 9. MODULES - VAULT
    // ─────────────────────────────────────────────────────────
    function renderVault() {
        if (!vaultGrid) return;
        vaultGrid.innerHTML = '';
        if (vaultDocs.length === 0) {
            vaultGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">Vault is empty.</div>';
            return;
        }
        vaultDocs.forEach(doc => {
            const isUrl = doc.ref.startsWith('http');
            const refHtml = isUrl ? `<a href="${doc.ref}" target="_blank">${doc.ref}</a>` : doc.ref;
            const card = document.createElement('div');
            card.className = 'vault-card';
            card.innerHTML = `
                <i class="fas fa-file-invoice vault-icon"></i>
                ${currentUser.role !== 'viewer' ? `<button class="btn-delete-doc" onclick="window.deleteVaultDoc('${doc.id}')"><i class="fas fa-trash-alt"></i></button>` : ''}
                <h3>${doc.title}</h3>
                <p class="vault-ref">${refHtml}</p>
                <p class="vault-desc">${doc.description || ''}</p>
            `;
            vaultGrid.appendChild(card);
        });
    }

    async function saveNewVaultDoc() {
        const title = document.getElementById('vault-doc-title').value.trim();
        const ref = document.getElementById('vault-doc-ref').value.trim();
        const description = document.getElementById('vault-doc-desc').value.trim();
        if (!title || !ref) return showNotification('Enter title and reference');

        // Show loading state
        const originalText = document.getElementById('save-vault-doc-btn').innerHTML;
        document.getElementById('save-vault-doc-btn').disabled = true;
        document.getElementById('save-vault-doc-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing...';

        const { error } = await supabase.from('vault_docs').insert([{ title, ref, description }]);
        
        document.getElementById('save-vault-doc-btn').disabled = false;
        document.getElementById('save-vault-doc-btn').innerHTML = originalText;

        if (error) showNotification('Failed to save document');
        else {
            closeAllModals();
            showNotification('Document secured!');
            addActivity(`Secured document: ${title}`);
            // Clear inputs
            document.getElementById('vault-doc-title').value = '';
            document.getElementById('vault-doc-ref').value = '';
            document.getElementById('vault-doc-desc').value = '';
        }
    }

    window.deleteVaultDoc = async function(id) {
        if (!confirm('Remove from vault?')) return;
        const { error } = await supabase.from('vault_docs').delete().eq('id', id);
        if (error) showNotification('Delete failed');
        else showNotification('Removed from vault');
    };

    // ─────────────────────────────────────────────────────────
    // 10. MODULES - TEMPLATES
    // ─────────────────────────────────────────────────────────
    const templateData = {
        'beach-trip': [
            { name: 'Swimsuits', category: 'clothing' },
            { name: 'Beach Towel', category: 'other' },
            { name: 'Sunscreen', category: 'hygiene' },
            { name: 'Sunglasses', category: 'tech' },
            { name: 'Flip Flops', category: 'clothing' }
        ],
        'camping': [
            { name: 'Tent', category: 'other' },
            { name: 'Sleeping Bag', category: 'other' },
            { name: 'Flashlight', category: 'tech' },
            { name: 'First Aid Kit', category: 'hygiene' },
            { name: 'Multi-tool', category: 'tech' }
        ],
        'business-trip': [
            { name: 'Formal Suit', category: 'clothing' },
            { name: 'Laptop', category: 'tech' },
            { name: 'Business Cards', category: 'other' },
            { name: 'Chargers', category: 'tech' },
            { name: 'Travel Documents', category: 'essentials' }
        ],
        'festival': [
            { name: 'Festival Ticket', category: 'essentials' },
            { name: 'Earplugs', category: 'other' },
            { name: 'Portable Charger', category: 'tech' },
            { name: 'Wet Wipes', category: 'hygiene' },
            { name: 'Glitter/Face Paint', category: 'other' }
        ]
    };

    function initTemplates() {
        document.querySelectorAll('.template-card button').forEach(btn => {
            btn.addEventListener('click', () => {
                const h3 = btn.parentElement.querySelector('h3').textContent.toLowerCase();
                let type = 'beach-trip';
                if (h3.includes('camping')) type = 'camping';
                else if (h3.includes('business')) type = 'business-trip';
                else if (h3.includes('festival')) type = 'festival';
                
                useTemplate(type);
            });
        });
        
        document.getElementById('create-template-btn')?.addEventListener('click', () => {
            showNotification('Custom templates coming soon!');
        });
    }

    function renderTemplates() {
        // Static in HTML, but we could render them dynamically here if needed
    }

    async function useTemplate(type) {
        const items = templateData[type];
        if (!items) return;

        showNotification(`Applying ${type} template...`);
        const dbItems = items.map(item => ({
            ...item,
            id: 'temp-' + Date.now() + Math.random(),
            assigned_to: 'me',
            assignedTo: 'me',
            status: 'unpacked',
            quantity: 1
        }));

        // Optimistic UI update
        sampleItems = [...sampleItems, ...dbItems];
        localStorage.setItem('packpal_fallback_items', JSON.stringify(sampleItems));
        renderChecklistItems();
        renderDashboardStats();

        const { error } = await supabase.from('checklist_items').insert(dbItems.map(i => {
            const { assignedTo, ...rest } = i;
            return rest;
        }));
        
        if (error) {
            console.warn('Template sync failed, kept in local storage.');
            showNotification('Saved to local list (Cloud sync offline)');
        } else {
            showNotification('Template applied and synced!');
        }
        switchView('checklists');
    }

    // ─────────────────────────────────────────────────────────
    // 11. MODULES - SETTINGS
    // ─────────────────────────────────────────────────────────
    function initSettings() {
        const form = document.querySelector('.settings-form');
        form?.querySelector('.btn-primary')?.addEventListener('click', saveSettings);
        form?.querySelector('.btn-danger')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this trip group?')) {
                showNotification('Trip deletion requires Owner permissions.');
            }
        });
    }

    async function saveSettings() {
        const name = document.getElementById('group-name-input').value.trim();
        const description = document.getElementById('group-description').value.trim();
        const event_date = document.getElementById('group-event-date').value;

        if (!name) return showNotification('Group name cannot be empty');

        const { error } = await supabase.from('group_state').upsert({
            id: 'active_trip',
            name,
            description,
            event_date
        });

        if (error) showNotification('Failed to save settings');
        else {
            groupNameDisplay.textContent = name;
            showNotification('Settings saved!');
            addActivity(`Updated group settings`);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 12. ONBOARDING TOUR
    // ─────────────────────────────────────────────────────────
    let currentTourStep = 0;
    const tourSteps = [
        { title: 'Welcome to PackPal!', text: 'Organize your trip with ease. Let\'s take a 3-step tour.', icon: 'plane-departure' },
        { title: 'Shared Checklists', text: 'Assign items to group members and track packing progress in real-time.', icon: 'clipboard-list' },
        { title: 'Split Expenses', text: 'Keep track of shared costs and see who owes who instantly.', icon: 'wallet' },
        { title: 'Secure Vault', text: 'Store your flight tickets and hotel bookings in the encrypted vault.', icon: 'file-shield' }
    ];

    function initOnboardingTour() {
        const nextBtn = document.getElementById('next-tour-btn');
        const skipBtn = document.getElementById('skip-tour-btn');
        
        nextBtn?.addEventListener('click', () => {
            currentTourStep++;
            if (currentTourStep >= tourSteps.length) {
                closeAllModals();
                localStorage.setItem('packpal_hasSeenTour', 'true');
                currentTourStep = 0; // Reset for next time if ever needed
                nextBtn.textContent = 'Start Tour';
            } else {
                renderTourStep();
                nextBtn.textContent = (currentTourStep === tourSteps.length - 1) ? 'Finish' : 'Next Step';
            }
        });

        skipBtn?.addEventListener('click', () => {
            closeAllModals();
            localStorage.setItem('packpal_hasSeenTour', 'true');
        });
    }

    function renderTourStep() {
        const step = tourSteps[currentTourStep];
        const title = document.getElementById('tour-title');
        const text = document.getElementById('tour-text');
        const icon = document.getElementById('tour-icon');
        const dots = document.querySelectorAll('.tour-progress .dot');

        if (title) title.textContent = step.title;
        if (text) text.textContent = step.text;
        if (icon) icon.innerHTML = `<i class="fas fa-${step.icon}"></i>`;
        
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentTourStep);
        });
    }

    // ─────────────────────────────────────────────────────────
    // 13. MODULES - ITINERARY & AI
    // ─────────────────────────────────────────────────────────
    function renderItinerary(data) {
        const daysList = document.getElementById('itinerary-days-list');
        const timeline = document.getElementById('itinerary-timeline');
        const dayLabel = document.getElementById('itinerary-day-label');
        if (!daysList || !timeline) return;

        if (!data?.days?.length) {
            timeline.innerHTML = '<div class="itinerary-empty"><i class="fas fa-map-marked-alt"></i><p>No itinerary. Use AI ✨</p></div>';
            return;
        }

        initMap(data);
        daysList.innerHTML = '';
        data.days.forEach((day, idx) => {
            const btn = document.createElement('button');
            btn.className = `itinerary-day-btn ${idx === 0 ? 'active' : ''}`;
            btn.textContent = day.label || `Day ${day.day}`;
            btn.onclick = () => {
                document.querySelectorAll('.itinerary-day-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderDayTimeline(day, dayLabel, timeline);
                focusMapOnDay(day);
            };
            daysList.appendChild(btn);
        });
        renderDayTimeline(data.days[0], dayLabel, timeline);
        focusMapOnDay(data.days[0]);
    }

    let _map = null, _markers = null;
    function initMap(data) {
        const mapEl = document.getElementById('itinerary-map');
        if (!mapEl) return;
        mapEl.querySelector('.map-placeholder')?.remove();
        if (!_map) {
            _map = L.map('itinerary-map', { scrollWheelZoom: false }).setView([20, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(_map);
            _markers = L.layerGroup().addTo(_map);
        }
        const coords = [];
        data.days.forEach(d => d.events?.forEach(e => { if(e.lat && e.lng) coords.push([e.lat, e.lng]); }));
        if (coords.length) _map.fitBounds(L.latLngBounds(coords), { padding: [30, 30] });
        setTimeout(() => _map.invalidateSize(), 300);
    }

    function focusMapOnDay(day) {
        if (!_map || !_markers) return;
        _markers.clearLayers();
        const coords = [];
        day.events?.forEach((ev, idx) => {
            if (ev.lat && ev.lng) {
                const m = L.marker([ev.lat, ev.lng], {
                    icon: L.divIcon({ html: `<div class="map-marker-icon" style="background:#3b82f6;">${idx+1}</div>`, className: '', iconSize: [30,30] })
                }).addTo(_markers);
                m.bindPopup(`<b>${ev.title}</b><br>${ev.time}<br>${ev.description}`);
                coords.push([ev.lat, ev.lng]);
            }
        });
        if (coords.length) _map.flyToBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 14 });
    }

    function renderDayTimeline(day, lbl, tl) {
        lbl.textContent = day.label || `Day ${day.day}`;
        tl.innerHTML = '';
        day.events?.forEach((ev, idx) => {
            const div = document.createElement('div');
            div.className = 'timeline-event';
            div.innerHTML = `<div class="event-time">${ev.time}</div><div class="event-title"><span class="event-num">${idx+1}</span> ${ev.title}</div><div class="event-desc">${ev.description}</div>`;
            if (ev.lat) div.onclick = () => _map.flyTo([ev.lat, ev.lng], 15);
            tl.appendChild(div);
        });
    }

    async function generateAIItinerary() {
        const destination = document.getElementById('ai-destination').value.trim();
        const days = document.getElementById('ai-days').value;
        if (!destination || !days) return showNotification('Please enter destination and days');

        aiSubmitBtn.disabled = true;
        aiSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating your plan...';

        try {
            const res = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, days })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to generate itinerary');
            }

            const data = await res.json();
            if (data && data.days) {
                sampleItinerary = data;
                await supabase.from('group_state').upsert({ id: 'active_trip', itinerary_json: data });
                renderItinerary(data);
                fetchWeatherForCity(destination);
                closeAllModals();
                showNotification('✨ Plan ready!');
            } else {
                throw new Error('Invalid response from AI');
            }
        } catch(e) {
            console.error(e);
            showNotification(e.message || 'AI failed to generate'); 
        } finally {
            aiSubmitBtn.disabled = false;
            aiSubmitBtn.innerHTML = 'Build Itinerary';
        }
    }

    async function fetchWeatherForCity(city) {
        if (!city) return;
        const display = document.getElementById('weather-display');
        const icon = document.getElementById('weather-icon');
        const temp = document.getElementById('weather-temp');
        const desc = document.getElementById('weather-desc');
        const submitBtn = document.getElementById('fetch-weather-btn');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        try {
            // 1. Geocode
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
            const geoData = await geoRes.json();
            if (!geoData.length) throw new Error('City not found');
            
            const { lat, lon } = geoData[0];

            // 2. Fetch Forecast
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await res.json();
            
            if (data.current_weather) {
                display?.classList.remove('hidden');
                if (temp) temp.textContent = `${Math.round(data.current_weather.temperature)}°C`;
                if (desc) desc.textContent = `Live outlook for ${city}`;
                
                // Icon mapping
                const code = data.current_weather.weathercode;
                let iconClass = 'fa-sun';
                if (code > 0 && code < 4) iconClass = 'fa-cloud-sun';
                else if (code >= 45 && code <= 48) iconClass = 'fa-smog';
                else if (code >= 51 && code <= 67) iconClass = 'fa-cloud-rain';
                else if (code >= 71) iconClass = 'fa-snowflake';
                if (icon) icon.className = `fas ${iconClass}`;
            }

            renderWeatherForecast(data, city);
            localStorage.setItem('packpal_destination', city);
        } catch(e) { 
            showNotification('Could not find weather for this city');
            console.error(e);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Search';
            }
        }
    }

    function renderWeatherForecast(data, city) {
        const panel = document.getElementById('itinerary-forecast-panel');
        const grid = document.getElementById('forecast-cards');
        const label = document.getElementById('forecast-city-label');
        if (!panel || !grid || !data.daily) return;

        panel.classList.remove('hidden');
        label.textContent = `Weather Forecast for ${city}`;
        grid.innerHTML = '';

        data.daily.time.forEach((time, i) => {
            const date = new Date(time);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const code = data.daily.weathercode[i];

            let iconClass = 'fa-sun';
            if (code > 0 && code < 4) iconClass = 'fa-cloud-sun';
            else if (code >= 45) iconClass = 'fa-cloud-showers-heavy';

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <i class="fas ${iconClass} forecast-icon"></i>
                <div class="forecast-temp">${maxTemp}°C</div>
            `;
            grid.appendChild(card);
        });
    }

    // ─────────────────────────────────────────────────────────
    // 11. EXPORT & UTILS
    // ─────────────────────────────────────────────────────────
    function generateExport() {
        const format = document.getElementById('export-format').value;
        const layout = document.getElementById('export-layout').value;
        
        if (format === 'csv') {
            exportCSV(layout);
        } else if (format === 'print' || format === 'pdf') {
            window.print();
            showNotification('Opening print preview...');
        }
    }

    function exportCSV(layout) {
        let rows = [['Status', 'Item', 'Category', 'Assigned To', 'Quantity']];
        sampleItems.forEach(i => {
            const cat = categories.find(c => c.id === i.category)?.name || 'Other';
            const mbr = members.find(m => m.id === i.assignedTo)?.name || 'Unassigned';
            rows.push([i.status, i.name, cat, mbr, i.quantity]);
        });

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `PackPal_Checklist_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('CSV Downloaded!');
    }

    async function deleteEntireTrip() {
        if (!confirm('CRITICAL: Delete this entire trip and all group data? This cannot be undone.')) return;
        
        const { error } = await supabase.from('group_state').delete().eq('id', 'active_trip');
        const { error: error2 } = await supabase.from('checklist_items').delete().neq('id', 'placeholder');
        
        showNotification('Trip grouping deleted. Logging out...');
        setTimeout(() => {
            localStorage.clear();
            window.location.reload();
        }, 2000);
    }

    // ─────────────────────────────────────────────────────────
    // 10. UI HELPERS & WIDGETS
    // ─────────────────────────────────────────────────────────
    function showModal(id) {
        closeAllModals();
        document.getElementById(id)?.classList.add('active');
    }
    function closeAllModals() { modals.forEach(m => m.classList.remove('active')); }
    function toggleSidebar() { sidebar.classList.toggle('collapsed'); }
    function switchView(view) {
        currentView = view;
        navItems.forEach(i => i.classList.toggle('active', i.dataset.section === view));
        contentSections.forEach(s => s.classList.toggle('active', s.id === `${view}-section`));
        if (view === 'itinerary' && _map) setTimeout(() => _map.invalidateSize(), 200);
    }
    function showNotification(msg) {
        const m = notificationToast.querySelector('.toast-message');
        if (m) m.textContent = msg;
        notificationToast.classList.add('show');
        setTimeout(() => notificationToast.classList.remove('show'), 3000);
    }
    function addActivity(txt) {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-user-circle"></i><span class="activity-text">${txt}</span><span class="activity-time">Just now</span>`;
        if (activityFeed) activityFeed.prepend(li);
    }

    function initDarkMode() {
        const btn = document.getElementById('dark-mode-toggle');
        if (localStorage.getItem('dark-mode') === 'enabled') document.body.classList.add('dark-mode');
        btn?.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
        });
    }

    function initParticles() {
        const canvas = document.getElementById('login-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, pts = [];
        const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        for(let i=0; i<100; i++) pts.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, r: Math.random()*2+1 });
        const draw = () => {
            requestAnimationFrame(draw); ctx.clearRect(0,0,w,h);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if(p.x<0 || p.x>w) p.vx*=-1; if(p.y<0 || p.y>h) p.vy*=-1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
            });
        };
        draw();
    }


    function initCurrencyConverter() {
        const inr = document.getElementById('cc-inr-input'), frn = document.getElementById('cc-foreign-input'), sel = document.getElementById('cc-currency-select');
        if(!inr || !frn || !sel) return;
        const convert = () => {
            fetch('https://open.er-api.com/v6/latest/INR').then(r=>r.json()).then(d=>{
                const rate = d.rates[sel.value];
                if(inr.value) frn.value = (parseFloat(inr.value)*rate).toFixed(2);
            });
        };
        inr.addEventListener('input', convert); sel.addEventListener('change', convert);
    }

    function setupDemoLogin() {
        roleSelect?.addEventListener('change', () => {
            usernameInput.value = roleSelect.value;
            passwordInput.value = `${roleSelect.value}123`;
        });
    }

    // Start
    init();
});

