import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { Goal, GoalMilestone } from '../types';
import { 
  Target, Plus, CheckCircle2, Circle, Calendar, 
  Clock, BookOpen, ChevronRight, Award, Trash2, X, Check, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GoalsView: React.FC<{ onAddCommitmentForGoal?: (goalTitle: string) => void }> = ({
  onAddCommitmentForGoal,
}) => {
  const { state, addGoal, toggleGoalMilestone, deleteGoal } = usePulse();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(state.goals[0]?.id || '');

  // New goal form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'exam' | 'career' | 'academic' | 'skill' | 'personal'>('exam');
  const [newIcon, setNewIcon] = useState('🎯');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newWeeklyHours, setNewWeeklyHours] = useState(6);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [milestonesList, setMilestonesList] = useState<string[]>([]);

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestonesList(prev => [...prev, newMilestoneText.trim()]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestonesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ['#E87D75', '#7C9070', '#5B8FB9', '#D4A373', '#9B5DE5'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addGoal({
      title: newTitle.trim(),
      category: newCategory,
      icon: newIcon,
      targetDate: newTargetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      description: newDescription || `Long-term commitment for ${newTitle}.`,
      weeklyHoursTarget: newWeeklyHours,
      color: randomColor,
      progressPercentage: 0,
      milestones: milestonesList.map((m, idx) => ({
        id: 'm_' + idx + '_' + Math.random().toString(36).substring(2, 6),
        title: m,
        completed: false,
      })),
    });

    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewTargetDate('');
    setMilestonesList([]);
    setShowCreateModal(false);
  };

  const activeGoal = state.goals.find(g => g.id === selectedGoalId) || state.goals[0];

  return (
    <div className="space-y-6" id="goals-page">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-3 py-0.5 rounded-full">
              Long-Term Trajectory
            </span>
            <span className="text-xs text-[#1A1A1B]/40 font-mono">
              {state.goals.length} Active North Stars
            </span>
          </div>
          <h2 className="font-serif font-light text-2xl md:text-3xl text-[#1A1A1B]">
            Break ambitious goals into <span className="italic font-normal">gentle weekly rhythms</span>.
          </h2>
          <p className="text-xs text-[#1A1A1B]/60 max-w-xl leading-relaxed">
            Every long-term exam (GATE, GRE), career milestone (Internship), and degree target connects directly to tasks tracked in your commitments planner.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#7C9070]/15 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Long-Term Goal</span>
        </button>
      </div>

      {/* Main Grid: Goal Selector (Left) + Detailed Deep-Dive (Right) */}
      {state.goals.length === 0 ? (
        <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-3xl mx-auto shadow-xs">
            🎯
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1B]">No North Star goals created yet</h3>
            <p className="text-xs text-[#1A1A1B]/60 leading-relaxed font-sans">
              Set long-term targets for competitive exams, semester milestones, internships, or skill paths. When you drop commitments into Pulse, you can connect them to these goals.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Goals List cards (1 col) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1A1A1B]/50 uppercase tracking-wider block px-1">
              Your Tracked Ambitions
            </span>

            <div className="space-y-3">
              {state.goals.map(goal => {
                const isSelected = goal.id === activeGoal?.id;
                const completedCount = goal.milestones.filter(m => m.completed).length;

                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalId(goal.id)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedGoalId(goal.id); } }}
                    role="button"
                    aria-pressed={isSelected}
                    tabIndex={0}
                    className={`goal-selector-card bg-white border rounded-2xl p-4 transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#7C9070] shadow-sm ring-1 ring-[#7C9070]/30'
                        : 'border-[#EBE9E0] hover:border-[#7C9070]/40'
                    }`}
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 w-1"
                      style={{ backgroundColor: goal.color }}
                    />

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 bg-[#FAF9F6] rounded-xl border border-[#EBE9E0]">
                          {goal.icon}
                        </span>
                        <div>
                          <h4 className="font-serif font-bold text-xs md:text-sm text-[#1A1A1B] line-clamp-1">
                            {goal.title}
                          </h4>
                          <span className="text-[10px] text-[#1A1A1B]/40 font-mono">
                            Target: {goal.targetDate}
                          </span>
                        </div>
                      </div>

                      <span className="goal-progress-ring" style={{ '--goal-progress': `${goal.progressPercentage}%` } as React.CSSProperties} aria-label={`${goal.progressPercentage}% complete`}>
                        <b>{goal.progressPercentage}%</b>
                      </span>
                    </div>

                    {/* Micro Progress Bar */}
                    <div className="mt-3 pt-2 border-t border-[#EBE9E0]/60 flex items-center justify-between text-[10px] text-[#1A1A1B]/50 font-medium">
                      <span>{completedCount}/{goal.milestones.length} milestones</span>
                      <span>{goal.weeklyHoursTarget || 10}h / week</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Right Column: Goal Detail View (2 cols) */}
        {activeGoal && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              
              {/* Goal Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE9E0] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-2xl shadow-2xs">
                    {activeGoal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#EBE9E0] text-[#1A1A1B]/50">
                        {activeGoal.category}
                      </span>
                      <span className="text-[10px] text-[#1A1A1B]/40 font-mono">
                        Target Deadline: {activeGoal.targetDate}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1B] mt-0.5">
                      {activeGoal.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => deleteGoal(activeGoal.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 self-start sm:self-center cursor-pointer"
                  title="Delete goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Goal</span>
                </button>
              </div>

              {/* Description & Target Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF9F6] p-4 rounded-2xl border border-[#EBE9E0]">
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 block mb-1">
                    Vision Statement & Purpose
                  </span>
                  <p className="text-xs text-[#1A1A1B]/80 font-sans leading-relaxed">
                    {activeGoal.description}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1B]/40 block mb-1">
                    Weekly Rhythm Target
                  </span>
                  <div className="flex items-baseline gap-1 font-serif text-lg font-bold text-[#7C9070]">
                    <span>{activeGoal.weeklyHoursTarget || 10}</span>
                    <span className="text-xs font-normal text-[#1A1A1B]/50 font-sans">hours / week</span>
                  </div>
                </div>
              </div>

              {/* Milestones Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">
                    Actionable Milestones
                  </h4>
                  <span className="text-xs text-[#1A1A1B]/40">
                    Click checkmark to update progress
                  </span>
                </div>

                <div className="space-y-2">
                  {activeGoal.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => toggleGoalMilestone(activeGoal.id, m.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-[#FAF9F6] border-[#EBE9E0] opacity-60'
                          : 'bg-white border-[#EBE9E0] hover:border-[#7C9070]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-[#1A1A1B]/20 hover:text-[#7C9070]"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#7C9070] fill-[#7C9070]/10" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#1A1A1B]/20 hover:stroke-[#7C9070]" />
                          )}
                        </button>
                        <span className={`text-xs font-medium text-[#1A1A1B] ${m.completed ? 'line-through text-[#1A1A1B]/40' : ''}`}>
                          {m.title}
                        </span>
                      </div>

                      {m.dueDate && (
                        <span className="text-[10px] font-mono text-[#1A1A1B]/40 shrink-0">
                          Due {m.dueDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects / Modules (For academic / GATE goals) */}
              {activeGoal.subjects && activeGoal.subjects.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">
                    Subject Modules & Topic Progress
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeGoal.subjects.map(s => {
                      const completed = s.completedTopics || 0;
                      const total = s.topicsCount || 10;
                      const pct = Math.round((completed / total) * 100);

                      return (
                        <div key={s.id} className="p-3 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-[#1A1A1B]">
                            <span className="truncate">{s.name}</span>
                            <span className="font-mono text-[#7C9070] shrink-0 ml-1">{completed}/{total}</span>
                          </div>
                          <div className="h-1 bg-white rounded-full overflow-hidden border border-[#EBE9E0]">
                            <div className="h-full bg-[#7C9070] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
      )}

      {/* Create New Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1B]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1B]">
                Track a Long-Term North Star
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#1A1A1B]/40 hover:text-[#1A1A1B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1B]/70">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GATE 2027, Summer Internship, MS in USA"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1B]/70">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                  >
                    <option value="exam">Exam (GATE, GRE)</option>
                    <option value="career">Career / Internship</option>
                    <option value="academic">College / Academics</option>
                    <option value="skill">Skill Development</option>
                    <option value="personal">Personal Project</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1B]/70">Icon Emoji</label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={e => setNewIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1B]/70">Target Deadline</label>
                  <input
                    type="date"
                    required
                    value={newTargetDate}
                    onChange={e => setNewTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1B]/70">Weekly Study Hours</label>
                  <input
                    type="number"
                    min={2}
                    max={40}
                    value={newWeeklyHours}
                    onChange={e => setNewWeeklyHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1B]/70">Why does this matter? (Description)</label>
                <textarea
                  rows={2}
                  placeholder="Target outcome, PSU rank, company role..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none resize-none"
                />
              </div>

              {/* Milestones list builder */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-[#1A1A1B]/70 block">
                  Actionable Milestones
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add milestone (e.g. Complete Discrete Math syllabus)"
                    value={newMilestoneText}
                    onChange={e => setNewMilestoneText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-3.5 py-2 bg-[#7C9070] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {milestonesList.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#EBE9E0]">
                      <span className="truncate">{m}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-rose-500 hover:text-rose-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBE9E0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#1A1A1B]/60 hover:text-[#1A1A1B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save North Star
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

