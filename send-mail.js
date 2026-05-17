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

export async function sendMail(city, country, localTime, browser, os) {
    try {
        await transporter.sendMail({
            from: `"Portfolio Tracker" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `👀 New visit from ${city}, ${country}`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#0f0f0f;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;">👀</p>
              <h1 style="margin:10px 0 4px;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.5px;">
                Someone visited your Portfolio
              </h1>
              <p style="margin:0;color:#888888;font-size:13px;">Real-time visitor alert</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Location Row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#f9f9f9;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Location</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#0f0f0f;">📍 ${city}, ${country}</p>
                  </td>
                </tr>
              </table>

              <!-- Time Row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#f9f9f9;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Visit Time</p>
                    <p style="margin:0;font-size:15px;font-weight:500;color:#0f0f0f;">🕐 ${localTime}</p>
                  </td>
                </tr>
              </table>

              <!-- Browser + OS side by side -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="background:#f9f9f9;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Browser</p>
                    <p style="margin:0;font-size:15px;font-weight:500;color:#0f0f0f;">🌐 ${browser}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#f9f9f9;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">OS</p>
                    <p style="margin:0;font-size:15px;font-weight:500;color:#0f0f0f;">💻 ${os}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;">
                Sent by your Portfolio Tracker · Automated alert
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
            `
        });

        return { success: true };
    } catch (error) {
        console.error('Mail send failed:', error.message);
        return { success: false, message: error.message };
    }
}