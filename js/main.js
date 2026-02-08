import { createApp, computed, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { store } from './store.js';
import Login from './views/Login.js';
import Dashboard from './views/Dashboard.js';
import Inventory from './views/Inventory.js';
import POS from './views/POS.js';
import Customers from './views/Customers.js';
import Finance from './views/Finance.js';
import Staff from './views/Staff.js';
import Tracking from './views/Tracking.js';
import Settings from './views/Settings.js';
import Quotations from './views/Quotations.js';
import MobileUpload from './views/MobileUpload.js';

const app = createApp({
    setup() {
        const urlParams = new URLSearchParams(window.location.search);
        const isMobileUpload = urlParams.get('mobile') === 'true';
        const targetPeerId = urlParams.get('target');

        const currentView = ref('dashboard');
        const isSidebarCollapsed = ref(false);

        const allMenuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', roles: ['admin', 'staff'] },
            { id: 'pos', label: 'POS & Billing', icon: 'fa-solid fa-cash-register', roles: ['admin', 'staff'] },
            { id: 'tracking', label: 'Courier & Tracking', icon: 'fa-solid fa-truck-fast', roles: ['admin', 'staff'] },
            { id: 'inventory', label: 'Inventory', icon: 'fa-solid fa-boxes-stacked', roles: ['admin', 'staff'] },
            { id: 'quotations', label: 'Quotations', icon: 'fa-solid fa-file-invoice', roles: ['admin', 'staff'] },
            { id: 'customers', label: 'Customers', icon: 'fa-solid fa-users', roles: ['admin', 'staff'] },
            { id: 'finance', label: 'Finance', icon: 'fa-solid fa-file-invoice-dollar', roles: ['admin'] },
            { id: 'staff', label: 'Staff Management', icon: 'fa-solid fa-user-gear', roles: ['admin'] },
            { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear', roles: ['admin'] },
        ];

        const components = {
            login: Login,
            dashboard: Dashboard,
            inventory: Inventory,
            pos: POS,
            customers: Customers,
            finance: Finance,
            staff: Staff,
            tracking: Tracking,
            settings: Settings,
            quotations: Quotations,
            mobileUpload: MobileUpload
        };

        const isLoggedIn = computed(() => !!store.currentUser);

        const menuItems = computed(() => {
            if (!store.currentUser) return [];
            return allMenuItems.filter(item => item.roles.includes(store.currentUser.role));
        });

        const currentViewComponent = computed(() => {
            if (isMobileUpload && targetPeerId) return components.mobileUpload;
            if (!isLoggedIn.value) return Login;
            return components[currentView.value] || Dashboard;
        });

        const viewProps = computed(() => {
            if (isMobileUpload) return { targetId: targetPeerId };
            return { store };
        });

        const currentViewDetails = computed(() => {
            if (isMobileUpload) return { label: 'Product Photo Upload' };
            return menuItems.value.find(i => i.id === currentView.value) || { label: 'Infinite Pro' };
        });

        const isDark = computed(() => store.darkMode);

        const toggleTheme = () => {
            store.darkMode = !store.darkMode;
            if (store.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        const logout = () => {
            store.logout();
            currentView.value = 'dashboard';
        };

        // Initialize Theme
        if (store.darkMode) {
            document.documentElement.classList.add('dark');
        }

        // Initialize Store (Fetch from server if needed)
        store.init();

        return {
            store,
            currentView,
            isSidebarCollapsed,
            menuItems,
            currentViewComponent,
            currentViewDetails,
            viewProps,
            isDark,
            isLoggedIn,
            toggleTheme,
            logout,
            handleAction: (action) => console.log('Action:', action)
        };
    }
});

app.mount('#app');
