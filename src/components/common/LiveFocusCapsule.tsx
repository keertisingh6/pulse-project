import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { Play, Pause, Maximize2, Volume2, Sparkles, X } from 'lucide-react';

export const LiveFocusCapsule: React.FC = () => {
  const {
    isFocusRunning,
    focusSecondsLeft,
    activeTaskId,
    tasks,
    pauseFocusTimer,
    startFocusOnTask,
    setCurrentView,
    currentView,
    ambientType
  } = usePulse();

  // Only show when timer is active and user is outside the full focus studio
  if (!isFocusRunning || currentView === 'focus') {
    return null;
  }

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 p-2.5 pl-4 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-lavender-brand/30 shadow-elevated hover:shadow-glow transition-all group">
        {/* Animated Pulsing Ring & Equalizer */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-lavender-brand/10 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-lavender-brand animate-ping" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-lavender-brand" />
          </div>

          {ambientType !== 'none' && (
            <div className="flex items-end gap-0.5 h-4 px-1" title={`Ambient sound: ${ambientType}`}>
              <span className="w-0.5 h-2 bg-lavender-brand rounded-full animate-pulse" />
              <span className="w-0.5 h-4 bg-lavender-brand rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-3 bg-lavender-brand rounded-full animate-pulse delay-150" />
            </div>
          )}
        </div>

        {/* Task Title & Timer */}
        <div
          onClick={() => setCurrentView('focus')}
          className="cursor-pointer max-w-[160px] sm:max-w-[200px]"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-brand">
              Live Focus
            </span>
          </div>
          <h5 className="text-xs font-bold text-plum truncate">
            {activeTask ? activeTask.title : 'Deep Focus Session'}
          </h5>
          <span className="text-xs font-mono font-extrabold text-slate-700">
            {formatTime(focusSecondsLeft)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={() => {
              if (isFocusRunning) {
                pauseFocusTimer();
              } else {
                startFocusOnTask(activeTaskId || undefined);
              }
            }}
            className="p-2 rounded-xl bg-lavender-100 hover:bg-lavender-200 text-lavender-brandDark transition-colors"
            title={isFocusRunning ? 'Pause' : 'Resume'}
          >
            {isFocusRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            onClick={() => setCurrentView('focus')}
            className="p-2 rounded-xl bg-lavender-brand text-white hover:bg-lavender-brandDark transition-colors shadow-2xs"
            title="Expand into Focus Studio"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
