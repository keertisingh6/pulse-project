import React from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Sparkles, Plus, Calendar, Clock, AlertTriangle, ArrowUpRight, 
  CheckCircle2, Bookmark, Flame, Target, BookOpen, Laptop, 
  ChevronRight, Award, Trophy, GraduationCap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDeadlineDisplay, isTaskOverdue } from '../utils/deadlineUtils';

interface HomeVisionBoardProps {
  onNavigateToDrop: () => void;
  onNavigateToTab: (tab: 'today' | 'calendar' | 'goals' | 'assistant') => void;
}

export const HomeVisionBoard: React.FC<HomeVisionBoardProps> = ({ 
  onNavigateToDrop, 
  onNavigateToTab 
}) => {
  const { state, toggleCommitment } = usePulse();
  const displayName = state.user?.name || state.userName || 'Friend';

  const activeCommitments = state.commitments.filter(c => !c.completed);
  const urgentItems = activeCommitments.filter(c => c.priority === 'high');
  const recentItems = [...state.commitments].slice(0, 4);

  // Group by category/context
  const examItems = activeCommitments.filter(c => c.type === 'Exam' || (c.subject && c.subject.toLowerCase().includes('exam')));
  const collegeItems = activeCommitments.filter(c => c.type === 'Assignment' || c.type === 'Class');
  const careerItems = activeCommitments.filter(c => c.type === 'Interview' || c.subject === 'Career');
  const personalItems = activeCommitments.filter(c => c.type === 'Bill' || c.type === 'Personal' || c.type === 'Appointment');

  return (
    <div className="space-y-8" id="vision-board-home">
      
      {/* Editorial Hero Banner: "What matters in my life right now?" */}
      <div className="bg-gradient-to-br from-white via-[#FAF9F6] to-[#F5F1E9] border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative soft circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#7C9070]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-100/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#7C9070]/10 text-[#7C9070] px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {state.profile.college
                  ? `${state.profile.college}${state.profile.semester ? ` • ${state.profile.semester}` : ''}`
                  : 'Personal Workspace'}
              </span>
            </div>
            
            <h2 className="font-serif font-light text-2xl md:text-4xl text-[#1A1A1B] leading-tight tracking-tight">
              What matters in your life right now{displayName ? `, ${displayName}` : ''}.
            </h2>
            <p className="text-[#1A1A1B]/60 text-xs md:text-sm leading-relaxed font-sans">
              {activeCommitments.length > 0 || state.goals.length > 0 ? (
                <>
                  You have <strong className="text-[#1A1A1B]">{urgentItems.length} pressing deadlines</strong> and {activeCommitments.length} active commitments across {state.goals.length} goals.
                </>
              ) : (
                'Your workspace is ready. Add an assignment, exam deadline, or study goal to get started.'
              )}
            </p>
          </div>

          {/* Primary Action Button: "+ Add Commitment" */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToDrop}
              className="group flex items-center justify-center gap-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm shadow-md shadow-[#7C9070]/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>+ Add Commitment</span>
            </button>

            <button
              onClick={() => onNavigateToTab('today')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#FAF9F6] text-[#1A1A1B] border border-[#EBE9E0] px-5 py-3.5 rounded-2xl font-semibold text-xs md:text-sm transition-colors cursor-pointer"
            >
              <span>Today's Flow</span>
              <ArrowUpRight className="w-4 h-4 text-[#1A1A1B]/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Pinterest-Inspired Goal Vision Board Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg md:text-xl text-[#1A1A1B]">
              Active North Star Goals
            </h3>
            <p className="text-xs text-[#1A1A1B]/50">
              Long-term ambitions connected directly to daily commitments & study blocks.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('goals')}
            className="text-xs font-semibold text-[#7C9070] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Goals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pinterest-style dynamic masonry cards */}
        {state.goals.length === 0 ? (
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-8 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-xl mx-auto">
              🎯
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">No North Star goals created yet</h4>
              <p className="text-xs text-[#1A1A1B]/50 max-w-sm mx-auto">
                Set long-term targets for exams, career milestones, semester targets, or new skills.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('goals')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF9F6] hover:bg-[#F5F1E9] border border-[#EBE9E0] rounded-xl text-xs font-semibold text-[#1A1A1B] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set First Goal</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.goals.map((goal, idx) => {
              const completedCount = goal.milestones.filter(m => m.completed).length;
              return (
                <motion.div
                  key={goal.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onNavigateToTab('goals')}
                  className="bg-white border border-[#EBE9E0] rounded-[2rem] p-5 shadow-sm hover:shadow-md hover:border-[#7C9070]/40 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group"
                >
                  {/* Subtle color splash header */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5 opacity-80" 
                    style={{ backgroundColor: goal.color }} 
                  />

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl p-2 bg-[#FAF9F6] rounded-2xl border border-[#EBE9E0]/60 inline-block shadow-2xs">
                        {goal.icon}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1B]/40 uppercase tracking-wider bg-[#FAF9F6] px-2.5 py-1 rounded-full border border-[#EBE9E0]">
                        {goal.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A1B] group-hover:text-[#7C9070] transition-colors line-clamp-1">
                        {goal.title}
                      </h4>
                      <p className="text-[11px] text-[#1A1A1B]/60 line-clamp-2 mt-1 font-sans leading-relaxed">
                        {goal.description}
                      </p>
                    </div>

                    {/* Milestones preview pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-[#1A1A1B]/40 uppercase tracking-wide block">
                        Key Milestone
                      </span>
                      <div className="text-[11px] bg-[#FAF9F6] p-2 rounded-xl border border-[#EBE9E0] flex items-center gap-1.5 text-[#1A1A1B]/75 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C9070] shrink-0" />
                        <span className="truncate">{goal.milestones.find(m => !m.completed)?.title || "All milestones achieved!"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-4 mt-3 border-t border-[#EBE9E0]/60 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-[#1A1A1B]/60">
                      <span>{completedCount}/{goal.milestones.length} Milestones</span>
                      <span className="font-mono text-[#1A1A1B]">{goal.progressPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#EBE9E0]">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${goal.progressPercentage}%`, backgroundColor: goal.color }} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Today's Priorities (Left) + College / Exams / Career Channels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Priorities (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1B] flex items-center gap-2">
              <span>Today's Critical Priorities</span>
              <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full border border-rose-100">
                {urgentItems.length} Urgent
              </span>
            </h3>
            <button
              onClick={() => onNavigateToTab('today')}
              className="text-xs font-semibold text-[#7C9070] hover:underline"
            >
              Open Daily Plan →
            </button>
          </div>

          <div className="space-y-3">
            {urgentItems.length === 0 ? (
              <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-8 text-center space-y-2">
                <span className="text-2xl">🌱</span>
                <h4 className="font-serif text-sm font-bold text-[#1A1A1B]">No urgent fires to put out today</h4>
                <p className="text-xs text-[#1A1A1B]/50 max-w-sm mx-auto">
                  All pressing deadlines are under control. Use this spaciousness for long-term goal prep or focused reading.
                </p>
              </div>
            ) : (
              urgentItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-[#EBE9E0] hover:border-[#7C9070]/40 rounded-2xl p-4 shadow-sm transition-all flex items-start gap-3.5 group"
                >
                  <button
                    onClick={() => toggleCommitment(item.id)}
                    className="mt-0.5 text-[#1A1A1B]/20 hover:text-[#7C9070] cursor-pointer"
                  >
                    <CheckCircle2 className={`w-5 h-5 ${item.completed ? 'text-[#7C9070] fill-[#7C9070]/10' : ''}`} />
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                        {item.type}
                      </span>
                      {item.subject && (
                        <span className="text-[10px] font-semibold text-[#1A1A1B]/50 bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#EBE9E0]">
                          {item.subject}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#1A1A1B]/50 ml-auto flex items-center gap-1">
                        <span>Due: {formatDeadlineDisplay(item.dueDate, item.dueTime)}</span>
                        {!item.completed && isTaskOverdue(item) && (
                          <span className="text-rose-600 font-bold font-sans">(Overdue)</span>
                        )}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1A1A1B] leading-tight">
                      {item.title}
                    </h4>

                    {item.aiTip && (
                      <p className="text-[11px] text-[#7C9070] font-serif italic bg-[#7C9070]/5 p-2 rounded-xl mt-1 border border-[#7C9070]/10">
                        ✨ Kairo: "{item.aiTip}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Context Categories: College, Exams, Career, Personal */}
          <div className="pt-4 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1B]">
              Campus & Career Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* College & Assignments */}
              <div className="bg-white border border-[#EBE9E0] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1B] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#7C9070]" />
                    <span>College & Lab Work</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#7C9070] bg-[#7C9070]/10 px-2 py-0.5 rounded-full">
                    {collegeItems.length} active
                  </span>
                </div>
                <div className="space-y-1.5">
                  {collegeItems.slice(0, 2).map(c => (
                    <div key={c.id} className="text-xs text-[#1A1A1B]/80 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C9070]" />
                      <span className="truncate">{c.title}</span>
                    </div>
                  ))}
                  {collegeItems.length === 0 && (
                    <span className="text-[11px] text-[#1A1A1B]/40 italic">All coursework caught up!</span>
                  )}
                </div>
              </div>

              {/* Exams */}
              <div className="bg-white border border-[#EBE9E0] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1B] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-rose-500" />
                    <span>Exams & Quizzes</span>
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    {examItems.length} scheduled
                  </span>
                </div>
                <div className="space-y-1.5">
                  {examItems.slice(0, 2).map(c => (
                    <div key={c.id} className="text-xs text-[#1A1A1B]/80 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="truncate">{c.title}</span>
                    </div>
                  ))}
                  {examItems.length === 0 && (
                    <span className="text-[11px] text-[#1A1A1B]/40 italic">No exams in the next 7 days</span>
                  )}
                </div>
              </div>

              {/* Career & Interviews */}
              <div className="bg-white border border-[#EBE9E0] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1B] flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-sky-500" />
                    <span>Internships & Interviews</span>
                  </span>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                    {careerItems.length} in pipeline
                  </span>
                </div>
                <div className="space-y-1.5">
                  {careerItems.slice(0, 2).map(c => (
                    <div key={c.id} className="text-xs text-[#1A1A1B]/80 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span className="truncate">{c.title}</span>
                    </div>
                  ))}
                  {careerItems.length === 0 && (
                    <span className="text-[11px] text-[#1A1A1B]/40 italic">No scheduled interviews</span>
                  )}
                </div>
              </div>

              {/* Personal & Bills */}
              <div className="bg-white border border-[#EBE9E0] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1B] flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>Personal & Admin Tasks</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    {personalItems.length} active
                  </span>
                </div>
                <div className="space-y-1.5">
                  {personalItems.slice(0, 2).map(c => (
                    <div key={c.id} className="text-xs text-[#1A1A1B]/80 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="truncate">{c.title}</span>
                    </div>
                  ))}
                  {personalItems.length === 0 && (
                    <span className="text-[11px] text-[#1A1A1B]/40 italic">Personal accounts clean</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Quick Card & Recently Added (1 col) */}
        <div className="space-y-6">
          
          {/* Calm AI Assistant Card */}
          <div className="bg-[#FAF9F6] border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7C9070] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                K
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">Kairo Companion</h4>
                <span className="text-[10px] text-[#7C9070] font-medium">Ready with your schedule data</span>
              </div>
            </div>

            <p className="text-xs text-[#1A1A1B]/70 leading-relaxed font-serif italic">
              "Have a question about your deadlines, study workload, or schedule? Ask me anything about your commitments."
            </p>

            <div className="space-y-1.5 pt-1">
              {[
                "What do I need to finish today?",
                "When is my next deadline?",
                "Do I have enough time for my upcoming tasks?",
              ].map(query => (
                <button
                  key={query}
                  onClick={() => onNavigateToTab('assistant')}
                  className="w-full text-left p-2.5 bg-white hover:bg-[#7C9070]/10 border border-[#EBE9E0] rounded-xl text-[11px] text-[#1A1A1B]/80 transition-colors font-medium flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{query}</span>
                  <ChevronRight className="w-3 h-3 text-[#1A1A1B]/30" />
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateToTab('assistant')}
              className="w-full py-2 bg-[#1A1A1B] hover:bg-[#1A1A1B]/90 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Open AI Companion Chat
            </button>
          </div>

          {/* Recently Added Items */}
          <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-2">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A1A1B]/70">
                Recently Added
              </h4>
              <span className="text-[10px] font-mono text-[#1A1A1B]/40">Pulse Inbox</span>
            </div>

            <div className="space-y-2.5">
              {recentItems.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <p className="text-xs text-[#1A1A1B]/40 italic">No commitments added yet</p>
                  <button 
                    onClick={onNavigateToDrop} 
                    className="text-[11px] text-[#7C9070] font-semibold hover:underline cursor-pointer"
                  >
                    + Drop your first item
                  </button>
                </div>
              ) : (
                recentItems.map(item => (
                  <div key={item.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1A1A1B] truncate">{item.title}</span>
                      <span className="text-[10px] font-mono text-[#1A1A1B]/40 shrink-0 ml-2">{item.dueDate}</span>
                    </div>
                    <div className="text-[10px] text-[#1A1A1B]/50 flex items-center gap-1.5">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.estimatedEffort}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
