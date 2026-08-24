import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { Commitment, CommitmentType } from '../types';
import { 
  Plus, Search, Clock, ShieldAlert, CheckCircle, 
  Trash2, FileText, ChevronDown, ChevronUp, Sparkles, Filter,
  MapPin, Calendar, Users, AlertTriangle, Check, Bell, Send, ShieldCheck, Mail, Phone, MessageSquare
} from 'lucide-react';
import { EmptyStateIllustration } from './Illustrations';

// Simulated current context date
const TODAY_CONTEXT = new Date('2026-06-25T07:19:00-07:00'); // Thursday, June 25, 2026 7:19 AM

const getCategoryEmoji = (type: CommitmentType) => {
  switch (type) {
    case 'Assignment': return '📚';
    case 'Meeting': return '💼';
    case 'Bill': return '💳';
    case 'Appointment': return '🩺';
    case 'Event': return '🎉';
    case 'Travel': return '✈';
    default: return '📌';
  }
};

const getCategoryStyles = (type: CommitmentType) => {
  switch (type) {
    case 'Assignment': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'Meeting': return 'bg-sky-50 text-sky-600 border-sky-100';
    case 'Bill': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Appointment': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Event': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Travel': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

// Computes dynamic commitment health status & action plan
const getCommitmentHealth = (c: Commitment) => {
  const today = TODAY_CONTEXT;
  const dueParts = c.dueDate.split('-');
  const dueYear = parseInt(dueParts[0], 10);
  const dueMonth = parseInt(dueParts[1], 10) - 1;
  const dueDay = parseInt(dueParts[2], 10);
  
  let dueTimeHour = 12;
  let dueTimeMin = 0;
  if (c.dueTime) {
    const timeParts = c.dueTime.split(':');
    dueTimeHour = parseInt(timeParts[0], 10);
    dueTimeMin = parseInt(timeParts[1], 10);
  }
  
  const dueDateTime = new Date(dueYear, dueMonth, dueDay, dueTimeHour, dueTimeMin);
  const diffMs = dueDateTime.getTime() - today.getTime();
  const hoursLeft = diffMs / (1000 * 60 * 60);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (c.completed) {
    return {
      status: 'Ready ✅',
      message: 'Completed and cleared from mental space.',
      hoursLeft: 0,
      isTight: false,
      isOverdue: false,
      leaveTime: '',
      prepStartTime: ''
    };
  }

  if (diffMs < 0) {
    return {
      status: 'Overdue 🚨',
      message: `Passed due deadline by ${Math.abs(daysLeft)} days.`,
      hoursLeft: hoursLeft,
      isTight: true,
      isOverdue: true,
      leaveTime: '',
      prepStartTime: ''
    };
  }

  const travelTime = c.travelTimeMinutes || 0;
  const prepTime = c.prepTimeMinutes || 0;
  const effortMin = c.effortMinutes || 60;
  const effortHours = effortMin / 60;

  if (c.type === 'Assignment') {
    const isOverdueRisk = hoursLeft < effortHours;
    const isTight = hoursLeft < effortHours * 2.5;
    
    let suggestedStartText = c.suggestedStartTime || '';
    if (!suggestedStartText) {
      // Suggesting standard quiet study times (typically after 7 PM as in prompt)
      const suggestedDate = new Date(dueDateTime.getTime() - (effortMin * 1.5 * 60 * 1000));
      suggestedStartText = suggestedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + `, 7:30 PM`;
    }

    let statusText = 'Ready ✅';
    let messageText = "You'll finish comfortably before the deadline.";
    if (isOverdueRisk) {
      statusText = 'Overdue Risk 🚨';
      messageText = 'Time remaining is less than estimated effort. Start immediately!';
    } else if (isTight) {
      statusText = 'Attention Required ⚠️';
      messageText = 'We should schedule a focus session today to stay comfortable.';
    }

    return {
      status: statusText,
      message: messageText,
      hoursLeft: hoursLeft,
      isTight,
      isOverdue: isOverdueRisk,
      suggestedStart: suggestedStartText
    };
  } else if (['Meeting', 'Appointment', 'Event', 'Travel'].includes(c.type)) {
    const totalBufferMin = travelTime + prepTime;
    const hoursLeftToStart = (diffMs - (totalBufferMin * 60 * 1000)) / (1000 * 60 * 60);

    let statusText = 'Ready ✅';
    let messageText = "You're all set. Take a deep breath before you begin.";
    const isTight = hoursLeftToStart < 1.5;
    const isOverdueRisk = hoursLeftToStart < 0;

    if (isOverdueRisk) {
      statusText = 'Running Late 🚨';
      messageText = 'Preparation or transit should have already started. Head out!';
    } else if (isTight) {
      statusText = 'Time to Prep ⏰';
      messageText = `Starts soon. Start preparation block in ${Math.round(hoursLeftToStart * 60)} mins.`;
    }

    const leaveDate = new Date(dueDateTime.getTime() - (travelTime * 60 * 1000));
    const prepDate = new Date(leaveDate.getTime() - (prepTime * 60 * 1000));

    const leaveTimeStr = leaveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const prepTimeStr = prepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      status: statusText,
      message: messageText,
      hoursLeft: hoursLeft,
      isTight,
      isOverdue: isOverdueRisk,
      leaveTime: leaveTimeStr,
      prepStartTime: prepTimeStr
    };
  } else {
    // Bills and Others
    const isTight = daysLeft <= 1;
    let statusText = 'On Track ✅';
    let messageText = c.owner === 'someone_else' 
      ? `Assigned to ${c.ownerName || 'someone else'}. Settle with peace.`
      : 'Ready. Settle before deadline to maintain quiet clarity.';

    if (isTight) {
      statusText = 'Settle Soon ⏰';
      messageText = c.owner === 'someone_else'
        ? `Remind ${c.ownerName || 'owner'} to pay before late fees apply.`
        : 'Pay today to prevent outstanding pressure.';
    }

    return {
      status: statusText,
      message: messageText,
      hoursLeft: hoursLeft,
      isTight,
      isOverdue: isTight
    };
  }
};

export const CommitmentsFeed: React.FC = () => {
  const { state, addCommitment, toggleCommitment, deleteCommitment } = usePulse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCommitment, setExpandedCommitment] = useState<string | null>(null);

  // New Commitment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CommitmentType>('Assignment');
  const [newDueDate, setNewDueDate] = useState('2026-06-25');
  const [newDueTime, setNewDueTime] = useState('12:00');
  const [newEffort, setNewEffort] = useState('1 hour');
  const [newEffortMin, setNewEffortMin] = useState(60);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newNotes, setNewNotes] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRepeat, setNewRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [newOwner, setNewOwner] = useState<'me' | 'shared' | 'someone_else'>('me');
  const [newOwnerName, setNewOwnerName] = useState('');
  
  // Custom alerts prefs checklist state
  const [reminderPrefs, setReminderPrefs] = useState({
    oneDayBefore: true,
    oneHourBefore: true,
    fifteenMinBefore: false,
    atStart: false,
    threeDaysBefore: false,
    sixHoursBefore: false,
    twoHoursBefore: false,
  });

  // Channels checkboxes state
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    sms: false,
    push: false,
    whatsapp: false,
    telegram: false
  });

  // Travel & Prep parameters
  const [travelTime, setTravelTime] = useState(0);
  const [prepTime, setPrepTime] = useState(0);

  const typesList = [
    'All', 'Assignment', 'Meeting', 'Bill', 'Appointment', 'Event', 'Travel', 'Other'
  ];

  // Helper calculation for display times remaining
  const getTimeRemainingText = (dueDateStr: string, dueTimeStr?: string): string => {
    const today = TODAY_CONTEXT;
    const dueParts = dueDateStr.split('-');
    const dueYear = parseInt(dueParts[0], 10);
    const dueMonth = parseInt(dueParts[1], 10) - 1;
    const dueDay = parseInt(dueParts[2], 10);
    
    let dueTimeHour = 12;
    let dueTimeMin = 0;
    if (dueTimeStr) {
      const timeParts = dueTimeStr.split(':');
      dueTimeHour = parseInt(timeParts[0], 10);
      dueTimeMin = parseInt(timeParts[1], 10);
    }
    
    const due = new Date(dueYear, dueMonth, dueDay, dueTimeHour, dueTimeMin);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return `Overdue 🚨`;
    }

    if (diffDays === 0) {
      return 'Due today ⚠️';
    }
    if (diffDays === 1) {
      return 'Due tomorrow ⏰';
    }
    return `In ${diffDays} days`;
  };

  const handleReminderToggle = (field: keyof typeof reminderPrefs) => {
    setReminderPrefs(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChannelToggle = (field: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCategoryChange = (type: CommitmentType) => {
    setNewType(type);
    
    // Automatically configure categories smart reminders
    if (type === 'Assignment') {
      setReminderPrefs({
        oneDayBefore: true,
        oneHourBefore: false,
        fifteenMinBefore: false,
        atStart: false,
        threeDaysBefore: true,
        sixHoursBefore: true,
        twoHoursBefore: true,
      });
      setTravelTime(0);
      setPrepTime(40);
    } else {
      setReminderPrefs({
        oneDayBefore: true,
        oneHourBefore: true,
        fifteenMinBefore: true,
        atStart: true,
        threeDaysBefore: false,
        sixHoursBefore: false,
        twoHoursBefore: false,
      });
      if (['Meeting', 'Appointment', 'Travel'].includes(type)) {
        setTravelTime(20);
        setPrepTime(15);
      } else {
        setTravelTime(0);
        setPrepTime(0);
      }
    }
  };

  const filteredCommitments = state.commitments.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Mindful tips recommended by Kairo
    const aiTipsList = [
      `Let's schedule a quiet focus block tomorrow morning. Getting a head start always reduces friction.`,
      `I recommend breaking this into small, digestible chunks of 30 minutes each. Ready when you are!`,
      `This commitment is low effort. Let's tackle it right after your next focused block as an easy win.`,
      `Take a long breath. We have plenty of time for this, but let's register the priority in our thoughts.`
    ];
    const generatedTip = aiTipsList[Math.floor(Math.random() * aiTipsList.length)];

    addCommitment({
      title: newTitle,
      type: newType,
      dueDate: newDueDate,
      dueTime: newDueTime,
      estimatedEffort: newEffort,
      effortMinutes: Number(newEffortMin),
      priority: newPriority,
      completed: false,
      source: 'manual',
      notes: newNotes,
      aiTip: generatedTip,
      location: newLocation,
      repeat: newRepeat,
      reminders: reminderPrefs,
      channels,
      owner: newOwner,
      ownerName: newOwnerName,
      travelTimeMinutes: Number(travelTime),
      prepTimeMinutes: Number(prepTime),
      suggestedStartTime: newType === 'Assignment' ? 'Today, 7:30 PM' : undefined
    });

    // Reset Form to default values
    setNewTitle('');
    setNewType('Assignment');
    setNewDueDate('2026-06-25');
    setNewDueTime('12:00');
    setNewEffort('1 hour');
    setNewEffortMin(60);
    setNewPriority('medium');
    setNewNotes('');
    setNewLocation('');
    setNewRepeat('none');
    setNewOwner('me');
    setNewOwnerName('');
    setTravelTime(0);
    setPrepTime(0);
    setReminderPrefs({
      oneDayBefore: true,
      oneHourBefore: true,
      fifteenMinBefore: false,
      atStart: false,
      threeDaysBefore: false,
      sixHoursBefore: false,
      twoHoursBefore: false,
    });
    setChannels({
      inApp: true,
      email: true,
      sms: false,
      push: false,
      whatsapp: false,
      telegram: false
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="commitments-feed">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/40" />
          <input
            type="text"
            placeholder="Search your Life Inbox..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7C9070] focus:border-[#7C9070] shadow-sm text-[#1A1A1B]"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white font-semibold px-4 py-2 text-sm rounded-xl transition-colors shadow-sm ml-auto sm:ml-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commitment</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {typesList.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedType === type
                ? 'bg-[#7C9070] text-white border-[#7C9070] shadow-sm'
                : 'bg-white text-[#1A1A1B]/60 border-[#EBE9E0] hover:bg-[#FAF9F6]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Manual Add Form Overlay/Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateManual} className="bg-[#F5F1E9] border border-[#EBE9E0] rounded-2xl p-5 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-2">
            <h3 className="font-serif font-bold text-[#1A1A1B] text-base">Create Mindful Commitment</h3>
            <span className="text-[10px] font-mono text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Pulse Companion</span>
          </div>
          
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs text-[#1A1A1B]/60 font-semibold">Commitment Title</label>
              <input
                type="text"
                required
                placeholder="What is your commitment?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B] font-medium"
              />
            </div>

            {/* Grid choosing categories with emojis */}
            <div className="space-y-1">
              <label className="text-xs text-[#1A1A1B]/60 font-semibold block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Assignment', 'Meeting', 'Bill', 'Appointment', 'Event', 'Travel'] as CommitmentType[]).map(cat => {
                  const isSelected = newType === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#7C9070]/10 border-[#7C9070] text-[#7C9070] font-bold shadow-xs'
                          : 'bg-white border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#FAF9F6] font-semibold'
                      }`}
                    >
                      <span className="text-lg">{getCategoryEmoji(cat)}</span>
                      <span className="text-[11px] capitalize">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* End Date & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#1A1A1B]/60 font-semibold block">When does this end? (Due Date)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/30" />
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B] font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#1A1A1B]/60 font-semibold block">Due Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/30" />
                  <input
                    type="time"
                    required
                    value={newDueTime}
                    onChange={e => setNewDueTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B] font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Effort & Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-[#1A1A1B]/60 font-semibold">Estimated Time Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 hours"
                    value={newEffort}
                    onChange={e => setNewEffort(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#1A1A1B]/60 font-semibold">Active Work (Minutes)</label>
                  <input
                    type="number"
                    value={newEffortMin}
                    onChange={e => setNewEffortMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#1A1A1B]/60 font-semibold block">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map(p => {
                    const isSelected = newPriority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-2 rounded-xl text-xs capitalize font-bold border cursor-pointer text-center transition-all ${
                          isSelected
                            ? p === 'high'
                              ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                              : p === 'medium'
                                ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-xs'
                                : 'bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
                            : 'bg-white border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location & Repeat Option Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#1A1A1B]/60 font-semibold">Location (optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/30" />
                  <input
                    type="text"
                    placeholder="e.g. Room 4B, Google Meet, Dad's Office"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#1A1A1B]/60 font-semibold">Repeat? (optional)</label>
                <select
                  value={newRepeat}
                  onChange={e => setNewRepeat(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none text-[#1A1A1B] font-semibold"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Every day</option>
                  <option value="weekly">Every week</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>
            </div>

            {/* Owners selection & name */}
            <div className="space-y-2">
              <label className="text-xs text-[#1A1A1B]/60 font-semibold block">Can someone else do this? (Owner)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'me', label: '○ Me' },
                  { value: 'shared', label: '○ Shared' },
                  { value: 'someone_else', label: '○ Someone Else' }
                ].map(opt => {
                  const isSelected = newOwner === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewOwner(opt.value as any)}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer text-center transition-all ${
                        isSelected
                          ? 'bg-[#7C9070] border-[#7C9070] text-white'
                          : 'bg-white border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {(newOwner === 'someone_else' || newOwner === 'shared') && (
                <div className="space-y-1 pt-1 animate-fadeIn">
                  <label className="text-xs text-[#1A1A1B]/60 font-semibold">Assignee Name / Shared With</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/30" />
                    <input
                      type="text"
                      required
                      placeholder={newOwner === 'someone_else' ? "e.g. Dad, Lisa, Mom" : "e.g. Dev Team, Family"}
                      value={newOwnerName}
                      onChange={e => setNewOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Travel and Prep parameters for active physical events */}
            {['Meeting', 'Appointment', 'Event', 'Travel'].includes(newType) && (
              <div className="bg-white border border-[#EBE9E0] rounded-xl p-4 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-[#7C9070] block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>AI Health Estimator Parameters</span>
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#1A1A1B]/60 font-semibold block">🚗 Travel Time (minutes)</label>
                    <input
                      type="number"
                      value={travelTime}
                      onChange={e => setTravelTime(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#1A1A1B]/60 font-semibold block">📋 Prep Time Needed (minutes)</label>
                    <input
                      type="number"
                      value={prepTime}
                      onChange={e => setPrepTime(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Alerts & Channels Configuration */}
            <div className="bg-white border border-[#EBE9E0] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checklist preferences */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#1A1A1B]/70 block flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#7C9070]" />
                  <span>Smart Reminder Preferences</span>
                </span>
                
                <div className="space-y-1.5 pl-0.5">
                  {newType === 'Assignment' ? (
                    // Assignment alerts
                    <>
                      {[
                        { key: 'threeDaysBefore', label: '3 days before' },
                        { key: 'oneDayBefore', label: '1 day before' },
                        { key: 'sixHoursBefore', label: '6 hours before' },
                        { key: 'twoHoursBefore', label: '2 hours before' }
                      ].map(pref => (
                        <label key={pref.key} className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1B]/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!reminderPrefs[pref.key as keyof typeof reminderPrefs]}
                            onChange={() => handleReminderToggle(pref.key as any)}
                            className="rounded border-[#EBE9E0] text-[#7C9070] focus:ring-[#7C9070] accent-[#7C9070]"
                          />
                          <span>{pref.label}</span>
                        </label>
                      ))}
                    </>
                  ) : (
                    // Standard alerts
                    <>
                      {[
                        { key: 'oneDayBefore', label: '1 day before' },
                        { key: 'oneHourBefore', label: '1 hour before' },
                        { key: 'fifteenMinBefore', label: '15 min before' },
                        { key: 'atStart', label: 'At start time' }
                      ].map(pref => (
                        <label key={pref.key} className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1B]/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!reminderPrefs[pref.key as keyof typeof reminderPrefs]}
                            onChange={() => handleReminderToggle(pref.key as any)}
                            className="rounded border-[#EBE9E0] text-[#7C9070] focus:ring-[#7C9070] accent-[#7C9070]"
                          />
                          <span>{pref.label}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Channels checkboxes */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#1A1A1B]/70 block flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#7C9070]" />
                  <span>Notification Channels</span>
                </span>

                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {[
                    { key: 'inApp', label: '☑ In-app notification' },
                    { key: 'email', label: '☑ Email alert' },
                    { key: 'sms', label: '☑ SMS message' },
                    { key: 'push', label: '☑ Push notification' },
                    { key: 'whatsapp', label: '☐ WhatsApp (Future)', disabled: true },
                    { key: 'telegram', label: '☐ Telegram (Future)', disabled: true }
                  ].map(ch => (
                    <label 
                      key={ch.key} 
                      className={`flex items-center gap-2 font-semibold cursor-pointer ${
                        ch.disabled ? 'text-[#1A1A1B]/35' : 'text-[#1A1A1B]/75'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={ch.disabled}
                        checked={!ch.disabled && !!channels[ch.key as keyof typeof channels]}
                        onChange={() => handleChannelToggle(ch.key as any)}
                        className="rounded border-[#EBE9E0] text-[#7C9070] focus:ring-[#7C9070] accent-[#7C9070] disabled:opacity-40"
                      />
                      <span>{ch.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs text-[#1A1A1B]/60 font-semibold">Notes / Context</label>
              <textarea
                placeholder="Optional notes or web links..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-white border border-[#EBE9E0] rounded-xl outline-none resize-none text-[#1A1A1B] focus:ring-1 focus:ring-[#7C9070]"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-[#EBE9E0]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-[#1A1A1B]/60 hover:text-[#1A1A1B]/90 bg-white border border-[#EBE9E0] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C9070] hover:bg-[#6c7d61] rounded-xl shadow-sm cursor-pointer"
            >
              Add to Pulse
            </button>
          </div>
        </form>
      )}

      {/* Commitments List Feed */}
      <div className="space-y-3.5">
        {filteredCommitments.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 border border-[#EBE9E0] flex flex-col items-center">
            <EmptyStateIllustration type="feed" />
            <p className="text-[#1A1A1B]/60 text-sm mt-4 font-serif italic font-semibold">No commitments found</p>
            <p className="text-xs text-[#1A1A1B]/40 max-w-xs text-center mt-1">
              Try searching another category, adding a manual commitment, or uploading a document in the Life Inbox to extract one!
            </p>
          </div>
        ) : (
          filteredCommitments.map(c => {
            const isExpanded = expandedCommitment === c.id;
            const health = getCommitmentHealth(c);
            
            return (
              <div 
                key={c.id}
                className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                  c.completed 
                    ? 'border-[#EBE9E0] opacity-60 hover:opacity-100' 
                    : isExpanded
                      ? 'border-[#7C9070] shadow-md shadow-[#7C9070]/5 ring-1 ring-[#7C9070]/30' 
                      : 'border-[#EBE9E0] shadow-sm hover:shadow-md hover:border-[#7C9070]/40'
                }`}
              >
                {/* Main Row */}
                <div className="p-4 flex items-start gap-4">
                  {/* Checklist Ring */}
                  <button
                    onClick={() => toggleCommitment(c.id)}
                    className="mt-1 rounded-full text-[#1A1A1B]/20 hover:text-[#7C9070] transition-colors cursor-pointer flex-shrink-0"
                    title={c.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    <CheckCircle 
                      className={`w-6 h-6 transition-all duration-200 ${
                        c.completed ? 'text-[#7C9070] fill-[#7C9070]/10' : 'stroke-2 hover:stroke-[#7C9070]'
                      }`} 
                    />
                  </button>

                  {/* Details block */}
                  <div className="flex-1 min-w-0" onClick={() => setExpandedCommitment(isExpanded ? null : c.id)}>
                    <div className="flex flex-wrap items-center gap-2 mb-1 cursor-pointer">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryStyles(c.type)}`}>
                        {getCategoryEmoji(c.type)} {c.type}
                      </span>

                      {/* Health Quick Status */}
                      {!c.completed && (
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          health.isOverdue 
                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                            : health.isTight 
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-[#7C9070]/10 text-[#7C9070] border-[#7C9070]/20'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{health.status}</span>
                        </span>
                      )}

                      {/* Owner Quick Status Badge */}
                      {c.owner === 'someone_else' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <Users className="w-3 h-3" />
                          <span>Owner: {c.ownerName || 'Someone Else'}</span>
                        </span>
                      )}

                      {c.owner === 'shared' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                          <Users className="w-3 h-3" />
                          <span>Shared: {c.ownerName || 'Group'}</span>
                        </span>
                      )}
                      
                      {/* Imported file indicator */}
                      {c.sourceFileName && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-[#1A1A1B]/50 bg-[#F5F1E9] px-2 py-0.5 rounded-full border border-[#EBE9E0]">
                          <FileText className="w-3 h-3 text-[#1A1A1B]/40" />
                          <span className="truncate max-w-[120px]">{c.sourceFileName}</span>
                        </span>
                      )}
                    </div>

                    <h3 className={`font-serif text-base font-bold leading-snug cursor-pointer ${
                      c.completed ? 'line-through text-[#1A1A1B]/45' : 'text-[#1A1A1B]'
                    }`}>
                      {c.title}
                    </h3>

                    {/* Meta info bar */}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#1A1A1B]/50">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#1A1A1B]/30" />
                        <span>{getTimeRemainingText(c.dueDate, c.dueTime)}</span>
                      </span>
                      {c.dueTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#1A1A1B]/30" />
                            <span>Ends at {c.dueTime}</span>
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>Effort: <strong className="text-[#1A1A1B]/70">{c.estimatedEffort}</strong></span>
                      {c.repeat && c.repeat !== 'none' && (
                        <>
                          <span>•</span>
                          <span className="capitalize font-semibold text-[#7C9070]">🔁 {c.repeat}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-1 self-center">
                    <button
                      onClick={() => setExpandedCommitment(isExpanded ? null : c.id)}
                      className="p-1.5 hover:bg-[#FAF9F6] text-[#1A1A1B]/40 hover:text-[#1A1A1B]/80 rounded-lg transition-colors cursor-pointer"
                      title="Toggle Details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteCommitment(c.id)}
                      className="p-1.5 hover:bg-rose-50/50 text-[#1A1A1B]/40 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete commitment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Expanded details */}
                {isExpanded && (
                  <div className="bg-[#F5F1E9]/30 border-t border-[#EBE9E0] p-5 space-y-4 text-sm animate-fadeIn">
                    
                    {/* Commitment Health & Action Plan Block - Absolute core differentiator */}
                    <div className="bg-white border border-[#EBE9E0] rounded-2xl p-4 space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-2">
                        <span className="text-xs font-bold text-[#1A1A1B]/75 uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#7C9070]" />
                          <span>Commitment Health & Action Plan</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          health.isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-[#7C9070]/10 text-[#7C9070] border-[#7C9070]/10'
                        }`}>
                          {health.status}
                        </span>
                      </div>

                      {/* Display calculations for different types */}
                      {c.type === 'Assignment' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#1A1A1B]/50 block">Suggested Start Work Time:</span>
                            <span className="text-sm font-bold text-[#1A1A1B] font-serif block">
                              🔔 {health.suggestedStart || 'Today, 7:30 PM'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">Calculated from {c.estimatedEffort} effort</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#1A1A1B]/50 block">Kairo Proactive Analysis:</span>
                            <p className="text-xs text-[#1A1A1B]/80 font-medium leading-relaxed font-serif">
                              "{health.message}"
                            </p>
                          </div>
                        </div>
                      ) : ['Meeting', 'Appointment', 'Event', 'Travel'].includes(c.type) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 text-xs">
                            {c.location && (
                              <div className="flex items-start gap-1.5 text-[#1A1A1B]/80 font-semibold font-serif">
                                <MapPin className="w-3.5 h-3.5 text-[#7C9070] mt-0.5 flex-shrink-0" />
                                <span>Location: {c.location}</span>
                              </div>
                            )}
                            <div className="space-y-1 text-[#1A1A1B]/60 font-medium">
                              <div>🚗 Transit Time Allocated: <strong>{c.travelTimeMinutes || 0} minutes</strong></div>
                              <div>📋 Preparation Space: <strong>{c.prepTimeMinutes || 0} minutes</strong></div>
                            </div>
                          </div>

                          {!c.completed && (
                            <div className="bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl p-3 space-y-1.5">
                              <span className="text-[10px] font-bold text-[#7C9070] uppercase block">Mindful Timeline</span>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between font-medium text-slate-600">
                                  <span>Start Prepping:</span>
                                  <strong className="text-slate-800">{health.prepStartTime || '9:05 AM'}</strong>
                                </div>
                                <div className="flex justify-between font-medium text-slate-600">
                                  <span>Leave Transit:</span>
                                  <strong className="text-slate-800">{health.leaveTime || '9:20 AM'}</strong>
                                </div>
                                <div className="flex justify-between font-bold text-[#7C9070] pt-1 border-t border-slate-200">
                                  <span>Starts at:</span>
                                  <span>{c.dueTime || '10:00 AM'}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Bills & Others
                        <div className="text-xs text-[#1A1A1B]/70 leading-relaxed font-serif font-medium">
                          {health.message} Effort: {c.estimatedEffort}. {c.owner === 'someone_else' ? `Owned by ${c.ownerName}.` : 'Owned by me.'} No transit needed.
                        </div>
                      )}
                    </div>

                    {/* Standard Notes details */}
                    {c.notes && (
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A1B]/50 block mb-0.5">Details & Context:</span>
                        <p className="text-[#1A1A1B]/80 font-semibold leading-relaxed font-serif bg-white border border-slate-100 p-3 rounded-xl">{c.notes}</p>
                      </div>
                    )}

                    {/* Active Alert Configuration Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
                      {/* Active Alert triggers list */}
                      <div className="bg-white/80 border border-[#EBE9E0] rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Active Reminder Flags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {c.reminders && Object.entries(c.reminders).filter(([_, v]) => v).length > 0 ? (
                            Object.entries(c.reminders)
                              .filter(([_, value]) => value)
                              .map(([key]) => {
                                const friendlyNames: Record<string, string> = {
                                  oneDayBefore: '1 day before',
                                  oneHourBefore: '1 hour before',
                                  fifteenMinBefore: '15 min before',
                                  atStart: 'At start time',
                                  threeDaysBefore: '3 days before',
                                  sixHoursBefore: '6 hours before',
                                  twoHoursBefore: '2 hours before'
                                };
                                return (
                                  <span key={key} className="text-[10px] bg-slate-50 text-slate-600 font-bold px-2 py-0.5 rounded-md border border-slate-150">
                                    🔔 {friendlyNames[key] || key}
                                  </span>
                                );
                              })
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">No custom triggers active</span>
                          )}
                        </div>
                      </div>

                      {/* Active notification channels list */}
                      <div className="bg-white/80 border border-[#EBE9E0] rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Notification Output Channels</span>
                        <div className="flex flex-wrap gap-1.5">
                          {c.channels && Object.entries(c.channels).filter(([_, v]) => v).length > 0 ? (
                            Object.entries(c.channels)
                              .filter(([_, value]) => value)
                              .map(([key]) => {
                                const icons: Record<string, string> = {
                                  inApp: '📱 In-app',
                                  email: '✉️ Email',
                                  sms: '💬 SMS',
                                  push: '🔔 Push notification'
                                };
                                return (
                                  <span key={key} className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                                    {icons[key] || key}
                                  </span>
                                );
                              })
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">No active channels</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Reassuring Kairo Companion Tip */}
                    {c.aiTip && (
                      <div className="bg-[#FAF9F6] border border-[#EBE9E0] rounded-2xl p-4 flex items-start gap-3">
                        <div className="bg-[#7C9070]/10 rounded-full p-1.5 text-[#7C9070] flex-shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#7C9070] block font-serif">Kairo's Guide</span>
                          <p className="text-[#1A1A1B]/70 text-xs mt-0.5 leading-relaxed font-serif italic">
                            "{c.aiTip}"
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-[#1A1A1B]/40 flex items-center justify-between pt-1">
                      <span>Created on {new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className="capitalize">Priority: <strong className="font-semibold">{c.priority}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
