export default {
    template: `
        <div class="h-full flex flex-col gap-6">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
                        <h3 class="text-2xl font-bold mt-1">{{ stat.value }}</h3>
                        <p :class="['text-xs mt-2 flex items-center gap-1', stat.change >= 0 ? 'text-success' : 'text-danger']">
                            <i :class="['fa-solid', stat.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                            {{ Math.abs(stat.change) }}% vs last month
                        </p>
                    </div>
                    <div :class="['p-3 rounded-xl', stat.bgClass]">
                        <i :class="[stat.icon, 'text-xl', stat.textClass]"></i>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <!-- Sales Trend -->
                <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold text-lg">Sales Overview</h3>
                        <select class="bg-gray-50 dark:bg-gray-700 border-none text-sm rounded-lg px-3 py-1">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div class="flex-1 relative w-full h-64">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 class="font-bold text-lg mb-4">Top Selling Products</h3>
                    <div class="flex-1 overflow-y-auto pr-2 space-y-4">
                        <div v-for="product in topProducts" :key="product.id" class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">📦</div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-sm truncate">{{ product.name }}</h4>
                                <p class="text-xs text-gray-500">{{ product.sold }} units sold</p>
                            </div>
                            <span class="font-bold text-sm text-primary">{{ formatCurrency(product.revenue) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Orders & Tracking Snippet -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 overflow-hidden flex flex-col min-h-[200px]">
                <div class="p-4 border-b border-gray-100 dark:border-gray-700 font-bold flex justify-between">
                    <span>Recent Orders & Tracking</span>
                    <button @click="$emit('navigate', 'tracking')" class="text-xs text-primary hover:underline">View All</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium">
                            <tr>
                                <th class="px-6 py-3">Invoice</th>
                                <th class="px-6 py-3">Customer</th>
                                <th class="px-6 py-3">Status</th>
                                <th class="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                             <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td class="px-6 py-3 font-mono">#{{ sale.id }}</td>
                                <td class="px-6 py-3">{{ sale.customer ? sale.customer.name : 'Walk-in' }}</td>
                                <td class="px-6 py-3">
                                    <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border', 
                                        sale.tracking?.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 
                                        sale.tracking?.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                        'bg-gray-50 text-gray-500 border-gray-100']">
                                        {{ sale.tracking?.status || 'Pending' }}
                                    </span>
                                </td>
                                <td class="px-6 py-3 text-right font-bold">{{ formatCurrency(sale.total) }}</td>
                             </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    props: ['store'],
    data() {
        return {
            chartInstance: null
        }
    },
    computed: {
        totalSales() {
            return this.store.sales.reduce((sum, sale) => sum + sale.total, 0);
        },
        totalOrders() {
            return this.store.sales.length;
        },
        recentSales() {
            return this.store.sales.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        },
        stats() {
            return [
                {
                    label: 'Total Revenue',
                    value: this.formatCurrency(this.totalSales),
                    change: 12.5,
                    icon: 'fa-dollar-sign',
                    bgClass: 'bg-primary/10',
                    textClass: 'text-primary'
                },
                {
                    label: 'Total Orders',
                    value: this.totalOrders,
                    change: 8.2,
                    icon: 'fa-cart-shopping',
                    bgClass: 'bg-accent/10',
                    textClass: 'text-accent'
                },
                {
                    label: 'Active Customers',
                    value: this.store.customers.length,
                    change: -2.4,
                    icon: 'fa-users',
                    bgClass: 'bg-warning/10',
                    textClass: 'text-warning'
                },
                {
                    label: 'Low Stock Items',
                    value: this.store.products.filter(p => p.stock <= p.min_stock).length,
                    change: 0,
                    icon: 'fa-box-open',
                    bgClass: 'bg-danger/10',
                    textClass: 'text-danger'
                },
            ]
        },
        topProducts() {
            // Mock logic for top products based on sales
            const productSales = {};
            this.store.sales.forEach(sale => {
                sale.items.forEach(item => {
                    if (!productSales[item.id]) productSales[item.id] = { ...item, sold: 0, revenue: 0 };
                    productSales[item.id].sold += item.qty;
                    productSales[item.id].revenue += item.total;
                });
            });
            return Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        }
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.store.settings.currency }).format(value);
        },
        initChart() {
            const ctx = document.getElementById('salesChart');
            if (!ctx) return;

            // Calculate daily sales for last 7 days
            const labels = [];
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));

                const dayTotal = this.store.sales
                    .filter(s => s.date.startsWith(dateStr))
                    .reduce((sum, s) => sum + s.total, 0);
                data.push(dayTotal);
            }

            if (this.chartInstance) this.chartInstance.destroy();

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Revenue',
                        data: data,
                        borderColor: '#3b82f6',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
                            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
                            return gradient;
                        },
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            padding: 12,
                            titleFont: { size: 13 },
                            bodyFont: { size: 13 },
                            displayColors: false,
                            callbacks: {
                                label: (context) => this.formatCurrency(context.raw)
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#e2e8f0', borderDash: [4, 4] },
                            ticks: { callback: (value) => this.formatCurrency(value) }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    },
    mounted() {
        this.initChart();
    },
    watch: {
        'store.sales': {
            handler() { this.initChart(); },
            deep: true
        }
    }
}
