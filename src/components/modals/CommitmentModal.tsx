import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Commitment, CommitmentType, Priority } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Bookmark,
  FileText,
  FlaskConical,
  GraduationCap,
  Trophy,
  CheckCircle2
} from 'lucide-react';

export const CommitmentModal: React.FC = () => {
  const {
    isCommitmentModalOpen,
    setIsCommitmentModalOpen,
    editingCommitment,
    setEditingCommitment,
    addCommitment,
    updateCommitment,
    deleteCommitment,
    subjects,
    showToast
  } = usePulse();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CommitmentType>('assignment');
  const [tag, setTag] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueDay, setDueDay] = useState('Mon');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [subtasks, setSubtasks] = useState<string[]>(['Research & outline', 'Draft implementation', 'Review & submit']);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  useEffect(() => {
    if (editingCommitment) {
      setTitle(editingCommitment.title);
      setType(editingCommitment.type);
      setTag(editingCommitment.tag || '');
      setDueDate(editingCommitment.dueDate);
      setDueDay(editingCommitment.dueDay || 'Mon');
      setPriority(editingCommitment.priority);
      setEstimatedHours(editingCommitment.estimatedHours);
      setSubtasks(['Step 1', 'Step 2', 'Step 3']);
    } else {
      setTitle('');
      setType('assignment');
      setTag(subjects[0]?.name || 'General');
      setDueDate('28 Oct 2026');
      setDueDay('Tue');
      setPriority('medium');
      setEstimatedHours(3);
      setSubtasks(['Research & outline', 'Draft implementation', 'Review & submit']);
      setNewSubtaskInput('');
    }
  }, [editingCommitment, isCommitmentModalOpen, subjects]);

  if (!isCommitmentModalOpen) return null;

  const handleClose = () => {
    setIsCommitmentModalOpen(false);
    setEditingCommitment(null);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks(prev => [...prev, newSubtaskInput.trim()]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a commitment title', 'warning');
      return;
    }

    if (editingCommitment) {
      updateCommitment(editingCommitment.id, {
        title: title.trim(),
        type,
        tag: tag.trim() || 'General',
        dueDate: dueDate.trim() || 'Today',
        dueDay,
        priority,
        estimatedHours: Number(estimatedHours) || 2,
        totalSubtasks: subtasks.length || 1
      });
      showToast(`Updated "${title.trim()}"`, 'success');
    } else {
      addCommitment({
        title: title.trim(),
        type,
        tag: tag.trim() || 'General',
        dueDate: dueDate.trim() || 'Today',
        dueDay,
        priority,
        estimatedHours: Number(estimatedHours) || 2,
        completedSubtasks: 0,
        totalSubtasks: subtasks.length || 1,
        status: 'pending'
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingCommitment) {
      deleteCommitment(editingCommitment.id);
      handleClose();
    }
  };

  const typeOptions: { id: CommitmentType; label: string; icon: any }[] = [
    { id: 'assignment', label: 'Assignment', icon: FileText },
    { id: 'lab', label: 'Lab Report', icon: FlaskConical },
    { id: 'exam', label: 'Exam / Prep', icon: GraduationCap },
    { id: 'hackathon', label: 'Hackathon', icon: Trophy }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E2621]">
              {editingCommitment ? 'Edit Commitment' : 'Add New Commitment'}
            </h3>
            <p className="text-xs text-[#7A837C]">
              Assignments, labs, exams, hackathons and key deliverables
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
            <label className="text-xs font-bold text-[#1E2621]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. DSA Assignment 5 (Trees & Graphs)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] placeholder-[#A4AAA6] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          {/* Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E2621]">Commitment Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {typeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = type === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#1E3A2B] text-white border-[#1E3A2B] shadow-2xs'
                        : 'bg-[#FBF9F5] text-[#58615A] hover:bg-[#EDE9DF] border-[#E8E2D5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject / Tag & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Subject / Course</label>
              <select
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
                <option value="Personal / Career">Personal / Career</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Due Date & Day</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  placeholder="e.g. 13 Oct 2026"
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
                />
                <select
                  value={dueDay}
                  onChange={e => setDueDay(e.target.value)}
                  className="w-20 px-2 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs font-bold text-[#1E2621]"
                >
                  <option value="Mon">Mon</option>
                  <option value="Tue">Tue</option>
                  <option value="Wed">Wed</option>
                  <option value="Thu">Thu</option>
                  <option value="Fri">Fri</option>
                  <option value="Sat">Sat</option>
                  <option value="Sun">Sun</option>
                </select>
              </div>
            </div>
          </div>

          {/* Priority & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E2621]">Priority</label>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all border ${
                      priority === p
                        ? p === 'high' || p === 'urgent'
                          ? 'bg-[#C34E32] text-white border-[#C34E32]'
                          : p === 'medium'
                          ? 'bg-[#A1741F] text-white border-[#A1741F]'
                          : 'bg-[#236B43] text-white border-[#236B43]'
                        : 'bg-[#FBF9F5] text-[#7A837C] border-[#E8E2D5]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">
                Estimated Effort: <span className="font-mono text-[#1E3A2B]">{estimatedHours} hours</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={estimatedHours}
                onChange={e => setEstimatedHours(Number(e.target.value))}
                className="w-full accent-[#1E3A2B] mt-2"
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="space-y-2 pt-2 border-t border-[#F2ECE1]">
            <label className="text-xs font-bold text-[#1E2621] flex items-center justify-between">
              <span>Subtasks / Milestones ({subtasks.length})</span>
              <span className="text-[10px] text-[#7A837C] font-normal">Click to check off in dashboard</span>
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {subtasks.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#EDE8DE] text-[#58615A] text-[9px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-[#A4AAA6] hover:text-[#C34E32] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={e => setNewSubtaskInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add subtask step (press Enter)"
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E8E2D5] text-xs text-[#1E2621] placeholder-[#A4AAA6]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3.5 py-2 rounded-xl bg-[#EAF4EE] text-[#236B43] hover:bg-[#DEEFE4] text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
            {editingCommitment ? (
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
                <span>{editingCommitment ? 'Update Commitment' : 'Save Commitment'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
