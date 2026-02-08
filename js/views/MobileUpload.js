export default {
    template: `
        <div class="h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <!-- Animated Background -->
            <div class="absolute inset-0 z-0">
                <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <!-- Content -->
            <div class="z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-800 shadow-2xl flex flex-col items-center gap-6">
                <!-- Status Icon -->
                <div class="relative">
                    <div v-if="status === 'connecting'" class="w-20 h-20 rounded-full border-4 border-t-primary border-gray-700 animate-spin"></div>
                    <div v-else-if="status === 'connected'" class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-3xl animate-bounce">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <div v-else-if="status === 'uploading'" class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl">
                        <i class="fa-solid fa-cloud-arrow-up animate-pulse"></i>
                    </div>
                </div>

                <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        {{ statusMessage }}
                    </h2>
                    <p class="text-gray-400 text-sm">
                        {{ subMessage }}
                    </p>
                </div>

                <!-- Camera/File Input -->
                <div v-if="status === 'connected' || status === 'error'" class="w-full space-y-4">
                    <label class="block w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-700 hover:border-primary transition-colors cursor-pointer bg-gray-800/50 flex flex-col items-center justify-center gap-3 relative overflow-hidden group">
                        <input type="file" @change="handleFileSelect" accept="image/*" capture="environment" class="hidden">
                        
                        <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-camera text-2xl text-primary"></i>
                        </div>
                        <span class="font-medium">Tap to Take Photo</span>
                    </label>

                    <button @click="disconnect" class="w-full py-3 text-sm text-gray-500 hover:text-white transition-colors">
                        Cancel Connection
                    </button>
                </div>

                <!-- Progress Bar -->
                <div v-if="status === 'uploading'" class="w-full space-y-2">
                    <div class="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" :style="{ width: progress + '%' }"></div>
                    </div>
                    <p class="text-center text-xs text-gray-400">Sending image...</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-8 text-xs text-gray-600">
                Connected via Secure P2P Tunnel
            </div>
        </div>
    `,
    props: ['targetId'],
    data() {
        return {
            status: 'connecting', // connecting, connected, uploading, error, success
            peer: null,
            conn: null,
            progress: 0
        }
    },
    computed: {
        statusMessage() {
            switch (this.status) {
                case 'connecting': return 'Connecting to PC...';
                case 'connected': return 'Ready to Upload';
                case 'uploading': return 'Uploading Image...';
                case 'success': return 'Upload Complete!';
                case 'error': return 'Connection Failed';
                default: return 'Waiting...';
            }
        },
        subMessage() {
            switch (this.status) {
                case 'connecting': return 'Please wait while we establish a secure link.';
                case 'connected': return 'Take a photo of the product to instantly send it to your computer.';
                case 'uploading': return 'Please keep this window open.';
                case 'success': return 'The image has been sent successfully.';
                case 'error': return 'Could not connect. Please try scanning again.';
                default: return '';
            }
        }
    },
    mounted() {
        this.initPeer();
    },
    methods: {
        initPeer() {
            this.peer = new Peer(); // Random ID for sender

            this.peer.on('open', (id) => {
                console.log('Mobile Peer ID:', id);
                this.connectToTarget();
            });

            this.peer.on('error', (err) => {
                console.error(err);
                this.status = 'error';
            });
        },
        connectToTarget() {
            if (!this.targetId) {
                this.status = 'error';
                return;
            }

            this.conn = this.peer.connect(this.targetId);

            this.conn.on('open', () => {
                this.status = 'connected';
            });

            this.conn.on('close', () => {
                // Determine if it was a success close or error
                if (this.status !== 'success') this.status = 'error';
            });

            this.conn.on('error', () => {
                this.status = 'error';
            });
        },
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file || !this.conn) return;

            this.status = 'uploading';
            this.progress = 10;

            const reader = new FileReader();

            reader.onload = (e) => {
                this.progress = 50;
                // Send data
                // Protocol: JSON { type: 'image', data: base64 }
                this.conn.send({
                    type: 'image',
                    data: e.target.result,
                    name: file.name
                });

                this.progress = 90;

                setTimeout(() => {
                    this.status = 'success';
                    this.progress = 100;

                    // Reset after 2 seconds for next photo
                    setTimeout(() => {
                        this.status = 'connected';
                        this.progress = 0;
                    }, 2000);
                }, 500);
            };

            reader.onerror = () => {
                this.status = 'error';
            };

            reader.readAsDataURL(file);
        },
        disconnect() {
            if (this.conn) this.conn.close();
            if (this.peer) this.peer.destroy();
            window.location.href = window.location.pathname; // Reload to possibly go to login or reset
        }
    }
}
