import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "64kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: "openai",
    configured: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI service is not configured yet."
      });
    }

    const messages = Array.isArray(req.body?.messages)
      ? req.body.messages
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .slice(-30)
      : [];

    if (!messages.length) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: "You are a helpful, friendly AI assistant. Answer clearly and naturally.",
      input: messages
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      throw new Error("OpenAI returned an empty response.");
    }

    res.json({ answer });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    res.status(502).json({
      error: "I couldn't connect to the AI right now. Please try again."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`AI Chat listening on port ${port}`);
});
