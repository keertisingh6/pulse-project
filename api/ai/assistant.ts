import { AIProviderManager } from '../../server/aiService';

type ApiRequest = {
  method?: string;
  body?: { message?: unknown; context?: Record<string, unknown> };
  headers?: Record<string, string | string[] | undefined>;
};
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const requestCounts = new Map<string, { startedAt: number; count: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 15;

const textField = (value: unknown, maxLength = 240) =>
  typeof value === 'string' ? value.slice(0, maxLength) : '';

function sanitizeContext(input: Record<string, unknown> | undefined) {
  const source = input || {};
  const asRecords = (value: unknown, limit: number) => Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object').slice(0, limit)
    : [];

  return {
    userName: textField(source.userName, 80) || 'Student',
    streakDays: Number.isFinite(Number(source.streakDays)) ? Math.max(0, Math.min(999, Number(source.streakDays))) : 0,
    profile: {
      college: textField((source.profile as any)?.college, 120),
      branch: textField((source.profile as any)?.branch, 120),
      semester: textField((source.profile as any)?.semester, 80),
      studyRhythm: textField((source.profile as any)?.studyRhythm, 40),
      focusBlockMinutes: Number((source.profile as any)?.focusBlockMinutes) || 0,
      dailyAvailableHours: Number((source.profile as any)?.dailyAvailableHours) || 0,
    },
    commitments: asRecords(source.commitments, 100).map(item => ({
      title: textField(item.title),
      type: textField(item.type, 60),
      subject: textField(item.subject, 100),
      dueDate: textField(item.dueDate, 30),
      dueTime: textField(item.dueTime, 16),
      estimatedEffort: textField(item.estimatedEffort, 80),
      priority: textField(item.priority, 16),
      notes: textField(item.notes, 500),
      completed: Boolean(item.completed),
    })),
    goals: asRecords(source.goals, 50).map(item => ({
      title: textField(item.title),
      description: textField(item.description, 500),
      targetDate: textField(item.targetDate, 30),
      progress: Number(item.progress) || 0,
    })),
    dailyPlan: asRecords(source.dailyPlan, 60).map(item => ({
      title: textField(item.title),
      timeSlot: textField(item.timeSlot, 40),
      type: textField(item.type, 30),
      isCompleted: Boolean(item.isCompleted),
      estimatedMinutes: Number(item.estimatedMinutes) || 0,
      subject: textField(item.subject, 100),
    })),
  };
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Use POST to send a message to Kairo.' });
  }

  const message = request.body?.message;
  if (typeof message !== 'string' || !message.trim()) {
    return response.status(400).json({ error: 'Enter a message before sending it.' });
  }
  if (message.length > 8000) {
    return response.status(413).json({ error: 'Please keep your message under 8,000 characters.' });
  }

  const forwardedFor = request.headers?.['x-forwarded-for'];
  const clientIp = Array.isArray(forwardedFor) ? forwardedFor[0]?.split(',')[0] : forwardedFor?.split(',')[0];
  if (clientIp) {
    const now = Date.now();
    const previous = requestCounts.get(clientIp);
    if (previous && now - previous.startedAt < RATE_WINDOW_MS && previous.count >= RATE_LIMIT) {
      return response.status(429).json({ error: 'Kairo is taking a short pause. Please try again in a minute.' });
    }
    requestCounts.set(clientIp, previous && now - previous.startedAt < RATE_WINDOW_MS
      ? { ...previous, count: previous.count + 1 }
      : { startedAt: now, count: 1 });
    if (requestCounts.size > 5000) {
      for (const [ip, value] of requestCounts) {
        if (now - value.startedAt >= RATE_WINDOW_MS) requestCounts.delete(ip);
      }
    }
  }

  try {
    const result = await AIProviderManager.getProvider().chatAssistant({
      message: message.trim(),
      context: sanitizeContext(request.body?.context),
    });
    return response.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Kairo could not respond. Please try again.';
    return response.status(500).json({ error: errorMessage });
  }
}

