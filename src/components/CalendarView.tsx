import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { Commitment, CommitmentType } from '../types';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, 
  CheckCircle2, Circle, Download, Check, Sparkles, Filter 
} from 'lucide-react';
import { downloadICSFile } from '../utils/icsExport';

export const CalendarView: React.FC = () => {
  const { state, toggleCommitment } = usePulse();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilter, setExportFilter] = useState<'all' | 'active' | 'selectedDay' | 'currentMonth'>('all');
  const [exportSuccess, setExportSuccess] = useState(false);

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Monday as first day of week: Sunday (0) becomes 6, Monday (1) becomes 0
  const startOffset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getISODate = (day: number): string => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${monthStr}-${dayStr}`;
  };

  const getCommitmentsForDay = (day: number): Commitment[] => {
    const targetDate = getISODate(day);
    return state.commitments.filter(c => c.dueDate.startsWith(targetDate));
  };

  const dayCommitments = getCommitmentsForDay(selectedDay);

  const getCategoryColor = (type: CommitmentType) => {
    switch (type) {
      case 'Assignment': return 'bg-rose-500';
      case 'Exam': return 'bg-rose-600';
      case 'Meeting': return 'bg-sky-500';
      case 'Bill': return 'bg-emerald-500';
      case 'Appointment': return 'bg-purple-500';
      case 'Event': return 'bg-orange-500';
      case 'Interview': return 'bg-blue-600';
      default: return 'bg-[#7C9070]';
    }
  };

  const selectedDateFormatted = new Date(currentYear, currentMonth, Math.min(selectedDay, daysInMonth)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getFilteredCommitments = () => {
    switch (exportFilter) {
      case 'selectedDay':
        return dayCommitments;
      case 'currentMonth': {
        const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        return state.commitments.filter(c => c.dueDate.startsWith(monthPrefix));
      }
      case 'active':
        return state.commitments.filter(c => !c.completed);
      case 'all':
      default:
        return state.commitments;
    }
  };

  const handleExportICS = () => {
    const commitmentsToExport = getFilteredCommitments();
    if (commitmentsToExport.length === 0) {
      alert("No commitments found for the selected export filter.");
      return;
    }

    let fileName = 'pulse-commitments.ics';
    if (exportFilter === 'selectedDay') {
      fileName = `pulse-${getISODate(selectedDay)}.ics`;
    } else if (exportFilter === 'currentMonth') {
      fileName = `pulse-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}.ics`;
    }

    downloadICSFile(commitmentsToExport, fileName);
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      setShowExportModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="calendar-panel-view">
      {/* Top Action Bar for Calendar */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-0.5 rounded-full">
              Calendar & External Sync
            </span>
            <span className="text-xs text-[#1A1A1B]/40 font-mono">
              {state.commitments.length} total commitments
            </span>
          </div>
          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1A1A1B] mt-0.5">
            Academic Schedule & Sync
          </h2>
        </div>

        {/* Export to ICS button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer w-full sm:w-auto"
            title="Export commitments to .ics for Google Calendar, Apple Calendar, or Outlook"
          >
            <Download className="w-4 h-4" />
            <span>Export to .ics (Calendar Sync)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      
      {/* Calendar Grid card - 3 cols */}
      <div className="md:col-span-3 bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-5">
        
        {/* Header month navigator */}
        <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#7C9070]" />
            <h3 className="font-serif font-bold text-[#1A1A1B] text-base">
              {monthName}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#FAF9F6] text-[#1A1A1B]/50 hover:text-[#1A1A1B] rounded-lg transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-[#1A1A1B]/70 px-2 min-w-[100px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#FAF9F6] text-[#1A1A1B]/50 hover:text-[#1A1A1B] rounded-lg transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[#1A1A1B]/40">
          {weekDays.map((wd, i) => (
            <div key={i} className="py-1">{wd}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Start offset placeholders */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="aspect-square opacity-0 pointer-events-none" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const commitments = getCommitmentsForDay(dayNum);
            const hasCommitments = commitments.length > 0;
            const isToday = currentYear === today.getFullYear() && currentMonth === today.getMonth() && dayNum === today.getDate();
            const isSelected = dayNum === selectedDay;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1A1A1B] text-white shadow-md scale-105'
                    : isToday
                      ? 'bg-[#7C9070]/15 text-[#7C9070] font-bold border border-[#7C9070]/40'
                      : 'hover:bg-[#FAF9F6] text-[#1A1A1B] font-medium'
                }`}
              >
                <span className="text-xs md:text-sm">{dayNum}</span>

                {hasCommitments && (
                  <div className="absolute bottom-1.5 flex gap-0.5 justify-center">
                    {commitments.slice(0, 3).map(c => (
                      <span 
                        key={c.id} 
                        className={`w-1.5 h-1.5 rounded-full ${
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
        <div className="flex flex-wrap gap-3 justify-center pt-3 border-t border-[#EBE9E0] text-[10px] font-semibold text-[#1A1A1B]/50">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Assignment</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Exam</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Meeting</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Interview</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bill</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#7C9070]" /> Task</span>
        </div>
      </div>

      {/* Side Day-Commitment Viewer - 2 cols */}
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm min-h-[360px]">
          <div>
            <span className="text-[10px] font-bold text-[#7C9070] uppercase tracking-wider block font-mono">
              Selected Schedule
            </span>
            <h4 className="font-serif font-bold text-[#1A1A1B] text-base">
              {selectedDateFormatted}
            </h4>
          </div>

          <div className="space-y-3">
            {dayCommitments.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="text-3xl opacity-60">🍃</div>
                <p className="text-xs text-[#1A1A1B]/60 font-serif italic">No deadlines on this date</p>
                <p className="text-[10px] text-[#1A1A1B]/40 max-w-xs mx-auto">
                  A quiet day to review notes, advance your personal goals, or take a gentle rest.
                </p>
              </div>
            ) : (
              dayCommitments.map(c => (
                <div 
                  key={c.id} 
                  className={`bg-[#FAF9F6] rounded-2xl p-4 border border-[#EBE9E0] space-y-2 transition-all ${
                    c.completed ? 'opacity-55' : 'hover:border-[#7C9070]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCommitment(c.id)}
                        className="text-[#1A1A1B]/20 hover:text-[#7C9070] cursor-pointer"
                      >
                        {c.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#7C9070] fill-[#7C9070]/10" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#1A1A1B]/20 hover:stroke-[#7C9070]" />
                        )}
                      </button>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/50">
                        {c.type}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#1A1A1B]/40">
                      {c.dueTime || '23:59'}
                    </span>
                  </div>

                  <h5 className={`font-serif text-xs font-bold leading-snug ${
                    c.completed ? 'line-through text-[#1A1A1B]/40' : 'text-[#1A1A1B]'
                  }`}>
                    {c.title}
                  </h5>

                  <div className="flex flex-wrap gap-2 text-[10px] text-[#1A1A1B]/50 font-medium">
                    <span>Effort: {c.estimatedEffort}</span>
                    <span>•</span>
                    <span className="capitalize">Priority: {c.priority}</span>
                    {c.subject && (
                      <>
                        <span>•</span>
                        <span className="text-[#7C9070] font-bold">{c.subject}</span>
                      </>
                    )}
                  </div>

                  {c.aiTip && (
                    <p className="text-[10px] text-[#7C9070] italic font-serif bg-white p-2 rounded-xl border border-[#EBE9E0]">
                      "{c.aiTip}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      </div>

      {/* Export to .ICS Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-[#1A1A1B]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-0.5 rounded-full font-mono">
                  Standard iCalendar (.ics)
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1B] mt-1.5">
                  Export Commitments
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF9F6] hover:bg-[#F5F1E9] text-[#1A1A1B]/50 hover:text-[#1A1A1B] flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#1A1A1B]/60 leading-relaxed">
              Export your Pulse commitments into an RFC-compliant <code className="font-mono bg-[#FAF9F6] px-1 py-0.5 rounded text-[#1A1A1B]/80">.ics</code> calendar file. You can import this directly into <strong>Google Calendar</strong>, <strong>Apple Calendar</strong>, <strong>Outlook</strong>, or <strong>Notion Calendar</strong>.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#1A1A1B]/70 block">
                Choose What to Export
              </label>

              <div className="space-y-2">
                {[
                  {
                    id: 'all',
                    title: 'All Commitments',
                    desc: `All ${state.commitments.length} commitments in your workspace`,
                    count: state.commitments.length,
                  },
                  {
                    id: 'active',
                    title: 'Pending & Active Only',
                    desc: 'Excludes completed tasks and finished items',
                    count: state.commitments.filter(c => !c.completed).length,
                  },
                  {
                    id: 'currentMonth',
                    title: `Current Month (${monthName})`,
                    desc: `Only commitments scheduled for ${monthName}`,
                    count: state.commitments.filter(c => c.dueDate.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)).length,
                  },
                  {
                    id: 'selectedDay',
                    title: `Selected Date (${selectedDateFormatted})`,
                    desc: `Only commitments on ${selectedDateFormatted}`,
                    count: dayCommitments.length,
                  },
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setExportFilter(opt.id as any)}
                    className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      exportFilter === opt.id
                        ? 'border-[#7C9070] bg-[#7C9070]/5 shadow-xs'
                        : 'border-[#EBE9E0] bg-[#FAF9F6] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="exportFilter"
                        checked={exportFilter === opt.id}
                        onChange={() => setExportFilter(opt.id as any)}
                        className="mt-0.5 text-[#7C9070] focus:ring-[#7C9070]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1A1A1B]">{opt.title}</div>
                        <div className="text-[11px] text-[#1A1A1B]/50">{opt.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#EBE9E0] text-[#1A1A1B]/60">
                      {opt.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Google Calendar sync guide tip */}
            <div className="bg-[#FAF9F6] border border-[#EBE9E0] p-3 rounded-xl text-[11px] text-[#1A1A1B]/60 space-y-1">
              <div className="font-semibold text-[#1A1A1B]/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C9070]" />
                How to import into Google Calendar:
              </div>
              <p>
                In Google Calendar, go to <strong>Settings ⚙️ &gt; Import & Export</strong>, upload this <code className="font-mono">.ics</code> file, and all your exams, assignments, and deadlines will populate automatically with alerts!
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="w-1/3 py-2.5 bg-[#FAF9F6] hover:bg-[#F5F1E9] text-[#1A1A1B]/70 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExportICS}
                disabled={getFilteredCommitments().length === 0}
                className="w-2/3 py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {exportSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Downloaded .ics!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download .ics File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
