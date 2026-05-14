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