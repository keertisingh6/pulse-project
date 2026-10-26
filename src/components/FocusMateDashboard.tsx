import React, { useEffect, useMemo, useState } from 'react';
import { usePulse } from '../context/PulseContext';
import {
  ArrowRight, ArrowUpRight, Bot, CalendarDays, Check, CheckCircle2,
  BookOpen, Flame, Focus, Layers, List, Pause, Play, Plus, RotateCcw, Sparkles,
  Target, Timer, WandSparkles,
} from 'lucide-react';
import { getLocalTodayDateString } from '../utils/deadlineUtils';
import { TodoTower } from './bencho/TodoTower';
import { Particles } from './bencho/Particles';
import type { Commitment } from '../types';

interface FocusMateDashboardProps {
  onNavigateToTab: (tab: string) => void;
  onAskKairo: (message: string) => void;
}

const priorityRank: Record<Commitment['priority'], number> = { high: 0, medium: 1, low: 2 };

const formatDueDate = (date: string) => {
  if (!date) return 'No due date';
  const today = getLocalTodayDateString();
  if (date === today) return 'Today';
  const parsed = new Date(date + 'T12:00:00');
  if (Number.isNaN(parsed.getTime())) return 'Date to confirm';
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const daysUntil = (date: string) => {
  if (!date) return null;
  const due = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(due.getTime())) return null;
  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return hours + ':' + minutes + ':' + remaining;
};

export const FocusMateDashboard: React.FC<FocusMateDashboardProps> = ({ onNavigateToTab, onAskKairo }) => {
  const { state, addCommitment, toggleCommitment, addFocusSession } = usePulse();
  const displayName = state.user?.name || state.userName || 'Student';
  const todayKey = getLocalTodayDateString();
  const todayDate = new Date();
  const firstName = displayName.trim().split(/\s+/)[0] || 'there';
  const [quickTask, setQuickTask] = useState('');
  const [kairoQuestion, setKairoQuestion] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [taskView, setTaskView] = useState<'list' | 'stack'>('list');
  const [focusTaskId, setFocusTaskId] = useState<string | undefined>();

  useEffect(() => {
    if (!timerActive) return;
    const interval = window.setInterval(() => setTimerSeconds(value => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerActive]);

  const activeCommitments = useMemo(() => state.commitments
    .filter(item => !item.completed)
    .sort((a, b) => {
      const dateCompare = (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
      return dateCompare || priorityRank[a.priority] - priorityRank[b.priority];
    }), [state.commitments]);

  const dueNow = activeCommitments.filter(item => item.dueDate && item.dueDate <= todayKey);
  const upcoming = activeCommitments.filter(item => !item.dueDate || item.dueDate > todayKey).slice(0, 4);
  const recommendedTask = activeCommitments[0];
  const activeGoal = state.goals.find(goal => goal.progressPercentage < 100);
  const subjectStats = (Object.values(state.commitments.reduce<Record<string, { name: string; total: number; done: number }>>((groups, item) => {
    const name = item.subject || 'General';
    const group = groups[name] || (groups[name] = { name, total: 0, done: 0 });
    group.total += 1;
    if (item.completed) group.done += 1;
    return groups;
  }, {})) as Array<{ name: string; total: number; done: number }>).slice(0, 4);
  const completedToday = state.commitments.filter(item => item.completed && item.completedAt?.slice(0, 10) === todayKey).length;
  const focusMinutesToday = state.focusSessions
    .filter(item => item.completedAt?.slice(0, 10) === todayKey)
    .reduce((total, item) => total + (item.durationMinutes || 0), 0);
  const focusProgress = Math.min(100, Math.round((focusMinutesToday / 180) * 100));

  const startNextTask = () => {
    setFocusTaskId(recommendedTask?.id);
    setTimerActive(true);
    onNavigateToTab('dashboard');
  };

  const handleQuickAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const title = quickTask.trim();
    if (!title) return;
    addCommitment({
      title,
      subject: 'Personal',
      type: 'Task',
      dueDate: todayKey,
      dueTime: '',
      estimatedEffort: '30 min',
      effortMinutes: 30,
      priority: 'medium',
      completed: false,
      source: 'manual',
    });
    setQuickTask('');
  };

  const finishTimer = () => {
    setTimerActive(false);
    if (timerSeconds >= 3) {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - timerSeconds * 1000).toISOString();
      addFocusSession({
        durationMinutes: Math.max(1, Math.round(timerSeconds / 60)),
        durationSeconds: timerSeconds,
        startTime,
        endTime,
        commitmentId: focusTaskId,
        type: 'study',
        notes: recommendedTask?.id === focusTaskId ? recommendedTask.title : 'Focus session',
      });
    }
    setTimerSeconds(0);
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <div className="dashboard-eyebrow"><span className="dashboard-live-dot" /> YOUR SPACE, IN RHYTHM</div>
          <h1>Good {todayDate.getHours() < 12 ? 'morning' : todayDate.getHours() < 17 ? 'afternoon' : 'evening'}, {firstName}.</h1>
          <p>{dueNow.length > 0
            ? 'You have ' + dueNow.length + ' commitment' + (dueNow.length === 1 ? '' : 's') + ' to tend to today. Let’s find a good place to begin.'
            : activeCommitments.length > 0
              ? 'Your next commitment is ' + formatDueDate(activeCommitments[0].dueDate) + '. Keep the day spacious and take one step at a time.'
              : 'Your list is clear. Take a breath, or add a small intention for the day.'}</p>
          <div className="dashboard-hero-actions">
            <button className="dashboard-primary-action" onClick={startNextTask}><Play size={15} /> Start my next task <ArrowRight size={15} /></button>
            <button className="dashboard-secondary-action" onClick={() => onNavigateToTab('planner')}>View today’s plan <ArrowUpRight size={15} /></button>
          </div>
        </div>
        <div className="dashboard-sky-art" aria-hidden="true">
          <span className="dashboard-sun" />
          <span className="dashboard-cloud cloud-left" />
          <span className="dashboard-cloud cloud-right" />
          <span className="dashboard-sky-label">A LITTLE MORE<br />ROOM TO BREATHE</span>
          <div className="dashboard-illustration" aria-hidden="true">
            <svg viewBox="0 0 180 190" role="presentation">
              <ellipse cx="90" cy="174" rx="57" ry="10" fill="#8773b8" opacity=".12" />
              <path d="M42 164c5-35 20-52 48-52s44 17 48 52c-16 12-80 12-96 0Z" fill="#b7a2e6" />
              <path d="M65 113c5 13 14 20 25 20s20-7 25-20l-8-14H73l-8 14Z" fill="#efc8ae" />
              <ellipse cx="90" cy="72" rx="40" ry="47" fill="#f1cdb5" />
              <path d="M51 75c-6-36 12-59 40-59 29 0 45 21 39 57-7-2-12-9-16-21-18 10-39 12-59 9l-4 14Z" fill="#493b5d" />
              <path d="M60 77c0 25 12 43 30 43s30-18 30-43" fill="#f1cdb5" />
              <circle cx="76" cy="80" r="2.5" fill="#493b5d" /><circle cx="104" cy="80" r="2.5" fill="#493b5d" />
              <path d="M82 96c5 5 11 5 16 0" fill="none" stroke="#ba7777" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="63" cy="88" r="7" fill="#e8a99d" opacity=".45" /><circle cx="117" cy="88" r="7" fill="#e8a99d" opacity=".45" />
              <path d="M43 150c-16-8-19-22-8-31 11-8 22 1 31 12" fill="#f1cdb5" />
              <path d="M137 151c16-8 19-22 8-31-11-8-22 1-31 12" fill="#f1cdb5" />
              <path d="M76 119c-2 11 4 19 14 19s16-8 14-19" fill="#fffaf7" />
            </svg>
            <div className="dashboard-plant"><i /><i /><i /><span /></div>
          </div>
          <div className="dashboard-glass-note"><span className="dashboard-note-mark"><WandSparkles size={15} /></span><span><b>Small steps count.</b><small>Make today feel doable.</small></span></div>
        </div>
        <div className="dashboard-particles" aria-hidden="true"><Particles shape="Circle" reach={55} force={26} grain="Fine" /></div>
        <div className="dashboard-hero-grain" aria-hidden="true" />
      </section>

      <section className="dashboard-metrics" aria-label="Your progress">
        <article className="dashboard-metric-card">
          <span className="dashboard-metric-icon"><Focus size={17} /></span>
          <span className="dashboard-metric-label">FOCUS TODAY</span>
          <strong>{focusMinutesToday < 60 ? focusMinutesToday + 'm' : Math.floor(focusMinutesToday / 60) + 'h ' + (focusMinutesToday % 60) + 'm'}</strong>
          <div className="dashboard-progress-track"><span style={{ width: focusProgress + '%' }} /></div>
        </article>
        <article className="dashboard-metric-card">
          <span className="dashboard-metric-icon"><CheckCircle2 size={17} /></span>
          <span className="dashboard-metric-label">TASKS COMPLETED</span>
          <strong>{completedToday}</strong>
          <small>small steps, all yours</small>
        </article>
        <article className="dashboard-metric-card">
          <span className="dashboard-metric-icon"><Target size={17} /></span>
          <span className="dashboard-metric-label">ACTIVE GOALS</span>
          <strong>{state.goals.filter(goal => goal.progressPercentage < 100).length}</strong>
          <small>room to grow at your pace</small>
        </article>
        <article className="dashboard-metric-card">
          <span className="dashboard-metric-icon"><Flame size={17} /></span>
          <span className="dashboard-metric-label">YOUR RHYTHM</span>
          <strong>{state.streakDays} {state.streakDays === 1 ? 'day' : 'days'}</strong>
          <small>{state.streakDays > 0 ? 'in a row, at your pace' : 'begin whenever you’re ready'}</small>
        </article>
      </section>

      <section className="dashboard-next-action">
        <div className="dashboard-next-copy">
          <span className="dashboard-section-kicker"><span className="dashboard-live-dot" /> RECOMMENDED NEXT ACTION</span>
          <h2>{recommendedTask?.title || 'Choose one small thing to begin.'}</h2>
          <p>{recommendedTask ? (recommendedTask.subject || recommendedTask.type) + ' · ' + (recommendedTask.estimatedEffort || 'A little at a time') : 'Your space is clear for now. Add a task or ask Kairo to help plan your day.'}</p>
          <div className="dashboard-next-meta">
            {recommendedTask && <span><CalendarDays size={13} /> {formatDueDate(recommendedTask.dueDate)}{recommendedTask.dueTime ? ' · ' + recommendedTask.dueTime : ''}</span>}
            {recommendedTask && <span className={'dashboard-priority priority-' + recommendedTask.priority}>{recommendedTask.priority} priority</span>}
            {recommendedTask && <span>{recommendedTask.effortMinutes ? recommendedTask.effortMinutes + ' min' : recommendedTask.estimatedEffort}</span>}
          </div>
        </div>
        <div className="dashboard-next-timer">
          <div className="dashboard-next-clock"><span>{formatTime(timerSeconds)}</span><small>{timerActive ? 'Focus is underway' : 'Start when you’re ready'}</small></div>
          <div className="dashboard-timer-controls">
            <button className="dashboard-reset-button" onClick={() => { setTimerActive(false); setTimerSeconds(0); }} aria-label="Reset focus timer"><RotateCcw size={15} /></button>
            <button className="dashboard-timer-button" onClick={() => { setFocusTaskId(recommendedTask?.id); setTimerActive(value => !value); }}>{timerActive ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Start focus</>}</button>
            {!timerActive && timerSeconds > 0 && <button className="dashboard-save-button" onClick={finishTimer}>Save</button>}
          </div>
        </div>
        <div className="dashboard-next-glow" aria-hidden="true" />
      </section>

      <section className="dashboard-schedule-strip">
        <div className="dashboard-schedule-heading"><div><span className="dashboard-section-kicker">TODAY, WITH ROOM TO BREATHE</span><h2>Your plan</h2></div><button onClick={() => onNavigateToTab('planner')}>Open planner <ArrowUpRight size={13} /></button></div>
        {state.dailyPlan?.length ? <div className="dashboard-schedule-items">{state.dailyPlan.slice(0, 4).map((item, index) => <article className={'dashboard-schedule-item schedule-tone-' + (index % 4)} key={item.id || item.title}><span className="dashboard-schedule-time">{item.timeSlot}</span><b>{item.title}</b><small>{item.type}</small></article>)}</div> : <div className="dashboard-schedule-empty"><span>No plan blocks yet. A gentle outline can make the day easier to see.</span><button onClick={() => onNavigateToTab('planner')}>Build a day plan <ArrowRight size={13} /></button></div>}
      </section>

      <div className="dashboard-content-grid">
        <section className="dashboard-card dashboard-task-card">
          <div className="dashboard-card-heading">
            <div><span className="dashboard-section-kicker">A CLEAR NEXT STEP</span><h2>On your mind</h2><p>Keep the important things close, without carrying them all at once.</p></div>
            <div className="dashboard-task-tools">
              <div className="dashboard-view-switch" role="group" aria-label="Task display">
                <button className={taskView === 'list' ? 'selected' : ''} onClick={() => setTaskView('list')} aria-label="List view"><List size={14} /></button>
                <button className={taskView === 'stack' ? 'selected' : ''} onClick={() => setTaskView('stack')} aria-label="Stack view"><Layers size={14} /></button>
              </div>
              <button className="dashboard-icon-link" onClick={() => onNavigateToTab('commitments')} aria-label="View all commitments"><ArrowUpRight size={17} /></button>
            </div>
          </div>
          <form className="dashboard-quick-add" onSubmit={handleQuickAdd}>
            <Plus size={16} />
            <input value={quickTask} onChange={event => setQuickTask(event.target.value)} placeholder="Add a small task for today…" aria-label="Quick add a commitment" />
            <button type="submit" disabled={!quickTask.trim()}>Add</button>
          </form>
          {dueNow.length === 0 && activeCommitments.length === 0 ? (
            <div className="dashboard-empty"><CheckCircle2 size={22} /><b>Nothing urgent is waiting.</b><span>Add a commitment above, or enjoy the breathing room.</span></div>
          ) : taskView === 'list' ? (
            <div className="dashboard-task-list">
              {(dueNow.length ? dueNow : activeCommitments).slice(0, 5).map(item => (
                <article className="dashboard-task-row" key={item.id}>
                  <button className="dashboard-task-check" onClick={() => toggleCommitment(item.id)} aria-label={'Complete ' + item.title}><Check size={13} /></button>
                  <div className="dashboard-task-copy"><b>{item.title}</b><span>{item.subject || item.type} <i /> {formatDueDate(item.dueDate)}</span></div>
                  <span className={'dashboard-priority priority-' + item.priority}>{item.priority}</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-tower-stage">
              <TodoTower items={activeCommitments.slice(0, 8).map(({ id, title }) => ({ id, title }))} onComplete={toggleCommitment} />
              <small>Move a card, or tap one to mark it complete.</small>
            </div>
          )}
          <button className="dashboard-text-action" onClick={() => onNavigateToTab('commitments')}>See all commitments <ArrowRight size={14} /></button>
        </section>

        <section className="dashboard-card dashboard-upcoming-card">
          <div className="dashboard-card-heading">
            <div><span className="dashboard-section-kicker">AHEAD, AT YOUR PACE</span><h2>Coming up</h2><p>Your next commitments, in date order.</p></div>
            <button className="dashboard-icon-link" onClick={() => onNavigateToTab('calendar')} aria-label="Open calendar"><CalendarDays size={17} /></button>
          </div>
          {upcoming.length === 0 ? (
            <div className="dashboard-inline-empty">No upcoming commitments yet.</div>
          ) : (
            <div className="dashboard-upcoming-list">
              {upcoming.map(item => (
                <article className="dashboard-upcoming-row" key={item.id}>
                  <span className={'dashboard-deadline-ring priority-' + item.priority} style={{ '--deadline-progress': Math.max(8, 100 - Math.max(0, daysUntil(item.dueDate) || 0) * 8) + '%' } as React.CSSProperties}>
                    <span>{daysUntil(item.dueDate) === null ? '—' : daysUntil(item.dueDate) === 0 ? '!' : daysUntil(item.dueDate) + 'd'}</span>
                  </span>
                  <div><b>{item.title}</b><small>{item.subject || item.type}{item.dueTime ? ' · ' + item.dueTime : ''}</small></div>
                  <span className={'dashboard-priority priority-' + item.priority}>{daysUntil(item.dueDate) === null ? 'No date' : daysUntil(item.dueDate) === 0 ? 'Today' : daysUntil(item.dueDate) + ' days'}</span>
                </article>
              ))}
            </div>
          )}
          <button className="dashboard-text-action" onClick={() => onNavigateToTab('calendar')}>Open calendar <ArrowRight size={14} /></button>
        </section>

        <section className="dashboard-card dashboard-academic-card">
          <div className="dashboard-card-heading"><div><span className="dashboard-section-kicker">PROGRESS, IN PERSPECTIVE</span><h2>Academic progress</h2><p>Work moving forward, one piece at a time.</p></div><button className="dashboard-icon-link" onClick={() => onNavigateToTab('database')} aria-label="View academics"><BookOpen size={17} /></button></div>
          {subjectStats.length ? <div className="dashboard-subject-list">{subjectStats.map((subject, index) => <div className="dashboard-subject-row" key={subject.name}><div><b>{subject.name}</b><small>{subject.done} of {subject.total} complete</small></div><div className={'dashboard-subject-track subject-tone-' + index}><span style={{ width: Math.round((subject.done / subject.total) * 100) + '%' }} /></div></div>)}</div> : <div className="dashboard-inline-empty">Add coursework to see your progress by subject.</div>}
          <button className="dashboard-text-action" onClick={() => onNavigateToTab('database')}>View syllabus & assignments <ArrowRight size={14} /></button>
        </section>

        <section className="dashboard-card dashboard-kairo-card">
          <div className="dashboard-kairo-orb" aria-hidden="true"><span>✳</span></div>
          <span className="dashboard-section-kicker">HERE WHEN YOU NEED A HAND</span>
          <h2>Let’s untangle<br /><em>what comes next.</em></h2>
          <p>{recommendedTask ? 'Want me to break down ' + recommendedTask.title + ' into smaller steps?' : 'Want help shaping a gentle plan for your day?'}</p>
          <form className="dashboard-kairo-form" onSubmit={event => { event.preventDefault(); const question = kairoQuestion.trim(); if (!question) return; onAskKairo(question); setKairoQuestion(''); }}>
            <input aria-label="Ask Kairo from your dashboard" value={kairoQuestion} onChange={event => setKairoQuestion(event.target.value)} placeholder="Ask Kairo about your day…" />
            <button type="submit" aria-label="Open Kairo with this question" disabled={!kairoQuestion.trim()}><ArrowRight size={15} /></button>
          </form>
          <button className="dashboard-kairo-link" onClick={() => onNavigateToTab('assistant')}><Bot size={14} /> Open Kairo <ArrowUpRight size={12} /></button>
        </section>

        {activeGoal && <section className="dashboard-goal-banner"><div className="dashboard-goal-icon"><Target size={20} /></div><div><span className="dashboard-section-kicker">A MILESTONE IN MOTION</span><h2>{activeGoal.title}</h2><p>{activeGoal.progressPercentage}% complete · {activeGoal.description}</p></div><div className="dashboard-goal-progress"><span style={{ width: activeGoal.progressPercentage + '%' }} /></div><button onClick={() => onNavigateToTab('goals')}>See your roadmap <ArrowRight size={14} /></button></section>}
      </div>
    </div>
  );
};

