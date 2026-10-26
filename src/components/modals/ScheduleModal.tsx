import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import { PlannerBlock } from '../../types';
import { X, Calendar, Clock, Trash2, CheckCircle2 } from 'lucide-react';

export const ScheduleModal: React.FC = () => {
  const {
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    editingScheduleBlock,
    setEditingScheduleBlock,
    addPlannerBlock,
    updatePlannerBlock,
    deletePlannerBlock,
    showToast
  } = usePulse();

  const [title, setTitle] = useState('');
  const [day, setDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const [startTime, setStartTime] = useState('8 AM');
  const [endTime, setEndTime] = useState('10 AM');
  const [category, setCategory] = useState<'task' | 'class' | 'exam_prep' | 'personal' | 'focus'>('class');
  const [color, setColor] = useState<'mint' | 'yellow' | 'peach' | 'purple' | 'blue'>('mint');

  useEffect(() => {
    if (editingScheduleBlock) {
      setTitle(editingScheduleBlock.title);
      setDay(editingScheduleBlock.day);
      setStartTime(editingScheduleBlock.startTime);
      setEndTime(editingScheduleBlock.endTime);
      setCategory(editingScheduleBlock.category);
      setColor(editingScheduleBlock.color);
    } else {
      setTitle('');
      setDay('Mon');
      setStartTime('8 AM');
      setEndTime('10 AM');
      setCategory('class');
      setColor('mint');
    }
  }, [editingScheduleBlock, isScheduleModalOpen]);

  if (!isScheduleModalOpen) return null;

  const handleClose = () => {
    setIsScheduleModalOpen(false);
    setEditingScheduleBlock(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a schedule block title', 'warning');
      return;
    }

    const timeLabel = `${startTime.replace(' ', '')} - ${endTime.replace(' ', '')}`;

    if (editingScheduleBlock) {
      updatePlannerBlock(editingScheduleBlock.id, {
        title: title.trim(),
        day,
        startTime,
        endTime,
        timeLabel,
        category,
        color
      });
      showToast(`Updated "${title.trim()}" block`, 'success');
    } else {
      addPlannerBlock({
        title: title.trim(),
        day,
        startTime,
        endTime,
        timeLabel,
        category,
        color,
        completed: false
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingScheduleBlock) {
      deletePlannerBlock(editingScheduleBlock.id);
      showToast('Schedule block removed', 'info');
      handleClose();
    }
  };

  const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E2621]">
              {editingScheduleBlock ? 'Edit Schedule Block' : 'Schedule Time Block'}
            </h3>
            <p className="text-xs text-[#7A837C]">Add or adjust time-blocked focus in weekly timetable</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C958E] hover:text-[#1E2621]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1E2621]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. DBMS Lecture or DSA Revision"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E2621]">Day of Week</label>
            <div className="grid grid-cols-7 gap-1">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDay(d)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    day === d
                      ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
                      : 'bg-[#FBF9F5] text-[#58615A] hover:bg-[#EDE9DF] border-[#E8E2D5]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Start Time</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">End Time</label>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              >
                <option value="class">Class / Lecture</option>
                <option value="task">Assignment / Lab</option>
                <option value="exam_prep">Exam Prep</option>
                <option value="focus">Deep Focus</option>
                <option value="personal">Personal / Gym</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Color Accent</label>
              <select
                value={color}
                onChange={e => setColor(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              >
                <option value="mint">Mint Green</option>
                <option value="peach">Peach Orange</option>
                <option value="yellow">Warm Gold</option>
                <option value="purple">Soft Violet</option>
                <option value="blue">Sky Blue</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
            {editingScheduleBlock ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-2xl bg-[#FDF0ED] hover:bg-[#FBE4DF] text-[#C34E32] text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EDE9DF] text-[#58615A] text-xs font-semibold border border-[#E8E2D5]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingScheduleBlock ? 'Update Block' : 'Schedule Block'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
