import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Calendar,
  Sparkles,
  ChevronRight,
  Check,
  Bookmark,
  Target,
  User,
  ArrowRight,
  Clock,
  MoreVertical,
  FileText,
  FlaskConical,
  BookOpen,
  ChevronDown,
  Play,
  Edit2,
  Trash2,
  Trophy,
  GraduationCap
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    commitments,
    deleteCommitment,
    advanceCommitmentSubtask,
    setEditingCommitment,
    startFocusOnTask,
    setCurrentView,
    setIsCommitmentModalOpen,
    setIsGoalModalOpen,
    setIsKairoDrawerOpen,
    showToast
  } = usePulse();

  const [activeTaskMenuId, setActiveTaskMenuId] = useState<string | null>(null);
  const [progressPeriod, setProgressPeriod] = useState<'this_week' | 'last_week' | 'this_month'>('this_week');
  const [isProgressDropdownOpen, setIsProgressDropdownOpen] = useState(false);
  const [chartMetric, setChartMetric] = useState<'hours' | 'tasks'>('hours');
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);

  // Dynamic calculations from commitments
  const totalSubtasksCount = commitments.reduce((acc, c) => acc + c.totalSubtasks, 0);
  const completedSubtasksCount = commitments.reduce((acc, c) => acc + c.completedSubtasks, 0);
  const completionPercentage = totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 60;

  const completedCount = commitments.filter(c => c.status === 'completed' || c.completedSubtasks === c.totalSubtasks).length;
  const inProgressCount = commitments.filter(c => c.status === 'in_progress' || (c.completedSubtasks > 0 && c.completedSubtasks < c.totalSubtasks)).length;
  const pendingCount = commitments.filter(c => c.status === 'pending' && c.completedSubtasks === 0).length;

  // Study hours data for the 7-day capsule bar chart (matching screenshot 1)
  const studyHoursData = chartMetric === 'hours' ? [
    { day: 'Mon', date: '27', value: '2h', height: 40 },
    { day: 'Tue', date: '28', value: '4h', height: 75 },
    { day: 'Wed', date: '29', value: '3h', height: 60 },
    { day: 'Thu', date: '30', value: '5h', height: 95 },
    { day: 'Fri', date: '31', value: '2h', height: 40 },
    { day: 'Sat', date: '1', value: '1h', height: 25 },
    { day: 'Sun', date: '2', value: '0h', height: 0 }
  ] : [
    { day: 'Mon', date: '27', value: '3', height: 60 },
    { day: 'Tue', date: '28', value: '5', height: 85 },
    { day: 'Wed', date: '29', value: '4', height: 70 },
    { day: 'Thu', date: '30', value: '6', height: 100 },
    { day: 'Fri', date: '31', value: '2', height: 40 },
    { day: 'Sat', date: '1', value: '1', height: 20 },
    { day: 'Sun', date: '2', value: '0', height: 0 }
  ];

  const handleStartFocus = (com: any) => {
    setActiveTaskMenuId(null);
    startFocusOnTask(com.id);
    setCurrentView('focus');
  };

  const handleEditCommitment = (com: any) => {
    setActiveTaskMenuId(null);
    setEditingCommitment(com);
    setIsCommitmentModalOpen(true);
  };

  const handleDeleteCommitment = (id: string) => {
    setActiveTaskMenuId(null);
    deleteCommitment(id);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Hero Section: Greeting + 4 Action Buttons + Cozy Desk Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side (7 cols): Greeting & 4 Quick Action Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Greeting */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#1E2621] tracking-tight flex items-center gap-2">
              <span>Hello, Student!</span>
              <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
                <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </h2>
            <p className="text-xs text-[#6E7570] font-sans">
              Small steps, steady progress.
            </p>
          </div>

          {/* 4 Action Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Add Commitment */}
            <div
              onClick={() => { setEditingCommitment(null); setIsCommitmentModalOpen(true); }}
              className="p-4 rounded-3xl bg-[#EAF4EE] hover:bg-[#DEEFE4] cursor-pointer transition-all flex flex-col justify-between h-28 border border-[#D5EADB] relative group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-[#236B43] shadow-2xs">
                <Bookmark className="w-4 h-4 fill-[#236B43]/20" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">
                  Add<br />Commitment
                </span>
                <span className="text-xs text-[#236B43] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </div>

            {/* Card 2: Plan My Week */}
            <div
              onClick={() => setCurrentView('planner')}
              className="p-4 rounded-3xl bg-[#FDF0ED] hover:bg-[#FBE4DF] cursor-pointer transition-all flex flex-col justify-between h-28 border border-[#F6DCD6] relative group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-[#C34E32] shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">
                  Plan<br />My Week
                </span>
                <span className="text-xs text-[#C34E32] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </div>

            {/* Card 3: Set a Goal */}
            <div
              onClick={() => setIsGoalModalOpen(true)}
              className="p-4 rounded-3xl bg-[#FEF7E6] hover:bg-[#F6E6BF] cursor-pointer transition-all flex flex-col justify-between h-28 border border-[#F6E6BF] relative group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-[#A1741F] shadow-2xs">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">
                  Set a Goal
                </span>
                <span className="text-xs text-[#A1741F] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </div>

            {/* Card 4: Ask Kairo */}
            <div
              onClick={() => setIsKairoDrawerOpen(true)}
              className="p-4 rounded-3xl bg-[#EDF5F4] hover:bg-[#DEEFEB] cursor-pointer transition-all flex flex-col justify-between h-28 border border-[#D0E6E2] relative group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-[#256E93] shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-bold text-[#1E2621] leading-tight">
                  Ask Kairo
                </span>
                <span className="text-xs text-[#256E93] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (5 cols): Cozy Aesthetic Desk Visual Banner (matching Screenshot 1) */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-card border border-[#E3DDD0] min-h-[220px] flex flex-col justify-between p-5 bg-gradient-to-br from-[#EFEAE0] via-[#EAE3D4] to-[#DFD6C4]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-multiply"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800')`
            }}
          />

          {/* Sticky notes on screen & laptop quote */}
          <div className="relative z-10 flex flex-col gap-2">
            <div className="self-start p-3 px-3.5 rounded-2xl bg-[#FEFDF9] border border-[#E4DEC8] shadow-sm max-w-[210px]">
              <p className="font-serif italic text-xs text-[#2A342D] leading-snug">
                "A brighter version of you ♡"
              </p>
            </div>
          </div>

          {/* Books quote & water bottle progress quote */}
          <div className="relative z-10 flex items-end justify-between pt-4">
            <div className="text-[10px] font-serif bg-white/90 backdrop-blur-2xs px-2.5 py-1 rounded-xl text-[#3D4840] border border-[#E0D9CB]">
              Good Grades • Better Habits • Brighter Future
            </div>

            <div className="text-[10px] font-serif italic text-right text-[#2A342D] bg-white/80 px-2 py-0.5 rounded-lg border border-[#E0D9CB]">
              Progress over perfection ♡
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Today's Focus Card + Weekly Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Focus Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">
              Today's Focus <span className="text-xs font-normal text-[#7A837C]">({commitments.slice(0, 3).length} tasks • 5h 30m)</span>
            </h3>
            <button
              onClick={() => setCurrentView('commitments')}
              className="text-xs font-semibold text-[#5A635C] hover:text-[#1E3A2B] flex items-center gap-0.5 group"
            >
              <span>View All</span>
              <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {commitments.slice(0, 3).map(com => {
              const isCompleted = com.status === 'completed' || com.completedSubtasks === com.totalSubtasks;
              const priorityClass =
                com.priority === 'urgent' || com.priority === 'high'
                  ? 'bg-[#FDF0ED] text-[#C34E32]'
                  : com.priority === 'medium'
                  ? 'bg-[#FEF7E6] text-[#A1741F]'
                  : 'bg-[#EAF4EE] text-[#236B43]';

              return (
                <div
                  key={com.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FBF9F5] transition-all border border-transparent hover:border-[#EDE8DE] group relative"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle Checkbox */}
                    <button
                      onClick={() => advanceCommitmentSubtask(com.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                          : 'border-[#B8B0A2] hover:border-[#1E3A2B] bg-white'
                      }`}
                      title="Advance subtask"
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {/* Icon Tile */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ${
                        com.type === 'assignment'
                          ? 'bg-[#EAF4EE] text-[#236B43]'
                          : com.type === 'lab'
                          ? 'bg-[#F0EFFE] text-[#5344B5]'
                          : com.type === 'exam'
                          ? 'bg-[#FDF0ED] text-[#C34E32]'
                          : 'bg-[#FEF7E6] text-[#A1741F]'
                      }`}
                    >
                      {com.type === 'assignment' ? (
                        <FileText className="w-4 h-4" />
                      ) : com.type === 'lab' ? (
                        <FlaskConical className="w-4 h-4" />
                      ) : com.type === 'exam' ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Trophy className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold transition-all block truncate ${
                          isCompleted ? 'line-through text-[#9BA29C]' : 'text-[#1E2621]'
                        }`}
                      >
                        {com.title}
                      </span>
                      <span className="text-[10px] text-[#7A837C]">
                        {com.completedSubtasks}/{com.totalSubtasks} subtasks • {com.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${priorityClass}`}>
                      {com.priority}
                    </span>

                    <span className="text-xs font-mono font-semibold text-[#6C766F] w-7 text-right">
                      {com.estimatedHours}h
                    </span>

                    <button
                      onClick={() => handleStartFocus(com)}
                      className="p-1.5 rounded-xl hover:bg-[#EDE9DF] text-[#1E3A2B] transition-colors"
                      title="Start Focus Session"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setActiveTaskMenuId(activeTaskMenuId === com.id ? null : com.id)}
                        className="p-1 rounded-lg text-[#A4AAA6] hover:text-[#1E2621] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeTaskMenuId === com.id && (
                        <div className="absolute right-0 top-7 z-20 w-36 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5 animate-in fade-in duration-150">
                          <button
                            onClick={() => handleStartFocus(com)}
                            className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E2621] hover:bg-[#FBF9F5] flex items-center gap-2"
                          >
                            <Play className="w-3.5 h-3.5 text-[#1E3A2B]" />
                            <span>Start Focus</span>
                          </button>
                          <button
                            onClick={() => handleEditCommitment(com)}
                            className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E2621] hover:bg-[#FBF9F5] flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#58615A]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCommitment(com.id)}
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
        </div>

        {/* Weekly Progress Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">Weekly Progress</h3>
            <div className="relative">
              <button
                onClick={() => setIsProgressDropdownOpen(!isProgressDropdownOpen)}
                className="flex items-center gap-1 text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE] hover:bg-[#EDE9DF]"
              >
                <span>{progressPeriod === 'this_week' ? 'This Week' : progressPeriod === 'last_week' ? 'Last Week' : 'This Month'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isProgressDropdownOpen && (
                <div className="absolute right-0 top-8 z-20 w-32 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                  <button
                    onClick={() => { setProgressPeriod('this_week'); setIsProgressDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => { setProgressPeriod('last_week'); setIsProgressDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    Last Week
                  </button>
                  <button
                    onClick={() => { setProgressPeriod('this_month'); setIsProgressDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    This Month
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="py-4 flex items-center justify-around gap-6 relative z-10">
            {/* Donut Chart with dynamic percentage */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
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
                  strokeDashoffset={88 - (completionPercentage / 100) * 88}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center select-none">
                <span className="text-2xl font-extrabold text-[#1E2621] font-sans block leading-none">
                  {completionPercentage}%
                </span>
                <span className="text-[10px] text-[#7A837C] font-semibold mt-0.5 block">
                  Completed
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2B]" />
                <span className="text-[#5A635C]">Completed</span>
                <span className="font-bold text-[#1E2621] ml-4">{completedCount}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A034]" />
                <span className="text-[#5A635C]">In Progress</span>
                <span className="font-bold text-[#1E2621] ml-4">{inProgressCount}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C34E32]" />
                <span className="text-[#5A635C]">Pending</span>
                <span className="font-bold text-[#1E2621] ml-4">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Botanical leaf decoration in bottom right corner */}
          <div className="absolute bottom-1 right-1 opacity-70 pointer-events-none">
            <svg viewBox="0 0 60 60" className="w-16 h-16" fill="none">
              <path d="M10 50C25 45 40 30 50 10C45 25 30 40 10 50Z" fill="#3D5A45" />
              <path d="M20 40C30 35 40 25 45 15" stroke="#2E4A35" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Upcoming Deadlines + This Week (Study Hours) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Deadlines (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">Upcoming Deadlines</h3>
            <button
              onClick={() => setCurrentView('commitments')}
              className="text-xs font-semibold text-[#5A635C] hover:text-[#1E3A2B] flex items-center gap-0.5 group"
            >
              <span>View All</span>
              <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {commitments.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => handleStartFocus(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE] group cursor-pointer"
                title="Click to start focus session"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ${
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

                  <span className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors whitespace-nowrap truncate">
                    {item.title}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 bg-[#EAF4EE] text-[#236B43] uppercase">
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-[#A4AAA6]" />
                    <span>{item.dueDate}</span>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-[#FDF0ED] text-[#C34E32]">
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* This Week (Study Hours) 7-day capsule bar chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">This Week</h3>
            <div className="relative">
              <button
                onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                className="flex items-center gap-1 text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE] hover:bg-[#EDE9DF]"
              >
                <span>{chartMetric === 'hours' ? 'Study Hours' : 'Tasks Done'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isChartDropdownOpen && (
                <div className="absolute right-0 top-8 z-20 w-32 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                  <button
                    onClick={() => { setChartMetric('hours'); setIsChartDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    Study Hours
                  </button>
                  <button
                    onClick={() => { setChartMetric('tasks'); setIsChartDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    Tasks Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 7 Vertical Capsule Bars */}
          <div className="flex items-end justify-between gap-2 pt-2 px-2 h-36">
            {studyHoursData.map(item => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                <span className="text-[10px] font-mono font-bold text-[#6C766F] group-hover:text-[#1E3A2B] transition-colors">
                  {item.value}
                </span>

                {/* Vertical bar capsule container */}
                <div className="w-6 sm:w-7 h-24 bg-[#EDE8DE] rounded-full p-0.5 flex flex-col justify-end overflow-hidden">
                  <div
                    className="w-full rounded-full bg-[#1E3A2B] transition-all duration-500"
                    style={{ height: `${item.height}%` }}
                  />
                </div>

                <div className="text-center text-[10px] leading-tight text-[#7A837C]">
                  <span className="block font-bold">{item.day}</span>
                  <span className="block">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
