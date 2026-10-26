import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Priority, TaskStatus } from '../../types';
import { X } from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    subjects,
    goals
  } = usePulse();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [subjectId, setSubjectId] = useState('');
  const [goalId, setGoalId] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '17:00');
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setEstimatedMinutes(editingTask.estimatedMinutes || 45);
      setSubjectId(editingTask.subjectId || '');
      setGoalId(editingTask.goalId || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setDueDate(today);
      setDueTime('17:00');
      setPriority('medium');
      setStatus('pending');
      setEstimatedMinutes(45);
      setSubjectId(subjects[0]?.id || '');
      setGoalId('');
    }
  }, [editingTask, isTaskModalOpen, subjects]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        status,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        subjectId: subjectId || undefined,
        goalId: goalId || undefined
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        status,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        subjectId: subjectId || undefined,
        goalId: goalId || undefined
      });
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-[#E8E2D5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1] mb-5">
          <div>
            <h3 className="text-base font-bold font-serif text-[#1E2621]">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-[#8C958E]">
              {editingTask ? 'Update task details and deadlines' : 'Add an academic or personal commitment'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="p-1.5 rounded-xl hover:bg-[#F7F4EE] text-[#8C958E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement Binary Search Tree deletion"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Key requirements, links, or notes..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F2ECE1]">
            <button
              type="button"
              onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="px-4 py-2 rounded-xl text-[#6E7570] hover:bg-[#F2ECE1] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
