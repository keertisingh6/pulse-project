/**
 * Type declarations for Pulse: Student-Centric AI Life & Productivity Companion
 */

export type CommitmentType =
  | 'Assignment'
  | 'Exam'
  | 'Class'
  | 'Meeting'
  | 'Bill'
  | 'Appointment'
  | 'Event'
  | 'Interview'
  | 'Task'
  | 'Personal'
  | 'Travel'
  | 'Other';

export interface ReminderPreference {
  oneDayBefore?: boolean;
  oneHourBefore?: boolean;
  fifteenMinBefore?: boolean;
  atStart?: boolean;
  threeDaysBefore?: boolean;
  sixHoursBefore?: boolean;
  twoHoursBefore?: boolean;
}

export interface NotificationChannels {
  inApp?: boolean;
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  whatsapp?: boolean;
  telegram?: boolean;
}

export type CommitmentOwner = 'me' | 'shared' | 'someone_else';

export interface Commitment {
  id: string;
  title: string;
  type: CommitmentType;
  subject?: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  estimatedEffort: string; // e.g. "2 hours"
  effortMinutes: number; // e.g. 120
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  source: 'manual' | 'life_inbox';
  sourceFileName?: string;
  notes?: string;
  aiTip?: string; // Friendly tip from Kairo
  
  location?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminders?: ReminderPreference;
  channels?: NotificationChannels;
  owner?: CommitmentOwner;
  ownerName?: string;
  
  travelTimeMinutes?: number;
  prepTimeMinutes?: number;
  suggestedStartTime?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface GoalSubject {
  id: string;
  name: string;
  topicsCount?: number;
  completedTopics?: number;
}

export interface Goal {
  id: string;
  title: string;
  category: 'exam' | 'career' | 'academic' | 'skill' | 'personal';
  icon: string;
  targetDate: string;
  description: string;
  milestones: GoalMilestone[];
  subjects?: GoalSubject[];
  weeklyHoursTarget?: number;
  color: string;
  progressPercentage: number;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  commitmentId?: string;
  durationMinutes: number;
  durationSeconds?: number;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  completedAt: string;
  type: 'work' | 'study' | 'break';
  notes?: string;
}

export interface DailyPlanItem {
  id: string;
  title: string;
  timeSlot: string; // e.g. "09:00 - 10:30"
  type: 'work' | 'study' | 'break' | 'payment';
  commitmentId?: string;
  subject?: string;
  isCompleted: boolean;
  estimatedMinutes?: number;
}

export interface ScheduleBlock {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: 'study' | 'deep-work' | 'break' | 'class';
  completed: boolean;
  commitmentId?: string;
  notes?: string;
  color?: string;
}

export interface StudentProfile {
  college: string;
  branch: string;
  semester: string;
  targetGoals: string[];
  studyRhythm: 'morning' | 'night' | 'balanced';
  focusBlockMinutes: number;
  dailyAvailableHours: number;
  hasCompletedSetup: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    actionType: 'navigate' | 'filter' | 'add_focus' | 'reschedule';
    payload?: any;
  }>;
}

export interface PulseUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'local' | 'guest';
  createdAt: string;
}

export interface PulseState {
  user: PulseUser | null;
  isAuthenticated: boolean;
  hasEnteredWorkspace?: boolean;
  profile: StudentProfile;
  commitments: Commitment[];
  goals: Goal[];
  focusSessions: FocusSession[];
  dailyPlan: DailyPlanItem[] | null;
  planConflicts?: string[];
  lastPlanDate: string | null;
  streakDays: number;
  userName: string;
  aiProvider: 'gemini' | 'open_source';
  openSourceConfig?: {
    endpoint: string;
    modelName: string;
    apiKey?: string;
  };
}

