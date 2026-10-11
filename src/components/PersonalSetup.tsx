import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  GraduationCap, Sparkles, Target, Clock, ArrowRight, 
  Check, BookOpen, Sun, Moon, Award, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

const COMMON_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Data Science & AI',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Other / Interdisciplinary',
];

const PRESET_GOALS = [
  { id: 'gate', label: '🎯 GATE 2027', category: 'exam' },
  { id: 'internship', label: '💼 Summer Internship 2026', category: 'career' },
  { id: 'gpa', label: '🎓 B.Tech College GPA (9.0+)', category: 'academic' },
  { id: 'fullstack', label: '📚 Full Stack & AI Skills', category: 'skill' },
  { id: 'dsa', label: '💻 DSA & Competitive Programming', category: 'skill' },
  { id: 'gre', label: '✈️ MS Abroad / GRE 2027', category: 'exam' },
];

export const PersonalSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, updateProfile } = usePulse();
  const [step, setStep] = useState<1 | 2>(1);

  const [college, setCollege] = useState(state.profile.college || '');
  const [collegeError, setCollegeError] = useState<string | null>(null);
  const [branch, setBranch] = useState(state.profile.branch || '');
  const [semester, setSemester] = useState(state.profile.semester || '');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(state.profile.targetGoals || []);
  const [studyRhythm, setStudyRhythm] = useState<'morning' | 'night' | 'balanced'>(state.profile.studyRhythm || 'balanced');
  const [focusBlockMinutes, setFocusBlockMinutes] = useState(state.profile.focusBlockMinutes || 45);
  const [dailyAvailableHours, setDailyAvailableHours] = useState(state.profile.dailyAvailableHours || 6);

  const toggleGoal = (goalLabel: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalLabel)
        ? prev.filter(g => g !== goalLabel)
        : [...prev, goalLabel]
    );
  };

  const handleNextStep = () => {
    const trimmedCollege = college.trim();
    if (!trimmedCollege) {
      setCollegeError('Please enter your university or college name.');
      return;
    }
    setCollegeError(null);
    setStep(2);
  };

  const handleFinish = () => {
    const trimmedCollege = college.trim();
    if (!trimmedCollege) {
      setStep(1);
      setCollegeError('Please enter your university or college name.');
      return;
    }
    updateProfile({
      college: trimmedCollege,
      branch: branch.trim(),
      semester: semester.trim(),
      targetGoals: selectedGoals,
      studyRhythm,
      focusBlockMinutes,
      dailyAvailableHours,
      hasCompletedSetup: true,
    });
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#EBE9E0] rounded-[2rem] p-8 shadow-sm space-y-8"
      >
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#7C9070]/10 text-[#7C9070] flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C9070] bg-[#7C9070]/10 px-3 py-1 rounded-full">
            Step {step} of 2 • Student Life Profile
          </span>
          <h2 className="font-serif font-light text-2xl md:text-3xl text-[#1A1A1B]">
            {step === 1 ? "Let's calibrate your academic realm." : "Your study rhythm & targets."}
          </h2>
          <p className="text-xs text-[#1A1A1B]/60 max-w-md mx-auto">
            {step === 1 
              ? "Pulse customizes commitments, exam reminders, and assignment deadlines around your college context." 
              : "Tell Kairo how you prefer to focus so it never generates unrealistic, suffocating daily plans."}
          </p>
        </div>

        {/* Step 1: Academic details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1A1B]/70 block">
                University / College <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={e => {
                  setCollege(e.target.value);
                  if (collegeError && e.target.value.trim()) {
                    setCollegeError(null);
                  }
                }}
                placeholder="Enter your university or college name"
                className={`w-full px-4 py-2.5 text-xs bg-[#FAF9F6] border rounded-xl outline-none text-[#1A1A1B] font-medium transition-colors ${
                  collegeError ? 'border-red-400 focus:border-red-500' : 'border-[#EBE9E0] focus:border-[#7C9070]'
                }`}
              />
              {collegeError && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{collegeError}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1B]/70 block">Branch / Major</label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none focus:border-[#7C9070] text-[#1A1A1B] font-medium"
                >
                  <option value="">Select Branch / Major</option>
                  {COMMON_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1B]/70 block">Current Year / Semester</label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none focus:border-[#7C9070] text-[#1A1A1B] font-medium"
                >
                  <option value="">Select Semester</option>
                  {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester', 'Final Year / Graduating'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Goals Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-[#1A1A1B]/70 block">
                What are your key focuses this year? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_GOALS.map(g => {
                  const isSelected = selectedGoals.includes(g.label);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.label)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C9070]/10 border-[#7C9070] text-[#7C9070] font-semibold shadow-xs'
                          : 'bg-[#FAF9F6] border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#F5F1E9]'
                      }`}
                    >
                      <span>{g.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#7C9070]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#EBE9E0]">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!college.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  college.trim()
                    ? 'bg-[#7C9070] hover:bg-[#6c7d61] text-white cursor-pointer'
                    : 'bg-[#7C9070]/40 text-white cursor-not-allowed'
                }`}
              >
                <span>Continue to Rhythm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Rhythm & Planning preferences */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Study Rhythm */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1B]/70 block">Peak Study Rhythm</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'morning', label: 'Morning Lark', icon: <Sun className="w-4 h-4 text-amber-500" />, desc: 'Fresh energy at dawn' },
                  { id: 'balanced', label: 'Balanced', icon: <Sparkles className="w-4 h-4 text-emerald-500" />, desc: 'Spread throughout afternoon' },
                  { id: 'night', label: 'Night Owl', icon: <Moon className="w-4 h-4 text-indigo-500" />, desc: 'Deep focus past 8 PM' },
                ].map(r => {
                  const isSelected = studyRhythm === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setStudyRhythm(r.id as any)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C9070]/10 border-[#7C9070] text-[#7C9070] font-bold shadow-xs'
                          : 'bg-[#FAF9F6] border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#F5F1E9]'
                      }`}
                    >
                      {r.icon}
                      <span className="text-xs">{r.label}</span>
                      <span className="text-[10px] text-[#1A1A1B]/40">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily available focus hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1A1A1B]/70">Available Daily Study / Deep Work Hours</span>
                <span className="font-bold text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-0.5 rounded-full">{dailyAvailableHours} hours / day</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={dailyAvailableHours}
                onChange={e => setDailyAvailableHours(Number(e.target.value))}
                className="w-full accent-[#7C9070] cursor-pointer"
              />
              <p className="text-[10px] text-[#1A1A1B]/40">
                Pulse will warn you if assignment deadlines or prep time require more hours than your daily quota.
              </p>
            </div>

            {/* Focus block preset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1B]/70 block">Preferred Single Study Sprint</label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFocusBlockMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      focusBlockMinutes === mins
                        ? 'bg-[#7C9070] border-[#7C9070] text-white shadow-sm'
                        : 'bg-[#FAF9F6] border-[#EBE9E0] text-[#1A1A1B]/70 hover:bg-[#F5F1E9]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EBE9E0]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#1A1A1B]/60 hover:text-[#1A1A1B] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-7 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enter Pulse</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
