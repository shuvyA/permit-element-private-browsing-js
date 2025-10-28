/**
 * Simple HTTP Server to serve the HTML files
 * Run with: node serve.js
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Serve config from environment variables
    if (req.url === '/config.js') {
        const envId = process.env.PERMIT_ENV_ID || '';
        const loginUrl = process.env.PERMIT_LOGIN_URL || '';
        const tenant = process.env.PERMIT_TENANT || 'default';
        const darkMode = process.env.PERMIT_DARK_MODE === 'true';
        const elementsToken = process.env.PERMIT_ELEMENTS_TOKEN !== 'false';
        
        const elementIframeUrl = `https://embed.permit.io/one?envId=${envId}&darkMode=${darkMode}&elementsToken=${elementsToken}`;
        
        const configContent = `// Configuration loaded from .env file
window.ENV_CONFIG = {
    envId: '${envId}',
    loginUrl: '${loginUrl}',
    elementIframeUrl: '${elementIframeUrl}',
    tenant: '${tenant}',
    darkMode: ${darkMode},
    elementsToken: ${elementsToken}
};
`;
        
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(configContent, 'utf-8');
        return;
    }
    
    // Default to index.html
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
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
    console.log('🚀 Web server is running!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('');
    console.log('⚙️  Configuration loaded from .env file:');
    console.log(`   ENV_ID: ${process.env.PERMIT_ENV_ID || 'NOT SET'}`);
    console.log(`   LOGIN_URL: ${process.env.PERMIT_LOGIN_URL || 'NOT SET'}`);
    console.log(`   TENANT: ${process.env.PERMIT_TENANT || 'NOT SET'}`);
    console.log(`   DARK_MODE: ${process.env.PERMIT_DARK_MODE || 'false'}`);
    console.log(`   ELEMENTS_TOKEN: ${process.env.PERMIT_ELEMENTS_TOKEN || 'true'}`);
    console.log('');
    console.log('✅ Your app is ready!');
    console.log('   Open http://localhost:3001 in your browser');
    console.log('');
    console.log('Press Ctrl+C to stop');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use!`);
        console.error(`   Kill the process: lsof -ti:${PORT} | xargs kill`);
    } else {
        console.error('❌ Server error:', err);
    }
});
