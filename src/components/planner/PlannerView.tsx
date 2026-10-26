import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { PlannerBlock } from '../../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Clock,
  MoreVertical,
  Check,
  BookOpen,
  FileText,
  FlaskConical,
  Dumbbell,
  Users,
  Coffee,
  GraduationCap,
  ChevronDown,
  Plus,
  Trash2,
  CheckCircle2,
  Download
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const {
    plannerBlocks,
    addPlannerBlock,
    deletePlannerBlock,
    autoScheduleWithKairo,
    exportCalendarICS,
    setIsScheduleModalOpen,
    setEditingScheduleBlock,
    commitments,
    advanceCommitmentSubtask,
    showToast
  } = usePulse();

  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Dynamic Days Header based on weekOffset
  const baseDates = [
    { day: 'Mon', dateNum: 27, month: 'Oct' },
    { day: 'Tue', dateNum: 28, month: 'Oct' },
    { day: 'Wed', dateNum: 29, month: 'Oct' },
    { day: 'Thu', dateNum: 30, month: 'Oct' },
    { day: 'Fri', dateNum: 31, month: 'Oct' },
    { day: 'Sat', dateNum: 1, month: 'Nov' },
    { day: 'Sun', dateNum: 2, month: 'Nov' }
  ];

  const daysHeader = baseDates.map(b => {
    const adjusted = b.dateNum + weekOffset * 7;
    return {
      day: b.day as any,
      date: `${adjusted > 0 ? adjusted : adjusted + 31} ${b.month}`
    };
  });

  const timeRows = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];

  // Agenda checklist
  const [agendaItems, setAgendaItems] = useState([
    { id: 'ag-1', time: '8:00 AM - 10:00 AM', title: 'DBMS Lecture', type: 'Class', location: 'LHC-201', dotColor: 'bg-[#236B43]', completed: true },
    { id: 'ag-2', time: '12:00 PM - 2:00 PM', title: 'PBL-III Lab', type: 'Lab', location: 'Lab-3', dotColor: 'bg-[#C34E32]', completed: false },
    { id: 'ag-3', time: '4:00 PM - 5:30 PM', title: 'DSA Revision', type: 'Self Study', location: 'Library', dotColor: 'bg-[#A1741F]', completed: false },
    { id: 'ag-4', time: '7:00 PM - 9:00 PM', title: 'Gym', type: 'Personal', location: 'Fitness Center', dotColor: 'bg-[#5344B5]', completed: false }
  ]);

  const toggleAgendaItem = (id: string) => {
    setAgendaItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    showToast('Agenda updated!', 'success');
  };

  // Quick Schedule Items (3x2 grid)
  const quickScheduleTemplates = [
    { title: 'DBMS Lecture', time: '8 - 10 AM', startTime: '8 AM', endTime: '10 AM', color: 'mint' as const, category: 'class' as const },
    { title: 'PBL-III Lab', time: '12 - 2 PM', startTime: '12 PM', endTime: '2 PM', color: 'peach' as const, category: 'task' as const },
    { title: 'DSA Revision', time: '4 - 5:30 PM', startTime: '4 PM', endTime: '6 PM', color: 'yellow' as const, category: 'focus' as const },
    { title: 'Gym', time: '7 - 9 PM', startTime: '6 PM', endTime: '8 PM', color: 'purple' as const, category: 'personal' as const },
    { title: 'Study DSA', time: '9 - 11 AM', startTime: '8 AM', endTime: '10 AM', color: 'purple' as const, category: 'focus' as const },
    { title: 'Project Work', time: '2 - 4 PM', startTime: '2 PM', endTime: '4 PM', color: 'blue' as const, category: 'task' as const }
  ];

  const handleQuickSchedule = (tpl: any) => {
    addPlannerBlock({
      title: tpl.title,
      day: 'Mon',
      startTime: tpl.startTime,
      endTime: tpl.endTime,
      timeLabel: tpl.time,
      category: tpl.category,
      color: tpl.color,
      completed: false
    });
  };

  const handleGridCellClick = (day: any, row: string) => {
    setEditingScheduleBlock(null);
    setIsScheduleModalOpen(true);
  };

  const handleBlockClick = (e: React.MouseEvent, block: PlannerBlock) => {
    e.stopPropagation();
    setEditingScheduleBlock(block);
    setIsScheduleModalOpen(true);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mint':
        return 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]';
      case 'peach':
        return 'bg-[#FDF0ED] text-[#C34E32] border-[#F6DCD6]';
      case 'yellow':
        return 'bg-[#FEF7E6] text-[#A1741F] border-[#F6E6BF]';
      case 'purple':
        return 'bg-[#F5EEFD] text-[#5344B5] border-[#E3D1F7]';
      case 'blue':
        return 'bg-[#EEF4FF] text-[#256E93] border-[#D3E2FA]';
      default:
        return 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & leaf */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight flex items-center gap-2">
            <span>Weekly Planner</span>
            <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
              <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            View your commitments and schedule your tasks for the week.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCalendarICS}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-bold text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5]"
            title="Export .ics Calendar"
          >
            <Download className="w-3.5 h-3.5 text-[#1E3A2B]" />
            <span>Export Calendar</span>
          </button>

          <button
            onClick={() => { setEditingScheduleBlock(null); setIsScheduleModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Block</span>
          </button>
        </div>
      </div>

      {/* 2. Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Today, < >, Dates */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setWeekOffset(0); showToast('Jumped to current week', 'info'); }}
            className="px-3.5 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-bold text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5]"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1 hover:bg-[#EDE9DF] rounded-lg text-[#58615A]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-[#1E2621] px-2 font-mono whitespace-nowrap">
              {daysHeader[0].date} - {daysHeader[6].date} 2026
            </span>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1 hover:bg-[#EDE9DF] rounded-lg text-[#58615A]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Auto-Schedule with Kairo + View Modes */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={autoScheduleWithKairo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-[#236B43] border border-[#D5EADB] text-xs font-bold shadow-2xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#236B43]/20" />
            <span>Auto-Schedule with Kairo</span>
          </button>

          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E8E2D5] shadow-2xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-[#1E3A2B] text-white shadow-2xs' : 'text-[#7A837C] hover:text-[#1E2621]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-[#1E3A2B] text-white shadow-2xs' : 'text-[#7A837C] hover:text-[#1E2621]'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* 3. Timetable Grid Layout */}
      {viewMode === 'week' ? (
        <div className="rounded-3xl bg-white border border-[#E8E2D5] shadow-card overflow-hidden">
          {/* Header row: Days of the week */}
          <div className="grid grid-cols-8 border-b border-[#F2ECE1] bg-[#FBF9F5] text-center text-xs">
            <div className="p-3 text-[10px] font-bold text-[#8C958E] uppercase tracking-wider border-r border-[#F2ECE1] flex items-center justify-center">
              Time
            </div>
            {daysHeader.map((d, idx) => (
              <div
                key={idx}
                className={`p-3 font-semibold ${idx !== 6 ? 'border-r border-[#F2ECE1]' : ''}`}
              >
                <span className="block font-bold text-[#1E2621]">{d.day}</span>
                <span className="block text-[11px] text-[#7A837C] font-mono">{d.date}</span>
              </div>
            ))}
          </div>

          {/* Time Rows (8 AM to 8 PM) */}
          <div className="divide-y divide-[#F2ECE1]">
            {timeRows.map(row => (
              <div key={row} className="grid grid-cols-8 min-h-[72px]">
                {/* Time Label on left */}
                <div className="p-3 text-right text-[11px] font-mono text-[#7A837C] font-semibold border-r border-[#F2ECE1] bg-[#FBF9F5] select-none flex items-start justify-end">
                  {row}
                </div>

                {/* 7 Columns for Days */}
                {daysHeader.map((d, colIdx) => {
                  const blocksInSlot = plannerBlocks.filter(
                    b => b.day === d.day && b.startTime === row
                  );

                  return (
                    <div
                      key={colIdx}
                      onClick={() => handleGridCellClick(d.day, row)}
                      className={`p-1.5 cursor-pointer hover:bg-[#FDFCF9] transition-colors relative ${
                        colIdx !== 6 ? 'border-r border-[#F2ECE1]' : ''
                      }`}
                    >
                      {blocksInSlot.map(b => (
                        <div
                          key={b.id}
                          onClick={e => handleBlockClick(e, b)}
                          className={`p-2 rounded-2xl text-[11px] font-bold border transition-all mb-1 cursor-pointer hover:scale-102 shadow-2xs ${getColorClasses(
                            b.color
                          )}`}
                          title={`${b.title} (${b.timeLabel}) - Click to edit`}
                        >
                          <div className="leading-tight truncate">{b.title}</div>
                          <div className="text-[9px] font-mono opacity-80 mt-0.5">{b.timeLabel}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Month Grid View */
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="grid grid-cols-7 text-center font-bold text-xs text-[#7A837C] pb-2 border-b border-[#F2ECE1]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => (
              <div
                key={dayNum}
                onClick={() => { setViewMode('week'); showToast(`Opening schedule for Oct ${dayNum}`, 'info'); }}
                className="h-20 p-2 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE] hover:border-[#1E3A2B] cursor-pointer flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-[#1E2621]">{dayNum}</span>
                {dayNum % 4 === 0 && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-[#EAF4EE] text-[#236B43] truncate font-semibold">
                    Focus Block
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Lower Section: Today's Agenda (Fixed text-wrapping) & Quick Schedule & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Agenda (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">Today's Agenda</h3>
            <button
              onClick={() => { setEditingScheduleBlock(null); setIsScheduleModalOpen(true); }}
              className="text-xs font-bold text-[#1E3A2B] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {agendaItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleAgendaItem(item.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white' : 'border-[#B8B0A2] bg-white'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <span className="text-xs font-mono font-bold text-[#6C766F] whitespace-nowrap">
                    {item.time}
                  </span>

                  <span className={`text-xs font-bold truncate ${item.completed ? 'line-through text-[#8C958E]' : 'text-[#1E2621]'}`}>
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E2D5] text-[#58615A]">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-[#7A837C] font-mono hidden sm:inline-block">
                    {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Schedule + Pending Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Schedule Templates (3x2 Grid) */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <h4 className="text-xs font-bold text-[#1E2621]">Quick Schedule (Click to Add)</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickScheduleTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSchedule(tpl)}
                  className="p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] text-left transition-all group"
                >
                  <div className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors truncate">
                    {tpl.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#7A837C] mt-0.5">{tpl.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pending Commitments to Schedule */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#F2ECE1]">
              <h4 className="text-xs font-bold text-[#1E2621]">Pending Commitments</h4>
              <span className="text-[10px] font-mono text-[#7A837C]">
                {commitments.filter(c => c.status !== 'completed').length} left
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {commitments.filter(c => c.status !== 'completed').map(com => (
                <div
                  key={com.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#EDE8DE]"
                >
                  <div className="min-w-0 pr-2">
                    <h5 className="text-xs font-bold text-[#1E2621] truncate">{com.title}</h5>
                    <span className="text-[10px] text-[#7A837C] font-mono">{com.dueDate} • {com.estimatedHours}h</span>
                  </div>

                  <button
                    onClick={() => {
                      addPlannerBlock({
                        title: com.title,
                        day: 'Mon',
                        startTime: '4 PM',
                        endTime: '6 PM',
                        timeLabel: '4 - 6 PM',
                        category: 'task',
                        color: 'mint',
                        completed: false
                      });
                    }}
                    className="p-1.5 rounded-xl bg-[#EAF4EE] text-[#236B43] hover:bg-[#DEEFE4] text-xs font-bold flex items-center gap-1 flex-shrink-0"
                    title="Schedule into timetable"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Slot</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
