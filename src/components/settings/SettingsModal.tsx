import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Settings,
  Sparkles,
  Key,
  User,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle2
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    profile,
    updateProfile,
    resetToSampleData,
    clearAllData,
    showToast,
    commitments,
    tasks,
    subjects,
    goals,
    habits,
    plannerBlocks
  } = usePulse();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [semester, setSemester] = useState(profile.semester);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyFocusGoalMinutes);
  const [apiKey, setApiKey] = useState(profile.geminiApiKey || '');
  const [aiModel, setAiModel] = useState(profile.aiModel || 'gemini-1.5-flash');

  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      title: title.trim(),
      semester: semester.trim(),
      dailyFocusGoalMinutes: Number(dailyGoal) || 120,
      geminiApiKey: apiKey.trim(),
      aiModel
    });
    showToast('Settings saved successfully', 'success');
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key first', 'warning');
      return;
    }
    setIsTestingKey(true);
    setKeyStatus('idle');

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Reply with "OK"' }] }]
        })
      });

      if (res.ok) {
        setKeyStatus('success');
        showToast('Google Gemini API Key verified!', 'success');
      } else {
        setKeyStatus('error');
        showToast('Invalid API key', 'warning');
      }
    } catch (e) {
      setKeyStatus('error');
      showToast('Offline mode active. Using Intelligent Local Fallback Engine.', 'info');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleExportData = () => {
    const backup = {
      profile,
      commitments,
      tasks,
      subjects,
      goals,
      habits,
      plannerBlocks,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-student-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup downloaded', 'success');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-serif text-[#1E2621]">Settings & Configuration</h2>
        <p className="text-xs text-[#6E7570] mt-0.5 font-sans">
          Customize your student profile, configure AI provider, and manage local data.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2ECE1]">
            <User className="w-5 h-5 text-[#1E3A2B]" />
            <div>
              <h3 className="text-sm font-bold text-[#1E2621]">Student Profile</h3>
              <p className="text-xs text-[#8C958E]">Personalize greetings and semester goals</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
                  Degree / Year
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-semibold text-[#1E2621] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* AI Companion Settings */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2ECE1]">
            <Sparkles className="w-5 h-5 text-[#1E3A2B]" />
            <div>
              <h3 className="text-sm font-bold text-[#1E2621]">Kairo AI Intelligence Provider</h3>
              <p className="text-xs text-[#8C958E]">Google Gemini API key or intelligent local engine</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E2621] uppercase tracking-wider mb-1.5">
                Google Gemini API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E3DDD0] text-xs font-mono text-[#1E2621] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTestApiKey}
                  disabled={isTestingKey || !apiKey.trim()}
                  className="px-4 py-2 rounded-xl bg-[#EDE9DF] text-[#1E2621] text-xs font-bold disabled:opacity-40"
                >
                  {isTestingKey ? 'Verifying...' : 'Test Key'}
                </button>
              </div>
              {keyStatus === 'success' && (
                <p className="text-[11px] text-[#236B43] mt-1.5 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  API key is valid and connected!
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
              >
                Update AI Config
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2ECE1]">
            <RotateCcw className="w-5 h-5 text-[#1E3A2B]" />
            <div>
              <h3 className="text-sm font-bold text-[#1E2621]">Workspace Data Management</h3>
              <p className="text-xs text-[#8C958E]">Reset to demo data or export backup</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={resetToSampleData}
              className="p-4 rounded-2xl bg-[#EAF4EE] border border-[#D5EADB] text-left hover:bg-[#DEEFE4] transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#236B43] mb-2" />
              <h4 className="text-xs font-bold text-[#1E2621]">Reset Sample Data</h4>
              <p className="text-[11px] text-[#6E7570] mt-0.5">
                Reload exact student schedule and commitments from demo.
              </p>
            </button>

            <button
              onClick={handleExportData}
              className="p-4 rounded-2xl bg-[#EBF5FA] border border-[#D3E8F5] text-left hover:bg-[#DFEFF8] transition-all"
            >
              <Download className="w-4 h-4 text-[#256E93] mb-2" />
              <h4 className="text-xs font-bold text-[#1E2621]">Export Backup</h4>
              <p className="text-[11px] text-[#6E7570] mt-0.5">
                Download workspace as JSON backup.
              </p>
            </button>

            <button
              onClick={clearAllData}
              className="p-4 rounded-2xl bg-[#FDF0ED] border border-[#F6DCD6] text-left hover:bg-[#FCE5E0] transition-all"
            >
              <Trash2 className="w-4 h-4 text-[#C34E32] mb-2" />
              <h4 className="text-xs font-bold text-[#C34E32]">Clear All Data</h4>
              <p className="text-[11px] text-[#8C958E] mt-0.5">
                Wipe all records for a clean slate.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
