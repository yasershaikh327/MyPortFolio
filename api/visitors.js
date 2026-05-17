import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Only GET allowed' });

    try {
        const { rows } = await pool.query(
            `SELECT * FROM viewers_list ORDER BY visit_time DESC`
        );

        return res.status(200).json({ visitors: rows });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}