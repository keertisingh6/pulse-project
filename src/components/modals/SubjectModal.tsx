import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Subject, SyllabusUnit } from '../../types';
import { X, BookOpen, Plus, CheckCircle2 } from 'lucide-react';

export const SubjectModal: React.FC = () => {
  const {
    isSubjectModalOpen,
    setIsSubjectModalOpen,
    addSubject,
    showToast
  } = usePulse();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState<'mint' | 'peach' | 'yellow' | 'purple' | 'blue'>('mint');

  if (!isSubjectModalOpen) return null;

  const handleClose = () => {
    setIsSubjectModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast('Please provide subject name and course code', 'warning');
      return;
    }

    const defaultSyllabus: SyllabusUnit[] = [
      {
        id: 'u-1',
        title: 'Unit 1: Fundamentals & Theory',
        topics: [
          { id: 't-1', title: 'Introduction & Core Principles', completed: true, estimatedHours: 2 },
          { id: 't-2', title: 'Architectures & Basic Models', completed: false, estimatedHours: 3 }
        ]
      },
      {
        id: 'u-2',
        title: 'Unit 2: Applied Systems',
        topics: [
          { id: 't-3', title: 'Implementation & Case Studies', completed: false, estimatedHours: 4 }
        ]
      }
    ];

    addSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      credits: Number(credits) || 3,
      instructor: instructor.trim() || 'Faculty Professor',
      color,
      syllabus: defaultSyllabus
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E2621]">Add Academic Subject</h3>
            <p className="text-xs text-[#7A837C]">Add course details, syllabus tracker and credits</p>
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
            <label className="text-xs font-bold text-[#1E2621]">Subject Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Distributed Operating Systems"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Course Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. CSF20107"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Credits</label>
              <input
                type="number"
                min="1"
                max="8"
                value={credits}
                onChange={e => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1E2621]">Instructor / Professor</label>
            <input
              type="text"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              placeholder="e.g. Dr. A. Ramanujan"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1E2621]">Card Accent Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'mint', label: 'Mint', bg: 'bg-[#EAF4EE] text-[#236B43]' },
                { id: 'peach', label: 'Peach', bg: 'bg-[#FDF0ED] text-[#C34E32]' },
                { id: 'yellow', label: 'Yellow', bg: 'bg-[#FEF7E6] text-[#A1741F]' },
                { id: 'purple', label: 'Violet', bg: 'bg-[#F5EEFD] text-[#5344B5]' },
                { id: 'blue', label: 'Sky', bg: 'bg-[#EEF4FF] text-[#256E93]' }
              ].map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    color === c.id ? `${c.bg} border-current ring-2 ring-current/20` : 'bg-[#FBF9F5] text-[#7A837C] border-[#E8E2D5]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-end gap-2">
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
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
