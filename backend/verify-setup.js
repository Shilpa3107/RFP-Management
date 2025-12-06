require('dotenv').config();
const { sequelize } = require('./models');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');

async function verifySetup() {
    console.log("🔍 Starting System Verification...\n");

    // 1. Test Database Connection
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connection: SUCCESS");
    } catch (error) {
        console.error("❌ Database Connection: FAILED");
        console.error("   Error:", error.message);
    }

    // 2. Test Gemini AI API
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say 'AI is working' if you can hear me.");
        const response = await result.response;
        const text = response.text();
        if (text) {
            console.log(`✅ Gemini AI Integration: SUCCESS (Response: "${text.trim()}")`);
        } else {
            throw new Error("Empty response from AI");
        }
    } catch (error) {
        console.error("❌ Gemini AI Integration: FAILED");
        console.error("   Error:", error.message);
    }

    // 3. Test Email Sending (SMTP)
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.ethereal.email",
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"System Test" <test@example.com>',
            to: process.env.EMAIL_USER, // Send to self
            subject: "System Verification Test",
            text: "If you are reading this, email sending is working!",
        });

        console.log(`✅ Email Sending: SUCCESS`);
        console.log(`   Message ID: ${info.messageId}`);
        if (process.env.EMAIL_HOST.includes('ethereal')) {
            console.log(`   View email at: ${nodemailer.getTestMessageUrl(info)}`);
        }
    } catch (error) {
        console.error("❌ Email Sending: FAILED");
        console.error("   Error:", error.message);
    }

    console.log("\n🏁 Verification Complete. Press Ctrl+C to exit if needed.");
    process.exit(0);
}

verifySetup();
