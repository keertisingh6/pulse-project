import React, { useState } from 'react';
import { usePulse, ViewType } from '../../context/PulseContext';
import {
  Home,
  CheckSquare,
  Calendar,
  Compass,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Timer,
  Bookmark,
  Settings
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = usePulse();
  const [isOpen, setIsOpen] = useState(false);

  const mainTabs: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'commitments', label: 'Commitments', icon: CheckSquare },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Compass },
    { id: 'kairo', label: 'Kairo', icon: Sparkles }
  ];

  const drawerItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'academics', label: 'Academics & Syllabus', icon: BookOpen },
    { id: 'focus', label: 'Focus Studio', icon: Timer },
    { id: 'resources', label: 'Resources', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs lg:hidden flex justify-end">
          <div className="w-72 h-full bg-[#EDE9DF] p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D8D1C3]">
                <span className="font-serif font-bold text-[#1E2621] text-lg">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-[#6E7570] hover:bg-[#E2DDCF]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {drawerItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                        isActive
                          ? 'bg-white text-[#1E3A2B] font-bold shadow-2xs'
                          : 'text-[#4A534C] hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8D1C3]">
              <p className="font-serif italic text-xs text-[#6E7570] text-center">
                Pulse — High Agency, Low Guilt
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#EDE9DF]/95 backdrop-blur-md border-t border-[#E0D9CB] px-3 py-2 flex items-center justify-around shadow-lg">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-[#1E3A2B] font-bold' : 'text-[#6E7570] hover:text-[#1E2621]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-white text-[#1E3A2B] shadow-2xs' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#6E7570] hover:text-[#1E2621]"
        >
          <div className="p-1.5 rounded-xl">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
