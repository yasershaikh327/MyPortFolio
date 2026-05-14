import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed'
    });
  }

  try {
    const { full_name, email, message } = req.body;

    const query = `
      INSERT INTO contact_messages (full_name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id, created_at
    `;

    const values = [full_name, email, message];
    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}