import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { Subject } from '../../types';
import {
  X,
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';

interface Props {
  subject: Subject | null;
  onClose: () => void;
}

export const SubjectDetailModal: React.FC<Props> = ({ subject, onClose }) => {
  const { toggleTopicCompletion, setCurrentView, startFocusOnTask, showToast } = usePulse();

  if (!subject) return null;

  const totalTopics = subject.syllabus.reduce((acc, u) => acc + u.topics.length, 0);
  const completedTopics = subject.syllabus.reduce(
    (acc, u) => acc + u.topics.filter(t => t.completed).length,
    0
  );
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleScheduleStudy = () => {
    onClose();
    setCurrentView('planner');
    showToast(`Opening planner to schedule ${subject.name} review`, 'info');
  };

  const handleStartFocus = () => {
    onClose();
    startFocusOnTask();
    setCurrentView('focus');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F2ECE1]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#236B43]">
                {subject.code}
              </span>
              <span className="text-xs text-[#7A837C] font-semibold">{subject.credits} Credits</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-[#1E2621]">{subject.name}</h3>
            {subject.instructor && (
              <p className="text-xs text-[#7A837C]">Instructor: {subject.instructor}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C958E] hover:text-[#1E2621]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Overview Card */}
        <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1E2621]">Syllabus Mastery</span>
            <p className="text-xs text-[#7A837C]">
              {completedTopics} of {totalTopics} topics completed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-28 h-2.5 rounded-full bg-[#EDE8DE] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1E3A2B] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#1E3A2B]">{progressPercent}%</span>
          </div>
        </div>

        {/* Syllabus Units & Topics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1E2621] uppercase tracking-wider">
            Syllabus Curriculum & Units
          </h4>

          {subject.syllabus.map(unit => (
            <div
              key={unit.id}
              className="p-4 rounded-2xl bg-[#FEFDF9] border border-[#E8E2D5] space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#F2ECE1]">
                <h5 className="text-xs font-bold text-[#1E2621]">{unit.title}</h5>
                <span className="text-[10px] text-[#7A837C] font-mono">
                  {unit.topics.filter(t => t.completed).length}/{unit.topics.length} done
                </span>
              </div>

              <div className="space-y-1.5">
                {unit.topics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopicCompletion(subject.id, unit.id, topic.id)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4EFE6] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          topic.completed
                            ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white'
                            : 'border-[#B8B0A2] bg-white group-hover:border-[#1E3A2B]'
                        }`}
                      >
                        {topic.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <span
                        className={`text-xs transition-colors ${
                          topic.completed
                            ? 'line-through text-[#8C958E]'
                            : 'text-[#1E2621] font-medium'
                        }`}
                      >
                        {topic.title}
                      </span>
                    </div>

                    {topic.estimatedHours && (
                      <span className="text-[10px] text-[#7A837C] font-mono">
                        {topic.estimatedHours}h
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#F2ECE1] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleScheduleStudy}
              className="px-4 py-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EDE9DF] text-[#1E2621] text-xs font-bold border border-[#E8E2D5] flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1E3A2B]" />
              <span>Schedule in Planner</span>
            </button>

            <button
              onClick={handleStartFocus}
              className="px-4 py-2.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-[#236B43] text-xs font-bold border border-[#D5EADB] flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Start Focus Studio</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
