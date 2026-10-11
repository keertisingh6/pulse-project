import { Commitment } from '../types';

/**
 * Formats a Date object or YYYY-MM-DD string into an iCalendar date-time string (UTC).
 * Format: YYYYMMDDTHHMMSSZ or YYYYMMDD for all-day events.
 */
function formatDateToICS(dateStr: string, timeStr?: string): { icsStart: string; icsEnd: string; isAllDay: boolean } {
  // dateStr is YYYY-MM-DD
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10) || new Date().getFullYear();
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  if (timeStr && timeStr.includes(':')) {
    const timeParts = timeStr.split(':');
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;

    const startDate = new Date(year, month - 1, day, hours, minutes, 0);
    // Default duration: 1 hour if not specified
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatUtc = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };

    return {
      icsStart: formatUtc(startDate),
      icsEnd: formatUtc(endDate),
      isAllDay: false,
    };
  }

  // All-day event (VALUE=DATE)
  const pad = (n: number) => String(n).padStart(2, '0');
  const icsDate = `${year}${pad(month)}${pad(day)}`;
  
  // Next day for end date in iCalendar spec for all day events
  const nextDay = new Date(year, month - 1, day + 1);
  const icsNextDate = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;

  return {
    icsStart: icsDate,
    icsEnd: icsNextDate,
    isAllDay: true,
  };
}

/**
 * Escapes characters for iCalendar format (commas, semicolons, backslashes, newlines).
 */
function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates an RFC 5545 compliant iCalendar string (.ics) from an array of commitments.
 */
export function generateICSContent(commitments: Commitment[], calendarName: string = 'Pulse Commitments'): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pulse Productivity//Pulse Academic Companion//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calendarName)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  for (const c of commitments) {
    if (!c.dueDate) continue;

    const { icsStart, icsEnd, isAllDay } = formatDateToICS(c.dueDate, c.dueTime);
    const uid = `${c.id || Math.random().toString(36).substring(2)}@pulse.app`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);

    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${icsStart}`);
      lines.push(`DTEND;VALUE=DATE:${icsEnd}`);
    } else {
      lines.push(`DTSTART:${icsStart}`);
      lines.push(`DTEND:${icsEnd}`);
    }

    lines.push(`SUMMARY:${escapeICSText(c.title)}`);

    // Description composition
    const descriptionParts: string[] = [];
    descriptionParts.push(`Type: ${c.type}`);
    if (c.subject) descriptionParts.push(`Subject: ${c.subject}`);
    if (c.priority) descriptionParts.push(`Priority: ${c.priority.toUpperCase()}`);
    if (c.estimatedEffort) descriptionParts.push(`Estimated Effort: ${c.estimatedEffort}`);
    if (c.description) descriptionParts.push(`\nDetails:\n${c.description}`);
    if (c.notes) descriptionParts.push(`\nNotes:\n${c.notes}`);
    if (c.aiTip) descriptionParts.push(`\nPulse Tip:\n"${c.aiTip}"`);
    if (c.completed) descriptionParts.push(`\nStatus: Completed`);

    lines.push(`DESCRIPTION:${escapeICSText(descriptionParts.join('\n'))}`);

    if (c.location) {
      lines.push(`LOCATION:${escapeICSText(c.location)}`);
    }

    // Categories
    const categories: string[] = [c.type];
    if (c.subject) categories.push(c.subject);
    lines.push(`CATEGORIES:${escapeICSText(categories.join(','))}`);

    // Priority mapping (1=High, 5=Medium, 9=Low)
    if (c.priority === 'high') {
      lines.push('PRIORITY:1');
    } else if (c.priority === 'medium') {
      lines.push('PRIORITY:5');
    } else {
      lines.push('PRIORITY:9');
    }

    // Status
    if (c.completed) {
      lines.push('STATUS:COMPLETED');
    } else {
      lines.push('STATUS:CONFIRMED');
    }

    // Add reminder alarms based on commitment reminders or priority
    if (c.reminders?.oneDayBefore || c.priority === 'high') {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeICSText(`Reminder: ${c.title}`)}`);
      lines.push('TRIGGER:-P1D');
      lines.push('END:VALARM');
    }

    if (c.reminders?.oneHourBefore || c.dueTime) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeICSText(`Starting soon: ${c.title}`)}`);
      lines.push('TRIGGER:-PT1H');
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers a browser download of an .ics file from the given commitments.
 */
export function downloadICSFile(commitments: Commitment[], filename: string = 'pulse-commitments.ics'): void {
  const icsData = generateICSContent(commitments);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
