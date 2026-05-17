import { Pool } from 'pg';
import { sendWhatsAppMessage } from './send-whatsapp.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const TO_MOBILE = '+919518738019';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Only POST allowed' });

  try {
    const data = req.body;
    const visitTime = new Date();

    const { rows } = await pool.query(
      `INSERT INTO viewers_list (country_code,country_name,city,timezone,device_type,operating_system,browser,page_url,referrer,user_agent,visit_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [data.countryCode||null, data.countryName||null, data.city||null, data.timezone||null,
       data.deviceType||null, data.operatingSystem||null, data.browser||null,
       data.pageUrl||null, data.referrer||null, data.userAgent||null, visitTime]
    );

    const viewerId = rows[0].id;
    const city = data.city || 'Unknown City';
    const country = data.countryName || 'Unknown Country';
    const localTime = data.timezone
      ? new Date().toLocaleString('en-IN', { timeZone: data.timezone })
      : visitTime.toLocaleString('en-IN');

    const whatsappResult = await sendWhatsAppMessage(
      TO_MOBILE,
      `👀 New portfolio visit from ${city}, ${country} at ${localTime} via ${data.browser || 'unknown browser'}.`
    );

    return res.status(200).json({ success: true, viewerId, whatsappSent: whatsappResult.success });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}