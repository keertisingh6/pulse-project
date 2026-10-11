import { INDIAN_MEME_LIBRARY, MemeReference } from '../data/indianMemeLibrary';
import { memeManager, MemeManager, UserActivityContext, MemeTextReaction } from '../services/memeManager';
import { isTaskOverdue } from './deadlineUtils';

export { memeManager, MemeManager };
export type { UserActivityContext, MemeTextReaction };

export type MemePersonalityMode = 'off' | 'college_friend' | 'full_desi';

export interface MemeEvaluationContext {
  query?: string;
  activeCommitmentsCount: number;
  urgentCommitmentsCount: number;
  overdueCount: number;
  totalPlannedHours: number;
  streakDays: number;
  hasConflicts?: boolean;
  allTodayTasksCompleted?: boolean;
  personalityMode?: MemePersonalityMode;
  contextTag?: string;
  sourceScreen?: 'chat' | 'companion' | 'today' | 'inbox';
}

export interface MemeEvaluationResult {
  matchedMeme: MemeReference | null;
  humorSnippet: string | null;
  actionableGuidance: string;
  isSeriousSituation: boolean;
  reason: string;
}

/**
 * Checks if user message or situation requires solemn, supportive, and professional handling.
 */
export function isSeriousSituation(text?: string): boolean {
  return memeManager.isSeriousSituation(text);
}

/**
 * Checks whether a meme is on cooldown.
 */
export function isMemeOnCooldown(memeId: string, cooldownMinutes?: number): boolean {
  return memeManager.isMemeOnCooldown(memeId, cooldownMinutes);
}

/**
 * Marks a meme as recently used.
 */
export function markMemeUsed(memeId: string): void {
  memeManager.recordMemeUsage(memeId);
}

/**
 * Core Context-Aware Meme Selection Algorithm:
 * USER CONTEXT -> UNDERSTAND SITUATION -> CHECK MEME LIBRARY -> SELECT APPROPRIATE REFERENCE -> CHECK SAFETY + RELEVANCE
 */
export function evaluateSituationAndSelectMeme(
  context: MemeEvaluationContext
): MemeEvaluationResult {
  const mode = context.personalityMode ?? 'college_friend';

  // 1. Safety & Sensitivity check
  if (isSeriousSituation(context.query)) {
    return {
      matchedMeme: null,
      humorSnippet: null,
      actionableGuidance: "I'm right here with you. Please prioritize your well-being and health first. Academic deadlines can always be rearranged, and you don't have to carry this alone. Let's take things one quiet step at a time.",
      isSeriousSituation: true,
      reason: 'Safety trigger detected. Suppressed humor to provide empathetic, professional care.'
    };
  }

  // 2. Personality mode disabled check
  if (mode === 'off') {
    return {
      matchedMeme: null,
      humorSnippet: null,
      actionableGuidance: "Focusing on your commitments calmly and methodically.",
      isSeriousSituation: false,
      reason: 'Meme personality disabled in user settings.'
    };
  }

  const queryLower = (context.query || '').toLowerCase();
  let candidateId: string | null = null;
  let situationExplanation = '';

  // 3. Situational reasoning based on real signals

  // A. All tasks done / Major streak milestone
  if (context.allTodayTasksCompleted || (context.streakDays > 0 && context.streakDays % 5 === 0 && context.activeCommitmentsCount === 0)) {
    candidateId = 'pawri_ho_rahi_hai';
    situationExplanation = 'Major milestone or all daily commitments completed.';
  }
  // B. Overloaded schedule or excessive study marathon
  else if (context.totalPlannedHours >= 9 || context.urgentCommitmentsCount >= 6 || queryLower.includes('study 12 hours') || queryLower.includes('study 14 hours') || queryLower.includes('so much to do')) {
    candidateId = 'control_uday_control';
    situationExplanation = 'High schedule density / risk of academic exhaustion.';
  }
  // C. Schedule collision / overlap detected
  else if (context.hasConflicts || queryLower.includes('conflict') || queryLower.includes('clash') || queryLower.includes('overlap')) {
    candidateId = 'rasode_mein_kaun_tha';
    situationExplanation = 'Schedule collision or conflicting time blocks detected.';
  }
  // D. Coding frustration / compiler error / debugging nightmare
  else if (
    queryLower.includes('code') || queryLower.includes('bug') || 
    queryLower.includes('compiler') || queryLower.includes('syntax error') || 
    queryLower.includes('segmentation fault') || queryLower.includes('not working') ||
    queryLower.includes('kolaveri')
  ) {
    candidateId = 'why_this_kolaveri_di';
    situationExplanation = 'Technical/coding frustration or stubborn debugging loop.';
  }
  // E. Distraction / aimless rabbit holes
  else if (queryLower.includes('distracted') || queryLower.includes('procrastinating') || queryLower.includes('wasting time') || queryLower.includes('reels') || queryLower.includes('youtube')) {
    candidateId = 'jcb_ki_khudai';
    situationExplanation = 'Aimless rabbit holes or digital distraction during prime study hours.';
  }
  // F. Overdue tasks / blatant deadline avoidance / questionable timing
  else if (context.overdueCount > 0 || queryLower.includes('deadline tomorrow') || queryLower.includes('leaving it for later') || queryLower.includes('kal karenge')) {
    candidateId = 'vinod_dekh_raha_hai';
    situationExplanation = 'Deadline avoidance or observing overdue commitments.';
  }
  // G. Minor unexpected academic setback / tough lab / missed target
  else if (queryLower.includes('missed') || queryLower.includes('late') || queryLower.includes('moye moye') || queryLower.includes('sad')) {
    candidateId = 'moye_moye';
    situationExplanation = 'Minor academic setback or unexpectedly long assignment.';
  }
  // H. Sequential timeline / prerequisites
  else if (queryLower.includes('order') || queryLower.includes('sequence') || queryLower.includes('prerequisite') || queryLower.includes('chronology') || queryLower.includes('first')) {
    candidateId = 'aap_chronology_samajhiye';
    situationExplanation = 'Chronological sequencing of prerequisites.';
  }
  // I. Ambitious projects / hackathons
  else if (queryLower.includes('hackathon') || queryLower.includes('big project') || queryLower.includes('ambitious') || queryLower.includes('risk')) {
    candidateId = 'risk_hai_toh_ishq_hai';
    situationExplanation = 'Taking on high-challenge academic goals.';
  }
  // J. Surprise early morning commitments
  else if (queryLower.includes('8 am') || queryLower.includes('early morning') || queryLower.includes('viva') || queryLower.includes('baburao')) {
    candidateId = 'baburao_style';
    situationExplanation = 'Early morning college hustle or surprise viva.';
  }
  // K. Absurd or mystery input
  else if (queryLower.trim() === 'binod' || (context.contextTag === 'mystery_upload')) {
    candidateId = 'binod_raw';
    situationExplanation = 'Minimalist or absurd non-sequitur input.';
  }

  // 4. Validate meme against constraints & cooldown
  if (candidateId) {
    const meme = INDIAN_MEME_LIBRARY.find(m => m.id === candidateId);
    if (meme) {
      // Check screen permission
      const allowedOnScreen = context.sourceScreen === 'chat' 
        ? meme.allowedInChat 
        : meme.allowedInUiMicrocopy;

      // Check cooldown (reduced cooldown in 'full_desi' mode)
      const effectiveCooldown = mode === 'full_desi' ? Math.floor(meme.cooldownMinutes / 2) : meme.cooldownMinutes;
      const onCooldown = isMemeOnCooldown(meme.id, effectiveCooldown);

      if (allowedOnScreen && !onCooldown) {
        // Record usage
        markMemeUsed(meme.id);

        const snippet = mode === 'full_desi' 
          ? meme.samplePhrases.punchline 
          : `${meme.samplePhrases.leadIn} ${meme.samplePhrases.microcopy}`;

        return {
          matchedMeme: meme,
          humorSnippet: snippet,
          actionableGuidance: meme.samplePhrases.punchline,
          isSeriousSituation: false,
          reason: `Matched "${meme.memeName}" based on context: ${situationExplanation}`
        };
      }
    }
  }

  return {
    matchedMeme: null,
    humorSnippet: null,
    actionableGuidance: "Steady progress beats last-minute stress.",
    isSeriousSituation: false,
    reason: 'No situational trigger matched or meme is currently on cooldown.'
  };
}

/**
 * Returns contextual companion copy for the home companion bubble.
 */
export function getContextualCompanionMemeNote(
  state: {
    commitments: any[];
    dailyPlan: any[] | null;
    streakDays: number;
    userName?: string;
  },
  personalityMode: MemePersonalityMode = 'college_friend'
): { memeTitle?: string; message: string; badge: string } {
  if (personalityMode === 'off') {
    const pending = state.commitments.filter(c => !c.completed).length;
    return {
      badge: 'Calm Mentor',
      message: pending === 0 
        ? "Your workspace is calm and spacious. Great time to rest or plan ahead."
        : `You have ${pending} active commitments. Let's tackle them mindfully.`
    };
  }

  const pending = state.commitments.filter(c => !c.completed);
  const urgent = pending.filter(c => c.priority === 'high');
  const now = new Date();
  const overdue = pending.filter(c => isTaskOverdue(c, now));

  // If streak >= 5 and no pending
  if (pending.length === 0 && state.streakDays >= 3) {
    return {
      memeTitle: 'Pawri Ho Rahi Hai',
      badge: 'Desi Campus Buddy 🎉',
      message: 'Zero pending commitments aur solid streak! "Pawri ho rahi hai!" Take a proper guilt-free break.'
    };
  }

  // If overloaded
  if (pending.length >= 8 || urgent.length >= 4) {
    return {
      memeTitle: 'Control Uday Control',
      badge: 'Desi Reality Check 🧘‍♂️',
      message: `Control Uday, control! You have ${pending.length} tasks lined up (${urgent.length} urgent). Let's pick just the top 2 and not exhaust ourselves.`
    };
  }

  // If overdue tasks
  if (overdue.length > 0) {
    return {
      memeTitle: 'Dekh Raha Hai Vinod',
      badge: 'Campus Alert 👀',
      message: `Dekh raha hai Vinod... ${overdue.length} commitments overdue ho chuke hain. Ek 25-minute focus session lagao aur ek ko abhi niptao.`
    };
  }

  // Standard supportive buddy
  return {
    badge: 'Desi College Buddy ☕',
    message: `Ready when you are, ${state.userName || 'Bhai'}! ${pending.length} active commitments on deck. Pehle top priority ko finish karte hain.`
  };
}
