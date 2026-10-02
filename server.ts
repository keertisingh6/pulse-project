import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshots and documents
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set. Extract feature will use mock response.");
}

// Today's context date for the AI (from metadata: 2026-06-24)
const SYSTEM_INSTRUCTION = `
You are Kairo, the calm, friendly, and deeply human AI companion for "Pulse", a mindful organizer.
People get overwhelmed by reminders; your job is to extract commitments from documents, screenshots, emails, or syllabus notices, and reassure the user with helpful, warm advice.
Today's date is Wednesday, June 24, 2026. Use this to compute relative due dates (e.g., "next Friday" is 2026-07-03, "tomorrow" is 2026-06-25, etc.).
Extract all commitments you find. If the source text is short, or it is a simple bill or exam, extract at least that one commitment.
Make the AI Tips feel calm, gentle, and practical. Example: "Let's schedule a quiet focus session tomorrow evening to tackle this first part. You've got this."
Never sound robotic or dry. Write like a warm mentor.
`;

// API endpoint to extract commitments
app.post("/api/gemini/extract", async (req, res) => {
  const { text, fileData, mimeType, fileName } = req.body;

  if (!ai) {
    // Graceful fallback if API key is missing during development
    return res.status(200).json({
      fallback: true,
      commitments: [
        {
          title: fileName ? `Processed: ${fileName}` : "Mock Extracted Assignment",
          type: "Assignment",
          dueDate: "2026-06-30",
          dueTime: "23:59",
          estimatedEffort: "2 hours",
          effortMinutes: 120,
          priority: "high",
          notes: "Extracted from sample upload: " + (text || "document image"),
          aiTip: "Hey! Kairo here. I've parsed this commitment. Since you usually study in the evenings, let's schedule a quiet study session on Thursday at 7:30 PM. You'll finish comfortably before the deadline.",
          owner: "me",
          repeat: "none",
          location: "Library / Virtual Study Room",
          travelTimeMinutes: 0,
          prepTimeMinutes: 15,
          suggestedStartTime: "2026-06-29T19:30:00"
        }
      ]
    });
  }

  try {
    const contents: any[] = [];
    
    if (fileData && mimeType) {
      contents.push({
        inlineData: {
          data: fileData, // Base64 encoded string
          mimeType: mimeType
        }
      });
    }

    const textPrompt = `
Analyze this input and extract all real-world commitments.
FileName Context: ${fileName || "unknown"}
Text content (if any): ${text || ""}

For each commitment found, extract:
- title: A clean, human-readable title (e.g., "Physics Lab Exam", "PGE Utility Bill", "Weekly Design Sync").
- type: Strictly choose one of: 'Assignment', 'Meeting', 'Bill', 'Appointment', 'Event', 'Travel', 'Other'.
- dueDate: Best estimate of the due date in YYYY-MM-DD format. If only a time is given, use 2026-06-24. If relative, calculate it from Wednesday, June 24, 2026.
- dueTime: Best estimate of the ending or start time in HH:MM format (24h clock, e.g., "14:30"). If not found, use "12:00".
- estimatedEffort: E.g., "1 hour", "3 hours", "45 mins".
- effortMinutes: Estimated minutes of active work or participation required as an integer (e.g. 60, 180, 45).
- priority: 'high', 'medium', or 'low'.
- notes: Highlight key context, instructions, or criteria.
- aiTip: Reassuring, warm, calm personal recommendation from Kairo. Keep it human and friendly.
- location: (Optional) Physical or virtual location if mentioned (e.g., "Hall C", "Google Meet"). Default to "".
- owner: 'me', 'shared', or 'someone_else'. Choose 'someone_else' if another family member or person is mentioned as primary (e.g., "Dad", "spouse").
- ownerName: Name of the owner if 'someone_else' or 'shared' (e.g. "Dad", "Dev Team"). Default to "".
- repeat: 'none', 'daily', 'weekly', or 'monthly'.
- travelTimeMinutes: (Optional) Estimated travel/transit time in minutes if location is physical (e.g., 20). Defaults to 0.
- prepTimeMinutes: (Optional) Estimated minutes of preparation or setup needed beforehand (e.g. 15). Defaults to 10.
- suggestedStartTime: (Optional) Recommended specific starting time computed so the user finishes comfortably on time, formatted as text e.g., "Thursday, June 25 at 7:30 PM".
`;

    contents.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { 
                type: Type.STRING, 
                enum: ['Assignment', 'Meeting', 'Bill', 'Appointment', 'Event', 'Travel', 'Other'] 
              },
              dueDate: { type: Type.STRING },
              dueTime: { type: Type.STRING },
              estimatedEffort: { type: Type.STRING },
              effortMinutes: { type: Type.INTEGER },
              priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
              notes: { type: Type.STRING },
              aiTip: { type: Type.STRING },
              location: { type: Type.STRING },
              owner: { type: Type.STRING, enum: ['me', 'shared', 'someone_else'] },
              ownerName: { type: Type.STRING },
              repeat: { type: Type.STRING, enum: ['none', 'daily', 'weekly', 'monthly'] },
              travelTimeMinutes: { type: Type.INTEGER },
              prepTimeMinutes: { type: Type.INTEGER },
              suggestedStartTime: { type: Type.STRING }
            },
            required: ["title", "type", "dueDate", "estimatedEffort", "effortMinutes", "priority", "notes", "aiTip"]
          }
        }
      }
    });

    const jsonText = response.text || "[]";
    const parsedData = JSON.parse(jsonText);
    res.json({ commitments: parsedData });
  } catch (err: any) {
    console.error("Gemini Extraction Error:", err);
    res.status(500).json({ error: err.message || "Failed to process document with Gemini" });
  }
});

// One-click AI daily planner generator
app.post("/api/gemini/plan-day", async (req, res) => {
  const { commitments, userName } = req.body;

  if (!ai) {
    return res.json({
      plan: [
        { title: "Morning Focus: Urgent commitments review", timeSlot: "09:00 - 10:30", type: "study", isCompleted: false },
        { title: "Calming Breath & Coffee Break", timeSlot: "10:30 - 11:00", type: "break", isCompleted: false },
        { title: "Work session: High priority client deadlines", timeSlot: "11:00 - 12:30", type: "work", isCompleted: false },
        { title: "Mindful Lunch & Walk", timeSlot: "12:30 - 13:30", type: "break", isCompleted: false },
        { title: "Afternoon Session: Complete remaining bills", timeSlot: "13:30 - 15:00", type: "payment", isCompleted: false }
      ],
      aiAdvice: `Hi ${userName || "friend"}! Based on your commitments, I've designed a gentle, steady flow for your day. We'll start with your highest priority work, followed by structured breaks to keep your energy bright. Let's take it one step at a time.`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `
Generate a balanced daily plan for ${userName || "Keerti"} based on these active commitments:
${JSON.stringify(commitments)}

Create a realistic plan featuring:
1. Work/Study slots dedicated to high priority commitments.
2. Healthy breaks (e.g., "Lunch & Walk", "Tea & stretch").
3. Admin/Payment slots for any bills.

Structure the response as a JSON object with:
- plan: Array of items, each with:
  - title (string)
  - timeSlot (string, format like "09:00 - 10:30")
  - type (string, strictly 'work' | 'study' | 'break' | 'payment')
  - isCompleted (boolean, defaults to false)
- aiAdvice: A warm, encouraging paragraph from Kairo explaining the design of the day. Keep it calming.
`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['work', 'study', 'break', 'payment'] },
                  isCompleted: { type: Type.BOOLEAN }
                },
                required: ["title", "timeSlot", "type", "isCompleted"]
              }
            },
            aiAdvice: { type: Type.STRING }
          },
          required: ["plan", "aiAdvice"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Planning Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate plan" });
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
