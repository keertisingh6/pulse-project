import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Settings, User, Cpu, Shield, Database, RefreshCw, 
  Check, AlertCircle, Save, Sparkles, Terminal, Download, Calendar,
  MessageSquareQuote, BookOpen, Smile, AlertTriangle, Eye, Play
} from 'lucide-react';
import { downloadICSFile } from '../utils/icsExport';
import { INDIAN_MEME_LIBRARY, MemeReference } from '../data/indianMemeLibrary';
import { evaluateSituationAndSelectMeme, MemeEvaluationResult, MemePersonalityMode } from '../utils/memeEngine';
import { memeManager } from '../services/memeManager';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  const { 
    state, updateProfile, updateUserName, resetAllData, resetAuth, 
    configureAIProvider, setMemePersonalityMode 
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

  // Meme Personality state
  const currentMemeMode = state.memePersonalityMode || 'college_friend';
  const [selectedMeme, setSelectedMeme] = useState<MemeReference>(INDIAN_MEME_LIBRARY[0]);
  const [testScenario, setTestScenario] = useState<string>('overloaded');
  const [simResult, setSimResult] = useState<MemeEvaluationResult | null>(() => {
    return evaluateSituationAndSelectMeme({
      query: "I have 12 hours of assignments planned for tonight",
      activeCommitmentsCount: 8,
      urgentCommitmentsCount: 5,
      overdueCount: 0,
      totalPlannedHours: 11,
      streakDays: 3,
      personalityMode: 'college_friend',
      sourceScreen: 'chat'
    });
  });

  const [cooldowns, setCooldowns] = useState(() => memeManager.getCooldownStatus());

  const refreshCooldowns = () => {
    setCooldowns(memeManager.getCooldownStatus());
  };

  const handleResetCooldowns = () => {
    memeManager.resetCooldowns();
    refreshCooldowns();
  };

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

  const runSimulation = (scenarioKey: string) => {
    setTestScenario(scenarioKey);
    let ctx = {
      query: "",
      activeCommitmentsCount: 3,
      urgentCommitmentsCount: 1,
      overdueCount: 0,
      totalPlannedHours: 4,
      streakDays: 4,
      hasConflicts: false,
      allTodayTasksCompleted: false,
      personalityMode: currentMemeMode,
      sourceScreen: 'chat' as const
    };

    switch (scenarioKey) {
      case 'overloaded':
        ctx.query = "I scheduled 10 assignments and plan to pull an all-nighter for 12 hours";
        ctx.totalPlannedHours = 12;
        ctx.urgentCommitmentsCount = 6;
        break;
      case 'all_done':
        ctx.query = "I just finished all my assignments for today!";
        ctx.allTodayTasksCompleted = true;
        ctx.activeCommitmentsCount = 0;
        ctx.streakDays = 5;
        break;
      case 'coding_bug':
        ctx.query = "Why won't this C++ compiler code work? I keep getting segmentation fault!";
        break;
      case 'procrastination':
        ctx.query = "Deadline is tomorrow at 8 AM, but I am organizing my Notion files instead";
        ctx.overdueCount = 2;
        break;
      case 'conflict':
        ctx.query = "I have a lab and an economics class scheduled at the exact same 2:00 PM time";
        ctx.hasConflicts = true;
        break;
      case 'serious_stress':
        ctx.query = "I am having severe anxiety attack and feeling completely hopeless about college";
        break;
      case 'binod':
        ctx.query = "binod";
        break;
      default:
        ctx.query = "What should I work on today?";
        break;
    }

    const res = evaluateSituationAndSelectMeme(ctx);
    setSimResult(res);
    refreshCooldowns();
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
            Configure your student identity, Indian meme personality system, and underlying multimodal AI engine.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center text-[#7C9070] shadow-xs">
          <Settings className="w-6 h-6" />
        </div>
      </div>

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

      {/* AUTHENTIC INDIAN MEME PERSONALITY SYSTEM PANEL */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6" id="meme-system-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE9E0] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20">
                Authentic Desi Personality System
              </span>
              <span className="text-xs text-[#1A1A1B]/40 font-mono">
                12 Curated Cultural References
              </span>
            </div>
            <h3 className="font-serif font-light text-2xl text-[#1A1A1B]">
              Campus Buddy & Desi Internet Personality
            </h3>
            <p className="text-xs text-[#1A1A1B]/65 max-w-2xl leading-relaxed">
              Pulse feels like that one Indian college friend who actually knows the internet. References only real, established desi meme formats (Dekh Raha Hai Vinod, Pawri, Rasode Mein Kaun Tha, Control Uday Control, Moye Moye, Kolaveri Di). Humor is secondary to productivity; serious situations remain strictly supportive.
            </p>
          </div>

          {/* Personality Mode Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#EBE9E0] p-1.5 rounded-2xl shrink-0">
            {(['off', 'college_friend', 'full_desi'] as MemePersonalityMode[]).map((mode) => {
              const active = currentMemeMode === mode;
              const labels: Record<string, string> = {
                off: 'Off (Neutral)',
                college_friend: 'Campus Buddy (Default)',
                full_desi: 'Hostelite (Spicy)',
              };
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMemePersonalityMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active 
                      ? 'bg-white text-[#7C9070] shadow-sm border border-[#EBE9E0]' 
                      : 'text-[#1A1A1B]/50 hover:text-[#1A1A1B]'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Meme Library Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-[#1A1A1B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#7C9070]" />
              <span>Curated Meme Reference Library</span>
            </h4>
            <span className="text-[11px] text-[#1A1A1B]/40 font-mono">
              Click a card to inspect origin, situational rules & microcopy
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {INDIAN_MEME_LIBRARY.map((meme) => {
              const isSelected = selectedMeme.id === meme.id;
              return (
                <button
                  key={meme.id}
                  type="button"
                  onClick={() => setSelectedMeme(meme)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7C9070]/10 border-[#7C9070] shadow-xs'
                      : 'bg-[#FAF9F6] border-[#EBE9E0] hover:border-[#7C9070]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#1A1A1B]/40 uppercase">
                      {meme.tone}
                    </span>
                    <span className="text-[9px] font-bold text-[#7C9070] bg-[#7C9070]/10 px-1.5 py-0.5 rounded">
                      {meme.languageStyle}
                    </span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-[#1A1A1B] mt-1 line-clamp-1">
                    {meme.memeName}
                  </h5>
                  <p className="text-[10px] text-[#1A1A1B]/50 line-clamp-1 mt-0.5">
                    {meme.origin}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Meme Detail Inspector */}
          {selectedMeme && (
            <div className="bg-[#FAF9F6] border border-[#EBE9E0] rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE9E0] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-serif font-bold text-base text-[#1A1A1B]">
                      {selectedMeme.memeName}
                    </h5>
                    <span className="text-[10px] bg-[#7C9070]/10 text-[#7C9070] px-2 py-0.5 rounded-full font-bold">
                      Cooldown: {selectedMeme.cooldownMinutes}m
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1A1A1B]/60 mt-0.5">
                    <strong>Origin / Context:</strong> {selectedMeme.origin}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedMeme.allowedInChat ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    Chat: {selectedMeme.allowedInChat ? 'Yes' : 'No'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedMeme.allowedInUiMicrocopy ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    UI Microcopy: {selectedMeme.allowedInUiMicrocopy ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-bold text-[#1A1A1B]/70 block">
                    ✓ Suitable Situations (When to use):
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#1A1A1B]/70 text-[11px]">
                    {selectedMeme.suitableSituations.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-rose-700 block">
                    ✕ Unsuitable Situations (Forbidden contexts):
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-rose-900/70 text-[11px]">
                    {selectedMeme.unsuitableSituations.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#EBE9E0] rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9070] block">
                  Authentic Sample Delivery & Microcopy
                </span>
                <p className="text-[11px] text-[#1A1A1B]/80 italic">
                  <strong>Chat Delivery:</strong> "{selectedMeme.samplePhrases.punchline}"
                </p>
                <p className="text-[11px] text-[#1A1A1B]/80 font-mono">
                  <strong>UI Badge/Microcopy:</strong> "{selectedMeme.samplePhrases.microcopy}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Context-Aware Personality Engine Simulator */}
        <div className="space-y-4 pt-2 border-t border-[#EBE9E0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-600" />
              <h4 className="font-serif font-bold text-sm text-[#1A1A1B]">
                Context-Aware Personality Engine Simulator
              </h4>
            </div>
            <span className="text-[11px] text-[#1A1A1B]/50 font-sans">
              Test context selection and safety checks
            </span>
          </div>

          {/* Test buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overloaded', label: 'Overloaded 12h Schedule' },
              { id: 'all_done', label: 'All Tasks Completed' },
              { id: 'coding_bug', label: 'Compiler Bug Loop' },
              { id: 'procrastination', label: 'Overdue / Delaying' },
              { id: 'conflict', label: 'Schedule Clash' },
              { id: 'serious_stress', label: '🚨 Panic / Emotional Distress' },
              { id: 'binod', label: 'Mystery Input (Binod)' },
            ].map(tc => (
              <button
                key={tc.id}
                type="button"
                onClick={() => runSimulation(tc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  testScenario === tc.id
                    ? 'bg-[#1A1A1B] text-white border-[#1A1A1B]'
                    : 'bg-[#FAF9F6] border-[#EBE9E0] text-[#1A1A1B]/70 hover:border-[#7C9070]'
                }`}
              >
                {tc.label}
              </button>
            ))}
          </div>

          {/* Output reasoning box */}
          {simResult && (
            <div className="bg-[#FAF9F6] border border-[#EBE9E0] rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EBE9E0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A1A1B]">Pipeline Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${simResult.isSeriousSituation ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {simResult.isSeriousSituation ? 'Safety Veto Active (Humor Suppressed)' : 'Safe Context Evaluated'}
                  </span>
                </div>
                {simResult.matchedMeme && (
                  <span className="font-mono text-[11px] text-[#7C9070] font-bold">
                    Matched: {simResult.matchedMeme.memeName}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#1A1A1B]/40 block">
                  Selection Pipeline Reasoning
                </span>
                <p className="text-[11px] text-[#1A1A1B]/70">
                  {simResult.reason}
                </p>
              </div>

              <div className="space-y-1 p-3 bg-white border border-[#EBE9E0] rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#7C9070] block">
                  Simulated Assistant Output
                </span>
                {simResult.humorSnippet && (
                  <blockquote className="border-l-2 border-amber-500 pl-2 text-amber-900 italic font-medium mb-1">
                    "{simResult.humorSnippet}"
                  </blockquote>
                )}
                <p className="text-[11px] text-[#1A1A1B]/80 leading-relaxed font-sans">
                  {simResult.actionableGuidance}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MemeManager Service Cooldown Monitor & Text Policy */}
        <div className="space-y-3 pt-4 border-t border-[#EBE9E0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1A1A1B]">
                  MemeManager Cooldown Monitor
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  Zero Hard-Coded Images • Pure Text Reactions
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A1B]/60">
                Enforces cooldown intervals per cultural reference to prevent spamming and maintain supportive productivity.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetCooldowns}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F3EFE6] border border-[#EBE9E0] text-[#1A1A1B]/70 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
              title="Reset all cooldown timers"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7C9070]" />
              <span>Reset Cooldowns</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
            {INDIAN_MEME_LIBRARY.map((meme) => {
              const info = cooldowns[meme.id];
              const isOnCooldown = info?.isOnCooldown ?? false;
              const remaining = info?.remainingMinutes ?? 0;

              return (
                <div
                  key={meme.id}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isOnCooldown
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : 'bg-white border-[#EBE9E0] text-[#1A1A1B]/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold truncate">
                      {meme.memeName}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                        isOnCooldown
                          ? 'bg-amber-200/80 text-amber-900 font-bold'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isOnCooldown ? `${remaining}m left` : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-[#1A1A1B]/50 font-mono">
                    <span>{meme.tone}</span>
                    <span>{meme.cooldownMinutes}m rule</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
