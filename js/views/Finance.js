export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <h2 class="text-2xl font-bold">Financial Overview</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Stat Cards -->
                <div class="bg-gradient-to-br from-success to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                    <p class="text-sm opacity-80 mb-1">Total Revenue</p>
                    <h3 class="text-3xl font-bold">{{ formatCurrency(totalRevenue) }}</h3>
                </div>
                <div class="bg-gradient-to-br from-danger to-rose-600 text-white p-6 rounded-2xl shadow-lg">
                    <p class="text-sm opacity-80 mb-1">Total Expenses</p>
                    <h3 class="text-3xl font-bold">{{ formatCurrency(totalExpenses) }}</h3>
                </div>
                <div class="bg-gradient-to-br from-primary to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <p class="text-sm opacity-80 mb-1">Net Profit</p>
                    <h3 class="text-3xl font-bold">{{ formatCurrency(totalRevenue - totalExpenses) }}</h3>
                </div>
            </div>

            <!-- Expense List -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50">
                    <h3 class="font-bold text-lg">Expense History</h3>
                    <button @click="showModal = true" class="text-primary text-sm font-medium hover:underline">+ Add Expense</button>
                </div>
                
                <div class="flex-1 overflow-y-auto">
                    <div v-for="expense in store.expenses" :key="expense.id" class="flex justify-between items-center p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                            <p class="font-medium text-gray-900 dark:text-gray-100">{{ expense.description }}</p>
                            <p class="text-xs text-gray-400">{{ new Date(expense.date).toLocaleDateString() }}</p>
                        </div>
                        <span class="font-bold text-danger">-{{ formatCurrency(expense.amount) }}</span>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                    <h3 class="font-bold mb-2">Record Expense</h3>
                    <form @submit.prevent="addExpense" class="space-y-4">
                        <input v-model="form.description" required type="text" placeholder="Description (e.g. Rent, Utilities)" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        <input v-model.number="form.amount" required type="number" min="0" step="0.01" placeholder="Amount" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg">Add</button>
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
            form: { description: '', amount: '' }
        }
    },
    computed: {
        totalRevenue() {
            return this.store.sales.reduce((sum, s) => sum + s.total, 0);
        },
        totalExpenses() {
            return this.store.expenses.reduce((sum, e) => sum + e.amount, 0);
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        addExpense() {
            this.store.addExpense(this.form);
            this.showModal = false;
            this.form = { description: '', amount: '' };
        }
    }
}
