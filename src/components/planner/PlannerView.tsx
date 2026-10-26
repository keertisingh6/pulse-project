import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
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
  ChevronDown
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const { showToast } = usePulse();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const daysHeader = [
    { day: 'Mon', date: '27 Oct' },
    { day: 'Tue', date: '28 Oct' },
    { day: 'Wed', date: '29 Oct' },
    { day: 'Thu', date: '30 Oct' },
    { day: 'Fri', date: '31 Oct' },
    { day: 'Sat', date: '1 Nov' },
    { day: 'Sun', date: '2 Nov' }
  ];

  const timeRows = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];

  // Scheduled blocks exactly matching Screenshot 4
  const [events, setEvents] = useState([
    // Mon
    { id: 'ev-1', day: 'Mon', row: '8 AM', title: 'DBMS Lecture', time: '8 - 10 AM', color: 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]', icon: BookOpen },
    { id: 'ev-2', day: 'Mon', row: '12 PM', title: 'PBL-III Lab', time: '12 - 2 PM', color: 'bg-[#FDF0ED] text-[#C34E32] border-[#F6DCD6]', icon: FlaskConical },
    { id: 'ev-3', day: 'Mon', row: '4 PM', title: 'DSA Revision', time: '4 - 5:30 PM', color: 'bg-[#FEF7E6] text-[#A1741F] border-[#F6E6BF]', icon: FileText },
    { id: 'ev-4', day: 'Mon', row: '6 PM', title: 'Gym', time: '7 - 9 PM', color: 'bg-[#F5EEFD] text-[#5344B5] border-[#E3D1F7]', icon: Dumbbell },
    // Tue
    { id: 'ev-5', day: 'Tue', row: '8 AM', title: 'Study DSA', time: '9 - 11 AM', color: 'bg-[#F5EEFD] text-[#5344B5] border-[#E3D1F7]', icon: BookOpen },
    { id: 'ev-6', day: 'Tue', row: '2 PM', title: 'Project Work', time: '2 - 4 PM', color: 'bg-[#EEF4FF] text-[#256E93] border-[#D3E2FA]', icon: FileText },
    { id: 'ev-7', day: 'Tue', row: '6 PM', title: 'SE CCA Prep', time: '6 - 8 PM', color: 'bg-[#FDF0ED] text-[#C34E32] border-[#F6DCD6]', icon: BookOpen },
    // Wed
    { id: 'ev-8', day: 'Wed', row: '8 AM', title: 'Networking Lecture', time: '8 - 9:30 AM', color: 'bg-[#FEF7E6] text-[#A1741F] border-[#F6E6BF]', icon: BookOpen },
    { id: 'ev-9', day: 'Wed', row: '10 AM', title: 'Library Study', time: '11 AM - 1 PM', color: 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]', icon: BookOpen },
    { id: 'ev-10', day: 'Wed', row: '2 PM', title: 'Hackathon Work', time: '3 - 5 PM', color: 'bg-[#F5EEFD] text-[#5344B5] border-[#E3D1F7]', icon: Users },
    // Thu
    { id: 'ev-11', day: 'Thu', row: '10 AM', title: 'Read Research Paper', time: '10 AM - 12 PM', color: 'bg-[#FDF0ED] text-[#C34E32] border-[#F6DCD6]', icon: FileText },
    // Fri
    { id: 'ev-12', day: 'Fri', row: '2 PM', title: 'AI & ML Lecture', time: '2 - 4 PM', color: 'bg-[#EEF4FF] text-[#256E93] border-[#D3E2FA]', icon: BookOpen },
    { id: 'ev-13', day: 'Fri', row: '6 PM', title: 'CCA Submission', time: '6 - 8 PM', color: 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]', icon: FileText },
    // Sat
    { id: 'ev-14', day: 'Sat', row: '10 AM', title: 'Upcoming Exam Prep', time: '10 AM - 12 PM', color: 'bg-[#F5EEFD] text-[#5344B5] border-[#E3D1F7]', icon: GraduationCap },
    { id: 'ev-15', day: 'Sat', row: '4 PM', title: 'Movie / Break', time: '5 - 7 PM', color: 'bg-[#FEF7E6] text-[#A1741F] border-[#F6E6BF]', icon: Coffee },
    // Sun
    { id: 'ev-16', day: 'Sun', row: '10 AM', title: 'Plan Next Week', time: '11 AM - 1 PM', color: 'bg-[#EAF4EE] text-[#236B43] border-[#D5EADB]', icon: Check }
  ]);

  // Today's Agenda matching Screenshot 4
  const todayAgenda = [
    { time: '8:00 AM - 10:00 AM', title: 'DBMS Lecture', type: 'Class', location: 'LHC-201', dotColor: 'bg-[#236B43]', icon: FileText },
    { time: '12:00 PM - 2:00 PM', title: 'PBL-III Lab', type: 'Lab', location: 'Lab-3', dotColor: 'bg-[#C34E32]', icon: FlaskConical },
    { time: '4:00 PM - 5:30 PM', title: 'DSA Revision', type: 'Self Study', location: 'Library', dotColor: 'bg-[#A1741F]', icon: BookOpen },
    { time: '7:00 PM - 9:00 PM', title: 'Gym', type: 'Personal', location: 'Fitness Center', dotColor: 'bg-[#5344B5]', icon: Dumbbell }
  ];

  // Pending Tasks matching Screenshot 4
  const [pendingTasks, setPendingTasks] = useState([
    { id: 'p-1', title: 'DSA Assignment 5', priority: 'High', priorityColor: 'bg-[#FDF0ED] text-[#C34E32]', date: '13 Oct', completed: false },
    { id: 'p-2', title: 'PBL-III Lab Report', priority: 'Medium', priorityColor: 'bg-[#FEF7E6] text-[#A1741F]', date: '27 Oct', completed: false },
    { id: 'p-3', title: 'SE CCA', priority: 'High', priorityColor: 'bg-[#FDF0ED] text-[#C34E32]', date: '3 Nov', completed: false },
    { id: 'p-4', title: 'Read Research Paper', priority: 'Low', priorityColor: 'bg-[#EAF4EE] text-[#236B43]', date: '18 Oct', completed: false },
    { id: 'p-5', title: 'Project Phase 1', priority: 'Medium', priorityColor: 'bg-[#FEF7E6] text-[#A1741F]', date: '15 Nov', completed: false }
  ]);

  const togglePending = (id: string) => {
    setPendingTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    showToast('Task updated!', 'success');
  };

  const handleAutoSchedule = () => {
    showToast('Kairo auto-scheduled 3 pending tasks based on focus habits!', 'success');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & leaf */}
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

      {/* 2. Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Today, < >, Dates */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Jumped to Today', 'info')}
            className="px-3.5 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] text-xs font-bold text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5]"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
            <button className="p-0.5 hover:bg-[#EDE9DF] rounded-lg">
              <ChevronLeft className="w-4 h-4 text-[#6E7570]" />
            </button>
            <button className="p-0.5 hover:bg-[#EDE9DF] rounded-lg">
              <ChevronRight className="w-4 h-4 text-[#6E7570]" />
            </button>
          </div>

          <span className="text-xs font-bold text-[#1E2621] ml-1">
            27 Oct - 2 Nov 2025
          </span>
        </div>

        {/* Right: Week/Month toggle, Auto Schedule, Settings */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-2xl bg-white border border-[#E8E2D5] shadow-2xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-[#1E3A2B] text-white shadow-2xs' : 'text-[#6E7570]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-[#1E3A2B] text-white shadow-2xs' : 'text-[#6E7570]'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={handleAutoSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#EAF4EE] border border-[#D5EADB] text-[#1E3A2B] text-xs font-bold shadow-2xs hover:bg-[#DEEFE4] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#236B43]" />
            <span>Auto Schedule Pending</span>
          </button>

          <button className="p-2 rounded-2xl bg-white border border-[#E8E2D5] text-[#6E7570] hover:text-[#1E2621] shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Weekly Timetable + Lower Two Cards */}
        <div className="lg:col-span-8 space-y-5">
          {/* Timetable Grid Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3 overflow-hidden">
            {/* Days header */}
            <div className="grid grid-cols-8 text-center text-xs pb-2 border-b border-[#F2ECE1]">
              <div className="text-[10px] text-[#A4AAA6]" />
              {daysHeader.map((d, idx) => (
                <div key={idx} className="text-center">
                  <span className="block text-[11px] font-bold text-[#1E2621]">{d.day}</span>
                  <span className="block text-[10px] text-[#7A837C]">{d.date}</span>
                </div>
              ))}
            </div>

            {/* Time Rows */}
            <div className="space-y-1">
              {timeRows.map(rowTime => (
                <div key={rowTime} className="grid grid-cols-8 items-start min-h-[48px] border-b border-[#F8F5EE] py-1">
                  <div className="text-[10px] font-mono text-[#8C958E] pt-1 text-center">
                    {rowTime}
                  </div>

                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => {
                    const match = events.find(e => e.day === dayName && e.row === rowTime);

                    return (
                      <div key={dayName} className="px-0.5 min-h-[44px]">
                        {match && (
                          <div
                            onClick={() => showToast(`Selected: ${match.title}`, 'info')}
                            className={`p-1.5 rounded-xl border text-[10px] font-bold leading-tight shadow-2xs cursor-pointer ${match.color}`}
                          >
                            <span className="block truncate">{match.title}</span>
                            <span className="text-[9px] font-mono block opacity-80">{match.time}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Lower Two Cards: Today's Agenda & Quick Schedule */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Card 1: Today's Agenda */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">
                  Today's Agenda <span className="text-[10px] font-normal text-[#7A837C]">Mon, 27 Oct 2025</span>
                </h4>
              </div>

              <div className="space-y-2">
                {todayAgenda.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 px-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] border border-[#EDE8DE] text-xs transition-all cursor-pointer group"
                    >
                      {/* Left group: dot + time + icon + title */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotColor}`} />
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#7A837C] whitespace-nowrap flex-shrink-0">
                          {item.time}
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon className="w-3.5 h-3.5 text-[#58615A] flex-shrink-0" />
                          <span className="font-bold text-[#1E2621] whitespace-nowrap truncate text-xs">
                            {item.title}
                          </span>
                        </div>
                      </div>

                      {/* Right group: type tag + location + chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#58615A] whitespace-nowrap">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-[#A4AAA6] whitespace-nowrap">
                          {item.location}
                        </span>
                        <span className="text-xs text-[#A4AAA6] group-hover:text-[#1E2621] group-hover:translate-x-0.5 transition-transform">
                          ›
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Quick Schedule */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="text-xs font-bold text-[#1E2621]">Quick Schedule</h4>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => showToast('Scheduled Class slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <BookOpen className="w-4 h-4 text-[#236B43] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Class<br />Schedule</span>
                </button>

                <button
                  onClick={() => showToast('Scheduled Assignment Time slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#FDF0ED] hover:bg-[#FBE4DF] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <FileText className="w-4 h-4 text-[#C34E32] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Assignment<br />Time</span>
                </button>

                <button
                  onClick={() => showToast('Scheduled Exam Prep slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#FEF7E6] hover:bg-[#F6E6BF] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <GraduationCap className="w-4 h-4 text-[#A1741F] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Exam Prep</span>
                </button>

                <button
                  onClick={() => showToast('Scheduled Deep Study slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <Clock className="w-4 h-4 text-[#236B43] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Deep Study</span>
                </button>

                <button
                  onClick={() => showToast('Scheduled Project Work slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#F5EEFD] hover:bg-[#E3D1F7] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <Users className="w-4 h-4 text-[#5344B5] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Project Work</span>
                </button>

                <button
                  onClick={() => showToast('Scheduled Break slot', 'success')}
                  className="p-2.5 rounded-2xl bg-[#FEF7E6] hover:bg-[#F6E6BF] text-center flex flex-col items-center justify-center transition-all group h-18"
                >
                  <Coffee className="w-4 h-4 text-[#A1741F] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1E2621] leading-tight">Break</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pending Tasks + Time Distribution Donut + Goals for This Week */}
        <div className="lg:col-span-4 space-y-4">
          {/* Pending Tasks */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
              <h4 className="text-xs font-bold text-[#1E2621]">Pending Tasks</h4>
              <button className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5">
                <span>View All</span>
                <span className="text-xs">→</span>
              </button>
            </div>

            <div className="space-y-2">
              {pendingTasks.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePending(item.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#F4EFE6] transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                          : 'border-[#B8B0A2] bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`font-bold ${
                        item.completed ? 'line-through text-[#9BA29C]' : 'text-[#1E2621]'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.priorityColor}`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] text-[#7A837C] font-mono">{item.date}</span>
                    <span className="text-xs text-[#A4AAA6]">⋮</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Distribution Donut Chart */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <h4 className="text-xs font-bold text-[#1E2621]">Time Distribution</h4>

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
                    strokeDashoffset="44"
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
                    strokeDashoffset="65"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#7B68EE"
                    strokeWidth="4.2"
                    strokeDasharray="88"
                    strokeDashoffset="78"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center select-none">
                  <span className="text-sm font-extrabold text-[#1E2621] block leading-none">24h</span>
                  <span className="text-[8px] text-[#7A837C]">This Week</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] font-semibold flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1E3A2B]" />
                    <span className="text-[#58615A]">Academics</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">10h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FDF0ED]" />
                    <span className="text-[#58615A]">Assignments</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">6h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7B68EE]" />
                    <span className="text-[#58615A]">Projects</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">4h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FEF7E6]" />
                    <span className="text-[#58615A]">Self Care</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">3h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EDE8DE]" />
                    <span className="text-[#58615A]">Others</span>
                  </div>
                  <span className="font-bold text-[#1E2621]">1h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goals for This Week */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
              <h4 className="text-xs font-bold text-[#1E2621]">Goals for This Week</h4>
              <button className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5">
                <span>View All</span>
                <span className="text-xs">→</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {/* Goal 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1E2621]">Complete DSA Assignment 5</span>
                  <span className="font-mono text-[#1E3A2B]">40%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EDE8DE] overflow-hidden">
                  <div className="h-full rounded-full bg-[#1E3A2B]" style={{ width: '40%' }} />
                </div>
              </div>

              {/* Goal 2 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1E2621]">Finish SE CCA Preparation</span>
                  <span className="font-mono text-[#A1741F]">60%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EDE8DE] overflow-hidden">
                  <div className="h-full rounded-full bg-[#A1741F]" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Goal 3 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1E2621]">Read 1 Research Paper</span>
                  <span className="font-mono text-[#C34E32]">20%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EDE8DE] overflow-hidden">
                  <div className="h-full rounded-full bg-[#C34E32]" style={{ width: '20%' }} />
                </div>
              </div>

              {/* Goal 4 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1E2621]">Plan Next Week</span>
                  <span className="font-mono text-[#A4AAA6]">0%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EDE8DE] overflow-hidden">
                  <div className="h-full rounded-full bg-[#B8B0A2]" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};