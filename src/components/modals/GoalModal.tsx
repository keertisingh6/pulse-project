import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Goal, Milestone } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Target,
  Compass,
  Calendar,
  Image,
  CheckCircle2,
  Check
} from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Campus & Library', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600' },
  { label: 'Study Desk Books', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600' },
  { label: 'Fitness & Health', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600' },
  { label: 'Coding & Tech', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600' }
];

export const GoalModal: React.FC = () => {
  const {
    isGoalModalOpen,
    setIsGoalModalOpen,
    editingGoal,
    setEditingGoal,
    addGoal,
    deleteGoal,
    showToast
  } = usePulse();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Career' | 'Personal'>('Academic');
  const [targetDate, setTargetDate] = useState('May 2028');
  const [imageUrl, setImageUrl] = useState(COVER_PRESETS[0].url);
  const [milestones, setMilestones] = useState<{ title: string; dateRange: string }[]>([
    { title: 'Foundation & Core Study', dateRange: 'Aug 2025 - Dec 2025' },
    { title: 'Advanced Mastery', dateRange: 'Jan 2026 - May 2026' }
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setCategory(editingGoal.category);
      setTargetDate(editingGoal.targetDate);
      setImageUrl(editingGoal.imageUrl || COVER_PRESETS[0].url);
      setMilestones(
        editingGoal.milestones.map(m => ({
          title: m.title,
          dateRange: m.dateRange || 'Upcoming'
        }))
      );
    } else {
      setTitle('');
      setDescription('');
      setCategory('Academic');
      setTargetDate('May 2028');
      setImageUrl(COVER_PRESETS[0].url);
      setMilestones([
        { title: 'Foundation & Core Study', dateRange: 'Aug 2025 - Dec 2025' },
        { title: 'Advanced Mastery', dateRange: 'Jan 2026 - May 2026' }
      ]);
      setNewMilestoneTitle('');
      setNewMilestoneDate('');
    }
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleClose = () => {
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones(prev => [
      ...prev,
      {
        title: newMilestoneTitle.trim(),
        dateRange: newMilestoneDate.trim() || 'Upcoming'
      }
    ]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a goal title', 'warning');
      return;
    }

    const builtMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: 'm-' + Date.now() + '-' + idx,
      title: m.title,
      completed: false,
      dateRange: m.dateRange,
      percent: 0
    }));

    addGoal({
      title: title.trim(),
      description: description.trim() || 'Long-term goal and roadmap',
      category,
      targetDate: targetDate.trim() || '2028',
      status: 'active',
      progressPercent: 0,
      completedTasks: 0,
      totalTasks: Math.max(10, milestones.length * 5),
      milestones: builtMilestones,
      imageUrl
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E2621]">
              {editingGoal ? 'Edit Goal & Roadmap' : 'Set a New Goal'}
            </h3>
            <p className="text-xs text-[#7A837C]">
              Translate long-term aspirations into progressive milestones
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C958E] hover:text-[#1E2621] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1E2621]">Goal Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Crack UPSC (IAS) or Build Production SaaS"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] placeholder-[#A4AAA6] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          {/* Category & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Category</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Academic', 'Career', 'Personal'] as const).map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      category === cat
                        ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
                        : 'bg-[#FBF9F5] text-[#58615A] hover:bg-[#EDE9DF] border-[#E8E2D5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Target Completion</label>
              <input
                type="text"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                placeholder="e.g. May 2028 or Dec 2025"
                className="w-full px-4 py-2 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
              />
            </div>
          </div>

          {/* Cover Photo Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E2621]">Cover Photo Aesthetic</label>
            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`relative rounded-2xl overflow-hidden h-16 cursor-pointer border-2 transition-all group ${
                    imageUrl === p.url ? 'border-[#1E3A2B] ring-2 ring-[#1E3A2B]/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                    {p.label}
                  </span>
                  {imageUrl === p.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Builder */}
          <div className="space-y-2 pt-2 border-t border-[#F2ECE1]">
            <label className="text-xs font-bold text-[#1E2621] flex items-center justify-between">
              <span>Roadmap Milestones ({milestones.length})</span>
              <span className="text-[10px] text-[#7A837C] font-normal">Progress is calculated automatically</span>
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#EDE8DE] text-[#58615A] text-[9px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{m.title}</span>
                    <span className="text-[10px] text-[#7A837C] font-mono">({m.dateRange})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="text-[#A4AAA6] hover:text-[#C34E32] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                placeholder="Milestone title (e.g. Unit 1 Complete)"
                className="sm:col-span-7 px-3 py-2 rounded-xl bg-white border border-[#E8E2D5] text-xs text-[#1E2621]"
              />
              <input
                type="text"
                value={newMilestoneDate}
                onChange={e => setNewMilestoneDate(e.target.value)}
                placeholder="Timeframe (e.g. Sep 2025)"
                className="sm:col-span-3 px-3 py-2 rounded-xl bg-white border border-[#E8E2D5] text-xs text-[#1E2621]"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#EAF4EE] text-[#236B43] hover:bg-[#DEEFE4] text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
            {editingGoal ? (
              <button
                type="button"
                onClick={() => { deleteGoal(editingGoal.id); handleClose(); }}
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
                <span>{editingGoal ? 'Update Goal' : 'Create Goal'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
