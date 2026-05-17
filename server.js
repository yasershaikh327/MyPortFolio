import http from 'http';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { sendMail } from './send-mail.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/visitor') {
        let body = '';

        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const visitTime = new Date();

                console.log('==============================');
                console.log('NEW VISITOR');
                console.log('Country  :', data.countryName);
                console.log('City     :', data.city);
                console.log('Browser  :', data.browser);
                console.log('OS       :', data.operatingSystem);
                console.log('Page     :', data.pageUrl);
                console.log('Time     :', visitTime.toISOString());
                console.log('==============================');

                const { rows } = await pool.query(
                    `INSERT INTO viewers_list (
                        country_code, country_name, city, timezone,
                        device_type, operating_system, browser,
                        page_url, referrer, user_agent, visit_time
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                    RETURNING id`,
                    [
                        data.countryCode     || null,
                        data.countryName     || null,
                        data.city            || null,
                        data.timezone        || null,
                        data.deviceType      || null,
                        data.operatingSystem || null,
                        data.browser         || null,
                        data.pageUrl         || null,
                        data.referrer        || null,
                        data.userAgent       || null,
                        visitTime
                    ]
                );

                const viewerId  = rows[0].id;
                const city      = data.city        || 'Unknown City';
                const country   = data.countryName || 'Unknown Country';
                const localTime = data.timezone
                    ? new Date().toLocaleString('en-IN', { timeZone: data.timezone })
                    : visitTime.toLocaleString('en-IN');

                const mailResult = await sendMail(city, country, localTime, data.browser || 'Unknown', data.operatingSystem || 'Unknown');

                console.log('Email sent:', mailResult.success);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    viewerId,
                    emailSent: mailResult.success
                }));

            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: error.message }));
            }
        });

        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));