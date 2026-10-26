import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Commitment, FocusSession, DailyPlanItem, PulseState, 
  PulseUser, Goal, StudentProfile, AssistantMessage, CommitmentType 
} from '../types';
import { 
  memeManager, 
  UserActivityType, 
  UserActivityContext, 
  MemeTextReaction 
} from '../services/memeManager';
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
  clearError: () => void;

  // Profile & Setup
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateUserName: (name: string) => void;
  setMemePersonalityMode: (mode: 'off' | 'college_friend' | 'full_desi') => void;
  getMemeReaction: (activity: UserActivityType | UserActivityContext) => MemeTextReaction;

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
  memePersonalityMode: 'college_friend',
};

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
    setState(CLEAN_INITIAL_STATE);
  };

  const resetAuth = () => {
    localStorage.removeItem('pulse_state');
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

  const setMemePersonalityMode = (mode: 'off' | 'college_friend' | 'full_desi') => {
    setState(prev => ({
      ...prev,
      memePersonalityMode: mode,
    }));
  };

  const getMemeReaction = (activity: UserActivityType | UserActivityContext): MemeTextReaction => {
    const context: UserActivityContext = typeof activity === 'string'
      ? { type: activity }
      : { ...activity };

    if (!context.personalityMode) {
      context.personalityMode = state.memePersonalityMode || 'college_friend';
    }
    if (!context.userName) {
      context.userName = state.userName || state.user?.name || 'Bhai';
    }
    if (context.activeCount === undefined) {
      context.activeCount = state.commitments.filter(c => !c.completed).length;
    }
    if (context.streakDays === undefined) {
      context.streakDays = state.streakDays;
    }
    if (context.hasConflicts === undefined) {
      context.hasConflicts = Boolean(state.planConflicts && state.planConflicts.length > 0);
    }
    if (context.overdueCount === undefined) {
      context.overdueCount = state.commitments.filter(c => isTaskOverdue(c)).length;
    }

    return memeManager.getReactionForActivity(context);
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
            memePersonalityMode: state.memePersonalityMode || 'college_friend',
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
        clearError,
        updateProfile,
        updateUserName,
        setMemePersonalityMode,
        getMemeReaction,
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
