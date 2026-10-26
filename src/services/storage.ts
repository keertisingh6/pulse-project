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
  Commitment
} from '../types';

const STORAGE_KEYS = {
  COMMITMENTS: 'pulse_commitments_v2',
  TASKS: 'pulse_tasks_v2',
  SUBJECTS: 'pulse_subjects_v2',
  ASSIGNMENTS: 'pulse_assignments_v2',
  EXAMS: 'pulse_exams_v2',
  GOALS: 'pulse_goals_v2',
  PROJECTS: 'pulse_projects_v2',
  HABITS: 'pulse_habits_v2',
  SESSIONS: 'pulse_sessions_v2',
  PLANNER: 'pulse_planner_v2',
  PROFILE: 'pulse_profile_v2',
  KAIRO_MESSAGES: 'pulse_kairo_messages_v2'
};

const SEED_PROFILE: UserProfile = {
  name: 'Student',
  title: 'B.Tech CS Student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  semester: 'Fall 2026 • 3rd Year',
  dailyFocusGoalMinutes: 180,
  geminiApiKey: '',
  aiModel: 'gemini-1.5-flash',
  useMockAI: false
};

export const getSeedCommitments = (): Commitment[] => [
  {
    id: 'com-1',
    title: 'DSA Assignment 5',
    type: 'assignment',
    tag: 'Linked List',
    dueDate: '13 Oct 2026',
    dueDay: 'Mon',
    priority: 'high',
    estimatedHours: 3,
    completedSubtasks: 2,
    totalSubtasks: 5,
    status: 'in_progress'
  },
  {
    id: 'com-2',
    title: 'PBL-III Lab Report',
    type: 'lab',
    tag: 'AVL Tree',
    dueDate: '27 Oct 2026',
    dueDay: 'Mon',
    priority: 'medium',
    estimatedHours: 4,
    completedSubtasks: 3,
    totalSubtasks: 7,
    status: 'in_progress'
  },
  {
    id: 'com-3',
    title: 'Software Engineering CCA',
    type: 'exam',
    tag: 'Unit 1-3',
    dueDate: '3 Nov 2026',
    dueDay: 'Mon',
    priority: 'high',
    estimatedHours: 5,
    completedSubtasks: 1,
    totalSubtasks: 6,
    status: 'pending'
  },
  {
    id: 'com-4',
    title: 'Technovision Hackathon',
    type: 'hackathon',
    tag: 'Project Development',
    dueDate: '20 Oct 2026',
    dueDay: 'Mon',
    priority: 'medium',
    estimatedHours: 6,
    completedSubtasks: 4,
    totalSubtasks: 8,
    status: 'in_progress'
  },
  {
    id: 'com-5',
    title: 'DBMS Assignment 2',
    type: 'assignment',
    tag: 'Relational Algebra',
    dueDate: '28 Oct 2026',
    dueDay: 'Tue',
    priority: 'low',
    estimatedHours: 2,
    completedSubtasks: 0,
    totalSubtasks: 4,
    status: 'pending'
  }
];

export const getSeedTasks = (): Task[] => [
  {
    id: 't-1',
    title: 'DSA Assignment 5',
    description: 'Implement doubly linked list deletion and cycle detection algorithms.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:00',
    priority: 'high',
    status: 'in_progress',
    estimatedMinutes: 120,
    subjectId: 'sub-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't-2',
    title: 'PBL-III Lab Report',
    description: 'Document AVL tree height balancing benchmark results and rotation plots.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '19:00',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 180,
    subjectId: 'sub-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't-3',
    title: 'Read Research Paper',
    description: 'Attention Is All You Need — annotate self-attention formulation.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '21:00',
    priority: 'low',
    status: 'pending',
    estimatedMinutes: 60,
    subjectId: 'sub-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't-4',
    title: 'Threaded Binary Tree',
    description: 'In-order traversal with null pointer utilization.',
    dueDate: '2026-11-15',
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't-5',
    title: 'SE CCA',
    description: 'Agile vs Waterfall and COCOMO model review.',
    dueDate: '2026-11-03',
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 't-6',
    title: 'Project Phase 1',
    description: 'Architecture diagram, database schema, and REST endpoints.',
    dueDate: '2026-11-15',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getSeedGoals = (): Goal[] => [
  {
    id: 'g-1',
    title: 'Complete B.Tech',
    description: 'Maintain high academic consistency and complete all lab coursework on time.',
    category: 'Academic',
    targetDate: 'May 2028',
    status: 'active',
    progressPercent: 65,
    completedTasks: 37,
    totalTasks: 56,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400',
    milestones: [
      { id: 'm-1', title: 'Complete 3rd Year (Current)', dateRange: 'Aug 2025 - May 2026', percent: 100, completed: true },
      { id: 'm-2', title: 'Complete 4th Year', dateRange: 'Jun 2026 - May 2027', percent: 60, completed: false },
      { id: 'm-3', title: 'Final Year Project', dateRange: 'Aug 2027 - Dec 2027', percent: 0, completed: false },
      { id: 'm-4', title: 'Graduate', dateRange: 'May 2028', percent: 0, completed: false }
    ],
    linkedCommitments: [
      { id: 'lc-1', title: 'DBMS Assignment 2', type: 'Assignment', date: '28 Oct 2026', completed: false },
      { id: 'lc-2', title: 'SE Midterm Preparation', type: 'Exam', date: '3 Nov 2026', completed: false },
      { id: 'lc-3', title: 'Project Phase 1', type: 'Project', date: '15 Nov 2026', completed: false },
      { id: 'lc-4', title: 'PBL-III Viva', type: 'Lab', date: '11 Nov 2026', completed: false }
    ]
  },
  {
    id: 'g-2',
    title: 'Crack UPSC (IAS)',
    description: 'Daily current affairs analysis, answer writing practice, and GS syllabus coverage.',
    category: 'Career',
    targetDate: '2029',
    status: 'active',
    progressPercent: 25,
    completedTasks: 5,
    totalTasks: 20,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    milestones: [
      { id: 'm-5', title: 'NCERT Foundation Mastery', dateRange: 'Jan 2026 - Jun 2026', percent: 80, completed: false },
      { id: 'm-6', title: 'Standard Reference Books', dateRange: 'Jul 2026 - Dec 2026', percent: 20, completed: false }
    ]
  },
  {
    id: 'g-3',
    title: 'Improve Health & Fitness',
    description: 'Consistent strength training, 8k daily steps, and balanced nutrition.',
    category: 'Personal',
    targetDate: 'Dec 2026',
    status: 'active',
    progressPercent: 40,
    completedTasks: 4,
    totalTasks: 10,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    milestones: [
      { id: 'm-7', title: 'Consistent 4x/week Gym Habit', dateRange: 'Q3 2026', percent: 80, completed: true },
      { id: 'm-8', title: 'Run 5km Non-stop', dateRange: 'Nov 2026', percent: 30, completed: false }
    ]
  },
  {
    id: 'g-4',
    title: 'Build Strong Projects',
    description: 'Ship 3 full-stack applications with production deployments and system design documentation.',
    category: 'Academic',
    targetDate: 'Dec 2026',
    status: 'active',
    progressPercent: 50,
    completedTasks: 5,
    totalTasks: 10,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    milestones: [
      { id: 'm-9', title: 'Pulse AI Student OS', dateRange: 'Oct 2026', percent: 90, completed: true },
      { id: 'm-10', title: 'Distributed Log Consensus', dateRange: 'Dec 2026', percent: 20, completed: false }
    ]
  }
];

export const getSeedPlanner = (): PlannerBlock[] => [
  {
    id: 'pb-1',
    title: 'DBMS Assignment',
    day: 'Mon',
    startTime: '8 AM',
    endTime: '10 AM',
    timeLabel: '8 - 10 AM',
    category: 'task',
    color: 'mint',
    completed: true
  },
  {
    id: 'pb-2',
    title: 'PBL-III Report',
    day: 'Mon',
    startTime: '12 PM',
    endTime: '2 PM',
    timeLabel: '12 - 2 PM',
    category: 'task',
    color: 'yellow',
    completed: false
  },
  {
    id: 'pb-3',
    title: 'Revision',
    day: 'Mon',
    startTime: '6 PM',
    endTime: '8 PM',
    timeLabel: '6 - 8 PM',
    category: 'personal',
    color: 'peach',
    completed: false
  },
  {
    id: 'pb-4',
    title: 'Study DSA',
    day: 'Tue',
    startTime: '9 AM',
    endTime: '11 AM',
    timeLabel: '9 - 11 AM',
    category: 'class',
    color: 'purple',
    completed: false
  },
  {
    id: 'pb-5',
    title: 'Hackathon Work',
    day: 'Wed',
    startTime: '2 PM',
    endTime: '5 PM',
    timeLabel: '2 - 5 PM',
    category: 'focus',
    color: 'purple',
    completed: false
  },
  {
    id: 'pb-6',
    title: 'SE CCA Prep',
    day: 'Thu',
    startTime: '8 AM',
    endTime: '10 AM',
    timeLabel: '8 - 10 AM',
    category: 'exam_prep',
    color: 'peach',
    completed: false
  },
  {
    id: 'pb-7',
    title: 'Library Study',
    day: 'Fri',
    startTime: '2 PM',
    endTime: '4 PM',
    timeLabel: '2 - 4 PM',
    category: 'focus',
    color: 'mint',
    completed: false
  },
  {
    id: 'pb-8',
    title: 'Gym',
    day: 'Fri',
    startTime: '6 PM',
    endTime: '7 PM',
    timeLabel: '6 - 7 PM',
    category: 'personal',
    color: 'mint',
    completed: false
  },
  {
    id: 'pb-9',
    title: 'Project Research',
    day: 'Sat',
    startTime: '1 PM',
    endTime: '3 PM',
    timeLabel: '1 - 3 PM',
    category: 'task',
    color: 'blue',
    completed: false
  }
];

export const getSeedSubjects = (): Subject[] => [
  {
    id: 'sub-1',
    code: 'CS 301',
    name: 'Data Structures & Algorithms',
    color: 'mint',
    credits: 4,
    instructor: 'Dr. Roy',
    syllabus: [
      {
        id: 'u1',
        title: 'Unit 1: Linked Lists & Trees',
        topics: [
          { id: 't1', title: 'Doubly Linked Lists', completed: true },
          { id: 't2', title: 'AVL Tree Rotations', completed: true },
          { id: 't3', title: 'Threaded Binary Trees', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sub-2',
    code: 'CS 302',
    name: 'Database Management Systems',
    color: 'yellow',
    credits: 4,
    instructor: 'Prof. Miller',
    syllabus: [
      {
        id: 'u2',
        title: 'Unit 1: Relational Model & SQL',
        topics: [
          { id: 't4', title: 'Relational Algebra', completed: true },
          { id: 't5', title: 'Normalization (3NF, BCNF)', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sub-3',
    code: 'CS 305',
    name: 'Software Engineering',
    color: 'peach',
    credits: 3,
    instructor: 'Prof. Diaz',
    syllabus: [
      {
        id: 'u3',
        title: 'Unit 1: Software Lifecycle & Agile',
        topics: [
          { id: 't6', title: 'Scrum & Kanban Frameworks', completed: true },
          { id: 't7', title: 'Cost Estimation & COCOMO', completed: false }
        ]
      }
    ]
  }
];

export const getSeedHabits = (): Habit[] => [
  {
    id: 'h-1',
    title: 'Morning 45m DSA Sprint',
    category: 'Academics',
    color: 'mint',
    targetDaysPerWeek: 5,
    completedDates: [new Date().toISOString().split('T')[0]],
    streak: 6,
    bestStreak: 14
  },
  {
    id: 'h-2',
    title: 'Hydrate 2.5L Water',
    category: 'Health',
    color: 'blue',
    targetDaysPerWeek: 7,
    completedDates: [new Date().toISOString().split('T')[0]],
    streak: 12,
    bestStreak: 21
  }
];

export const getSeedFocusSessions = (): FocusSession[] => [
  {
    id: 'fs-1',
    taskId: 't-1',
    taskTitle: 'DSA Assignment 5',
    durationMinutes: 45,
    mode: 'pomodoro',
    completedAt: new Date().toISOString()
  }
];

export const getSeedKairoMessages = (): KairoMessage[] => [
  {
    id: 'km-1',
    sender: 'kairo',
    timestamp: '10:45 AM',
    text: "Good morning! You have 3 focused tasks scheduled today (DSA Assignment 5, PBL-III Lab Report, and Research Paper). Remember: small steps every day lead to big results. What would you like to tackle first?",
    suggestedActions: [
      {
        id: 'p-1',
        type: 'adjust_priority',
        title: 'Start DSA Assignment 5',
        description: 'Focus for 2 hours on linked list cycle detection.',
        payload: { taskId: 't-1' },
        applied: false
      }
    ]
  }
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

let syncTimeout: any = null;
function triggerBackendSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    try {
      const payload = {
        profile: loadFromStorage(STORAGE_KEYS.PROFILE, SEED_PROFILE),
        commitments: loadFromStorage(STORAGE_KEYS.COMMITMENTS, getSeedCommitments()),
        tasks: loadFromStorage(STORAGE_KEYS.TASKS, getSeedTasks()),
        subjects: loadFromStorage(STORAGE_KEYS.SUBJECTS, getSeedSubjects()),
        goals: loadFromStorage(STORAGE_KEYS.GOALS, getSeedGoals()),
        habits: loadFromStorage(STORAGE_KEYS.HABITS, getSeedHabits()),
        focusSessions: loadFromStorage(STORAGE_KEYS.SESSIONS, getSeedFocusSessions()),
        plannerBlocks: loadFromStorage(STORAGE_KEYS.PLANNER, getSeedPlanner()),
        updatedAt: new Date().toISOString()
      };
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {}
  }, 1000);
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    triggerBackendSync();
  } catch (e) {
    console.error('Failed to save ' + key, e);
  }
}


export const StorageService = {
  getProfile: (): UserProfile => loadFromStorage(STORAGE_KEYS.PROFILE, SEED_PROFILE),
  saveProfile: (p: UserProfile) => saveToStorage(STORAGE_KEYS.PROFILE, p),

  getCommitments: (): Commitment[] => loadFromStorage(STORAGE_KEYS.COMMITMENTS, getSeedCommitments()),
  saveCommitments: (c: Commitment[]) => saveToStorage(STORAGE_KEYS.COMMITMENTS, c),

  getTasks: (): Task[] => loadFromStorage(STORAGE_KEYS.TASKS, getSeedTasks()),
  saveTasks: (t: Task[]) => saveToStorage(STORAGE_KEYS.TASKS, t),

  getSubjects: (): Subject[] => loadFromStorage(STORAGE_KEYS.SUBJECTS, getSeedSubjects()),
  saveSubjects: (s: Subject[]) => saveToStorage(STORAGE_KEYS.SUBJECTS, s),

  getAssignments: (): Assignment[] => loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, []),
  saveAssignments: (a: Assignment[]) => saveToStorage(STORAGE_KEYS.ASSIGNMENTS, a),

  getExams: (): Exam[] => loadFromStorage(STORAGE_KEYS.EXAMS, []),
  saveExams: (e: Exam[]) => saveToStorage(STORAGE_KEYS.EXAMS, e),

  getGoals: (): Goal[] => loadFromStorage(STORAGE_KEYS.GOALS, getSeedGoals()),
  saveGoals: (g: Goal[]) => saveToStorage(STORAGE_KEYS.GOALS, g),

  getProjects: (): Project[] => loadFromStorage(STORAGE_KEYS.PROJECTS, []),
  saveProjects: (p: Project[]) => saveToStorage(STORAGE_KEYS.PROJECTS, p),

  getHabits: (): Habit[] => loadFromStorage(STORAGE_KEYS.HABITS, getSeedHabits()),
  saveHabits: (h: Habit[]) => saveToStorage(STORAGE_KEYS.HABITS, h),

  getFocusSessions: (): FocusSession[] => loadFromStorage(STORAGE_KEYS.SESSIONS, getSeedFocusSessions()),
  saveFocusSessions: (s: FocusSession[]) => saveToStorage(STORAGE_KEYS.SESSIONS, s),

  getPlanner: (): PlannerBlock[] => loadFromStorage(STORAGE_KEYS.PLANNER, getSeedPlanner()),
  savePlanner: (p: PlannerBlock[]) => saveToStorage(STORAGE_KEYS.PLANNER, p),

  getKairoMessages: (): KairoMessage[] => loadFromStorage(STORAGE_KEYS.KAIRO_MESSAGES, getSeedKairoMessages()),
  saveKairoMessages: (m: KairoMessage[]) => saveToStorage(STORAGE_KEYS.KAIRO_MESSAGES, m),

  resetAllToSeed: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  },

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    saveToStorage(STORAGE_KEYS.PROFILE, SEED_PROFILE);
    saveToStorage(STORAGE_KEYS.COMMITMENTS, []);
    saveToStorage(STORAGE_KEYS.TASKS, []);
    saveToStorage(STORAGE_KEYS.SUBJECTS, []);
    saveToStorage(STORAGE_KEYS.GOALS, []);
    saveToStorage(STORAGE_KEYS.PLANNER, []);
    saveToStorage(STORAGE_KEYS.HABITS, []);
    saveToStorage(STORAGE_KEYS.SESSIONS, []);
    saveToStorage(STORAGE_KEYS.KAIRO_MESSAGES, []);
  }
};
