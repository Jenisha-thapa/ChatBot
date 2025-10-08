// functions/server.js
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.7, maxOutputTokens: 512 },
    });

    let reply = "No reply";
    if (response?.candidates?.[0]?.content?.parts?.length) {
      reply = response.candidates[0].content.parts.map(p => p.text || "").join("\n");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, model: "gemini-2.5-flash", prompt, reply }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
