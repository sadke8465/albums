const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CONFIG_FILE = path.join(__dirname, 'crt-config.json');

// Default configuration
const DEFAULT_CONFIG = {
    version: 3,
    views: {
        default: { scaleX: 1.25, scaleY: 1, nudgeX: 0, nudgeY: 0, sizeFactor: 0.95 },
        tl: { scaleX: 1.8, scaleY: 1.8, nudgeX: 0, nudgeY: 0, zoom: 1.8 },
        tr: { scaleX: 1.8, scaleY: 1.8, nudgeX: 0, nudgeY: 0, zoom: 1.8 },
        br: { scaleX: 1.8, scaleY: 1.8, nudgeX: 0, nudgeY: 0, zoom: 1.8 },
        bl: { scaleX: 1.8, scaleY: 1.8, nudgeX: 0, nudgeY: 0, zoom: 1.8 }
    }
};

// Load or create config
let config = DEFAULT_CONFIG;
try {
    if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        config = JSON.parse(data);
        console.log('✓ Loaded configuration from file');
    } else {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log('✓ Created new configuration file');
    }
} catch (error) {
    console.error('Error loading config:', error);
    config = DEFAULT_CONFIG;
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
console.log('📡 Waiting for connections...\n');

// Track connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`✓ Client connected (${clients.size} total)`);

    // Send current config to new client
    ws.send(JSON.stringify({
        type: 'init',
        config: config
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'update') {
                // Update configuration
                config.views[data.view] = {
                    ...config.views[data.view],
                    ...data.settings
                };

                // Save to file
                fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

                // Broadcast to all clients except sender
                clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'update',
                            view: data.view,
                            settings: data.settings
                        }));
                    }
                });

                console.log(`📝 Updated ${data.view}:`, data.settings);
            }

            if (data.type === 'save') {
                // Full config save
                config = data.config;
                fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
                console.log('💾 Configuration saved');

                // Broadcast to all clients
                clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'init',
                            config: config
                        }));
                    }
                });
            }

            if (data.type === 'reset') {
                // Reset to defaults
                config = { ...DEFAULT_CONFIG };
                fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
                console.log('🔄 Reset to default configuration');

                // Broadcast to all clients
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'init',
                            config: config
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`✗ Client disconnected (${clients.size} remaining)`);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    wss.close();
    process.exit(0);
});
