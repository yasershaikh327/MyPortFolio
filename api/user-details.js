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

// api/user-details.js - Vercel serverless function with Brevo email
let userDataStore = [];

// Brevo email configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY; // Add this in Vercel Environment Variables
const BREVO_EMAIL_FROM = process.env.BREVO_EMAIL_FROM || 'your-email@example.com';
const BREVO_NAME_FROM = 'Yaser Shaikh Portfolio';

// Helper function to send email via Brevo
async function sendBrevoEmail(to, subject, htmlContent, userData = null) {
    if (!BREVO_API_KEY) {
        console.error('❌ BREVO_API_KEY not configured in environment variables');
        return { success: false, error: 'API key missing' };
    }
    
    try {
        const emailData = {
            sender: { name: BREVO_NAME_FROM, email: BREVO_EMAIL_FROM },
            to: [{ email: to, name: to.split('@')[0] }],
            subject: subject,
            htmlContent: htmlContent,
            ...(userData && { 
                params: userData,
                templateId: null // Optional: use template if you have one
            })
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
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Email sent successfully to:', to);
            return { success: true, messageId: result.messageId };
        } else {
            console.error('❌ Brevo API error:', result);
            return { success: false, error: result.message };
        }
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: error.message };
    }
}