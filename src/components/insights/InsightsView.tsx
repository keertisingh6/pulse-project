import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { ProgressRing } from '../common/ProgressRing';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  Heart
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const {
    tasks,
    focusSessions,
    focusMinutesToday,
    habits,
    goals,
    subjects,
    profile
  } = usePulse();

  const todayStr = new Date().toISOString().split('T')[0];

  // Real calculations
  const totalCompletedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalPendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const overdueTasksCount = tasks.filter(t => t.dueDate < todayStr && t.status !== 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  // Total Focus Minutes recorded
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // Focus time distribution by subject
  const focusBySubject = subjects.map(sub => {
    const mins = focusSessions
      .filter(s => s.subjectId === sub.id)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    return { ...sub, minutes: mins };
  });

  // Habit consistency calculation
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const habitRateToday = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Goals progress
  const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const completedMilestones = goals.reduce(
    (acc, g) => acc + g.milestones.filter(m => m.completed).length,
    0
  );
  const goalProgressRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-plum font-sans">Supportive Insights</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real metrics derived strictly from your active coursework and focus logs — zero shame metrics
        </p>
      </div>

      {/* Gentle Affirmation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-lavender-50 via-white to-sky-50 border border-lavender-200/80 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lavender-brand text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-lavender-brand/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-plum font-sans">
              High Agency, Zero Judgment
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Academic progress isn't a straight line. Whether you log 25 minutes or 3 hours today, steady consistency and intentional focus are what matter.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Focus */}
        <div className="p-5 rounded-3xl bg-white border border-[#EDE8F5] shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All-Time Focus</span>
          <div className="text-3xl font-extrabold text-plum font-sans mt-2">
            {totalFocusHours} <span className="text-sm font-semibold text-slate-500">hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{focusSessions.length} total logged sessions</p>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="p-5 rounded-3xl bg-white border border-[#EDE8F5] shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks Velocity</span>
          <div className="text-3xl font-extrabold text-plum font-sans mt-2">
            {totalCompletedTasks} <span className="text-sm font-semibold text-slate-500">done</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{totalPendingTasks} pending in roadmap</p>
        </div>

        {/* Metric 3: Habit Consistency */}
        <div className="p-5 rounded-3xl bg-white border border-[#EDE8F5] shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Habit Check-ins</span>
          <div className="text-3xl font-extrabold text-plum font-sans mt-2">
            {completedTodayCount} <span className="text-sm font-semibold text-slate-500">of {totalHabits}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{habitRateToday}% checked today</p>
        </div>

        {/* Metric 4: Goal Milestones */}
        <div className="p-5 rounded-3xl bg-white border border-[#EDE8F5] shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestones</span>
          <div className="text-3xl font-extrabold text-plum font-sans mt-2">
            {completedMilestones} <span className="text-sm font-semibold text-slate-500">unlocked</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{goalProgressRate}% goal roadmap progress</p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE8F5] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-plum">Coursework & Task Status</h4>
              <p className="text-xs text-slate-500">Real ratio of active vs finished responsibilities</p>
            </div>
            <ProgressRing progress={taskCompletionRate} size={54} strokeWidth={4.5} />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Completed Responsibilities</span>
              <span className="font-bold text-emerald-600">{totalCompletedTasks} tasks</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Active Pending Coursework</span>
              <span className="font-bold text-sky-600">{totalPendingTasks} tasks</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${totalTasks > 0 ? (totalPendingTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>

            {overdueTasksCount > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>{overdueTasksCount} overdue tasks need a realistic reschedule</span>
                <span className="font-bold">No guilt</span>
              </div>
            )}
          </div>
        </div>

        {/* Focus Hours by Course */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE8F5] shadow-card space-y-4">
          <div>
            <h4 className="text-sm font-bold text-plum">Subject Focus Distribution</h4>
            <p className="text-xs text-slate-500">Time invested across enrolled curricula</p>
          </div>

          <div className="space-y-3 pt-2">
            {focusBySubject.map(sub => {
              const maxMins = Math.max(1, ...focusBySubject.map(s => s.minutes));
              const barPercent = Math.round((sub.minutes / maxMins) * 100);

              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{sub.name}</span>
                    <span className="font-mono text-slate-500 font-semibold">{sub.minutes} mins</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sub.color === 'blue'
                          ? 'bg-sky-500'
                          : sub.color === 'mint'
                          ? 'bg-emerald-500'
                          : sub.color === 'yellow'
                          ? 'bg-amber-500'
                          : 'bg-lavender-brand'
                      }`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
