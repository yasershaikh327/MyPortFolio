import { Pool } from 'pg';
import axios from 'axios';
import geoip from 'geoip-lite';

// ─── PostgreSQL Pool ─────────────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
});

// ─── Device detection ────────────────────────────────────────────
function getDeviceType(uaString = '') {
  if (/mobile|android|iphone|ipod|blackberry|opera mini|windows phone/i.test(uaString)) {
    return 'Mobile';
  }
  if (/ipad|tablet/i.test(uaString)) {
    return 'Tablet';
  }
  return 'Desktop';
}

// ─── Brevo mail ──────────────────────────────────────────────────
async function sendBrevoMail(data) {
  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Visitor Tracker',
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: process.env.BREVO_TO_EMAIL,
        name: process.env.BREVO_TO_NAME || 'Admin',
      },
    ],
    subject: `🌐 New Visitor — ${data.city || 'Unknown City'}`,
    htmlContent: `<h3>New Visitor</h3>
      <p>City: ${data.city}</p>
      <p>Country: ${data.country}</p>
      <p>IP: ${data.ip}</p>`,
  };

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    payload,
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
}

// ─── Vercel Serverless Function ──────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentUrl, referrer, language, platform, timezone } = req.body || {};

    // IP detection
    const rawIp = (
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      ''
    ).replace(/^::ffff:/, '');

    // Geo
    const geo = geoip.lookup(rawIp) || {};
    const country = geo.country || '';
    const state = geo.region || '';
    const city = geo.city || '';

    // User agent
    const uaString = req.headers['user-agent'] || '';
    const deviceType = getDeviceType(uaString);

    const now = new Date();

    // Insert DB
    const sql = `
      INSERT INTO viewer (
        country, state, province,
        "localDateTime", "deviceType", platform,
        timezone, "userAgent", language,
        referrer, "currentUrl", "timeVisitedUTC",
        "VisitDate", city
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
      RETURNING *;
    `;

    const values = [
      country,
      state,
      state,
      now,
      deviceType,
      platform || '',
      timezone || '',
      uaString,
      language || '',
      referrer || '',
      currentUrl || '',
      now,
      now,
      city,
    ];

    const result = await pool.query(sql, values);
    const record = result.rows[0];

    // Fire email (non-blocking)
    sendBrevoMail({
      country,
      state,
      city,
      ip: rawIp,
    }).catch(console.error);

    return res.status(201).json({
      success: true,
      id: record.id || record.Id,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}