import React from 'react';
import { PulseProvider, usePulse } from './context/PulseContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { CommitmentsView } from './components/commitments/CommitmentsView';
import { PlannerView } from './components/planner/PlannerView';
import { AcademicsView } from './components/academics/AcademicsView';
import { GrowthView } from './components/growth/GrowthView';
import { FocusStudio } from './components/focus/FocusStudio';
import { KairoStudio } from './components/kairo/KairoStudio';
import { ResourcesView } from './components/resources/ResourcesView';
import { SettingsModal } from './components/settings/SettingsModal';
import { CommandPalette } from './components/common/CommandPalette';
import { LiveFocusCapsule } from './components/common/LiveFocusCapsule';
import { FloatingKairoDrawer } from './components/common/FloatingKairoDrawer';
import { CommitmentModal } from './components/modals/CommitmentModal';
import { GoalModal } from './components/modals/GoalModal';
import { SubjectModal } from './components/modals/SubjectModal';
import { SubjectDetailModal } from './components/modals/SubjectDetailModal';
import { ScheduleModal } from './components/modals/ScheduleModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    toast,
    selectedSubjectForDetail,
    setSelectedSubjectForDetail,
    isNotificationsOpen,
    setIsNotificationsOpen
  } = usePulse();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard />;
      case 'commitments':
        return <CommitmentsView />;
      case 'planner':
        return <PlannerView />;
      case 'academics':
        return <AcademicsView />;
      case 'goals':
        return <GrowthView />;
      case 'focus':
        return <FocusStudio />;
      case 'kairo':
        return <KairoStudio />;
      case 'resources':
        return <ResourcesView />;
      case 'settings':
        return <SettingsModal />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F4EE] overflow-hidden font-sans text-[#1E2621]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {renderView()}
        </main>
      </div>

      {/* Mobile Sticky Navigation */}
      <MobileNav />

      {/* Universal Command Palette (Cmd + K) */}
      <CommandPalette />

      {/* Live Floating Focus Capsule (Mini-Player) */}
      <LiveFocusCapsule />

      {/* Omnipresent Floating Kairo AI Drawer */}
      <FloatingKairoDrawer />

      {/* Interactive Creation & Detail Modals */}
      <CommitmentModal />
      <GoalModal />
      <SubjectModal />
      <SubjectDetailModal
        subject={selectedSubjectForDetail}
        onClose={() => setSelectedSubjectForDetail(null)}
      />
      <ScheduleModal />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-elevated text-xs font-bold text-[#1E2621] animate-in fade-in slide-in-from-bottom-3 duration-300">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#236B43]" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-[#A1741F]" />
          ) : (
            <Info className="w-4 h-4 text-[#256E93]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PulseProvider>
      <MainContent />
    </PulseProvider>
  );
}
