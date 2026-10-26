import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Coffee,
  Check,
  Flame,
  Leaf
} from 'lucide-react';

export const FocusStudio: React.FC = () => {
  const {
    tasks,
    commitments,
    activeTaskId,
    setActiveTaskId,
    logFocusSession,
    focusSessions,
    focusMinutesToday,
    isFocusRunning,
    focusSecondsLeft,
    setFocusSecondsLeft,
    focusMode,
    setFocusMode,
    startFocusOnTask,
    pauseFocusTimer,
    resetFocusTimer,
    ambientType,
    setAmbientType
  } = usePulse();

  const [isZenMode, setIsZenMode] = useState(false);

  // Active target can be a commitment or task
  const activeCommitment = commitments.find(c => c.id === activeTaskId);
  const activeTask = tasks.find(t => t.id === activeTaskId);
  const targetTitle = activeCommitment?.title || activeTask?.title || 'General Academic Focus';

  const handleStartPause = () => {
    if (!isFocusRunning) {
      startFocusOnTask(activeTaskId || undefined);
    } else {
      pauseFocusTimer();
    }
  };

  const handleManualComplete = () => {
    const minutesCompleted =
      focusMode === 'flow'
        ? Math.max(1, Math.round(focusSecondsLeft / 60))
        : focusMode === 'pomodoro'
        ? 25
        : 50;
    logFocusSession(minutesCompleted, `Focused on ${targetTitle}`, activeTaskId || undefined);
    resetFocusTimer();
  };

  const handleModeChange = (newMode: 'pomodoro' | 'deep_work' | 'flow') => {
    pauseFocusTimer();
    setFocusMode(newMode);
    if (newMode === 'pomodoro') setFocusSecondsLeft(25 * 60);
    else if (newMode === 'deep_work') setFocusSecondsLeft(50 * 60);
    else setFocusSecondsLeft(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress for countdown circle
  const totalSeconds = focusMode === 'pomodoro' ? 25 * 60 : focusMode === 'deep_work' ? 50 * 60 : 60 * 60;
  const progressRatio = focusMode === 'flow' ? 1 : (totalSeconds - focusSecondsLeft) / totalSeconds;
  const strokeCircumference = 2 * Math.PI * 110;
  const strokeOffset = strokeCircumference - progressRatio * strokeCircumference;

  return (
    <div
      className={`transition-all duration-500 ${
        isZenMode
          ? 'fixed inset-0 z-50 bg-[#F7F4EE] flex flex-col justify-between p-8'
          : 'p-6 lg:p-8 space-y-6 max-w-5xl mx-auto'
      }`}
    >
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight">
            Focus Studio <span className="inline-block">🌿</span>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            A serene, distraction-free environment to enter flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-[#E8E2D5] shadow-2xs text-xs font-semibold text-[#58615A]">
            <Flame className="w-3.5 h-3.5 text-[#D4A034]" />
            <span>Today: {focusMinutesToday}m Deep Work</span>
          </div>

          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="p-2 rounded-2xl bg-white border border-[#E8E2D5] text-[#58615A] hover:text-[#1E2621] shadow-2xs hover:bg-[#FBF9F5] transition-all"
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Fullscreen'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Studio Timer Hub */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E2D5] shadow-card text-center space-y-8 relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE] shadow-2xs">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              focusMode === 'pomodoro'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'text-[#6C766F] hover:text-[#1E2621]'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => handleModeChange('deep_work')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              focusMode === 'deep_work'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'text-[#6C766F] hover:text-[#1E2621]'
            }`}
          >
            Deep Sprint (50m)
          </button>
          <button
            onClick={() => handleModeChange('flow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              focusMode === 'flow'
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'text-[#6C766F] hover:text-[#1E2621]'
            }`}
          >
            Flow Stopwatch
          </button>
        </div>

        {/* Task Selection Pill */}
        <div className="max-w-md mx-auto">
          <label className="block text-[11px] font-bold text-[#8A938C] uppercase tracking-wider mb-2">
            Target Focus Task:
          </label>
          <select
            value={activeTaskId || ''}
            onChange={e => setActiveTaskId(e.target.value || null)}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#D8D1C3] text-xs font-bold text-[#1E2621] text-center focus:outline-hidden focus:border-[#1E3A2B] shadow-2xs"
          >
            <option value="">General Academic Focus</option>
            {commitments
              .filter(c => c.status !== 'completed')
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.estimatedHours}h • {c.tag})
                </option>
              ))}
            {tasks
              .filter(t => t.status !== 'completed')
              .map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.estimatedMinutes}m)
                </option>
              ))}
          </select>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="#EDE8DE"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="#1E3A2B"
              strokeWidth="7"
              strokeDasharray={strokeCircumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute text-center select-none space-y-1">
            <div className="text-6xl sm:text-7xl font-extrabold text-[#1E2621] font-mono tracking-tight">
              {formatTime(focusSecondsLeft)}
            </div>
            <p className="text-xs text-[#7A837C] font-serif italic">
              {isFocusRunning ? 'Stay in flow • Breathe deeply' : 'Ready when you are'}
            </p>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleStartPause}
            className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 ${
              isFocusRunning
                ? 'bg-[#D4A034] hover:bg-[#B88726] text-white'
                : 'bg-[#1E3A2B] hover:bg-[#284E3A] text-white'
            }`}
          >
            {isFocusRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isFocusRunning ? 'Pause Session' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetFocusTimer}
            className="p-3.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EDE9DF] text-[#58615A] border border-[#E8E2D5] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isFocusRunning && (
            <button
              onClick={handleManualComplete}
              className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-[#236B43] text-xs font-bold transition-all border border-[#D5EADB]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Early</span>
            </button>
          )}
        </div>

        {/* Ambient Soundscape Synthesizer */}
        <div className="pt-6 border-t border-[#F2ECE1] flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-[#7A837C] mr-2 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#1E3A2B]" />
            Ambient Soundscape:
          </span>

          <button
            onClick={() => setAmbientType('none')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ambientType === 'none'
                ? 'bg-[#1E2621] text-white'
                : 'bg-[#FBF9F5] text-[#58615A] hover:bg-[#EDE9DF] border border-[#E8E2D5]'
            }`}
          >
            Mute
          </button>

          <button
            onClick={() => setAmbientType('rain')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ambientType === 'rain'
                ? 'bg-[#256E93] text-white shadow-xs'
                : 'bg-[#EEF4FF] text-[#256E93] hover:bg-[#DFEBFF] border border-[#D3E2FA]'
            }`}
          >
            Rainfall
          </button>

          <button
            onClick={() => setAmbientType('binaural')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ambientType === 'binaural'
                ? 'bg-[#5344B5] text-white shadow-xs'
                : 'bg-[#F5EEFD] text-[#5344B5] hover:bg-[#ECE1FA] border border-[#E3D1F7]'
            }`}
          >
            432Hz Theta Waves
          </button>

          <button
            onClick={() => setAmbientType('whitenoise')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              ambientType === 'whitenoise'
                ? 'bg-[#A1741F] text-white shadow-xs'
                : 'bg-[#FEF7E6] text-[#A1741F] hover:bg-[#F6E6BF] border border-[#F6E6BF]'
            }`}
          >
            White Noise
          </button>
        </div>
      </div>

      {/* 3. Completed Sessions Log */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
          <h3 className="text-base font-bold text-[#1E2621]">Focus History Today</h3>
          <span className="text-xs text-[#7A837C] font-mono">{focusSessions.length} sessions logged</span>
        </div>

        {focusSessions.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#8A938C] italic">
            No focus sessions logged yet today. Hit "Start Focus" to build your streak!
          </div>
        ) : (
          <div className="space-y-2">
            {focusSessions.map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EAF4EE] text-[#236B43] flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2621]">{session.taskTitle}</h4>
                    <p className="text-[10px] text-[#7A837C]">
                      {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#1E3A2B] bg-white px-2.5 py-1 rounded-xl border border-[#EDE8DE]">
                  +{session.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
