export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <h2 class="text-2xl font-bold">Quotations</h2>

            <!-- Setup Form (Hidden by default, shown via toggle) -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                
                <!-- Quote Builder -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Customer & Meta -->
                    <div class="space-y-4">
                         <h3 class="font-bold text-lg mb-2">To</h3>
                         <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.customerName" type="text" placeholder="Customer Name" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                            <input v-model="form.date" type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary">
                            <textarea v-model="form.address" placeholder="Address" rows="2" class="col-span-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary"></textarea>
                         </div>
                    </div>

                    <!-- Items -->
                    <div class="flex flex-col h-full">
                         <h3 class="font-bold text-lg mb-2 flex justify-between">Items <button @click="addItem" class="text-sm text-primary">+ Add Item</button></h3>
                         <div class="flex-1 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 space-y-2 overflow-y-auto max-h-60">
                            <div v-for="(item, idx) in form.items" :key="idx" class="flex gap-2">
                                <select v-model="item.product" @change="updateLineItem(idx)" class="flex-1 text-sm rounded bg-white dark:bg-gray-800 border-none">
                                    <option :value="null">Select Product</option>
                                    <option v-for="p in store.products" :key="p.id" :value="p">{{ p.name }}</option>
                                </select>
                                <input v-model.number="item.qty" type="number" min="1" class="w-16 text-sm rounded bg-white dark:bg-gray-800 border-none text-center">
                                <span class="w-20 text-sm flex items-center justify-end font-mono">{{ formatCurrency((item.product?.price || 0) * item.qty) }}</span>
                                <button @click="removeItem(idx)" class="text-danger hover:text-red-700 px-1"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                         </div>
                         
                         <!-- Totals -->
                         <div class="mt-4 flex justify-between items-center text-lg font-bold">
                            <span>Subtotal</span>
                            <span>{{ formatCurrency(formSubtotal) }}</span>
                         </div>
                         <div class="mt-2 flex justify-between items-center text-sm">
                            <span class="text-gray-500">Discount</span>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-400">-</span>
                                <input v-model.number="form.discount" type="number" min="0" class="w-24 text-right px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 border border-transparent focus:bg-white focus:border-primary transition-all">
                            </div>
                         </div>
                         <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-xl font-extrabold text-primary">
                            <span>Total</span>
                            <span>{{ formatCurrency(formTotal) }}</span>
                         </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                     <button @click="generatePDF" class="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all hover:-translate-y-0.5">
                        <i class="fa-solid fa-file-pdf"></i> Download PDF
                    </button>
                    <button @click="saveQuotation" class="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                        <i class="fa-solid fa-save"></i> Save Quote
                    </button>
                </div>
            </div>

            <!-- History -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1">
                 <div class="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 font-bold">History</div>
                 <div class="overflow-y-auto p-4 space-y-2">
                    <div v-for="q in store.quotations" :key="q.id" class="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div>
                            <div class="font-bold">#{{ q.id }} - {{ q.customerName }}</div>
                            <div class="text-xs text-gray-500">{{ new Date(q.date).toLocaleDateString() }}</div>
                        </div>
                        <div class="text-right">
                             <div class="font-mono font-bold">{{ formatCurrency(q.total) }}</div>
                             <div class="text-xs text-gray-400" v-if="q.discount > 0">Disc: {{ formatCurrency(q.discount) }}</div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            form: {
                customerName: '',
                address: '',
                date: new Date().toISOString().split('T')[0],
                items: [{ product: null, qty: 1 }],
                discount: 0
            }
        }
    },
    computed: {
        formSubtotal() {
            return this.form.items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.qty), 0);
        },
        formTotal() {
            return Math.max(0, this.formSubtotal - this.form.discount);
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        addItem() {
            this.form.items.push({ product: null, qty: 1 });
        },
        removeItem(idx) {
            this.form.items.splice(idx, 1);
        },
        updateLineItem(idx) {
            // reactivity trigger if needed
        },
        saveQuotation() {
            const quotation = {
                items: this.form.items.map(i => ({
                    name: i.product?.name || 'Unknown',
                    price: i.product?.price || 0,
                    qty: i.qty
                })),
                subtotal: this.formSubtotal,
                discount: this.form.discount,
                total: this.formTotal,
                customerName: this.form.customerName,
                customerAddress: this.form.address
            };
            this.store.addQuotation(quotation);
        },
        async generatePDF() {
            const doc = new jspdf.jsPDF();

            // Branding
            let yPos = 20;

            // Header
            doc.setFontSize(22);
            doc.text('QUOTATION', 160, 20);

            doc.setFontSize(16);
            doc.text(this.store.settings.shopName, 15, yPos);
            doc.setFontSize(10);
            doc.text(this.store.settings.address || '', 15, yPos + 6);
            doc.text(this.store.settings.mobile || '', 15, yPos + 12);

            yPos += 30;

            // Customer Info
            doc.setFontSize(12);
            doc.text('Bill To:', 15, yPos);
            doc.setFontSize(10);
            doc.text(this.form.customerName || 'N/A', 15, yPos + 5);
            doc.text(this.form.address || '', 15, yPos + 10);

            doc.text(`Date: ${this.form.date}`, 160, yPos);

            yPos += 20;

            // Table Header
            doc.setFillColor(240, 240, 240);
            doc.rect(15, yPos, 180, 10, 'F');
            doc.setFont(undefined, 'bold');
            doc.text('Item', 20, yPos + 7);
            doc.text('Qty', 140, yPos + 7);
            doc.text('Total', 170, yPos + 7);

            yPos += 15;
            doc.setFont(undefined, 'normal');

            this.form.items.forEach(item => {
                if (!item.product) return;
                doc.text(item.product.name, 20, yPos);
                doc.text(item.qty.toString(), 140, yPos);
                doc.text(this.formatCurrency(item.product.price * item.qty), 170, yPos);
                yPos += 10;
            });

            yPos += 5;
            doc.line(15, yPos, 195, yPos);
            yPos += 5;

            // Totals
            doc.text(`Subtotal: ${this.formatCurrency(this.formSubtotal)}`, 140, yPos);
            yPos += 6;
            if (this.form.discount > 0) {
                doc.text(`Discount: -${this.formatCurrency(this.form.discount)}`, 140, yPos);
                yPos += 6;
            }

            yPos += 4;
            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.text(`Grand Total: ${this.formatCurrency(this.formTotal)}`, 140, yPos);

            // Footer
            doc.setFontSize(8);
            doc.text('Developed by Infinite System Solution', 105, 280, { align: 'center' });

            doc.save(`quotation_${Date.now()}.pdf`);
        }
    }
}
