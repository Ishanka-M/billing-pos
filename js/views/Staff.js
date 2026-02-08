export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold">Staff Management</h2>
                <button @click="openModal()" class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <i class="fa-solid fa-user-shield"></i> Add User
                </button>
            </div>

            <!-- User List -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th class="px-6 py-4">Name</th>
                                <th class="px-6 py-4">Username</th>
                                <th class="px-6 py-4">Role</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="user in store.users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td class="px-6 py-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs uppercase">{{ user.name.charAt(0) }}</div>
                                        {{ user.name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle text-gray-500 font-mono">{{ user.username }}</td>
                                <td class="px-6 py-4 align-middle">
                                    <span :class="['px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 uppercase', 
                                        user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300']">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-middle text-right">
                                    <button v-if="user.id !== store.currentUser.id" @click="confirmDelete(user.id)" class="text-gray-400 hover:text-danger transition-colors cursor-pointer" title="Delete">
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
                <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                    <h3 class="font-bold mb-2">New Staff User</h3>
                    <form @submit.prevent="saveUser" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Full Name</label>
                            <input v-model="form.name" required type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Username</label>
                            <input v-model="form.username" required type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Password</label>
                            <input v-model="form.password" required type="password" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Role</label>
                            <select v-model="form.role" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg">Add User</button>
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
            form: { name: '', username: '', password: '', role: 'staff' }
        }
    },
    methods: {
        openModal() {
            this.form = { name: '', username: '', password: '', role: 'staff' };
            this.showModal = true;
        },
        saveUser() {
            this.store.addUser(this.form);
            this.showModal = false;
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                this.store.removeUser(id);
            }
        }
    }
}
