const localtunnel = require('localtunnel');
const qrcode = require('qrcode-terminal');
const http = require('http');

// Start the Static Server
require('./server.js');

(async () => {
    console.log('Starting Tunnel... Please wait...');

    // Create Tunnel
    const tunnel = await localtunnel({ port: 3000 });

    console.clear();
    console.log('\n========================================================');
    console.log('               Blling POS - ONLINE MODE');
    console.log('========================================================\n');

    console.log('1. SCAN THIS QR CODE TO OPEN ON MOBILE:');

    // Generate QR Code in Terminal
    qrcode.generate(tunnel.url, { small: true });

    console.log(`   Link: ${tunnel.url}`);

    console.log('\n--------------------------------------------------------');

    // Get Public IP for Password
    console.log('2. ENTER THIS PASSWORD IF ASKED:');

    http.get({ 'host': 'api.ipify.org', 'port': 80, 'path': '/' }, function (resp) {
        resp.on('data', function (ip) {
            const ipStr = ip.toString();
            console.log('\n   ***************');
            console.log(`   ${ipStr}`);
            console.log('   ***************\n');
            console.log('--------------------------------------------------------');
            console.log('Server is running. Press Ctrl+C to stop.');
        });
    });

    tunnel.on('close', () => {
        console.log('Tunnel Closed');
    });
})();
