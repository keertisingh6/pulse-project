export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type CommitmentType = 'assignment' | 'exam' | 'lab' | 'hackathon';

export interface Commitment {
  id: string;
  title: string;
  type: CommitmentType;
  tag: string;
  dueDate: string; // e.g. "13 Oct 2026"
  dueDay?: string; // e.g. "Mon"
  priority: Priority;
  estimatedHours: number;
  completedSubtasks: number;
  totalSubtasks: number;
  status: TaskStatus;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  subjectId?: string;
  goalId?: string;
  projectId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  topics: SyllabusTopic[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: 'mint' | 'peach' | 'yellow' | 'purple' | 'blue';
  credits: number;
  instructor?: string;
  syllabus: SyllabusUnit[];
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: Priority;
  status: 'not_started' | 'in_progress' | 'submitted';
  weightage?: string;
  taskId?: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  time: string;
  location?: string;
  topicsCovered: string[];
  prepStatus: 'early' | 'on_track' | 'needs_attention' | 'ready';
  targetGrade?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dateRange?: string; // e.g. "Aug 2025 - May 2026"
  percent?: number; // e.g. 100, 60, 0
  targetDate?: string;
  linkedTaskId?: string;
}

export interface LinkedCommitment {
  id: string;
  title: string;
  type: string;
  date: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Career' | 'Personal';
  targetDate: string; // e.g. "May 2028"
  status: 'active' | 'completed' | 'on_hold';
  progressPercent: number; // e.g. 65
  completedTasks: number; // e.g. 37
  totalTasks: number; // e.g. 56
  milestones: Milestone[];
  linkedCommitments?: LinkedCommitment[];
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'hackathon' | 'internship' | 'certification';
  status: 'idea' | 'in_progress' | 'submitted' | 'completed';
  deadline?: string;
  tags: string[];
  demoLink?: string;
  repoLink?: string;
  progressPercent: number;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  color: 'mint' | 'peach' | 'yellow' | 'purple' | 'blue';
  targetDaysPerWeek: number;
  completedDates: string[];
  streak: number;
  bestStreak: number;
  note?: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  subjectId?: string;
  durationMinutes: number;
  mode: 'pomodoro' | 'deep_work' | 'flow';
  completedAt: string;
  notes?: string;
}

export interface PlannerBlock {
  id: string;
  taskId?: string;
  title: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  date?: string; // YYYY-MM-DD
  startTime: string; // e.g. "8 AM" or "08:00"
  endTime: string; // e.g. "10 AM" or "10:00"
  timeLabel: string; // e.g. "8 - 10 AM"
  category: 'task' | 'class' | 'exam_prep' | 'personal' | 'focus';
  color: 'mint' | 'yellow' | 'peach' | 'purple' | 'blue';
  completed: boolean;
}

export interface KairoActionProposal {
  id: string;
  type: 'create_tasks' | 'reschedule_tasks' | 'create_study_plan' | 'adjust_priority';
  title: string;
  description: string;
  payload: any;
  applied: boolean;
}

export interface KairoMessage {
  id: string;
  sender: 'user' | 'kairo';
  timestamp: string;
  text: string;
  suggestedActions?: KairoActionProposal[];
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  semester: string;
  dailyFocusGoalMinutes: number;
  geminiApiKey?: string;
  aiModel: string;
  useMockAI: boolean;
}
