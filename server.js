const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Initial Data Structure
const initialData = {
    products: [],
    categories: ['Hardware', 'Accessories', 'Services'],
    sales: [],
    customers: [],
    users: [
        { id: 1, name: 'Admin User', username: 'admin', password: '123', role: 'admin', pin: '1234' },
        { id: 2, name: 'Sales Staff', username: 'staff', password: '123', role: 'staff', pin: '0000' }
    ],
    settings: {
        shopName: 'My Shop',
        currency: 'LKR',
        taxRate: 0,
        address: '',
        logo: '',
        couriers: []
    }
};

// Ensure DB exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return initialData;
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers (Allow all connection in local network)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: GET Data
    if (pathname === '/api/data' && req.method === 'GET') {
        const data = readDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // API: SAVE Data
    if (pathname === '/api/data' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                writeDB(newData); // We save the WHOLE state for simplicity in this no-db setup
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Static File Serving
    let filePath = '.' + pathname;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Blling Server Running at http://localhost:${PORT}/`);

    // Display Local IP for other PCs
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    console.log('\n--- SHARE THIS IP WITH STAFF ---');
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`Network Link: http://${net.address}:${PORT}/`);
            }
        }
    }
    console.log('--------------------------------\n');
});
