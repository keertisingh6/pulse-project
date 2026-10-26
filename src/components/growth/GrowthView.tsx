import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
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
  CheckCircle2
} from 'lucide-react';

export const GrowthView: React.FC = () => {
  const { showToast } = usePulse();
  const [activeFilter, setActiveFilter] = useState<'all' | 'academic' | 'personal' | 'career'>('all');

  // 4 Primary Goal Cards matching Screenshot 5
  const goals = [
    {
      id: 'g-1',
      title: 'Complete B.Tech',
      category: 'Academic',
      categoryColor: 'bg-[#EAF4EE] text-[#236B43]',
      progress: 65,
      tasksText: '37/56 tasks',
      target: 'May 2028',
      ringColor: '#1E3A2B',
      icon: GraduationCap,
      iconBg: 'bg-[#EAF4EE] text-[#236B43]',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'g-2',
      title: 'Crack UPSC (IAS)',
      category: 'Career',
      categoryColor: 'bg-[#F5EEFD] text-[#5344B5]',
      progress: 25,
      tasksText: '5/20 tasks',
      target: '2029',
      ringColor: '#7B68EE',
      icon: BookOpen,
      iconBg: 'bg-[#EAF4EE] text-[#236B43]',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'g-3',
      title: 'Improve Health & Fitness',
      category: 'Personal',
      categoryColor: 'bg-[#FDF0ED] text-[#C34E32]',
      progress: 40,
      tasksText: '4/10 tasks',
      target: 'Dec 2025',
      ringColor: '#C34E32',
      icon: Dumbbell,
      iconBg: 'bg-[#FDF0ED] text-[#C34E32]',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'g-4',
      title: 'Build Strong Projects',
      category: 'Academic',
      categoryColor: 'bg-[#FEF7E6] text-[#A1741F]',
      progress: 50,
      tasksText: '5/10 tasks',
      target: 'Dec 2025',
      ringColor: '#A1741F',
      icon: Laptop,
      iconBg: 'bg-[#FEF7E6] text-[#A1741F]',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // Milestones matching Screenshot 5
  const [milestonesList, setMilestonesList] = useState([
    {
      id: 'm-1',
      title: 'Complete 3rd Year (Current)',
      dateRange: 'Aug 2025 - May 2026',
      percent: '100%',
      percentColor: 'bg-[#EAF4EE] text-[#236B43]',
      status: 'completed'
    },
    {
      id: 'm-2',
      title: 'Complete 4th Year',
      dateRange: 'Jun 2026 - May 2027',
      percent: '60%',
      percentColor: 'bg-[#FEF7E6] text-[#A1741F]',
      status: 'in_progress'
    },
    {
      id: 'm-3',
      title: 'Final Year Project',
      dateRange: 'Aug 2027 - Dec 2027',
      percent: '0%',
      percentColor: 'bg-[#F4EFE6] text-[#8C958E]',
      status: 'upcoming'
    },
    {
      id: 'm-4',
      title: 'Graduate',
      dateRange: 'May 2028',
      percent: '0%',
      percentColor: 'bg-[#F4EFE6] text-[#8C958E]',
      status: 'upcoming'
    }
  ]);

  // Linked Commitments matching Screenshot 5
  const [linkedItems, setLinkedItems] = useState([
    {
      id: 'lc-1',
      title: 'DBMS Assignment 2',
      type: 'Assignment',
      date: '28 Oct 2025',
      completed: false,
      icon: FileText,
      iconColor: 'bg-[#F0EFFE] text-[#5344B5]'
    },
    {
      id: 'lc-2',
      title: 'SE Midterm Preparation',
      type: 'Exam',
      date: '3 Nov 2025',
      completed: false,
      icon: BookOpen,
      iconColor: 'bg-[#FDF0ED] text-[#C34E32]'
    },
    {
      id: 'lc-3',
      title: 'Project Phase 1',
      type: 'Project',
      date: '15 Nov 2025',
      completed: false,
      icon: Trophy,
      iconColor: 'bg-[#FEF7E6] text-[#A1741F]'
    },
    {
      id: 'lc-4',
      title: 'PBL-III Viva',
      type: 'Lab',
      date: '11 Nov 2025',
      completed: false,
      icon: FlaskConical,
      iconColor: 'bg-[#EEF4FF] text-[#256E93]'
    }
  ]);

  const toggleLinked = (id: string) => {
    setLinkedItems(prev =>
      prev.map(i => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
    showToast('Toggled commitment link!', 'success');
  };

  const filteredGoals = goals.filter(g => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'academic') return g.category === 'Academic';
    if (activeFilter === 'personal') return g.category === 'Personal';
    if (activeFilter === 'career') return g.category === 'Career';
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & + New Goal button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight flex items-center gap-2">
            <span>Goals</span>
            <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
              <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Big dreams, small steps, consistent progress.
          </p>
        </div>

        <button
          onClick={() => showToast('Create new goal modal', 'info')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          All (4)
        </button>
        <button
          onClick={() => setActiveFilter('academic')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'academic'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Academic (2)
        </button>
        <button
          onClick={() => setActiveFilter('personal')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'personal'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Personal (1)
        </button>
        <button
          onClick={() => setActiveFilter('career')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'career'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Career (1)
        </button>
      </div>

      {/* 3. 4 Goal Cards in a 4-Column Row (matching Screenshot 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGoals.map(goal => {
          const Icon = goal.icon;
          const circumference = 2 * Math.PI * 18;
          const strokeDashoffset = circumference - (goal.progress / 100) * circumference;

          return (
            <div
              key={goal.id}
              className="rounded-3xl bg-white border border-[#E8E2D5] shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Header Banner Photo */}
              <div className="h-28 w-full relative overflow-hidden bg-[#EDE9DF]">
                <img
                  src={goal.image}
                  alt={goal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Top icon and options */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs ${goal.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-white text-xs drop-shadow-md cursor-pointer">···</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <h3 className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors leading-snug">
                  {goal.title}
                </h3>

                <div className="flex items-center justify-between">
                  {/* Progress donut */}
                  <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#EDE8DE"
                        strokeWidth="3.5"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={goal.ringColor}
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-[#1E2621]">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="text-right text-[10px] space-y-0.5">
                    <span className="font-bold text-[#1E2621] block">{goal.tasksText}</span>
                    <span className="text-[#7A837C] block">Target</span>
                    <span className="text-[#1E2621] font-medium block">{goal.target}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F4EFE6]">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${goal.categoryColor}`}>
                    {goal.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Lower Section: 3 Columns (Milestones | Linked Commitments | Goals Statistics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1 (4 cols): Milestones */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h4 className="text-xs font-bold text-[#1E2621]">Milestones</h4>
            <div className="flex items-center gap-1 text-[11px] text-[#58615A] bg-[#FBF9F5] px-2 py-0.5 rounded-xl border border-[#EDE8DE]">
              <span>Complete B.Tech</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Stepper timeline with connected line */}
          <div className="relative space-y-4 pl-2">
            {/* Vertical connector line */}
            <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-[#EDE8DE]" />

            {milestonesList.map((m, idx) => (
              <div key={m.id} className="relative flex items-center justify-between text-xs pl-6">
                {/* Node circle */}
                <div
                  className={`absolute left-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    m.status === 'completed'
                      ? 'bg-[#1E3A2B] text-white ring-4 ring-white'
                      : m.status === 'in_progress'
                      ? 'bg-[#A1741F] text-white ring-4 ring-white'
                      : 'bg-[#B8B0A2] ring-4 ring-white'
                  }`}
                >
                  {m.status === 'completed' && <Check className="w-2 h-2 stroke-[3]" />}
                </div>

                <div className="space-y-0.5 pr-2">
                  <h5 className="font-bold text-[#1E2621] leading-tight">{m.title}</h5>
                  <span className="text-[10px] text-[#A4AAA6] block font-mono">{m.dateRange}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${m.percentColor}`}>
                  {m.percent}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 (4 cols): Linked Commitments */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h4 className="text-xs font-bold text-[#1E2621]">Linked Commitments</h4>
            <button className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5">
              <span>View All</span>
              <span className="text-xs">→</span>
            </button>
          </div>

          <div className="space-y-2">
            {linkedItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleLinked(item.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#F4EFE6] transition-all cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs ${item.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <h5
                        className={`font-bold leading-tight ${
                          item.completed ? 'line-through text-[#9BA29C]' : 'text-[#1E2621]'
                        }`}
                      >
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-[#A4AAA6]">{item.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#7A837C] font-mono">{item.date}</span>
                    <button
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                          : 'border-[#B8B0A2] bg-white group-hover:border-[#1E3A2B]'
                      }`}
                    >
                      {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3 (4 cols): Goals Statistics */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h4 className="text-xs font-bold text-[#1E2621]">Goals Statistics</h4>
            <div className="flex items-center gap-1 text-[11px] text-[#58615A] bg-[#FBF9F5] px-2 py-0.5 rounded-xl border border-[#EDE8DE]">
              <span>This Month</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* 4-Week Stacked Bar Chart with Y-axis */}
          <div className="pt-2 space-y-1">
            <div className="flex gap-2.5 items-end">
              {/* Y-axis numbers */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-[#A4AAA6] h-28 py-0.5 select-none w-3 text-right flex-shrink-0">
                <span>8</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>

              {/* Chart Grid with Guidelines & Stacked Bars */}
              <div className="flex-1 relative h-28 border-b border-[#EDE8DE]">
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-[#F2ECE1]" />
                <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-[#F2ECE1]" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-[#F2ECE1]" />

                {/* 4 Stacked Bars */}
                <div className="absolute inset-0 flex items-end justify-around px-2">
                  {/* Week 1: Total height ~68px */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 sm:w-7 h-[68px] rounded-t-md overflow-hidden flex flex-col justify-end shadow-2xs border border-[#EDE8DE]/40">
                      <div className="w-full h-[18px] bg-[#FEF7E6]" title="Others: 1.5h" />
                      <div className="w-full h-[22px] bg-[#FDF0ED]" title="Personal: 2h" />
                      <div className="w-full h-[28px] bg-[#1E3A2B]" title="Academic: 2.5h" />
                    </div>
                  </div>

                  {/* Week 2: Total height ~84px */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 sm:w-7 h-[84px] rounded-t-md overflow-hidden flex flex-col justify-end shadow-2xs border border-[#EDE8DE]/40">
                      <div className="w-full h-[24px] bg-[#FEF7E6]" title="Others: 2h" />
                      <div className="w-full h-[18px] bg-[#7B68EE]" title="Career: 1h" />
                      <div className="w-full h-[42px] bg-[#1E3A2B]" title="Academic: 3h" />
                    </div>
                  </div>

                  {/* Week 3: Total height ~76px */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 sm:w-7 h-[76px] rounded-t-md overflow-hidden flex flex-col justify-end shadow-2xs border border-[#EDE8DE]/40">
                      <div className="w-full h-[18px] bg-[#FEF7E6]" title="Others: 1.5h" />
                      <div className="w-full h-[16px] bg-[#FDF0ED]" title="Personal: 1.5h" />
                      <div className="w-full h-[16px] bg-[#7B68EE]" title="Career: 1.5h" />
                      <div className="w-full h-[26px] bg-[#1E3A2B]" title="Academic: 2h" />
                    </div>
                  </div>

                  {/* Week 4: Total height ~94px */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 sm:w-7 h-[94px] rounded-t-md overflow-hidden flex flex-col justify-end shadow-2xs border border-[#EDE8DE]/40">
                      <div className="w-full h-[22px] bg-[#FEF7E6]" title="Others: 1.5h" />
                      <div className="w-full h-[24px] bg-[#FDF0ED]" title="Personal: 1.5h" />
                      <div className="w-full h-[48px] bg-[#1E3A2B]" title="Academic: 3.5h" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* X-axis Week labels */}
            <div className="flex justify-around pl-5 pt-1 text-[9px] font-semibold text-[#7A837C]">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-[#58615A] pt-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2B]" />
                <span className="font-medium">Academic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B68EE]" />
                <span className="font-medium">Career</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C34E32]" />
                <span className="font-medium">Personal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEF7E6] border border-[#F6E6BF]" />
                <span className="font-medium">Others</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Badges below chart */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-2xl bg-[#EAF4EE] border border-[#D5EADB] text-center">
              <div className="flex items-center justify-center gap-1 text-[#236B43] mb-0.5">
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs font-extrabold">12</span>
              </div>
              <span className="text-[9px] font-bold text-[#236B43] block leading-tight">Total Goals</span>
            </div>

            <div className="p-2 rounded-2xl bg-[#EAF4EE] border border-[#D5EADB] text-center">
              <div className="flex items-center justify-center gap-1 text-[#236B43] mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-extrabold">21</span>
              </div>
              <span className="text-[9px] font-bold text-[#236B43] block leading-tight">Completed Tasks</span>
            </div>

            <div className="p-2 rounded-2xl bg-[#FDF0ED] border border-[#F6DCD6] text-center">
              <div className="flex items-center justify-center gap-1 text-[#C34E32] mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-extrabold">37</span>
              </div>
              <span className="text-[9px] font-bold text-[#C34E32] block leading-tight">Pending Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};