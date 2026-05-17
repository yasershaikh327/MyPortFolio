import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage(to, body) {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body
    });

    return { success: true, sid: message.sid, status: message.status };
  } catch (error) {
    console.error('WhatsApp send failed:', error.message);
    return { success: false, sid: null, status: null, message: error.message };
  }
}