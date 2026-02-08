import { reactive, watch } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const STORAGE_KEY = 'infinite_manage_pro_v1';

// Default Data 
const defaultData = {
    products: [
        { id: 1, name: 'Wireless Mouse', sku: 'WM-001', category: 'Accessories', cost_price: 1500.00, wholesale_price: 2000.00, price: 2500.00, stock: 45, min_stock: 10 },
        { id: 2, name: 'Mechanical Keyboard', sku: 'MK-102', category: 'Accessories', cost_price: 6000.00, wholesale_price: 7500.00, price: 8900.00, stock: 12, min_stock: 5 },
        { id: 3, name: '27" Monitor', sku: 'MN-270', category: 'Hardware', cost_price: 35000.00, wholesale_price: 40000.00, price: 45000.00, stock: 3, min_stock: 5 },
        { id: 4, name: 'USB-C Cable', sku: 'CB-200', category: 'Cables', cost_price: 500.00, wholesale_price: 900.00, price: 1200.00, stock: 100, min_stock: 20 },
    ],
    categories: ['Accessories', 'Hardware', 'Cables', 'Services'],
    customers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '077-1234567', points: 150, address: 'Colombo' },
        { id: 2, name: 'Jane Smith', email: 'jane@test.co', phone: '071-9876543', points: 340, address: 'Kandy' },
    ],
    users: [
        { id: 1, name: 'Admin User', username: 'admin', password: '123', role: 'admin' },
        { id: 2, name: 'Sales Staff', username: 'staff', password: '123', role: 'staff' },
    ],
    sales: [],
    quotations: [],
    expenses: [],
    social: {
        connected: true,
        comments: [
            { id: 1, user: 'Kamal Perera', text: 'Do you have this in stock?', product: 'Mechanical Keyboard', platform: 'facebook', date: '2023-10-25T10:00:00', reply: '' },
            { id: 2, user: 'Nimali Silva', text: 'Price please?', product: '27" Monitor', platform: 'instagram', date: '2023-10-26T09:30:00', reply: '' }
        ]
    },
    settings: {
        currency: 'LKR',
        taxRate: 0.0,
        shopName: 'Infinite Tech Store',
        address: 'Colombo 03, Sri Lanka',
        mobile: '077-1234567',
        logo: null,
        couriers: ['Domex', 'Prompt', 'Certis', 'PickMe Flash']
    }
};

// Load Initial State
const savedState = localStorage.getItem(STORAGE_KEY);
const initialState = savedState ? JSON.parse(savedState) : defaultData;

// Handle potential missing new fields
if (!initialState.users) initialState.users = defaultData.users;
if (!initialState.social) initialState.social = defaultData.social;
if (!initialState.quotations) initialState.quotations = defaultData.quotations;
if (!initialState.settings.couriers) initialState.settings.couriers = defaultData.settings.couriers;

export const store = reactive({
    ...initialState,
    currentUser: JSON.parse(localStorage.getItem('imp_user')),
    sidebarCollapsed: false,
    darkMode: false,
    toasts: [],
    toastId: 0,
    isServerMode: window.location.protocol.startsWith('http'), // True if valid HTTP/HTTPS (not file://)

    async init() {
        // If we are served via HTTP, try to sync with the backend
        if (this.isServerMode) {
            try {
                const response = await fetch('/api/data');
                if (response.ok) {
                    const data = await response.json();
                    // Merge server data
                    if (data.products) this.products = data.products;
                    if (data.categories) this.categories = data.categories;
                    if (data.customers) this.customers = data.customers;
                    if (data.users) this.users = data.users;
                    if (data.sales) this.sales = data.sales;
                    if (data.quotations) this.quotations = data.quotations;
                    if (data.social) this.social = data.social;
                    if (data.settings) this.settings = data.settings;

                    console.log('Synced with Server');
                }
            } catch (e) {
                console.warn('Server sync failed, using local data', e);
            }
        }
    },

    // Auth Actions
    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('imp_user', JSON.stringify(user));
            return true;
        }
        return false;
    },
    logout() {
        this.currentUser = null;
        localStorage.removeItem('imp_user');
    },

    // User Management
    addUser(user) {
        this.users.push({ ...user, id: Date.now() });
        this.save();
        this.addToast('Success', 'User added successfully', 'success');
    },
    removeUser(id) {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx !== -1) {
            this.users.splice(idx, 1);
            this.save();
        }
    },
    updateUserPassword(id, newPassword) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.password = newPassword;
            if (this.currentUser && this.currentUser.id === id) {
                this.currentUser.password = newPassword;
                localStorage.setItem('imp_user', JSON.stringify(this.currentUser));
            }
            this.save();
            this.addToast('Success', 'Password updated successfully', 'success');
            return true;
        }
        return false;
    },

    // Social Media
    replyToComment(id, replyText) {
        const comment = this.social.comments.find(c => c.id === id);
        if (comment) {
            comment.reply = replyText;
            this.save();
            this.addToast('Sent', 'Reply posted successfully', 'success');
        }
    },
    shareProduct(product) {
        const text = `Check out ${product.name} for ${this.settings.currency} ${product.price}! Available at ${this.store?.settings?.shopName || 'Infinite Tech'}.`;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            this.addToast('Copied', 'Product details copied to clipboard', 'info');
        }
    },

    // Actions
    addProduct(product) {
        this.products.push({ ...product, id: Date.now() });
        this.save();
        this.addToast('Success', 'Product added successfully', 'success');
    },
    updateProduct(id, updates) {
        const idx = this.products.findIndex(p => p.id === id);
        if (idx !== -1) {
            this.products[idx] = { ...this.products[idx], ...updates };
            this.save();
            this.addToast('Updated', 'Product details updated', 'success');
        }
    },
    updateStock(id, quantity) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            product.stock -= quantity;
            this.save();
        }
    },
    addSale(sale) {
        const newSale = {
            ...sale,
            id: Date.now(),
            date: new Date().toISOString(),
            tracking: { status: 'Pending', courier: '', number: '' }
        };
        this.sales.unshift(newSale); // Add to top
        sale.items.forEach(item => {
            this.updateStock(item.id, item.qty); // This calls save() internally, creating multiple saves. Optimized below.
        });
        this.save(); // Final save to ensure everything is consistent
        this.addToast('Sale Complete', `Invoice #${newSale.id} generated`, 'success');
    },
    updateSaleTracking(saleId, trackingData) {
        const sale = this.sales.find(s => s.id === saleId);
        if (sale) {
            sale.tracking = { ...sale.tracking, ...trackingData };
            this.save();
            this.addToast('Updated', 'Tracking information saved', 'success');
        }
    },
    addQuotation(quotation) {
        this.quotations.push({ ...quotation, id: Date.now(), date: new Date().toISOString() });
        this.save();
        this.addToast('Success', 'Quotation generated', 'success');
    },
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.save();
        this.addToast('Saved', 'System settings updated', 'success');
    },
    addCustomer(customer) {
        this.customers.push({ ...customer, id: Date.now(), points: 0 });
        this.save();
        this.addToast('Success', 'New customer registered', 'success');
    },
    addExpense(expense) {
        this.expenses.push({ ...expense, id: Date.now(), date: new Date().toISOString() });
        this.save();
    },

    // UI Utilities
    addToast(title, message, type = 'info') {
        const id = this.toastId++;
        this.toasts.push({ id, title, message, type });
        setTimeout(() => this.removeToast(id), 3000);
    },
    removeToast(id) {
        const idx = this.toasts.findIndex(t => t.id === id);
        if (idx !== -1) this.toasts.splice(idx, 1);
    },
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },
    async save() {
        // 1. Save to Local Storage (Cache/Offline)
        const dataToSave = {
            products: this.products,
            categories: this.categories,
            customers: this.customers,
            users: this.users,
            social: this.social,
            sales: this.sales,
            quotations: this.quotations,
            expenses: this.expenses,
            settings: this.settings
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

        // 2. Sync to Server (if available)
        if (this.isServerMode) {
            try {
                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave)
                });
            } catch (e) {
                console.error('Save to server failed', e);
                this.addToast('Sync Error', 'Could not save to main server', 'error');
            }
        }
    }
});

// Auto-run init
store.init();

// Watch for external changes if needed (e.g. multi-tab sync via storage event)
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        // Simple reload for sync (basic implementation)
        const newData = JSON.parse(e.newValue);
        Object.assign(store, newData);
    }
});
