import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePulse, ViewType } from '../../context/PulseContext';
import {
  Search,
  CheckSquare,
  BookOpen,
  Calendar,
  Sparkles,
  Timer,
  Plus,
  ArrowRight,
  Bookmark,
  Target,
  Settings
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Actions' | 'Navigation' | 'Commitments' | 'Courses';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    commitments,
    subjects,
    setIsCommitmentModalOpen,
    startFocusOnTask,
    setIsKairoDrawerOpen
  } = usePulse();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const allItems: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [
      {
        id: 'act-new-commit',
        category: 'Actions',
        title: 'Add Commitment',
        subtitle: 'New assignment, exam, lab or hackathon',
        icon: Plus,
        onSelect: () => setIsCommitmentModalOpen(true)
      },
      {
        id: 'act-focus',
        category: 'Actions',
        title: 'Start Focus Session',
        subtitle: 'Launch Pomodoro timer in Focus Studio',
        icon: Timer,
        onSelect: () => {
          startFocusOnTask();
          setCurrentView('focus');
        }
      },
      {
        id: 'act-ask-kairo',
        category: 'Actions',
        title: 'Ask Kairo (AI)',
        subtitle: 'Contextual recommendations & planning',
        icon: Sparkles,
        onSelect: () => setIsKairoDrawerOpen(true)
      },
      {
        id: 'nav-home',
        category: 'Navigation',
        title: 'Go to Home',
        subtitle: 'Main dashboard & daily focus',
        icon: ArrowRight,
        onSelect: () => setCurrentView('home')
      },
      {
        id: 'nav-commitments',
        category: 'Navigation',
        title: 'Go to Commitments',
        subtitle: 'Assignments, labs, exams & hackathons',
        icon: CheckSquare,
        onSelect: () => setCurrentView('commitments')
      },
      {
        id: 'nav-planner',
        category: 'Navigation',
        title: 'Go to Weekly Planner',
        subtitle: 'Time-blocked calendar view',
        icon: Calendar,
        onSelect: () => setCurrentView('planner')
      },
      {
        id: 'nav-goals',
        category: 'Navigation',
        title: 'Go to Goals',
        subtitle: 'Long term roadmaps & milestones',
        icon: Target,
        onSelect: () => setCurrentView('goals')
      },
      {
        id: 'nav-resources',
        category: 'Navigation',
        title: 'Go to Resources',
        subtitle: 'Study guides & boilerplates',
        icon: Bookmark,
        onSelect: () => setCurrentView('resources')
      }
    ];

    commitments.forEach(c => {
      list.push({
        id: 'com-' + c.id,
        category: 'Commitments',
        title: c.title,
        subtitle: `${c.type} • Due ${c.dueDate} • ${c.estimatedHours}h`,
        icon: CheckSquare,
        onSelect: () => setCurrentView('commitments')
      });
    });

    subjects.forEach(s => {
      list.push({
        id: 'sub-' + s.id,
        category: 'Courses',
        title: `${s.code} - ${s.name}`,
        subtitle: `${s.credits} Credits`,
        icon: BookOpen,
        onSelect: () => setCurrentView('academics')
      });
    });

    return list;
  }, [commitments, subjects, setCurrentView, setIsCommitmentModalOpen, startFocusOnTask, setIsKairoDrawerOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-elevated border border-[#E8E2D5] overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#F2ECE1] gap-3 bg-[#FBF9F5]">
          <Search className="w-5 h-5 text-[#8C958E]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, commitment name, or course..."
            className="flex-1 text-sm font-medium text-[#1E2621] placeholder-[#8C958E] bg-transparent focus:outline-none"
          />
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#EDE9DF] text-[#58615A]">
            ESC
          </span>
        </div>

        <div className="overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={item.id}
                onClick={() => {
                  item.onSelect();
                  setIsCommandPaletteOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                  isSelected ? 'bg-[#EAF4EE] text-[#1E3A2B]' : 'hover:bg-[#FBF9F5] text-[#3E4741]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#1E3A2B] text-white shadow-2xs' : 'bg-[#EDE9DF] text-[#58615A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-[11px] text-[#8C958E] truncate">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#EDE9DF] text-[#58615A] flex-shrink-0">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
