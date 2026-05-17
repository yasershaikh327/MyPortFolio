import http from 'http';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { sendWhatsAppMessage } from './send-whatsapp.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const TO_MOBILE = '+919518738019';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/api/visitor') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
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

        await sendWhatsAppMessage(
          TO_MOBILE,
          `👀 New portfolio visit from ${city}, ${country} at ${localTime}.`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, viewerId }));
      } catch (error) {
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