import { INDIAN_MEME_LIBRARY, MemeReference } from '../data/indianMemeLibrary';

export type UserActivityType =
  | 'task_completed'
  | 'all_tasks_completed'
  | 'streak_milestone'
  | 'deadline_approaching'
  | 'overdue_task'
  | 'procrastination'
  | 'schedule_overloaded'
  | 'schedule_conflict'
  | 'coding_struggle'
  | 'distraction_rabbit_hole'
  | 'unexpected_setback'
  | 'prerequisite_ordering'
  | 'ambitious_goal'
  | 'early_morning_rush'
  | 'mystery_input'
  | 'general_checkin';

export interface UserActivityContext {
  type?: UserActivityType;
  activityText?: string;
  taskTitle?: string;
  userName?: string;
  activeCount?: number;
  urgentCount?: number;
  overdueCount?: number;
  completedCount?: number;
  streakDays?: number;
  plannedHours?: number;
  hasConflicts?: boolean;
  sourceScreen?: 'chat' | 'companion' | 'today' | 'commitments' | 'settings' | 'inbox';
  personalityMode?: 'off' | 'college_friend' | 'full_desi';
  ignoreCooldown?: boolean;
}

export interface MemeTextReaction {
  memeId: string | null;
  memeName: string | null;
  leadIn: string | null;
  punchline: string | null;
  microcopy: string | null;
  actionableTip: string;
  badgeText: string;
  tone: string;
  origin: string | null;
  onCooldownBypassed: boolean;
  isSeriousVeto: boolean;
  reason: string;
  reactionText: string;
}

export interface CooldownStatusInfo {
  memeId: string;
  memeName: string;
  lastUsedTimestamp: number | null;
  cooldownMinutes: number;
  isOnCooldown: boolean;
  remainingMinutes: number;
}

// Serious triggers that strictly suppress humor and memes
const SERIOUS_TRIGGER_KEYWORDS = [
  'depress', 'depression', 'suicide', 'kill myself', 'die', 'hopeless', 
  'crying', 'breakdown', 'panic attack', 'anxiety attack', 'hospital', 
  'emergency', 'doctor', 'funeral', 'passed away', 'grief', 'medical', 
  'fail college', 'failing out', 'expelled', 'abuse', 'trauma', 'self-harm'
];

/**
 * MemeManager
 * 
 * Internal service that stores a curated list of authentic Indian meme references
 * (e.g. Dekh Raha Hai Vinod, Pawri Ho Rahi Hai, Rasode Mein Kaun Tha, Control Uday Control, etc.)
 * and implements a cooldown-based selector function that produces contextual text reactions
 * based on user activity without using any hard-coded images.
 */
export class MemeManager {
  private memes: Map<string, MemeReference> = new Map();
  private cooldownMap: Map<string, number> = new Map();

  constructor(initialMemes: MemeReference[] = INDIAN_MEME_LIBRARY) {
    this.initializeMemes(initialMemes);
  }

  /**
   * Loads or reloads the curated meme repository.
   */
  public initializeMemes(memes: MemeReference[]): void {
    this.memes.clear();
    for (const meme of memes) {
      this.memes.set(meme.id, meme);
    }
  }

  /**
   * Returns all curated Indian meme references.
   */
  public getAllMemes(): MemeReference[] {
    return Array.from(this.memes.values());
  }

  /**
   * Finds a specific curated meme by its identifier.
   */
  public getMemeById(id: string): MemeReference | undefined {
    return this.memes.get(id);
  }

  /**
   * Returns memes tagged with a specific trigger keyword.
   */
  public getMemesByTag(tag: string): MemeReference[] {
    const lowerTag = tag.toLowerCase();
    return this.getAllMemes().filter(m => 
      m.triggerTags.some(t => t.toLowerCase() === lowerTag)
    );
  }

  /**
   * Checks if an input indicates serious mental distress, grief, or personal crisis.
   */
  public isSeriousSituation(text?: string): boolean {
    if (!text) return false;
    const lower = text.toLowerCase();
    return SERIOUS_TRIGGER_KEYWORDS.some(kw => lower.includes(kw));
  }

  /**
   * Checks whether a meme is currently on cooldown.
   */
  public isMemeOnCooldown(memeId: string, customCooldownMinutes?: number): boolean {
    const lastUsed = this.cooldownMap.get(memeId);
    if (!lastUsed) return false;

    const meme = this.memes.get(memeId);
    const cooldownMins = customCooldownMinutes ?? (meme ? meme.cooldownMinutes : 15);
    const elapsedMinutes = (Date.now() - lastUsed) / (1000 * 60);

    return elapsedMinutes < cooldownMins;
  }

  /**
   * Returns the remaining cooldown duration in minutes (0 if ready).
   */
  public getRemainingCooldownMinutes(memeId: string, customCooldownMinutes?: number): number {
    const lastUsed = this.cooldownMap.get(memeId);
    if (!lastUsed) return 0;

    const meme = this.memes.get(memeId);
    const cooldownMins = customCooldownMinutes ?? (meme ? meme.cooldownMinutes : 15);
    const elapsedMinutes = (Date.now() - lastUsed) / (1000 * 60);
    const remaining = cooldownMins - elapsedMinutes;

    return remaining > 0 ? Math.ceil(remaining) : 0;
  }

  /**
   * Records usage timestamp for a meme to enforce its cooldown.
   */
  public recordMemeUsage(memeId: string): void {
    this.cooldownMap.set(memeId, Date.now());
  }

  /**
   * Resets all cooldown timers (useful for testing or session reset).
   */
  public resetCooldowns(): void {
    this.cooldownMap.clear();
  }

  /**
   * Returns comprehensive cooldown status for all stored memes.
   */
  public getCooldownStatus(): Record<string, CooldownStatusInfo> {
    const status: Record<string, CooldownStatusInfo> = {};
    for (const meme of this.getAllMemes()) {
      const lastUsed = this.cooldownMap.get(meme.id) ?? null;
      const onCooldown = this.isMemeOnCooldown(meme.id);
      const remaining = this.getRemainingCooldownMinutes(meme.id);
      status[meme.id] = {
        memeId: meme.id,
        memeName: meme.memeName,
        lastUsedTimestamp: lastUsed,
        cooldownMinutes: meme.cooldownMinutes,
        isOnCooldown: onCooldown,
        remainingMinutes: remaining,
      };
    }
    return status;
  }

  /**
   * Cooldown-based selector function that provides contextual text reactions
   * based on user activity without using hard-coded images.
   */
  public getReactionForActivity(
    contextOrType: UserActivityContext | UserActivityType
  ): MemeTextReaction {
    const context: UserActivityContext = typeof contextOrType === 'string'
      ? { type: contextOrType }
      : contextOrType;

    const mode = context.personalityMode ?? 'college_friend';

    // 1. Safety Veto: Suppress all memes/jokes during distress or emergency
    const fullTextToCheck = `${context.activityText || ''} ${context.taskTitle || ''}`;
    if (this.isSeriousSituation(fullTextToCheck)) {
      return {
        memeId: null,
        memeName: null,
        leadIn: null,
        punchline: null,
        microcopy: null,
        actionableTip: "I'm right here with you. Please prioritize your well-being and health first. Academic deadlines can always be rearranged. Let's take things one step at a time.",
        badgeText: 'Care & Well-being First',
        tone: 'calming',
        origin: null,
        onCooldownBypassed: false,
        isSeriousVeto: true,
        reason: 'Safety trigger detected. Suppressed humor to provide empathetic, professional guidance.',
        reactionText: "I'm right here with you. Please prioritize your well-being and health first. Academic deadlines can always be rearranged. Let's take things one step at a time.",
      };
    }

    // 2. Personality Mode Disabled check
    if (mode === 'off') {
      return {
        memeId: null,
        memeName: null,
        leadIn: null,
        punchline: null,
        microcopy: null,
        actionableTip: 'Keep steady focus on your active commitments.',
        badgeText: 'Calm Mentor',
        tone: 'calming',
        origin: null,
        onCooldownBypassed: false,
        isSeriousVeto: false,
        reason: 'Meme personality disabled by user settings.',
        reactionText: 'Focusing calmly and systematically on your commitments.',
      };
    }

    // 3. Map user activity to candidate meme IDs (primary + fallbacks)
    const candidates = this.resolveCandidateMemes(context);

    // 4. Evaluate candidates against screen rules and cooldowns
    for (const candidateId of candidates) {
      const meme = this.memes.get(candidateId);
      if (!meme) continue;

      // Screen validation
      if (context.sourceScreen === 'chat' && !meme.allowedInChat) continue;
      if (
        context.sourceScreen &&
        context.sourceScreen !== 'chat' &&
        !meme.allowedInUiMicrocopy
      ) {
        continue;
      }

      // Effective cooldown duration (halved in 'full_desi' mode for extra flavor)
      const effectiveCooldown = mode === 'full_desi'
        ? Math.floor(meme.cooldownMinutes / 2)
        : meme.cooldownMinutes;

      const onCooldown = this.isMemeOnCooldown(meme.id, effectiveCooldown);

      if (!onCooldown || context.ignoreCooldown) {
        // Enforce cooldown by marking usage
        if (!context.ignoreCooldown) {
          this.recordMemeUsage(meme.id);
        }

        // Generate contextual text reaction without any hard-coded images
        const reactionText = this.composeReactionText(meme, context, mode);

        return {
          memeId: meme.id,
          memeName: meme.memeName,
          leadIn: meme.samplePhrases.leadIn,
          punchline: meme.samplePhrases.punchline,
          microcopy: meme.samplePhrases.microcopy,
          actionableTip: meme.samplePhrases.punchline,
          badgeText: `${meme.memeName}`,
          tone: meme.tone,
          origin: meme.origin,
          onCooldownBypassed: Boolean(context.ignoreCooldown && onCooldown),
          isSeriousVeto: false,
          reason: `Selected "${meme.memeName}" for activity "${context.type || 'contextual'}" with active cooldown check.`,
          reactionText,
        };
      }
    }

    // 5. Fallback reaction when all matching candidates are on cooldown
    return {
      memeId: null,
      memeName: null,
      leadIn: null,
      punchline: null,
      microcopy: null,
      actionableTip: 'Keep up the momentum — steady progress beats last-minute rush!',
      badgeText: 'Campus Buddy',
      tone: 'playful',
      origin: null,
      onCooldownBypassed: false,
      isSeriousVeto: false,
      reason: 'Relevant meme triggers are currently on cooldown to prevent repetitive jokes.',
      reactionText: `Great work on your progress, ${context.userName || 'Bhai'}! Let's keep the focus smooth.`,
    };
  }

  /**
   * Resolves prioritized meme candidate IDs based on user activity cues.
   */
  private resolveCandidateMemes(context: UserActivityContext): string[] {
    const textLower = `${context.activityText || ''} ${context.taskTitle || ''}`.toLowerCase();
    const type = context.type;

    // 1. Completion / Celebratory milestones
    if (
      type === 'task_completed' ||
      type === 'all_tasks_completed' ||
      type === 'streak_milestone' ||
      (context.completedCount && context.completedCount > 0 && context.activeCount === 0) ||
      textLower.includes('finished all') ||
      textLower.includes('pawri')
    ) {
      return ['pawri_ho_rahi_hai', 'risk_hai_toh_ishq_hai'];
    }

    // 2. Schedule overloaded / marathon study panic
    if (
      type === 'schedule_overloaded' ||
      (context.plannedHours && context.plannedHours >= 9) ||
      (context.activeCount && context.activeCount >= 8) ||
      (context.urgentCount && context.urgentCount >= 5) ||
      textLower.includes('study 12 hours') ||
      textLower.includes('so much to do') ||
      textLower.includes('control uday')
    ) {
      return ['control_uday_control', 'baburao_style'];
    }

    // 3. Schedule conflict / overlap detected
    if (
      type === 'schedule_conflict' ||
      context.hasConflicts ||
      textLower.includes('clash') ||
      textLower.includes('conflict') ||
      textLower.includes('overlap') ||
      textLower.includes('rasode')
    ) {
      return ['rasode_mein_kaun_tha', 'gajab_beizzati_hai'];
    }

    // 4. Overdue tasks / blatant procrastination
    if (
      type === 'overdue_task' ||
      type === 'procrastination' ||
      (context.overdueCount && context.overdueCount > 0) ||
      textLower.includes('overdue') ||
      textLower.includes('kal karenge') ||
      textLower.includes('vinod')
    ) {
      return ['vinod_dekh_raha_hai', 'moye_moye'];
    }

    // 5. Coding bugs, compiler errors, debugging frustration
    if (
      type === 'coding_struggle' ||
      textLower.includes('bug') ||
      textLower.includes('compiler') ||
      textLower.includes('syntax error') ||
      textLower.includes('code') ||
      textLower.includes('kolaveri')
    ) {
      return ['why_this_kolaveri_di', 'moye_moye'];
    }

    // 6. Distraction / rabbit holes / watching reels
    if (
      type === 'distraction_rabbit_hole' ||
      textLower.includes('reels') ||
      textLower.includes('youtube') ||
      textLower.includes('distracted') ||
      textLower.includes('jcb')
    ) {
      return ['jcb_ki_khudai', 'vinod_dekh_raha_hai'];
    }

    // 7. Unexpected setback / tough quiz / missed target
    if (
      type === 'unexpected_setback' ||
      textLower.includes('moye moye') ||
      textLower.includes('missed') ||
      textLower.includes('tough')
    ) {
      return ['moye_moye', 'gajab_beizzati_hai'];
    }

    // 8. Sequencing / chronological dependencies
    if (
      type === 'prerequisite_ordering' ||
      textLower.includes('chronology') ||
      textLower.includes('prerequisite') ||
      textLower.includes('sequence')
    ) {
      return ['aap_chronology_samajhiye'];
    }

    // 9. Ambitious projects / hackathons
    if (
      type === 'ambitious_goal' ||
      textLower.includes('hackathon') ||
      textLower.includes('big project') ||
      textLower.includes('scam')
    ) {
      return ['risk_hai_toh_ishq_hai'];
    }

    // 10. Early morning rush / sudden viva
    if (
      type === 'early_morning_rush' ||
      textLower.includes('8 am') ||
      textLower.includes('viva') ||
      textLower.includes('baburao')
    ) {
      return ['baburao_style', 'gajab_beizzati_hai'];
    }

    // 11. Minimalist or mystery non-sequitur input
    if (
      type === 'mystery_input' ||
      textLower.trim() === 'binod'
    ) {
      return ['binod_raw'];
    }

    // Default fallback list
    return ['vinod_dekh_raha_hai', 'control_uday_control', 'pawri_ho_rahi_hai'];
  }

  /**
   * Composes a tailored, purely textual reaction combining the meme phrase,
   * user context, and an actionable productivity next step.
   * STRICTLY TEXT-BASED — ZERO HARD-CODED IMAGES.
   */
  private composeReactionText(
    meme: MemeReference,
    context: UserActivityContext,
    mode: 'college_friend' | 'full_desi'
  ): string {
    const userGreeting = context.userName ? `${context.userName}, ` : '';
    const taskMention = context.taskTitle ? ` on "${context.taskTitle}"` : '';

    if (mode === 'full_desi') {
      return `${meme.samplePhrases.punchline}`;
    }

    // Default 'college_friend' mode: conversational lead-in + punchline tip
    return `[${meme.memeName}] ${meme.samplePhrases.leadIn} ${userGreeting}${meme.samplePhrases.punchline}${taskMention}`;
  }
}

// Export singleton instance for seamless import across client and server
export const memeManager = new MemeManager();
