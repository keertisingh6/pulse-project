import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Goal, Milestone } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Dumbbell,
  Laptop,
  Plus,
  Check,
  ChevronDown,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  FlaskConical,
  Trophy,
  Target,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';

export const GrowthView: React.FC = () => {
  const {
    goals,
    toggleMilestone,
    toggleLinkedCommitment,
    setIsGoalModalOpen,
    setEditingGoal,
    deleteGoal,
    showToast
  } = usePulse();

  const [activeFilter, setActiveFilter] = useState<'all' | 'Academic' | 'Personal' | 'Career'>('all');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || 'goal-1');

  const filteredGoals = goals.filter(g => {
    if (activeFilter === 'all') return true;
    return g.category === activeFilter;
  });

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Academic':
        return { tagBg: 'bg-[#EAF4EE] text-[#236B43]', ringColor: '#1E3A2B', icon: GraduationCap };
      case 'Career':
        return { tagBg: 'bg-[#F5EEFD] text-[#5344B5]', ringColor: '#7B68EE', icon: BookOpen };
      case 'Personal':
        return { tagBg: 'bg-[#FDF0ED] text-[#C34E32]', ringColor: '#C34E32', icon: Dumbbell };
      default:
        return { tagBg: 'bg-[#FEF7E6] text-[#A1741F]', ringColor: '#A1741F', icon: Laptop };
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & + New Goal button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight flex items-center gap-2">
            <span>Goals & Roadmap</span>
            <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
              <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Set long-term goals and break them into manageable milestones.
          </p>
        </div>

        <button
          onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {(['all', 'Academic', 'Career', 'Personal'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === cat
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            {cat === 'all' ? `All Goals (${goals.length})` : `${cat}`}
          </button>
        ))}
      </div>

      {/* 3. Goal Cards (4-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGoals.map(goal => {
          const styles = getCategoryStyles(goal.category);
          const Icon = styles.icon;
          const isSelected = selectedGoal?.id === goal.id;

          const circumference = 2 * Math.PI * 14;
          const strokeDashoffset = circumference - (goal.progressPercent / 100) * circumference;

          return (
            <div
              key={goal.id}
              onClick={() => setSelectedGoalId(goal.id)}
              className={`rounded-3xl bg-white border overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer group ${
                isSelected ? 'ring-2 ring-[#1E3A2B] border-[#1E3A2B]' : 'border-[#E8E2D5]'
              }`}
            >
              {/* Photo on top with category pill */}
              <div className="relative h-28 w-full overflow-hidden bg-[#EDE8DE]">
                <img
                  src={goal.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'}
                  alt={goal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-2xs ${styles.tagBg}`}
                >
                  {goal.category}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingGoal(goal);
                    setIsGoalModalOpen(true);
                  }}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white/80 hover:bg-white text-[#1E2621] transition-all shadow-2xs"
                  title="Edit Goal"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              {/* Lower Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#1E2621] leading-tight line-clamp-1 group-hover:text-[#1E3A2B] transition-colors">
                    {goal.title}
                  </h4>
                  <div className="w-6 h-6 rounded-lg bg-[#F4EFE6] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#1E3A2B]" />
                  </div>
                </div>

                {/* Progress donut & tasks text */}
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle cx="20" cy="20" r="14" stroke="#EDE8DE" strokeWidth="3.2" fill="none" />
                      <circle
                        cx="20"
                        cy="20"
                        r="14"
                        stroke={styles.ringColor}
                        strokeWidth="3.2"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-[#1E2621]">
                      {goal.progressPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] leading-tight text-[#7A837C]">
                    <span className="block font-bold text-[#1E2621]">Target: {goal.targetDate}</span>
                    <span className="block">{goal.completedTasks}/{goal.totalTasks} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Lower Two-Column Section: Milestones & Linked Commitments + Stats */}
      {selectedGoal && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Milestones & Linked Commitments */}
          <div className="lg:col-span-8 space-y-5">
            {/* Milestones Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1E2621]">
                    Milestones: <span className="font-serif italic font-normal text-[#1E3A2B]">{selectedGoal.title}</span>
                  </h3>
                </div>
                <button
                  onClick={() => { setEditingGoal(selectedGoal); setIsGoalModalOpen(true); }}
                  className="text-xs font-bold text-[#1E3A2B] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {/* Stepper with click to complete milestone */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EDE8DE]">
                {selectedGoal.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(selectedGoal.id, m.id)}
                    className="relative flex items-center justify-between group cursor-pointer"
                    title="Click to cycle status: Upcoming -> In Progress -> Completed"
                  >
                    {/* Circle on the line */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all bg-white ${
                        m.completed
                          ? 'border-[#1E3A2B] bg-[#1E3A2B] text-white'
                          : m.percent && m.percent > 0
                          ? 'border-[#D4A034] text-[#D4A034]'
                          : 'border-[#B8B0A2]'
                      }`}
                    >
                      {m.completed ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : m.percent && m.percent > 0 ? (
                        <span className="w-2 h-2 rounded-full bg-[#D4A034]" />
                      ) : null}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${m.completed ? 'text-[#1E3A2B]' : 'text-[#1E2621]'}`}>
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-[#7A837C] font-mono">{m.dateRange}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        m.completed
                          ? 'bg-[#EAF4EE] text-[#236B43]'
                          : m.percent && m.percent > 0
                          ? 'bg-[#FEF7E6] text-[#A1741F]'
                          : 'bg-[#F4EFE6] text-[#8C958E]'
                      }`}
                    >
                      {m.completed ? '100%' : `${m.percent || 0}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Commitments Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h3 className="text-base font-bold text-[#1E2621]">Linked Commitments</h3>
                <span className="text-xs text-[#7A837C] font-mono">
                  {selectedGoal.linkedCommitments?.filter(l => l.completed).length || 0}/
                  {selectedGoal.linkedCommitments?.length || 0} completed
                </span>
              </div>

              <div className="space-y-2">
                {(selectedGoal.linkedCommitments || []).map(lc => (
                  <div
                    key={lc.id}
                    onClick={() => toggleLinkedCommitment(selectedGoal.id, lc.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          lc.completed
                            ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                            : 'border-[#B8B0A2] bg-white'
                        }`}
                      >
                        {lc.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold ${lc.completed ? 'line-through text-[#8C958E]' : 'text-[#1E2621]'}`}>
                          {lc.title}
                        </h4>
                        <span className="text-[10px] text-[#7A837C]">{lc.type}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#7A837C] font-mono">{lc.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Goal Statistics */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
              <h3 className="text-base font-bold text-[#1E2621]">Goal Statistics</h3>
              <div className="text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE]">
                <span>This Month</span>
              </div>
            </div>

            {/* Explicit Height Stacked Bars Chart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-end justify-between gap-3 h-28 px-2 border-b border-[#F2ECE1] pb-2">
                {/* Y-axis guidelines */}
                <div className="flex flex-col justify-between h-full text-[9px] font-mono text-[#A4AAA6] select-none pr-1">
                  <span>8</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>

                {/* 4 weekly bars with explicit segment heights */}
                {[
                  { week: 'W1', segments: [{ h: 'h-8', bg: 'bg-[#1E3A2B]' }, { h: 'h-6', bg: 'bg-[#D4A034]' }] },
                  { week: 'W2', segments: [{ h: 'h-10', bg: 'bg-[#1E3A2B]' }, { h: 'h-8', bg: 'bg-[#D4A034]' }, { h: 'h-4', bg: 'bg-[#C34E32]' }] },
                  { week: 'W3', segments: [{ h: 'h-12', bg: 'bg-[#1E3A2B]' }, { h: 'h-6', bg: 'bg-[#D4A034]' }] },
                  { week: 'W4', segments: [{ h: 'h-14', bg: 'bg-[#1E3A2B]' }, { h: 'h-8', bg: 'bg-[#D4A034]' }, { h: 'h-4', bg: 'bg-[#C34E32]' }] }
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-7 rounded-t-xl overflow-hidden flex flex-col justify-end bg-[#EDE8DE]/40 p-0.5">
                      {col.segments.map((seg, sIdx) => (
                        <div key={sIdx} className={`w-full ${seg.h} ${seg.bg} rounded-xs mb-0.5`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-[#7A837C] font-semibold">{col.week}</span>
                  </div>
                ))}
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-2xl bg-[#EAF4EE] border border-[#D5EADB]">
                  <span className="text-base font-black text-[#236B43] block">18</span>
                  <span className="text-[9px] text-[#58615A] font-bold">Achieved</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FEF7E6] border border-[#F6E6BF]">
                  <span className="text-base font-black text-[#A1741F] block">7</span>
                  <span className="text-[9px] text-[#58615A] font-bold">In Motion</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#FDF0ED] border border-[#F6DCD6]">
                  <span className="text-base font-black text-[#C34E32] block">4</span>
                  <span className="text-[9px] text-[#58615A] font-bold">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
