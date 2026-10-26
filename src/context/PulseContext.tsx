import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Commitment, FocusSession, DailyPlanItem, PulseState, 
  PulseUser, Goal, StudentProfile, AssistantMessage, CommitmentType 
} from '../types';
import { testConnection } from '../services/firebase';
import { isTaskOverdue } from '../utils/deadlineUtils';
import { 
  syncUserProfileToFirestore, 
  fetchUserProfileFromFirestore, 
  syncCommitmentToFirestore, 
  deleteCommitmentFromFirestore, 
  fetchUserCommitmentsFromFirestore, 
  syncGoalToFirestore, 
  deleteGoalFromFirestore, 
  fetchUserGoalsFromFirestore, 
  syncFocusSessionToFirestore, 
  fetchUserFocusSessionsFromFirestore 
} from '../services/firestoreStorage';

interface PulseContextType {
  state: PulseState;
  loading: boolean;
  error: string | null;
  
  // App Access & Workspace
  continueToPulse: (name?: string) => void;
  login: (email: string, password?: string, name?: string) => Promise<void>;
  loginAsGuest: (name?: string) => void;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  resetAuth: () => void;
  resetAllData: () => void;
  loadDemoData: () => void;
  restoreWorkspaceData: () => void;
  clearError: () => void;

  // Profile & Setup
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateUserName: (name: string) => void;

  // Commitments (DROP -> UNDERSTAND -> CONFIRM -> PLAN -> ACT)
  extractFromInput: (text: string, fileData?: string, mimeType?: string, fileName?: string) => Promise<Omit<Commitment, 'id' | 'createdAt'>[]>;
  importCommitments: (text: string, fileData?: string, mimeType?: string, fileName?: string) => Promise<Commitment[]>;
  addCommitment: (commitment: Omit<Commitment, 'id' | 'createdAt'>) => string;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  toggleCommitment: (id: string) => void;
  deleteCommitment: (id: string) => void;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (goalId: string) => void;

  // Planning
  generateDailyPlan: () => Promise<void>;
  togglePlanItem: (id: string) => void;

  // Focus
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;

  // AI Assistant
  askAssistant: (message: string) => Promise<AssistantMessage>;

  // AI Provider config
  configureAIProvider: (provider: 'gemini' | 'open_source', config?: { endpoint: string; modelName: string; apiKey?: string }) => Promise<void>;
}

const CLEAN_DEFAULT_PROFILE: StudentProfile = {
  college: '',
  branch: '',
  semester: '',
  targetGoals: [],
  studyRhythm: 'balanced',
  focusBlockMinutes: 45,
  dailyAvailableHours: 6,
  hasCompletedSetup: false,
};

const CLEAN_INITIAL_STATE: PulseState = {
  user: null,
  isAuthenticated: false,
  profile: CLEAN_DEFAULT_PROFILE,
  commitments: [],
  goals: [],
  focusSessions: [],
  dailyPlan: null,
  planConflicts: [],
  lastPlanDate: null,
  streakDays: 0,
  userName: '',
  aiProvider: 'gemini',
};

const DEMO_BACKUP_KEY = 'pulse_state_before_demo';

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PulseState>(() => {
    const localData = localStorage.getItem('pulse_state');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);

        // Immediately purge and reject any legacy mock/seeded data
        const hasLegacyMockData = 
          parsed.commitments?.some((c: any) => c.id === 'c1' || c.id === 'c2' || c.id === 'c3' || c.title?.includes('DBMS Assignment 3') || c.title?.includes('Linear Algebra')) ||
          parsed.goals?.some((g: any) => g.id === 'g1' || g.title?.includes('GATE 2027')) ||
          parsed.profile?.college === 'Delhi Technological University' ||
          parsed.user?.name === 'Keerti Singh' ||
          parsed.userName === 'Keerti' ||
          parsed.user?.email === 'singhkeerti2007@gmail.com' ||
          (parsed.streakDays > 0 && (!parsed.commitments || parsed.commitments.length === 0));

        if (hasLegacyMockData) {
          localStorage.removeItem('pulse_state');
          return CLEAN_INITIAL_STATE;
        }

        if (parsed.user || parsed.hasEnteredWorkspace || (parsed.commitments && parsed.commitments.length > 0)) {
          return {
            ...CLEAN_INITIAL_STATE,
            ...parsed,
            hasEnteredWorkspace: true,
            user: parsed.user || {
              id: 'local_user',
              name: parsed.userName || 'Student',
              email: '',
              provider: 'local',
              createdAt: new Date().toISOString(),
            },
            profile: parsed.profile || CLEAN_DEFAULT_PROFILE,
            goals: parsed.goals || [],
            commitments: parsed.commitments || [],
            focusSessions: parsed.focusSessions || [],
            dailyPlan: parsed.dailyPlan || null,
            streakDays: parsed.streakDays || 0,
          };
        }
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
      }
    }
    return CLEAN_INITIAL_STATE;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pulse_state', JSON.stringify(state));
  }, [state]);

  // Initial connectivity check
  useEffect(() => {
    testConnection().catch(console.warn);
  }, []);

  const continueToPulse = (name: string = 'Student') => {
    const cleanName = (name && name.trim()) || 'Student';
    const user: PulseUser = {
      id: 'local_user',
      name: cleanName,
      email: '',
      provider: 'local',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: false,
      hasEnteredWorkspace: true,
      userName: cleanName,
    }));
  };

  const login = async (email: string, _password?: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 200));
      const extractedName = name || email.split('@')[0] || 'Student';
      const cleanName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      const user: PulseUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: cleanName,
        email,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: false,
        hasEnteredWorkspace: true,
        userName: cleanName,
      }));
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = (name: string = 'Guest') => {
    const user: PulseUser = {
      id: 'usr_guest_' + Math.random().toString(36).substring(2, 9),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@pulse.local`,
      provider: 'guest',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: false,
      hasEnteredWorkspace: true,
      userName: name,
    }));
  };

  const signup = async (name: string, email: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 200));
      const cleanName = name || email.split('@')[0] || 'Student';
      const user: PulseUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: cleanName,
        email,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: false,
        hasEnteredWorkspace: true,
        userName: cleanName,
      }));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pulse_state');
    localStorage.removeItem(DEMO_BACKUP_KEY);
    setState(CLEAN_INITIAL_STATE);
  };

  const resetAuth = () => {
    localStorage.removeItem('pulse_state');
    localStorage.removeItem(DEMO_BACKUP_KEY);
    setState(CLEAN_INITIAL_STATE);
  };

  const resetAllData = () => {
    setState(prev => ({
      ...prev,
      profile: CLEAN_DEFAULT_PROFILE,
      commitments: [],
      goals: [],
      focusSessions: [],
      dailyPlan: null,
      planConflicts: [],
      lastPlanDate: null,
      streakDays: 0,
    }));
  };

  const loadDemoData = () => {
    if (!state.demoMode && !localStorage.getItem(DEMO_BACKUP_KEY)) {
      localStorage.setItem(DEMO_BACKUP_KEY, JSON.stringify(state));
    }

    const dayKey = (offset: number) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + offset);
      return date.toISOString().slice(0, 10);
    };
    const timestamp = (offset: number, hour = 12) => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      date.setDate(date.getDate() + offset);
      return date.toISOString();
    };
    const createdAt = timestamp(-8);

    const commitments: Commitment[] = [
      {
        id: 'demo-statistics-ps6', title: 'Statistics problem set 6', type: 'Assignment', subject: 'Statistics',
        description: 'Work through confidence intervals, hypothesis tests, and the short reflection question.',
        dueDate: dayKey(1), dueTime: '18:00', estimatedEffort: '75 min', effortMinutes: 75, priority: 'high', completed: false,
        createdAt, source: 'manual', reminders: { oneDayBefore: true, oneHourBefore: true },
      },
      {
        id: 'demo-cogsci-notes', title: 'Cognitive science reading notes', type: 'Task', subject: 'Cognitive Science',
        description: 'Capture the three main ideas from the attention and memory readings.',
        dueDate: dayKey(2), dueTime: '20:00', estimatedEffort: '40 min', effortMinutes: 40, priority: 'medium', completed: false,
        createdAt, source: 'manual', reminders: { oneDayBefore: true },
      },
      {
        id: 'demo-design-synthesis', title: 'Synthesize design interviews', type: 'Assignment', subject: 'Design Studio',
        description: 'Group interview notes into themes and choose two quotes for the critique.',
        dueDate: dayKey(3), dueTime: '16:30', estimatedEffort: '90 min', effortMinutes: 90, priority: 'medium', completed: false,
        createdAt, source: 'manual', reminders: { oneDayBefore: true, atStart: true },
      },
      {
        id: 'demo-methods-quiz', title: 'Research methods quiz review', type: 'Exam', subject: 'Research Methods',
        description: 'Review sampling, validity, and the practice quiz before Friday.',
        dueDate: dayKey(4), dueTime: '10:00', estimatedEffort: '60 min', effortMinutes: 60, priority: 'high', completed: false,
        createdAt, source: 'manual', reminders: { threeDaysBefore: true, oneHourBefore: true },
      },
      {
        id: 'demo-mentor-email', title: 'Send project update to Maya', type: 'Personal', subject: 'Portfolio project',
        description: 'Share the prototype link and ask one focused feedback question.',
        dueDate: dayKey(5), dueTime: '12:00', estimatedEffort: '10 min', effortMinutes: 10, priority: 'low', completed: false,
        createdAt, source: 'manual', reminders: { oneDayBefore: true },
      },
      {
        id: 'demo-lecture-review', title: 'Review yesterday’s lecture', type: 'Task', subject: 'Cognitive Science',
        dueDate: dayKey(-1), dueTime: '17:00', estimatedEffort: '25 min', effortMinutes: 25, priority: 'low', completed: true,
        completedAt: timestamp(-1, 17), createdAt, source: 'manual',
      },
      {
        id: 'demo-seminar-reflection', title: 'Submit seminar reflection', type: 'Assignment', subject: 'Research Methods',
        dueDate: dayKey(-2), dueTime: '23:59', estimatedEffort: '35 min', effortMinutes: 35, priority: 'medium', completed: true,
        completedAt: timestamp(-2, 15), createdAt, source: 'manual',
      },
    ];

    const goals: Goal[] = [
      {
        id: 'demo-goal-semester', title: 'Finish the semester feeling prepared', category: 'academic', icon: 'book-open',
        targetDate: dayKey(45), description: 'Build a steady weekly rhythm across classes without leaving everything to the last week.',
        milestones: [
          { id: 'demo-ms-plan', title: 'Map out the next two weeks', completed: true, dueDate: dayKey(-3) },
          { id: 'demo-ms-statistics', title: 'Complete three statistics practice sets', completed: true, dueDate: dayKey(7) },
          { id: 'demo-ms-review', title: 'Start a weekly review ritual', completed: false, dueDate: dayKey(14) },
          { id: 'demo-ms-finals', title: 'Prepare a finals study guide', completed: false, dueDate: dayKey(35) },
        ],
        weeklyHoursTarget: 8, color: 'lavender', progressPercentage: 50, createdAt,
      },
      {
        id: 'demo-goal-portfolio', title: 'Shape a thoughtful design portfolio', category: 'career', icon: 'sparkles',
        targetDate: dayKey(75), description: 'Turn class projects into two clear, well-told case studies.',
        milestones: [
          { id: 'demo-ms-pick', title: 'Choose two projects', completed: true },
          { id: 'demo-ms-story', title: 'Draft the first case study', completed: false, dueDate: dayKey(20) },
        ],
        weeklyHoursTarget: 3, color: 'peach', progressPercentage: 50, createdAt,
      },
    ];

    const focusSessions: FocusSession[] = [
      { id: 'demo-focus-today-1', durationMinutes: 32, durationSeconds: 1920, startTime: timestamp(0, 9), endTime: timestamp(0, 9), completedAt: timestamp(0, 9), type: 'study', commitmentId: 'demo-statistics-ps6', notes: 'Statistics problem set' },
      { id: 'demo-focus-today-2', durationMinutes: 25, durationSeconds: 1500, startTime: timestamp(0, 11), endTime: timestamp(0, 11), completedAt: timestamp(0, 11), type: 'study', commitmentId: 'demo-cogsci-notes', notes: 'Reading notes' },
      { id: 'demo-focus-yesterday', durationMinutes: 45, durationSeconds: 2700, startTime: timestamp(-1, 10), endTime: timestamp(-1, 10), completedAt: timestamp(-1, 10), type: 'study', notes: 'Quiet morning study' },
      { id: 'demo-focus-two-days', durationMinutes: 38, durationSeconds: 2280, startTime: timestamp(-3, 14), endTime: timestamp(-3, 14), completedAt: timestamp(-3, 14), type: 'study', notes: 'Research methods review' },
      { id: 'demo-focus-four-days', durationMinutes: 52, durationSeconds: 3120, startTime: timestamp(-5, 9), endTime: timestamp(-5, 9), completedAt: timestamp(-5, 9), type: 'study', notes: 'Design studio work' },
    ];

    const dailyPlan: DailyPlanItem[] = [
      { id: 'demo-plan-1', title: 'Review lecture notes', timeSlot: '09:00 – 09:35', type: 'study', subject: 'Cognitive Science', isCompleted: true, estimatedMinutes: 35, commitmentId: 'demo-lecture-review' },
      { id: 'demo-plan-2', title: 'Statistics problem set', timeSlot: '10:00 – 11:15', type: 'study', subject: 'Statistics', isCompleted: false, estimatedMinutes: 75, commitmentId: 'demo-statistics-ps6' },
      { id: 'demo-plan-3', title: 'Lunch & a short walk', timeSlot: '12:00 – 12:45', type: 'break', isCompleted: false, estimatedMinutes: 45 },
      { id: 'demo-plan-4', title: 'Organize interview themes', timeSlot: '14:00 – 15:00', type: 'work', subject: 'Design Studio', isCompleted: false, estimatedMinutes: 60, commitmentId: 'demo-design-synthesis' },
    ];

    setState({
      ...CLEAN_INITIAL_STATE,
      user: null,
      userName: 'Avery Chen',
      hasEnteredWorkspace: true,
      demoMode: true,
      profile: {
        college: 'Northstar University', branch: 'Cognitive Science', semester: 'Fall 2026',
        targetGoals: ['Stay ahead of coursework', 'Build a design portfolio'], studyRhythm: 'balanced',
        focusBlockMinutes: 45, dailyAvailableHours: 6, hasCompletedSetup: true,
      },
      commitments,
      goals,
      focusSessions,
      dailyPlan,
      planConflicts: [],
      lastPlanDate: dayKey(0),
      streakDays: 4,
    });
  };

  const restoreWorkspaceData = () => {
    const saved = localStorage.getItem(DEMO_BACKUP_KEY);
    localStorage.removeItem(DEMO_BACKUP_KEY);
    if (!saved) {
      setState(CLEAN_INITIAL_STATE);
      return;
    }
    try {
      const previous = JSON.parse(saved) as PulseState;
      setState({ ...CLEAN_INITIAL_STATE, ...previous, demoMode: false });
    } catch (restoreError) {
      console.error('Could not restore the previous workspace', restoreError);
      setState(CLEAN_INITIAL_STATE);
    }
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const updateUserName = (name: string) => {
    setState(prev => ({
      ...prev,
      userName: name,
      user: prev.user ? { ...prev.user, name } : null,
    }));
  };

  // Document/PDF extraction temporarily disabled
  const extractFromInput = async (
    _text: string, 
    _fileData?: string, 
    _mimeType?: string, 
    _fileName?: string
  ): Promise<Omit<Commitment, 'id' | 'createdAt'>[]> => {
    return [];
  };

  const importCommitments = async (
    _text: string, 
    _fileData?: string, 
    _mimeType?: string, 
    _fileName?: string
  ): Promise<Commitment[]> => {
    return [];
  };

  const addCommitment = (newCommitment: Omit<Commitment, 'id' | 'createdAt'>): string => {
    const id = 'c_' + Math.random().toString(36).substring(2, 9);
    const item: Commitment = {
      ...newCommitment,
      id,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      commitments: [item, ...prev.commitments],
    }));

    if (state.user?.id) {
      syncCommitmentToFirestore(state.user.id, item).catch(console.warn);
    }

    return id;
  };

  const updateCommitment = (id: string, updates: Partial<Commitment>) => {
    setState(prev => {
      const updated = prev.commitments.map(c => (c.id === id ? { ...c, ...updates } : c));
      const target = updated.find(c => c.id === id);
      if (target && prev.user?.id) {
        syncCommitmentToFirestore(prev.user.id, target).catch(console.warn);
      }
      return { ...prev, commitments: updated };
    });
  };

  const toggleCommitment = (id: string) => {
    setState(prev => {
      let target: Commitment | undefined;
      const updated = prev.commitments.map(c => {
        if (c.id === id) {
          const completed = !c.completed;
          target = {
            ...c,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
          return target;
        }
        return c;
      });

      if (target && prev.user?.id) {
        syncCommitmentToFirestore(prev.user.id, target).catch(console.warn);
      }

      return { ...prev, commitments: updated };
    });
  };

  const deleteCommitment = (id: string) => {
    setState(prev => {
      if (prev.user?.id) {
        deleteCommitmentFromFirestore(prev.user.id, id).catch(console.warn);
      }
      return {
        ...prev,
        commitments: prev.commitments.filter(c => c.id !== id),
        dailyPlan: prev.dailyPlan ? prev.dailyPlan.filter(p => p.commitmentId !== id) : null,
      };
    });
  };

  // Goals
  const addGoal = (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const id = 'g_' + Math.random().toString(36).substring(2, 9);
    const item: Goal = {
      ...newGoal,
      id,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      goals: [item, ...prev.goals],
    }));

    if (state.user?.id) {
      syncGoalToFirestore(state.user.id, item).catch(console.warn);
    }
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setState(prev => {
      const updatedGoals = prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progressPercentage = updatedMilestones.length > 0
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : 0;
        return {
          ...g,
          milestones: updatedMilestones,
          progressPercentage,
        };
      });

      const target = updatedGoals.find(g => g.id === goalId);
      if (target && prev.user?.id) {
        syncGoalToFirestore(prev.user.id, target).catch(console.warn);
      }

      return {
        ...prev,
        goals: updatedGoals,
      };
    });
  };

  const deleteGoal = (goalId: string) => {
    setState(prev => {
      if (prev.user?.id) {
        deleteGoalFromFirestore(prev.user.id, goalId).catch(console.warn);
      }
      return {
        ...prev,
        goals: prev.goals.filter(g => g.id !== goalId),
      };
    });
  };

  // Smart Daily Planner
  const generateDailyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeCommitments = state.commitments.filter(c => !c.completed);
      if (activeCommitments.length === 0) {
        setState(prev => ({
          ...prev,
          dailyPlan: [],
          planConflicts: [],
          lastPlanDate: new Date().toISOString().split('T')[0],
        }));
        return;
      }

      const res = await fetch('/api/ai/plan-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commitments: activeCommitments,
          userName: state.userName || state.user?.name,
          availableHours: state.profile.dailyAvailableHours,
          studyRhythm: state.profile.studyRhythm,
        }),
      });

      if (!res.ok) throw new Error('Planning failed');
      const data = await res.json();

      const mappedPlan: DailyPlanItem[] = (data.plan || []).map((p: any, idx: number) => ({
        id: 'p_' + idx + '_' + Math.random().toString(36).substring(2, 5),
        title: p.title,
        timeSlot: p.timeSlot,
        type: p.type,
        isCompleted: false,
        commitmentId: p.commitmentId,
      }));

      setState(prev => ({
        ...prev,
        dailyPlan: mappedPlan,
        planConflicts: data.conflicts || [],
        lastPlanDate: new Date().toISOString().split('T')[0],
      }));
    } catch (err: any) {
      setError(err.message || 'Error generating plan.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlanItem = (id: string) => {
    setState(prev => {
      if (!prev.dailyPlan) return prev;
      return {
        ...prev,
        dailyPlan: prev.dailyPlan.map(p =>
          p.id === id ? { ...p, isCompleted: !p.isCompleted } : p
        ),
      };
    });
  };

  const addFocusSession = (session: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const id = 'f_' + Math.random().toString(36).substring(2, 9);
    const item: FocusSession = {
      ...session,
      id,
      completedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      focusSessions: [item, ...prev.focusSessions],
    }));

    if (state.user?.id) {
      syncFocusSessionToFirestore(state.user.id, item).catch(console.warn);
    }
  };

  // AI Assistant Chat
  const askAssistant = async (message: string): Promise<AssistantMessage> => {
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            commitments: state.commitments,
            goals: state.goals,
            dailyPlan: state.dailyPlan || [],
            profile: state.profile,
            userName: state.userName || state.user?.name || 'User',
            streakDays: state.streakDays,
          },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : `Kairo request failed (${res.status}). Please try again.`);
      }
      if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Kairo returned an invalid response. Please try again.');
      }
      return {
        id: 'ast_' + Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toISOString(),
        suggestedActions: data.suggestedActions || [],
      };
    } catch (err) {
      throw err;
    }
  };

  const configureAIProvider = async (
    provider: 'gemini' | 'open_source', 
    config?: { endpoint: string; modelName: string; apiKey?: string }
  ) => {
    try {
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...config }),
      });
      if (!res.ok) throw new Error('Provider update failed');
      setState(prev => ({
        ...prev,
        aiProvider: provider,
        openSourceConfig: config,
      }));
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <PulseContext.Provider
      value={{
        state,
        loading,
        error,
        continueToPulse,
        login,
        loginAsGuest,
        signup,
        logout,
        resetAuth,
        resetAllData,
        loadDemoData,
        restoreWorkspaceData,
        clearError,
        updateProfile,
        updateUserName,
        extractFromInput,
        importCommitments,
        addCommitment,
        updateCommitment,
        toggleCommitment,
        deleteCommitment,
        addGoal,
        toggleGoalMilestone,
        deleteGoal,
        generateDailyPlan,
        togglePlanItem,
        addFocusSession,
        askAssistant,
        configureAIProvider,
      }}
    >
      {children}
    </PulseContext.Provider>
  );
};

export const usePulse = () => {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within PulseProvider');
  }
  return context;
};

