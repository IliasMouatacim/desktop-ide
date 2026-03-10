const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
let ai = null;

try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (error) {
    console.error("Failed to initialize Google Gen AI:", error);
}

router.post('/chat', async (req, res) => {
    if (!ai) {
        return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    try {
        const { message, activeFileContext, history } = req.body;

        let systemInstruction = "You are an expert AI programming assistant built directly into a Cloud IDE.\n" +
            "You help the user understand code, write new code, and debug errors.\n" +
            "Always provide clear, concise, and accurate answers. Format code blocks using markdown.";

        if (activeFileContext) {
            systemInstruction += `\n\nContext: The user currently has the following file open in their editor:\n` +
                `File Path: ${activeFileContext.path}\n` +
                `\`\`\`\n${activeFileContext.content}\n\`\`\``;
        }

        // Convert frontend history format to Gemini format
        const contents = [];
        if (history && Array.isArray(history)) {
            for (const msg of history) {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            }
        }

        // Add the current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate response from Gemini API.' });
    }
});

module.exports = router;
