import React, { useState } from 'react';
import { PulseProvider, usePulse } from './context/PulseContext';
import { Companion } from './components/Companion';
import { CommitmentsFeed } from './components/CommitmentsFeed';
import { LifeInbox } from './components/LifeInbox';
import { PlanMyDay } from './components/PlanMyDay';
import { FocusTimer } from './components/FocusTimer';
import { CalendarView } from './components/CalendarView';
import { InsightsView } from './components/InsightsView';
import { 
  Inbox, Sparkles, Clock, Calendar as CalendarIcon, 
  BarChart2, RefreshCw, Zap, Heart, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'inbox' | 'plan' | 'timer' | 'calendar' | 'insights';

function PulseApp() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const { state, resetAllData } = usePulse();

  const handleReset = () => {
    if (confirm("Reset demo commitments and logs back to fresh states?")) {
      resetAllData();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1B] flex flex-col selection:bg-[#7C9070]/20">
      
      {/* Premium Top Navigation Bar */}
      <header className="border-b border-[#EBE9E0] bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7C9070] flex items-center justify-center text-white shadow-md shadow-[#7C9070]/10 relative overflow-hidden">
              <span className="font-display font-black text-sm select-none">P</span>
              {/* Pulsing ring */}
              <span className="absolute inset-0 border border-white rounded-full scale-75 animate-ping opacity-30" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight leading-none text-[#1A1A1B]">
                Pulse
              </h1>
              <span className="text-[9px] font-mono font-bold text-[#1A1A1B]/40 block tracking-wider uppercase">
                Life Inbox
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4">
            {/* Active streak */}
            <div className="flex items-center gap-1 text-xs font-semibold bg-[#7C9070]/10 text-[#7C9070] px-3 py-1 rounded-full border border-[#7C9070]/20">
              <Zap className="w-3.5 h-3.5 text-[#7C9070] fill-[#7C9070]/10" />
              <span>{state.streakDays}d Streak</span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 border border-[#EBE9E0] p-1 pr-3 rounded-full bg-[#F5F1E9]">
              <div className="w-6.5 h-6.5 rounded-full bg-[#E5D5C8] border border-[#EBE9E0] flex items-center justify-center text-[10px] font-bold select-none text-[#1A1A1B]/80">
                K
              </div>
              <span className="text-xs font-bold text-[#1A1A1B]/80">
                {state.userName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Calm AI Companion Header Banner */}
        <Companion />

        {/* Dynamic Tab Navigation (Headspace Style Rounded Pills) */}
        <div className="grid grid-cols-5 p-1 bg-[#F5F1E9] border border-[#EBE9E0] rounded-2xl md:max-w-2xl mx-auto">
          {[
            { id: 'inbox', label: 'Life Inbox', icon: <Inbox className="w-4 h-4" /> },
            { id: 'plan', label: 'Plan Day', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'timer', label: 'Focus Clock', icon: <Clock className="w-4 h-4" /> },
            { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
            { id: 'insights', label: 'Insights', icon: <BarChart2 className="w-4 h-4" /> },
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2.5 flex flex-col md:flex-row items-center justify-center gap-1.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#7C9070] shadow-sm border border-[#EBE9E0] font-semibold'
                    : 'text-[#1A1A1B]/60 hover:text-[#7C9070] font-medium'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] md:text-xs font-semibold select-none hidden md:inline">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Frame Content with Micro-Transitions */}
        <div className="bg-white/40 rounded-3xl min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="focus:outline-none"
            >
              {activeTab === 'inbox' && (
                <div className="space-y-8">
                  {/* Smart Imports at the top */}
                  <LifeInbox />
                  
                  {/* Commitments Feed directly underneath so extracted goals are seen immediately! */}
                  <div className="border-t border-[#EBE9E0] pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-[#1A1A1B] text-lg">
                        Active Commitments Feed
                      </h3>
                      <span className="text-xs font-semibold text-[#1A1A1B]/40">
                        {state.commitments.filter(c => !c.completed).length} items remaining
                      </span>
                    </div>
                    <CommitmentsFeed />
                  </div>
                </div>
              )}

              {activeTab === 'plan' && <PlanMyDay />}

              {activeTab === 'timer' && <FocusTimer />}

              {activeTab === 'calendar' && <CalendarView />}

              {activeTab === 'insights' && <InsightsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Aesthetic Footer with Demo resetting utility */}
      <footer className="border-t border-[#EBE9E0] bg-white/50 py-8 text-center space-y-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-[#1A1A1B]/40 text-xs font-medium gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#7C9070] fill-[#7C9070]/10" />
            <span>Pulse: Next-Generation Life Inbox.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 hover:text-[#7C9070] bg-[#FAF9F6] border border-[#EBE9E0] px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              title="Reset presets and mock data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Shield className="w-3.5 h-3.5 text-[#1A1A1B]/40" /> Secure Server-side extraction active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PulseProvider>
      <PulseApp />
    </PulseProvider>
  );
}
