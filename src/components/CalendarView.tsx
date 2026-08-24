import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { Commitment, CommitmentType } from '../types';
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { state } = usePulse();
  const [selectedDay, setSelectedDay] = useState<number>(24); // June 24, 2026 is today
  
  // June 2026 starts on Monday (1) and has 30 days.
  const daysInJune = 30;
  const startDayOffset = 0; // Monday is index 0
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Map day numbers (1-30) to ISO dates '2026-06-XX'
  const getISODateForDay = (day: number): string => {
    return `2026-06-${day.toString().padStart(2, '0')}`;
  };

  // Get commitments due on a specific day
  const getCommitmentsForDay = (day: number): Commitment[] => {
    const targetDate = getISODateForDay(day);
    return state.commitments.filter(c => c.dueDate.startsWith(targetDate));
  };

  const selectedDayDate = getISODateForDay(selectedDay);
  const dayCommitments = getCommitmentsForDay(selectedDay);

  const getCategoryColor = (type: CommitmentType) => {
    switch (type) {
      case 'Assignment': return 'bg-red-500';
      case 'Meeting': return 'bg-sky-500';
      case 'Bill': return 'bg-emerald-500';
      case 'Appointment': return 'bg-purple-500';
      case 'Event': return 'bg-orange-500';
      case 'Travel': return 'bg-indigo-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6" id="calendar-panel-view">
      
      {/* Calendar Grid card - 3 cols */}
      <div className="md:col-span-3 bg-white border border-slate-150/80 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Header month navigator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="font-display font-bold text-slate-800 text-base">June 2026</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-slate-400">
          {weekDays.map((wd, i) => (
            <div key={i} className="py-1">{wd}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: daysInJune }).map((_, idx) => {
            const dayNum = idx + 1;
            const commitments = getCommitmentsForDay(dayNum);
            const activeCommitments = commitments.filter(c => !c.completed);
            const hasCommitments = commitments.length > 0;
            const hasActive = activeCommitments.length > 0;
            const isToday = dayNum === 24;
            const isSelected = dayNum === selectedDay;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-200 scale-105'
                    : isToday
                      ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                {/* Day Number */}
                <span className="text-xs md:text-sm">{dayNum}</span>

                {/* Micro Category Dot indicators */}
                {hasCommitments && (
                  <div className="absolute bottom-1.5 flex gap-0.5 justify-center">
                    {commitments.slice(0, 3).map(c => (
                      <span 
                        key={c.id} 
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' : getCategoryColor(c.type)
                        } ${c.completed ? 'opacity-40' : 'opacity-100'}`} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Key/Legend */}
        <div className="flex flex-wrap gap-2.5 justify-center pt-2 border-t border-[#EBE9E0] text-[10px] font-semibold text-[#1A1A1B]/40">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Assignment</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Meeting</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bill</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Appointment</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Event</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Travel</span>
        </div>
      </div>

      {/* Side Day-Commitment Viewer - 2 cols */}
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-50 border border-slate-150/80 rounded-2xl p-5 space-y-3 min-h-[300px]">
          <div>
            <span className="text-xs font-bold text-slate-400 font-mono block">Selected Schedule</span>
            <h4 className="font-display font-bold text-slate-800 text-sm">
              Wednesday, June {selectedDay}, 2026
            </h4>
          </div>

          <div className="space-y-2.5">
            {dayCommitments.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="text-2xl opacity-60">🍃</div>
                <p className="text-xs text-slate-500 font-medium">Nothing scheduled for this day</p>
                <p className="text-[10px] text-slate-400">Perfect day to breathe, relax, or catch up on other goals.</p>
              </div>
            ) : (
              dayCommitments.map(c => (
                <div 
                  key={c.id} 
                  className={`bg-white rounded-xl p-3.5 border border-slate-100 shadow-xs flex items-start gap-3 transition-opacity ${
                    c.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${getCategoryColor(c.type)}`} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {c.type}
                    </span>
                    <h5 className={`font-display text-xs font-bold leading-tight ${
                      c.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {c.title}
                    </h5>
                    <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
                      <span>Effort: {c.estimatedEffort}</span>
                      <span>•</span>
                      <span className="capitalize">Priority: {c.priority}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
