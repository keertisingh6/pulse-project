import { KairoActionProposal, Task, Subject, Assignment, Exam } from '../types';

export interface KairoContextData {
  tasks: Task[];
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  focusMinutesToday: number;
}

export interface KairoResponse {
  text: string;
  proposals: KairoActionProposal[];
  provider: string;
}

export const KairoService = {
  async sendMessage(
    message: string,
    context: KairoContextData,
    apiKey?: string
  ): Promise<KairoResponse> {
    try {
      // Send to server-side backend endpoint
      const res = await fetch('/api/kairo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          apiKey: apiKey || '',
          context: {
            tasksSummary: context.tasks.map(t => ({
              id: t.id,
              title: t.title,
              due: t.dueDate,
              priority: t.priority,
              status: t.status,
              duration: t.estimatedMinutes
            })),
            pendingTasksCount: context.tasks.filter(t => t.status !== 'completed').length,
            urgentCount: context.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
            assignments: context.assignments.map(a => ({ title: a.title, due: a.dueDate, status: a.status })),
            upcomingExams: context.exams.map(e => ({ title: e.title, date: e.date, status: e.prepStatus })),
            focusMinutesToday: context.focusMinutesToday
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.text,
          proposals: (data.proposals || []).map((p: any, idx: number) => ({
            ...p,
            id: p.id || `prop-${Date.now()}-${idx}`,
            applied: false
          })),
          provider: data.provider || 'gemini-1.5-flash'
        };
      }
    } catch (e) {
      console.warn('Network call to /api/kairo failed, switching to local student engine:', e);
    }

    // Graceful offline fallback
    return KairoService.generateLocalResponse(message, context);
  },

  generateLocalResponse(message: string, context: KairoContextData): KairoResponse {
    const query = message.toLowerCase();
    const urgentTasks = context.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');
    const pendingTasks = context.tasks.filter(t => t.status !== 'completed');

    if (query.includes('break down') || query.includes('subtask') || query.includes('daa') || query.includes('graph')) {
      return {
        text: "I broke down your Data Structures & Algorithms assignment into 3 manageable, bite-sized steps so you don't feel overwhelmed. Let's tackle them one at a time with low guilt:",
        proposals: [
          {
            id: 'prop-subtasks-' + Date.now(),
            type: 'create_tasks',
            title: 'Add 3 DAA Milestone Subtasks',
            description: 'Break into Graph Traversal Implementation, Complexity Proofs, and Report Formatting.',
            payload: [
              { title: 'DAA: Implement BFS & DFS on Adj Matrix', duration: 45, priority: 'high', subjectId: 'subj-1' },
              { title: 'DAA: Write Time Complexity Analysis', duration: 30, priority: 'medium', subjectId: 'subj-1' },
              { title: 'DAA: Format PDF & Submit on Canvas', duration: 15, priority: 'low', subjectId: 'subj-1' }
            ],
            applied: false
          }
        ],
        provider: 'local-intelligent-engine'
      };
    }

    if (query.includes('reschedule') || query.includes('overdue') || query.includes('behind') || query.includes('missed') || query.includes('guilt')) {
      return {
        text: "Take a deep breath — falling behind happens, and your agency is completely intact. Rather than piling up unrealistic goals, I redistributed pending tasks across tomorrow and Wednesday to keep daily workloads under 3.5 hours.",
        proposals: [
          {
            id: 'prop-reschedule-' + Date.now(),
            type: 'reschedule_tasks',
            title: 'Balanced Workload Redistribution',
            description: 'Evenly space out pending coursework to avoid burnout while meeting hard deadlines.',
            payload: { shiftDays: 1 },
            applied: false
          }
        ],
        provider: 'local-intelligent-engine'
      };
    }

    if (query.includes('focus') || query.includes('next') || query.includes('what should i do')) {
      const topTask = urgentTasks[0] || pendingTasks[0];
      if (topTask) {
        return {
          text: `Based on your deadlines and scheduled focus blocks, your top priority right now is **${topTask.title}** (${topTask.estimatedMinutes} mins). Starting small is the key to effortless momentum. Would you like to launch a 25-minute Pomodoro for this?`,
          proposals: [
            {
              id: 'prop-focus-' + Date.now(),
              type: 'adjust_priority',
              title: `Queue "${topTask.title}" as Top Focus`,
              description: 'Sets this task active in your Focus Studio workspace.',
              payload: { taskId: topTask.id },
              applied: false
            }
          ],
          provider: 'local-intelligent-engine'
        };
      }
    }

    if (query.includes('exam') || query.includes('study plan') || query.includes('prep') || query.includes('midterm')) {
      return {
        text: "Here is a high-agency 3-day revision sprint for your upcoming Midterm. It isolates high-yield topics into 45-minute focused blocks with deliberate recall:",
        proposals: [
          {
            id: 'prop-exam-' + Date.now(),
            type: 'create_tasks',
            title: 'Generate Exam Sprint Blocks',
            description: 'Add focused study blocks for Graph Theory and Virtual Memory paging algorithms.',
            payload: [
              { title: 'Exam Prep: Graph Traversals & Shortest Paths Practice', duration: 45, priority: 'high', subjectId: 'subj-1' },
              { title: 'Exam Prep: LRU vs FIFO Paging Scenarios', duration: 45, priority: 'high', subjectId: 'subj-2' }
            ],
            applied: false
          }
        ],
        provider: 'local-intelligent-engine'
      };
    }

    return {
      text: `Hello! I'm monitoring your academic workload. You currently have ${pendingTasks.length} pending tasks (${urgentTasks.length} urgent) and ${context.assignments.length} assignments in flight. Remember: high agency means taking small, deliberate actions without guilt. How can I best support your focus right now?`,
      proposals: [],
      provider: 'local-intelligent-engine'
    };
  }
};
