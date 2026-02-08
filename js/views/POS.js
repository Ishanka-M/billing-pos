export default {
    template: `
        <div class="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
            <!-- Product Selection (Left) -->
            <div class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <!-- Search Bar -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-barcode absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input v-model="searchQuery" ref="searchInput" @keyup.enter="handleBarcode" type="text" placeholder="Scan barcode or search products..." 
                            class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary transition-all">
                    </div>
                    <select v-model="selectedCategory" class="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary text-sm">
                        <option value="">All Items</option>
                        <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>
                
                <!-- Product Grid -->
                <div class="flex-1 p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start">
                    <div v-for="product in filteredProducts" :key="product.id" 
                        @click="addToCart(product)"
                        class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-700 hover:shadow-md border border-transparent hover:border-primary transition-all group flex flex-col gap-2 relative">
                        
                        <div class="absolute top-2 right-2 w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                            {{ product.stock }}
                        </div>

                        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl self-center mb-2">
                             {{ getIcon(product.category) }}
                        </div>
                        
                        <div class="text-center">
                            <h4 class="font-semibold text-sm truncate w-full" :title="product.name">{{ product.name }}</h4>
                            <p class="text-xs text-gray-500 truncate">{{ product.sku }}</p>
                        </div>
                        
                        <div class="mt-auto text-center font-bold text-primary">
                            {{ formatCurrency(product.price) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cart (Right) -->
            <div class="w-full lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <!-- Customer Selection -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                    <select v-model="selectedCustomer" class="w-full bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer">
                        <option :value="null">Walk-in Customer</option>
                        <option v-for="cust in store.customers" :key="cust.id" :value="cust">{{ cust.name }} ({{ cust.phone }})</option>
                    </select>
                </div>

                <!-- Cart Items -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                        <i class="fa-solid fa-basket-shopping text-6xl mb-4"></i>
                        <p>Cart is empty</p>
                    </div>

                    <div v-for="(item, index) in cart" :key="item.id" class="flex gap-3 items-center group">
                         <div class="flex-1 min-w-0">
                            <h4 class="font-medium text-sm truncate">{{ item.name }}</h4>
                            <div class="text-xs text-gray-500">{{ formatCurrency(item.price) }} x {{ item.qty }}</div>
                        </div>
                        <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button @click="updateQty(index, -1)" class="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm text-xs transition-all"><i class="fa-solid fa-minus"></i></button>
                            <span class="w-4 text-center text-sm font-medium">{{ item.qty }}</span>
                            <button @click="updateQty(index, 1)" class="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm text-xs transition-all"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <div class="font-bold text-sm w-16 text-right">{{ formatCurrency(item.qty * item.price) }}</div>
                        <button @click="removeFromCart(index)" class="text-gray-300 hover:text-danger ml-1 opacity-0 group-hover:opacity-100 transition-opacity"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

                <!-- Totals -->
                <div class="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>Tax ({{ (store.settings.taxRate * 100).toFixed(0) }}%)</span>
                        <span>{{ formatCurrency(taxAmount) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>Discount</span>
                        <input v-model.number="discount" type="number" class="w-16 text-right bg-transparent border-b border-gray-300 focus:border-primary outline-none p-0 text-sm">
                    </div>
                    
                    <div class="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                        <span>Total</span>
                        <span>{{ formatCurrency(total) }}</span>
                    </div>

                    <button @click="initCheckout" :disabled="cart.length === 0" 
                        class="w-full mt-4 bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-receipt"></i> Pay {{ formatCurrency(total) }}
                    </button>
                </div>
            </div>
                </div>
            </div>
            
            <!-- Checkout Modal -->
            <div v-if="showCheckout" class="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
                <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 class="text-xl font-bold">Complete Sale</h3>
                        <button @click="showCheckout = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto">
                        <div class="space-y-4">
                            <!-- Payment Summary -->
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex justify-between items-center">
                                <span class="text-gray-500">Total Amount</span>
                                <span class="text-2xl font-bold text-primary">{{ formatCurrency(total) }}</span>
                            </div>

                            <!-- Payment Method -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Payment Method</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button 
                                        v-for="method in ['Cash', 'Card', 'Bank Transfer', 'COD']" 
                                        :key="method"
                                        @click="paymentMethod = method"
                                        :class="['py-3 px-4 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2', 
                                            paymentMethod === method 
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-primary']">
                                        <i :class="[
                                            method === 'Cash' ? 'fa-solid fa-money-bill-wave' : 
                                            method === 'Card' ? 'fa-solid fa-credit-card' : 
                                            method === 'COD' ? 'fa-solid fa-truck' : 
                                            'fa-solid fa-building-columns']"></i>
                                        {{ method }}
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Amount Tendered (for Cash) -->
                            <div v-if="paymentMethod === 'Cash'" class="animate-[fadeIn_0.3s_ease-out]">
                                <label class="block text-sm font-medium mb-1">Cash Tendered</label>
                                <div class="relative">
                                     <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{{ store.settings.currency }}</span>
                                     <input v-model.number="amountTendered" type="number" class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary text-lg font-bold">
                                </div>
                                <div v-if="amountTendered >= total" class="mt-2 text-right text-success font-bold">
                                    Change: {{ formatCurrency(amountTendered - total) }}
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-700">
                             <button @click="showCheckout = false" class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">Cancel</button>
                             <button @click="processSale" :disabled="paymentMethod === 'Cash' && amountTendered < total" class="px-8 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                 <i class="fa-solid fa-check mr-2"></i> Complete Sale
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            searchQuery: '',
            selectedCategory: '',
            cart: [],
            selectedCustomer: null,
            discount: 0,
            showCheckout: false,
            paymentMethod: 'Cash',
            amountTendered: 0
        }
    },
    computed: {
        filteredProducts() {
            return this.store.products.filter(p => {
                const q = this.searchQuery.toLowerCase();
                const matchesSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
                const matchesCategory = !this.selectedCategory || p.category === this.selectedCategory;
                return matchesSearch && matchesCategory;
            });
        },
        subtotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },
        taxAmount() {
            return this.subtotal * this.store.settings.taxRate;
        },
        total() {
            return Math.max(0, this.subtotal + this.taxAmount - this.discount);
        },
        cartTotal() {
            return this.total;
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        getIcon(category) {
            const icons = { 'Accessories': '🖱️', 'Hardware': '🖥️', 'Cables': '🔌', 'Services': '🛠️' };
            return icons[category] || '📦';
        },
        addToCart(product) {
            if (product.stock <= 0) {
                this.store.addToast('Stock Error', 'Product is out of stock', 'error');
                return;
            }

            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                if (existing.qty >= product.stock) {
                    this.store.addToast('Stock Warning', 'Cannot add more than available stock', 'warning');
                    return;
                }
                existing.qty++;
            } else {
                this.cart.push({ ...product, qty: 1 });
            }
        },
        handleBarcode() {
            const exactMatch = this.store.products.find(p => p.sku.toLowerCase() === this.searchQuery.toLowerCase());
            if (exactMatch) {
                this.addToCart(exactMatch);
                this.searchQuery = '';
            }
        },
        updateQty(index, change) {
            const item = this.cart[index];
            const newQty = item.qty + change;
            const product = this.store.products.find(p => p.id === item.id);

            if (newQty <= 0) {
                this.cart.splice(index, 1);
            } else if (newQty > product.stock) {
                this.store.addToast('Stock Warning', 'Not enough stock available', 'warning');
            } else {
                item.qty = newQty;
            }
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
        },
        initCheckout() {
            if (this.cart.length === 0) return;
            this.amountTendered = this.total;
            this.showCheckout = true;
        },
        processSale() {
            const sale = {
                id: Date.now(), // Generate ID here or letting store do it, but useful for receipt
                items: JSON.parse(JSON.stringify(this.cart)),
                subtotal: this.subtotal,
                tax: this.taxAmount,
                discount: this.discount,
                total: this.total,
                customer: this.selectedCustomer,
                paymentMethod: this.paymentMethod,
                amountTendered: this.amountTendered,
                change: Math.max(0, this.amountTendered - this.total),
                date: new Date().toISOString()
            };

            this.store.addSale(sale);
            this.printReceipt(sale);

            // cleanup
            this.cart = [];
            this.discount = 0;
            this.selectedCustomer = null;
            this.showCheckout = false;
            this.amountTendered = 0;
            this.paymentMethod = 'Cash';
        },
        printReceipt(sale) {
            const receiptWindow = window.open('', '_blank', 'width=400,height=600');
            const itemsHtml = sale.items.map(item => `
                <div class="item">
                    <span>${item.name} x${item.qty}</span>
                    <span>${this.formatCurrency(item.price * item.qty)}</span>
                </div>
            `).join('');

            receiptWindow.document.write(`
                <html>
                <head>
                    <title>Receipt #${sale.id}</title>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; font-size: 14px; }
                        .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .total-section { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; }
                        .bold { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h3>${this.store.settings.shopName || 'POS System'}</h3>
                        <p>${this.store.settings.address || ''}</p>
                        <p>${new Date(sale.date).toLocaleString()}</p>
                        <p>Inv: #${sale.id}</p>
                        <p>Customer: ${sale.customer ? sale.customer.name : 'Walk-in'}</p>
                    </div>
                    <div class="items">
                        ${itemsHtml}
                    </div>
                    <div class="total-section">
                        <div class="row"><span>Subtotal:</span><span>${this.formatCurrency(sale.subtotal)}</span></div>
                        <div class="row"><span>Tax:</span><span>${this.formatCurrency(sale.tax)}</span></div>
                        <div class="row"><span>Discount:</span><span>-${this.formatCurrency(sale.discount)}</span></div>
                        <div class="row bold" style="font-size: 1.2em; margin-top: 5px;"><span>TOTAL:</span><span>${this.formatCurrency(sale.total)}</span></div>
                        <div class="row" style="margin-top: 10px;"><span>Payment (${sale.paymentMethod}):</span><span>${this.formatCurrency(sale.amountTendered || sale.total)}</span></div>
                        ${sale.paymentMethod === 'Cash' ? `<div class="row"><span>Change:</span><span>${this.formatCurrency(sale.change)}</span></div>` : ''}
                    </div>
                    <div class="footer">
                        <p>Thank you!</p>
                    </div>
                    <script>
                        window.print();
                        window.onafterprint = function() { window.close(); }
                    </script>
                </body>
                </html>
            `);
            receiptWindow.document.close();
        }
    },
    mounted() {
        this.$refs.searchInput.focus();
    }
}
