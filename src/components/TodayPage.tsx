import React from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Sparkles, CheckCircle2, Circle, Coffee, Laptop, 
  BookOpen, CreditCard, RefreshCw, AlertTriangle, Clock, 
  Calendar, Check, ChevronRight, AlertCircle, ArrowUpRight, Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export const TodayPage: React.FC<{ onNavigateToInbox: () => void }> = ({ onNavigateToInbox }) => {
  const { state, generateDailyPlan, togglePlanItem, loading, toggleCommitment } = usePulse();
  const displayName = state.user?.name || state.userName || 'Student';

  const planItems = state.dailyPlan;
  const activeCommitments = state.commitments.filter(c => !c.completed);
  const urgentCommitments = activeCommitments.filter(c => c.priority === 'high');

  // Dynamic formatted current date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Compute total planned focus minutes vs completed minutes
  const totalPlannedMinutes = planItems 
    ? planItems.reduce((acc, p) => acc + (p.estimatedMinutes || (p.type === 'break' ? 30 : 90)), 0)
    : 0;
  
  const completedMinutes = planItems
    ? planItems
        .filter(p => p.isCompleted)
        .reduce((acc, p) => acc + (p.estimatedMinutes || (p.type === 'break' ? 30 : 90)), 0)
    : 0;

  const remainingMinutes = Math.max(0, totalPlannedMinutes - completedMinutes);

  const getSlotIcon = (type: 'work' | 'study' | 'break' | 'payment') => {
    switch (type) {
      case 'work': return <Laptop className="w-4 h-4 text-sky-600" />;
      case 'study': return <BookOpen className="w-4 h-4 text-[#7C9070]" />;
      case 'break': return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6" id="today-page">
      
      {/* Top Header Card */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-3 py-0.5 rounded-full">
              Today's Execution Timeline
            </span>
            <span className="text-xs text-[#1A1A1B]/40 font-mono">
              {todayFormatted}
            </span>
          </div>

          <h2 className="font-serif font-light text-2xl md:text-3xl text-[#1A1A1B]">
            A realistic, balanced day for <span className="italic font-normal">{displayName}</span>.
          </h2>
          <p className="text-xs text-[#1A1A1B]/60 max-w-lg leading-relaxed">
            Organized chronologically around your {state.profile.dailyAvailableHours}h target window. No artificial cramming; ample buffer for campus transit & deep recovery.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => generateDailyPlan()}
            disabled={loading}
            className="flex items-center gap-2 bg-[#FAF9F6] hover:bg-[#F5F1E9] border border-[#EBE9E0] text-[#1A1A1B] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7C9070] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Re-balancing day...' : 'Re-plan Day'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Hours/Minutes rather than artificial percentages where possible) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 block">
            Time Remaining Today
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#1A1A1B]">
              {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m
            </span>
            <span className="text-xs text-[#1A1A1B]/50">
              of {Math.floor(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m planned
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 block">
            Urgent Sprints Scheduled
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-rose-600">
              {urgentCommitments.length}
            </span>
            <span className="text-xs text-[#1A1A1B]/50">
              prioritized in morning/afternoon blocks
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 block">
            Focus Wave Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#7C9070]">
              {state.streakDays} Days
            </span>
            <span className="text-xs text-[#1A1A1B]/50">
              consecutive steady progress
            </span>
          </div>
        </div>
      </div>

      {/* Planning Conflict Notice (If commitments exceed available hours) */}
      {state.planConflicts && state.planConflicts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold">Honest Scheduling Alert: Conflict Detected</h4>
            </div>
            <p className="leading-relaxed text-amber-800">
              {state.planConflicts[0]}
            </p>
          </div>
        </div>
      )}

      {/* Overloaded Schedule Warning */}
      {totalPlannedMinutes >= 8 * 60 && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-900">
          <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold">Heavy Workload Today ({Math.floor(totalPlannedMinutes / 60)}h planned)</h4>
            </div>
            <p className="leading-relaxed text-sky-800">
              Pacing is essential. Consider moving lower-priority items to tomorrow so you don't burn out.
            </p>
          </div>
        </div>
      )}

      {/* All Tasks Completed Celebration Banner */}
      {planItems && planItems.length > 0 && planItems.every(p => p.isCompleted) && (
        <div className="bg-[#7C9070]/10 border border-[#7C9070]/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-[#7C9070]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">All focus targets completed for today!</span>
              </div>
              <p className="text-[11px] text-[#1A1A1B]/70 mt-0.5">
                Every single block is finished. Shut the laptop and take a guilt-free rest!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chronological Daily Plan Timeline */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1B]">
              Chronological Focus Timeline
            </h3>
            <p className="text-xs text-[#1A1A1B]/50">
              Click any slot to mark it completed as you move through your day.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#7C9070]">
            {planItems?.filter(p => p.isCompleted).length || 0} of {planItems?.length || 0} slots checked
          </span>
        </div>

        {!planItems || planItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-xl mx-auto">
              🌱
            </div>
            <p className="text-sm font-serif italic text-[#1A1A1B]/60 max-w-sm mx-auto">
              {state.commitments.length === 0
                ? "No commitments in your workspace yet. Add an assignment in the database to get started."
                : "No daily schedule mapped for today yet."}
            </p>
            {state.commitments.length === 0 ? (
              <button
                onClick={onNavigateToInbox}
                className="inline-flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Go to Commitments</span>
              </button>
            ) : (
              <button
                onClick={() => generateDailyPlan()}
                className="bg-[#7C9070] hover:bg-[#6c7d61] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Generate Today's Plan
              </button>
            )}
          </div>
        ) : (
          <div className="relative border-l-2 border-[#EBE9E0] ml-4 md:ml-6 pl-6 md:pl-8 space-y-4 py-2">
            {planItems.map((slot) => {
              const matchedCommitment = state.commitments.find(c => c.id === slot.commitmentId);

              return (
                <div key={slot.id} className="relative group">
                  {/* Timeline bullet / check button */}
                  <div className="absolute -left-[37px] md:-left-[45px] top-3 z-10 bg-white p-0.5 rounded-full">
                    <button
                      type="button"
                      onClick={() => togglePlanItem(slot.id)}
                      className="cursor-pointer text-[#1A1A1B]/20 hover:text-[#7C9070] transition-colors"
                      title={slot.isCompleted ? "Mark incomplete" : "Mark complete"}
                    >
                      {slot.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-[#7C9070] fill-[#7C9070]/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#1A1A1B]/25 hover:stroke-[#7C9070] stroke-2" />
                      )}
                    </button>
                  </div>

                  {/* Slot Card */}
                  <div
                    onClick={() => togglePlanItem(slot.id)}
                    className={`border rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                      slot.isCompleted
                        ? 'bg-[#FAF9F6] border-[#EBE9E0] opacity-55'
                        : slot.type === 'break'
                          ? 'bg-amber-50/30 border-amber-100 hover:border-amber-200'
                          : 'bg-white border-[#EBE9E0] hover:border-[#7C9070]/50 shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {getSlotIcon(slot.type)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#1A1A1B]/50">
                            {slot.timeSlot}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#EBE9E0]">
                            {slot.type}
                          </span>
                          {slot.subject && (
                            <span className="text-[10px] font-semibold text-[#7C9070] bg-[#7C9070]/10 px-2 py-0.5 rounded-md">
                              {slot.subject}
                            </span>
                          )}
                        </div>

                        <h4 className={`font-serif font-bold text-sm md:text-base text-[#1A1A1B] leading-snug ${
                          slot.isCompleted ? 'line-through text-[#1A1A1B]/40' : ''
                        }`}>
                          {slot.title}
                        </h4>

                        {matchedCommitment?.notes && (
                          <p className="text-[11px] text-[#1A1A1B]/50 line-clamp-1 font-sans">
                            {matchedCommitment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {matchedCommitment?.priority === 'high' && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          High Priority
                        </span>
                      )}
                      <span className="text-xs text-[#1A1A1B]/40 font-mono">
                        {slot.estimatedMinutes ? `${slot.estimatedMinutes}m` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

