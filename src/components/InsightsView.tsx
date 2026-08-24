import React from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Trophy, BookOpen, Clock, CheckCircle2, 
  Sparkles, Coffee, Award, Calendar, Heart
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { state } = usePulse();

  const totalCommitments = state.commitments.length;
  const completedCount = state.commitments.filter(c => c.completed).length;
  const pendingCount = totalCommitments - completedCount;
  
  // Calculate focus minutes
  const totalFocusMinutes = state.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  // Classify categories
  const categoriesCount = state.commitments.reduce((acc: Record<string, number>, c) => {
    if (c.completed) {
      acc[c.type] = (acc[c.type] || 0) + 1;
    }
    return acc;
  }, {});

  const completedBills = categoriesCount['Bill'] || 0;
  const completedAssignments = categoriesCount['Assignment'] || 0;
  const completedMeetings = categoriesCount['Meeting'] || 0;

  return (
    <div className="space-y-6" id="insights-panel-view">
      
      {/* Overview Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Focus Hours */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="bg-sky-100 text-sky-700 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-700 block uppercase tracking-wide">Focus Hours</span>
            <h4 className="font-display font-bold text-2xl text-slate-800 mt-1">{focusHours} hours</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Spent in serene deep work sessions</p>
          </div>
        </div>

        {/* Commitments Cleared */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wide">Cleared Goals</span>
            <h4 className="font-display font-bold text-2xl text-slate-800 mt-1">{completedCount} commitments</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Removed from your mental checklist</p>
          </div>
        </div>

        {/* Current streak */}
        <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-orange-700 block uppercase tracking-wide">Active Streak</span>
            <h4 className="font-display font-bold text-2xl text-slate-800 mt-1">{state.streakDays} days</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Consecutive days tracking mindfully</p>
          </div>
        </div>
      </div>

      {/* Dynamic human commentary */}
      <div className="bg-white border border-slate-150/80 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-display font-bold text-slate-800 text-base">Kairo's Weekly Reflections</h3>
          </div>
          
          <div className="space-y-3.5 text-xs md:text-sm text-slate-600 font-medium">
            <p className="leading-relaxed">
              "Keerti, take a moment to look back. You've cleared <strong className="text-slate-800">{completedCount} major commitments</strong> this cycle. Your largest concentration block was spent on assignments, reducing overall pressure."
            </p>
            <p className="leading-relaxed">
              {completedBills > 0 ? (
                <>✔️ <strong>Bill clearance:</strong> You paid {completedBills} outstanding bills. Protecting your credit standing brings calm safety.</>
              ) : (
                <>⏳ <strong>Bill clearance:</strong> No bills checked off yet. Let's block 5 quick minutes tomorrow morning to audit outstanding accounts.</>
              )}
            </p>
            <p className="leading-relaxed">
              {totalFocusMinutes > 0 ? (
                <>🎯 <strong>Deep Focus:</strong> Your study sessions added up to {totalFocusMinutes} minutes. It takes deep strength to stay still. Well done.</>
              ) : (
                <>⏳ <strong>Deep Focus:</strong> No focus logs recorded today. Whenever you are ready, toggle the Focus Timer to begin your first breathing loop.</>
              )}
            </p>
          </div>
        </div>

        {/* Soft, beautiful categories progress illustration */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-4">
          <h4 className="font-display font-bold text-xs text-slate-700 uppercase tracking-wide">Aesthetic Balanced Breakdown</h4>
          
          <div className="space-y-3 text-xs">
            {/* Assignments Completed bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Assignments Completed</span>
                <span className="text-slate-800 font-bold">{completedAssignments}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, (completedAssignments / Math.max(1, totalCommitments)) * 100)}%` }} />
              </div>
            </div>

            {/* Bills Settled bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Bills Paid</span>
                <span className="text-slate-800 font-bold">{completedBills}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (completedBills / Math.max(1, totalCommitments)) * 100)}%` }} />
              </div>
            </div>

            {/* Meetings Cleared bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Meetings & Discussions Cleared</span>
                <span className="text-slate-800 font-bold">{completedMeetings}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (completedMeetings / Math.max(1, totalCommitments)) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/50">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
            <span>Balance is superior to absolute speed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
