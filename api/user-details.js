// api/user-details.js - Vercel serverless function
let userDataStore = [];

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // GET request - return all data
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            count: userDataStore.length,
            data: userDataStore
        });
    }
    
    // POST request - receive new data
    if (req.method === 'POST') {
        const userData = req.body;
        userDataStore.push(userData);
        console.log('📍 New user data:', userData);
        
        return res.status(200).json({
            success: true,
            message: 'Data captured',
            data: userData
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}

// api/user-details.js - Fixed for Vercel serverless
// Using fetch API which is available in Node.js 18+

// In-memory storage (note: this resets on each function invocation)
// For production, use a database like Vercel Postgres, Upstash, or MongoDB
let userDataStore = [];

// Brevo email configuration - Get these from Vercel Environment Variables
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_EMAIL_FROM = process.env.BREVO_EMAIL_FROM || 'syaser327@gmail.com';
const BREVO_NAME_FROM = 'Yaser Shaikh Portfolio';

// Helper function to send email via Brevo
async function sendBrevoEmail(to, subject, htmlContent) {
    // Don't try to send if no API key
    if (!BREVO_API_KEY || BREVO_API_KEY === '') {
        console.log('📧 Email not sent - BREVO_API_KEY not configured');
        return { success: false, error: 'API key missing' };
    }
    
    try {
        const emailData = {
            sender: { name: BREVO_NAME_FROM, email: BREVO_EMAIL_FROM },
            to: [{ email: to, name: to.split('@')[0] }],
            subject: subject,
            htmlContent: htmlContent
        };
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(emailData)
        });
        
        if (response.ok) {
            console.log('✅ Email sent to:', to);
            return { success: true };
        } else {
            const error = await response.text();
            console.error('❌ Brevo error:', error);
            return { success: false, error: error };
        }
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, error: error.message };
    }
}

// Generate visitor notification email
function generateVisitorEmail(userData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                .header { background: #667eea; color: white; padding: 15px; text-align: center; }
                .content { padding: 20px; background: #f5f5f5; }
                .detail { margin: 10px 0; padding: 8px; background: white; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🆕 New Portfolio Visitor!</h2>
                </div>
                <div class="content">
                    <div class="detail">🌍 <strong>Location:</strong> ${userData.country || 'Unknown'} ${userData.city ? `(${userData.city})` : ''}</div>
                    <div class="detail">⏰ <strong>Timezone:</strong> ${userData.timezone || 'Unknown'}</div>
                    <div class="detail">🕐 <strong>Local Time:</strong> ${userData.localTime || 'Unknown'}</div>
                    <div class="detail">💻 <strong>Device:</strong> ${userData.device || 'Unknown'}</div>
                    <div class="detail">🔗 <strong>Page:</strong> ${userData.pageUrl || 'Unknown'}</div>
                    <hr>
                    <small>Sent at: ${new Date().toLocaleString()}</small>
                </div>
            </div>
        </body>
        </html>
    `;
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const url = req.url || '';
        
        // GET /api/user-details/all - Get all visitors
        if (req.method === 'GET' && url === '/api/user-details/all') {
            return res.status(200).json({
                success: true,
                count: userDataStore.length,
                data: userDataStore,
                timestamp: new Date().toISOString()
            });
        }
        
        // GET /api/user-details/latest - Get latest visitor
        if (req.method === 'GET' && url === '/api/user-details/latest') {
            const latest = userDataStore[userDataStore.length - 1] || null;
            return res.status(200).json({
                success: true,
                data: latest
            });
        }
        
        // GET /api/user-details/stats - Get statistics
        if (req.method === 'GET' && url === '/api/user-details/stats') {
            const countries = {};
            const cities = {};
            
            userDataStore.forEach(user => {
                if (user.country) countries[user.country] = (countries[user.country] || 0) + 1;
                if (user.city) cities[user.city] = (cities[user.city] || 0) + 1;
            });
            
            return res.status(200).json({
                success: true,
                stats: {
                    totalVisitors: userDataStore.length,
                    uniqueCountries: Object.keys(countries).length,
                    topCountries: Object.entries(countries).slice(0, 5),
                    topCities: Object.entries(cities).slice(0, 5)
                }
            });
        }
        
        // POST /api/user-details - Receive visitor data
        if (req.method === 'POST' && (url === '/api/user-details' || url === '/')) {
            const userData = {
                id: Date.now(),
                ...req.body,
                serverReceivedAt: new Date().toISOString()
            };
            
            // Store in memory
            userDataStore.push(userData);
            
            // Keep only last 100 records to prevent memory issues
            if (userDataStore.length > 100) {
                userDataStore = userDataStore.slice(-100);
            }
            
            console.log(`📍 Visitor: ${userData.country || 'Unknown'}, ${userData.city || 'Unknown'}`);
            
            // Send email notification (non-blocking)
            if (BREVO_API_KEY && BREVO_API_KEY !== '') {
                const emailHtml = generateVisitorEmail(userData);
                sendBrevoEmail('syaser327@gmail.com', '🆕 New Portfolio Visitor!', emailHtml).catch(console.error);
            }
            
            return res.status(200).json({
                success: true,
                message: 'Visitor data captured',
                id: userData.id
            });
        }
        
        // POST /api/send-contact - Contact form
        if (req.method === 'POST' && url === '/api/send-contact') {
            const { name, email, message, subject } = req.body;
            
            if (!name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'Name, email, and message are required'
                });
            }
            
            const contactHtml = `
                <h2>📬 Contact Form Message</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                <p><strong>Message:</strong></p>
                <div style="background:#f5f5f5;padding:15px;">${message}</div>
                <p><small>Sent: ${new Date().toLocaleString()}</small></p>
            `;
            
            let emailSent = false;
            if (BREVO_API_KEY && BREVO_API_KEY !== '') {
                const result = await sendBrevoEmail('syaser327@gmail.com', `📬 ${subject || 'Contact Form'} from ${name}`, contactHtml);
                emailSent = result.success;
            }
            
            return res.status(200).json({
                success: true,
                message: 'Message received',
                emailSent: emailSent
            });
        }
        
        // 404 for unknown endpoints
        return res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            endpoints: [
                'GET /api/user-details/all',
                'GET /api/user-details/latest',
                'GET /api/user-details/stats',
                'POST /api/user-details',
                'POST /api/send-contact'
            ]
        });
        
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}