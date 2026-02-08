export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <h2 class="text-2xl font-bold">Settings & Configuration</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <!-- Shop Details -->
                <div class="space-y-4">
                    <h3 class="font-bold text-lg mb-4 text-primary border-b border-gray-100 pb-2">Business Details</h3>
                    <div>
                        <label class="block text-sm font-medium mb-1">Shop Name</label>
                        <input v-model="form.shopName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Address</label>
                        <textarea v-model="form.address" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Mobile</label>
                        <input v-model="form.mobile" type="tel" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Currency</label>
                        <select v-model="form.currency" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                            <option value="LKR">LKR (Sri Lankan Rupee)</option>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                </div>

                <!-- Branding & Advanced -->
                <div class="space-y-4">
                    <h3 class="font-bold text-lg mb-4 text-primary border-b border-gray-100 pb-2">Branding</h3>
                    <div>
                        <label class="block text-sm font-medium mb-1">App Logo (URL or Base64)</label>
                        <input v-model="form.logo" type="text" placeholder="https://example.com/logo.png" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary mb-2">
                        <div v-if="form.logo" class="w-24 h-24 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
                            <img :src="form.logo" alt="Preview" class="max-w-full max-h-full object-contain">
                        </div>
                    </div>

                    <h3 class="font-bold text-lg mt-8 mb-4 text-primary border-b border-gray-100 pb-2">Couriers</h3>
                    <div>
                        <label class="block text-sm font-medium mb-1">Courier Partners (comma separated)</label>
                        <input v-model="couriersInput" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        <p class="text-xs text-gray-500 mt-1">Used in shipping tracking dropdown.</p>
                    </div>

                    <h3 class="font-bold text-lg mt-8 mb-4 text-primary border-b border-gray-100 pb-2">Security</h3>
                    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                        <h4 class="font-bold text-sm text-red-800 dark:text-red-400 mb-3">Change Password</h4>
                        <div class="space-y-3">
                            <input v-model="passwordForm.current" type="password" placeholder="Current Password" class="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500">
                            <input v-model="passwordForm.new" type="password" placeholder="New Password" class="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500">
                            <button @click="changePassword" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-red-500/30">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-span-2 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button @click="saveSettings" class="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all">
                        <i class="fa-solid fa-save mr-2"></i> Save Changes
                    </button>
                </div>
            </div>

            <!-- Backup & Restore Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="col-span-2">
                    <h3 class="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                        <i class="fa-solid fa-database"></i> Data Management
                    </h3>
                </div>
                
                <!-- Backup -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h4 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Backup Data</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Download a complete backup of your inventory, sales, customers, and settings.</p>
                    <button @click="downloadBackup" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                        <i class="fa-solid fa-download"></i> Download Backup
                    </button>
                </div>

                <!-- Restore -->
                <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
                    <h4 class="font-bold text-orange-800 dark:text-orange-300 mb-2">Restore Data</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Upload a backup file to restore your system data. <b>Warning: This will overwrite current data.</b></p>
                    <label class="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-upload"></i> Restore from File
                        <input type="file" ref="backupFile" @change="restoreBackup" accept=".json" class="hidden">
                    </label>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            form: { ...this.store.settings },
            couriersInput: this.store.settings.couriers ? this.store.settings.couriers.join(', ') : '',
            passwordForm: { current: '', new: '' }
        }
    },
    methods: {
        saveSettings() {
            const updatedSettings = {
                ...this.form,
                couriers: this.couriersInput.split(',').map(c => c.trim()).filter(c => c.length > 0)
            };
            this.store.updateSettings(updatedSettings);
        },
        changePassword() {
            if (!this.passwordForm.current || !this.passwordForm.new) {
                this.store.addToast('Error', 'Please fill all password fields', 'error');
                return;
            }

            // Validate current password
            if (this.store.currentUser.password !== this.passwordForm.current) {
                this.store.addToast('Error', 'Current password is incorrect', 'error');
                return;
            }

            if (this.store.updateUserPassword(this.store.currentUser.id, this.passwordForm.new)) {
                this.passwordForm = { current: '', new: '' };
            }
        },
        downloadBackup() {
            const data = {
                version: '1.0',
                date: new Date().toISOString(),
                store: {
                    products: this.store.products,
                    categories: this.store.categories,
                    cart: this.store.cart,
                    sales: this.store.sales,
                    customers: this.store.customers,
                    users: this.store.users,
                    quotations: this.store.quotations,
                    social: this.store.social,
                    settings: this.store.settings
                }
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `blling_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.store.addToast('Backup Created', 'Data downloaded successfully', 'success');
        },
        restoreBackup(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);

                    if (!backup.store || !backup.version) {
                        throw new Error('Invalid backup file format');
                    }

                    if (confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
                        // Update Store State
                        Object.assign(this.store, backup.store);

                        // Persist to LocalStorage
                        this.store.save();

                        this.store.addToast('Restore Complete', 'System data restored successfully', 'success');

                        // Optional: Reload to ensure fresh state
                        setTimeout(() => location.reload(), 1500);
                    }
                } catch (err) {
                    console.error(err);
                    this.store.addToast('Restore Failed', 'Invalid or corrupted backup file', 'error');
                }
                // Reset file input
                event.target.value = '';
            };
            reader.readAsText(file);
        }
    }
}
