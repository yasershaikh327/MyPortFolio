import { Pool } from 'pg';

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

        await pool.query(
            `INSERT INTO viewers_list (
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
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())`,
            [
                data.countryCode,
                data.countryName,
                data.city,
                data.timezone,
                data.deviceType,
                data.operatingSystem,
                data.browser,
                data.pageUrl,
                data.referrer,
                data.userAgent
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Visitor stored"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}