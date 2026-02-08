export default {
    template: `
        <div class="h-full flex items-center justify-center bg-gray-50 dark:bg-dark">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <div class="text-center mb-8">
                    <i class="fa-solid fa-infinity text-primary text-4xl mb-3"></i>
                    <h2 class="text-2xl font-bold">Welcome Back</h2>
                    <p class="text-gray-500 text-sm">Sign in to Infinite Manage Pro</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                        <div class="relative">
                            <i class="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input v-model="username" type="text" class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Enter username">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                        <div class="relative">
                            <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input v-model="password" type="password" class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="••••••••">
                        </div>
                    </div>

                    <div v-if="error" class="p-3 bg-danger/10 text-danger text-sm rounded-lg flex items-center gap-2">
                        <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
                    </div>

                    <button type="submit" class="w-full bg-primary hover:bg-primary-600 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-95">
                        Sign In
                    </button>
                    
                    <div class="mt-8 text-center">
                        <p class="text-[10px] text-gray-400 uppercase tracking-widest">Developed by</p>
                        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Infinite System Solution</p>
                    </div>
                </form>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            username: '',
            password: '',
            error: ''
        }
    },
    methods: {
        handleLogin() {
            if (this.store.login(this.username, this.password)) {
                this.$emit('login-success');
            } else {
                this.error = 'Invalid username or password';
                this.password = '';
            }
        }
    }
}
