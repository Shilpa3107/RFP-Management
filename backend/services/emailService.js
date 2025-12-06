const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Default to Ethereal for testing if not configured
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendRFP(vendorEmail, rfpContent) {
    console.log(`[Email Service] Sending RFP to ${vendorEmail}...`);

    if (process.env.EMAIL_USER === 'test@example.com') {
        console.log(`[Mock Email] Subject: RFP Invitation`);
        console.log(`[Mock Email] Body: ${rfpContent.substring(0, 100)}...`);
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: '"RFP System" <system@example.com>',
            to: vendorEmail,
            subject: "RFP Invitation: " + rfpContent.title,
            text: `Please review our RFP requirements:\n\n${JSON.stringify(rfpContent, null, 2)}`,
            html: `<h1>RFP Invitation</h1><pre>${JSON.stringify(rfpContent, null, 2)}</pre>`,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = {
    sendRFP,
};
