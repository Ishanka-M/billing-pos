export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <h2 class="text-2xl font-bold flex items-center gap-3">
                <i class="fa-brands fa-facebook text-primary"></i> 
                Social Media Integration
            </h2>

            <div v-if="!store.social.connected" class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 animate-[fadeIn_0.5s_ease-out]">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 relative">
                    <i class="fa-brands fa-meta text-4xl text-blue-600"></i>
                    <span class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                </div>
                
                <h3 class="text-2xl font-bold mb-2">Connect Your Business</h3>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mb-8">Link your Facebook & Instagram pages to manage comments, messages, and orders directly from this dashboard.</p>
                
                <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button @click="connectPlatform('facebook')" :disabled="isConnecting" class="flex-1 flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 active:scale-95">
                        <i v-if="isConnecting === 'facebook'" class="fa-solid fa-circle-notch fa-spin"></i>
                        <i v-else class="fa-brands fa-facebook text-xl"></i>
                        Connect Facebook
                    </button>
                    <button @click="connectPlatform('instagram')" :disabled="isConnecting" class="flex-1 flex items-center justify-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/30 disabled:opacity-70 active:scale-95">
                        <i v-if="isConnecting === 'instagram'" class="fa-solid fa-circle-notch fa-spin"></i>
                        <i v-else class="fa-brands fa-instagram text-xl"></i>
                        Connect Instagram
                    </button>
                </div>
                
                <div class="mt-8 flex items-center gap-2 text-xs text-gray-400">
                    <i class="fa-solid fa-lock"></i> Secure Connection with Meta Graph API
                </div>
            </div>

            <div v-else class="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                <!-- Message List -->
                <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 flex justify-between items-center">
                        <h3 class="font-bold">Recent Inquiries</h3>
                        <span class="text-xs font-bold bg-success/10 text-success px-2 py-1 rounded-full">Connected</span>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto">
                        <div v-for="comment in store.social.comments" :key="comment.id" class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-center gap-2">
                                    <i :class="['fa-brands', comment.platform === 'facebook' ? 'fa-facebook text-blue-600' : 'fa-instagram text-pink-500', 'text-lg']"></i>
                                    <span class="font-bold text-sm">{{ comment.user }}</span>
                                    <span class="text-xs text-gray-400">on {{ new Date(comment.date).toLocaleDateString() }}</span>
                                </div>
                                <span class="bg-primary/10 text-primary text-xs px-2 py-1 rounded">{{ comment.product }}</span>
                            </div>
                            <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">{{ comment.text }}</p>
                            
                            <div v-if="comment.reply" class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 border-l-4 border-primary">
                                <span class="font-bold text-xs block mb-1 text-primary">You replied:</span>
                                {{ comment.reply }}
                            </div>

                            <div v-else class="flex gap-2">
                                <input v-model="replyText[comment.id]" type="text" placeholder="Write a reply..." class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                                <button @click="sendReply(comment.id)" class="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-bold transition-colors">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Simulation Info (for prototype) -->
                <div class="w-full lg:w-80 bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl h-fit border border-blue-100 dark:border-gray-700">
                    <h4 class="font-bold text-primary mb-2"><i class="fa-solid fa-circle-info"></i> Prototype Mode</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Since this is a client-side demo, we are simulating a connection. In a production environment, this would connect to the Meta Graph API.
                    </p>
                    <div class="space-y-2">
                        <button @click="simulateNewComment" class="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-lg text-sm shadow-sm hover:translate-x-1 transition-transform border border-transparent hover:border-primary">
                            <i class="fa-solid fa-plus-circle text-success mr-2"></i> Simulate New Comment
                        </button>
                         <button @click="store.save()" class="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-lg text-sm shadow-sm hover:translate-x-1 transition-transform border border-transparent hover:border-primary">
                            <i class="fa-solid fa-save text-primary mr-2"></i> Force Sync Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            replyText: {},
            isConnecting: false
        }
    },
    methods: {
        connectPlatform(platform) {
            this.isConnecting = platform;

            // Simulate OAuth Redirect
            setTimeout(() => {
                const width = 600, height = 700;
                const left = (screen.width / 2) - (width / 2);
                const top = (screen.height / 2) - (height / 2);

                const authWindow = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
                authWindow.document.write(`
                    <div style="font-family:system-ui;text-align:center;padding:50px;">
                        <svg width="60" height="60" viewBox="0 0 32 32" fill="#1877F2" style="margin-bottom:20px"><path d="M32 16.08c0-8.84-7.16-16-16-16S0 7.24 0 16.08c0 8.02 5.96 14.64 13.5 15.82v-11.2h-4.06V16.08h4.06v-3.52c0-4.02 2.39-6.24 6.06-6.24 1.76 0 3.6.31 3.6.31v3.95h-2.03c-1.99 0-2.61 1.23-2.61 2.49v2.99h4.45l-.71 4.62h-3.74v11.2C26.04 30.72 32 24.1 32 16.08z"/></svg>
                        <h2 style="margin:0;">Connecting to ${platform}...</h2>
                        <p style="color:#666;">Please wait while we authenticate your business account.</p>
                        <div style="margin-top:20px;width:30px;height:30px;border:3px solid #ddd;border-top-color:#1877F2;border-radius:50%;margin-left:auto;margin-right:auto;animation:spin 1s linear infinite;"></div>
                        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
                        <script>
                            setTimeout(() => {
                                window.opener.postMessage('auth-success', '*');
                                window.close();
                            }, 2000);
                        </script>
                    </div>
                `);

                // Listen for simulated success
                window.addEventListener('message', (event) => {
                    if (event.data === 'auth-success') {
                        this.store.social.connected = true;
                        this.store.save();
                        this.store.addToast('Connected', `Successfully linked ${platform} account`, 'success');
                        this.isConnecting = false;
                    }
                }, { once: true });
            }, 500);
        },
        sendReply(id) {
            const text = this.replyText[id];
            if (!text) return;

            this.store.replyToComment(id, text);
            this.replyText[id] = '';
        },
        simulateNewComment() {
            const names = ['Amara Perera', 'Sunil Kumar', 'Dilini Silva'];
            const products = this.store.products.map(p => p.name);
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];

            this.store.social.comments.unshift({
                id: Date.now(),
                user: randomName,
                text: 'Is this available for delivery to Kandy?',
                product: randomProduct,
                platform: Math.random() > 0.5 ? 'facebook' : 'instagram',
                date: new Date().toISOString(),
                reply: ''
            });
            this.store.save();
            this.store.addToast('New Notification', `New comment from ${randomName}`, 'info');
        }
    }
}
