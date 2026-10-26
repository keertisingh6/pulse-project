import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Sun,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Plus,
  Flame,
  Check
} from 'lucide-react';
import { ProgressRing } from '../common/ProgressRing';
import { MugIllustration } from '../common/ClayIllustrations';

export const MyDayView: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    rescheduleTask,
    startFocusOnTask,
    setIsTaskModalOpen,
    setEditingTask,
    plannerBlocks,
    habits,
    toggleHabitDay,
    focusMinutesToday,
    subjects,
    profile
  } = usePulse();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const pendingTasks = todayTasks.filter(t => t.status !== 'completed');
  const completedTasks = todayTasks.filter(t => t.status === 'completed');

  const todayPlannedMinutes = todayTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const todayPlannedHours = (todayPlannedMinutes / 60).toFixed(1);

  const completionRate = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 100;

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
              <Sun className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Daily Execution Stream
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-plum font-sans">My Day Plan</h2>
          <p className="text-xs text-slate-500">
            A focused, low-pressure view of what you chose for today
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-lavender-brand hover:bg-lavender-brandDark text-white font-semibold text-xs shadow-md shadow-lavender-brand/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task to Today</span>
        </button>
      </div>

      {/* Daily Progress Capsule */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-lavender-50 border border-amber-200/80 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Today's Trajectory
          </span>
          <h3 className="text-xl font-extrabold text-plum font-sans">
            {completedTasks.length} of {todayTasks.length} tasks accomplished
          </h3>
          <p className="text-xs text-slate-600">
            Estimated workload: {todayPlannedHours} hours • {focusMinutesToday} minutes focused so far
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-xs font-bold text-plum">{completionRate}% Completed</span>
            <p className="text-[10px] text-slate-400">Keep it steady</p>
          </div>
          <ProgressRing progress={completionRate} size={54} strokeWidth={4.5} color="#F59E0B" />
        </div>
      </div>

      {/* Main Focus Flow Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today's Prioritized Tasks */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EDE8F5] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-plum">Prioritized Action Queue</h3>
              <span className="text-xs text-slate-500 font-semibold">{pendingTasks.length} remaining</span>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map(task => {
                  const sub = subjects.find(s => s.id === task.subjectId);
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : task.priority === 'urgent'
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-[#FAF9FD] border-[#ECE7F5] hover:border-lavender-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 bg-white hover:border-lavender-brand'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold truncate ${
                                isDone ? 'line-through text-slate-400' : 'text-plum'
                              }`}
                            >
                              {task.title}
                            </h4>
                            {sub && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                {sub.code}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedMinutes}m</span>
                            </span>
                            {task.dueTime && <span>Due by {task.dueTime}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!isDone && (
                          <button
                            onClick={() => startFocusOnTask(task.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-lavender-brand text-white text-xs font-bold hover:bg-lavender-brandDark transition-all shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Focus</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            rescheduleTask(task.id, tomorrow.toISOString().split('T')[0]);
                          }}
                          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title="Reschedule to Tomorrow"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-block mb-2 drop-shadow-sm">
                  <MugIllustration className="w-14 h-14" />
                </div>
                <h4 className="text-sm font-bold text-plum">Nothing planned for today yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Click 'Add Task to Today' or pull an assignment from your roadmap!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Today's Habits Check-in */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EDE8F5] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-plum">Today's Habits</h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {habits.filter(h => h.completedDates.includes(todayStr)).length}/{habits.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {habits.map(habit => {
                const isChecked = habit.completedDates.includes(todayStr);

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitDay(habit.id, todayStr)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                        : 'bg-[#FAF9FD] border-[#ECE7F5] hover:border-lavender-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {habit.title}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {isChecked ? 'Done' : 'Tap'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
