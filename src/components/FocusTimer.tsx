import React, { useState, useEffect, useRef } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle, 
  Flame, Moon, Sun, ArrowRight, BookOpen, Laptop, Trophy 
} from 'lucide-react';
import { EmptyStateIllustration } from './Illustrations';

export const FocusTimer: React.FC = () => {
  const { state, addFocusSession } = usePulse();
  
  // Timer settings
  const [sessionType, setSessionType] = useState<'study' | 'work' | 'break'>('study');
  const [timePreset, setTimePreset] = useState<number>(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [breathingText, setBreathingText] = useState<'Inhale...' | 'Hold...' | 'Exhale...' | 'Rest...'>('Inhale...');
  
  // Custom log text
  const [sessionNotes, setSessionNotes] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [justCompletedMinutes, setJustCompletedMinutes] = useState(25);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing simulation text
  useEffect(() => {
    let breatheCounter = 0;
    const breatheInterval = setInterval(() => {
      if (isActive) {
        breatheCounter = (breatheCounter + 1) % 4;
        if (breatheCounter === 0) setBreathingText('Inhale...');
        if (breatheCounter === 1) setBreathingText('Hold...');
        if (breatheCounter === 2) setBreathingText('Exhale...');
        if (breatheCounter === 3) setBreathingText('Rest...');
      }
    }, 4000);

    return () => clearInterval(breatheInterval);
  }, [isActive]);

  // Adjust remaining seconds when preset changes
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(timePreset * 60);
    }
  }, [timePreset, isActive]);

  // Timer Countdown Logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setJustCompletedMinutes(timePreset);
    setShowLogModal(true);
    
    // Play a friendly soft browser sound chime if possible
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log('AudioContext blocked or un-supported.');
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(timePreset * 60);
  };

  const handleSaveSession = () => {
    addFocusSession({
      durationMinutes: justCompletedMinutes,
      type: sessionType,
      notes: sessionNotes || `Completed a restful ${justCompletedMinutes} minute ${sessionType} session.`
    });
    setSessionNotes('');
    setShowLogModal(false);
    resetTimer();
  };

  // Format MM:SS
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute percentage of circular ring
  const totalSeconds = timePreset * 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="focus-timer-section">
      
      {/* Visual Clock Panel - 3 cols */}
      <div className="lg:col-span-3 bg-white border border-[#EBE9E0] rounded-[2rem] p-6 flex flex-col items-center justify-center relative shadow-sm min-h-[380px]">
        
        {/* Absolute top badge */}
        <div className="absolute top-4 flex items-center gap-1.5 bg-[#F5F1E9] text-[#7C9070] border border-[#EBE9E0] px-3.5 py-1 rounded-full text-xs font-semibold">
          <Moon className="w-3.5 h-3.5 text-[#7C9070] animate-pulse" />
          <span>{isActive ? breathingText : "Ready to focus?"}</span>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center my-6">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="#FAF9F6"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Active countdown progress ring */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="#7C9070"
              strokeWidth="6"
              strokeDasharray={565}
              strokeDashoffset={565 - (565 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>

          {/* Centered digits and label */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="font-serif font-light text-4xl md:text-5xl text-[#1A1A1B] tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1B]/40 mt-1.5 font-sans">
              {sessionType} mode
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="bg-[#F5F1E9] hover:bg-[#EBE9E0] text-[#1A1A1B]/70 p-3 rounded-2xl transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md cursor-pointer ${
              isActive 
                ? 'bg-[#1A1A1B] text-white shadow-[#1A1A1B]/10' 
                : 'bg-[#7C9070] hover:bg-[#6c7d61] text-white shadow-[#7C9070]/10'
            }`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleTimerComplete}
            className="bg-[#FAF9F6] hover:bg-[#F5F1E9] text-[#7C9070] border border-[#EBE9E0] p-3 rounded-2xl transition-colors cursor-pointer"
            title="Skip to end / save block"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Control Presets & History - 2 cols */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Preset Setup Card */}
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div>
            <h4 className="font-serif font-bold text-[#1A1A1B] text-sm">Timer Settings</h4>
            <p className="text-[#1A1A1B]/50 text-xs">Curate your session pace.</p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F1E9]/40 rounded-xl border border-[#EBE9E0]">
            {(['study', 'work', 'break'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setSessionType(mode)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-all ${
                  sessionType === mode
                    ? 'bg-white text-[#1A1A1B] shadow-sm border border-[#EBE9E0]'
                    : 'text-[#1A1A1B]/50 hover:text-[#1A1A1B]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Time presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1A1A1B]/50">Preset Duration</label>
            <div className="grid grid-cols-5 gap-2">
              {[5, 15, 25, 45, 60].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => {
                    setTimePreset(minutes);
                    setIsActive(false);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    timePreset === minutes
                      ? 'bg-[#7C9070] text-white border-[#7C9070]'
                      : 'bg-white text-[#1A1A1B]/70 border-[#EBE9E0] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History / Stats Quick view */}
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-3 shadow-sm">
          <h4 className="font-serif font-bold text-[#1A1A1B] text-sm">Today's Focus Log</h4>
          
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {state.focusSessions.length === 0 ? (
              <p className="text-xs text-[#1A1A1B]/40 italic py-4 text-center">No completed blocks today. Start your first focus wave!</p>
            ) : (
              state.focusSessions.slice(0, 3).map(session => (
                <div key={session.id} className="flex items-center gap-2.5 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#EBE9E0] text-xs">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    session.type === 'study' ? 'bg-[#7C9070]/10 text-[#7C9070]' : session.type === 'work' ? 'bg-[#7C9070]/15 text-[#7C9070]' : 'bg-[#F5F1E9] text-[#7C9070]'
                  }`}>
                    {session.type === 'study' ? <BookOpen className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#1A1A1B]">{session.durationMinutes}m {session.type} Block</span>
                    <p className="text-[#1A1A1B]/60 truncate mt-0.5">{session.notes}</p>
                  </div>
                  <span className="text-[10px] text-[#1A1A1B]/40 shrink-0 font-mono">
                    {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Completion Log Modal Overlay */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1B]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] rounded-[2rem] p-6 max-w-md w-full border border-[#EBE9E0] shadow-xl space-y-4 animate-scaleUp">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#7C9070]/10 text-[#7C9070] flex items-center justify-center mx-auto text-xl animate-bounce">
                🏆
              </div>
              <h3 className="font-serif font-light text-2xl text-[#1A1A1B]">Mindful Block Completed!</h3>
              <p className="text-[#1A1A1B]/60 text-xs">You maintained serene focus for <strong>{justCompletedMinutes} minutes</strong>.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1A1B]/50 block">Notes or details (Optional)</label>
              <input
                type="text"
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="e.g. Cleared chapter 3 mathematics exercises, outline drafting..."
                className="w-full px-3 py-2 text-xs border border-[#EBE9E0] rounded-xl outline-none bg-white focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
                maxLength={100}
              />
            </div>

            {/* Reassuring Kairo prompt */}
            <div className="bg-white rounded-xl p-4 border border-[#EBE9E0] text-xs flex gap-2">
              <Sparkles className="w-4 h-4 text-[#7C9070] shrink-0 mt-0.5" />
              <p className="text-[#1A1A1B]/70 font-serif italic">
                "Outstanding concentration, Keerti! You kept steady effort alive. Take a long stretch, drink some fresh water, and enjoy a well-deserved break."
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetTimer}
                className="flex-1 py-2 text-xs font-semibold bg-[#F5F1E9] hover:bg-[#EBE9E0] text-[#1A1A1B]/70 rounded-xl"
              >
                Skip logging
              </button>
              <button
                onClick={handleSaveSession}
                className="flex-1 py-2 text-xs font-semibold bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-xl shadow-md shadow-[#7C9070]/10"
              >
                Log Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
