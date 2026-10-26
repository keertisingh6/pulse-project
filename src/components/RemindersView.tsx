import React, { useMemo } from 'react';
import { Bell, BellRing, CalendarDays, CheckCircle2, Clock3, ArrowUpRight } from 'lucide-react';
import { usePulse } from '../context/PulseContext';

const reminderLabels: Record<string, string> = {
  oneDayBefore: '1 day before',
  threeDaysBefore: '3 days before',
  sixHoursBefore: '6 hours before',
  twoHoursBefore: '2 hours before',
  oneHourBefore: '1 hour before',
  fifteenMinBefore: '15 minutes before',
  atStart: 'At start time',
};

export const RemindersView: React.FC<{ onOpenCommitments: () => void }> = ({ onOpenCommitments }) => {
  const { state } = usePulse();
  const reminders = useMemo(() => state.commitments
    .filter(item => !item.completed && item.reminders && Object.values(item.reminders).some(Boolean))
    .sort((a, b) => (a.dueDate + (a.dueTime || '')).localeCompare(b.dueDate + (b.dueTime || ''))), [state.commitments]);

  return (
    <div className="reminders-page">
      <section className="reminders-hero">
        <div><span className="reminders-eyebrow"><span /> A LITTLE HEADS-UP</span><h1>Remember what matters.</h1><p>Your upcoming reminders, gathered in one calm timeline.</p></div>
        <span className="reminders-hero-art"><BellRing size={36} strokeWidth={1.3} /></span>
        <span className="reminders-count">{reminders.length} active</span>
      </section>

      <section className="reminders-card">
        <div className="reminders-card-heading"><div><span className="reminders-eyebrow">IN DATE ORDER</span><h2>Coming up</h2></div><button onClick={onOpenCommitments}>Manage commitments <ArrowUpRight size={14} /></button></div>
        {reminders.length ? (
          <div className="reminders-timeline">
            {reminders.map(item => (
              <article className="reminder-row" key={item.id}>
                <span className="reminder-date"><CalendarDays size={15} /><b>{new Date(item.dueDate + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</b><small>{item.dueTime || 'Any time'}</small></span>
                <span className="reminder-rail"><i /></span>
                <div className="reminder-detail"><div><h3>{item.title}</h3><span>{item.subject || item.type}</span></div><div className="reminder-chip-list">{Object.entries(item.reminders || {}).filter(([, enabled]) => enabled).map(([key]) => <span className="reminder-chip" key={key}><Clock3 size={11} />{reminderLabels[key] || 'Reminder'}</span>)}</div></div>
                <span className={'dashboard-priority priority-' + item.priority}>{item.priority}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="reminders-empty"><span className="reminders-empty-icon"><CheckCircle2 size={24} /></span><h3>You’re all caught up.</h3><p>Choose a reminder when you add or edit a commitment, and it’ll appear here.</p><button onClick={onOpenCommitments}><Bell size={14} /> Add a reminder</button></div>
        )}
      </section>
    </div>
  );
};

