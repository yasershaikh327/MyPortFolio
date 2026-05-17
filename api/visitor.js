import { Pool } from 'pg';
import twilio from 'twilio';
import { sendWhatsAppMessage } from './send-whatsapp.js';

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

        // const whatsappBody =
        //     `👀 Somebody viewed your Portfolio from ${city}, ${country} at ${localTime}.`;
        // const whatsappBody =
        //     `Hello Yaser! This WhatsApp message was sent from Node.js using Twilio.`;

        const tomobile = "+919518738019"    ;

        // ==============================
        // SEND WHATSAPP ONLY
        // ==============================
        // const whatsappResult = await sendWhatsAppMessage(whatsappBody,tomobile);
        // Example usage
        const whatsappBody =
            `Hello Yaser! This WhatsApp message was sent from Node.js using Twilio.`;

        // Send WhatsApp and wait for result
        const whatsappResult = await sendWhatsAppMessage(
            '+919518738019',
            whatsappBody
        );

        // ==============================
        // RESPONSE
        // ==============================
        return res.status(200).json({
            success: true,
            viewerId,
            whatsappSent: whatsappResult.success,
            whatsappSid: whatsappResult.sid || null,
            whatsappStatus: whatsappResult.status || null,
            whatsappError: whatsappResult.message || null
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}