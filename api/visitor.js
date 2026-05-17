import { Pool } from 'pg';
import twilio from 'twilio';

// ==============================
// DATABASE
// ==============================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ==============================
// TWILIO CONFIGURATION
// ==============================
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send WhatsApp Message
 * Environment Variables:
 * TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
 * TWILIO_WHATSAPP_TO=919518738019
 */
async function sendWhatsAppMessage(body) {
    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:+${process.env.TWILIO_WHATSAPP_TO.replace(/^\+/, '')}`,
            body
        });

        console.log('WhatsApp Message SID:', message.sid);
        console.log('WhatsApp Initial Status:', message.status);

        return {
            success: true,
            sid: message.sid,
            status: message.status
        };
    } catch (error) {
        console.error('WhatsApp Send Error:', error.message);

        return {
            success: false,
            message: error.message
        };
    }
}

// ==============================
// API HANDLER (Vercel)
// ==============================
export default async function handler(req, res) {
    // CORS
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

        // ==============================
        // INSERT INTO DATABASE
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
        // WHATSAPP MESSAGE
        // ==============================
        const country = data.countryName || 'Unknown Country';
        const city = data.city || 'Unknown City';
        const localTime = data.timezone
            ? new Date().toLocaleString('en-IN', {
                timeZone: data.timezone
            })
            : visitTime.toLocaleString('en-IN');

        const whatsappBody =
            `👀 Somebody viewed your Portfolio from ${city}, ${country} at ${localTime}.`;

        // ==============================
        // SEND WHATSAPP ONLY
        // ==============================
        const whatsappResult = await sendWhatsAppMessage(whatsappBody);

        // ==============================
        // RESPONSE
        // ==============================
       return res.status(200).json({
            success: true,
            viewerId,
            whatsappSent: whatsappResult.success,
            whatsappSid: whatsappResult.sid || null,
            whatsappStatus: whatsappResult.status || null,
            whatsappError: whatsappResult.message || null,
            whatsappMessage: whatsappBody
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}