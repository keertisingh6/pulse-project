import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
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
  MoreHorizontal
} from 'lucide-react';

export const CommitmentsView: React.FC = () => {
  const {
    commitments,
    addCommitment,
    deleteCommitment,
    advanceCommitmentSubtask,
    isCommitmentModalOpen,
    setIsCommitmentModalOpen,
    setCurrentView,
    setIsKairoDrawerOpen,
    showToast
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'all' | 'assignments' | 'exams' | 'labs' | 'hackathons' | 'projects'>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(27);

  // 6 Primary Commitments matching Screenshot 3
  const [commitmentItems, setCommitmentItems] = useState([
    {
      id: 'c-1',
      title: 'DSA Assignment 5',
      type: 'Assignment',
      subject: 'Data Structures',
      date: '13 Oct 2025 Mon',
      priority: 'High',
      priorityColor: 'bg-[#FDF0ED] text-[#C34E32]',
      hours: '2h',
      completedSubtasks: 2,
      totalSubtasks: 5,
      iconType: 'assignment'
    },
    {
      id: 'c-2',
      title: 'PBL-III Lab Report',
      type: 'Lab',
      subject: 'AVL Tree',
      date: '27 Oct 2025 Mon',
      priority: 'Medium',
      priorityColor: 'bg-[#FEF7E6] text-[#A1741F]',
      hours: '4h',
      completedSubtasks: 3,
      totalSubtasks: 7,
      iconType: 'lab'
    },
    {
      id: 'c-3',
      title: 'Software Engineering CCA',
      type: 'Exam',
      subject: 'Unit 1-3',
      date: '3 Nov 2025 Mon',
      priority: 'High',
      priorityColor: 'bg-[#FDF0ED] text-[#C34E32]',
      hours: '5h',
      completedSubtasks: 1,
      totalSubtasks: 6,
      iconType: 'exam'
    },
    {
      id: 'c-4',
      title: 'Technovision Hackathon',
      type: 'Hackathon',
      subject: 'Project Development',
      date: '20 Oct 2025 Mon',
      priority: 'Medium',
      priorityColor: 'bg-[#FEF7E6] text-[#A1741F]',
      hours: '6h',
      completedSubtasks: 4,
      totalSubtasks: 8,
      iconType: 'hackathon'
    },
    {
      id: 'c-5',
      title: 'DBMS Assignment 2',
      type: 'Assignment',
      subject: 'DBMS',
      date: '28 Oct 2025 Tue',
      priority: 'Low',
      priorityColor: 'bg-[#EAF4EE] text-[#236B43]',
      hours: '2h',
      completedSubtasks: 0,
      totalSubtasks: 4,
      iconType: 'assignment'
    },
    {
      id: 'c-6',
      title: 'Read Research Paper',
      type: 'Personal',
      subject: 'Research',
      date: '18 Oct 2025 Sat',
      priority: 'Low',
      priorityColor: 'bg-[#EAF4EE] text-[#236B43]',
      hours: '1h',
      completedSubtasks: 1,
      totalSubtasks: 3,
      iconType: 'paper'
    }
  ]);

  const advanceSubtask = (id: string) => {
    setCommitmentItems(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const next = c.completedSubtasks < c.totalSubtasks ? c.completedSubtasks + 1 : 0;
        return { ...c, completedSubtasks: next };
      })
    );
    showToast('Updated subtask progress!', 'success');
  };

  // Recently Completed items matching Screenshot 3
  const recentlyCompleted = [
    { title: 'Linked List Assignment', subject: 'Data Structures', date: '5 Oct 2025' },
    { title: 'CN Lab Experiment 3', subject: 'Computer Networks', date: '1 Oct 2025' },
    { title: 'AI Quiz 2', subject: 'AI & ML', date: '28 Sep 2025' }
  ];

  // Later This Month items matching Screenshot 3
  const laterThisMonth = [
    { title: 'Threaded Binary Tree', type: 'Assignment', date: '3 Nov 2025' },
    { title: 'SE CCA', type: 'Exam', date: '3 Nov 2025' },
    { title: 'Project Phase 1', type: 'Project', date: '15 Nov 2025' }
  ];

  // Calendar days generation for October 2025 (Starts on Wednesday, 1 Oct)
  const calendarDays = [
    29, 30, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 1, 2
  ];

  const dotDates = [6, 7, 8, 13, 14, 15, 20, 21, 27, 28];

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
          onClick={() => setIsCommitmentModalOpen(true)}
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
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            All (6)
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'assignments'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            Assignments (3)
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'exams'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            Exams (1)
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'labs'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            Labs (1)
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'hackathons'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            Hackathons (1)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            Projects (0)
          </button>
        </div>

        {/* Right Sort & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2621] bg-white px-3 py-1.5 rounded-2xl border border-[#E8E2D5] shadow-2xs cursor-pointer">
            <span>Sort: Deadline</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E7570]" />
          </div>

          <button
            onClick={() => showToast('Opening commitment filters', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5]"
          >
            <Filter className="w-3.5 h-3.5 text-[#6E7570]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): 6 Commitments Rows + Lower Two Cards */}
        <div className="lg:col-span-8 space-y-5">
          {/* 6 Commitments Rows */}
          <div className="space-y-2.5">
            {commitmentItems.map(item => {
              const progressRatio = item.totalSubtasks > 0 ? (item.completedSubtasks / item.totalSubtasks) * 100 : 0;

              return (
                <div
                  key={item.id}
                  className="p-3.5 px-4 rounded-3xl bg-white border border-[#E8E2D5] shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    {/* Icon Tile */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ${
                        item.iconType === 'assignment'
                          ? 'bg-[#EAF4EE] text-[#236B43]'
                          : item.iconType === 'lab'
                          ? 'bg-[#F0EFFE] text-[#5344B5]'
                          : item.iconType === 'exam'
                          ? 'bg-[#FDF0ED] text-[#C34E32]'
                          : item.iconType === 'hackathon'
                          ? 'bg-[#FEF7E6] text-[#A1741F]'
                          : 'bg-[#FDF0ED] text-[#C34E32]'
                      }`}
                    >
                      {item.iconType === 'assignment' ? (
                        <FileText className="w-4 h-4" />
                      ) : item.iconType === 'lab' ? (
                        <FlaskConical className="w-4 h-4" />
                      ) : item.iconType === 'exam' ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : item.iconType === 'hackathon' ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors whitespace-nowrap truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded-md bg-[#F4EFE6] text-[#58615A] flex-shrink-0">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-[#7A837C] truncate">
                          {item.subject}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-[#A4AAA6]" />
                      <span>{item.date}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${item.priorityColor}`}>
                      {item.priority}
                    </span>

                    <div className="flex items-center gap-1 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[#A4AAA6]" />
                      <span>{item.hours}</span>
                    </div>

                    {/* Subtask progress bar with click to advance */}
                    <div
                      onClick={() => advanceSubtask(item.id)}
                      className="w-16 sm:w-20 cursor-pointer flex-shrink-0"
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

                    <span className="text-xs text-[#A4AAA6] group-hover:text-[#1E2621] cursor-pointer flex-shrink-0">
                      ···
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lower Two Cards: Recently Completed & Later This Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Recently Completed */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">Recently Completed</h4>
                <button className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5">
                  <span>View All</span>
                  <span className="text-xs">→</span>
                </button>
              </div>

              <div className="space-y-2">
                {recentlyCompleted.map((rc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-bold text-[#1E2621]">{rc.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#58615A]">
                        {rc.subject}
                      </span>
                      <span className="text-[10px] text-[#A4AAA6] font-mono">{rc.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Later This Month */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">Later This Month</h4>
                <button className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5">
                  <span>View All</span>
                  <span className="text-xs">→</span>
                </button>
              </div>

              <div className="space-y-2">
                {laterThisMonth.map((lt, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-[#B8B0A2] bg-white" />
                      <span className="font-bold text-[#1E2621]">{lt.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#58615A]">
                        {lt.type}
                      </span>
                      <span className="text-[10px] text-[#A4AAA6] font-mono">{lt.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): October 2025 Calendar + Donut + Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* October 2025 Calendar Widget */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E2621]">October 2025</h3>
              <div className="flex items-center gap-1 text-[#58615A]">
                <button className="p-1 hover:bg-[#EDE9DF] rounded-lg">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:bg-[#EDE9DF] rounded-lg">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#7A837C]">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((day, idx) => {
                const isCurrentMonth = !(idx < 2 || idx > 32);
                const isSelected = day === selectedCalendarDate && isCurrentMonth;
                const is13 = day === 13 && isCurrentMonth;
                const is20 = day === 20 && isCurrentMonth;
                const hasDot = dotDates.includes(day) && isCurrentMonth;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isCurrentMonth) setSelectedCalendarDate(day);
                    }}
                    className={`h-7 rounded-full flex flex-col items-center justify-center relative text-[11px] transition-all ${
                      isSelected
                        ? 'bg-[#1E3A2B] text-white font-bold shadow-xs'
                        : is13
                        ? 'bg-[#FDF0ED] text-[#C34E32] font-bold'
                        : is20
                        ? 'bg-[#FEF7E6] text-[#A1741F] font-bold'
                        : isCurrentMonth
                        ? 'text-[#1E2621] hover:bg-[#F2ECE1]'
                        : 'text-[#C5BCAC]'
                    }`}
                  >
                    <span>{day}</span>
                    {hasDot && !isSelected && !is13 && !is20 && (
                      <span className="w-1 h-1 rounded-full bg-[#1E3A2B] absolute bottom-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commitment Overview Donut Widget */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <h4 className="text-xs font-bold text-[#1E2621]">Commitment Overview</h4>

            <div className="flex items-center justify-between gap-2 py-1">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#EDE8DE"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#1E3A2B"
                    strokeWidth="4.2"
                    strokeDasharray="88"
                    strokeDashoffset="28"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#FDF0ED"
                    strokeWidth="4.2"
                    strokeDasharray="88"
                    strokeDashoffset="70"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center select-none">
                  <span className="text-base font-extrabold text-[#1E2621] block leading-none">6</span>
                  <span className="text-[9px] text-[#7A837C]">Total</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] font-semibold flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1E3A2B]" />
                    <span className="text-[#58615A]">Assignments</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FDF0ED]" />
                    <span className="text-[#58615A]">Exams</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F0EFFE]" />
                    <span className="text-[#58615A]">Labs</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FEF7E6]" />
                    <span className="text-[#58615A]">Hackathons</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EDE8DE]" />
                    <span className="text-[#58615A]">Others</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (2x2 Grid) */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-2.5">
            <h4 className="text-xs font-bold text-[#1E2621]">Quick Actions</h4>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={() => setIsCommitmentModalOpen(true)}
                className="p-3 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-left transition-all flex items-center gap-2 group"
              >
                <FileText className="w-4 h-4 text-[#236B43]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Add<br />Commitment</span>
              </button>

              <button
                onClick={() => setCurrentView('planner')}
                className="p-3 rounded-2xl bg-[#FDF0ED] hover:bg-[#FBE4DF] text-left transition-all flex items-center gap-2 group"
              >
                <Calendar className="w-4 h-4 text-[#C34E32]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Plan<br />My Week</span>
              </button>

              <button
                onClick={() => setCurrentView('goals')}
                className="p-3 rounded-2xl bg-[#FEF7E6] hover:bg-[#F6E6BF] text-left transition-all flex items-center gap-2 group"
              >
                <Target className="w-4 h-4 text-[#A1741F]" />
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">Set a Goal</span>
              </button>

              <button
                onClick={() => setIsKairoDrawerOpen(true)}
                className="p-3 rounded-2xl bg-[#F0EFFE] hover:bg-[#E3D1F7] text-left transition-all flex items-center gap-2 group"
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