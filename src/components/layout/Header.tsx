import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { Search, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setIsCommandPaletteOpen,
    setCurrentView
  } = usePulse();

  const viewBreadcrumbs: Record<string, { label: string; placeholder: string }> = {
    home: {
      label: 'Home',
      placeholder: 'Search commitments, goals, or resources...'
    },
    academics: {
      label: 'Academics',
      placeholder: 'Search subjects, topics, notes, or resources...'
    },
    commitments: {
      label: 'Commitments',
      placeholder: 'Search commitments...'
    },
    planner: {
      label: 'Planner',
      placeholder: 'Search commitments, subjects, or time blocks...'
    },
    goals: {
      label: 'Goals',
      placeholder: 'Search goals, milestones, or linked commitments...'
    },
    focus: {
      label: 'Focus Studio',
      placeholder: 'Search focus tasks, ambient audio...'
    },
    kairo: {
      label: 'Kairo (AI)',
      placeholder: 'Ask Kairo for guidance or actions...'
    },
    resources: {
      label: 'Resources',
      placeholder: 'Search notes, question papers, cheat sheets...'
    },
    settings: {
      label: 'Settings',
      placeholder: 'Search preferences, API keys, exports...'
    }
  };

  const currentInfo = viewBreadcrumbs[currentView] || viewBreadcrumbs.home;

  return (
    <header className="h-16 px-6 lg:px-8 py-3 bg-[#F4EFE6] flex items-center justify-between gap-4 sticky top-0 z-30 flex-shrink-0">
      {/* Breadcrumb matching screenshots: • PULSE / [Page] */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#58615A] min-w-[150px]">
        <span className="w-2 h-2 rounded-full bg-[#1E3A2B]" />
        <span className="uppercase tracking-widest font-mono text-[11px] font-bold text-[#1E2621]">
          PULSE
        </span>
        <span className="text-[#A4AAA6]">/</span>
        <span className="text-[#1E2621] font-sans font-bold">{currentInfo.label}</span>
      </div>

      {/* Centered Search Bar matching screenshots */}
      <div className="flex-1 max-w-xl mx-auto">
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FEFDF9] border border-[#E3DDD0] text-[#7A837C] hover:border-[#C5BCAC] cursor-pointer shadow-2xs transition-all group"
        >
          <Search className="w-4 h-4 text-[#8C958E] group-hover:text-[#1E3A2B] transition-colors" />
          <span className="text-xs font-normal text-[#7A837C] truncate">
            {currentInfo.placeholder}
          </span>
        </div>
      </div>

      {/* Right Actions: Notification Bell + Avatar Circle 'S' */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 rounded-full hover:bg-[#EAE4D7] text-[#4A534C] transition-colors relative"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D46247]" />
        </button>

        <div
          onClick={() => setCurrentView('settings')}
          className="w-8 h-8 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs hover:ring-2 hover:ring-[#1E3A2B]/20 transition-all font-sans"
          title="Student Settings"
        >
          S
        </div>
      </div>
    </header>
  );
};