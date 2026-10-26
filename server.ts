import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { AIProviderManager } from "./server/aiService";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshots and documents (up to 50mb)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 1. Status endpoint for AI configuration
app.get("/api/ai/status", (req, res) => {
  const provider = AIProviderManager.getProvider();
  res.json({
    status: "online",
    activeProvider: provider.name,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 2. Configure active provider (Gemini or Open-Source / Open-Weight endpoints like Ollama, vLLM)
app.post("/api/ai/config", (req, res) => {
  const { provider, endpoint, modelName, apiKey } = req.body;
  try {
    const activeName = AIProviderManager.setProvider(provider, { endpoint, modelName, apiKey });
    res.json({ success: true, activeProvider: activeName });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to configure AI provider" });
  }
});

// 3. Document extraction endpoint temporarily disabled
app.post("/api/ai/extract", (_req, res) => {
  res.status(404).json({ error: "Document and PDF extraction is temporarily disabled." });
});
app.post("/api/gemini/extract", (_req, res) => {
  res.status(404).json({ error: "Document and PDF extraction is temporarily disabled." });
});

// 4. API endpoint for smart daily plan generation
const handlePlanDay = async (req: express.Request, res: express.Response) => {
  const { commitments, userName, availableHours, studyRhythm } = req.body;
  try {
    const provider = AIProviderManager.getProvider();
    const result = await provider.generateDayPlan({
      commitments: commitments || [],
      userName,
      availableHours,
      studyRhythm,
    });
    res.json(result);
  } catch (err: any) {
    console.error("Plan day error in server handler:", err);
    res.status(500).json({ error: err.message || "Failed to generate daily plan" });
  }
};

app.post("/api/ai/plan-day", handlePlanDay);
app.post("/api/gemini/plan-day", handlePlanDay);

// 5. API endpoint for AI Student Assistant Companion
app.post("/api/ai/assistant", async (req, res) => {
  const { message, context } = req.body;
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Enter a message before sending it." });
  }

  try {
    const provider = AIProviderManager.getProvider();
    const result = await provider.chatAssistant({
      message,
      context: context || { commitments: [], goals: [], dailyPlan: [], userName: "Student" },
    });
    res.json(result);
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "Failed to get an AI assistant response.";
    res.status(500).json({ error: message });
  }
});

// Mount Vite middleware for dev mode, static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
