export default {
    template: `
        <div class="h-full flex flex-col relative">
            <!-- Toolbar -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <!-- Search & Filters -->
                <div class="flex items-center gap-4 flex-1">
                    <div class="relative flex-1 max-w-sm">
                        <input v-model="searchQuery" type="text" placeholder="Search product name, SKU..." 
                            class="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <select v-model="filterCategory" class="text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 focus:ring-2 focus:ring-primary transition-all">
                        <option value="">All Categories</option>
                        <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>
                
                <!-- Actions -->
                <button @click="openModal()" class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <i class="fa-solid fa-plus"></i> Add Product
                </button>
            </div>

            <!-- Data Table -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th class="px-6 py-4">Product Name</th>
                                <th class="px-6 py-4">SKU</th>
                                <th class="px-6 py-4">Category</th>
                                <th class="px-6 py-4 text-right">Price</th>
                                <th class="px-6 py-4 text-center">Stock Details</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                <td class="px-6 py-4 align-middle">
                                    <div class="font-medium text-gray-900 dark:text-gray-100">{{ product.name }}</div>
                                </td>
                                <td class="px-6 py-4 align-middle text-gray-500 font-mono">{{ product.sku }}</td>
                                <td class="px-6 py-4 align-middle text-gray-500">{{ product.category }}</td>
                                <td class="px-6 py-4 align-middle text-right font-medium text-gray-900">{{ formatCurrency(product.price) }}</td>
                                <td class="px-6 py-4 align-middle text-center">
                                    <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5', 
                                        product.stock <= product.min_stock ? 'bg-danger/10 text-danger' : 
                                        product.stock < product.min_stock * 2 ? 'bg-warning/10 text-warning' : 
                                        'bg-success/10 text-success']">
                                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {{ product.stock }} Units
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-middle text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="openModal(product)" class="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Edit">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button @click="store.shareProduct(product)" class="p-1.5 text-gray-400 hover:text-accent transition-colors cursor-pointer" title="Share on Social Media">
                                        <i class="fa-solid fa-share-nodes"></i>
                                    </button>
                                    <button class="p-1.5 text-gray-400 hover:text-danger transition-colors cursor-pointer" title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredProducts.length === 0">
                                <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                                    <i class="fa-solid fa-box-open text-4xl mb-3 opacity-50"></i>
                                    <p>No products found matching your criteria.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Modal (Teleported to body if using full Vue build, but here just fixed overlay) -->
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform transition-all scale-100">
                    <div class="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                        <h3 class="font-bold text-lg">{{ isEdit ? 'Edit Product' : 'New Product' }}</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    <form @submit.prevent="saveProduct" class="p-6 space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                                <input v-model="form.name" required type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                                <input v-model="form.sku" required type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select v-model="form.category" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retail Price</label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{{ store.settings.currency }}</span>
                                    <input v-model.number="form.price" required type="number" step="0.01" min="0" class="w-full pl-12 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                                </div>
                            </div>
                            
                            <!-- Advanced Pricing -->
                            <div class="col-span-2 grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div class="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Business Pricing</div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{{ store.settings.currency }}</span>
                                        <input @input="notifyPriceUpdate" v-model.number="form.cost_price" type="number" step="0.01" min="0" class="w-full pl-12 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wholesale Price</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{{ store.settings.currency }}</span>
                                        <input v-model.number="form.wholesale_price" type="number" step="0.01" min="0" class="w-full pl-12 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Qty</label>
                                <input v-model.number="form.stock" required type="number" min="0" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Stock Alert</label>
                                <input v-model.number="form.min_stock" type="number" min="0" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Images (Max 4)</label>
                                <div class="grid grid-cols-4 gap-2 mb-2">
                                    <div v-for="(img, idx) in form.images" :key="idx" class="relative group aspect-square rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50">
                                        <img :src="img" class="w-full h-full object-cover">
                                        <button type="button" @click="removeImage(idx)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <label v-if="!form.images || form.images.length < 4" class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors aspect-square">
                                        <i class="fa-solid fa-cloud-arrow-up text-gray-400"></i>
                                        <span class="text-[10px] text-gray-500 mt-1">Upload</span>
                                        <input type="file" ref="fileInput" @change="handleImageUpload" multiple accept="image/*" class="hidden">
                                    </label>
                                    
                                    <!-- Mobile Upload Button -->
                                    <button type="button" v-if="!form.images || form.images.length < 4" @click="startMobileUpload" class="flex flex-col items-center justify-center border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors aspect-square text-primary">
                                        <i class="fa-solid fa-qrcode text-xl"></i>
                                        <span class="text-[10px] mt-1 text-center leading-tight">Scan from<br>Mobile</span>
                                    </button>
                                </div>
                                <p class="text-xs text-gray-500">Supported: JPG, PNG. Max size recommended.</p>
                            </div>
                        </div>
                        
                        <!-- QR Modal Overlay -->
                        <div v-if="showQR" class="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col items-center justify-center z-10 p-6 text-center">
                            <h4 class="font-bold text-lg mb-2">Scan with Mobile</h4>
                            <p class="text-xs text-gray-500 mb-6 max-w-xs">Scan this QR code with your phone camera to instantly upload photos to this product.</p>
                            
                            <div id="qrcode" class="bg-white p-4 rounded-xl shadow-lg mb-6"></div>
                            
                            <div class="flex items-center gap-2 text-xs text-gray-400 mb-6">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Listening for connection...
                            </div>
                            
                            <button type="button" @click="closeQR" class="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">Cancel</button>
                        </div>

                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg transition-colors shadow-sm">
                                {{ isEdit ? 'Update Product' : 'Save Product' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            searchQuery: '',
            filterCategory: '',
            showModal: false,
            isEdit: false,
            form: {
                id: null, name: '', sku: '', category: '', price: 0, cost_price: 0, wholesale_price: 0, stock: 0, min_stock: 5, images: []
            },
            showQR: false,
            peer: null,
            _notified: false
        }
    },
    computed: {
        filteredProducts() {
            return this.store.products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.filterCategory || p.category === this.filterCategory;
                return matchesSearch && matchesCategory;
            });
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        openModal(product = null) {
            this.isEdit = !!product;
            if (product) {
                this.form = { ...product, images: product.images || [] };
            } else {
                this.form = { id: null, name: '', sku: '', category: this.store.categories[0] || '', price: 0, cost_price: 0, wholesale_price: 0, stock: 0, min_stock: 5, images: [] };
            }
            this.showModal = true;
        },
        notifyPriceUpdate() {
            if (!this._notified) {
                this.store.addToast('Price Alert', 'Cost price changed. Please update Wholesale/Retail prices if needed.', 'warning');
                this._notified = true;
                setTimeout(() => this._notified = false, 5000);
            }
        },
        handleImageUpload(event) {
            const files = event.target.files;
            if (!files) return;

            if (!this.form.images) this.form.images = [];
            const remaining = 4 - this.form.images.length;

            Array.from(files).slice(0, remaining).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.images.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });

            // Reset input
            if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        },

        startMobileUpload() {
            this.showQR = true;
            // Init Peer
            if (this.peer) this.peer.destroy();

            this.peer = new Peer(); // Random ID

            this.peer.on('open', (id) => {
                // Generate QR Code
                const uploadUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?mobile=true&target=${id}`;
                console.log('Mobile URL:', uploadUrl);

                // Clear previous QR
                const qrContainer = document.getElementById('qrcode');
                if (qrContainer) {
                    qrContainer.innerHTML = '';
                    new QRCode(qrContainer, {
                        text: uploadUrl,
                        width: 200,
                        height: 200
                    });
                }
            });

            this.peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    // Expect { type: 'image', data: base64 }
                    if (data && data.type === 'image' && data.data) {
                        if (!this.form.images) this.form.images = [];
                        if (this.form.images.length < 4) {
                            this.form.images.push(data.data);
                            this.store.addToast('Success', 'Image received from mobile', 'success');
                            this.closeQR();
                        }
                    }
                });
            });

            this.peer.on('error', (err) => {
                console.error(err);
                this.store.addToast('Error', 'Connection failed', 'error');
                this.closeQR();
            });
        },

        closeQR() {
            this.showQR = false;
            if (this.peer) {
                this.peer.destroy();
                this.peer = null;
            }
        },

        removeImage(idx) {
            this.form.images.splice(idx, 1);
        },
        closeModal() {
            this.showModal = false;
            this.closeQR();
        },
        saveProduct() {
            if (this.isEdit) {
                this.store.updateProduct(this.form.id, this.form);
            } else {
                this.store.addProduct(this.form);
            }
            this.closeModal();
        }
    }
}
