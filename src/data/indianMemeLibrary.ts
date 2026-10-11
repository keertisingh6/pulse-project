export interface MemeReference {
  id: string;
  memeName: string;
  origin: string;
  commonMeaning: string;
  suitableSituations: string[];
  unsuitableSituations: string[];
  tone: 'sarcastic' | 'celebratory' | 'deadpan' | 'calming' | 'playful' | 'relatable' | 'dramatic';
  languageStyle: 'hinglish' | 'tanglish' | 'english_with_desi_flavor';
  intensity: 'subtle' | 'medium' | 'high';
  cooldownMinutes: number;
  allowedInChat: boolean;
  allowedInUiMicrocopy: boolean;
  samplePhrases: {
    leadIn: string;
    punchline: string;
    microcopy: string;
  };
  triggerTags: string[];
  forbiddenKeywords: string[];
}

export const INDIAN_MEME_LIBRARY: MemeReference[] = [
  {
    id: 'vinod_dekh_raha_hai',
    memeName: 'Dekh Raha Hai Vinod',
    origin: 'Panchayat TV Series (Bhushan alias Banrakas observing village absurdities with Vinod)',
    commonMeaning: 'Pointed, dry observation of someone making questionable choices or blatantly ignoring reality while pretending everything is fine.',
    suitableSituations: [
      'Procrastination and deadline avoidance',
      'Suspicious scheduling decisions (e.g. leaving 6 assignments for 11 PM)',
      'Questionable planning or scheduling 4 back-to-back heavy sprints',
      'Observing the user\'s increasingly chaotic, last-minute timetable',
      'Ignoring an overdue commitment while creating new leisure plans'
    ],
    unsuitableSituations: [
      'Serious academic distress or failing penalties',
      'Medical emergencies or genuine mental burnout',
      'Actual grief or personal family emergencies',
      'Direct, time-critical navigation queries'
    ],
    tone: 'sarcastic',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 15,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Dekh raha hai Vinod...',
      punchline: 'Dekh raha hai Vinod, kaise deadline kal subah hai aur hum naya playlist bana rahe hain. Chalo pehle top assignment niptaate hain.',
      microcopy: 'Dekh raha hai Vinod... 3 deadlines pending hain.'
    },
    triggerTags: ['procrastination', 'overdue', 'avoidance', 'last_minute', 'suspicious_plan', 'delaying'],
    forbiddenKeywords: ['panic', 'depressed', 'anxious', 'emergency', 'hospital', 'fail']
  },
  {
    id: 'binod_raw',
    memeName: 'Binod',
    origin: 'Viral YouTube comment section phenomenon highlighted by Slayy Point in 2020',
    commonMeaning: 'The ultimate deadpan, minimalist internet non-sequitur. Absurdity distilled into a single ubiquitous name.',
    suitableSituations: [
      'Absurd or bizarre input formats',
      'Unexpected or nonsensical OCR extraction outputs',
      'Harmless UI surprises or blank mystery queries',
      'Lighthearted system easter eggs'
    ],
    unsuitableSituations: [
      'Never use simply because the user\'s name or college has the letters Binod/Vinod',
      'High-stress deadline days',
      'Structured academic planning',
      'Direct factual scheduling queries'
    ],
    tone: 'deadpan',
    languageStyle: 'hinglish',
    intensity: 'subtle',
    cooldownMinutes: 60,
    allowedInChat: true,
    allowedInUiMicrocopy: false,
    samplePhrases: {
      leadIn: 'Binod.',
      punchline: 'Document dropped with zero text and zero context. In the words of our ancestors: "Binod." Let\'s add a title so we can actually track it.',
      microcopy: 'Binod.'
    },
    triggerTags: ['absurd_input', 'empty_drop', 'random_query', 'mystery_upload'],
    forbiddenKeywords: ['serious', 'help', 'exam', 'deadline', 'urgent', 'priority']
  },
  {
    id: 'rasode_mein_kaun_tha',
    memeName: 'Rasode Mein Kaun Tha',
    origin: 'Saath Nibhaana Saathiya dialogue remixed into a viral track by Yashraj Mukhate (2020)',
    commonMeaning: 'Dramatic interrogation seeking to identify who is responsible for an unexpected disaster or uninvited mess.',
    suitableSituations: [
      'Finding the source of an unexpected scheduling conflict',
      'Identifying which course announcement spawned conflicting deadlines',
      'Discovering where an unassigned 3-hour commitment came from',
      '"Who put this task on Sunday 7 AM?" schedule collisions'
    ],
    unsuitableSituations: [
      'Personal user blame or accusing the student harshly',
      'Serious missed exam consequences',
      'Emotional exhaustion'
    ],
    tone: 'dramatic',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 20,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Rasode mein kaun tha?',
      punchline: 'Rasode mein kaun tha? Found two conflicting slots booked at 4:00 PM. Let\'s see which one actually takes priority.',
      microcopy: 'Schedule clash detected: Rasode mein kaun tha?'
    },
    triggerTags: ['conflict', 'overlap', 'mystery_task', 'who_scheduled', 'clash'],
    forbiddenKeywords: ['crying', 'failed', 'depressed', 'scared', 'breakdown']
  },
  {
    id: 'pawri_ho_rahi_hai',
    memeName: 'Pawri Ho Rahi Hai',
    origin: 'Viral Pakistani video trend by Dananeer Mobeen that swept Indian social media in 2021',
    commonMeaning: 'Unapologetic celebration of living in the moment and partying with the gang after pulling something off.',
    suitableSituations: [
      'Completing a major semester goal or milestone',
      'Finishing a heavy assignment or tough submission',
      'Completing 100% of the daily plan items for the day',
      'Reaching important streak milestones (e.g. 5 days, 7 days, 14 days)',
      'Finishing all active exams on the calendar'
    ],
    unsuitableSituations: [
      'Ongoing unresolved backlog',
      'Single minor 5-minute task ticks (do not dilute the meme)',
      'When user is stressed about an impending test tomorrow'
    ],
    tone: 'celebratory',
    languageStyle: 'hinglish',
    intensity: 'high',
    cooldownMinutes: 30,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Pawri ho rahi hai! 🎉',
      punchline: 'Yeh humara laptop hai, yeh Pulse hai, aur yahan aaj ke saare targets finish hoke pawri ho rahi hai! Take a well-earned break.',
      microcopy: 'All tasks crushed today — pawri ho rahi hai!'
    },
    triggerTags: ['goal_completed', 'daily_plan_done', 'streak_milestone', 'exam_cleared', 'all_done'],
    forbiddenKeywords: ['pending', 'stressed', 'failed', 'incomplete']
  },
  {
    id: 'moye_moye',
    memeName: 'Moye Moye',
    origin: 'Viral social-media trend adapting Serbian singer Teya Dora\'s song Džanum ("Moye More") for comic tragedy',
    commonMeaning: 'Dramatic, sorrowful slow-motion music played when an unexpected minor loss, blunder, or reality check strikes.',
    suitableSituations: [
      'Missed deadlines or overdue items with lighthearted accountability',
      'Failed ambitious plans (e.g. tried to do 10 chapters in 2 hours)',
      'Unexpectedly difficult assignment difficulty',
      'Humorous minor academic setbacks that need a compassionate reset'
    ],
    unsuitableSituations: [
      'Genuine academic crisis, expulsion risks, or semester failure',
      'Real emotional grief, panic, or clinical anxiety',
      'Serious family/personal difficulties'
    ],
    tone: 'relatable',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 25,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Moye Moye background music intensifies...',
      punchline: 'Moye Moye moment: That 30-minute quick lab turned out to be a 4-hour ordeal. No worries, let\'s reschedule the remaining tasks calmly.',
      microcopy: 'Overdue task: Moye Moye averted if we start now.'
    },
    triggerTags: ['overdue_task', 'missed_deadline', 'unrealistic_failure', 'minor_setback', 'tough_lab'],
    forbiddenKeywords: ['suicide', 'hopeless', 'depression', 'severe', 'medical']
  },
  {
    id: 'jcb_ki_khudai',
    memeName: 'JCB Ki Khudai',
    origin: 'Iconic Indian internet trend where millions of netizens gathered to watch JCB excavation videos for hours',
    commonMeaning: 'Getting mesmerized by totally irrelevant rabbit holes and procrastination spectacles instead of doing actual urgent work.',
    suitableSituations: [
      'Wandering off into unproductive rabbit holes',
      'Opening random browser tabs during dedicated focus hours',
      'Putting off an assignment to reorganize files or clean desk for 2 hours',
      'Detecting heavy procrastination during study hours'
    ],
    unsuitableSituations: [
      'Legitimate research on academic topics',
      'Planned relaxation intervals / mindful coffee breaks',
      'Physical illness or exhaustion'
    ],
    tone: 'playful',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 20,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'JCB ki khudai band karo!',
      punchline: 'Bhai, JCB ki khudai dekhna band karo aur focus timer chalu karo. 25 minute ka sprint lagao, assignment khud solve ho jayega.',
      microcopy: 'Stop watching JCB ki khudai — start your 25m focus sprint.'
    },
    triggerTags: ['rabbit_hole', 'distracted', 'procrastinating', 'wandering', 'avoiding_work'],
    forbiddenKeywords: ['depressed', 'anxious', 'sick', 'emergency']
  },
  {
    id: 'control_uday_control',
    memeName: 'Control Uday Control',
    origin: 'Welcome movie (2007) — Nana Patekar as Uday Shetty trying to calm down his furious impulses',
    commonMeaning: 'Telling someone (or oneself) to rein in unfeasible ambition, slow down, and not blow up the system with excessive load.',
    suitableSituations: [
      'Overloaded daily plans (e.g. attempting 10+ commitments or >9 hours in a day)',
      'Planning unrealistic marathon study sessions with zero breaks',
      'Panic cramming where the user adds 6 new tasks in 5 minutes',
      'Preventing burn-out when the student tries to do an entire semester in one night'
    ],
    unsuitableSituations: [
      'Balanced or light schedules (<4 hours)',
      'When the student has barely any tasks planned',
      'When student is asking for high-intensity motivational support'
    ],
    tone: 'calming',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 15,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Control Uday, control!',
      punchline: 'Control Uday, control! You just scheduled 11 hours of intense work into an 8-hour window. Let\'s trim the lower-priority items before your brain crashes.',
      microcopy: 'Overloaded schedule detected: Control Uday control.'
    },
    triggerTags: ['overloaded', 'too_many_tasks', 'unrealistic_hours', 'cramming', 'burnout_risk'],
    forbiddenKeywords: ['panic_attack', 'medical', 'breakdown']
  },
  {
    id: 'why_this_kolaveri_di',
    memeName: 'Why This Kolaveri Di',
    origin: 'Viral Tanglish anthem by Dhanush & Anirudh Ravichander (3 movie promo in 2011)',
    commonMeaning: 'Comical, heartfelt venting over relentless, inexplicable difficulty, debugging horrors, or cruel assignment questions.',
    suitableSituations: [
      'Frustration with coding errors, compiler crashes, or bug loops',
      'Difficult engineering / math problem sets that make no sense',
      'Repeated failed test cases or quiz attempts',
      'Exasperation with confusing professor rubrics'
    ],
    unsuitableSituations: [
      'Interpersonal aggression or hostility towards classmates/faculty',
      'Real personal depression or hopelessness',
      'Simple straightforward questions'
    ],
    tone: 'relatable',
    languageStyle: 'tanglish',
    intensity: 'medium',
    cooldownMinutes: 25,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Why this Kolaveri Di?',
      punchline: 'Why this Kolaveri Di with this compiler bug? Take a 5-minute chai break, look at the error log with fresh eyes, and let\'s debug it step by step.',
      microcopy: 'Tricky bug? Why this Kolaveri Di — take a 5m breather.'
    },
    triggerTags: ['coding_error', 'compiler_fail', 'frustration', 'difficult_assignment', 'bug_loop'],
    forbiddenKeywords: ['hate', 'violence', 'suicide', 'self_harm']
  },
  {
    id: 'gajab_beizzati_hai',
    memeName: 'Gajab Beizzati Hai',
    origin: 'Panchayat TV Series Season 1 — Pradhan Ji\'s guest reacting to an unexpected slight',
    commonMeaning: 'Hilarious disbelief when an easy expectation turns into an embarrassing surprise or forgotten chore.',
    suitableSituations: [
      'Forgetting an assignment that was announced 3 weeks ago',
      'Scoring lower on an "easy" quiz than expected',
      'Finding out tomorrow\'s class is at 8:00 AM after planning a late night'
    ],
    unsuitableSituations: [
      'Serious academic probation or failing out',
      'Sensitive user moments'
    ],
    tone: 'sarcastic',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 20,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Gajab beizzati hai yaar!',
      punchline: 'Gajab beizzati hai: Syllabus bol raha tha "Introductory", aur assignment mein seedha quantum mechanics aa gaya. Let\'s break it into smaller 20-minute chunks.',
      microcopy: 'Surprise deadline: Gajab beizzati hai.'
    },
    triggerTags: ['surprise_deadline', 'forgotten_task', 'tough_surprise'],
    forbiddenKeywords: ['shame', 'depressed', 'crying']
  },
  {
    id: 'aap_chronology_samajhiye',
    memeName: 'Aap Chronology Samajhiye',
    origin: 'Iconic national press address catchphrase regarding chronological steps',
    commonMeaning: 'Emphasizing the strict sequence of events needed to achieve an outcome without jumping steps.',
    suitableSituations: [
      'Sequencing prerequisite study tasks before starting a big project',
      'Ordering assignments logically before final exams begin',
      'Organizing daily timeline when tasks have dependency orders'
    ],
    unsuitableSituations: [
      'Simple single-task days',
      'High stress / panic situations'
    ],
    tone: 'relatable',
    languageStyle: 'hinglish',
    intensity: 'subtle',
    cooldownMinutes: 20,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Aap chronology samajhiye...',
      punchline: 'Aap pehle chronology samajhiye: Pehle lecture notes review honge, phir formulas practice honge, aur uske baad hi previous year papers touch honge.',
      microcopy: 'Timeline planning: Aap chronology samajhiye.'
    },
    triggerTags: ['prerequisites', 'sequence', 'chronology', 'step_by_step', 'ordering'],
    forbiddenKeywords: ['panic', 'overwhelmed']
  },
  {
    id: 'risk_hai_toh_ishq_hai',
    memeName: 'Risk Hai Toh Ishq Hai',
    origin: 'Scam 1992 web series — Harshad Mehta dialogue',
    commonMeaning: 'Channeling fearless confidence when tackling ambitious projects, hackathons, or tough exam syllabi.',
    suitableSituations: [
      'Starting an ambitious hackathon or complex semester project',
      'Setting challenging North Star goals',
      'Taking on hard academic subjects with high determination'
    ],
    unsuitableSituations: [
      'Reckless scheduling without sleep',
      'Danger to health or academic safety'
    ],
    tone: 'playful',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 30,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Risk hai toh ishq hai!',
      punchline: 'Harshad Mehta said "Risk hai toh ishq hai", but let\'s manage the risk with an airtight study schedule so we actually win.',
      microcopy: 'Ambitious goal set: Risk hai toh ishq hai!'
    },
    triggerTags: ['ambitious_goal', 'hackathon', 'big_project', 'confidence_boost'],
    forbiddenKeywords: ['failing', 'despair', 'panic']
  },
  {
    id: 'baburao_style',
    memeName: 'Babu Rao / Utha Le Re Baba',
    origin: 'Hera Pheri (2000) — Paresh Rawal as Baburao Ganpatrao Apte',
    commonMeaning: 'Exasperated comic cry when mornings are chaotic, lectures start at dawn, or submissions collide.',
    suitableSituations: [
      'Unscheduled 8:00 AM college lectures after a late night',
      'Chaotic morning timelines',
      'Sudden surprise assignment notifications from professors'
    ],
    unsuitableSituations: [
      'Genuine clinical distress or medical emergencies',
      'Depression or severe burnout'
    ],
    tone: 'dramatic',
    languageStyle: 'hinglish',
    intensity: 'medium',
    cooldownMinutes: 20,
    allowedInChat: true,
    allowedInUiMicrocopy: true,
    samplePhrases: {
      leadIn: 'Utha le re baba!',
      punchline: 'Subah subah 8 baje viva? "Utha le re baba!" But don\'t worry, 30 minute ka quick revision notes review karte hain aur confidence se chalte hain.',
      microcopy: '8 AM class? Babu Rao mode activated.'
    },
    triggerTags: ['early_morning', 'surprise_viva', 'chaotic_morning', 'sudden_notice'],
    forbiddenKeywords: ['death', 'suicide', 'hopeless', 'hospital']
  }
];
