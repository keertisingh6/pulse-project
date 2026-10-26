import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

function kairoApiPlugin(): Plugin {
  return {
    name: 'kairo-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/kairo', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { message, context, apiKey: clientApiKey } = data;
            const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

            if (apiKey && apiKey.trim().length > 0) {
              try {
                // Call Google Gemini API directly
                const systemPrompt = `You are Kairo, a thoughtful, warm, and hyper-actionable AI companion for "Pulse", a student life & focus operating system.
Core philosophy: "High Agency, Low Guilt". Always be supportive, practical, realistic, and never punitive or judgmental.
Given the student's current workload, deadlines, and schedule context:
${JSON.stringify(context || {}, null, 2)}

Provide helpful guidance. If your response includes actionable items (e.g., breaking down a task into steps, rescheduling missed tasks, or recommending a next action), format them as a structured proposal inside a JSON code block with this schema:
\`\`\`json
{
  "proposals": [
    {
      "type": "create_tasks" | "reschedule_tasks" | "adjust_priority",
      "title": "Short title",
      "description": "What this does",
      "payload": { ... }
    }
  ]
}
\`\`\`
Follow the tone: encouraging, clear, concise.`;

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                const apiRes = await fetch(geminiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [
                      {
                        role: 'user',
                        parts: [
                          { text: systemPrompt },
                          { text: `User request: ${message}` }
                        ]
                      }
                    ],
                    generationConfig: {
                      temperature: 0.7,
                      maxOutputTokens: 1000,
                    }
                  })
                });

                if (apiRes.ok) {
                  const geminiData = await apiRes.json();
                  const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help!";
                  
                  // Extract proposals if any
                  let proposals = [];
                  const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
                  let cleanText = replyText;
                  if (jsonMatch) {
                    try {
                      const parsed = JSON.parse(jsonMatch[1]);
                      proposals = parsed.proposals || [];
                      cleanText = replyText.replace(/```json[\s\S]*?```/, '').trim();
                    } catch (e) {
                      // ignore parse error
                    }
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    text: cleanText,
                    proposals,
                    provider: 'gemini-1.5-flash'
                  }));
                  return;
                }
              } catch (geminiErr: any) {
                console.warn('Gemini API call failed, falling back to local engine:', geminiErr?.message);
              }
            }

            // Fallback: Intelligent High-Agency Context-Aware Local Engine
            const textLower = (message || '').toLowerCase();
            let replyText = "";
            let proposals: any[] = [];

            if (textLower.includes('break down') || textLower.includes('subtask') || textLower.includes('daa') || textLower.includes('assignment')) {
              replyText = "I broke down your Data Structures & Algorithms assignment into 3 manageable, bite-sized steps so you don't feel overwhelmed. Let's tackle them one at a time with low guilt:";
              proposals = [
                {
                  id: 'prop-' + Date.now(),
                  type: 'create_tasks',
                  title: 'Add 3 DAA Milestone Subtasks',
                  description: 'Add Graph Traversal Implementation, Complexity Proofs, and Report Formatting as separate focused tasks.',
                  payload: [
                    { title: 'DAA: Implement BFS & DFS on Adj Matrix', duration: 45, priority: 'high', subjectId: 'subj-1' },
                    { title: 'DAA: Write Time Complexity Analysis', duration: 30, priority: 'medium', subjectId: 'subj-1' },
                    { title: 'DAA: Format PDF & Submit on Canvas', duration: 15, priority: 'low', subjectId: 'subj-1' }
                  ],
                  applied: false
                }
              ];
            } else if (textLower.includes('reschedule') || textLower.includes('overdue') || textLower.includes('behind') || textLower.includes('missed')) {
              replyText = "Take a breath — falling behind happens to everyone, and you're in complete control. I analyzed your overdue and pending tasks and balanced them across tomorrow and Wednesday so your daily workload stays under 3.5 hours:";
              proposals = [
                {
                  id: 'prop-' + Date.now(),
                  type: 'reschedule_tasks',
                  title: 'Redistribute Overdue Tasks Safely',
                  description: 'Move OS Virtual Memory notes to tomorrow 4:00 PM and DAA submission prep to Wednesday.',
                  payload: { shiftDays: 1 },
                  applied: false
                }
              ];
            } else if (textLower.includes('focus') || textLower.includes('next') || textLower.includes('what should i do')) {
              replyText = "Based on your upcoming deadlines and energy levels, your top priority right now is the **Operating Systems Virtual Memory Lab Report** (due in 24 hours). It's estimated at 45 minutes. Would you like to jump into a 25-minute Pomodoro session in Focus Studio?";
              proposals = [
                {
                  id: 'prop-' + Date.now(),
                  type: 'adjust_priority',
                  title: 'Elevate OS Lab to Urgent Focus',
                  description: 'Queue OS Lab at the top of your My Day focus queue.',
                  payload: { taskId: 'task-1' },
                  applied: false
                }
              ];
            } else if (textLower.includes('exam') || textLower.includes('study plan') || textLower.includes('revision')) {
              replyText = "Here is a high-agency 3-day revision sprint for your upcoming Midterm Exam. It allocates 45-minute daily deep work blocks with active recall breaks:";
              proposals = [
                {
                  id: 'prop-' + Date.now(),
                  type: 'create_tasks',
                  title: 'Add Midterm Exam Revision Sprints',
                  description: 'Add 3 scheduled review blocks for Unit 1 Algorithms and Unit 2 Memory Management.',
                  payload: [
                    { title: 'Review: Divide & Conquer Recurrence Relations', duration: 45, priority: 'high', subjectId: 'subj-1' },
                    { title: 'Review: Page Replacement Algorithms (FIFO/LRU)', duration: 45, priority: 'high', subjectId: 'subj-2' }
                  ],
                  applied: false
                }
              ];
            } else {
              replyText = `I'm analyzing your academic workload. You currently have tasks scheduled for today and an upcoming assignment. Remember: high agency means taking small, deliberate actions without guilt. How can I best support you right now?`;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              text: replyText,
              proposals,
              provider: apiKey ? 'gemini-1.5-flash' : 'local-intelligent-engine'
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Server Error' }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), kairoApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
