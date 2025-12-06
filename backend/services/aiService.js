const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const MOCK_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'gemini-placeholder';

// Helper to clean markdown code blocks from JSON response
function cleanJson(text) {
    try {
        // Try to find JSON block
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return match[0];
        return text.replace(/```json\n?|\n?```/g, '').trim();
    } catch (e) {
        return text;
    }
}

async function generateRFPStructure(prompt) {
    if (MOCK_MODE) {
        console.log('Using Mock AI for RFP Generation');
        return {
            title: "Procurement for " + prompt.substring(0, 20) + "...",
            items: [
                { name: "Laptop", quantity: 20, specs: "16GB RAM" },
                { name: "Monitor", quantity: 15, specs: "27-inch" }
            ],
            budget: 50000,
            currency: "USD",
            delivery_deadline: "30 days",
            payment_terms: "Net 30",
            warranty: "1 year"
        };
    }

    try {
        const systemPrompt = "You are a procurement assistant. Parse the user's request into a structured JSON RFP. Return ONLY JSON. Fields: title, items (array of name, quantity, specs), budget, currency, delivery_deadline, payment_terms, warranty.";
        const result = await model.generateContent(systemPrompt + "\n\nUser Request: " + prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Raw Response:", text); // Debug log
        return JSON.parse(cleanJson(text));
    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("Failed to generate RFP structure: " + error.message);
    }
}

async function parseVendorResponse(emailContent) {
    if (MOCK_MODE) {
        console.log('Using Mock AI for Parsing Response');
        return {
            vendorName: "Tech Solutions Inc",
            items: [
                { name: "Laptop", price: 1200, total: 24000 },
                { name: "Monitor", price: 300, total: 4500 }
            ],
            totalCost: 28500,
            leadTime: "2 weeks",
            paymentTerms: "Net 30",
            validity: "30 days"
        };
    }

    try {
        const systemPrompt = "Extract key proposal details from this vendor email. Return ONLY JSON. Fields: vendorName (if found), items (array of name, price, total), totalCost, leadTime, paymentTerms, validity.";
        const result = await model.generateContent(systemPrompt + "\n\nEmail Content:\n" + emailContent);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(cleanJson(text));
    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("Failed to parse vendor response");
    }
}

async function compareAndRecommend(rfp, proposals) {
    if (MOCK_MODE) {
        return {
            summary: "Comparison of " + proposals.length + " proposals.",
            recommendation: "Vendor A is recommended due to lower price and faster delivery.",
            scores: { "Vendor A": 90, "Vendor B": 85 }
        };
    }

    const prompt = `RFP: ${JSON.stringify(rfp)}\n\nProposals: ${JSON.stringify(proposals)}\n\nCompare these proposals and provide a recommendation. Return ONLY JSON with fields: summary, recommendation, scores (object with vendorId (or vendor name if id missing) as key and score 0-100 as value).`;

    try {
        const result = await model.generateContent("You are a procurement expert. Compare proposals against the RFP. " + prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(cleanJson(text));
    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("Failed to generate recommendation");
    }
}

module.exports = {
    generateRFPStructure,
    parseVendorResponse,
    compareAndRecommend
};
