import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Habit } from '../../types';
import { Flame, Plus, Check, Calendar, Sparkles, Heart } from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitDay } = usePulse();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState('Focus');
  const [targetDays, setTargetDays] = useState(5);
  const [habitColor, setHabitColor] = useState<any>('lavender');
  const [habitNote, setHabitNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNum: d.getDate()
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    addHabit({
      title: habitTitle.trim(),
      category: habitCategory,
      targetDaysPerWeek: Number(targetDays) || 5,
      color: habitColor,
      note: habitNote.trim() || undefined
    });

    setHabitTitle('');
    setHabitNote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-plum font-sans">Habits & Consistency</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gentle, low-guilt routines that build effortless momentum without shame streaks
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-lavender-brand hover:bg-lavender-brandDark text-white font-semibold text-xs shadow-md shadow-lavender-brand/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {habits.map(habit => {
          const isDoneToday = habit.completedDates.includes(todayStr);

          return (
            <div
              key={habit.id}
              className="p-6 rounded-3xl bg-white border border-[#EDE8F5] shadow-card space-y-4 hover:shadow-elevated transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {habit.category}
                  </span>
                  <h4 className="text-base font-extrabold text-plum font-sans">{habit.title}</h4>
                  {habit.note && (
                    <p className="text-xs text-slate-500 leading-relaxed">{habit.note}</p>
                  )}
                </div>

                {/* Big Today Toggle Pill */}
                <button
                  onClick={() => toggleHabitDay(habit.id, todayStr)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-2xs ${
                    isDoneToday
                      ? 'bg-emerald-500 text-white'
                      : 'bg-lavender-50 hover:bg-lavender-100 text-lavender-brand border border-lavender-200'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isDoneToday ? 'Done Today' : 'Mark Today'}</span>
                </button>
              </div>

              {/* 7-Day Consistency Dot Map */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Past 7 Days Consistency
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {habit.streak} check-ins
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {last7Days.map(day => {
                    const isCompleted = habit.completedDates.includes(day.iso);
                    const isToday = day.iso === todayStr;

                    return (
                      <div
                        key={day.iso}
                        onClick={() => toggleHabitDay(habit.id, day.iso)}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-lavender-brand text-white border-lavender-brand shadow-2xs'
                            : isToday
                            ? 'bg-lavender-50 border-lavender-300 text-lavender-brand font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                        title={`Toggle ${day.iso}`}
                      >
                        <span className="text-[10px] block font-bold">{day.dayName}</span>
                        <span className="text-xs font-extrabold">{day.dayNum}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated">
            <h3 className="text-base font-bold text-plum mb-4">Create New Habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={habitTitle}
                  onChange={e => setHabitTitle(e.target.value)}
                  placeholder="e.g. 15m review after class"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={habitCategory}
                    onChange={e => setHabitCategory(e.target.value)}
                    placeholder="Focus, Wellness, Academics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Days/Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={targetDays}
                    onChange={e => setTargetDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gentle Note / Cue
                </label>
                <textarea
                  rows={2}
                  value={habitNote}
                  onChange={e => setHabitNote(e.target.value)}
                  placeholder="e.g. Right after morning tea..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-lavender-brand text-white text-xs font-bold"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
