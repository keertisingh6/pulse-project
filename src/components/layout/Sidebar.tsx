import React from 'react';
import { usePulse, ViewType } from '../../context/PulseContext';
import {
  Home,
  BookOpen,
  CheckSquare,
  Calendar,
  Compass,
  Timer,
  Sparkles,
  Bookmark,
  Sprout
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = usePulse();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'commitments', label: 'Commitments', icon: CheckSquare },
    { id: 'planner', label: 'Planner', icon: Calendar, badge: '12' },
    { id: 'goals', label: 'Goals', icon: Compass },
    { id: 'focus', label: 'Focus Studio', icon: Timer },
    { id: 'kairo', label: 'Kairo (AI)', icon: Sparkles },
    { id: 'resources', label: 'Resources', icon: Bookmark },
  ];

  const quoteData: Record<ViewType, { quote: string; type: 'branch' | 'heart-leaves' | 'potted-plant' }> = {
    home: {
      quote: 'Discipline today builds the life you want tomorrow.',
      type: 'branch'
    },
    academics: {
      quote: 'Consistent learning today, freedom tomorrow.',
      type: 'branch'
    },
    commitments: {
      quote: 'A little progress every day adds up to big results.',
      type: 'heart-leaves'
    },
    planner: {
      quote: 'Plan today for a calmer tomorrow.',
      type: 'branch'
    },
    goals: {
      quote: 'Big goals start with small steps.',
      type: 'potted-plant'
    },
    focus: {
      quote: 'Where focus goes, energy flows.',
      type: 'branch'
    },
    kairo: {
      quote: 'Clarity of mind precedes mastery of craft.',
      type: 'branch'
    },
    resources: {
      quote: 'Knowledge shared is knowledge multiplied.',
      type: 'branch'
    },
    settings: {
      quote: 'Simplify your setup, amplify your focus.',
      type: 'branch'
    }
  };

  const currentQuoteItem = quoteData[currentView] || quoteData.home;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#EFECE5] border-r border-[#E0D9CB] flex-shrink-0 select-none overflow-y-auto justify-between p-5">
      {/* Brand & Nav Menu */}
      <div className="space-y-6">
        {/* Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 px-2 pt-1 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1E3A2B] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
            <Sprout className="w-4 h-4 text-[#A8E6CF]" />
          </div>
          <span className="text-xl font-bold font-serif tracking-tight text-[#1E2621]">
            Pulse
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E5DFD4] text-[#1E2621] font-bold shadow-2xs'
                    : 'text-[#58615A] hover:bg-[#EAE4D9] hover:text-[#1E2621]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E3A2B]' : 'text-[#6C766F]'}`} />
                  <span className="font-sans">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDD6C8] text-[#4A534C]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quote Card with exact styling & illustration */}
      <div className="relative p-5 rounded-3xl bg-[#E8E3D8] border border-[#DDD6C8] overflow-hidden space-y-3 shadow-2xs">
        <div className="space-y-1.5 relative z-10">
          <span className="font-serif text-lg text-[#8C7A6B] leading-none block font-normal">
            “
          </span>
          <p className="font-serif italic text-xs text-[#2A342D] leading-relaxed">
            {currentQuoteItem.quote}
          </p>
        </div>

        {/* Botanical Illustration matching screenshot */}
        <div className="flex justify-end pt-1 relative z-10">
          {currentQuoteItem.type === 'potted-plant' ? (
            /* Plant pot on books for Goals view */
            <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
              {/* Stack of books */}
              <rect x="12" y="52" width="40" height="6" rx="1.5" fill="#C5BDB0" />
              <rect x="16" y="47" width="34" height="5" rx="1.5" fill="#A89E8F" />
              {/* Pot */}
              <path d="M24 38L27 47H39L42 38H24Z" fill="#B58E6B" />
              <rect x="23" y="36" width="20" height="3" rx="1" fill="#9C7654" />
              {/* Plant leaves */}
              <path d="M33 36C33 24 22 20 18 24C16 28 24 34 33 36Z" fill="#3D5A45" />
              <path d="M33 36C35 22 46 18 50 22C52 26 44 33 33 36Z" fill="#5E836A" />
              <path d="M33 36C33 18 28 10 33 6C38 10 35 20 33 36Z" fill="#2E4A35" />
            </svg>
          ) : currentQuoteItem.type === 'heart-leaves' ? (
            /* Heart + leaves for Commitments view */
            <div className="flex items-end gap-1.5">
              <span className="text-xs text-[#C59B76] mb-1 font-serif">♡</span>
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <path d="M14 42C14 42 16 30 24 28C32 28 34 42 34 42" stroke="#3D5A45" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 28V12" stroke="#2E4A35" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 20C17 18 14 12 16 8C20 8 23 14 24 20Z" fill="#3D5A45" />
                <path d="M24 16C31 14 34 8 32 4C28 4 25 10 24 16Z" fill="#5E836A" />
              </svg>
            </div>
          ) : (
            /* Standard lush botanical leaves branch */
            <svg viewBox="0 0 54 54" className="w-12 h-12" fill="none">
              <path d="M12 46C20 40 32 30 42 14" stroke="#2E4A35" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 38C18 36 15 30 17 26C21 26 23 32 24 38Z" fill="#3D5A45" />
              <path d="M30 32C36 30 39 24 37 20C33 20 31 26 30 32Z" fill="#5E836A" />
              <path d="M36 26C32 20 32 14 36 10C39 12 38 19 36 26Z" fill="#4E7358" />
              <path d="M42 14C46 16 48 12 48 8C44 8 42 11 42 14Z" fill="#7EA58B" />
            </svg>
          )}
        </div>
      </div>
    </aside>
  );
};