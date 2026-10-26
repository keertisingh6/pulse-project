import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Commitment, CommitmentType } from '../../types';
import {
  FileText,
  FlaskConical,
  GraduationCap,
  Trophy,
  Calendar,
  Clock,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Filter,
  Check,
  Bookmark,
  Target,
  User,
  MoreVertical,
  Play,
  Edit2,
  Trash2
} from 'lucide-react';

export const CommitmentsView: React.FC = () => {
  const {
    commitments,
    deleteCommitment,
    advanceCommitmentSubtask,
    setEditingCommitment,
    setIsCommitmentModalOpen,
    setIsGoalModalOpen,
    setCurrentView,
    setIsKairoDrawerOpen,
    startFocusOnTask,
    showToast
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'all' | 'assignments' | 'exams' | 'labs' | 'hackathons'>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'hours'>('deadline');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter commitments based on tab, priority, and calendar date
  let filtered = commitments.filter(c => {
    if (activeTab === 'assignments' && c.type !== 'assignment') return false;
    if (activeTab === 'exams' && c.type !== 'exam') return false;
    if (activeTab === 'labs' && c.type !== 'lab') return false;
    if (activeTab === 'hackathons' && c.type !== 'hackathon') return false;

    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;

    if (selectedCalendarDate !== null) {
      const dayMatches = c.dueDate.includes(`${selectedCalendarDate} `) || c.dueDate.includes(`0${selectedCalendarDate} `);
      if (!dayMatches) return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'priority') {
      const weight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    }
    if (sortBy === 'hours') {
      return (b.estimatedHours || 0) - (a.estimatedHours || 0);
    }
    return 0; // Default deadline order
  });

  // Overview stats
  const totalSubtasksCount = commitments.reduce((acc, c) => acc + c.totalSubtasks, 0);
  const completedSubtasksCount = commitments.reduce((acc, c) => acc + c.completedSubtasks, 0);
  const completionPercentage = totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 60;

  const assignmentsCount = commitments.filter(c => c.type === 'assignment').length;
  const examsCount = commitments.filter(c => c.type === 'exam').length;
  const labsCount = commitments.filter(c => c.type === 'lab').length;
  const hackathonsCount = commitments.filter(c => c.type === 'hackathon').length;

  const recentlyCompleted = commitments.filter(
    c => c.status === 'completed' || c.completedSubtasks === c.totalSubtasks
  );

  const upcomingLater = commitments.filter(
    c => c.status !== 'completed' && c.completedSubtasks < c.totalSubtasks
  ).slice(0, 3);

  const handleStartFocus = (com: Commitment) => {
    setActiveMenuId(null);
    startFocusOnTask(com.id);
    setCurrentView('focus');
  };

  const handleEdit = (com: Commitment) => {
    setActiveMenuId(null);
    setEditingCommitment(com);
    setIsCommitmentModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setActiveMenuId(null);
    deleteCommitment(id);
  };

  // Calendar dates
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarCells = [
    29, 30, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 1, 2
  ];
  const dotDates = [13, 20, 27, 28];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & + Add Commitment button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight flex items-center gap-2">
            <span>Commitments</span>
            <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
              <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Track all your assignments, exams, labs and hackathons in one place.
          </p>
        </div>

        <button
          onClick={() => { setEditingCommitment(null); setIsCommitmentModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commitment</span>
        </button>
      </div>

      {/* 2. Filter Tabs & Sort/Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: `All (${commitments.length})` },
            { id: 'assignments', label: `Assignments (${assignmentsCount})` },
            { id: 'exams', label: `Exams (${examsCount})` },
            { id: 'labs', label: `Labs (${labsCount})` },
            { id: 'hackathons', label: `Hackathons (${hackathonsCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Sort & Filter Controls */}
        <div className="flex items-center gap-2">
          {selectedCalendarDate && (
            <button
              onClick={() => setSelectedCalendarDate(null)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FDF0ED] text-[#C34E32] text-xs font-bold border border-[#F6DCD6]"
            >
              <span>Date: {selectedCalendarDate} Oct</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2621] bg-white px-3 py-1.5 rounded-2xl border border-[#E8E2D5] shadow-2xs hover:bg-[#FBF9F5]"
            >
              <span>Sort: {sortBy === 'deadline' ? 'Deadline' : sortBy === 'priority' ? 'Priority' : 'Duration'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E7570]" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 top-9 z-20 w-36 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                <button
                  onClick={() => { setSortBy('deadline'); setIsSortDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                >
                  Deadline
                </button>
                <button
                  onClick={() => { setSortBy('priority'); setIsSortDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                >
                  Priority
                </button>
                <button
                  onClick={() => { setSortBy('hours'); setIsSortDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                >
                  Effort (Hours)
                </button>
              </div>
            )}
          </div>

          {/* Filter Priority Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5]"
            >
              <Filter className="w-3.5 h-3.5 text-[#6E7570]" />
              <span>{filterPriority === 'all' ? 'Filter' : `Priority: ${filterPriority}`}</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-9 z-20 w-36 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                {['all', 'high', 'medium', 'low'].map(p => (
                  <button
                    key={p}
                    onClick={() => { setFilterPriority(p); setIsFilterOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5] capitalize"
                  >
                    {p === 'all' ? 'All Priorities' : p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Commitments Rows + Lower Two Cards */}
        <div className="lg:col-span-8 space-y-5">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E8E2D5] text-center space-y-2">
              <p className="text-xs text-[#7A837C]">No commitments match this filter.</p>
              <button
                onClick={() => { setActiveTab('all'); setFilterPriority('all'); setSelectedCalendarDate(null); }}
                className="text-xs font-bold text-[#1E3A2B] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map(item => {
                const progressRatio = item.totalSubtasks > 0 ? (item.completedSubtasks / item.totalSubtasks) * 100 : 0;
                const isCompleted = item.status === 'completed' || item.completedSubtasks === item.totalSubtasks;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 px-4 rounded-3xl bg-white border border-[#E8E2D5] shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group relative"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      {/* Icon Tile */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ${
                          item.type === 'assignment'
                            ? 'bg-[#EAF4EE] text-[#236B43]'
                            : item.type === 'lab'
                            ? 'bg-[#F0EFFE] text-[#5344B5]'
                            : item.type === 'exam'
                            ? 'bg-[#FDF0ED] text-[#C34E32]'
                            : 'bg-[#FEF7E6] text-[#A1741F]'
                        }`}
                      >
                        {item.type === 'assignment' ? (
                          <FileText className="w-4 h-4" />
                        ) : item.type === 'lab' ? (
                          <FlaskConical className="w-4 h-4" />
                        ) : item.type === 'exam' ? (
                          <GraduationCap className="w-4 h-4" />
                        ) : (
                          <Trophy className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-bold transition-colors whitespace-nowrap truncate ${
                            isCompleted ? 'line-through text-[#8C958E]' : 'text-[#1E2621] group-hover:text-[#1E3A2B]'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                          <span className="text-[10px] font-medium px-2 py-0.2 rounded-md bg-[#F4EFE6] text-[#58615A] flex-shrink-0 uppercase">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-[#7A837C] truncate">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-[#A4AAA6]" />
                        <span>{item.dueDate}</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap capitalize ${
                          item.priority === 'urgent' || item.priority === 'high'
                            ? 'bg-[#FDF0ED] text-[#C34E32]'
                            : item.priority === 'medium'
                            ? 'bg-[#FEF7E6] text-[#A1741F]'
                            : 'bg-[#EAF4EE] text-[#236B43]'
                        }`}
                      >
                        {item.priority}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-[#A4AAA6]" />
                        <span>{item.estimatedHours}h</span>
                      </div>

                      {/* Subtask progress bar with click to advance */}
                      <div
                        onClick={() => advanceCommitmentSubtask(item.id)}
                        className="w-16 sm:w-20 cursor-pointer flex-shrink-0 hover:scale-105 transition-transform"
                        title="Click to advance subtask"
                      >
                        <div className="text-[10px] font-bold text-[#1E2621] text-right font-mono mb-1">
                          {item.completedSubtasks}/{item.totalSubtasks}
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#EDE8DE] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1E3A2B] transition-all duration-300"
                            style={{ width: `${progressRatio}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartFocus(item)}
                        className="p-1.5 rounded-xl hover:bg-[#EDE9DF] text-[#1E3A2B] transition-colors"
                        title="Start Focus Session"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg text-[#A4AAA6] hover:text-[#1E2621] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-7 z-20 w-36 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                            <button
                              onClick={() => handleStartFocus(item)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E2621] hover:bg-[#FBF9F5] flex items-center gap-2"
                            >
                              <Play className="w-3.5 h-3.5 text-[#1E3A2B]" />
                              <span>Start Focus</span>
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E2621] hover:bg-[#FBF9F5] flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#58615A]" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C34E32] hover:bg-[#FDF0ED] flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lower Two Cards: Recently Completed & Later This Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Recently Completed */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">Recently Completed</h4>
                <span className="text-xs text-[#236B43] font-bold">
                  {recentlyCompleted.length} done
                </span>
              </div>

              <div className="space-y-2">
                {recentlyCompleted.length === 0 ? (
                  <p className="text-xs text-[#7A837C] py-2 italic">No completed commitments yet.</p>
                ) : (
                  recentlyCompleted.slice(0, 3).map((rc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#236B43]" />
                        <span className="font-semibold text-[#1E2621] line-through text-[#8C958E]">{rc.title}</span>
                      </div>
                      <span className="text-[10px] text-[#7A837C] font-mono">{rc.dueDate}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Card 2: Later This Month */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">Later This Month</h4>
                <button
                  onClick={() => setCurrentView('planner')}
                  className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5"
                >
                  <span>Schedule</span>
                  <span className="text-xs">→</span>
                </button>
              </div>

              <div className="space-y-2">
                {upcomingLater.map((it, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStartFocus(it)}
                    className="flex items-center justify-between text-xs py-1 cursor-pointer hover:bg-[#FBF9F5] rounded-lg px-1 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2B]" />
                      <span className="font-semibold text-[#1E2621]">{it.title}</span>
                    </div>
                    <span className="text-[10px] text-[#7A837C] font-mono">{it.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Calendar Widget + Overview Donut + Quick Actions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Calendar Widget */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
              <span className="text-xs font-bold text-[#1E2621]">October 2026</span>
              <div className="flex items-center gap-1 text-[#8C958E]">
                <button className="p-1 hover:text-[#1E2621]">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:text-[#1E2621]">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#7A837C]">
              {daysOfWeek.map((d, i) => (
                <span key={i} className="py-1">{d}</span>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 text-center text-xs gap-y-1">
              {calendarCells.map((date, idx) => {
                const isCurrentMonth = idx >= 2 && idx <= 32;
                const isSelected = selectedCalendarDate === date && isCurrentMonth;
                const hasDot = dotDates.includes(date) && isCurrentMonth;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isCurrentMonth) {
                        setSelectedCalendarDate(selectedCalendarDate === date ? null : date);
                        showToast(`Filtered for ${date} Oct`, 'info');
                      }
                    }}
                    className={`h-7 w-7 mx-auto rounded-full flex flex-col items-center justify-center text-[11px] relative transition-all ${
                      !isCurrentMonth
                        ? 'text-[#C5BCAC] cursor-default'
                        : isSelected
                        ? 'bg-[#1E3A2B] text-white font-bold'
                        : 'text-[#1E2621] hover:bg-[#F2ECE1] font-medium'
                    }`}
                  >
                    <span>{date}</span>
                    {hasDot && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#1E3A2B] absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commitment Overview Donut */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <h4 className="text-xs font-bold text-[#1E2621]">Commitment Overview</h4>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#EDE8DE" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#1E3A2B"
                    strokeWidth="4.2"
                    strokeDasharray="88"
                    strokeDashoffset={88 - (completionPercentage / 100) * 88}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center select-none">
                  <span className="text-lg font-extrabold text-[#1E2621] font-sans block leading-none">
                    {completionPercentage}%
                  </span>
                  <span className="text-[9px] text-[#7A837C] font-semibold mt-0.5 block">
                    Completed
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-semibold flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EAF4EE] border border-[#236B43]" />
                    <span className="text-[#58615A]">Assignments</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">{assignmentsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FDF0ED] border border-[#C34E32]" />
                    <span className="text-[#58615A]">Exams</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">{examsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F0EFFE] border border-[#5344B5]" />
                    <span className="text-[#58615A]">Labs</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">{labsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FEF7E6] border border-[#A1741F]" />
                    <span className="text-[#58615A]">Hackathons</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">{hackathonsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (2x2 Grid) */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-2.5">
            <h4 className="text-xs font-bold text-[#1E2621]">Quick Actions</h4>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={() => { setEditingCommitment(null); setIsCommitmentModalOpen(true); }}
                className="p-3 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-left transition-all flex items-center gap-2 group cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#236B43]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Add<br />Commitment</span>
              </button>

              <button
                onClick={() => setCurrentView('planner')}
                className="p-3 rounded-2xl bg-[#FDF0ED] hover:bg-[#FBE4DF] text-left transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C34E32]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Plan<br />My Week</span>
              </button>

              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="p-3 rounded-2xl bg-[#FEF7E6] hover:bg-[#F6E6BF] text-left transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Target className="w-4 h-4 text-[#A1741F]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Set a Goal</span>
              </button>

              <button
                onClick={() => setIsKairoDrawerOpen(true)}
                className="p-3 rounded-2xl bg-[#F0EFFE] hover:bg-[#E3D1F7] text-left transition-all flex items-center gap-2 group cursor-pointer"
              >
                <User className="w-4 h-4 text-[#5344B5]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Ask Kairo (AI)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
