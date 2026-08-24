import React from 'react';

// Friendly, high-quality SVGs with Tailwind styles for the Pulse design system

export const KairoCompanion: React.FC<{ size?: number; expression?: 'happy' | 'thinking' | 'calm' }> = ({
  size = 120,
  expression = 'calm'
}) => {
  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
      {/* Soft background aura */}
      <div className="absolute inset-0 bg-amber-100/40 rounded-full blur-xl animate-breathe" />
      
      {/* Friendly cloud-like character with gentle animations */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative animate-float"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="110" rx="30" ry="6" fill="#1e1b18" fillOpacity="0.06" />
        
        {/* Main Body */}
        <path
          d="M60 20C38 20 25 35 25 55C25 72 35 85 50 90C53 91 57 92 60 92C63 92 67 91 70 90C85 85 95 72 95 55C95 35 82 20 60 20Z"
          fill="#FFFBF2"
          stroke="#E6DFD3"
          strokeWidth="3"
        />
        
        {/* Cute Ears/Nodes */}
        <circle cx="28" cy="45" r="8" fill="#FFFBF2" stroke="#E6DFD3" strokeWidth="3" />
        <circle cx="92" cy="45" r="8" fill="#FFFBF2" stroke="#E6DFD3" strokeWidth="3" />
        <circle cx="28" cy="45" r="6" fill="#FFEDE0" />
        <circle cx="92" cy="45" r="6" fill="#FFEDE0" />

        {/* Inner glow or soft color */}
        <path
          d="M60 25C42 25 30 38 30 55C30 58 31 62 33 65C35 52 48 40 60 40C72 40 85 52 87 65C89 62 90 58 90 55C90 38 78 25 60 25Z"
          fill="#FFFDF9"
        />

        {/* Cheeks */}
        <circle cx="42" cy="64" r="5" fill="#FFC5A1" fillOpacity="0.7" />
        <circle cx="78" cy="64" r="5" fill="#FFC5A1" fillOpacity="0.7" />

        {/* Eyes & Mouth depending on expression */}
        {expression === 'calm' && (
          <>
            {/* Sleeping/Calm eyes */}
            <path d="M38 56C40 58 44 58 46 56" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M74 56C76 58 80 58 82 56" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
            {/* Gentle Smile */}
            <path d="M57 68C59 69.5 61 69.5 63 68" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {expression === 'happy' && (
          <>
            {/* Happy arch eyes */}
            <path d="M38 58C40 55 44 55 46 58" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M74 58C76 55 80 55 82 58" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
            {/* Happy open mouth */}
            <path d="M55 66C55 71 65 71 65 66H55Z" fill="#D36662" stroke="#4A3E3D" strokeWidth="2.5" strokeLinejoin="round" />
          </>
        )}

        {expression === 'thinking' && (
          <>
            {/* Curious eyes */}
            <circle cx="42" cy="56" r="3" fill="#4A3E3D" />
            <circle cx="78" cy="56" r="3" fill="#4A3E3D" />
            {/* Thinking brow */}
            <path d="M38 49C41 48 44 50 45 52" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
            {/* Thinking wiggle mouth */}
            <path d="M56 68C58 66 60 69 62 67" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};

export const OnboardingIllustration: React.FC = () => {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      {/* Background soft sun */}
      <circle cx="200" cy="110" r="70" fill="#FFF4EB" />
      <circle cx="200" cy="110" r="50" fill="#FFE8D6" />

      {/* Scattered floating nodes of commitments (Calendar, Mail, Bills) */}
      {/* Calendar Node */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <rect x="80" y="50" width="45" height="40" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.03))" />
        <rect x="80" y="50" width="45" height="12" rx="4" fill="#E87D75" />
        <circle cx="93" cy="56" r="2" fill="#FFFFFF" />
        <circle cx="112" cy="56" r="2" fill="#FFFFFF" />
        <rect x="88" y="70" width="29" height="12" rx="2" fill="#F4F1ED" />
      </g>

      {/* Bill / Invoice Node */}
      <g className="animate-float" style={{ animationDelay: '1.2s' }}>
        <rect x="260" y="40" width="40" height="50" rx="6" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.03))" />
        <line x1="268" y1="52" x2="292" y2="52" stroke="#68C3A3" strokeWidth="3" strokeLinecap="round" />
        <line x1="268" y1="62" x2="284" y2="62" stroke="#E6DFD3" strokeWidth="2" />
        <line x1="268" y1="70" x2="290" y2="70" stroke="#E6DFD3" strokeWidth="2" />
        <circle cx="286" cy="80" r="3" fill="#68C3A3" />
      </g>

      {/* Chat/Alert Node */}
      <g className="animate-float" style={{ animationDelay: '1.8s' }}>
        <rect x="290" y="130" width="50" height="30" rx="10" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.03))" />
        <circle cx="305" cy="145" r="4" fill="#9CC5FF" />
        <rect x="315" y="142" width="18" height="6" rx="2" fill="#F4F1ED" />
      </g>

      {/* Pulse Centerpiece (Life Inbox Portal) */}
      <g>
        <rect x="150" y="120" width="100" height="70" rx="16" fill="#1e1b18" />
        {/* Soft UI details */}
        <rect x="160" y="135" width="80" height="6" rx="3" fill="#E6DFD3" fillOpacity="0.2" />
        <rect x="160" y="148" width="50" height="6" rx="3" fill="#E6DFD3" fillOpacity="0.2" />
        <rect x="160" y="165" width="80" height="14" rx="4" fill="#FFC5A1" />
        <text x="200" y="175" fill="#1e1b18" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PULSE</text>
      </g>

      {/* Pulse Waves */}
      <path d="M120 155 Q135 125 150 155" stroke="#FFC5A1" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
      <path d="M250 155 Q265 185 280 155" stroke="#9CC5FF" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
    </svg>
  );
};

export const EmptyStateIllustration: React.FC<{ type?: 'feed' | 'plan' | 'timer' }> = ({ type = 'feed' }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        {/* Background Soft Glow */}
        <circle cx="90" cy="70" r="45" fill="#FFF7ED" />
        
        {type === 'feed' && (
          <>
            {/* Calm floating landscape */}
            <path d="M40 85C60 85 70 75 90 75C110 75 120 85 140 85C150 85 155 80 160 85" stroke="#E6DFD3" strokeWidth="3" strokeLinecap="round" />
            <circle cx="90" cy="50" r="10" fill="#FFEDE0" />
            {/* Stars */}
            <path d="M60 40 L62 44 L66 45 L62 46 L60 50 L58 46 L54 45 L58 44 Z" fill="#FFC5A1" />
            <path d="M125 45 L126.5 48 L129.5 48.5 L127 49.5 L125 52 L124 49.5 L121 48.5 L124 48 Z" fill="#9CC5FF" />
            {/* Relaxing tea cup */}
            <rect x="80" y="73" width="20" height="14" rx="4" fill="#FFFFFF" stroke="#E6DFD3" strokeWidth="2" />
            <path d="M100 76 C103 76 103 82 100 82" stroke="#E6DFD3" strokeWidth="2" fill="none" />
            {/* Calm steam */}
            <path d="M85 67 Q88 62 85 58" stroke="#FFC5A1" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M95 68 Q92 63 95 59" stroke="#FFC5A1" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}

        {type === 'plan' && (
          <>
            {/* Dynamic Day Planning Visual */}
            <rect x="60" y="35" width="60" height="75" rx="8" fill="#FFFFFF" stroke="#E6DFD3" strokeWidth="2" />
            <rect x="70" y="50" width="40" height="6" rx="3" fill="#F4F1ED" />
            <rect x="70" y="62" width="28" height="6" rx="3" fill="#F4F1ED" />
            <rect x="70" y="74" width="35" height="6" rx="3" fill="#F4F1ED" />
            
            {/* Calm Sun */}
            <circle cx="120" cy="45" r="12" fill="#FFEAA5" />
            
            {/* Cute Pin/Check */}
            <circle cx="60" cy="65" r="7" fill="#68C3A3" />
            <path d="M57 65 L59 67 L63 63" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {type === 'timer' && (
          <>
            {/* Sandglass/Timer calm visual */}
            <circle cx="90" cy="70" r="28" stroke="#E6DFD3" strokeWidth="3" fill="#FFFFFF" />
            <path d="M90 52 L90 70 L102 70" stroke="#FFC5A1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="90" cy="70" r="3" fill="#1e1b18" />
            
            {/* Flying leaves representing focus */}
            <path d="M50 55 C55 50 65 55 60 60 C55 65 45 60 50 55 Z" fill="#68C3A3" opacity="0.6" />
            <path d="M125 80 C130 75 140 80 135 85 C130 90 120 85 125 80 Z" fill="#68C3A3" opacity="0.4" />
          </>
        )}
      </svg>
    </div>
  );
};
