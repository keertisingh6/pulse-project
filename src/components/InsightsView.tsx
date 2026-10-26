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
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const completedThisWeek = state.commitments.filter(item => {
    if (!item.completedAt) return false;
    const completedAt = new Date(item.completedAt);
    return completedAt >= weekStart && completedAt < weekEnd;
  }).length;
  const trackedThisWeek = state.commitments.filter(item => {
    const due = item.dueDate ? new Date(`${item.dueDate}T12:00:00`) : null;
    const completedAt = item.completedAt ? new Date(item.completedAt) : null;
    return Boolean((due && due >= weekStart && due < weekEnd) || (completedAt && completedAt >= weekStart && completedAt < weekEnd));
  }).length;
  const weeklyCompletionRate = trackedThisWeek ? Math.round(completedThisWeek / trackedThisWeek * 100) : 0;

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

        {/* Weekly progress without streak pressure */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="bg-purple-100 text-purple-800 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-800 block uppercase tracking-wide">Finished this week</span>
            <h4 className="font-display font-bold text-2xl text-slate-800 mt-1">{completedThisWeek} items</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">Every small finish makes room for what’s next.</p>
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
              "{state.user?.name ? `${state.user.name},` : ''} you finished <strong className="text-slate-800">{completedThisWeek} of {trackedThisWeek} items this week</strong>. Progress can be steady without being perfect."
            </p>
            <p className="leading-relaxed">
              {completedBills > 0 ? (
                <>✔️ <strong>Nice work:</strong> You cleared {completedBills} bill{completedBills === 1 ? '' : 's'}. That’s one less thing to hold in mind.</>
              ) : (
                <>🌿 <strong>Room to begin:</strong> {pendingCount} item{pendingCount === 1 ? '' : 's'} remain on your list. Choose the one that would feel useful to move forward.</>
              )}
            </p>
            <p className="leading-relaxed">
              {totalFocusMinutes > 0 ? (
                <>🎯 <strong>Focus time:</strong> Your sessions add up to {totalFocusMinutes} minutes. Thank yourself for the time you made.</>
              ) : (
                <>🌤 <strong>Focus time:</strong> No sessions logged yet. Start with a short block whenever it feels right.</>
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
          <div className="insights-donut-row" role="img" aria-label={`${weeklyCompletionRate}% of commitments due this week are complete`}>
            <div className="insights-donut" style={{ '--donut-progress': `${weeklyCompletionRate}%` } as React.CSSProperties}><span>{weeklyCompletionRate}%</span></div>
            <div><b>This week, at a glance</b><small>{completedThisWeek} of {trackedThisWeek} due or completed items finished</small></div>
          </div>
        </div>
      </div>
    </div>
  );
};

