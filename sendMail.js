// sendMail.js
// This version uses Brevo's REST API directly with fetch.
// It avoids SDK compatibility issues such as:
// "Brevo.TransactionalEmailsApi is not a constructor"

import dotenv from 'dotenv';

dotenv.config();

/**
 * Send email using Brevo REST API
 *
 * Required .env variables:
 * BREVO_API_KEY=your_api_key
 * MAIL_FROM_EMAIL=verified-sender@example.com
 * MAIL_FROM_NAME=My Portfolio
 * MAIL_TO_EMAIL=your@email.com
 * MAIL_TO_NAME=Yaser Shaikh
 */
export async function sendMail({
    subject,
    htmlContent,
    textContent = '',
    toEmail = process.env.MAIL_TO_EMAIL,
    toName = process.env.MAIL_TO_NAME || ''
}) {
    try {
        // Validate environment variables
        if (!process.env.BREVO_API_KEY) {
            throw new Error('BREVO_API_KEY is not set in .env');
        }

        if (!process.env.MAIL_FROM_EMAIL) {
            throw new Error('MAIL_FROM_EMAIL is not set in .env');
        }

        // Prepare request payload
        const payload = {
            sender: {
                email: process.env.MAIL_FROM_EMAIL,
                name: process.env.MAIL_FROM_NAME || 'Website'
            },
            to: [
                {
                    email: toEmail,
                    name: toName
                }
            ],
            subject,
            htmlContent,
            textContent
        };

        // Send request to Brevo API
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(
                result.message ||
                result.code ||
                `HTTP ${response.status}`
            );
        }

        console.log('Email sent successfully.');
        console.log('Message ID:', result.messageId);

        return {
            success: true,
            messageId: result.messageId,
            response: result
        };
    } catch (error) {
        console.error('Error sending email:', error.message);

        return {
            success: false,
            error: error.message
        };
    }
}