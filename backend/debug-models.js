const fs = require('fs');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const models = [];
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    const modelName = m.name.replace('models/', '');
                    console.log(`- ${modelName}`);
                    models.push(modelName);
                }
            });

            fs.writeFileSync('available-models.txt', models.join('\n'));
            console.log("\nModels saved to available-models.txt");

            // Recommend the first stable model
            const recommended = models.find(m => m.includes('gemini-1.5') || m.includes('gemini-pro')) || models[0];
            console.log(`\nRecommended model: ${recommended}`);
        } else {
            console.error("Failed to list models:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
