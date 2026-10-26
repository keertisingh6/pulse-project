import React from 'react';

// Friendly student character with pastel lavender hoodie, glasses, calm smile
export const StudentCharacterIllustration: React.FC<{ className?: string }> = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="faceGrad" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FFF0E6" />
        <stop offset="100%" stopColor="#FBD3C1" />
      </radialGradient>
      <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9D85FD" />
        <stop offset="100%" stopColor="#6C47FF" />
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4A3464" />
        <stop offset="100%" stopColor="#2E1D4A" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7C5CFC" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Ambient soft glow aura */}
    <circle cx="80" cy="80" r="72" fill="#F3EEFE" opacity="0.6" />

    {/* Cozy Hoodie Shoulders */}
    <path
      d="M26 142C26 118 48 106 80 106C112 106 134 118 134 142V152H26V142Z"
      fill="url(#hoodieGrad)"
      filter="url(#softShadow)"
    />
    
    {/* Hoodie Collar Strings */}
    <path d="M72 118V134" stroke="#DDD4FE" strokeWidth="3" strokeLinecap="round" />
    <path d="M88 118V134" stroke="#DDD4FE" strokeWidth="3" strokeLinecap="round" />

    {/* Neck */}
    <rect x="72" y="94" width="16" height="16" rx="4" fill="#F7C8B2" />

    {/* Head */}
    <circle cx="80" cy="74" r="32" fill="url(#faceGrad)" filter="url(#softShadow)" />

    {/* Hair back & bangs */}
    <path
      d="M48 72C48 52 62 42 80 42C98 42 112 52 112 72C112 73 110 73 108 68C104 58 92 54 80 54C68 54 56 58 52 68C50 73 48 73 48 72Z"
      fill="url(#hairGrad)"
    />

    {/* Glasses frame */}
    <rect x="58" y="66" width="18" height="14" rx="5" fill="#FFFFFF" fillOpacity="0.4" stroke="#37265B" strokeWidth="2.5" />
    <rect x="84" y="66" width="18" height="14" rx="5" fill="#FFFFFF" fillOpacity="0.4" stroke="#37265B" strokeWidth="2.5" />
    <path d="M76 72H84" stroke="#37265B" strokeWidth="2.5" />

    {/* Happy curved eyes behind glasses */}
    <path d="M63 73C65 71 69 71 71 73" stroke="#2E1D4A" strokeWidth="2" strokeLinecap="round" />
    <path d="M89 73C91 71 95 71 97 73" stroke="#2E1D4A" strokeWidth="2" strokeLinecap="round" />

    {/* Gentle peach blush */}
    <circle cx="58" cy="82" r="4.5" fill="#F87171" opacity="0.35" />
    <circle cx="102" cy="82" r="4.5" fill="#F87171" opacity="0.35" />

    {/* Gentle calm smile */}
    <path d="M75 84C77 87 83 87 85 84" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Potted desk monstera plant
export const PlantIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FB923C" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#22C55E" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="50" cy="86" rx="28" ry="6" fill="#E2E8F0" />
    {/* Pot */}
    <path d="M34 54L38 82C38.5 85 41 87 44 87H56C59 87 61.5 85 62 82L66 54H34Z" fill="url(#potGrad)" />
    <rect x="32" y="50" width="36" height="7" rx="3.5" fill="#FDBA74" />
    {/* Leaves */}
    <path d="M50 50C48 34 32 26 26 32C22 38 34 50 48 50Z" fill="url(#leafGrad)" />
    <path d="M52 48C56 32 72 24 76 30C80 36 68 48 52 48Z" fill="#4ADE80" />
    <path d="M50 48C50 24 40 14 50 10C60 14 50 30 50 48Z" fill="#16A34A" />
  </svg>
);

// Cozy Ceramic Mug with gentle steam
export const MugIllustration: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DDD6FE" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="48" cy="84" rx="24" ry="5" fill="#E2E8F0" />
    {/* Mug Body */}
    <rect x="28" y="44" width="40" height="38" rx="8" fill="url(#mugGrad)" />
    {/* Mug Handle */}
    <path d="M68 50C77 50 82 56 82 63C82 70 77 74 68 74" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
    {/* Steam curls */}
    <path d="M40 34C38 28 42 22 40 16" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M48 32C46 26 50 20 48 14" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M56 34C54 28 58 22 56 16" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

// Soft 3D Star
export const StarIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path
      d="M50 12L61 36L86 39L67 56L72 82L50 69L28 82L33 56L14 39L39 36L50 12Z"
      fill="url(#starGrad)"
      stroke="#FCD34D"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="46" r="6" fill="#FFFBEB" opacity="0.6" />
  </svg>
);

// Soft Glowing Lightbulb
export const LightbulbIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="bulbGrad" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FBBF24" />
      </radialGradient>
    </defs>
    {/* Glow rays */}
    <path d="M50 10V18" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
    <path d="M22 26L28 32" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
    <path d="M78 26L72 32" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
    {/* Glass bulb */}
    <path d="M35 48C35 37 42 30 50 30C58 30 65 37 65 48C65 56 60 60 58 65H42C40 60 35 56 35 48Z" fill="url(#bulbGrad)" />
    {/* Base */}
    <rect x="43" y="67" width="14" height="4" rx="2" fill="#94A3B8" />
    <rect x="45" y="73" width="10" height="4" rx="2" fill="#64748B" />
  </svg>
);

// Focus Clock / Stopwatch
export const FocusClockIllustration: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="85" rx="26" ry="5" fill="#E2E8F0" />
    {/* Bell legs */}
    <rect x="32" y="72" width="6" height="12" rx="3" transform="rotate(20 32 72)" fill="#0284C7" />
    <rect x="62" y="74" width="6" height="12" rx="3" transform="rotate(-20 62 74)" fill="#0284C7" />
    {/* Face */}
    <circle cx="50" cy="50" r="32" fill="#FFFFFF" stroke="url(#clockGrad)" strokeWidth="6" />
    {/* Inner ring */}
    <circle cx="50" cy="50" r="26" fill="#F0F9FF" />
    {/* Hands */}
    <path d="M50 50V34" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 50L62 50" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="50" r="3.5" fill="#0369A1" />
  </svg>
);

// Milestone Rocket
export const RocketIllustration: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="rocketFlame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    {/* Flame */}
    <path d="M50 72C46 72 44 86 50 92C56 86 54 72 50 72Z" fill="url(#rocketFlame)" />
    {/* Fins */}
    <path d="M34 62C24 68 28 78 28 78L40 70Z" fill="#F43F5E" />
    <path d="M66 62C76 68 72 78 72 78L60 70Z" fill="#F43F5E" />
    {/* Body */}
    <path d="M50 18C38 32 36 60 40 70H60C64 60 62 32 50 18Z" fill="url(#rocketBody)" stroke="#CBD5E1" strokeWidth="2" />
    {/* Nose cone */}
    <path d="M50 18C44 25 43 32 43 32H57C57 32 56 25 50 18Z" fill="#7C5CFC" />
    {/* Porthole */}
    <circle cx="50" cy="44" r="7" fill="#67E8F9" stroke="#0284C7" strokeWidth="2.5" />
  </svg>
);
