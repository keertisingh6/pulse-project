import React, { useState, useEffect, useRef } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Shield, 
  Maximize2, Minimize2, CheckCircle2, Flame, Sparkles, 
  Clock, Coffee, Award, X, Calendar, TrendingUp, Check, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STOPWATCH_STORAGE_KEY = 'pulse_active_stopwatch_session';

interface StoredStopwatchSession {
  status: 'idle' | 'running' | 'paused';
  sessionStartTime: string | null;
  accumulatedSeconds: number;
  intervalStartMs: number | null;
  activeGoalText: string;
}

interface FinishedSummary {
  durationSeconds: number;
  startTime: string;
  endTime: string;
  goal: string;
}

export const DistractionFreeModeView: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const { state, addFocusSession } = usePulse();

  // Load initial state from persistence if active or paused
  const [initialData] = useState<StoredStopwatchSession>(() => {
    try {
      const raw = localStorage.getItem(STOPWATCH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.accumulatedSeconds === 'number') {
          return parsed;
        }
      }
    } catch {}
    return {
      status: 'idle',
      sessionStartTime: null,
      accumulatedSeconds: 0,
      intervalStartMs: null,
      activeGoalText: 'Deep Study: Core Chapter & Problem Set',
    };
  });

  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>(() => {
    return initialData.status;
  });
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(initialData.sessionStartTime);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState<number>(initialData.accumulatedSeconds);
  const [intervalStartMs, setIntervalStartMs] = useState<number | null>(initialData.intervalStartMs);
  const [activeGoalText, setActiveGoalText] = useState<string>(initialData.activeGoalText || 'Deep Study: Core Chapter & Problem Set');

  // Real-time displayed stopwatch seconds
  const [displaySeconds, setDisplaySeconds] = useState<number>(() => {
    if (initialData.status === 'running' && initialData.intervalStartMs) {
      const additional = Math.floor((Date.now() - initialData.intervalStartMs) / 1000);
      return initialData.accumulatedSeconds + Math.max(0, additional);
    }
    return initialData.accumulatedSeconds || 0;
  });

  const [ambientSound, setAmbientSound] = useState<'rain' | 'whitenoise' | 'off'>('off');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [finishedSummary, setFinishedSummary] = useState<FinishedSummary | null>(null);

  // Web Audio ambient synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAmbientSound = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch {}
      noiseSourceRef.current = null;
    }
  };

  const startAmbientSound = (type: 'rain' | 'whitenoise') => {
    stopAmbientSound();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else {
          data[i] = white * 0.15;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    } catch (err) {
      console.warn('Ambient audio error:', err);
    }
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  };

  // Toggle ambient audio
  const handleToggleSound = () => {
    if (ambientSound === 'off') {
      setAmbientSound('rain');
      startAmbientSound('rain');
    } else if (ambientSound === 'rain') {
      setAmbientSound('whitenoise');
      startAmbientSound('whitenoise');
    } else {
      setAmbientSound('off');
      stopAmbientSound();
    }
  };

  const handleSelectSound = (sound: 'rain' | 'whitenoise' | 'off') => {
    if (sound === 'off') stopAmbientSound();
    else startAmbientSound(sound);
    setAmbientSound(sound);
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Timestamp-based count-up ticker (resilient to browser throttling, sleep, background tabs)
  useEffect(() => {
    if (status !== 'running' || !intervalStartMs) return;

    const tick = () => {
      const now = Date.now();
      const currentIntervalSec = Math.floor((now - intervalStartMs) / 1000);
      const total = accumulatedSeconds + Math.max(0, currentIntervalSec);
      setDisplaySeconds(total);
    };

    tick();
    const intervalId = setInterval(tick, 250);

    return () => clearInterval(intervalId);
  }, [status, intervalStartMs, accumulatedSeconds]);

  // Periodic persistence of active session to localStorage
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const payload: StoredStopwatchSession = {
        status,
        sessionStartTime,
        accumulatedSeconds,
        intervalStartMs,
        activeGoalText,
      };
      localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify(payload));
    }
  }, [status, sessionStartTime, accumulatedSeconds, intervalStartMs, activeGoalText]);

  // Format stopwatch as 00:00:00 (Hours, Minutes, Seconds)
  const formatStopwatch = (totalSec: number): string => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Format duration nicely for statistics (e.g., "1h 45m" or "25m")
  const formatDurationHuman = (seconds: number): string => {
    if (seconds === 0) return '0m';
    if (seconds < 60) return `${seconds}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Timer Controls
  const handleStartStudying = () => {
    const now = Date.now();
    const startIso = sessionStartTime || new Date().toISOString();
    setSessionStartTime(startIso);
    setIntervalStartMs(now);
    setStatus('running');
  };

  const handleTakeBreak = () => {
    const now = Date.now();
    const currentActiveSec = intervalStartMs ? Math.floor((now - intervalStartMs) / 1000) : 0;
    const newAccumulated = accumulatedSeconds + Math.max(0, currentActiveSec);

    setAccumulatedSeconds(newAccumulated);
    setIntervalStartMs(null);
    setStatus('paused');
    setDisplaySeconds(newAccumulated);

    const payload: StoredStopwatchSession = {
      status: 'paused',
      sessionStartTime,
      accumulatedSeconds: newAccumulated,
      intervalStartMs: null,
      activeGoalText,
    };
    localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify(payload));
  };

  const handleResumeStudying = () => {
    const now = Date.now();
    setIntervalStartMs(now);
    setStatus('running');

    const payload: StoredStopwatchSession = {
      status: 'running',
      sessionStartTime: sessionStartTime || new Date().toISOString(),
      accumulatedSeconds,
      intervalStartMs: now,
      activeGoalText,
    };
    localStorage.setItem(STOPWATCH_STORAGE_KEY, JSON.stringify(payload));
  };

  const handleFinishSession = () => {
    let totalSec = accumulatedSeconds;
    if (status === 'running' && intervalStartMs) {
      totalSec += Math.max(0, Math.floor((Date.now() - intervalStartMs) / 1000));
    }

    if (totalSec < 3) {
      handleConfirmReset();
      return;
    }

    const endTime = new Date().toISOString();
    const startTime = sessionStartTime || new Date(Date.now() - totalSec * 1000).toISOString();
    const durationMinutes = Math.max(1, Math.round(totalSec / 60));

    addFocusSession({
      durationMinutes,
      durationSeconds: totalSec,
      startTime,
      endTime,
      type: 'study',
      notes: activeGoalText,
    });

    localStorage.removeItem(STOPWATCH_STORAGE_KEY);
    setFinishedSummary({
      durationSeconds: totalSec,
      startTime,
      endTime,
      goal: activeGoalText,
    });
    setStatus('completed');
    stopAmbientSound();
    setAmbientSound('off');
    playChime();
  };

  const handleRequestReset = () => {
    let totalSec = accumulatedSeconds;
    if (status === 'running' && intervalStartMs) {
      totalSec += Math.max(0, Math.floor((Date.now() - intervalStartMs) / 1000));
    }

    if (totalSec >= 10) {
      setShowResetConfirm(true);
    } else {
      handleConfirmReset();
    }
  };

  const handleConfirmReset = () => {
    localStorage.removeItem(STOPWATCH_STORAGE_KEY);
    setStatus('idle');
    setAccumulatedSeconds(0);
    setIntervalStartMs(null);
    setSessionStartTime(null);
    setDisplaySeconds(0);
    setShowResetConfirm(false);
    setFinishedSummary(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Focus Statistics derived from actual saved sessions
  const todayLocal = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const todaySavedSessions = state.focusSessions.filter(s => {
    if (!s.completedAt) return false;
    const d = new Date(s.completedAt);
    const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return localDate === todayLocal;
  });

  const todayStudySeconds = todaySavedSessions.reduce((acc, s) => {
    if (typeof s.durationSeconds === 'number') return acc + s.durationSeconds;
    return acc + (s.durationMinutes * 60);
  }, 0);

  const todayCompletedCount = todaySavedSessions.length;

  const allTimeStudySeconds = state.focusSessions.reduce((acc, s) => {
    if (typeof s.durationSeconds === 'number') return acc + s.durationSeconds;
    return acc + (s.durationMinutes * 60);
  }, 0);

  const allTimeSessionsCount = state.focusSessions.length;

  return (
    <div className="focus-studio-view relative min-h-[620px] rounded-[2.5rem] bg-gradient-to-b from-[#18231E] via-[#121B17] to-[#0A100E] text-white p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col justify-between overflow-hidden border border-emerald-950/40 select-none">
      <header className="focus-studio-hero app-page-hero">
        <div className="focus-studio-hero-copy">
          <span className="app-page-kicker"><i /> YOUR SPACE TO RESET</span>
          <h1>Focus Studio <Sparkles size={24} aria-hidden="true" /></h1>
          <p>A calm place to study, do deep work, and build consistency.</p>
        </div>
      </header>
      
      {/* Background ambient subtle glow */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
        status === 'running' ? 'bg-emerald-500/15' : status === 'paused' ? 'bg-amber-500/10' : 'bg-emerald-500/5'
      }`} />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#7C9070]/10 rounded-full blur-2xl pointer-events-none" />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-emerald-300">PULSE FOCUS STUDIO</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-mono font-bold ${
                status === 'running' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : status === 'paused'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}>
                {status === 'running' ? 'Studying' : status === 'paused' ? 'Break' : 'Ready'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/50 hidden sm:block">Flexible study stopwatch with active time tracking.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Controller */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs">
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                ambientSound !== 'off' ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40 hover:text-white'
              }`}
              title="Toggle ambient noise"
            >
              {ambientSound !== 'off' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="text-[11px] font-mono pr-2 text-white/70 capitalize hidden sm:inline">
              {ambientSound === 'off' ? 'Sound Off' : ambientSound === 'rain' ? 'Gentle Rain' : 'White Noise'}
            </span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Return */}
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 rounded-xl text-white/70 transition-colors cursor-pointer"
              title="Exit Zen Sanctuary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CENTERPIECE */}
      <div className="relative z-10 py-8 md:py-12 flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Singular Intention Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 max-w-md w-full justify-center">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={activeGoalText}
            onChange={(e) => setActiveGoalText(e.target.value)}
            disabled={status === 'completed'}
            className="bg-transparent text-center font-medium focus:outline-none focus:border-b focus:border-emerald-400 text-xs w-full text-white placeholder-white/30 truncate"
            placeholder="What is your singular focus right now?"
          />
        </div>

        {/* Stopwatch Display with Zen Pulsing Ring */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Subtle Ambient Ring */}
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
            status === 'running'
              ? 'border-emerald-400/50 shadow-[0_0_60px_rgba(52,211,153,0.22)] scale-100 animate-pulse'
              : status === 'paused'
              ? 'border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.15)] scale-98'
              : 'border-white/10'
          }`} />

          {/* Secondary concentric dashed ring */}
          <div className="absolute inset-5 rounded-full border border-dashed border-white/10 pointer-events-none" />

          {/* Huge Digital Stopwatch Display */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-5xl sm:text-6xl md:text-7xl font-mono font-extrabold tracking-tight text-white drop-shadow-lg select-text">
              {formatStopwatch(displaySeconds)}
            </div>

            {/* Dynamic Status Indicator */}
            <div className="flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-black/30 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${
                status === 'running' 
                  ? 'bg-emerald-400 animate-ping' 
                  : status === 'paused' 
                  ? 'bg-amber-400' 
                  : status === 'completed'
                  ? 'bg-sky-400'
                  : 'bg-slate-400'
              }`} />
              <span className="text-[11px] uppercase font-mono tracking-widest text-white/80 font-bold">
                {status === 'running' ? 'Active Flow • Counting Up' :
                 status === 'paused' ? 'On a Break • Time Frozen' :
                 status === 'completed' ? 'Session Concluded' : 'Ready to Study'}
              </span>
            </div>

            {/* Subtext info */}
            <p className="text-[11px] text-white/40 mt-2 font-mono">
              {status === 'running' ? 'Study freely for as long as you want' :
               status === 'paused' ? 'Break time excluded from study total' :
               'Count-up stopwatch starting from 00:00:00'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          
          {/* IDLE STATE: Start Button */}
          {status === 'idle' && (
            <button
              onClick={handleStartStudying}
              className="px-8 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-400/20 flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Studying</span>
            </button>
          )}

          {/* RUNNING STATE: Break, Finish, Reset */}
          {status === 'running' && (
            <>
              <button
                onClick={handleTakeBreak}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <Coffee className="w-4 h-4" />
                <span>Take a Break / Pause</span>
              </button>

              <button
                onClick={handleFinishSession}
                className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-400/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Session</span>
              </button>

              <button
                onClick={handleRequestReset}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* PAUSED STATE: Resume, Finish, Reset */}
          {status === 'paused' && (
            <>
              <button
                onClick={handleResumeStudying}
                className="px-7 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-400/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Studying</span>
              </button>

              <button
                onClick={handleFinishSession}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Finish Session</span>
              </button>

              <button
                onClick={handleRequestReset}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* COMPLETED STATE: Start New Session */}
          {status === 'completed' && (
            <button
              onClick={handleConfirmReset}
              className="px-7 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-400/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Session</span>
            </button>
          )}

        </div>
      </div>

      <aside className="focus-environment-panel">
        <section className="focus-sounds-card">
          <div className="resources-panel-heading"><div><span className="app-page-kicker">SETTLE IN</span><h2>Ambient sounds</h2></div></div>
          <div className="focus-sound-options">
            {([
              ['off', 'Quiet', '◌'],
              ['rain', 'Gentle rain', '☂'],
              ['whitenoise', 'White noise', '〰'],
            ] as const).map(([sound, label, glyph]) => <button type="button" key={sound} className={ambientSound === sound ? 'active' : ''} onClick={() => handleSelectSound(sound)}><span>{glyph}</span><b>{label}</b></button>)}
          </div>
        </section>
        <blockquote className="focus-motivation-note">“ Small steps every day lead to big results. ”<span>Choose one thing. That’s enough for now.</span></blockquote>
        <section className="focus-tasks-card">
          <div className="resources-panel-heading"><div><span className="app-page-kicker">ONE NEXT STEP</span><h2>Focus tasks</h2></div></div>
          {state.commitments.filter(item => !item.completed).slice(0, 4).map(item => <div className="focus-task-row" key={item.id}><span className="focus-task-dot" /><span><b>{item.title}</b><small>{item.subject || item.type}</small></span><small>{item.estimatedEffort || 'A little at a time'}</small></div>)}
          {state.commitments.filter(item => !item.completed).length === 0 && <p className="assistant-empty-state">A clear list is a good place to start.</p>}
        </section>
      </aside>

      {/* FOCUS STATISTICS BAR */}
      <div className="relative z-10 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Study Time Today</span>
          </div>
          <div className="text-lg md:text-xl font-bold font-mono text-white">
            {formatDurationHuman(todayStudySeconds)}
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            {todayCompletedCount} completed today
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Daily Streak</span>
          </div>
          <div className="text-lg md:text-xl font-bold font-mono text-white">
            {state.streakDays} Days
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Consistent learning
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-sky-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">All-Time Study</span>
          </div>
          <div className="text-lg md:text-xl font-bold font-mono text-white">
            {formatDurationHuman(allTimeStudySeconds)}
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            {allTimeSessionsCount} total sessions
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Current Session</span>
          </div>
          <div className="text-lg md:text-xl font-bold font-mono text-emerald-300">
            {formatStopwatch(displaySeconds)}
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            {status === 'running' ? 'Active study' : status === 'paused' ? 'Paused' : 'Elapsed time'}
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121B17] border border-emerald-900/60 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Study Session?</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                You have accumulated <strong className="text-amber-300">{formatStopwatch(displaySeconds)}</strong> of focused study time in this session. Resetting will clear this active timer. Previously saved session records will remain safe.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Keep Studying
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SESSION SUMMARY MODAL ON FINISH */}
      <AnimatePresence>
        {status === 'completed' && finishedSummary && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#121B17] border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Session Complete!</h3>
                    <p className="text-xs text-emerald-300/70">Focus recorded to your permanent statistics</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleConfirmReset();
                    onExit?.();
                  }}
                  className="p-1.5 text-white/40 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Active Study Time</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {formatStopwatch(finishedSummary.durationSeconds)}
                  </div>
                  <span className="text-[11px] text-white/60 font-medium">
                    ({formatDurationHuman(finishedSummary.durationSeconds)})
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Time Span</span>
                  <div className="text-xs font-mono text-white mt-1">
                    {new Date(finishedSummary.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &rarr; {new Date(finishedSummary.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="text-[10px] text-emerald-300/70 mt-1">Break intervals excluded</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Focus Topic</span>
                <p className="text-xs font-medium text-white">{finishedSummary.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleConfirmReset();
                    onExit?.();
                  }}
                  className="py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

