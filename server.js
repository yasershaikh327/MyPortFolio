import http from 'http';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { sendMail } from './sendMail.js';

dotenv.config();

// ==============================
// CONFIGURATION
// ==============================
const PORT = parseInt(process.env.PORT || '3000', 10);
const BASE_URL = process.env.BASE_URL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});



// ==============================
// SERVER
// ==============================
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle POST /api/visitor
    if (req.method === 'POST' && req.url === '/api/visitor') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const visitTime = new Date();

                console.log('======================================');
                console.log('NEW VISITOR DETAILS');
                console.log('======================================');
                console.log('Country Code     :', data.countryCode);
                console.log('Country Name     :', data.countryName);
                console.log('City             :', data.city);
                console.log('Timezone         :', data.timezone);
                console.log('Device Type      :', data.deviceType);
                console.log('Operating System :', data.operatingSystem);
                console.log('Browser          :', data.browser);
                console.log('Page URL         :', data.pageUrl);
                console.log('Referrer         :', data.referrer);
                console.log('User Agent       :', data.userAgent);
                console.log('Visit Time       :', visitTime.toISOString());
                console.log('======================================');

                // ==============================
                // STORE IN DATABASE
                // ==============================
                const insertQuery = `
                    INSERT INTO viewers_list (
                        country_code,
                        country_name,
                        city,
                        timezone,
                        device_type,
                        operating_system,
                        browser,
                        page_url,
                        referrer,
                        user_agent,
                        visit_time
                    )
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10, $11
                    )
                    RETURNING id
                `;

                const values = [
                    data.countryCode || null,
                    data.countryName || null,
                    data.city || null,
                    data.timezone || null,
                    data.deviceType || null,
                    data.operatingSystem || null,
                    data.browser || null,
                    data.pageUrl || null,
                    data.referrer || null,
                    data.userAgent || null,
                    visitTime
                ];

                const dbResult = await pool.query(insertQuery, values);
                const viewerId = dbResult.rows[0].id;

                console.log('Database Insert Successful. ID:', viewerId);

                // ==============================
                // SEND EMAIL
                // ==============================
                const emailResult = await sendMail({
                    subject: 'New Portfolio Visitor',
                    htmlContent: `
                        <h1>New Portfolio Visitor</h1>
                        <p><strong>Database ID:</strong> ${viewerId}</p>
                        <p><strong>Country:</strong> ${data.countryName || ''}</p>
                        <p><strong>City:</strong> ${data.city || ''}</p>
                        <p><strong>Timezone:</strong> ${data.timezone || ''}</p>
                        <p><strong>Device:</strong> ${data.deviceType || ''}</p>
                        <p><strong>OS:</strong> ${data.operatingSystem || ''}</p>
                        <p><strong>Browser:</strong> ${data.browser || ''}</p>
                        <p><strong>Page URL:</strong> ${data.pageUrl || ''}</p>
                        <p><strong>Referrer:</strong> ${data.referrer || ''}</p>
                        <p><strong>Visit Time:</strong> ${visitTime.toISOString()}</p>
                    `,
                    textContent: `
                        New Portfolio Visitor
                        Database ID: ${viewerId}
                        Country: ${data.countryName || ''}
                        City: ${data.city || ''}
                        Timezone: ${data.timezone || ''}
                        Device: ${data.deviceType || ''}
                        OS: ${data.operatingSystem || ''}
                        Browser: ${data.browser || ''}
                        Page URL: ${data.pageUrl || ''}
                        Referrer: ${data.referrer || ''}
                        Visit Time: ${visitTime.toISOString()}
                    `
                });

                console.log('Email Result:', emailResult);

                // ==============================
                // SEND RESPONSE
                // ==============================
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    success: true,
                    message: 'Visitor details stored successfully',
                    viewerId,
                    emailSent: emailResult.success
                }));
            } catch (error) {
                console.error('Error:', error);

                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    success: false,
                    message: error.message || 'Server error'
                }));
            }
        });

        return;
    }

    // Route not found
    res.writeHead(404, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
        success: false,
        message: 'Route not found'
    }));
});

// ==============================
// START SERVER
// ==============================
server.listen(PORT, () => {
    console.log(`Server running at ${BASE_URL || 'http://localhost:' + PORT}`);
});