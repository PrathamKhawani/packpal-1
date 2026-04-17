document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const currentRole = document.getElementById('current-role');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('nav li');
    const contentSections = document.querySelectorAll('.content-section');
    const addItemBtn = document.getElementById('add-item-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addMemberBtn = document.getElementById('add-member-btn');
    const exportListBtn = document.getElementById('export-list-btn');
    const saveItemBtn = document.getElementById('save-item-btn');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const inviteMemberBtn = document.getElementById('invite-member-btn');
    const generateExportBtn = document.getElementById('generate-export-btn');
    const categoryTabs = document.querySelectorAll('.tab');
    const checklistItemsContainer = document.getElementById('checklist-items');
    const notificationToast = document.getElementById('notification-toast');
    const activityFeed = document.getElementById('activity-feed');
    
    // Modal Elements
    const modals = document.querySelectorAll('.modal');
    const addItemModal = document.getElementById('add-item-modal');
    const addCategoryModal = document.getElementById('add-category-modal');
    const addMemberModal = document.getElementById('add-member-modal');
    const exportModal = document.getElementById('export-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const editItemModal = document.getElementById('edit-item-modal');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const addExpenseModal = document.getElementById('add-expense-modal');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const saveExpenseBtn = document.getElementById('save-expense-btn');
    
    // Load data from localStorage or use sample data
    let sampleItems = JSON.parse(localStorage.getItem('packpal_items')) || [
        { id: 1, name: 'Tent', category: 'camping', assignedTo: 'sarah', status: 'packed', notes: '4-person tent' },
        { id: 2, name: 'Sleeping Bag', category: 'camping', assignedTo: 'mike', status: 'unpacked', notes: '' },
        { id: 3, name: 'First Aid Kit', category: 'essentials', assignedTo: 'me', status: 'packed', notes: 'Check expiration dates' },
        { id: 4, name: 'Toothbrush', category: 'hygiene', assignedTo: 'me', status: 'delivered', notes: '' },
        { id: 5, name: 'Phone Charger', category: 'tech', assignedTo: 'sarah', status: 'unpacked', notes: 'Bring extra' },
        { id: 6, name: 'Sunscreen', category: 'beach', assignedTo: 'mike', status: 'unpacked', notes: 'SPF 50' },
        { id: 7, name: 'Beach Towels', category: 'beach', assignedTo: 'me', status: 'packed', notes: '2 large towels' },
        { id: 8, name: 'Water Bottles', category: 'essentials', assignedTo: 'sarah', status: 'delivered', notes: '4 reusable bottles' }
    ];
    
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
    
    const members = [
        { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
        { id: 'sarah', name: 'Sarah', role: 'admin', email: 'sarah@example.com' },
        { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' },
        { id: 'emma', name: 'Emma', role: 'viewer', email: 'emma@example.com' }
    ];

    let sampleExpenses = JSON.parse(localStorage.getItem('packpal_expenses')) || [
        { id: 1, description: 'Airbnb Deposit', amount: 400, payer: 'sarah', date: '10/01/2023' },
        { id: 2, description: 'Rental Car', amount: 150, payer: 'mike', date: '10/02/2023' }
    ];

    let sampleItinerary = JSON.parse(localStorage.getItem('packpal_itinerary')) || null;
    let currentItineraryDay = 0;
    
    // App State
    let currentUser = JSON.parse(localStorage.getItem('packpal_currentUser')) || null;
    let currentCategory = localStorage.getItem('packpal_currentCategory') || 'all';
    let currentView = localStorage.getItem('packpal_currentView') || 'dashboard';
    
    // Initialize the app
    function initApp() {
        // Event Listeners
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => switchView(item.dataset.section));
        });
        
        // Modals
        addItemBtn.addEventListener('click', () => showModal(addItemModal));
        addCategoryBtn.addEventListener('click', () => showModal(addCategoryModal));
        addMemberBtn.addEventListener('click', () => showModal(addMemberModal));
        exportListBtn.addEventListener('click', () => showModal(exportModal));
        
        saveItemBtn.addEventListener('click', saveNewItem);
        saveCategoryBtn.addEventListener('click', saveNewCategory);
        inviteMemberBtn.addEventListener('click', inviteNewMember);
        generateExportBtn.addEventListener('click', generateExport);
        if(addExpenseBtn) addExpenseBtn.addEventListener('click', () => { populateExpensePayers(); showModal(addExpenseModal); });
        if(saveExpenseBtn) saveExpenseBtn.addEventListener('click', saveNewExpense);
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                renderChecklistItems();
            });
        });
        
        // Add icon selection functionality
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all icons
                iconOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked icon
                option.classList.add('active');
            });
        });
        
        // Add edit button handler
        saveEditBtn.addEventListener('click', saveEditItem);
        
        // Setup demo login info
        setupDemoLogin();

        // Render the initial member list
        renderMemberList();
    }

    document.body.style.overflow = ''; // Allow scrolling
    
    // Login Handler
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const role = roleSelect.value;

        if (!username || !password) {
            showNotification('Please enter both username and password');
            return;
        }

        // Simple validation for demo purposes
        if (password !== `${role}123`) {
            showNotification('Invalid credentials. Please try again.');
            return;
        }

        currentUser = {
            username,
            role,
            id: role // For demo purposes
        };

        // Save user state to localStorage
        localStorage.setItem('packpal_currentUser', JSON.stringify(currentUser));

        // Update UI based on role
        updateUIForRole(role);
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);

        // Switch screens and render data
        loginScreen.classList.remove('active');
        loginScreen.style.display = 'none';
        mainScreen.classList.add('active');
        mainScreen.style.display = 'block';

        // Show welcome message
        showNotification(`Welcome, ${username}! (${role})`);

        // Render initial data
        renderDashboardStats();
        renderChecklistItems();
    }
    
    // Logout Handler
    function handleLogout() {
        // Reset UI
        mainScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
        mainScreen.classList.remove('active');
        loginScreen.classList.add('active');
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
        roleSelect.value = 'owner';
    }
    
    // Update UI based on user role
    function updateUIForRole(role) {
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Hide/show elements based on role
        const ownerAdminElements = document.querySelectorAll('[data-role="owner"], [data-role="admin"]');
        const memberElements = document.querySelectorAll('[data-role="member"]');
        const viewerElements = document.querySelectorAll('[data-role="viewer"]');
        
        ownerAdminElements.forEach(el => {
            el.style.display = (role === 'owner' || role === 'admin') ? '' : 'none';
        });
        
        memberElements.forEach(el => {
            el.style.display = role === 'member' ? '' : 'none';
        });
        
        viewerElements.forEach(el => {
            el.style.display = role === 'viewer' ? '' : 'none';
        });
        
        // Disable elements for viewer
        if (role === 'viewer') {
            const editableElements = document.querySelectorAll('input, select, textarea, button');
            editableElements.forEach(el => {
                if (!el.classList.contains('close-modal') && el.id !== 'logout-btn') {
                    el.disabled = true;
                }
            });
        }
    }
    
    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
    }
    
    // Switch between views
    function switchView(view) {
        currentView = view;
        
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === view) {
                item.classList.add('active');
            }
        });
        
        // Show the corresponding section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${view}-section`) {
                section.classList.add('active');
            }
        });
        
        // Update content if needed
        if (view === 'dashboard') {
            renderDashboardStats();
        } else if (view === 'checklists') {
            renderChecklistItems();
        } else if (view === 'expenses') {
            renderExpenses();
        } else if (view === 'itinerary') {
            renderItinerary();
        }
    }
    
    // Show modal
    function showModal(modal) {
        closeAllModals();
        
        modal.classList.add('active');
    }
    
    // Close all modals
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    // Show notification toast
    function showNotification(message) {
        const toastMessage = notificationToast.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        notificationToast.classList.add('show');
        
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 3000);
    }
    
    // Render dashboard stats
    function renderDashboardStats() {
        if (!currentUser) return;

        const isMember = currentUser.role === 'member';
        const displayItems = isMember 
            ? sampleItems.filter(item => item.assignedTo === 'me')
            : sampleItems;

        const totalItems = displayItems.length;
        const packedItems = displayItems.filter(item => item.status === 'packed').length;
        const deliveredItems = displayItems.filter(item => item.status === 'delivered').length;
        const totalMembers = members.length;
        
        // Update Labels
        document.getElementById('total-items-label').textContent = isMember ? 'My Items' : 'Total Items';
        document.getElementById('packed-items-label').textContent = isMember ? 'My Packed' : 'Packed';
        document.getElementById('delivered-items-label').textContent = isMember ? 'My Delivered' : 'Delivered';
        document.getElementById('progress-chart-label').textContent = isMember ? 'My Packing Progress' : 'Group Packing Progress';

        // Update Values
        document.getElementById('total-items').textContent = totalItems;
        
        const packedPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
        const deliveredPercent = totalItems > 0 ? Math.round((deliveredItems / totalItems) * 100) : 0;

        document.getElementById('packed-items').innerHTML = `${packedItems} <span class="percentage">(${packedPercent}%)</span>`;
        document.getElementById('delivered-items').innerHTML = `${deliveredItems} <span class="percentage">(${deliveredPercent}%)</span>`;
        document.getElementById('total-members').textContent = totalMembers;
        
        // Update progress bar
        document.querySelector('.progress.packed').style.width = `${packedPercent}%`;
        document.querySelector('.progress.delivered').style.width = `${deliveredPercent}%`;
        
        // Update legend
        const unpackedPercent = 100 - packedPercent - deliveredPercent;
        document.querySelector('.chart-legend').innerHTML = `
            <span><i class="fas fa-square packed"></i> Packed (${packedPercent}%)</span>
            <span><i class="fas fa-square delivered"></i> Delivered (${deliveredPercent}%)</span>
            <span><i class="fas fa-square unpacked"></i> Unpacked (${unpackedPercent}%)</span>
        `;
    }
    
    // Render checklist items
    function renderChecklistItems() {
        checklistItemsContainer.innerHTML = '';
        
        // Filter items based on current category
        let itemsToDisplay = [...sampleItems];
        if (currentCategory !== 'all') {
            itemsToDisplay = sampleItems.filter(item => item.category === currentCategory);
        }
        
        // Filter items based on user role
        if (currentUser.role === 'member') {
            itemsToDisplay = itemsToDisplay.filter(item => item.assignedTo === 'me');
        }
        
        if (itemsToDisplay.length === 0) {
            checklistItemsContainer.innerHTML = '<div class="empty-state">No items found. Add some items to get started!</div>';
            return;
        }
        
        itemsToDisplay.forEach(item => {
            const category = categories.find(cat => cat.id === item.category);
            const assignedMember = members.find(member => member.id === item.assignedTo);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.innerHTML = `
                <div class="item-name">
                    ${item.name}
                    ${category ? `<span class="item-category">${category.name}</span>` : ''}
                </div>
                <div class="item-assigned">
                    <i class="fas fa-user-circle"></i>
                    ${assignedMember ? assignedMember.name : 'Unassigned'}
                </div>
                <div class="item-status">
                    <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                </div>
                <div class="item-actions">
                    ${currentUser.role !== 'viewer' ? `
                    <button class="btn-icon" data-action="edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" data-action="delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            `;
            
            checklistItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.item-actions button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const itemId = parseInt(this.dataset.id);
                
                if (action === 'edit') {
                    editItem(itemId);
                } else if (action === 'delete') {
                    deleteItem(itemId);
                }
            });
        });
    }
    
    // Save new item
    function saveNewItem() {
        const itemName = document.getElementById('item-name').value.trim();
        const itemCategory = document.getElementById('item-category').value;
        const itemAssigned = document.getElementById('item-assigned').value;
        const itemQuantity = document.getElementById('item-quantity').value;
        const itemNotes = document.getElementById('item-notes').value.trim();
        
        if (!itemName) {
            showNotification('Please enter an item name');
            return;
        }
        
        const newItem = {
            id: sampleItems.length + 1,
            name: itemName,
            category: itemCategory,
            assignedTo: itemAssigned,
            status: 'unpacked',
            notes: itemNotes,
            quantity: itemQuantity
        };
        
        sampleItems.push(newItem);
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item added successfully!');
        
        // Clear form
        document.getElementById('item-name').value = '';
        document.getElementById('item-notes').value = '';
    }
    
    // Save new category
    function saveNewCategory() {
        const categoryName = document.getElementById('category-name').value.trim();
        const selectedIcon = document.querySelector('.icon-option.active');
        
        if (!categoryName) {
            showNotification('Please enter a category name');
            return;
        }
        
        if (!selectedIcon) {
            showNotification('Please select an icon');
            return;
        }
        
        const iconName = selectedIcon.dataset.icon;
        
        const newCategory = {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            icon: iconName
        };
        
        categories.push(newCategory);
        
        // Save to localStorage
        localStorage.setItem('packpal_categories', JSON.stringify(categories));
        
        // Update UI
        updateCategoryTabs();
        closeAllModals();
        showNotification('Category added successfully!');
        
        // Clear form
        document.getElementById('category-name').value = '';
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('active'));
    }
    
    // Update category tabs
    function updateCategoryTabs() {
        const tabsContainer = document.querySelector('.tabs-container');
        tabsContainer.innerHTML = '';
        
        // Add "All Items" tab
        const allTab = document.createElement('button');
        allTab.className = 'tab active';
        allTab.dataset.category = 'all';
        allTab.textContent = 'All Items';
        tabsContainer.appendChild(allTab);
        
        // Add category tabs
        categories.filter(cat => cat.id !== 'all').forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'tab';
            tab.dataset.category = category.id;
            tab.innerHTML = `<i class="fas fa-${category.icon}"></i> ${category.name}`;
            tabsContainer.appendChild(tab);
        });
        
        // Reattach event listeners
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                localStorage.setItem('packpal_currentCategory', currentCategory);
                renderChecklistItems();
            });
        });
    }
    
    // Invite new member
    function inviteNewMember() {
        const memberName = document.getElementById('member-name').value.trim();
        const memberEmail = document.getElementById('member-email').value.trim();
        const memberRole = document.getElementById('member-role').value;

        if (!memberName || !memberEmail) {
            showNotification('Please enter member name and email');
            return;
        }

        // Add the new member to the members array
        const newMember = {
            id: memberName.toLowerCase().replace(/\s+/g, '-'),
            name: memberName,
            role: memberRole,
            email: memberEmail
        };
        members.push(newMember);

        // Save the updated members list to localStorage
        localStorage.setItem('packpal_members', JSON.stringify(members));

        // Re-render the member list
        renderMemberList();

        // Show notification
        showNotification(`${memberName} (${memberEmail}) as ${memberRole} added Successfully!`);
        closeAllModals();

        // Clear form
        document.getElementById('member-name').value = '';
        document.getElementById('member-email').value = '';
        document.getElementById('member-role').value = 'member'; // Reset to default role
    }
    
    // Generate export
    function generateExport() {
        const exportFormat = document.getElementById('export-format').value;
        const exportContent = document.querySelectorAll('input[type="checkbox"]:checked');
        const exportLayout = document.getElementById('export-layout').value;
        
        if (exportFormat === 'csv') {
            // Create CSV content
            let csvContent = 'Item Name,Category,Assigned To,Status,Quantity,Notes\n';
            
            // Get items based on layout
            let itemsToExport = [...sampleItems];
            
            if (exportLayout === 'categorized') {
                // Sort by category
                itemsToExport.sort((a, b) => a.category.localeCompare(b.category));
            } else if (exportLayout === 'members') {
                // Sort by assigned member
                itemsToExport.sort((a, b) => a.assignedTo.localeCompare(b.assignedTo));
            }
            
            // Add items to CSV
            itemsToExport.forEach(item => {
                const category = categories.find(cat => cat.id === item.category)?.name || item.category;
                const assignedTo = members.find(member => member.id === item.assignedTo)?.name || item.assignedTo;
                
                // Escape fields that might contain commas
                const escapeCsvField = (field) => {
                    if (field && field.includes(',')) {
                        return `"${field}"`;
                    }
                    return field;
                };
                
                const row = [
                    escapeCsvField(item.name),
                    escapeCsvField(category),
                    escapeCsvField(assignedTo),
                    item.status,
                    item.quantity || '1',
                    escapeCsvField(item.notes || '')
                ].join(',');
                
                csvContent += row + '\n';
            });
            
            // Create and download the CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'packpal_checklist.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Checklist exported as CSV successfully!');
        } else if (exportFormat === 'pdf') {
            showNotification('PDF export coming soon!');
        } else if (exportFormat === 'print') {
            window.print();
            showNotification('Preparing printer-friendly version...');
        }
        
        closeAllModals();
    }
    
    // Edit item
    function editItem(itemId) {
        const item = sampleItems.find(item => item.id === itemId);
        if (!item) return;
        
        // Fill the edit form with item data
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-assigned').value = item.assignedTo;
        document.getElementById('edit-item-status').value = item.status;
        document.getElementById('edit-item-quantity').value = item.quantity || 1;
        document.getElementById('edit-item-notes').value = item.notes || '';
        
        // Show the edit modal
        showModal(editItemModal);
    }

    // Delete item
    function deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            const index = sampleItems.findIndex(item => item.id === itemId);
            if (index !== -1) {
                sampleItems.splice(index, 1);
                // Save to localStorage
                localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
                renderChecklistItems();
                renderDashboardStats();
                showNotification('Item deleted successfully');
            }
        }
    }
    
    // Add new function to save edited item
    function saveEditItem() {
        const itemId = parseInt(document.getElementById('edit-item-id').value);
        const itemIndex = sampleItems.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            showNotification('Item not found');
            return;
        }
        
        const updatedItem = {
            id: itemId,
            name: document.getElementById('edit-item-name').value.trim(),
            category: document.getElementById('edit-item-category').value,
            assignedTo: document.getElementById('edit-item-assigned').value,
            status: document.getElementById('edit-item-status').value,
            quantity: document.getElementById('edit-item-quantity').value,
            notes: document.getElementById('edit-item-notes').value.trim()
        };
        
        if (!updatedItem.name) {
            showNotification('Please enter an item name');
            return;
        }
        
        // Update the item in the array
        sampleItems[itemIndex] = updatedItem;
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item updated successfully!');
    }
    
    // Setup demo login info
    function setupDemoLogin() {
        // Pre-fill demo credentials based on role selection
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            usernameInput.value = role;
            passwordInput.value = `${role}123`;
        });
    }
    
    // Render member list
    function renderMemberList() {
        const memberListContainer = document.querySelector('.members-list'); // Ensure this element exists in your HTML
        if(!memberListContainer) return;
        memberListContainer.innerHTML = ''; // Clear the existing list
    
        members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'member-card';
            memberElement.innerHTML = `
                <div class="member-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="member-info">
                    <h3>${member.name} (${member.role.charAt(0).toUpperCase() + member.role.slice(1)})</h3>
                    <p>${member.email}</p>
                </div>
                <div class="member-stats">
                    <div class="stat">
                        <span class="stat-label">Items Assigned</span>
                        <span class="stat-value">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Packed</span>
                        <span class="stat-value">0</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn-icon">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            `;
            memberListContainer.appendChild(memberElement);
        });
    }

    // Expense Logic
    function renderExpenses() {
        if (!document.getElementById('expenses-section')) return;
        
        let totalCost = 0;
        let memberSpent = {}; 
        let memberOwedShare = {};
        
        // Initialize member accounting
        members.forEach(m => {
            memberSpent[m.id] = 0;
            memberOwedShare[m.id] = 0;
        });
        
        const expensesListEl = document.getElementById('expenses-list');
        if(!expensesListEl) return;
        expensesListEl.innerHTML = '';
        
        if (sampleExpenses.length === 0) {
            expensesListEl.innerHTML = '<div class="empty-state" style="padding:20px; text-align:center;">No expenses recorded yet.</div>';
        } else {
            const sortedExpenses = [...sampleExpenses].reverse();
            
            sortedExpenses.forEach(exp => {
                totalCost += parseFloat(exp.amount);
                
                // Track what money left their literal pocket
                if(memberSpent[exp.payer] !== undefined) {
                    memberSpent[exp.payer] += parseFloat(exp.amount);
                }
                
                // Default to everyone splitting it if older data doesn't have an `involved` array
                const involvedParties = exp.involved || members.map(m => m.id);
                const splitAmount = parseFloat(exp.amount) / involvedParties.length;
                
                // Add debt to everyone involved in this bill
                involvedParties.forEach(pid => {
                    if (memberOwedShare[pid] !== undefined) {
                        memberOwedShare[pid] += splitAmount;
                    }
                });
                
                const payerName = members.find(m => m.id === exp.payer)?.name || 'Unknown';
                const involvedText = involvedParties.length === members.length ? 'Everyone' : `${involvedParties.length} members`;
                
                const el = document.createElement('div');
                el.className = 'expense-item';
                el.innerHTML = `
                    <div class="expense-info">
                        <h4>${exp.description}</h4>
                        <div class="expense-meta">Paid by ${payerName} on ${exp.date} • Split by ${involvedText}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="expense-amount-display">$${parseFloat(exp.amount).toFixed(2)}</div>
                        <button class="btn-icon delete-expense-btn" title="Delete Expense" style="color: var(--danger-color); cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                const deleteBtn = el.querySelector('.delete-expense-btn');
                deleteBtn.addEventListener('click', () => {
                    if(confirm(`Are you sure you want to delete ${exp.description}?`)) {
                        sampleExpenses = sampleExpenses.filter(e => e.id !== exp.id);
                        localStorage.setItem('packpal_expenses', JSON.stringify(sampleExpenses));
                        renderExpenses();
                        showNotification('Expense deleted successfully');
                    }
                });
                
                expensesListEl.appendChild(el);
            });
        }
        
        // Removed generic costPerPerson since it varies now
        document.getElementById('total-trip-cost').textContent = `$${totalCost.toFixed(2)}`;
        
        // If we want to show average, we can, but let's hide or update Cost Per Person generic info
        const avgPerPerson = members.length > 0 ? (totalCost / members.length) : 0;
        document.getElementById('cost-per-person').textContent = `~$${avgPerPerson.toFixed(2)} avg`;
        
        const balancesListEl = document.getElementById('balances-list');
        balancesListEl.innerHTML = '';
        
        members.forEach(m => {
            const spent = memberSpent[m.id];
            const owed = memberOwedShare[m.id];
            const balance = spent - owed;
            
            let amountClass = balance >= 0 ? 'positive' : 'negative';
            let balanceText = '';
            
            if (balance > 0.01) {
                balanceText = `Gets back $${balance.toFixed(2)}`;
            } else if (balance < -0.01) {
                balanceText = `Owes $${Math.abs(balance).toFixed(2)}`;
            } else {
                balanceText = `Settled Up`;
                amountClass = '';
            }
            
            const bEl = document.createElement('div');
            bEl.className = 'balance-item';
            bEl.innerHTML = `
                <div class="balance-user">${m.name}</div>
                <div class="balance-amount ${amountClass}">${balanceText}</div>
            `;
            balancesListEl.appendChild(bEl);
        });
    }

    function populateExpensePayers() {
        const select = document.getElementById('expense-payer');
        const splittersGrid = document.getElementById('expense-splitters');
        
        if (!select || !splittersGrid) return;
        
        select.innerHTML = '';
        splittersGrid.innerHTML = '';
        
        members.forEach(m => {
            // Dropdown options
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name;
            select.appendChild(opt);
            
            // Checkboxes
            const cbHtml = `
                <div class="checkbox-item">
                    <input type="checkbox" id="split-${m.id}" value="${m.id}" class="splitter-cb" checked>
                    <label for="split-${m.id}">${m.name}</label>
                </div>
            `;
            splittersGrid.insertAdjacentHTML('beforeend', cbHtml);
        });
    }

    function saveNewExpense() {
        const desc = document.getElementById('expense-desc').value.trim();
        const amount = document.getElementById('expense-amount').value;
        const payer = document.getElementById('expense-payer').value;
        
        // Find who is splitting this
        const checkboxes = document.querySelectorAll('.splitter-cb:checked');
        const involvedMembers = Array.from(checkboxes).map(cb => cb.value);
        
        if (!desc || !amount) {
            showNotification('Please enter description and amount');
            return;
        }
        
        if (involvedMembers.length === 0) {
            showNotification('At least one person must split the bill');
            return;
        }
        
        const newExp = {
            id: Date.now(),
            description: desc,
            amount: parseFloat(amount),
            payer: payer,
            involved: involvedMembers,
            date: new Date().toLocaleDateString()
        };
        
        sampleExpenses.push(newExp);
        localStorage.setItem('packpal_expenses', JSON.stringify(sampleExpenses));
        
        renderExpenses();
        closeAllModals();
        showNotification('Expense added successfully!');
        
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
    }
    
    // Initialize the app
    initApp();
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Toggle sidebar visibility
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });

    const menuItems = document.querySelectorAll('#sidebar nav ul li');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove 'active' class from all menu items
            menuItems.forEach(menu => menu.classList.remove('active'));
            // Add 'active' class to the clicked menu item
            item.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            // Show the corresponding content section
            const sectionId = `${item.getAttribute('data-section')}-section`;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Toggle sidebar visibility
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Toggle sidebar visibility
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const newGroupBtn = document.getElementById('new-group-btn');

    newGroupBtn.addEventListener('click', function () {
        alert('New Group functionality coming soon!'); // Replace with actual functionality
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('#sidebar nav ul li');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove 'active' class from all menu items
            menuItems.forEach(menu => menu.classList.remove('active'));
            // Add 'active' class to the clicked menu item
            item.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            // Show the corresponding content section
            const sectionId = `${item.getAttribute('data-section')}-section`;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved preference in localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            localStorage.setItem('dark-mode', 'disabled');
        }
    });
});

// Particle Background Animation
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('login-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Mouse properties
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Resize canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseSize = size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }

        update() {
            if (this.x > width || this.x < 0) this.dx = -this.dx;
            if (this.y > height || this.y < 0) this.dy = -this.dy;

            // Interactive hover effect
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < mouse.radius) {
                if (this.size < this.baseSize * 4) {
                    this.size += 1;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.1;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * (innerWidth - size * 2) + size * 2);
            let y = (Math.random() * (innerHeight - size * 2) + size * 2);
            let dx = (Math.random() - 0.5) * 1.5;
            let dy = (Math.random() - 0.5) * 1.5;
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (width/7) * (height/7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    init();
    animate();
});

document.addEventListener('DOMContentLoaded', function () {
    const activityFeed = document.getElementById('activity-feed');

    // Function to add a new activity to the feed
    function addActivity(actionText) {
        const activityItem = document.createElement('li');
        activityItem.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span class="activity-text">${actionText}</span>
            <span class="activity-time">${getCurrentTime()}</span>
        `;
        activityFeed.prepend(activityItem); // Add the new activity to the top of the feed
    }

    // Function to get the current time in "HH:MM AM/PM" format
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    }

    // Example: Add activity when an item is added
    const addItemButton = document.getElementById('save-item-btn');
    if (addItemButton) {
        addItemButton.addEventListener('click', function () {
            const itemName = document.getElementById('item-name').value.trim();
            if (itemName) {
                addActivity(`You added "${itemName}" to the checklist`);
                document.getElementById('item-name').value = ''; // Clear the input field
            }
        });
    }

    // Example: Add activity when an item is marked as packed
    const checklistItems = document.getElementById('checklist-items');
    if (checklistItems) {
        checklistItems.addEventListener('click', function (e) {
            if (e.target.classList.contains('mark-packed-btn')) {
                const itemName = e.target.closest('.checklist-item').querySelector('.item-name').textContent;
                addActivity(`You marked "${itemName}" as packed`);
            }
        });
    }

    // Example: Add activity when an item is edited
    const saveEditButton = document.getElementById('save-edit-btn');
    if (saveEditButton) {
        saveEditButton.addEventListener('click', function () {
            const itemName = document.getElementById('edit-item-name').value.trim();
            if (itemName) {
                addActivity(`You edited the item "${itemName}"`);
            }
        });
    }
});

// Onboarding Tour Logic
document.addEventListener('DOMContentLoaded', function () {
    const onboardingModal = document.getElementById('onboarding-modal');
    const skipBtn = document.getElementById('skip-tour-btn');
    const nextBtn = document.getElementById('next-tour-btn');
    const tourTitle = document.getElementById('tour-title');
    const tourText = document.getElementById('tour-text');
    const tourIcon = document.getElementById('tour-icon');
    const dots = document.querySelectorAll('.tour-progress .dot');
    
    let currentStep = 0;
    
    const tourSteps = [
        {
            title: "Welcome to PackPal!",
            text: "We're so glad you're here. Let's take a quick 3-step tour to show you how to organize your stress-free trip.",
            icon: '<i class="fas fa-plane-departure"></i>'
        },
        {
            title: "Manage Checklists",
            text: "Navigate to the Checklists tab to add items you need to bring. You can categorize them and set quantities.",
            icon: '<i class="fas fa-clipboard-list"></i>'
        },
        {
            title: "Share with Friends",
            text: "Go to the Members tab to invite friends. You can assign items to specific people so everyone knows exactly what to pack!",
            icon: '<i class="fas fa-users"></i>'
        }
    ];

    // Check if user has seen the tour
    // We only want to trigger the tour AFTER they login, so we hook into the login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Give the app a moment to switch from Login screen to Main screen
            setTimeout(() => {
                const hasSeenTour = localStorage.getItem('packpal_hasSeenTour');
                if (!hasSeenTour) {
                    onboardingModal.classList.add('active');
                    updateTourUI();
                }
            }, 300);
        });
    }

    function updateTourUI() {
        // Animate out
        tourIcon.style.transform = 'scale(0.8)';
        tourIcon.style.opacity = '0';
        
        setTimeout(() => {
            tourTitle.textContent = tourSteps[currentStep].title;
            tourText.textContent = tourSteps[currentStep].text;
            tourIcon.innerHTML = tourSteps[currentStep].icon;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentStep);
            });
            
            // Update button text on last step
            if (currentStep === tourSteps.length - 1) {
                nextBtn.textContent = 'Finish Tour';
            } else {
                nextBtn.textContent = 'Next';
            }
            
            // Animate in
            tourIcon.style.transform = 'scale(1)';
            tourIcon.style.opacity = '1';
        }, 200);
    }

    function finishTour() {
        onboardingModal.classList.remove('active');
        localStorage.setItem('packpal_hasSeenTour', 'true');
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < tourSteps.length - 1) {
                currentStep++;
                updateTourUI();
            } else {
                finishTour();
            }
        });
    }
    
    if (skipBtn) {
        skipBtn.addEventListener('click', finishTour);
    }

    // Event listener for fetching weather manually
    const fetchWeatherBtn = document.getElementById('fetch-weather-btn');
    const weatherCityInput = document.getElementById('weather-city-input');
    
    if(fetchWeatherBtn && weatherCityInput) {
        fetchWeatherBtn.addEventListener('click', () => {
            const city = weatherCityInput.value.trim();
            if(city) {
                fetchWeatherForCity(city);
            }
        });
        
        weatherCityInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                const city = weatherCityInput.value.trim();
                if(city) {
                    fetchWeatherForCity(city);
                }
            }
        });
        
        // Auto-load saved city
        const savedCity = localStorage.getItem('packpal_destination');
        if(savedCity) {
            weatherCityInput.value = savedCity;
            fetchWeatherForCity(savedCity);
        }
    }
    
    async function fetchWeatherForCity(city) {
        const display = document.getElementById('weather-display');
        const iconEl = document.getElementById('weather-icon');
        const tempEl = document.getElementById('weather-temp');
        const descEl = document.getElementById('weather-desc');
        
        // Save to local storage
        localStorage.setItem('packpal_destination', city);
        
        try {
            // 1. Geocoding API to get Lat/Lng
            tempEl.textContent = '...';
            descEl.textContent = 'Locating city...';
            display.classList.remove('hidden');
            
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();
            
            if(!geoData.results || geoData.results.length === 0) {
                tempEl.textContent = '--°C';
                descEl.textContent = 'City not found.';
                iconEl.className = 'fas fa-exclamation-circle';
                iconEl.style.color = '#ef4444';
                return;
            }
            
            const { latitude, longitude, name, country } = geoData.results[0];
            
            // 2. Weather API using Lat/Lng
            descEl.textContent = 'Fetching weather...';
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();
            
            const current = weatherData.current_weather;
            const temp = current.temperature;
            const code = current.weathercode;
            const isDay = current.is_day; // 0 or 1
            
            // Map WMO Codes to FontAwesome & descriptions
            let iconClass = 'fas fa-sun';
            let iconColor = '#f59e0b';
            let descText = 'Clear';
            
            // WMO Weather interpretation codes
            if(code === 0) {
                iconClass = isDay ? 'fas fa-sun' : 'fas fa-moon';
                descText = 'Clear sky';
            } else if (code === 1 || code === 2 || code === 3) {
                iconClass = 'fas fa-cloud-sun';
                iconColor = '#9ca3af';
                descText = 'Partly cloudy';
            } else if (code === 45 || code === 48) {
                iconClass = 'fas fa-smog';
                iconColor = '#9ca3af';
                descText = 'Fog';
            } else if (code >= 51 && code <= 67) {
                iconClass = 'fas fa-cloud-rain';
                iconColor = '#3b82f6';
                descText = 'Rain';
            } else if (code >= 71 && code <= 77) {
                iconClass = 'fas fa-snowflake';
                iconColor = '#60a5fa';
                descText = 'Snow';
            } else if (code >= 80 && code <= 82) {
                iconClass = 'fas fa-cloud-showers-heavy';
                iconColor = '#2563eb';
                descText = 'Heavy Rain';
            } else if (code >= 95) {
                iconClass = 'fas fa-bolt';
                iconColor = '#eab308';
                descText = 'Thunderstorm';
            }
            
            iconEl.className = iconClass;
            iconEl.style.color = iconColor;
            tempEl.textContent = `${temp}°C`;
            descEl.textContent = `${descText} in ${name}, ${country}`;
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            tempEl.textContent = '--°C';
            descEl.textContent = 'Failed to load weather.';
            iconEl.className = 'fas fa-exclamation-triangle';
            iconEl.style.color = '#ef4444';
        }
    }
});

// Itinerary Rendering & AI Logic
document.addEventListener('DOMContentLoaded', function() {
    // Wire up the AI generator buttons
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiGenerateModal = document.getElementById('ai-generate-modal');
    const aiSubmitBtn = document.getElementById('ai-submit-btn');

    const showModal = (modal) => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        if (modal) modal.classList.add('active');
    };
    const closeAllModals = () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    };

    if (aiGenerateBtn && aiGenerateModal) {
        aiGenerateBtn.addEventListener('click', () => showModal(aiGenerateModal));
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    if (aiSubmitBtn) {
        aiSubmitBtn.addEventListener('click', generateAIItinerary);
    }

    async function generateAIItinerary() {
        const destination = document.getElementById('ai-destination').value.trim();
        const days = document.getElementById('ai-days').value;
        const budget = document.getElementById('ai-budget').value;
        const vibe = document.getElementById('ai-vibe').value;
        const errorMsg = document.getElementById('ai-error-msg');

        errorMsg.style.display = 'none';

        if (!destination || !days) {
            errorMsg.textContent = 'Please enter a destination and number of days.';
            errorMsg.style.display = 'block';
            return;
        }

        aiSubmitBtn.disabled = true;
        aiSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

        try {
            const response = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, days: parseInt(days), budget, vibe })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate itinerary');
            }

            // Store and render
            window._sampleItinerary = data;
            localStorage.setItem('packpal_itinerary', JSON.stringify(data));
            closeAllModals();
            renderItinerary(data);

            // Show success toast
            const toast = document.getElementById('notification-toast');
            if (toast) {
                toast.querySelector('.toast-message').textContent = `✨ AI generated a ${days}-day itinerary for ${destination}!`;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }

        } catch (err) {
            errorMsg.textContent = err.message || 'Something went wrong. Try again.';
            errorMsg.style.display = 'block';
        } finally {
            aiSubmitBtn.disabled = false;
            aiSubmitBtn.innerHTML = '<i class="fas fa-magic"></i> Build My Itinerary';
        }
    }

    function renderItinerary(itineraryData) {
        const data = itineraryData ||
            window._sampleItinerary ||
            JSON.parse(localStorage.getItem('packpal_itinerary'));

        const daysList = document.getElementById('itinerary-days-list');
        const timeline = document.getElementById('itinerary-timeline');
        const dayLabel = document.getElementById('itinerary-day-label');

        if (!daysList || !timeline) return;

        if (!data || !data.days || data.days.length === 0) {
            daysList.innerHTML = '';
            timeline.innerHTML = `
                <div class="itinerary-empty">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>No itinerary yet. Click <strong>Generate with AI ✨</strong> to build one instantly!</p>
                </div>`;
            return;
        }

        // Render day buttons
        daysList.innerHTML = '';
        data.days.forEach((day, index) => {
            const btn = document.createElement('button');
            btn.className = 'itinerary-day-btn' + (index === 0 ? ' active' : '');
            btn.textContent = day.label || `Day ${day.day}`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.itinerary-day-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderDayTimeline(day, dayLabel, timeline);
            });
            daysList.appendChild(btn);
        });

        // Render first day by default
        renderDayTimeline(data.days[0], dayLabel, timeline);
    }

    function renderDayTimeline(day, labelEl, timelineEl) {
        labelEl.textContent = day.label || `Day ${day.day}`;
        timelineEl.innerHTML = '';

        const eventTypeIcons = {
            food: 'fa-utensils',
            sightseeing: 'fa-camera',
            transport: 'fa-car',
            activity: 'fa-hiking',
            accommodation: 'fa-bed',
            shopping: 'fa-shopping-bag'
        };

        (day.events || []).forEach(event => {
            const iconClass = eventTypeIcons[event.type] || 'fa-circle';
            const typeClass = `event-type-${event.type || 'activity'}`;

            const el = document.createElement('div');
            el.className = 'timeline-event';
            el.innerHTML = `
                <div class="event-time">${event.time}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-desc">${event.description}</div>
                <div class="event-footer">
                    <span class="event-type-badge ${typeClass}">
                        <i class="fas ${iconClass}"></i> ${event.type || 'activity'}
                    </span>
                    ${event.estimatedCost ? `<span class="event-cost">Est. ${event.estimatedCost}</span>` : ''}
                </div>
            `;
            timelineEl.appendChild(el);
        });
    }

    // Auto-load saved itinerary on page load
    const savedItinerary = JSON.parse(localStorage.getItem('packpal_itinerary'));
    if (savedItinerary) {
        window._sampleItinerary = savedItinerary;
    }

    // Make renderItinerary globally available for switchView
    window.renderItinerary = renderItinerary;
});