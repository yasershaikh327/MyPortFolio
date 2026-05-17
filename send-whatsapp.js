// send-whatsapp.js
// ES Module version (works with: import { sendWhatsAppMessage } from './send-whatsapp.js')

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log(client);

/**
 * Send WhatsApp message using Twilio
 * @param {string} to - Mobile number with country code (example: +919518738019)
 * @param {string} body - Message text
 * @returns {Object}
 */
export async function sendWhatsAppMessage(to, body) {
  try {
    // Ensure Twilio WhatsApp format
    const formattedTo = to.startsWith('whatsapp:')
      ? to
      : `whatsapp:${to}`;

    // Send message
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM, // Example: whatsapp:+14155238886
      to: formattedTo,
      body
    });

    console.log('Message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Initial Status:', message.status);

    // Wait a few seconds so Twilio updates delivery status
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Fetch final status
    const updatedMessage = await client.messages(message.sid).fetch();

    console.log('Final Status:', updatedMessage.status);

    // Return structured response
    return {
      success: true,
      sid: updatedMessage.sid,
      status: updatedMessage.status,
      errorCode: updatedMessage.errorCode || null,
      message: updatedMessage.errorMessage || null
    };

  } catch (error) {
    console.error('Failed to send WhatsApp message.');
    console.error(error.message);

    return {
      success: false,
      sid: null,
      status: null,
      errorCode: error.code || null,
      message: error.message
    };
  }
}