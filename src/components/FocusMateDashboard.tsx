import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Plus, Check, Circle, CheckCircle2, ChevronRight, 
  Sparkles, Trophy, BookOpen, Clock, Flame, 
  RotateCcw, Shield, Award, ArrowUpRight, BarChart3,
  Calendar, Coffee, MoreHorizontal, Play, Pause, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalTodayDateString, formatDeadlineDisplay, isTaskOverdue } from '../utils/deadlineUtils';

interface FocusMateDashboardProps {
  onNavigateToTab: (tab: any) => void;
}

export const FocusMateDashboard: React.FC<FocusMateDashboardProps> = ({ onNavigateToTab }) => {
  const { state, toggleCommitment, addCommitment, addFocusSession } = usePulse();
  const displayName = state.user?.name || state.userName || 'Keerti';

  // Quick task input state
  const [quickTaskText, setQuickTaskText] = useState('');
  const [quickTaskSubject, setQuickTaskSubject] = useState('Math');

  // Focus Timer Name Customization
  const [timerName, setTimerName] = useState(() => {
    return localStorage.getItem('pulse_timer_name') || 'Focus Timer';
  });
  const [isEditingTimerName, setIsEditingTimerName] = useState(false);
  const [tempTimerName, setTempTimerName] = useState(timerName);

  const handleSaveTimerName = () => {
    const nameToSave = tempTimerName.trim() || 'Focus Timer';
    setTimerName(nameToSave);
    localStorage.setItem('pulse_timer_name', nameToSave);
    setIsEditingTimerName(false);
  };

  // Mini Stopwatch State inside Dashboard Widget
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Mini Calendar State
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Interactive stopwatch ticker
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    addCommitment({
      title: quickTaskText.trim(),
      subject: quickTaskSubject,
      type: 'Task',
      dueDate: getLocalTodayDateString(),
      estimatedEffort: '45 mins',
      effortMinutes: 45,
      priority: 'medium',
      completed: false,
      source: 'manual',
    });

    setQuickTaskText('');
  };

  const timerHrs = Math.floor(timerSeconds / 3600);
  const timerMin = Math.floor((timerSeconds % 3600) / 60);
  const timerSec = timerSeconds % 60;

  // Mini calendar calculation
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // Monday start
  const monthName = new Date(calYear, calMonth, 1).toLocaleString('en-US', { month: 'short' });

  // Weekly productivity mockup bars based on user state
  const weeklyStats = [
    { day: 'Mon', hours: 4.5, fill: 'bg-emerald-400' },
    { day: 'Tue', hours: 6.2, fill: 'bg-emerald-400' },
    { day: 'Wed', hours: 5.0, fill: 'bg-emerald-400' },
    { day: 'Thu', hours: 7.5, fill: 'bg-emerald-500' },
    { day: 'Fri', hours: 3.8, fill: 'bg-emerald-400' },
    { day: 'Sat', hours: 5.5, fill: 'bg-emerald-400' },
    { day: 'Sun', hours: 4.0, fill: 'bg-emerald-300' },
  ];

  const activeCommitments = state.commitments.filter(c => !c.completed);
  const todayTasks = activeCommitments.slice(0, 4);

  return (
    <div className="space-y-6">

      {/* Top Hero Banner matching FocusMate: Mint / Sunset soft aesthetic */}
      <div className="relative rounded-[2rem] bg-gradient-to-r from-[#E7F0E8] via-[#F4F6F2] to-[#FAF8F2] border border-[#E0E7DC] p-6 md:p-8 overflow-hidden shadow-xs">
        
        {/* Soft background nature hills SVG graphic */}
        <div className="absolute right-0 bottom-0 top-0 w-80 md:w-96 pointer-events-none opacity-40">
          <svg viewBox="0 0 400 200" fill="none" className="w-full h-full object-cover">
            <path d="M0 200C100 120 250 160 400 100V200H0Z" fill="#7C9070" fillOpacity="0.2" />
            <path d="M120 200C220 140 320 180 400 130V200H120Z" fill="#5F7553" fillOpacity="0.15" />
            <circle cx="320" cy="60" r="32" fill="#E8B896" fillOpacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#7C9070]/15 text-[#586A4F] px-3 py-1 rounded-full text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#7C9070]" />
              <span>PULSE ACADEMIC OS • STUDY IN PROGRESS</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1F2B22] tracking-tight">
              Welcome back, {displayName}!
            </h2>
            
            <p className="text-xs md:text-sm text-[#3E4E42] leading-relaxed">
              You're currently in deep study mode. You have <strong className="text-[#1F2B22]">{activeCommitments.length} pending academic commitments</strong> today. Focus and take mindful breathers!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('zen')}
              className="px-5 py-3 rounded-2xl bg-[#5E7353] hover:bg-[#506246] text-white font-bold text-xs shadow-md shadow-[#5E7353]/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Shield className="w-4 h-4" />
              <span>Enter Focus Studio</span>
            </button>

            <button
              onClick={() => onNavigateToTab('commitments')}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-[#1F2B22] border border-[#D5DFD1] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#5E7353]" />
              <span>Add Commitment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column / Multi-Panel Grid matching the exact FocusMate screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Tasks & Quick Add (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Tasks Widget */}
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#7C9070]/15 text-[#7C9070] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1A1A1B]">Today's Priorities</h3>
              </div>

              <button
                onClick={() => onNavigateToTab('database')}
                className="text-xs font-semibold text-[#7C9070] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Database</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleQuickTaskSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Quick-add task or assignment..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
              />
              <select
                value={quickTaskSubject}
                onChange={(e) => setQuickTaskSubject(e.target.value)}
                className="px-3 py-2.5 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl text-xs font-semibold text-[#1A1A1B]/70 focus:outline-none"
              >
                <option value="Math">Math</option>
                <option value="CS">CS</option>
                <option value="Physics">Physics</option>
                <option value="General">General</option>
              </select>
              <button
                type="submit"
                className="p-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Task list items */}
            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <div className="p-8 text-center text-[#1A1A1B]/40 bg-[#FAF9F6] rounded-2xl border border-dashed border-[#EBE9E0]">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#7C9070]/50" />
                  <p className="text-xs font-semibold">All tasks completed for today!</p>
                  <p className="text-[11px] mt-0.5">Use quick-add above or manage tasks in the Commitments tab.</p>
                </div>
              ) : (
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-[#FAF9F6] hover:bg-[#F5F1E9] border border-[#EBE9E0] rounded-2xl transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleCommitment(task.id)}
                        className="text-[#7C9070] hover:scale-110 transition-transform cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-[#7C9070] text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#1A1A1B]/30 hover:text-[#7C9070]" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <span className={`font-bold text-xs text-[#1A1A1B] block truncate ${task.completed ? 'line-through text-[#1A1A1B]/40' : ''}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-[#1A1A1B]/50 font-mono mt-0.5">
                          {task.subject && (
                            <span className="font-semibold text-[#7C9070] bg-[#7C9070]/10 px-1.5 py-0.2 rounded">
                              {task.subject}
                            </span>
                          )}
                          <span>{task.estimatedEffort || '1 hr'}</span>
                          <span>•</span>
                          <span>Due: {formatDeadlineDisplay(task.dueDate, task.dueTime)}</span>
                          {!task.completed && isTaskOverdue(task) && (
                            <span className="text-rose-600 font-bold font-sans">(Overdue)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Productivity Bar Chart Widget */}
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1A1A1B]">Weekly Focus Hours</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                36.5 hrs total
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 h-36 pt-4 px-2">
              {weeklyStats.map(stat => {
                const heightPercent = (stat.hours / 8) * 100;
                return (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-[#1A1A1B]/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stat.hours}h
                    </span>
                    <div className="w-full bg-slate-100 rounded-xl overflow-hidden h-24 flex items-end">
                      <div 
                        className={`w-full rounded-xl transition-all duration-500 ${stat.fill}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#1A1A1B]/70">{stat.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Pomodoro, Mini Calendar & App Blocker (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Focus Timer Widget matching FocusMate */}
          <div className="bg-gradient-to-br from-[#EEF4ED] to-[#E2EBE0] border border-[#D5DFD1] rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isEditingTimerName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempTimerName}
                      onChange={(e) => setTempTimerName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTimerName();
                        if (e.key === 'Escape') setIsEditingTimerName(false);
                      }}
                      autoFocus
                      className="text-[11px] font-bold uppercase tracking-wider text-[#4E6246] bg-white/90 border border-[#4E6246]/30 rounded px-1.5 py-0.5 outline-none w-36"
                    />
                    <button
                      onClick={handleSaveTimerName}
                      className="p-1 text-[#4E6246] hover:bg-white/60 rounded cursor-pointer"
                      title="Save name"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setTempTimerName(timerName);
                      setIsEditingTimerName(true);
                    }}
                    className="flex items-center gap-1.5 group cursor-pointer"
                    title="Click to rename timer"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E6246]">
                      {timerName}
                    </span>
                    <Edit2 className="w-2.5 h-2.5 text-[#4E6246]/50 group-hover:text-[#4E6246] transition-colors" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#4E6246] bg-white/70 px-2 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>Stopwatch</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#243322] tracking-tight">
                {String(timerHrs).padStart(2, '0')}:{String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
              </div>
              <p className="text-xs text-[#4E6246] mt-1 font-medium">
                {timerActive ? 'Active study session in progress' : 'Ready to start study stopwatch'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerSeconds(0);
                }}
                className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                  timerActive 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-[#506346] hover:bg-[#43533a] text-white'
                }`}
              >
                {timerActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{timerActive ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => onNavigateToTab('zen')}
                className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-[#4E6246] transition-colors cursor-pointer"
                title="Launch Focus Studio"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Calendar Widget */}
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7C9070]" />
                <h3 className="font-bold text-sm text-[#1A1A1B]">
                  {monthName} {calYear}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('calendar')}
                className="text-xs text-[#7C9070] font-semibold hover:underline"
              >
                Full Calendar
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[#1A1A1B]/40 font-bold py-1">{d}</div>
              ))}
              
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="py-1" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                const isToday = day === today.getDate() && calMonth === today.getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-[#7C9070] text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-[#7C9070]/15 text-[#7C9070] font-bold'
                        : 'text-[#1A1A1B]/70 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block List Quick Widget matching FocusMate */}
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE9E0]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-[#1A1A1B]">Distraction Blocker</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('blocklist')}
                className="text-xs text-[#7C9070] font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">Instagram</span>
                <span className="text-[9px] font-mono text-rose-600/70">Blocked</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">YouTube</span>
                <span className="text-[9px] font-mono text-rose-600/70">Blocked</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">TikTok</span>
                <span className="text-[9px] font-mono text-rose-600/70">Blocked</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
