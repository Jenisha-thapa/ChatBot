import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// POST /generate endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Generate content
    const result = await model.generateContent(prompt);
    const text = result.response?.text();

    // Clean response for the user
    res.json({
      success: true,
      model: "gemini-2.5-flash",
      prompt,
      reply: text || "No meaningful response received.",
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
