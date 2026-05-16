import { Pool } from 'pg';
import { sendMail } from '../sendMail.js';

// ==============================
// DATABASE
// ==============================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ==============================
// API HANDLER (Vercel)
// ==============================
export default async function handler(req, res) {
    // CORS (needed on Vercel too)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Only POST allowed'
        });
    }

    try {
        const data = req.body;
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
        // INSERT INTO DB
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
                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,$10,$11
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

        console.log('DB Insert Success ID:', viewerId);

        // ==============================
        // SEND EMAIL
        // ==============================
        const emailResult = await sendMail({
            subject: 'New Portfolio Visitor',
            htmlContent: `
                <h1>New Portfolio Visitor</h1>
                <p><strong>ID:</strong> ${viewerId}</p>
                <p><strong>Country:</strong> ${data.countryName || ''}</p>
                <p><strong>City:</strong> ${data.city || ''}</p>
                <p><strong>Device:</strong> ${data.deviceType || ''}</p>
                <p><strong>Browser:</strong> ${data.browser || ''}</p>
                <p><strong>Page:</strong> ${data.pageUrl || ''}</p>
                <p><strong>Time:</strong> ${visitTime.toISOString()}</p>
            `
        });

        return res.status(200).json({
            success: true,
            viewerId,
            emailSent: emailResult.success
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}