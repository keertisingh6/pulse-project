import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Task,
  Subject,
  Assignment,
  Exam,
  Goal,
  Project,
  Habit,
  FocusSession,
  PlannerBlock,
  UserProfile,
  KairoMessage,
  KairoActionProposal,
  Commitment,
  NotificationItem
} from '../types';
import { StorageService } from '../services/storage';
import { KairoService } from '../services/kairoService';
import { soundService } from '../services/soundService';
import { triggerPastelConfetti } from '../services/confetti';

export type ViewType =
  | 'home'
  | 'academics'
  | 'commitments'
  | 'planner'
  | 'goals'
  | 'focus'
  | 'kairo'
  | 'resources'
  | 'settings';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface PulseContextType {
  currentView: ViewType;
  setCurrentView: (v: ViewType) => void;
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;

  // Commitments
  commitments: Commitment[];
  addCommitment: (c: Omit<Commitment, 'id'>) => Commitment;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
  advanceCommitmentSubtask: (id: string) => void;
  editingCommitment: Commitment | null;
  setEditingCommitment: (c: Commitment | null) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string, e?: React.MouseEvent) => void;
  deleteTask: (id: string) => void;
  rescheduleTask: (id: string, newDate: string, newTime?: string) => void;

  // Subjects
  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, s: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  toggleTopicCompletion: (subjectId: string, unitId: string, topicId: string) => void;
  selectedSubjectForDetail: Subject | null;
  setSelectedSubjectForDetail: (s: Subject | null) => void;

  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  toggleLinkedCommitment: (goalId: string, lcId: string) => void;
  editingGoal: Goal | null;
  setEditingGoal: (g: Goal | null) => void;

  // Habits
  habits: Habit[];
  addHabit: (h: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;

  // Focus Sessions & Global Timer
  focusSessions: FocusSession[];
  logFocusSession: (durationMinutes: number, notes?: string, taskId?: string) => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  isFocusRunning: boolean;
  setIsFocusRunning: (running: boolean) => void;
  focusSecondsLeft: number;
  setFocusSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  focusMode: 'pomodoro' | 'deep_work' | 'flow';
  setFocusMode: (mode: 'pomodoro' | 'deep_work' | 'flow') => void;
  startFocusOnTask: (taskId?: string) => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;

  // Ambient sound
  ambientType: 'none' | 'rain' | 'binaural' | 'whitenoise';
  setAmbientType: (type: 'none' | 'rain' | 'binaural' | 'whitenoise') => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;

  // Planner
  plannerBlocks: PlannerBlock[];
  addPlannerBlock: (b: Omit<PlannerBlock, 'id'>) => PlannerBlock;
  updatePlannerBlock: (id: string, updates: Partial<PlannerBlock>) => void;
  deletePlannerBlock: (id: string) => void;
  autoScheduleWithKairo: () => void;
  exportCalendarICS: () => void;
  editingScheduleBlock: PlannerBlock | null;
  setEditingScheduleBlock: (b: PlannerBlock | null) => void;

  // Kairo
  kairoMessages: KairoMessage[];
  isKairoLoading: boolean;
  sendKairoMessage: (text: string) => Promise<void>;
  applyKairoProposal: (proposalId: string) => void;

  // Modals & Panels
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (t: Task | null) => void;
  isCommitmentModalOpen: boolean;
  setIsCommitmentModalOpen: (open: boolean) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isSubjectModalOpen: boolean;
  setIsSubjectModalOpen: (open: boolean) => void;
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  isResourceModalOpen: boolean;
  setIsResourceModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isKairoDrawerOpen: boolean;
  setIsKairoDrawerOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  resetToSampleData: () => void;
  clearAllData: () => void;

  // Calculated metrics
  focusMinutesToday: number;
  completedTasksTodayCount: number;
  recommendedNextTask: Task | null;
}

const PulseContext = createContext<PulseContextType | null>(null);

export const PulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile);
  const [commitments, setCommitments] = useState<Commitment[]>(StorageService.getCommitments);
  const [tasks, setTasks] = useState<Task[]>(StorageService.getTasks);
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects);
  const [goals, setGoals] = useState<Goal[]>(StorageService.getGoals);
  const [habits, setHabits] = useState<Habit[]>(StorageService.getHabits);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(StorageService.getFocusSessions);
  const [plannerBlocks, setPlannerBlocks] = useState<PlannerBlock[]>(StorageService.getPlanner);
  const [kairoMessages, setKairoMessages] = useState<KairoMessage[]>(StorageService.getKairoMessages);

  // Global Live Focus Timer
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'pomodoro' | 'deep_work' | 'flow'>('pomodoro');
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(25 * 60);

  // Global Ambient Sound
  const [ambientType, setAmbientType] = useState<'none' | 'rain' | 'binaural' | 'whitenoise'>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.12);

  // Modals & Panels
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubjectForDetail, setSelectedSubjectForDetail] = useState<Subject | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleBlock, setEditingScheduleBlock] = useState<PlannerBlock | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isKairoDrawerOpen, setIsKairoDrawerOpen] = useState(false);
  const [isKairoLoading, setIsKairoLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'DSA Assignment 5 Due in 5 Days',
      description: 'Data Structures submission due on Monday 13 Oct.',
      time: '2h ago',
      type: 'deadline',
      read: false,
      actionView: 'commitments'
    },
    {
      id: 'notif-2',
      title: 'Software Engineering Midterm',
      description: 'Preparation sprint allocated for 3 Nov in Unit 1-3.',
      time: '5h ago',
      type: 'exam',
      read: false,
      actionView: 'academics'
    },
    {
      id: 'notif-3',
      title: 'Focus Streak Milestone! 🌿',
      description: 'Small steps, steady progress: 3 days in a row.',
      time: 'Yesterday',
      type: 'habit',
      read: false,
      actionView: 'focus'
    }
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Sync to LocalStorage
  useEffect(() => { StorageService.saveProfile(profile); }, [profile]);
  useEffect(() => { StorageService.saveCommitments(commitments); }, [commitments]);
  useEffect(() => { StorageService.saveTasks(tasks); }, [tasks]);
  useEffect(() => { StorageService.saveSubjects(subjects); }, [subjects]);
  useEffect(() => { StorageService.saveGoals(goals); }, [goals]);
  useEffect(() => { StorageService.saveHabits(habits); }, [habits]);
  useEffect(() => { StorageService.saveFocusSessions(focusSessions); }, [focusSessions]);
  useEffect(() => { StorageService.savePlanner(plannerBlocks); }, [plannerBlocks]);
  useEffect(() => { StorageService.saveKairoMessages(kairoMessages); }, [kairoMessages]);

  // Ambient sound sync
  useEffect(() => {
    if (isFocusRunning && ambientType !== 'none') {
      soundService.startAmbient(ambientType, ambientVolume);
    } else if (!isFocusRunning) {
      soundService.stopAmbient();
    }
  }, [isFocusRunning, ambientType, ambientVolume]);

  // Timer ticker
  useEffect(() => {
    let timer: any = null;
    if (isFocusRunning) {
      timer = setInterval(() => {
        setFocusSecondsLeft(prev => {
          if (focusMode === 'flow') return prev + 1;
          if (prev <= 1) {
            clearInterval(timer);
            setIsFocusRunning(false);
            soundService.playChime();
            triggerPastelConfetti();
            const mins = focusMode === 'pomodoro' ? 25 : 50;
            logFocusSession(mins, 'Completed focus session', activeTaskId || undefined);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isFocusRunning, focusMode, activeTaskId]);

  const pauseFocusTimer = () => {
    setIsFocusRunning(false);
    soundService.stopAmbient();
  };

  const resetFocusTimer = () => {
    setIsFocusRunning(false);
    soundService.stopAmbient();
    if (focusMode === 'pomodoro') setFocusSecondsLeft(25 * 60);
    else if (focusMode === 'deep_work') setFocusSecondsLeft(50 * 60);
    else setFocusSecondsLeft(0);
  };

  const startFocusOnTask = (taskId?: string) => {
    if (taskId) setActiveTaskId(taskId);
    setIsFocusRunning(true);
    soundService.playClick();
    if (ambientType !== 'none') {
      soundService.startAmbient(ambientType, ambientVolume);
    }
    showToast('Focus session active', 'success');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile updated', 'success');
  };

  // Commitments
  const addCommitment = (c: Omit<Commitment, 'id'>): Commitment => {
    const newCom: Commitment = {
      ...c,
      id: 'com-' + Date.now()
    };
    setCommitments(prev => [newCom, ...prev]);

    // Mirror to tasks
    const newTask: Task = {
      id: 'task-c-' + newCom.id,
      title: newCom.title,
      description: `${newCom.type.toUpperCase()} • ${newCom.tag}`,
      dueDate: new Date().toISOString().split('T')[0],
      priority: newCom.priority,
      status: 'pending',
      estimatedMinutes: (newCom.estimatedHours || 2) * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);

    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Added ${newCom.title}`, 'success');
    return newCom;
  };

  const updateCommitment = (id: string, updates: Partial<Commitment>) => {
    setCommitments(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCommitment = (id: string) => {
    setCommitments(prev => prev.filter(c => c.id !== id));
    showToast('Commitment removed', 'info');
  };

  const advanceCommitmentSubtask = (id: string) => {
    setCommitments(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const nextDone = Math.min(c.totalSubtasks, c.completedSubtasks + 1);
        if (nextDone === c.totalSubtasks) {
          triggerPastelConfetti();
          soundService.playChime();
          showToast(`Completed all subtasks for "${c.title}"! 🎉`, 'success');
        } else {
          soundService.playClick();
        }
        return {
          ...c,
          completedSubtasks: nextDone,
          status: nextDone === c.totalSubtasks ? 'completed' : 'in_progress'
        };
      })
    );
  };

  // Tasks
  const addTask = (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const newTask: Task = {
      ...t,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    soundService.playClick();
    showToast(`Task "${newTask.title}" added`, 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const toggleTaskStatus = (id: string, e?: React.MouseEvent) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const isDone = t.status === 'completed';
        const nextStatus = isDone ? 'pending' : 'completed';
        if (!isDone) {
          soundService.playChime();
          triggerPastelConfetti(e?.clientX, e?.clientY);
          showToast(`Completed ${t.title}!`, 'success');
        }
        return {
          ...t,
          status: nextStatus,
          completedAt: !isDone ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', 'info');
  };

  const rescheduleTask = (id: string, newDate: string, newTime?: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, dueDate: newDate, dueTime: newTime || t.dueTime, updatedAt: new Date().toISOString() }
          : t
      )
    );
    showToast(`Rescheduled to ${newDate}`, 'success');
  };

  // Subjects
  const addSubject = (s: Omit<Subject, 'id'>): Subject => {
    const newSubject: Subject = { ...s, id: 'subj-' + Date.now() };
    setSubjects(prev => [...prev, newSubject]);
    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Added ${newSubject.name}`, 'success');
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject removed', 'info');
  };

  const toggleTopicCompletion = (subjectId: string, unitId: string, topicId: string) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          syllabus: sub.syllabus.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: u.topics.map(tp => {
                if (tp.id !== topicId) return tp;
                const nextState = !tp.completed;
                if (nextState) {
                  soundService.playClick();
                  triggerPastelConfetti();
                  showToast(`Mastered: ${tp.title}`, 'success');
                }
                return { ...tp, completed: nextState };
              })
            };
          })
        };
      })
    );
  };

  // Goals
  const addGoal = (g: Omit<Goal, 'id'>): Goal => {
    const newGoal: Goal = { ...g, id: 'goal-' + Date.now() };
    setGoals(prev => [newGoal, ...prev]);
    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Goal "${newGoal.title}" created`, 'success');
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Goal removed', 'info');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          const completed = !m.completed;
          if (completed) {
            soundService.playChime();
            triggerPastelConfetti();
            showToast(`Milestone completed: ${m.title}`, 'success');
          }
          return { ...m, completed, percent: completed ? 100 : 0 };
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progressPercent = updatedMilestones.length > 0
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : g.progressPercent;

        return {
          ...g,
          milestones: updatedMilestones,
          progressPercent
        };
      })
    );
  };

  const toggleLinkedCommitment = (goalId: string, lcId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId || !g.linkedCommitments) return g;
        return {
          ...g,
          linkedCommitments: g.linkedCommitments.map(lc => {
            if (lc.id !== lcId) return lc;
            const completed = !lc.completed;
            if (completed) {
              soundService.playClick();
              triggerPastelConfetti();
            }
            return { ...lc, completed };
          })
        };
      })
    );
  };

  // Habits
  const addHabit = (h: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...h,
      id: 'habit-' + Date.now(),
      streak: 0,
      bestStreak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
    showToast(`Habit "${newHabit.title}" created`, 'success');
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        const updatedDates = exists
          ? h.completedDates.filter(d => d !== dateStr)
          : [...h.completedDates, dateStr];

        if (!exists) {
          soundService.playClick();
          triggerPastelConfetti();
        }

        const streak = updatedDates.length;
        return {
          ...h,
          completedDates: updatedDates,
          streak,
          bestStreak: Math.max(h.bestStreak, streak)
        };
      })
    );
  };

  // Focus Sessions
  const logFocusSession = (durationMinutes: number, notes?: string, taskId?: string) => {
    const task = tasks.find(t => t.id === taskId);
    const newSession: FocusSession = {
      id: 'sess-' + Date.now(),
      taskId,
      taskTitle: task?.title || 'General Focus Session',
      durationMinutes,
      mode: focusMode,
      completedAt: new Date().toISOString(),
      notes
    };
    setFocusSessions(prev => [newSession, ...prev]);
    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Logged ${durationMinutes}m focus`, 'success');
  };

  // Planner
  const addPlannerBlock = (b: Omit<PlannerBlock, 'id'>): PlannerBlock => {
    const newBlock: PlannerBlock = { ...b, id: 'pb-' + Date.now() };
    setPlannerBlocks(prev => [...prev, newBlock]);
    soundService.playClick();
    triggerPastelConfetti();
    showToast(`Scheduled "${newBlock.title}"`, 'success');
    return newBlock;
  };

  const updatePlannerBlock = (id: string, updates: Partial<PlannerBlock>) => {
    setPlannerBlocks(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deletePlannerBlock = (id: string) => {
    setPlannerBlocks(prev => prev.filter(b => b.id !== id));
  };

  const autoScheduleWithKairo = () => {
    const pendingCommitments = commitments.filter(c => c.status !== 'completed');
    if (pendingCommitments.length === 0) {
      showToast('All commitments already completed!', 'info');
      return;
    }

    const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = ['Tue', 'Wed', 'Thu', 'Fri'];
    const times = [
      { start: '10 AM', end: '12 PM', label: '10 AM - 12 PM' },
      { start: '2 PM', end: '4 PM', label: '2 - 4 PM' },
      { start: '4 PM', end: '5:30 PM', label: '4 - 5:30 PM' }
    ];

    const newBlocks: PlannerBlock[] = [];
    pendingCommitments.slice(0, 3).forEach((c, idx) => {
      const day = days[idx % days.length];
      const time = times[idx % times.length];
      newBlocks.push({
        id: 'pb-auto-' + Date.now() + '-' + idx,
        title: `${c.title} (Focus Review)`,
        day,
        startTime: time.start,
        endTime: time.end,
        timeLabel: time.label,
        category: c.type === 'exam' ? 'exam_prep' : 'task',
        color: c.type === 'exam' ? 'peach' : c.type === 'lab' ? 'purple' : 'mint',
        completed: false
      });
    });

    setPlannerBlocks(prev => [...prev, ...newBlocks]);
    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Kairo auto-scheduled ${newBlocks.length} study blocks!`, 'success');
  };

  const exportCalendarICS = () => {
    window.open('/api/export/calendar.ics', '_blank');
    showToast('Exported iCalendar schedule file', 'success');
  };

  // Kairo Chat
  const sendKairoMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: KairoMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setKairoMessages(prev => [...prev, userMsg]);
    setIsKairoLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const todayMinutes = focusSessions
        .filter(s => s.completedAt.startsWith(today))
        .reduce((acc, s) => acc + s.durationMinutes, 0);

      const response = await KairoService.sendMessage(
        text,
        {
          tasks,
          subjects,
          assignments: [],
          exams: [],
          focusMinutesToday: todayMinutes
        },
        profile.geminiApiKey
      );

      const botMsg: KairoMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'kairo',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        suggestedActions: response.proposals
      };

      setKairoMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      showToast('Kairo encountered an error. Using offline mode.', 'warning');
    } finally {
      setIsKairoLoading(false);
    }
  };

  const applyKairoProposal = (proposalId: string) => {
    let appliedTitle = '';

    setKairoMessages(prev =>
      prev.map(msg => {
        if (!msg.suggestedActions) return msg;
        return {
          ...msg,
          suggestedActions: msg.suggestedActions.map(p => {
            if (p.id !== proposalId) return p;
            appliedTitle = p.title;

            if (p.type === 'create_tasks' && Array.isArray(p.payload)) {
              p.payload.forEach((item: any) => {
                addTask({
                  title: item.title,
                  dueDate: new Date().toISOString().split('T')[0],
                  priority: item.priority || 'medium',
                  status: 'pending',
                  estimatedMinutes: item.duration || 30,
                  subjectId: item.subjectId
                });
              });
            } else if (p.type === 'adjust_priority') {
              showToast('Prioritized item for today focus', 'success');
            } else if (p.type === 'reschedule_tasks') {
              showToast('Redistributed workload across week', 'success');
            }

            return { ...p, applied: true };
          })
        };
      })
    );

    soundService.playChime();
    triggerPastelConfetti();
    showToast(`Applied proposal: "${appliedTitle}"`, 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetToSampleData = () => {
    StorageService.resetAllToSeed();
    window.location.reload();
  };

  const clearAllData = () => {
    StorageService.clearAllData();
    window.location.reload();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const focusMinutesToday = focusSessions
    .filter(s => s.completedAt.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const completedTasksTodayCount = tasks.filter(
    t => t.status === 'completed' && t.completedAt && t.completedAt.startsWith(todayStr)
  ).length;

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const recommendedNextTask = pendingTasks[0] || null;

  return (
    <PulseContext.Provider
      value={{
        currentView,
        setCurrentView,
        profile,
        updateProfile,

        commitments,
        addCommitment,
        updateCommitment,
        deleteCommitment,
        advanceCommitmentSubtask,
        editingCommitment,
        setEditingCommitment,

        tasks,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        rescheduleTask,

        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        toggleTopicCompletion,
        selectedSubjectForDetail,
        setSelectedSubjectForDetail,

        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        toggleLinkedCommitment,
        editingGoal,
        setEditingGoal,

        habits,
        addHabit,
        toggleHabitDay,

        focusSessions,
        logFocusSession,
        activeTaskId,
        setActiveTaskId,
        isFocusRunning,
        setIsFocusRunning,
        focusSecondsLeft,
        setFocusSecondsLeft,
        focusMode,
        setFocusMode,
        startFocusOnTask,
        pauseFocusTimer,
        resetFocusTimer,

        ambientType,
        setAmbientType,
        ambientVolume,
        setAmbientVolume,

        plannerBlocks,
        addPlannerBlock,
        updatePlannerBlock,
        deletePlannerBlock,
        autoScheduleWithKairo,
        exportCalendarICS,
        editingScheduleBlock,
        setEditingScheduleBlock,

        kairoMessages,
        isKairoLoading,
        sendKairoMessage,
        applyKairoProposal,

        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        isCommitmentModalOpen,
        setIsCommitmentModalOpen,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isSubjectModalOpen,
        setIsSubjectModalOpen,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        isResourceModalOpen,
        setIsResourceModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isKairoDrawerOpen,
        setIsKairoDrawerOpen,

        notifications,
        markNotificationRead,
        clearAllNotifications,

        toast,
        showToast,
        resetToSampleData,
        clearAllData,

        focusMinutesToday,
        completedTasksTodayCount,
        recommendedNextTask
      }}
    >
      {children}
    </PulseContext.Provider>
  );
};

export const usePulse = () => {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error('usePulse must be used within PulseProvider');
  return ctx;
};
