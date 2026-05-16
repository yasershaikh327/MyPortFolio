import { Pool } from 'pg';
import { sendMail } from '../sendMail.js';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    try {
        const data = req.body;
        const visitTime = new Date();

        // ================= DB INSERT =================
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
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING id
        `;

        const values = [
            data.countryCode,
            data.countryName,
            data.city,
            data.timezone,
            data.deviceType,
            data.operatingSystem,
            data.browser,
            data.pageUrl,
            data.referrer,
            data.userAgent,
            visitTime
        ];

        const result = await pool.query(insertQuery, values);
        const viewerId = result.rows[0].id;

        // ================= EMAIL =================
        await sendMail({
            subject: 'New Portfolio Visitor',
            htmlContent: `<h1>New Visitor</h1><p>ID: ${viewerId}</p>`,
            textContent: `Visitor ID: ${viewerId}`
        });

        return res.status(200).json({
            success: true,
            viewerId
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}