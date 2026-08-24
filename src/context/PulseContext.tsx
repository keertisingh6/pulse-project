import React, { createContext, useContext, useState, useEffect } from 'react';
import { Commitment, FocusSession, DailyPlanItem, PulseState, CommitmentType, PulseUser } from '../types';

interface PulseContextType {
  state: PulseState;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => void;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  addCommitment: (commitment: Omit<Commitment, 'id' | 'createdAt'>) => void;
  toggleCommitment: (id: string) => void;
  deleteCommitment: (id: string) => void;
  importCommitments: (text: string, fileData?: string, mimeType?: string, fileName?: string) => Promise<Commitment[]>;
  generateDailyPlan: () => Promise<void>;
  togglePlanItem: (id: string) => void;
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  updateUserName: (name: string) => void;
  resetAllData: () => void;
  resetAuth: () => void;
  clearError: () => void;
}

const DEFAULT_COMMITMENTS: Commitment[] = [
  {
    id: 'c1',
    title: 'CS 401: Advanced Algorithms Assignment 3',
    type: 'Assignment',
    dueDate: '2026-06-27',
    dueTime: '23:59',
    estimatedEffort: '3 hours',
    effortMinutes: 180,
    priority: 'high',
    completed: false,
    createdAt: '2026-06-23T14:30:00Z',
    source: 'life_inbox',
    sourceFileName: 'Syllabus_CS401.pdf',
    notes: 'Covers graph traversals, dynamic programming, and network flow exercises.',
    aiTip: "Hey Keerti! Since dynamic programming takes concentration, let's block a quiet study slot tomorrow afternoon. You've got this.",
    owner: 'me',
    repeat: 'none',
    reminders: { threeDaysBefore: true, oneDayBefore: true, sixHoursBefore: true, twoHoursBefore: false },
    channels: { inApp: true, email: true, push: true },
    prepTimeMinutes: 30,
    suggestedStartTime: '2026-06-25T19:30:00'
  },
  {
    id: 'c2',
    title: 'Water and Garbage Bill (June)',
    type: 'Bill',
    dueDate: '2026-06-25',
    dueTime: '17:00',
    estimatedEffort: '10 mins',
    effortMinutes: 10,
    priority: 'medium',
    completed: false,
    createdAt: '2026-06-24T08:00:00Z',
    source: 'life_inbox',
    sourceFileName: 'utility_bill_screenshot.png',
    notes: 'Total balance: $48.50. Autopay is not active for this provider. Dad usually pays this one.',
    aiTip: "Let's handle this in the morning right after your tea. It'll take 2 minutes and clear up mental space.",
    owner: 'someone_else',
    ownerName: 'Dad',
    repeat: 'none',
    reminders: { oneDayBefore: true, oneHourBefore: true },
    channels: { inApp: true, email: true }
  },
  {
    id: 'c3',
    title: 'Sora App: Final Prototype Walkthrough',
    type: 'Meeting',
    dueDate: '2026-06-24',
    dueTime: '14:00',
    estimatedEffort: '2 hours',
    effortMinutes: 120,
    priority: 'high',
    completed: false,
    createdAt: '2026-06-22T09:00:00Z',
    source: 'manual',
    notes: 'Present the high-fidelity Figma links and collect client sign-off with the Dev Team.',
    aiTip: "Your deck is looking beautiful. Take 15 minutes before the call to breathe and stretch. You're ready.",
    owner: 'shared',
    ownerName: 'Dev Team',
    repeat: 'none',
    location: 'Conference Room Alpha & Google Meet',
    reminders: { oneHourBefore: true, fifteenMinBefore: true, atStart: true },
    channels: { inApp: true, push: true },
    travelTimeMinutes: 0,
    prepTimeMinutes: 15
  },
  {
    id: 'c4',
    title: 'Renew Netflix subscription',
    type: 'Bill',
    dueDate: '2026-06-25',
    dueTime: '12:00',
    estimatedEffort: '5 mins',
    effortMinutes: 5,
    priority: 'low',
    completed: true,
    completedAt: '2026-06-24T09:00:00Z',
    createdAt: '2026-06-24T08:30:00Z',
    source: 'manual',
    aiTip: "All done! Netflix subscription successfully reviewed and updated.",
    owner: 'me',
    repeat: 'monthly',
    reminders: { oneDayBefore: true },
    channels: { inApp: true }
  },
  {
    id: 'c5',
    title: 'Dr. Evelyn: Dental Cleaning & Checkup',
    type: 'Appointment',
    dueDate: '2026-06-29',
    dueTime: '10:00',
    estimatedEffort: '1.5 hours',
    effortMinutes: 90,
    priority: 'low',
    completed: false,
    createdAt: '2026-06-24T09:15:00Z',
    source: 'manual',
    notes: 'Checkup at the central clinic. Park in the south structure.',
    aiTip: "A quick dental tune-up. This can wait until Monday morning.",
    owner: 'me',
    repeat: 'none',
    location: 'Downtown Dental Care, Suite 400',
    reminders: { oneDayBefore: true, oneHourBefore: true },
    channels: { inApp: true, email: true, sms: true },
    travelTimeMinutes: 25,
    prepTimeMinutes: 15
  },
  {
    id: 'c6',
    title: 'Technical Architect Interview: VeloCorp',
    type: 'Meeting',
    dueDate: '2026-06-26',
    dueTime: '10:00',
    estimatedEffort: '1 hour',
    effortMinutes: 60,
    priority: 'high',
    completed: false,
    createdAt: '2026-06-23T11:00:00Z',
    source: 'life_inbox',
    sourceFileName: 'VeloCorp_Invite.eml',
    notes: 'Google Meet link is in the email. Panel interview with Lead Architect.',
    aiTip: "VeloCorp loves your full-stack expertise! Let's do a 20-minute focus session tonight to review their product catalog.",
    owner: 'me',
    repeat: 'none',
    location: 'VeloCorp HQ, 500 Oracle Parkway',
    reminders: { oneDayBefore: true, oneHourBefore: true, fifteenMinBefore: true },
    channels: { inApp: true, email: true, push: true, sms: true },
    travelTimeMinutes: 30,
    prepTimeMinutes: 20
  }
];

const DEFAULT_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'f1',
    commitmentId: 'c1',
    durationMinutes: 45,
    completedAt: '2026-06-23T16:00:00Z',
    type: 'study',
    notes: 'Completed graph traversals chapter review.'
  },
  {
    id: 'f2',
    durationMinutes: 25,
    completedAt: '2026-06-24T09:30:00Z',
    type: 'work',
    notes: 'Mindful review of Figma walkthrough flows.'
  }
];

const DEFAULT_DAILY_PLAN: DailyPlanItem[] = [
  { id: 'p1', title: 'Prepare Figma deck walkthrough', timeSlot: '09:00 - 10:00', type: 'work', commitmentId: 'c3', isCompleted: true },
  { id: 'p2', title: 'Gentle stretching & water hydration', timeSlot: '10:00 - 10:15', type: 'break', isCompleted: true },
  { id: 'p3', title: 'Water and Garbage Bill payment', timeSlot: '10:15 - 10:30', type: 'payment', commitmentId: 'c2', isCompleted: false },
  { id: 'p4', title: 'CS 401 Algorithm Core Homework session', timeSlot: '11:00 - 12:30', type: 'study', commitmentId: 'c1', isCompleted: false },
  { id: 'p5', title: 'Mindful lunch & outdoor walk', timeSlot: '12:30 - 13:30', type: 'break', isCompleted: false }
];

const PulseContext = createContext<PulseContextType | undefined>(undefined);

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PulseState>(() => {
    const localData = localStorage.getItem('pulse_state');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        // Only consider authenticated if a user object exists and isAuthenticated is true
        if (parsed.user && parsed.isAuthenticated === true) {
          return {
            ...parsed,
            user: parsed.user,
            isAuthenticated: true,
            userName: parsed.user.name || parsed.userName || 'Keerti'
          };
        }
        return {
          ...parsed,
          user: null,
          isAuthenticated: false,
          userName: ''
        };
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
      }
    }
    // Fresh session: always starts unauthenticated with user: null and isAuthenticated: false
    return {
      user: null,
      isAuthenticated: false,
      commitments: DEFAULT_COMMITMENTS,
      focusSessions: DEFAULT_FOCUS_SESSIONS,
      dailyPlan: DEFAULT_DAILY_PLAN,
      lastPlanDate: '2026-06-24',
      streakDays: 4,
      userName: ''
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication Handlers
  const login = async (email: string, _password?: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const extractedName = name || email.split('@')[0] || 'User';
      const cleanName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      const user: PulseUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: cleanName,
        email: email,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        userName: cleanName
      }));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const user: PulseUser = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name: 'Keerti Singh',
        email: 'singhkeerti2007@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        userName: 'Keerti'
      }));
    } catch (err: any) {
      setError('Google sign-in could not be completed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = (name: string = 'Keerti') => {
    const user: PulseUser = {
      id: 'usr_demo',
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@pulse.app`,
      provider: 'guest',
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
      userName: name
    }));
  };

  const signup = async (name: string, email: string, _password?: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const user: PulseUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: name || 'User',
        email: email,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        userName: name || 'User'
      }));
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pulse_state');
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      userName: ''
    }));
  };

  const resetAuth = () => {
    localStorage.removeItem('pulse_state');
    setState({
      user: null,
      isAuthenticated: false,
      commitments: DEFAULT_COMMITMENTS,
      focusSessions: DEFAULT_FOCUS_SESSIONS,
      dailyPlan: DEFAULT_DAILY_PLAN,
      lastPlanDate: '2026-06-24',
      streakDays: 4,
      userName: ''
    });
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pulse_state', JSON.stringify(state));
  }, [state]);

  const addCommitment = (newCommitment: Omit<Commitment, 'id' | 'createdAt'>) => {
    const id = 'c_' + Math.random().toString(36).substring(2, 9);
    const item: Commitment = {
      ...newCommitment,
      id,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      commitments: [item, ...prev.commitments]
    }));
  };

  const toggleCommitment = (id: string) => {
    setState(prev => {
      const updated = prev.commitments.map(c => {
        if (c.id === id) {
          const completed = !c.completed;
          return {
            ...c,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined
          };
        }
        return c;
      });

      // Simple positive reinforcing feedback for streaks
      const justCompletedCount = updated.filter(c => c.completed).length;
      const initialCompletedCount = prev.commitments.filter(c => c.completed).length;
      let streakDays = prev.streakDays;
      if (justCompletedCount > initialCompletedCount) {
        streakDays += Math.random() > 0.7 ? 1 : 0; // Increment streak dynamically
      }

      return {
        ...prev,
        commitments: updated,
        streakDays
      };
    });
  };

  const deleteCommitment = (id: string) => {
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.filter(c => c.id !== id),
      dailyPlan: prev.dailyPlan ? prev.dailyPlan.filter(p => p.commitmentId !== id) : null
    }));
  };

  const importCommitments = async (text: string, fileData?: string, mimeType?: string, fileName?: string): Promise<Commitment[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, fileData, mimeType, fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse document with Gemini API');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const extracted: Commitment[] = data.commitments.map((c: any) => {
        const reminders = c.reminders || (c.type === 'Assignment' ? {
          threeDaysBefore: true,
          oneDayBefore: true,
          sixHoursBefore: true,
          twoHoursBefore: false
        } : {
          oneDayBefore: true,
          oneHourBefore: true,
          fifteenMinBefore: true,
          atStart: true
        });

        const channels = c.channels || {
          inApp: true,
          email: true,
          push: true
        };

        return {
          id: 'c_' + Math.random().toString(36).substring(2, 9),
          title: c.title,
          type: c.type as CommitmentType,
          dueDate: c.dueDate,
          dueTime: c.dueTime || '12:00',
          estimatedEffort: c.estimatedEffort || '1 hour',
          effortMinutes: c.effortMinutes || 60,
          priority: c.priority || 'medium',
          completed: false,
          createdAt: new Date().toISOString(),
          source: 'life_inbox',
          sourceFileName: fileName || 'Uploaded Document',
          notes: c.notes || '',
          aiTip: c.aiTip || "Let's work through this commitment carefully. I'll guide you step-by-step.",
          location: c.location || '',
          repeat: c.repeat || 'none',
          reminders,
          channels,
          owner: c.owner || 'me',
          ownerName: c.ownerName || '',
          travelTimeMinutes: c.travelTimeMinutes || 0,
          prepTimeMinutes: c.prepTimeMinutes || 0,
          suggestedStartTime: c.suggestedStartTime || ''
        };
      });

      setState(prev => ({
        ...prev,
        commitments: [...extracted, ...prev.commitments]
      }));

      return extracted;
    } catch (e: any) {
      setError(e.message || 'An error occurred during extraction.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const generateDailyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeCommitments = state.commitments.filter(c => !c.completed);
      const response = await fetch('/api/gemini/plan-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commitments: activeCommitments,
          userName: state.userName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate daily plan with Kairo');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const mappedPlan: DailyPlanItem[] = data.plan.map((p: any, index: number) => ({
        id: 'p_' + index + '_' + Math.random().toString(36).substring(2, 5),
        title: p.title,
        timeSlot: p.timeSlot,
        type: p.type,
        isCompleted: false
      }));

      setState(prev => ({
        ...prev,
        dailyPlan: mappedPlan,
        lastPlanDate: '2026-06-24'
      }));
    } catch (e: any) {
      setError(e.message || 'An error occurred while building your day.');
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
        )
      };
    });
  };

  const addFocusSession = (session: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const id = 'f_' + Math.random().toString(36).substring(2, 9);
    const item: FocusSession = {
      ...session,
      id,
      completedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      focusSessions: [item, ...prev.focusSessions]
    }));
  };

  const updateUserName = (name: string) => {
    setState(prev => ({
      ...prev,
      userName: name
    }));
  };

  const resetAllData = () => {
    setState(prev => ({
      ...prev,
      commitments: DEFAULT_COMMITMENTS,
      focusSessions: DEFAULT_FOCUS_SESSIONS,
      dailyPlan: DEFAULT_DAILY_PLAN,
      lastPlanDate: '2026-06-24',
      streakDays: 4
    }));
  };

  const clearError = () => setError(null);

  return (
    <PulseContext.Provider
      value={{
        state,
        loading,
        error,
        login,
        loginWithGoogle,
        loginAsGuest,
        signup,
        logout,
        addCommitment,
        toggleCommitment,
        deleteCommitment,
        importCommitments,
        generateDailyPlan,
        togglePlanItem,
        addFocusSession,
        updateUserName,
        resetAllData,
        resetAuth,
        clearError
      }}
    >
      {children}
    </PulseContext.Provider>
  );
};

export const usePulse = () => {
  const context = useContext(PulseContext);
  if (context === undefined) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
};
