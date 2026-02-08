export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 class="text-2xl font-bold">Customer Management</h2>
                <button @click="showModal = true; isEdit = false; form = {}" class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <i class="fa-solid fa-user-plus"></i> Add Customer
                </button>
            </div>

            <!-- List -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th class="px-6 py-4">Name</th>
                                <th class="px-6 py-4">Contact Info</th>
                                <th class="px-6 py-4 text-center">Loyalty Points</th>
                                <th class="px-6 py-4 text-right">Total Spent</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="customer in sortedCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                <td class="px-6 py-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">{{ customer.name.charAt(0) }}</div>
                                        {{ customer.name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle text-gray-500">
                                    <div class="flex flex-col">
                                        <span>{{ customer.email }}</span>
                                        <span class="text-xs">{{ customer.phone }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle text-center">
                                    <span class="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-bold">{{ customer.points }}</span>
                                </td>
                                <td class="px-6 py-4 align-middle text-right font-medium text-gray-900">
                                    {{ formatCurrency(getCustomerTotal(customer.id)) }}
                                </td>
                                <td class="px-6 py-4 align-middle text-right space-x-2">
                                    <button class="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Edit">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button class="p-1.5 text-gray-400 hover:text-danger transition-colors cursor-pointer" title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                    <h3 class="font-bold text-lg mb-2">New Customer</h3>
                    <form @submit.prevent="saveCustomer" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Name</label>
                            <input v-model="form.name" required type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input v-model="form.email" type="email" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Phone</label>
                            <input v-model="form.phone" type="tel" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            showModal: false,
            isEdit: false,
            form: { name: '', email: '', phone: '' }
        }
    },
    computed: {
        sortedCustomers() {
            return this.store.customers.slice().sort((a, b) => b.points - a.points);
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        getCustomerTotal(id) {
            // Simplified total calculation
            // In a real app complexity, this should be pre-calculated or indexed
            return this.store.sales
                .filter(s => s.customer && s.customer.id === id)
                .reduce((sum, s) => sum + s.total, 0);
        },
        saveCustomer() {
            this.store.addCustomer(this.form);
            this.showModal = false;
        }
    }
}
