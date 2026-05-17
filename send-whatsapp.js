// send-whatsapp.js
require('dotenv').config();

const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppMessage(to, body) {
  try {
    // Send message
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM, // whatsapp:+14155238886
      to: `whatsapp:${to}`,
      body: body
    });

    console.log('Message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Initial Status:', message.status);

    // Wait a few seconds so Twilio can process delivery
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Fetch the status of the SAME message
    const updatedMessage = await client.messages(message.sid).fetch();

    console.log('Final Status:', updatedMessage.status);

    // If delivery failed, print the error information
    if (updatedMessage.errorCode || updatedMessage.errorMessage) {
      console.log('Error Code:', updatedMessage.errorCode);
      console.log('Error Message:', updatedMessage.errorMessage);
    }

  } catch (error) {
    console.error('Failed to send WhatsApp message.');
    console.error(error.message);
  }
}

