import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Sparkles, CheckCircle2, Circle, Coffee, Laptop, 
  BookOpen, CreditCard, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { EmptyStateIllustration } from './Illustrations';
import { motion } from 'motion/react';

export const PlanMyDay: React.FC = () => {
  const { state, generateDailyPlan, togglePlanItem, loading } = usePulse();
  const [advice, setAdvice] = useState<string>(
    `Hi ${state.userName}! I've scheduled your commitments into small, gentle cycles of focus and relaxation. Let's make progress together.`
  );

  const activeCommitments = state.commitments.filter(c => !c.completed);
  const planItems = state.dailyPlan;

  const handlePlanClick = async () => {
    await generateDailyPlan();
    // Re-trigger visual feedback
  };

  const getSlotIcon = (type: 'work' | 'study' | 'break' | 'payment') => {
    switch (type) {
      case 'work': return <Laptop className="w-4 h-4 text-purple-500" />;
      case 'study': return <BookOpen className="w-4 h-4 text-sky-500" />;
      case 'break': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSlotColor = (type: 'work' | 'study' | 'break' | 'payment') => {
    switch (type) {
      case 'work': return 'bg-white hover:bg-[#FAF9F6] border-[#EBE9E0]';
      case 'study': return 'bg-white hover:bg-[#FAF9F6] border-[#EBE9E0]';
      case 'break': return 'bg-[#F5F1E9] hover:bg-[#F5F1E9]/80 border-[#EBE9E0]';
      case 'payment': return 'bg-white hover:bg-[#FAF9F6] border-[#EBE9E0]';
      default: return 'bg-white border-[#EBE9E0]';
    }
  };

  return (
    <div className="space-y-6" id="planner-section">
      {/* Advisor card */}
      <div className="bg-[#F5F1E9] border border-[#EBE9E0] rounded-[2rem] p-6 relative overflow-hidden flex flex-col md:flex-row items-start gap-4 shadow-sm">
        <div className="bg-[#7C9070]/10 p-2.5 rounded-2xl text-[#7C9070] shrink-0 mt-1">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#7C9070] block font-serif">Kairo's Dynamic Day Plan</span>
          <p className="text-[#1A1A1B]/70 text-sm md:text-base leading-relaxed italic font-serif">
            "{planItems ? advice : `You have ${activeCommitments.length} pending commitments in your Life Inbox. I can curate a balanced hourly plan for today consisting of focus sprints, tea breaks, and payment cycles. Let me arrange it.`}"
          </p>
        </div>
      </div>

      {!planItems ? (
        // Empty State: Generate Plan Call to Action
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-10 text-center flex flex-col items-center shadow-sm">
          <EmptyStateIllustration type="plan" />
          <h3 className="font-serif font-light text-xl text-[#1A1A1B] mt-4">No plan generated for today yet</h3>
          <p className="text-xs text-[#1A1A1B]/50 max-w-sm mt-1 mb-6">
            Kairo is ready to analyze your active syllabus assignments, client deadlines, and bills to map out an easy, low-stress day.
          </p>
          <button
            onClick={handlePlanClick}
            disabled={loading || activeCommitments.length === 0}
            className="flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] disabled:bg-[#FAF9F6] disabled:text-[#1A1A1B]/30 text-white font-medium px-6 py-3 rounded-2xl text-sm transition-all shadow-md shadow-[#7C9070]/10 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{loading ? "Kairo is planning..." : "Ask Kairo to Plan My Day"}</span>
          </button>
          {activeCommitments.length === 0 && (
            <p className="text-[10px] text-rose-500 mt-2 font-medium">
              ⚠️ Add some commitments in the Life Inbox first!
            </p>
          )}
        </div>
      ) : (
        // Active Timeline Plan
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-semibold text-[#1A1A1B] text-base">Today's Harmonious Cycle</h4>
            <button
              onClick={handlePlanClick}
              disabled={loading}
              className="flex items-center gap-1 text-xs text-[#7C9070] hover:text-[#6c7d61] font-semibold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Plan</span>
            </button>
          </div>

          {/* Timeline Stack */}
          <div className="relative border-l-2 border-[#EBE9E0] ml-4 pl-6 space-y-4 py-2">
            {planItems.map((item, index) => {
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline dot / checkmark */}
                  <div className="absolute -left-[35px] top-1.5 z-10 bg-white p-0.5 rounded-full">
                    <button
                      onClick={() => togglePlanItem(item.id)}
                      className="cursor-pointer text-[#1A1A1B]/20 hover:text-[#7C9070] transition-colors"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#7C9070] fill-[#7C9070]/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#1A1A1B]/20 hover:stroke-[#7C9070] stroke-2" />
                      )}
                    </button>
                  </div>

                  {/* Card content */}
                  <div 
                    onClick={() => togglePlanItem(item.id)}
                    className={`border rounded-[1.5rem] p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${getSlotColor(item.type)} ${
                      item.isCompleted ? 'opacity-55 scale-[0.99] border-[#EBE9E0] shadow-none' : 'shadow-sm border-[#EBE9E0]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Left category icon */}
                      <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EBE9E0] shrink-0 shadow-sm">
                        {getSlotIcon(item.type)}
                      </div>
                      
                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#1A1A1B]/40 block">
                          {item.timeSlot}
                        </span>
                        <h5 className={`font-serif text-sm font-medium text-[#1A1A1B] leading-tight ${
                          item.isCompleted ? 'line-through text-[#1A1A1B]/40' : ''
                        }`}>
                          {item.title}
                        </h5>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#1A1A1B]/40 uppercase tracking-wide">
                        {item.type}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#1A1A1B]/30 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F5F1E9]/60 rounded-2xl border border-[#EBE9E0] text-center">
            <p className="text-[11px] text-[#1A1A1B]/60 font-medium">
              💡 Press any slot to check it off. Complete your daily cycle to increment your <strong>{state.streakDays} Day Focus streak</strong>!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
