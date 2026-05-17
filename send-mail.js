import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function sendMail(city, country, localTime, browser, os, pageUrl) {
    try {
        await transporter.sendMail({
            from: `"Portfolio Tracker" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `👀 New visit from ${city}, ${country}`,
            text: `
New visitor on your portfolio!

Location : ${city}, ${country}
Time     : ${localTime}
Browser  : ${browser}
OS       : ${os}
Page     : ${pageUrl}
            `.trim()
        });

        return { success: true };
    } catch (error) {
        console.error('Mail send failed:', error.message);
        return { success: false, message: error.message };
    }
}