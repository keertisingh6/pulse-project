import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { Commitment, CommitmentType } from '../types';
import { 
  Plus, Search, Filter, Calendar, Clock, BookOpen, 
  CheckCircle2, Circle, AlertCircle, ArrowUpDown, 
  Trash2, Edit3, Check, ChevronDown, Sparkles, X, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalTodayDateString, isTaskOverdue } from '../utils/deadlineUtils';

export const AssignmentsDatabaseView: React.FC = () => {
  const { state, toggleCommitment, deleteCommitment, updateCommitment, addCommitment } = usePulse();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'urgent'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDueDate, setFormDueDate] = useState(() => getLocalTodayDateString());
  const [formDueTime, setFormDueTime] = useState('23:59');
  const [formType, setFormType] = useState<CommitmentType>('Assignment');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formEffort, setFormEffort] = useState('2 hours');

  // Collect subjects
  const allSubjects = Array.from(new Set(state.commitments.map(c => c.subject).filter(Boolean))) as string[];

  // Filter commitments
  const filtered = state.commitments.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || c.subject === selectedSubject;
    const matchesType = selectedType === 'all' || c.type === selectedType;
    
    let matchesStatus = true;
    if (selectedStatus === 'pending') matchesStatus = !c.completed;
    else if (selectedStatus === 'completed') matchesStatus = c.completed;
    else if (selectedStatus === 'urgent') matchesStatus = !c.completed && c.priority === 'high';

    return matchesSearch && matchesSubject && matchesType && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addCommitment({
      title: formTitle.trim(),
      subject: formSubject.trim() || undefined,
      type: formType,
      dueDate: formDueDate,
      dueTime: formDueTime,
      estimatedEffort: formEffort,
      effortMinutes: 90,
      priority: formPriority,
      completed: false,
      source: 'manual',
      sourceFileName: 'Database Entry',
    });

    setFormTitle('');
    setFormSubject('');
    setShowAddModal(false);
  };

  const pendingCount = state.commitments.filter(c => !c.completed).length;
  const completedCount = state.commitments.filter(c => c.completed).length;
  const urgentCount = state.commitments.filter(c => !c.completed && c.priority === 'high').length;

  return (
    <div className="space-y-6">
      
      {/* Notion / FocusMate Database Header */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C9070]/10 text-[#7C9070] rounded-full text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Coursework Registry</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1B] tracking-tight">
            Assignments & Exams Database
          </h2>
          <p className="text-xs md:text-sm text-[#1A1A1B]/60 max-w-xl">
            Central repository for syllabus deadlines, project deliverables, problem sets, and lab tests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-2xl font-bold text-xs shadow-sm shadow-[#7C9070]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === 'all' 
              ? 'bg-[#FAF9F6] border-[#7C9070] shadow-xs' 
              : 'bg-white border-[#EBE9E0] hover:bg-[#FAF9F6]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider block">Total Tracked</span>
          <div className="mt-1 text-2xl font-bold text-[#1A1A1B]">{state.commitments.length}</div>
        </button>

        <button
          onClick={() => setSelectedStatus('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === 'pending' 
              ? 'bg-[#FAF9F6] border-[#7C9070] shadow-xs' 
              : 'bg-white border-[#EBE9E0] hover:bg-[#FAF9F6]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider block">In Progress</span>
          <div className="mt-1 text-2xl font-bold text-sky-700">{pendingCount}</div>
        </button>

        <button
          onClick={() => setSelectedStatus('urgent')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === 'urgent' 
              ? 'bg-[#FAF9F6] border-[#7C9070] shadow-xs' 
              : 'bg-white border-[#EBE9E0] hover:bg-[#FAF9F6]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider block">High Priority</span>
          <div className="mt-1 text-2xl font-bold text-rose-600">{urgentCount}</div>
        </button>

        <button
          onClick={() => setSelectedStatus('completed')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === 'completed' 
              ? 'bg-[#FAF9F6] border-[#7C9070] shadow-xs' 
              : 'bg-white border-[#EBE9E0] hover:bg-[#FAF9F6]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider block">Completed</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{completedCount}</div>
        </button>
      </div>

      {/* Database Controls: Search & Filters */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#1A1A1B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments by name, subject, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {/* Subject filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl text-xs font-semibold text-[#1A1A1B]/70 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {allSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl text-xs font-semibold text-[#1A1A1B]/70 focus:outline-none"
            >
              <option value="all">All Deliverable Types</option>
              <option value="Assignment">Assignment</option>
              <option value="Exam">Exam / Quiz</option>
              <option value="Class">Class / Lab</option>
              <option value="Task">Problem Set / Task</option>
            </select>
          </div>
        </div>

        {/* Database Table View */}
        <div className="overflow-x-auto border border-[#EBE9E0] rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] text-[#1A1A1B]/60 font-semibold border-b border-[#EBE9E0]">
              <tr>
                <th className="py-3 px-4 w-10">Done</th>
                <th className="py-3 px-4">Deliverable Title</th>
                <th className="py-3 px-4">Course / Subject</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Est. Effort</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE9E0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#1A1A1B]/40">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#7C9070]" />
                    <p className="font-semibold">No coursework matching your filters</p>
                    <p className="text-[11px] mt-0.5">Click &ldquo;+ New Assignment&rdquo; above to add your tasks and deadlines.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-[#FAF9F6]/80 transition-colors ${
                      item.completed ? 'bg-slate-50/50 opacity-60' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleCommitment(item.id)}
                        className="text-[#7C9070] hover:scale-110 transition-transform cursor-pointer"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-[#7C9070] text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#1A1A1B]/30 hover:text-[#7C9070]" />
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#1A1A1B]">
                      <div className="flex items-center gap-2">
                        <span className={item.completed ? 'line-through text-[#1A1A1B]/50' : ''}>
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#EBE9E0] text-[#1A1A1B]/60">
                          {item.type}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.subject ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#7C9070]/10 text-[#7C9070] font-semibold text-[11px]">
                          {item.subject}
                        </span>
                      ) : (
                        <span className="text-[#1A1A1B]/30">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#1A1A1B]/80">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Calendar className="w-3.5 h-3.5 text-[#1A1A1B]/40" />
                        <span>{item.dueDate}</span>
                        {item.dueTime && <span className="text-[#1A1A1B]/40">@{item.dueTime}</span>}
                        {!item.completed && isTaskOverdue(item) && (
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                            Overdue 🚨
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        item.priority === 'high' 
                          ? 'bg-rose-100 text-rose-700' 
                          : item.priority === 'medium' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#1A1A1B]/60 font-mono">
                      {item.estimatedEffort || '1.5 hrs'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteCommitment(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assignment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#EBE9E0] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#7C9070]/15 text-[#7C9070] flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-[#1A1A1B]">Add Assignment / Exam</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems Lab 4 or Calc Exam"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Subject / Course</label>
                    <input
                      type="text"
                      placeholder="e.g. CS302 or Mathematics"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-semibold focus:outline-none"
                    >
                      <option value="Assignment">Assignment</option>
                      <option value="Exam">Exam</option>
                      <option value="Class">Class / Lecture</option>
                      <option value="Task">Task / Problem Set</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Due Time</label>
                    <input
                      type="time"
                      value={formDueTime}
                      onChange={(e) => setFormDueTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-semibold focus:outline-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Estimated Effort</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 hours"
                      value={formEffort}
                      onChange={(e) => setFormEffort(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#1A1A1B]/60 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7C9070] hover:bg-[#6c7d61] text-white shadow-sm cursor-pointer"
                  >
                    Save Deliverable
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
