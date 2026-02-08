export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <h2 class="text-2xl font-bold">Shipping & Tracking</h2>

            <!-- Orders List -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th class="px-6 py-4">Invoice #</th>
                                <th class="px-6 py-4">Date</th>
                                <th class="px-6 py-4">Customer</th>
                                <th class="px-6 py-4 text-center">Status</th>
                                <th class="px-6 py-4">Courier Info</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td class="px-6 py-4 font-mono text-gray-900 dark:text-gray-100">#{{ sale.id }}</td>
                                <td class="px-6 py-4 text-gray-500">{{ new Date(sale.date).toLocaleDateString() }}</td>
                                <td class="px-6 py-4">
                                    <div v-if="sale.customer">
                                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ sale.customer.name }}</div>
                                        <div class="text-xs text-gray-500">{{ sale.customer.address || 'No Address' }}</div>
                                    </div>
                                    <span v-else class="text-gray-400 italic">Walk-in Customer</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span :class="['px-2.5 py-1 rounded-full text-xs font-bold uppercase', 
                                        getStatusColor(sale.tracking?.status)]">
                                        {{ sale.tracking?.status || 'Pending' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div v-if="sale.tracking?.courier">
                                        <div class="font-medium text-primary">{{ sale.tracking.courier }}</div>
                                        <div class="text-xs font-mono text-gray-500 tracking-wider">{{ sale.tracking.number }}</div>
                                    </div>
                                    <span v-else class="text-gray-400 text-xs italic">Not Assigned</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button @click="openModal(sale)" class="text-primary hover:text-primary-600 font-medium text-sm">
                                        Update Tracking
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                    <h3 class="font-bold mb-2">Update Tracking Info</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Carrier</label>
                            <select v-model="form.courier" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                                <option value="">Select Courier</option>
                                <option v-for="courier in store.settings.couriers" :key="courier" :value="courier">{{ courier }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Tracking Number</label>
                            <input v-model="form.number" type="text" placeholder="e.g. DOMEX-123456" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status</label>
                            <select v-model="form.status" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4">
                            <button @click="showModal = false" class="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                            <button @click="saveTracking" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            showModal: false,
            selectedSaleId: null,
            form: { courier: '', number: '', status: 'Pending' }
        }
    },
    computed: {
        recentSales() {
            // Sort by date desc
            return this.store.sales.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },
    methods: {
        getStatusColor(status) {
            switch (status) {
                case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
                case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
                case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
                default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
            }
        },
        openModal(sale) {
            this.selectedSaleId = sale.id;
            this.form = { ...sale.tracking } || { courier: '', number: '', status: 'Pending' };
            this.showModal = true;
        },
        saveTracking() {
            this.store.updateSaleTracking(this.selectedSaleId, this.form);
            this.showModal = false;
        }
    }
}
