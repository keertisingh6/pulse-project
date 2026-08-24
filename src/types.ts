/**
 * Type declarations for the Pulse Application
 */

export type CommitmentType =
  | 'Assignment'
  | 'Meeting'
  | 'Bill'
  | 'Appointment'
  | 'Event'
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
  whatsapp?: boolean; // Future
  telegram?: boolean; // Future
}

export type CommitmentOwner = 'me' | 'shared' | 'someone_else';

export interface Commitment {
  id: string;
  title: string;
  type: CommitmentType;
  dueDate: string; // "When does this end?" - YYYY-MM-DD
  dueTime?: string; // HH:MM
  estimatedEffort: string; // e.g. "2 hours"
  effortMinutes: number; // For calculations
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  source: 'manual' | 'life_inbox';
  sourceFileName?: string;
  notes?: string;
  aiTip?: string; // Friendly tip from Kairo
  
  // New Fields
  location?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminders?: ReminderPreference;
  channels?: NotificationChannels;
  owner?: CommitmentOwner;
  ownerName?: string;
  
  // Commitment Health attributes
  travelTimeMinutes?: number;
  prepTimeMinutes?: number;
  suggestedStartTime?: string;
}

export interface FocusSession {
  id: string;
  commitmentId?: string;
  durationMinutes: number;
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
  isCompleted: boolean;
}

export interface PulseState {
  commitments: Commitment[];
  focusSessions: FocusSession[];
  dailyPlan: DailyPlanItem[] | null;
  lastPlanDate: string | null; // Keep track of when plan was generated
  streakDays: number;
  userName: string;
}
