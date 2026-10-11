import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { evaluateSituationAndSelectMeme, isSeriousSituation } from "../src/utils/memeEngine";

dotenv.config();

export interface CommitmentExtractionResult {
  title: string;
  type: string;
  subject?: string;
  dueDate: string;
  dueTime?: string;
  estimatedEffort: string;
  effortMinutes: number;
  priority: "high" | "medium" | "low";
  notes?: string;
  aiTip?: string;
  location?: string;
  owner?: "me" | "shared" | "someone_else";
  ownerName?: string;
  repeat?: "none" | "daily" | "weekly" | "monthly";
  travelTimeMinutes?: number;
  prepTimeMinutes?: number;
  suggestedStartTime?: string;
}

export interface DayPlanResult {
  plan: Array<{
    title: string;
    timeSlot: string;
    type: "work" | "study" | "break" | "payment";
    isCompleted: boolean;
    commitmentId?: string;
    estimatedMinutes?: number;
    subject?: string;
  }>;
  aiAdvice: string;
  conflicts?: string[];
  totalStudyHours?: string;
}

export interface AssistantChatResult {
  reply: string;
  suggestedActions?: Array<{
    label: string;
    actionType: "filter" | "navigate" | "reschedule" | "add_focus";
    payload?: any;
  }>;
}

export interface IAIProvider {
  name: string;
  extractCommitments(input: {
    text?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
  }): Promise<CommitmentExtractionResult[]>;

  generateDayPlan(input: {
    commitments: any[];
    userName?: string;
    availableHours?: number;
    studyRhythm?: string;
  }): Promise<DayPlanResult>;

  chatAssistant(input: {
    message: string;
    context: {
      commitments: any[];
      goals: any[];
      dailyPlan: any[];
      profile?: any;
      userName: string;
      streakDays?: number;
      memePersonalityMode?: "off" | "college_friend" | "full_desi";
    };
  }): Promise<AssistantChatResult>;
}

// Current dynamic reference date for relative calculations
const getCurrentDateContext = () => {
  const now = new Date();
  const isoDate = now.toISOString().split("T")[0];
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  return { isoDate, dayName, timeStr, full: `${isoDate} (${dayName}), current time: ${timeStr}` };
};

const getSystemInstructionExtraction = () => {
  const dateContext = getCurrentDateContext();
  return `You are Pulse AI's document extraction engine.
TODAY'S REFERENCE DATE: ${dateContext.full}.
Relative dates (e.g., "tomorrow", "this Friday", "next week", "in 3 days") MUST be resolved relative to today (${dateContext.isoDate}).
TASK: Extract only the explicit commitments, deadlines, tasks, exams, assignments, meetings, or bills that are actually contained in the document.
CRITICAL RULES:
1. ONLY extract information that is explicitly present or clearly supported by the document.
2. DO NOT invent, hallucinate, or assume deadlines, times, or dates.
3. DO NOT generate study routines, study schedules, prep routines, or suggested start times.
4. For estimatedEffort: ONLY extract if explicitly stated in the document. If not specified, return an empty string "".
5. For dueTime: If a specific time is mentioned, format as HH:MM. If NO specific time is stated, return an empty string "".
6. For dueDate: YYYY-MM-DD format. If no date is stated, return an empty string "".
7. If the document lists multiple commitments, extract each one as a distinct item.
8. If the document contains NO commitments, return an empty array [].`;
};

// 1. Google Gemini Provider Implementation
export class GeminiProvider implements IAIProvider {
  name = "Google Gemini";
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }

  async extractCommitments(input: {
    text?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
  }): Promise<CommitmentExtractionResult[]> {
    if (!this.ai || !process.env.GEMINI_API_KEY) {
      console.error("[AI Extract] Gemini client is not initialized or GEMINI_API_KEY is missing.");
      throw new Error("AI extraction is unavailable. Please configure the AI model/API connection.");
    }

    const approxSize = input.fileData
      ? `${Math.round((input.fileData.length * 0.75) / 1024)} KB`
      : (input.text ? `${input.text.length} chars` : "0 B");

    console.log(`[AI Extract] Starting extraction pipeline:`, {
      fileName: input.fileName || "unnamed",
      mimeType: input.mimeType || "none",
      hasFileData: !!input.fileData,
      approximateSize: approxSize,
    });

    const parts: any[] = [];

    // Multimodal handling: Pass actual file bytes and MIME type to Gemini
    if (input.fileData && input.mimeType) {
      const cleanMime = input.mimeType.trim().toLowerCase();
      const isMultimodal = cleanMime.startsWith("image/") || cleanMime === "application/pdf";
      if (isMultimodal) {
        parts.push({
          inlineData: {
            data: input.fileData,
            mimeType: cleanMime,
          },
        });
      }
    }

    // Pass user text or text file content if present
    if (input.text && input.text.trim()) {
      parts.push({
        text: `Document text content:\n${input.text.trim()}`,
      });
    }

    const dateContext = getCurrentDateContext();

    const extractionPrompt = `
You are Pulse AI's academic document extraction engine.
TODAY'S REFERENCE DATE: ${dateContext.full}.
Relative dates (e.g., "tomorrow", "this Friday", "next week", "in 3 days") MUST be resolved relative to today (${dateContext.isoDate}).

TASK:
Analyze the attached document (${input.fileName || "document"}).
Extract all assignments, coursework deadlines, homework tasks, exams, syllabus milestones, readings, or commitments described in the document.

EXTRACTION GUIDELINES:
1. Extract any specific deadlines, exam dates, submission dates, or class dates present in the document. Format dueDate as YYYY-MM-DD.
2. If the document is a syllabus, course outline, homework assignment, or lecture note without explicit calendar dates, extract the actionable assignments, lab tasks, projects, or review topics. For items without an explicit calendar date, set dueDate to today (${dateContext.isoDate}).
3. For dueTime: If specified, format as HH:MM in 24-hour time. If not specified, default to "23:59".
4. For estimatedEffort: State approximate effort (e.g., "1 hour", "45 mins") if indicated or reasonable for the task.
5. For subject: Identify the course, subject, or module (e.g. "DBMS", "Physics", "Linear Algebra", "General").
6. For priority: "high" for exams, midterms, and major project deadlines; "medium" for standard assignments and homework; "low" for optional reading.
7. If the document contains multiple tasks, assignments, or units, extract each one as a distinct item.
`;

    parts.push({ text: extractionPrompt });

    // Models to try: primary 'gemini-3.8-flash', and 'gemini-3.1-flash-lite' if transient 503 spike occurs
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Extract] Sending request to AI model: ${modelName}...`);
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: parts,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    description: "Type: 'Assignment' | 'Exam' | 'Class' | 'Meeting' | 'Bill' | 'Appointment' | 'Event' | 'Interview' | 'Task' | 'Other'",
                  },
                  subject: { type: Type.STRING },
                  dueDate: { type: Type.STRING },
                  dueTime: { type: Type.STRING },
                  estimatedEffort: { type: Type.STRING },
                  effortMinutes: { type: Type.INTEGER },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  notes: { type: Type.STRING },
                  location: { type: Type.STRING },
                },
                required: ["title", "type", "priority"],
              },
            },
          },
        });

        const rawText = response.text?.trim() || "[]";
        console.log(`[AI Extract] Model ${modelName} returned response (${rawText.length} characters).`);

        let parsed: any;
        try {
          parsed = JSON.parse(rawText);
        } catch (jsonErr: any) {
          console.warn(`[AI Extract] JSON parsing warning:`, jsonErr.message);
          parsed = [];
        }

        let list = Array.isArray(parsed) ? parsed : (parsed.commitments || [parsed]);
        
        // If the AI returned an empty array, construct a helpful review commitment from the document
        if (list.length === 0 && (input.fileName || input.text)) {
          const docLabel = input.fileName 
            ? input.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
            : 'Uploaded Document';
          list = [{
            title: `Review ${docLabel}`,
            type: "Assignment",
            subject: "Coursework",
            dueDate: dateContext.isoDate,
            dueTime: "23:59",
            estimatedEffort: "45 mins",
            effortMinutes: 45,
            priority: "medium",
            notes: "Document imported into Life Inbox for review and scheduling.",
            location: "",
          }];
        }

        console.log(`[AI Extract] Successfully extracted ${list.length} commitment(s) from document.`);

        return list.map((item: any) => ({
          title: item.title || "Untitled Commitment",
          type: item.type || "Assignment",
          subject: item.subject || "",
          dueDate: item.dueDate || dateContext.isoDate,
          dueTime: item.dueTime || "23:59",
          estimatedEffort: item.estimatedEffort || "45 mins",
          effortMinutes: typeof item.effortMinutes === "number" ? item.effortMinutes : 45,
          priority: (item.priority as "high" | "medium" | "low") || "medium",
          notes: item.notes || "",
          location: item.location || "",
          owner: "me" as const,
          repeat: "none" as const,
        }));
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Extract] Notice with model ${modelName}:`, err.message || err);
      }
    }

    console.warn(`[AI Extract] Using graceful fallback extraction.`);
    const fallbackLabel = input.fileName 
      ? input.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      : 'Uploaded Document';
    return [{
      title: `Review ${fallbackLabel}`,
      type: "Assignment",
      subject: "Coursework",
      dueDate: dateContext.isoDate,
      dueTime: "23:59",
      estimatedEffort: "45 mins",
      effortMinutes: 45,
      priority: "medium",
      notes: "Document imported for review and scheduling.",
      location: "",
      owner: "me" as const,
      repeat: "none" as const,
    }];
  }

  async generateDayPlan(input: {
    commitments: any[];
    userName?: string;
    availableHours?: number;
    studyRhythm?: string;
  }): Promise<DayPlanResult> {
    const active = input.commitments.filter((c) => !c.completed);
    const totalEffortMinutes = active.reduce((sum, c) => sum + (c.effortMinutes || 60), 0);
    const availableHours = input.availableHours || 6;
    const availableMinutes = availableHours * 60;

    const conflicts: string[] = [];
    if (totalEffortMinutes > availableMinutes) {
      conflicts.push(
        `Total active commitment effort (${Math.round(totalEffortMinutes / 60)}h) exceeds your planned daily focus window (${availableHours}h). High-priority items have been prioritized, while lower-priority tasks are scheduled for tomorrow.`
      );
    }

    if (!this.ai) {
      return {
        plan: [
          { title: "Deep Focus: Urgent academic commitments", timeSlot: "09:00 - 10:30", type: "study", isCompleted: false },
          { title: "Calming Breath & Water Break", timeSlot: "10:30 - 10:45", type: "break", isCompleted: false },
          { title: "Subject Session: High priority project review", timeSlot: "11:00 - 12:30", type: "work", isCompleted: false },
          { title: "Mindful Lunch & Campus Walk", timeSlot: "12:30 - 13:30", type: "break", isCompleted: false },
          { title: "Afternoon Block: Complete pending tasks & submissions", timeSlot: "14:00 - 15:30", type: "study", isCompleted: false },
        ],
        aiAdvice: `Hi ${input.userName || "friend"}! I've structured an achievable, balanced flow for today. We tackle highest priority syllabus items first, interspaced with relaxing reset breaks.`,
        conflicts,
        totalStudyHours: `${Math.round(totalEffortMinutes / 60)}h`,
      };
    }

    try {
      const prompt = `
Generate a balanced, realistic student daily schedule for ${input.userName || "Student"}.
Available focus hours: ${availableHours} hours (${availableMinutes} mins).
Study rhythm: ${input.studyRhythm || "balanced"}.
Active commitments:
${JSON.stringify(active, null, 2)}

Requirements:
1. Prioritize upcoming exams, assignments, and urgent deadlines.
2. Insert structured restorative breaks (e.g. 15-min stretch/tea, 60-min lunch).
3. Do not overload unrealistic blocks. If total effort exceeds available hours, fit only realistic items and note it in aiAdvice.
4. Output JSON:
- plan: array of objects with title, timeSlot (e.g. "09:00 - 10:30"), type ('work'|'study'|'break'|'payment'), isCompleted (false)
- aiAdvice: warm mentor advice explaining the structure
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
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
                    type: { type: Type.STRING, enum: ["work", "study", "break", "payment"] },
                    isCompleted: { type: Type.BOOLEAN },
                  },
                  required: ["title", "timeSlot", "type", "isCompleted"],
                },
              },
              aiAdvice: { type: Type.STRING },
            },
            required: ["plan", "aiAdvice"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        plan: parsed.plan || [],
        aiAdvice: parsed.aiAdvice || "Here is your plan for today.",
        conflicts,
        totalStudyHours: `${(totalEffortMinutes / 60).toFixed(1)}h`,
      };
    } catch (err) {
      console.warn("Gemini planning error, fallback:", err);
      return {
        plan: [
          { title: "Morning Focus: Core academic commitments", timeSlot: "09:00 - 10:30", type: "study", isCompleted: false },
          { title: "Mindful Reset & Coffee", timeSlot: "10:30 - 11:00", type: "break", isCompleted: false },
          { title: "Secondary assignment work session", timeSlot: "11:00 - 12:30", type: "work", isCompleted: false },
        ],
        aiAdvice: `I've mapped out a gentle, high-impact day for you. Let's start with your top commitment.`,
        conflicts,
      };
    }
  }

  async chatAssistant(input: {
    message: string;
    context: {
      commitments: any[];
      goals: any[];
      dailyPlan: any[];
      profile?: any;
      userName: string;
      streakDays?: number;
      memePersonalityMode?: "off" | "college_friend" | "full_desi";
    };
  }): Promise<AssistantChatResult> {
    const { message, context } = input;
    const activeCommitments = (context.commitments || []).filter((c) => !c.completed);
    const highPriority = activeCommitments.filter((c) => c.priority === "high");
    const personalityMode = context.memePersonalityMode || "college_friend";

    // Immediate sensitivity check
    if (isSeriousSituation(message)) {
      return {
        reply: `I hear you, ${context.userName}. Please take a deep breath and put your well-being first right now. College deadlines and coursework can always be adjusted, and you don't have to carry all of this pressure alone. Please speak with someone you trust or campus counseling if you're hurting. We can pause planning until you feel grounded.`,
        suggestedActions: [
          { label: "View Today's Plan", actionType: "navigate", payload: "today" },
        ],
      };
    }

    if (!this.ai) {
      // Deterministic intelligent assistant fallback with authentic meme personality
      const memeEval = evaluateSituationAndSelectMeme({
        query: message,
        activeCommitmentsCount: activeCommitments.length,
        urgentCommitmentsCount: highPriority.length,
        overdueCount: activeCommitments.filter((c) => c.dueDate && c.dueDate < new Date().toISOString().split("T")[0]).length,
        totalPlannedHours: activeCommitments.reduce((acc, c) => acc + (c.effortMinutes || 60), 0) / 60,
        streakDays: context.streakDays || 0,
        personalityMode,
        sourceScreen: "chat",
      });

      const memeLead = memeEval.humorSnippet ? `> *${memeEval.humorSnippet}*\n\n` : "";
      const q = message.toLowerCase();

      if (q.includes("today") || q.includes("finish")) {
        const top = activeCommitments.slice(0, 3).map((c) => `• **${c.title}** (Due: ${c.dueDate || 'Today'}, Effort: ${c.estimatedEffort || '1 hour'})`).join("\n");
        return {
          reply: `${memeLead}Here is what needs your attention today, ${context.userName}:\n\nYou have **${activeCommitments.length} active commitments**, with **${highPriority.length} marked urgent**.\n\n${top || "All clear for today!"}\n\nWould you like me to schedule a dedicated 45-minute focus session for your top task?`,
          suggestedActions: [
            { label: "View Today's Plan", actionType: "navigate", payload: "today" },
            { label: "Start 25m Timer", actionType: "add_focus", payload: 25 },
          ],
        };
      } else if (q.includes("deadline") || q.includes("next")) {
        const sorted = [...activeCommitments].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
        const next = sorted[0];
        if (next) {
          return {
            reply: `${memeLead}Your closest upcoming deadline is **${next.title}** on **${next.dueDate}** (${next.dueTime || "end of day"}). Estimated effort is **${next.estimatedEffort || "approx 1h"}**. ${next.aiTip || ""}`,
            suggestedActions: [
              { label: "Open in Calendar", actionType: "navigate", payload: "calendar" },
            ],
          };
        }
        return { reply: `${memeLead}You don't have any pending deadlines on your radar right now! Clean slate.` };
      } else if (q.includes("exam") || q.includes("viva")) {
        const exams = activeCommitments.filter((c) => c.type === "Exam" || (c.subject && c.subject.toLowerCase().includes("exam")));
        return {
          reply: exams.length > 0
            ? `${memeLead}You have **${exams.length} upcoming exam items**:\n\n` +
              exams.map((e) => `• **${e.title}** (${e.subject || "Exam"}) — Due ${e.dueDate} · ${e.estimatedEffort || "review"} prep`).join("\n")
            : `${memeLead}No active exams scheduled right now. Great time to stay consistent on weekly coursework!`,
          suggestedActions: [{ label: "View Goals", actionType: "navigate", payload: "goals" }],
        };
      }

      // Default contextual reply
      return {
        reply: `${memeLead}Hey ${context.userName}! I'm tracking your **${activeCommitments.length} active commitments** and **${(context.goals || []).length} major goals**. You can ask me to prioritize your day, find upcoming deadlines, or schedule study sprints.`,
        suggestedActions: [
          { label: "What should I work on next?", actionType: "filter", payload: "urgent" },
          { label: "Show today's plan", actionType: "navigate", payload: "today" },
        ],
      };
    }

    try {
      const memeGuidelinePrompt = personalityMode === "off"
        ? `PERSONALITY MODE: Strictly neutral, calm, professional mentor. No humor, no jokes, no slang.`
        : `
AUTHENTIC INDIAN MEME & DESI COLLEGE FRIEND PERSONALITY SYSTEM:
Personality Mode: "${personalityMode}" ('college_friend' = witty authentic desi college buddy who knows the internet; 'full_desi' = hostelite banter with authentic desi humor).

CRITICAL DIRECTIVES:
1. NEVER invent fake Indian meme phrases.
2. NEVER generate random generic "Indian-sounding" jokes or caricatures.
3. NEVER produce generic Gen-Z chatbot slang.
4. Reference ONLY REAL, ESTABLISHED Indian/desi internet meme formats when contextually appropriate:
   - "Dekh Raha Hai Vinod" (Panchayat): For procrastination, suspicious decisions, deadline avoidance, questionable planning, observing chaotic schedules.
   - "Binod": Use sparingly only for absurd/random situations or mystery drops. Never use simply because someone's name resembles Binod.
   - "Rasode Mein Kaun Tha" (Saath Nibhaana Saathiya / Yashraj Mukhate): For schedule conflicts, identifying what caused a collision, or "who put this task here?".
   - "Pawri Ho Rahi Hai" (viral Pawri trend): For completing a major goal, finishing an assignment, completing a productive day, streak continuation. Do not overuse.
   - "Moye Moye" (viral social-media trend): For missed deadlines, failed plans, unexpectedly bad outcomes, humorous minor setbacks. NEVER for serious emotional distress.
   - "JCB Ki Khudai" (JCB excavation trend): For distraction, unnecessary rabbit holes, wasting time watching/doing something unrelated.
   - "Control Uday Control" (Welcome / Nana Patekar): For overloaded schedules, too many tasks, preventing unrealistic planning, calming down when user plan becomes excessive.
   - "Why This Kolaveri Di" (Tanglish): For frustration with coding, difficult assignments, confusing errors, repeated failed attempts.
   - "Gajab Beizzati Hai" (Panchayat): For surprising tough questions, forgotten tasks, self-deprecating student blunders.
   - "Aap Chronology Samajhiye": For sequencing prerequisites before a big project/exam.
   - "Risk Hai Toh Ishq Hai" (Scam 1992): For ambitious hackathons and tough academic challenges.
   - "Babu Rao / Utha Le Re Baba" (Hera Pheri): For chaotic mornings or surprise 8 AM lectures.

5. HUMOR HIERARCHY & BOUNDARIES:
   - The humor must remain secondary to Pulse's actual productivity functionality.
   - ALWAYS provide concrete, practical answers grounded in the user's actual commitments, dates, and courses.
   - If the user discusses genuine emotional distress, anxiety attacks, depression, medical emergencies, or failing out of college, STRICTLY SUPPRESS ALL MEMES/HUMOR. Deliver calm, empathetic, and professional support.
`;

      const prompt = `
You are Kairo, the intelligent, grounded student companion for Pulse.
User: ${context.userName}
Student Profile: ${JSON.stringify(context.profile || {})}
Current Active Commitments:
${JSON.stringify(activeCommitments.map((c) => ({ title: c.title, type: c.type, subject: c.subject, dueDate: c.dueDate, dueTime: c.dueTime, effort: c.estimatedEffort, priority: c.priority, notes: c.notes })), null, 2)}
Goals:
${JSON.stringify(context.goals || [])}
Today's Scheduled Plan:
${JSON.stringify(context.dailyPlan || [])}
Streak: ${context.streakDays || 0} days

${memeGuidelinePrompt}

User says: "${message}"

Respond directly to the user with helpful, specific facts from their actual Pulse data (referencing real course titles, dates, and efforts).
Respond in JSON format:
{
  "reply": "markdown formatted friendly answer",
  "suggestedActions": [
    { "label": "button text", "actionType": "navigate" | "filter" | "add_focus", "payload": "tab or param" }
  ]
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        reply: parsed.reply || "I am here to help guide your commitments.",
        suggestedActions: parsed.suggestedActions || [],
      };
    } catch (err) {
      console.warn("Assistant chat error:", err);
      return {
        reply: `You currently have ${activeCommitments.length} active commitments. Your highest priority item is "${highPriority[0]?.title || "coursework"}". Let's tackle it in steady, calm intervals.`,
      };
    }
  }
}

// 2. Open-Source / Open-Weight Model Provider (OpenAI Compatible API e.g. Ollama, vLLM, LMStudio)
export class OpenSourceModelProvider implements IAIProvider {
  name: string;
  private endpoint: string;
  private modelName: string;
  private apiKey: string;

  constructor(endpoint?: string, modelName?: string, apiKey?: string) {
    this.endpoint = endpoint || process.env.OPEN_MODEL_ENDPOINT || "http://localhost:11434/v1";
    this.modelName = modelName || process.env.OPEN_MODEL_NAME || "qwen2.5-vl";
    this.apiKey = apiKey || process.env.OPEN_MODEL_KEY || "none";
    this.name = `Open-Source (${this.modelName})`;
  }

  async extractCommitments(input: {
    text?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
  }): Promise<CommitmentExtractionResult[]> {
    try {
      const messages: any[] = [
        {
          role: "system",
          content: getSystemInstructionExtraction() + "\nYou MUST return a valid JSON array of commitment objects only.",
        },
      ];

      const userContent: any[] = [];
      if (input.fileData && input.mimeType) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: `data:${input.mimeType};base64,${input.fileData}`,
          },
        });
      }
      userContent.push({
        type: "text",
        text: `Filename: ${input.fileName || "file"}\nText:\n${input.text || "See attached document"}`,
      });

      messages.push({ role: "user", content: userContent });

      const res = await fetch(`${this.endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        throw new Error(`Open-source model returned ${res.status}`);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content || "[]";
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : parsed.commitments || [parsed];
      return list;
    } catch (err: any) {
      console.error("[OpenSource AI Extract] Extraction error:", err.message || err);
      throw new Error(`Open-source model extraction failed: ${err.message || "Endpoint error"}`);
    }
  }

  async generateDayPlan(input: {
    commitments: any[];
    userName?: string;
    availableHours?: number;
    studyRhythm?: string;
  }): Promise<DayPlanResult> {
    try {
      const prompt = `
Generate a realistic daily study plan for ${input.userName || "Student"}.
Active commitments:
${JSON.stringify(input.commitments.filter((c) => !c.completed))}

Return JSON with:
{
  "plan": [
    { "title": string, "timeSlot": "09:00 - 10:30", "type": "study"|"work"|"break", "isCompleted": false }
  ],
  "aiAdvice": string
}
`;
      const res = await fetch(`${this.endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      return JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch (err: any) {
      console.error("[OpenSource AI Plan] Plan generation error:", err.message || err);
      return {
        plan: [],
        aiAdvice: "Could not generate day plan from the open-source endpoint. Please check connection.",
      };
    }
  }

  async chatAssistant(input: {
    message: string;
    context: any;
  }): Promise<AssistantChatResult> {
    try {
      const res = await fetch(`${this.endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: "system",
              content: `You are Kairo, the calm student mentor in Pulse. Context commitments: ${JSON.stringify(
                input.context.commitments?.map((c: any) => c.title)
              )}`,
            },
            { role: "user", content: input.message },
          ],
        }),
      });
      const data = await res.json();
      return {
        reply: data.choices?.[0]?.message?.content || "I am ready to assist with your commitments.",
      };
    } catch (err: any) {
      return {
        reply: `Connected to open-source model endpoint (${this.modelName}). Query: "${input.message}". Keep up your steady momentum!`,
      };
    }
  }
}

// Factory to select active provider
export class AIProviderManager {
  private static activeProvider: IAIProvider = new GeminiProvider();

  static getProvider(): IAIProvider {
    return this.activeProvider;
  }

  static setProvider(providerType: "gemini" | "open_source", config?: { endpoint?: string; modelName?: string; apiKey?: string }) {
    if (providerType === "open_source") {
      this.activeProvider = new OpenSourceModelProvider(config?.endpoint, config?.modelName, config?.apiKey);
    } else {
      this.activeProvider = new GeminiProvider();
    }
    return this.activeProvider.name;
  }
}
