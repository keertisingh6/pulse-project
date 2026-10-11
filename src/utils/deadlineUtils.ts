/**
 * Deadline and Timezone Utilities for Pulse
 *
 * Ensures accurate local timezone handling, complete date+time comparisons,
 * dynamic overdue determination, and human-friendly countdown/deadline formatting.
 */

/**
 * Returns a local date in YYYY-MM-DD format without UTC skew.
 */
export const getLocalTodayDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns tomorrow's local date in YYYY-MM-DD format.
 */
export const getLocalTomorrowDateString = (d: Date = new Date()): string => {
  const tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return getLocalTodayDateString(tomorrow);
};

/**
 * Parses a task's dueDate (YYYY-MM-DD) and optional dueTime (HH:MM or HH:MM:SS)
 * strictly into a Date object in the user's local timezone.
 *
 * If dueTime is omitted or empty, it defaults to 23:59:59 (end of that due date),
 * ensuring that a task scheduled for a given day remains upcoming until the day ends.
 */
export const parseTaskDeadline = (dueDateStr: string, dueTimeStr?: string): Date => {
  if (!dueDateStr) return new Date();

  const [yearStr, monthStr, dayStr] = dueDateStr.split(/[-/]/);
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (dueTimeStr && dueTimeStr.trim()) {
    const timeParts = dueTimeStr.trim().split(':');
    const hour = parseInt(timeParts[0], 10);
    const min = parseInt(timeParts[1], 10);
    const sec = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    return new Date(year, month, day, isNaN(hour) ? 23 : hour, isNaN(min) ? 59 : min, isNaN(sec) ? 0 : sec, 0);
  }

  // If no time is explicitly provided, default to end of that calendar day in user's local timezone
  return new Date(year, month, day, 23, 59, 59, 999);
};

/**
 * Checks if a task is overdue.
 *
 * Strict Rules:
 * 1. Completed tasks are NEVER overdue.
 * 2. Incomplete tasks are overdue ONLY when the complete deadline (date AND time) has passed (now > deadline).
 * 3. A task due tomorrow at 12:00 PM is NOT overdue.
 * 4. A task due today at 12:00 PM becomes overdue ONLY after 12:00 PM if still incomplete.
 */
export const isTaskOverdue = (
  task: { completed?: boolean; dueDate?: string; dueTime?: string },
  now: Date = new Date()
): boolean => {
  if (task.completed) return false;
  if (!task.dueDate) return false;

  const deadline = parseTaskDeadline(task.dueDate, task.dueTime);
  return now.getTime() > deadline.getTime();
};

/**
 * Formats a 24-hour time string (e.g. "12:00", "09:30", "18:45") into a friendly 12-hour format ("12:00 PM", "9:30 AM").
 */
export const formatTime12Hour = (timeStr?: string): string => {
  if (!timeStr) return '';
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;
  let hour = parseInt(parts[0], 10);
  const min = parts[1].padStart(2, '0');
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${min} ${ampm}`;
};

/**
 * Formats a complete deadline date and time for display.
 * (e.g. "Tomorrow at 12:00 PM", "Today at 12:00 PM", "Oct 15 at 3:00 PM")
 * Replaces the bare "Ends at 12:00".
 */
export const formatDeadlineDisplay = (
  dueDateStr: string,
  dueTimeStr?: string,
  now: Date = new Date()
): string => {
  if (!dueDateStr) return '';
  const deadline = parseTaskDeadline(dueDateStr, dueTimeStr);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDeadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime();
  const dayDiff = Math.round((startOfDeadlineDay - startOfToday) / (24 * 60 * 60 * 1000));

  let dayLabel = '';
  if (dayDiff === 0) {
    dayLabel = 'Today';
  } else if (dayDiff === 1) {
    dayLabel = 'Tomorrow';
  } else if (dayDiff === -1) {
    dayLabel = 'Yesterday';
  } else {
    dayLabel = deadline.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: deadline.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  if (dueTimeStr && dueTimeStr.trim()) {
    const formattedTime = formatTime12Hour(dueTimeStr);
    return `${dayLabel} at ${formattedTime}`;
  }

  return dayLabel;
};

/**
 * Returns human-readable relative deadline countdown text.
 * Respects:
 * - Completed tasks: "Completed ✅" (never overdue)
 * - Due tomorrow: "Due tomorrow ⏰"
 * - Due today (before deadline): "Due today ⏰" (or "Due today (Xm left)" if <1h)
 * - Incomplete and passed deadline: "Overdue 🚨"
 * - Future dates: "In X days"
 */
export const getDeadlineRelativeText = (
  dueDateStr: string,
  dueTimeStr?: string,
  completed?: boolean,
  now: Date = new Date()
): string => {
  if (completed) {
    return 'Completed ✅';
  }

  if (!dueDateStr) return '';

  const deadline = parseTaskDeadline(dueDateStr, dueTimeStr);
  const diffMs = deadline.getTime() - now.getTime();

  // If complete date and time has passed, it is overdue
  if (diffMs < 0) {
    const overdueDays = Math.floor(Math.abs(diffMs) / (24 * 60 * 60 * 1000));
    if (overdueDays > 1) {
      return `Overdue by ${overdueDays}d 🚨`;
    }
    return 'Overdue 🚨';
  }

  // Calculate local calendar day difference
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDeadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime();
  const dayDiff = Math.round((startOfDeadlineDay - startOfToday) / (24 * 60 * 60 * 1000));

  if (dayDiff === 0) {
    const hoursLeft = Math.floor(diffMs / (60 * 60 * 1000));
    const minsLeft = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    if (hoursLeft < 1 && minsLeft > 0) {
      return `Due today (${minsLeft}m left) ⚠️`;
    }
    return 'Due today ⏰';
  }

  if (dayDiff === 1) {
    return 'Due tomorrow ⏰';
  }

  if (dayDiff < 0) {
    return 'Overdue 🚨';
  }

  return `In ${dayDiff} days`;
};
