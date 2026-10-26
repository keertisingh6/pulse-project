import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Settings, User, Cpu, Shield, Database, RefreshCw, 
  Check, AlertCircle, Save, Sparkles, Terminal, Download, Calendar, RotateCcw,
} from 'lucide-react';
import { downloadICSFile } from '../utils/icsExport';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  const { 
    state, updateProfile, updateUserName, resetAllData, resetAuth, 
    configureAIProvider, loadDemoData, restoreWorkspaceData,
  } = usePulse();

  // Profile state
  const [name, setName] = useState(state.user?.name || state.userName || '');
  const [college, setCollege] = useState(state.profile.college || '');
  const [branch, setBranch] = useState(state.profile.branch || '');
  const [semester, setSemester] = useState(state.profile.semester || '');
  const [dailyHours, setDailyHours] = useState(state.profile.dailyAvailableHours || 6);
  const [studyRhythm, setStudyRhythm] = useState(state.profile.studyRhythm || 'balanced');

  // AI Provider state
  const [providerType, setProviderType] = useState<'gemini' | 'open_source'>(state.aiProvider || 'gemini');
  const [openEndpoint, setOpenEndpoint] = useState(state.openSourceConfig?.endpoint || 'http://localhost:11434/v1');
  const [openModel, setOpenModel] = useState(state.openSourceConfig?.modelName || 'qwen2.5-vl');
  const [openApiKey, setOpenApiKey] = useState(state.openSourceConfig?.apiKey || '');
  const [providerSaveStatus, setProviderSaveStatus] = useState<string | null>(null);
  const [profileSaveStatus, setProfileSaveStatus] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserName(name.trim());
    updateProfile({
      college: college.trim(),
      branch: branch.trim(),
      semester: semester.trim(),
      dailyAvailableHours: Number(dailyHours),
      studyRhythm: studyRhythm as any,
    });
    setProfileSaveStatus(true);
    setTimeout(() => setProfileSaveStatus(false), 3000);
  };

  const handleSaveAIProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setProviderSaveStatus('Saving...');
    try {
      await configureAIProvider(providerType, {
        endpoint: openEndpoint,
        modelName: openModel,
        apiKey: openApiKey,
      });
      setProviderSaveStatus('Configured successfully!');
      setTimeout(() => setProviderSaveStatus(null), 3000);
    } catch (err: any) {
      setProviderSaveStatus(err.message || 'Failed to update provider');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="settings-page">
      
      {/* Header */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-3 py-0.5 rounded-full">
              System & Workspace
            </span>
          </div>
          <h2 className="font-serif font-light text-2xl md:text-3xl text-[#1A1A1B] mt-1">
            Preferences & Architecture
          </h2>
          <p className="text-xs text-[#1A1A1B]/60 max-w-lg mt-0.5">
            Set up your student profile and AI companion.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-[#7C9070] shadow-xs">
          <Settings className="w-6 h-6" />
        </div>
      </div>

      <section className="demo-data-panel bg-white border border-[#EBE9E0] rounded-[2rem] p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="demo-data-icon w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] uppercase font-bold tracking-[.14em] text-[#7C9070]">Presentation mode</span>
              {state.demoMode && <span className="demo-data-badge">Demo workspace is active</span>}
            </div>
            <h3 className="text-base font-bold text-[#1A1A1B] mt-1">Show Pulse with a complete workspace</h3>
            <p className="text-[11px] text-[#1A1A1B]/60 max-w-2xl mt-1 leading-relaxed">
              Load believable coursework, deadlines, goals, a daily plan, and focus history. Your current workspace is saved on this device and can be restored afterward.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={state.demoMode ? restoreWorkspaceData : loadDemoData}
          className="demo-data-action shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
        >
          {state.demoMode ? <><RotateCcw className="w-3.5 h-3.5" /> Restore my workspace</> : <><Sparkles className="w-3.5 h-3.5" /> Load example data</>}
        </button>
      </section>

      {/* Grid: Student Profile (Left) & AI Provider Abstraction (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Student Academic Profile */}
        <form onSubmit={handleSaveProfile} className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#7C9070]" />
              <h3 className="font-serif font-bold text-sm text-[#1A1A1B]">
                Student & Academic Profile
              </h3>
            </div>
            {profileSaveStatus && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#1A1A1B]/70">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#1A1A1B]/70">University / College</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="Enter your university or college name"
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none focus:border-[#7C9070]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#1A1A1B]/70">Branch / Major</label>
                <input
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1A1A1B]/70">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#1A1A1B]/70">Daily Focus Window</label>
                <div className="flex items-center gap-1 bg-[#FAF9F6] border border-[#EBE9E0] px-3 py-2 rounded-xl">
                  <input
                    type="number"
                    min={2}
                    max={14}
                    value={dailyHours}
                    onChange={e => setDailyHours(Number(e.target.value))}
                    className="w-12 bg-transparent outline-none font-bold"
                  />
                  <span className="text-[#1A1A1B]/40">hours / day</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1A1A1B]/70">Study Rhythm</label>
                <select
                  value={studyRhythm}
                  onChange={e => setStudyRhythm(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl outline-none"
                >
                  <option value="morning">Morning Lark</option>
                  <option value="balanced">Balanced</option>
                  <option value="night">Night Owl</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1A1B] hover:bg-[#1A1A1B]/90 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>

        {/* AI Provider Abstraction Configuration */}
        <form onSubmit={handleSaveAIProvider} className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#7C9070]" />
              <h3 className="font-serif font-bold text-sm text-[#1A1A1B]">
                AI Provider Architecture
              </h3>
            </div>
            {providerSaveStatus && (
              <span className="text-xs text-[#7C9070] font-bold">
                {providerSaveStatus}
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#1A1A1B]/60 leading-relaxed font-sans">
            Pulse cleanly decouples daily planning and companion intelligence so the app works seamlessly with either Google Gemini or any open-weights / open-source model.
          </p>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl">
              <button
                type="button"
                onClick={() => setProviderType('gemini')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  providerType === 'gemini'
                    ? 'bg-white text-[#7C9070] shadow-sm border border-[#EBE9E0]'
                    : 'text-[#1A1A1B]/50 hover:text-[#1A1A1B]'
                }`}
              >
                Google Gemini (Default)
              </button>
              <button
                type="button"
                onClick={() => setProviderType('open_source')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  providerType === 'open_source'
                    ? 'bg-white text-[#7C9070] shadow-sm border border-[#EBE9E0]'
                    : 'text-[#1A1A1B]/50 hover:text-[#1A1A1B]'
                }`}
              >
                Open-Source / Weights
              </button>
            </div>

            {providerType === 'gemini' ? (
              <div className="p-4 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9070] block">
                  Active Provider: Gemini 3.8 Flash
                </span>
                <p className="text-[11px] text-[#1A1A1B]/60">
                  AI companion and intelligent study planning assistant. Managed via server-side environment credentials.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 p-3.5 bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                  Open-Source Model Configuration
                </span>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#1A1A1B]/60">Endpoint URL (OpenAI Compatible API)</label>
                  <input
                    type="text"
                    value={openEndpoint}
                    onChange={e => setOpenEndpoint(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full px-3 py-1.5 bg-white border border-[#EBE9E0] rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#1A1A1B]/60">Model Name (e.g. qwen2.5-vl, llama3.2-vision)</label>
                  <input
                    type="text"
                    value={openModel}
                    onChange={e => setOpenModel(e.target.value)}
                    placeholder="qwen2.5-vl"
                    className="w-full px-3 py-1.5 bg-white border border-[#EBE9E0] rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#1A1A1B]/60">API Key (optional if local)</label>
                  <input
                    type="password"
                    value={openApiKey}
                    onChange={e => setOpenApiKey(e.target.value)}
                    placeholder="Optional or 'none'"
                    className="w-full px-3 py-1.5 bg-white border border-[#EBE9E0] rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Apply AI Provider</span>
            </button>
          </div>
        </form>

      </div>

      {/* Calendar Export & Sync Panel */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Calendar className="w-4 h-4 text-[#7C9070]" />
            <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">
              Calendar Sync & iCalendar (.ics) Export
            </h4>
          </div>
          <p className="text-xs text-[#1A1A1B]/60 max-w-lg leading-relaxed">
            Download your {state.commitments.length} commitments as an RFC-standard <code className="font-mono bg-[#FAF9F6] px-1 py-0.5 rounded text-[#1A1A1B]/80">.ics</code> file to synchronize deadlines, exams, and classes directly with Google Calendar, Apple Calendar, or Microsoft Outlook.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (state.commitments.length === 0) {
                alert("No commitments to export yet. Add some commitments in the Commitments or Assignments database first!");
                return;
              }
              downloadICSFile(state.commitments, 'pulse-academic-schedule.ics');
            }}
            className="flex items-center gap-2 bg-[#7C9070] hover:bg-[#6c7d61] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export iCalendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* Reset & Privacy Panel */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">
            Data Management & Workspace Reset
          </h4>
          <p className="text-xs text-[#1A1A1B]/50">
            Clear all user commitments, goals, and focus logs, or sign out back to login.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all commitments, goals, and focus history? This will reset your workspace data.")) {
                resetAllData();
              }
            }}
            className="px-4 py-2 border border-[#EBE9E0] hover:bg-[#FAF9F6] text-[#1A1A1B]/70 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Clear Workspace Data
          </button>

          <button
            onClick={() => {
              if (confirm("Log out and return to clean Login Page?")) {
                resetAuth();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Sign Out / Reset Auth
          </button>
        </div>
      </div>

    </div>
  );
};

