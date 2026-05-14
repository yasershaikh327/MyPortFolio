const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML files

// Store captured data in memory (for demo)
let userDataStore = [];

// API endpoint to receive user details
app.post('/api/user-details', async (req, res) => {
    try {
        const userData = req.body;
        
        // Add server timestamp
        userData.serverReceivedAt = new Date().toISOString();
        
        // Store in memory
        userDataStore.push(userData);
        
        // Also save to JSON file for persistence
        await saveToFile(userData);
        
        // Log to console with beautiful formatting
        console.log('\n' + '='.repeat(80));
        console.log('📍 NEW USER DETAILS CAPTURED');
        console.log('='.repeat(80));
        console.log(`🌍 Country: ${userData.country} (${userData.country_code})`);
        console.log(`🏙️  City: ${userData.city || 'Not detected'}`);
        console.log(`⏰ Timezone: ${userData.timezone}`);
        console.log(`🕐 Local Time: ${userData.localTime}`);
        console.log(`📡 IP Address: ${userData.ip}`);
        console.log(`🌐 Browser: ${userData.browser?.split(' ').slice(-1)[0]}`);
        console.log(`💻 Platform: ${userData.platform}`);
        console.log(`📱 Screen: ${userData.screenResolution}`);
        console.log(`🔗 Page URL: ${userData.pageUrl}`);
        console.log(`⏱️  Captured At: ${userData.timestamp}`);
        console.log('='.repeat(80) + '\n');
        
        // Optional: Display as table
        console.table({
            'Country': userData.country,
            'City': userData.city,
            'Timezone': userData.timezone,
            'Local Time': userData.localTime,
            'IP': userData.ip
        });
        
        res.json({ 
            success: true, 
            message: 'User details captured successfully',
            data: userData
        });
        
    } catch (error) {
        console.error('Error processing user data:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process user data' 
        });
    }
});

// API endpoint to get all captured data (for admin)
app.get('/api/user-details/all', async (req, res) => {
    try {
        // Read from file
        const allData = await readFromFile();
        res.json({
            success: true,
            count: allData.length,
            data: allData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to get latest user
app.get('/api/user-details/latest', async (req, res) => {
    try {
        const allData = await readFromFile();
        const latest = allData[allData.length - 1] || null;
        res.json({
            success: true,
            data: latest
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save to JSON file
async function saveToFile(userData) {
    const filePath = path.join(__dirname, 'user_data.json');
    try {
        let existingData = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (err) {
            // File doesn't exist yet
        }
        
        existingData.push(userData);
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
    } catch (error) {
        console.error('Error saving to file:', error);
    }
}

// Read from JSON file
async function readFromFile() {
    const filePath = path.join(__dirname, 'user_data.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (err) {
        return [];
    }
}

// Dashboard endpoint to view captured data in browser
app.get('/dashboard', async (req, res) => {
    const allData = await readFromFile();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>User Analytics Dashboard</title>
            <style>
                body { font-family: monospace; padding: 20px; background: #0a0a0a; color: #00ff00; }
                h1 { color: #00ff00; border-bottom: 2px solid #00ff00; }
                .user-card { background: #1a1a1a; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #00ff00; }
                .timestamp { color: #888; font-size: 12px; }
                .details { margin-top: 10px; }
                .details span { color: #ff6600; }
                pre { background: #0a0a0a; padding: 10px; overflow-x: auto; }
            </style>
        </head>
        <body>
            <h1>📊 User Analytics Dashboard</h1>
            <p>Total Visitors: ${allData.length}</p>
            <div id="data">
                ${allData.reverse().map((user, index) => `
                    <div class="user-card">
                        <div class="timestamp">Visitor #${allData.length - index} | ${new Date(user.timestamp).toLocaleString()}</div>
                        <div class="details">
                            🌍 <span>${user.country || 'Unknown'}</span> | 
                            🏙️ <span>${user.city || 'Unknown'}</span> | 
                            ⏰ <span>${user.timezone || 'Unknown'}</span><br>
                            🕐 Local Time: <span>${user.localTime || 'Unknown'}</span><br>
                            📡 IP: <span>${user.ip || 'Unknown'}</span><br>
                            🌐 Browser: <span>${(user.browser || '').split(' ').slice(-1)[0]}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/user-details`);
    console.log('\n💡 Waiting for user data...\n');
});