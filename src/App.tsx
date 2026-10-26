import React, { useState } from 'react';
import { PulseProvider, usePulse } from './context/PulseContext';
import { PulseLandingPage } from './components/PulseLandingPage';
import { PersonalSetup } from './components/PersonalSetup';
import { FocusMateDashboard } from './components/FocusMateDashboard';
import { DailyPlannerView } from './components/DailyPlannerView';
import { AssignmentsDatabaseView } from './components/AssignmentsDatabaseView';
import { DistractionFreeModeView } from './components/DistractionFreeModeView';
import { BlockListView } from './components/BlockListView';
import { CalendarView } from './components/CalendarView';
import { GoalsView } from './components/GoalsView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';
import { CommitmentsFeed } from './components/CommitmentsFeed';
import { InsightsView } from './components/InsightsView';
import { RemindersView } from './components/RemindersView';
import { ResourcesView } from './components/ResourcesView';
import { 
  LayoutDashboard, Calendar as CalendarIcon, BookOpen, 
  Shield, Lock, Sparkles, Clock, Settings, 
  Target, Bot, Zap, LogOut, ChevronDown, Bell, Search, Bookmark,
  Maximize2, Plus, CheckCircle2, ChevronRight, Menu, X, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 
  | 'dashboard' 
  | 'planner' 
  | 'commitments'
  | 'database' 
  | 'zen' 
  | 'blocklist' 
  | 'calendar' 
  | 'goals' 
  | 'resources'
  | 'assistant' 
  | 'insights'
  | 'reminders'
  | 'settings' 
  | 'setup';

function PulseApp() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantPrefill, setAssistantPrefill] = useState('');
  const [plannerDate, setPlannerDate] = useState<string | undefined>();
  const { state, logout } = usePulse();

  // App Access Check: allow entering Pulse without requiring authentication
  if (!state.hasEnteredWorkspace && !state.user && state.commitments.length === 0) {
    return <PulseLandingPage />;
  }

  // Personal Setup Guard for fresh onboardings
  if (!state.profile?.hasCompletedSetup && activeTab !== 'setup') {
    return <div id="pulse-workspace" className="workspace-setup"><PersonalSetup onComplete={() => setActiveTab('dashboard')} /></div>;
  }

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const userInitial = state.user?.name 
    ? state.user.name.charAt(0).toUpperCase() 
    : (state.userName ? state.userName.charAt(0).toUpperCase() : 'S');

  const displayName = state.user?.name || state.userName || 'Student';
  const firstName = displayName.trim().split(/\s+/)[0] || 'there';
  const searchResults = searchQuery.trim()
    ? state.commitments.filter(item => [item.title, item.subject, item.type, item.notes].join(' ').toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5)
    : [];

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'database', label: 'Academics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'commitments', label: 'Commitments', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <Clock className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'zen', label: 'Focus Studio', icon: <Shield className="w-4 h-4" /> },
    { id: 'assistant', label: 'Kairo', icon: <Bot className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Zap className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'blocklist', label: 'Block List', icon: <Lock className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div id="pulse-workspace" className="min-h-screen bg-gradient-to-br from-[#E6D4D1] via-[#F2E5DC] to-[#E9DCD3] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans selection:bg-[#7C9070]/20">
      
      {/* Sleek Tablet Frame matching FocusMate Mockup */}
      <div className="workspace-frame w-full max-w-[1400px] h-full min-h-[92vh] bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border-4 sm:border-8 border-slate-900/90 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Subtle camera punch hole at top bezel of tablet */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-800 border border-slate-700/60 z-50 pointer-events-none" />

        {/* LEFT PERSISTENT SIDEBAR matching FocusMate */}
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-50 w-64 bg-[#FCFBF8] border-r border-[#EFECE6] flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-6">
            
            {/* Pulse Brand Header */}
            <div className="flex items-center justify-between">
              <div 
                onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#5E7353] flex items-center justify-center text-white shadow-md shadow-[#5E7353]/30 font-extrabold text-base relative overflow-hidden">
                  <span aria-hidden="true">✳</span>
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-300 rounded-full border border-[#5E7353] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-[#1E2B21]">Pulse</span>
                    <span className="text-[10px] font-mono font-bold bg-[#5E7353]/15 text-[#5E7353] px-1.5 py-0.5 rounded">OS</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E7353] font-bold block leading-none">
                    Academic Focus
                  </span>
                </div>
              </div>

              <div className="workspace-sidebar-greeting">Hi, {firstName}<small>Make today your own.</small></div>

              {/* Close button on mobile */}
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Add Commitment */}
            <button
              onClick={() => { setActiveTab('commitments'); setMobileSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#5E7353] hover:bg-[#506346] text-white rounded-2xl font-bold text-xs shadow-sm shadow-[#5E7353]/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Commitment</span>
            </button>

            {/* Sidebar Navigation */}
            <nav className="workspace-nav">
              <span className="workspace-nav-label">YOUR WORKSPACE</span>
              {navItems.slice(0, 8).map(item => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E7EFE6] text-[#405437] shadow-2xs font-extrabold'
                        : 'text-[#485346] hover:bg-[#F4F2EC] hover:text-[#212C1E]'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#5E7353]' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
              <span className="workspace-nav-label workspace-nav-label-tools">STUDY TOOLS</span>
              {navItems.slice(8).map(item => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as TabType); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${isSelected ? 'bg-[#E7EFE6] text-[#405437] shadow-2xs font-extrabold' : 'text-[#485346] hover:bg-[#F4F2EC] hover:text-[#212C1E]'}`}
                  >
                    <span className={isSelected ? 'text-[#5E7353]' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom user card in sidebar */}
          <div className="pt-4 border-t border-[#EFECE6] space-y-2">
            <button className="sidebar-weekly-nudge" onClick={() => setActiveTab('planner')}><span className="sidebar-nudge-star">✳</span><span><b>A gentle reminder</b><small>One thing at a time is enough.</small></span><span className="sidebar-nudge-sprout" aria-hidden="true">🌱</span></button>
            <div className="flex items-center gap-2.5 p-2 bg-[#F6F4EE] rounded-2xl">
              {state.user?.avatar ? (
                <img
                  src={state.user.avatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-[#E0DCCE]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#E5D5C8] border border-[#D5C5B8] flex items-center justify-center text-xs font-bold text-[#1A1A1B]">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#1E2B21] truncate">{displayName}</p>
                <p className="text-[10px] text-[#5E7353] font-mono truncate">Your study space</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          />
        )}

        {/* RIGHT MAIN APP CANVAS */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5] overflow-y-auto">
          
          {/* Top Header inside Canvas */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#EBE8E0] px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Pulse Breadcrumb Indicator */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="text-[#5E7353] font-extrabold font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5E7353] animate-pulse" />
                  Pulse
                </span>
                <span>/</span>
                <span className="text-slate-700 capitalize font-medium">
                  {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </span>
              </div>

              {/* Universal Search */}
              <div className="relative w-48 sm:w-60 md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search commitments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setActiveTab('commitments');
                      setSearchOpen(false);
                    }
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#FAF9F5] border border-[#E8E4DA] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                />
                {searchOpen && searchQuery.trim() && (
                  <div className="workspace-search-menu">
                    {searchResults.length ? searchResults.map(item => (
                      <button
                        type="button"
                        className="workspace-search-result"
                        key={item.id}
                        onMouseDown={event => event.preventDefault()}
                        onClick={() => { setActiveTab('commitments'); setSearchOpen(false); }}
                      >
                        <Search className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span><b>{item.title}</b><small>{item.subject || item.type} · {item.dueDate || 'No due date'}</small></span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>
                    )) : <div className="workspace-search-empty">No matching commitments found.</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Search, reminders, and focus access */}
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('reminders')} className="workspace-header-icon" aria-label="Open reminders" title="Reminders"><Bell className="w-4 h-4" /></button>

              <button
                onClick={() => setActiveTab('zen')}
                className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Zen Shield</span>
              </button>
            </div>
          </header>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 md:p-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'dashboard' && (
                  <FocusMateDashboard onNavigateToTab={(t, date) => { if (date) setPlannerDate(date); setActiveTab(t as TabType); }} onAskKairo={(message) => { setAssistantPrefill(message); setActiveTab('assistant'); }} />
                )}

                {activeTab === 'planner' && (
                  <DailyPlannerView initialDate={plannerDate} />
                )}

                {activeTab === 'database' && (
                  <AssignmentsDatabaseView />
                )}

                {activeTab === 'zen' && (
                  <DistractionFreeModeView onExit={() => setActiveTab('dashboard')} />
                )}

                {activeTab === 'blocklist' && (
                  <BlockListView />
                )}

                {(activeTab === 'commitments' || (activeTab as string) === 'inbox') && (
                  <CommitmentsFeed initialSearch={searchQuery} />
                )}

                {activeTab === 'calendar' && (
                  <CalendarView />
                )}

                {activeTab === 'goals' && (
                  <GoalsView onAddCommitmentForGoal={() => setActiveTab('commitments')} />
                )}

                {activeTab === 'insights' && <InsightsView />}
                {activeTab === 'resources' && <ResourcesView />}

                {activeTab === 'reminders' && <RemindersView onOpenCommitments={() => setActiveTab('commitments')} />}

                {activeTab === 'assistant' && (
                  <AIAssistantView 
                    onNavigateToTab={(t) => setActiveTab(t)} 
                    initialQuestion={assistantPrefill}
                    onPrefillConsumed={() => setAssistantPrefill('')}
                    onStartFocusTimer={() => setActiveTab('zen')}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsView />
                )}

                {activeTab === 'setup' && (
                  <PersonalSetup onComplete={() => setActiveTab('dashboard')} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        <nav className="workspace-mobile-nav" aria-label="Mobile navigation">
          <button className={activeTab === 'dashboard' ? 'selected' : ''} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} /><span>Home</span></button>
          <button className={activeTab === 'planner' ? 'selected' : ''} onClick={() => setActiveTab('planner')}><Clock size={18} /><span>Plan</span></button>
          <button className={'mobile-kairo-fab' + (activeTab === 'assistant' ? ' selected' : '')} onClick={() => setActiveTab('assistant')} aria-label="Open Kairo"><Bot size={20} /></button>
          <button className={activeTab === 'database' ? 'selected' : ''} onClick={() => setActiveTab('database')}><BookOpen size={18} /><span>Study</span></button>
          <button className={activeTab === 'zen' ? 'selected' : ''} onClick={() => setActiveTab('zen')}><Shield size={18} /><span>Focus</span></button>
        </nav>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <PulseProvider>
      <PulseApp />
    </PulseProvider>
  );
}


