import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { KairoCompanion } from './Illustrations';
import { Sparkles, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Companion: React.FC = () => {
  const { state, updateUserName } = usePulse();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(state.userName);
  const [expression, setExpression] = useState<'calm' | 'happy' | 'thinking'>('calm');

  const pendingCount = state.commitments.filter(c => !c.completed).length;
  const urgentCount = state.commitments.filter(c => !c.completed && c.priority === 'high').length;

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUserName(tempName.trim());
      setIsEditing(false);
      setExpression('happy');
      setTimeout(() => setExpression('calm'), 3000);
    }
  };

  const displayName = state.user?.name || state.userName || 'Friend';

  // Human-friendly contextual messaging from Kairo
  const getGreeting = () => {
    const hours = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hours >= 12 && hours < 17) timeGreeting = "Good afternoon";
    if (hours >= 17) timeGreeting = "Good evening";

    return `${timeGreeting}, ${displayName} 👋`;
  };

  const getCompanionMessage = () => {
    if (pendingCount === 0) {
      return "All quiet! You have zero active commitments. Enjoy this spaciousness, breathe deeply, or check out some books.";
    }

    if (urgentCount > 0) {
      return `You have ${pendingCount} commitments on your list. ${urgentCount} need urgent attention today. Let's tackle them mindfully.`;
    }

    return `You have ${pendingCount} active commitments. None of them are pressing right now. This is a great time to do some calm, steady work.`;
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-[#EBE9E0] shadow-sm relative overflow-hidden" id="companion-panel">
      {/* Absolute top right streak indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#7C9070]/10 text-[#7C9070] px-3.5 py-1.5 rounded-full text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{state.streakDays} Day Streak</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
        {/* Animated Cute Kairo Character */}
        <div 
          className="cursor-pointer bg-[#F5F1E9] rounded-full p-4 border border-[#EBE9E0]/40"
          onClick={() => {
            setExpression(prev => prev === 'calm' ? 'happy' : prev === 'happy' ? 'thinking' : 'calm');
          }}
          title="Click to interact with Kairo!"
        >
          <KairoCompanion size={110} expression={expression} />
        </div>

        {/* Conversation Bubble */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            {isEditing ? (
              <div className="flex items-center gap-1.5 bg-white border border-[#EBE9E0] p-1.5 rounded-xl">
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="font-serif font-light text-lg text-[#1A1A1B] outline-none px-2 py-0.5 w-32 bg-transparent"
                  maxLength={15}
                  autoFocus
                />
                <button 
                  onClick={handleSaveName}
                  className="p-1.5 hover:bg-[#7C9070]/10 text-[#7C9070] rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-light italic text-2xl md:text-3xl text-[#1A1A1B]">
                  {getGreeting()}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setExpression('thinking');
                  }}
                  className="text-[#1A1A1B]/40 hover:text-[#7C9070] p-1.5 transition-colors rounded-lg hover:bg-[#7C9070]/10"
                  title="Rename yourself"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-[#1A1A1B]/70 text-sm md:text-base leading-relaxed max-w-xl italic font-serif">
            "{getCompanionMessage()}"
          </p>

          {/* Prompt tips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="text-[11px] bg-[#FAF9F6] text-[#1A1A1B]/60 border border-[#EBE9E0] px-3 py-1 rounded-full font-medium">
              💡 "Everything can wait if you need to breathe."
            </span>
            <span className="text-[11px] bg-[#FAF9F6] text-[#1A1A1B]/60 border border-[#EBE9E0] px-3 py-1 rounded-full font-medium">
              ✨ Pulse Philosophy: Mindful focus &gt; Busywork
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
