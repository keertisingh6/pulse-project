import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Commitment, Goal, FocusSession, StudentProfile, PulseUser } from '../types';

export async function syncUserProfileToFirestore(userId: string, user: PulseUser, profile: StudentProfile, streakDays: number = 0) {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      uid: userId,
      email: user.email,
      name: user.name || '',
      college: profile.college || '',
      branch: profile.branch || '',
      semester: profile.semester || '',
      studyRhythm: profile.studyRhythm || 'balanced',
      focusBlockMinutes: profile.focusBlockMinutes || 45,
      dailyAvailableHours: profile.dailyAvailableHours || 6,
      streakDays: streakDays || 0,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<any | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function syncCommitmentToFirestore(userId: string, commitment: Commitment) {
  const path = `users/${userId}/commitments/${commitment.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'commitments', commitment.id);
    const payload: any = {
      id: commitment.id,
      userId,
      title: commitment.title,
      dueDate: commitment.dueDate,
      completed: Boolean(commitment.completed),
    };

    if (commitment.type) payload.type = commitment.type;
    if (commitment.subject) payload.subject = commitment.subject;
    if (commitment.description) payload.description = commitment.description;
    if (commitment.dueTime) payload.dueTime = commitment.dueTime;
    if (commitment.estimatedEffort) payload.estimatedEffort = commitment.estimatedEffort;
    if (typeof commitment.effortMinutes === 'number') payload.effortMinutes = commitment.effortMinutes;
    if (commitment.priority) payload.priority = commitment.priority;
    if (commitment.completedAt) payload.completedAt = commitment.completedAt;
    if (commitment.source) payload.source = commitment.source;
    if (commitment.notes) payload.notes = commitment.notes;
    if (commitment.aiTip) payload.aiTip = commitment.aiTip;
    if (commitment.status) payload.status = commitment.status;

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCommitmentFromFirestore(userId: string, commitmentId: string) {
  const path = `users/${userId}/commitments/${commitmentId}`;
  try {
    const docRef = doc(db, 'users', userId, 'commitments', commitmentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchUserCommitmentsFromFirestore(userId: string): Promise<Commitment[]> {
  const path = `users/${userId}/commitments`;
  try {
    const colRef = collection(db, 'users', userId, 'commitments');
    const snap = await getDocs(colRef);
    const list: Commitment[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Commitment);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function syncGoalToFirestore(userId: string, goal: Goal) {
  const path = `users/${userId}/goals/${goal.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goal.id);
    const payload: any = {
      id: goal.id,
      userId,
      title: goal.title,
      targetDate: goal.targetDate,
      category: goal.category || 'academic',
      icon: goal.icon || 'Target',
      description: goal.description || '',
      color: goal.color || '#7C9070',
      progressPercentage: goal.progressPercentage || 0,
      milestones: goal.milestones || [],
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGoalFromFirestore(userId: string, goalId: string) {
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchUserGoalsFromFirestore(userId: string): Promise<Goal[]> {
  const path = `users/${userId}/goals`;
  try {
    const colRef = collection(db, 'users', userId, 'goals');
    const snap = await getDocs(colRef);
    const list: Goal[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Goal);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function syncFocusSessionToFirestore(userId: string, session: FocusSession) {
  const path = `users/${userId}/focusSessions/${session.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'focusSessions', session.id);
    await setDoc(docRef, {
      id: session.id,
      userId,
      durationMinutes: session.durationMinutes,
      ...(session.durationSeconds !== undefined ? { durationSeconds: session.durationSeconds } : {}),
      ...(session.startTime ? { startTime: session.startTime } : {}),
      ...(session.endTime ? { endTime: session.endTime } : {}),
      type: session.type,
      completedAt: session.completedAt || new Date().toISOString(),
      notes: session.notes || '',
      ...(session.commitmentId ? { commitmentId: session.commitmentId } : {}),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserFocusSessionsFromFirestore(userId: string): Promise<FocusSession[]> {
  const path = `users/${userId}/focusSessions`;
  try {
    const colRef = collection(db, 'users', userId, 'focusSessions');
    const snap = await getDocs(colRef);
    const list: FocusSession[] = [];
    snap.forEach((d) => {
      list.push(d.data() as FocusSession);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
