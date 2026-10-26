import React, { useState, useEffect } from 'react';
import { usePulse } from '../context/PulseContext';
import { ScheduleBlock, Commitment } from '../types';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  Plus, Check, Sparkles, BookOpen, Coffee, Laptop, 
  CheckCircle2, Circle, AlertCircle, MoveVertical, Zap, Trash2, CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDeadlineDisplay, isTaskOverdue } from '../utils/deadlineUtils';

const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCategoryStyle = (type: ScheduleBlock['type']) => {
  switch (type) {
    case 'deep-work':
      return {
        bg: 'bg-sky-50 border-sky-200 text-sky-900',
        badge: 'bg-sky-100 text-sky-800',
        label: 'Deep Work',
      };
    case 'study':
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badge: 'bg-emerald-100 text-emerald-800',
        label: 'Study',
      };
    case 'class':
      return {
        bg: 'bg-purple-50 border-purple-200 text-purple-900',
        badge: 'bg-purple-100 text-purple-800',
        label: 'Class / Lecture',
      };
    case 'break':
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
        badge: 'bg-amber-100 text-amber-800',
        label: 'Break / Rest',
      };
    default:
      return {
        bg: 'bg-slate-50 border-slate-200 text-slate-900',
        badge: 'bg-slate-100 text-slate-800',
        label: 'Task',
      };
  }
};

export const DailyPlannerView: React.FC<{ initialDate?: string }> = ({ initialDate }) => {
  const { state } = usePulse();

  // Current selected calendar date in YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(() => initialDate || formatDateToLocalISO(new Date()));

  // Schedule blocks stored date-specifically; NO default or hardcoded tasks on load
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_schedule_blocks');
      if (saved) {
        const parsed: ScheduleBlock[] = JSON.parse(saved);
        // Exclude any legacy mock IDs
        return parsed.filter(b => b && b.id && !b.id.startsWith('sb1') && !b.id.startsWith('sb2') && !b.id.startsWith('sb3'));
      }
    } catch (e) {
      console.warn('Failed to parse schedule blocks', e);
    }
    return [];
  });

  // Modal and Form State
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDate, setModalDate] = useState(selectedDate);
  const [modalStartTime, setModalStartTime] = useState('09:00');
  const [modalEndTime, setModalEndTime] = useState('10:30');
  const [modalType, setModalType] = useState<ScheduleBlock['type']>('study');
  const [modalCommitmentId, setModalCommitmentId] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);
  const [autoScheduleNotice, setAutoScheduleNotice] = useState<string | null>(null);

  const saveBlocks = (updated: ScheduleBlock[]) => {
    setBlocks(updated);
    localStorage.setItem('pulse_schedule_blocks', JSON.stringify(updated));
  };

  // Sync modal date when selected date changes and modal is closed
  useEffect(() => {
    if (!showAddBlockModal) {
      setModalDate(selectedDate);
    }
  }, [selectedDate, showAddBlockModal]);

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  // Date navigation handlers
  const handlePreviousDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d - 1);
    setSelectedDate(formatDateToLocalISO(prev));
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    setSelectedDate(formatDateToLocalISO(next));
  };

  const handleJumpToToday = () => {
    setSelectedDate(formatDateToLocalISO(new Date()));
  };

  // Date formatting for header
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(selYear, selMonth - 1, selDay);
  const isToday = selectedDate === formatDateToLocalISO(new Date());
  const dateFormatted = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const weekStart = new Date(selectedDateObj);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = formatDateToLocalISO(date);
    const dayBlocks = blocks.filter(block => block.date === key);
    const dueItems = state.commitments.filter(item => !item.completed && item.dueDate === key);
    return { key, day: date.toLocaleDateString('en-US', { weekday: 'short' }), number: date.getDate(), dayBlocks, dueItems, today: key === formatDateToLocalISO(new Date()) };
  });

  // Filter tasks strictly for the selected date
  const currentDateBlocks = blocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedCount = currentDateBlocks.filter(b => b.completed).length;
  const totalCount = currentDateBlocks.length;

  // Toggle completion of a specific task
  const toggleBlockCompleted = (id: string) => {
    const updated = blocks.map(b => b.id === id ? { ...b, completed: !b.completed } : b);
    saveBlocks(updated);
  };

  // Remove a block
  const handleRemoveBlock = (id: string) => {
    const updated = blocks.filter(b => b.id !== id);
    saveBlocks(updated);
  };

  // Open modal for a blank new block
  const handleOpenAddModal = () => {
    setModalTitle('');
    setModalDate(selectedDate);
    setModalStartTime('09:00');
    setModalEndTime('10:30');
    setModalType('study');
    setModalCommitmentId(undefined);
    setFormError(null);
    setOverlapWarning(null);
    setShowAddBlockModal(true);
  };

  // Slot an unscheduled syllabus commitment into the selected date
  const handleSlotCommitment = (commitment: Commitment) => {
    setModalTitle(commitment.title);
    setModalDate(selectedDate);
    setModalCommitmentId(commitment.id);
    
    // Choose sensible default duration from commitment effort
    const effortMins = commitment.effortMinutes || 90;
    const startH = 10;
    const startM = 0;
    const endTotalMins = startH * 60 + startM + effortMins;
    const endH = Math.floor(endTotalMins / 60);
    const endM = endTotalMins % 60;

    const startStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    const endStr = `${String(Math.min(endH, 23)).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    setModalStartTime(startStr);
    setModalEndTime(endStr);

    if (commitment.type === 'Class') {
      setModalType('class');
    } else if (commitment.type === 'Exam' || commitment.priority === 'high') {
      setModalType('deep-work');
    } else {
      setModalType('study');
    }

    setFormError(null);
    setOverlapWarning(null);
    setShowAddBlockModal(true);
  };

  const handleAutoSchedulePending = () => {
    const pending = unscheduledCommitments.slice(0, 5);
    if (!pending.length) {
      setAutoScheduleNotice('Everything is already scheduled. You can add another block whenever you need one.');
      return;
    }
    const additions: ScheduleBlock[] = [];
    let cursor = 9 * 60;
    for (const commitment of pending) {
      const duration = Math.min(120, Math.max(25, commitment.effortMinutes || 45));
      let start = cursor;
      let end = start + duration;
      let conflict = blocks.find(block => block.date === selectedDate && start < (Number(block.endTime.slice(0, 2)) * 60 + Number(block.endTime.slice(3, 5))) && end > (Number(block.startTime.slice(0, 2)) * 60 + Number(block.startTime.slice(3, 5))));
      while (conflict && end <= 21 * 60) {
        start = Number(conflict.endTime.slice(0, 2)) * 60 + Number(conflict.endTime.slice(3, 5)) + 15;
        end = start + duration;
        conflict = blocks.find(block => block.date === selectedDate && start < (Number(block.endTime.slice(0, 2)) * 60 + Number(block.endTime.slice(3, 5))) && end > (Number(block.startTime.slice(0, 2)) * 60 + Number(block.startTime.slice(3, 5))));
      }
      if (end > 21 * 60) continue;
      const timeLabel = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
      additions.push({
        id: `auto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        date: selectedDate,
        title: commitment.title,
        startTime: timeLabel(start),
        endTime: timeLabel(end),
        type: commitment.type === 'Class' ? 'class' : commitment.priority === 'high' ? 'deep-work' : 'study',
        completed: false,
        commitmentId: commitment.id,
      });
      cursor = end + 20;
    }
    if (!additions.length) {
      setAutoScheduleNotice('There isn’t enough open time left today. Choose another day to place these tasks.');
      return;
    }
    saveBlocks([...blocks, ...additions]);
    setAutoScheduleNotice(`${additions.length} pending task${additions.length === 1 ? '' : 's'} placed into open time on the selected day.`);
  };

  // Validate and submit new block
  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setOverlapWarning(null);

    if (!modalTitle.trim()) {
      setFormError('Please enter a task title.');
      return;
    }

    if (!modalDate) {
      setFormError('Please select a valid date.');
      return;
    }

    if (modalEndTime <= modalStartTime) {
      setFormError('End time must be after start time.');
      return;
    }

    // Check for overlapping blocks on the same date
    const sameDateBlocks = blocks.filter(b => b.date === modalDate);
    const overlapping = sameDateBlocks.find(b => 
      modalStartTime < b.endTime && modalEndTime > b.startTime
    );

    if (overlapping && !overlapWarning) {
      setOverlapWarning(
        `Note: This block overlaps with "${overlapping.title}" (${overlapping.startTime} - ${overlapping.endTime}). Click "Confirm & Add" to proceed.`
      );
      return;
    }

    const newBlock: ScheduleBlock = {
      id: 'sb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: modalDate,
      title: modalTitle.trim(),
      startTime: modalStartTime,
      endTime: modalEndTime,
      type: modalType,
      completed: false,
      commitmentId: modalCommitmentId,
    };

    saveBlocks([...blocks, newBlock]);
    setShowAddBlockModal(false);
    setModalTitle('');
    setModalCommitmentId(undefined);
    setOverlapWarning(null);
  };

  // Unscheduled syllabus items: only commitments not already slotted into ANY schedule block
  const unscheduledCommitments = state.commitments.filter(c => {
    if (c.completed) return false;
    const isAlreadySlotted = blocks.some(b => b.commitmentId === c.id);
    return !isAlreadySlotted;
  });

  return (
    <div className="space-y-6">
      
      {/* Planner Header matching FocusMate tablet view */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C9070]/10 text-[#7C9070] rounded-full text-xs font-semibold">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Weekly Planner</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1B] tracking-tight">
            Your week, with room to breathe
          </h2>
          <p className="text-xs md:text-sm text-[#1A1A1B]/60 max-w-xl">
            See your week at a glance, then choose one day to make a little more spacious.
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#EBE9E0] p-1 rounded-2xl">
            <button
              type="button"
              onClick={handlePreviousDay}
              title="Previous Day"
              className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleJumpToToday}
              className="text-xs font-bold text-[#1A1A1B] px-3 font-mono hover:text-[#7C9070] transition-colors cursor-pointer"
            >
              {isToday ? 'Today • ' : ''}{dateFormatted}
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button type="button" onClick={handleAutoSchedulePending} className="planner-auto-schedule" aria-label="Auto-schedule pending commitments"><Zap className="w-3.5 h-3.5" /><span>Auto-schedule pending</span></button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-2xl font-bold text-xs shadow-sm shadow-[#7C9070]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {autoScheduleNotice && <div className="planner-auto-notice" role="status"><Sparkles size={15} /><span>{autoScheduleNotice}</span><button type="button" onClick={() => setAutoScheduleNotice(null)} aria-label="Dismiss schedule message">×</button></div>}

      <section className="planner-week-view" aria-label="Choose a day this week">
        <div className="planner-week-heading"><span>THIS WEEK</span><span>{weekDays[0].key} — {weekDays[6].key}</span></div>
        <div className="planner-week-grid">{weekDays.map(day => <button type="button" key={day.key} className={`planner-week-day ${selectedDate === day.key ? 'selected' : ''} ${day.today ? 'today' : ''}`} onClick={() => setSelectedDate(day.key)} aria-pressed={selectedDate === day.key}><span>{day.day}</span><b>{day.number}</b><small>{day.dayBlocks.length ? `${day.dayBlocks.length} planned` : day.dueItems.length ? `${day.dueItems.length} due` : 'Open'}</small>{(day.dayBlocks.length > 0 || day.dueItems.length > 0) && <i aria-hidden="true" />}</button>)}</div>
      </section>

      {/* Main Grid: Left Timeline and Right Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
            <div>
              <h3 className="font-bold text-base text-[#1A1A1B]">Hourly Timeline</h3>
              <p className="text-[11px] text-[#1A1A1B]/50 font-mono">
                {dateFormatted}
              </p>
            </div>
            <span className="text-xs text-[#1A1A1B]/60 font-mono font-semibold bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#EBE9E0]">
              {completedCount} / {totalCount} Completed
            </span>
          </div>

          <div className="space-y-3 min-h-[220px]">
            {currentDateBlocks.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-[#EBE9E0] rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#FCFBF8]">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1B]">No blocks scheduled for this date</h4>
                <p className="text-xs text-[#1A1A1B]/50 max-w-xs">
                  Click "+ Add Block" above or slot an item from your syllabus to build your schedule for {dateFormatted}.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="mt-2 text-xs font-bold text-[#7C9070] hover:underline cursor-pointer"
                >
                  + Add First Block
                </button>
              </div>
            ) : (
              currentDateBlocks.map(block => {
                const style = getCategoryStyle(block.type);
                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${style.bg} ${
                      block.completed ? 'opacity-60 saturate-50 bg-slate-50 border-slate-200' : 'shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleBlockCompleted(block.id)}
                        className="p-1 rounded-full text-slate-700 hover:scale-110 transition-transform cursor-pointer"
                        title={block.completed ? 'Mark incomplete' : 'Mark completed'}
                      >
                        {block.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm truncate ${block.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {block.title}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                            {style.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 mt-0.5">
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          <span>{block.startTime} – {block.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Daily Commitments Queue ready to slot */}
        <div className="space-y-6">
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
              <h3 className="font-bold text-base text-[#1A1A1B]">Syllabus To Slot</h3>
              <span className="text-xs font-mono text-[#7C9070] bg-[#7C9070]/10 px-2 py-0.5 rounded-full">
                {unscheduledCommitments.length} unscheduled
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {unscheduledCommitments.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#1A1A1B]/50 border border-dashed border-[#EBE9E0] rounded-2xl p-4 bg-[#FCFBF8]">
                  <CalendarCheck className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="font-semibold text-[#1A1A1B]/70">No unscheduled syllabus items</p>
                  <p className="text-[11px] mt-1 text-[#1A1A1B]/40">
                    Add assignments in the database or schedule custom blocks above.
                  </p>
                </div>
              ) : (
                unscheduledCommitments.map(c => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-[#FAF9F6] border border-[#EBE9E0] rounded-2xl hover:border-[#7C9070] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-[#1A1A1B] leading-snug">{c.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#EBE9E0] text-[#1A1A1B]/70 shrink-0">
                        {c.type}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#1A1A1B]/50 font-mono flex-wrap gap-1">
                      <span className="flex items-center gap-1">
                        <span>Due: {formatDeadlineDisplay(c.dueDate, c.dueTime)}</span>
                        {!c.completed && isTaskOverdue(c) && (
                          <span className="text-rose-600 font-bold font-sans">(Overdue)</span>
                        )}
                      </span>
                      <span>{c.estimatedEffort || '1.5h'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSlotCommitment(c)}
                      className="mt-3 w-full py-1.5 px-3 bg-white hover:bg-[#7C9070] text-[#7C9070] hover:text-white border border-[#7C9070]/30 hover:border-[#7C9070] rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Slot into {dateFormatted}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add Time Block Modal */}
      <AnimatePresence>
        {showAddBlockModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#EBE9E0] space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#1A1A1B]">
                  Schedule Time Block
                </h3>
                <span className="text-xs font-mono text-[#7C9070] font-semibold bg-[#7C9070]/10 px-2 py-0.5 rounded-full">
                  {modalDate}
                </span>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {overlapWarning && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{overlapWarning}</span>
                </div>
              )}

              <form onSubmit={handleSaveBlock} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">
                    Activity Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Physics Problem Set or Project Sync"
                    value={modalTitle}
                    onChange={(e) => {
                      setModalTitle(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={modalStartTime}
                      onChange={(e) => {
                        setModalStartTime(e.target.value);
                        if (overlapWarning) setOverlapWarning(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={modalEndTime}
                      onChange={(e) => {
                        setModalEndTime(e.target.value);
                        if (overlapWarning) setOverlapWarning(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Block Type</label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-semibold"
                  >
                    <option value="study">Study / Academic Prep</option>
                    <option value="deep-work">Deep Work / Problem Solving</option>
                    <option value="class">Class / Lecture Attendance</option>
                    <option value="break">Break / Meals & Rest</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddBlockModal(false);
                      setOverlapWarning(null);
                      setFormError(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#1A1A1B]/60 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7C9070] hover:bg-[#6c7d61] text-white shadow-sm cursor-pointer"
                  >
                    {overlapWarning ? 'Confirm & Add Block' : 'Add Block'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

