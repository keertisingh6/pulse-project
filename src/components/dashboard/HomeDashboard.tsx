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
  ChevronDown
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    setCurrentView,
    setIsCommitmentModalOpen,
    setIsKairoDrawerOpen,
    showToast
  } = usePulse();

  // Task rows matching Screenshot 1
  const [todayTasksList, setTodayTasksList] = useState([
    {
      id: 't-1',
      title: 'DSA Assignment 5',
      priority: 'High',
      priorityColor: 'bg-[#FDF0ED] text-[#C34E32]',
      duration: '2h',
      completed: false,
      iconType: 'assignment'
    },
    {
      id: 't-2',
      title: 'PBL-III Lab Report',
      priority: 'Medium',
      priorityColor: 'bg-[#FEF7E6] text-[#A1741F]',
      duration: '3h',
      completed: false,
      iconType: 'lab'
    },
    {
      id: 't-3',
      title: 'Read Research Paper',
      priority: 'Low',
      priorityColor: 'bg-[#EAF4EE] text-[#236B43]',
      duration: '1h',
      completed: false,
      iconType: 'paper'
    }
  ]);

  const toggleTask = (id: string) => {
    setTodayTasksList(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    showToast('Task updated!', 'success');
  };

  // Study hours data for the 7-day capsule bar chart (matching screenshot 1)
  const studyHoursData = [
    { day: 'Mon', date: '27', hours: '2h', height: 40 },
    { day: 'Tue', date: '28', hours: '4h', height: 75 },
    { day: 'Wed', date: '29', hours: '3h', height: 60 },
    { day: 'Thu', date: '30', hours: '5h', height: 95 },
    { day: 'Fri', date: '31', hours: '2h', height: 40 },
    { day: 'Sat', date: '1', hours: '1h', height: 25 },
    { day: 'Sun', date: '2', hours: '0h', height: 0 }
  ];

  // Upcoming deadlines (matching screenshot 1)
  const upcomingDeadlines = [
    {
      id: 'd-1',
      title: 'DSA Assignment 5',
      type: 'Assignment',
      typeColor: 'bg-[#EAF4EE] text-[#236B43]',
      date: '13 Oct 2025 Mon',
      daysLeft: '5 days',
      badgeColor: 'bg-[#FDF0ED] text-[#C34E32]',
      iconType: 'assignment'
    },
    {
      id: 'd-2',
      title: 'PBL-III Lab Report',
      type: 'Lab',
      typeColor: 'bg-[#F0EFFE] text-[#5344B5]',
      date: '27 Oct 2025 Mon',
      daysLeft: '19 days',
      badgeColor: 'bg-[#FEF7E6] text-[#A1741F]',
      iconType: 'lab'
    },
    {
      id: 'd-3',
      title: 'SE Midterm Preparation',
      type: 'Exam',
      typeColor: 'bg-[#FDF0ED] text-[#C34E32]',
      date: '3 Nov 2025 Mon',
      daysLeft: '26 days',
      badgeColor: 'bg-[#EAF4EE] text-[#236B43]',
      iconType: 'exam'
    }
  ];

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
              onClick={() => setIsCommitmentModalOpen(true)}
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
              onClick={() => setCurrentView('goals')}
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
              Today's Focus <span className="text-xs font-normal text-[#7A837C]">(3 tasks • 5h 30m)</span>
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
            {todayTasksList.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FBF9F5] transition-all border border-transparent hover:border-[#EDE8DE] group"
              >
                <div className="flex items-center gap-3">
                  {/* Circle Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                        : 'border-[#B8B0A2] hover:border-[#1E3A2B] bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Icon Tile */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs ${
                      task.iconType === 'assignment'
                        ? 'bg-[#EAF4EE] text-[#236B43]'
                        : task.iconType === 'lab'
                        ? 'bg-[#F0EFFE] text-[#5344B5]'
                        : 'bg-[#FDF0ED] text-[#C34E32]'
                    }`}
                  >
                    {task.iconType === 'assignment' ? (
                      <FileText className="w-4 h-4" />
                    ) : task.iconType === 'lab' ? (
                      <FlaskConical className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <span
                    className={`text-xs font-bold transition-all ${
                      task.completed ? 'line-through text-[#9BA29C]' : 'text-[#1E2621]'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${task.priorityColor}`}>
                    {task.priority}
                  </span>

                  <span className="text-xs font-mono font-semibold text-[#6C766F] w-6 text-right">
                    {task.duration}
                  </span>

                  <button className="text-[#A4AAA6] hover:text-[#1E2621]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">Weekly Progress</h3>
            <div className="flex items-center gap-1 text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE]">
              <span>This Week</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="py-4 flex items-center justify-around gap-6 relative z-10">
            {/* Donut Chart with 60% */}
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
                  strokeDashoffset="35"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center select-none">
                <span className="text-2xl font-extrabold text-[#1E2621] font-sans block leading-none">
                  60%
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
                <span className="font-bold text-[#1E2621] ml-4">6</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A034]" />
                <span className="text-[#5A635C]">In Progress</span>
                <span className="font-bold text-[#1E2621] ml-4">3</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C34E32]" />
                <span className="text-[#5A635C]">Pending</span>
                <span className="font-bold text-[#1E2621] ml-4">4</span>
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
            {upcomingDeadlines.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE] group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon Tile */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ${
                      item.iconType === 'assignment'
                        ? 'bg-[#EAF4EE] text-[#236B43]'
                        : item.iconType === 'lab'
                        ? 'bg-[#F0EFFE] text-[#5344B5]'
                        : 'bg-[#FDF0ED] text-[#C34E32]'
                    }`}
                  >
                    {item.iconType === 'assignment' ? (
                      <FileText className="w-4 h-4" />
                    ) : item.iconType === 'lab' ? (
                      <FlaskConical className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <span className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors whitespace-nowrap truncate">
                    {item.title}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${item.typeColor}`}>
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A837C] font-mono whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-[#A4AAA6]" />
                    <span>{item.date}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${item.badgeColor}`}>
                    {item.daysLeft}
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
            <div className="flex items-center gap-1 text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE]">
              <span>Study Hours</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 7 Vertical Capsule Bars */}
          <div className="flex items-end justify-between gap-2 pt-2 px-2 h-36">
            {studyHoursData.map(item => {
              const isToday = item.day === 'Mon' && item.date === '27';

              return (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[10px] font-mono font-bold text-[#6C766F] group-hover:text-[#1E3A2B] transition-colors">
                    {item.hours}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};