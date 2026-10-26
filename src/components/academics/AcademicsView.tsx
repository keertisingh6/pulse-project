import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Subject } from '../../types';
import {
  Monitor,
  Shield,
  Database,
  Brain,
  Share2,
  FileText,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Calendar,
  Clock,
  Download,
  BookOpen,
  Archive,
  Star,
  CheckCircle2,
  Plus,
  Calculator,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AcademicsView: React.FC = () => {
  const {
    subjects,
    setSelectedSubjectForDetail,
    setIsSubjectModalOpen,
    setCurrentView,
    toggleTopicCompletion,
    showToast
  } = usePulse();

  const [activeTab, setActiveTab] = useState<'subjects' | 'notes' | 'syllabus' | 'papers' | 'resources' | 'marks'>('subjects');
  const [selectedSemester, setSelectedSemester] = useState('Fall 2026 • Sem 5');
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);

  // Subject icon mapping
  const getSubjectIcon = (idx: number) => {
    const icons = [Monitor, Shield, Database, Brain, Share2, FileText];
    return icons[idx % icons.length];
  };

  const getSubjectColorStyles = (idx: number) => {
    const styles = [
      { color: 'bg-[#EAF4EE]', borderColor: 'border-[#D5EADB]', iconColor: 'text-[#236B43]', ringColor: '#1E3A2B' },
      { color: 'bg-[#FDF0ED]', borderColor: 'border-[#F6DCD6]', iconColor: 'text-[#C34E32]', ringColor: '#C34E32' },
      { color: 'bg-[#FEF7E6]', borderColor: 'border-[#F6E6BF]', iconColor: 'text-[#A1741F]', ringColor: '#1E3A2B' },
      { color: 'bg-[#F5EEFD]', borderColor: 'border-[#E3D1F7]', iconColor: 'text-[#5344B5]', ringColor: '#7B68EE' },
      { color: 'bg-[#EBF5FA]', borderColor: 'border-[#D3E8F5]', iconColor: 'text-[#256E93]', ringColor: '#1E3A2B' },
      { color: 'bg-[#FAF0E6]', borderColor: 'border-[#EFE1D2]', iconColor: 'text-[#C34E32]', ringColor: '#C34E32' }
    ];
    return styles[idx % styles.length];
  };

  // Timetable
  const todayClasses = [
    { timeStart: '8:00 AM', timeEnd: '9:00 AM', title: 'Data Structures', type: 'Lecture', typeColor: 'bg-[#EAF4EE] text-[#236B43]', topic: 'Stacks and Queues' },
    { timeStart: '10:00 AM', timeEnd: '11:00 AM', title: 'Cyber Security', type: 'Lecture', typeColor: 'bg-[#FDF0ED] text-[#C34E32]', topic: 'Network Security Basics' },
    { timeStart: '12:00 PM', timeEnd: '2:00 PM', title: 'PBL-III Lab', type: 'Lab', typeColor: 'bg-[#FDF0ED] text-[#C34E32]', topic: 'AVL Tree Implementation' },
    { timeStart: '4:00 PM', timeEnd: '5:00 PM', title: 'DBMS', type: 'Tutorial', typeColor: 'bg-[#FEF7E6] text-[#A1741F]', topic: 'Normalization Normal Forms' }
  ];

  // Assessments
  const assessments = [
    { id: 'as-1', title: 'DSA Assignment 5', type: 'Assignment', priority: 'High', priorityColor: 'bg-[#FDF0ED] text-[#C34E32]', date: '13 Oct 2025', hours: '2h', iconColor: 'bg-[#EAF4EE] text-[#236B43]' },
    { id: 'as-2', title: 'PBL-III Lab Report', type: 'Lab', priority: 'Medium', priorityColor: 'bg-[#FEF7E6] text-[#A1741F]', date: '27 Oct 2025', hours: '4h', iconColor: 'bg-[#F0EFFE] text-[#5344B5]' },
    { id: 'as-3', title: 'SE Midterm Exam', type: 'Exam', priority: 'High', priorityColor: 'bg-[#FDF0ED] text-[#C34E32]', date: '3 Nov 2025', hours: '5h', iconColor: 'bg-[#FDF0ED] text-[#C34E32]' }
  ];

  // Notes data
  const lectureNotes = [
    { id: 'n-1', title: 'DSA Unit 2: Self Balancing Trees & AVL Rotations', subject: 'Data Structures', date: 'Oct 2026', size: '2.4 MB', reads: '142 students' },
    { id: 'n-2', title: 'Cyber Security: Public Key Infrastructure & RSA Algorithm', subject: 'Cyber Security', date: 'Oct 2026', size: '1.8 MB', reads: '98 students' },
    { id: 'n-3', title: 'DBMS: Relational Algebra & 3NF vs BCNF Decomposition', subject: 'DBMS', date: 'Sep 2026', size: '3.1 MB', reads: '215 students' },
    { id: 'n-4', title: 'AI & ML: Gradient Descent, Learning Rates & Loss Curves', subject: 'AI & ML', date: 'Oct 2026', size: '4.5 MB', reads: '180 students' }
  ];

  // Past Papers data
  const pastPapers = [
    { id: 'pp-1', year: '2025', exam: 'End-Semester', subject: 'Data Structures (CSF20101)', difficulty: 'Moderate', solved: true },
    { id: 'pp-2', year: '2024', exam: 'Mid-Semester', subject: 'Cyber Security (CSF20102)', difficulty: 'Challenging', solved: true },
    { id: 'pp-3', year: '2024', exam: 'End-Semester', subject: 'Database Management Systems (CSF20103)', difficulty: 'Easy-Moderate', solved: false },
    { id: 'pp-4', year: '2023', exam: 'Quiz 2', subject: 'Software Engineering (CSF20106)', difficulty: 'Moderate', solved: true }
  ];

  // Marks & CGPA Calculator state
  const [courseGrades, setCourseGrades] = useState<Record<string, number>>({
    'CSF20101': 9,
    'CSF20102': 8,
    'CSF20103': 10,
    'CSF20104': 9,
    'CSF20105': 8,
    'CSF20106': 8
  });

  const calculatedSGPA = (
    Object.values(courseGrades).reduce((acc, g) => acc + g * 4, 0) / (Object.keys(courseGrades).length * 4)
  ).toFixed(2);

  // Calculate overall syllabus progress
  const totalTopics = subjects.reduce(
    (acc, s) => acc + s.syllabus.reduce((uAcc, u) => uAcc + u.topics.length, 0),
    0
  );
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.syllabus.reduce((uAcc, u) => uAcc + u.topics.filter(t => t.completed).length, 0),
    0
  );
  const syllabusProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 53;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title, semester selector & Add Subject button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight flex items-center gap-2">
            <span>Academics</span>
            <svg viewBox="0 0 24 24" className="w-8 h-8 inline-block fill-[#3D5A45]" style={{ transform: 'rotate(-15deg)' }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C12 19 19 16 21 8C20 8 19 8 17 8Z" />
              <path d="M3 21C6 15 10 12 17 8" stroke="#F4EFE6" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Your subjects, syllabus, notes and academics in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Semester Selector */}
          <div className="relative">
            <button
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2621] bg-white px-3.5 py-2 rounded-2xl border border-[#E8E2D5] shadow-2xs hover:bg-[#FBF9F5]"
            >
              <span>{selectedSemester}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E7570]" />
            </button>

            {isSemesterDropdownOpen && (
              <div className="absolute right-0 top-10 z-20 w-44 bg-white rounded-2xl shadow-elevated border border-[#E8E2D5] p-1 space-y-0.5">
                {['Fall 2026 • Sem 5', 'Spring 2026 • Sem 4', 'Fall 2025 • Sem 3'].map(sem => (
                  <button
                    key={sem}
                    onClick={() => { setSelectedSemester(sem); setIsSemesterDropdownOpen(false); showToast(`Switched to ${sem}`, 'info'); }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#FBF9F5]"
                  >
                    {sem}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'subjects', label: `Subjects (${subjects.length})` },
          { id: 'notes', label: 'Class Notes' },
          { id: 'syllabus', label: 'Syllabus Tracker' },
          { id: 'papers', label: 'Previous Papers' },
          { id: 'resources', label: 'Formulas & Cheat Sheets' },
          { id: 'marks', label: 'Marks & CGPA' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#1E3A2B] text-white shadow-xs'
                : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SUBJECTS MAIN VIEW */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {/* 6 Subject Cards in 1 Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {subjects.map((subj, idx) => {
              const Icon = getSubjectIcon(idx);
              const styles = getSubjectColorStyles(idx);
              const sTotal = subj.syllabus.reduce((acc, u) => acc + u.topics.length, 0);
              const sDone = subj.syllabus.reduce((acc, u) => acc + u.topics.filter(t => t.completed).length, 0);
              const progress = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 50;

              const circumference = 2 * Math.PI * 14;
              const strokeDashoffset = circumference - (progress / 100) * circumference;

              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubjectForDetail(subj)}
                  className={`p-3.5 rounded-3xl ${styles.color} border ${styles.borderColor} shadow-2xs hover:shadow-card transition-all flex flex-col justify-between h-48 cursor-pointer group`}
                  title="Click to view full syllabus breakdown"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                      <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                    </div>
                    <span className="text-xs text-[#A4AAA6] group-hover:text-[#1E2621]">···</span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#1E2621] leading-tight line-clamp-1">
                      {subj.name}
                    </h4>
                    <p className="text-[10px] text-[#7A837C] font-mono">{subj.code}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle cx="20" cy="20" r="14" stroke="#EDE8DE" strokeWidth="3.2" fill="none" />
                        <circle
                          cx="20"
                          cy="20"
                          r="14"
                          stroke={styles.ringColor}
                          strokeWidth="3.2"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-[#1E2621]">
                        {progress}%
                      </span>
                    </div>

                    <span className="text-[10px] text-[#7A837C] font-medium leading-tight">
                      {sDone}/{sTotal} topics
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lower Section: Left Timetable (7 cols) + Right Assessments & Quick Links (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Today's Subjects Card */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h3 className="text-base font-bold text-[#1E2621]">
                  Today's Subjects <span className="text-xs font-normal text-[#7A837C]">Mon, 27 Oct 2025</span>
                </h3>
                <button
                  onClick={() => setCurrentView('planner')}
                  className="text-xs font-semibold text-[#5A635C] hover:text-[#1E3A2B] flex items-center gap-0.5 group"
                >
                  <span>View Timetable</span>
                  <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>

              <div className="space-y-2.5 pt-1">
                {todayClasses.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentView('planner');
                      showToast(`Showing timetable slot: ${item.title}`, 'info');
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE] group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="text-[11px] font-mono text-[#7A837C] leading-tight flex-shrink-0">
                        <span className="block font-bold text-[#1E2621] whitespace-nowrap">{item.timeStart}</span>
                        <span className="block text-[#A4AAA6] whitespace-nowrap">{item.timeEnd}</span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors whitespace-nowrap truncate">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${item.typeColor}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#7A837C] whitespace-nowrap">
                        <FileText className="w-3.5 h-3.5 text-[#A4AAA6]" />
                        <span className="truncate max-w-[120px] sm:max-w-xs">{item.topic}</span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#A4AAA6] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 cols): Upcoming Assessments + Syllabus Progress + Quick Links */}
            <div className="lg:col-span-5 space-y-4">
              {/* Upcoming Assessments Card */}
              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                  <h3 className="text-base font-bold text-[#1E2621]">Upcoming Assessments</h3>
                  <button
                    onClick={() => setCurrentView('commitments')}
                    className="text-xs text-[#58615A] hover:text-[#1E3A2B] flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <span className="text-xs">→</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {assessments.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentView('commitments')}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs ${item.iconColor}`}>
                          <FileText className="w-3.5 h-3.5" />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#1E2621] leading-tight">{item.title}</h4>
                          <span className="text-[10px] text-[#A4AAA6]">{item.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.priorityColor}`}>
                          {item.priority}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-[#7A837C] font-mono">
                          <Calendar className="w-3 h-3 text-[#A4AAA6]" />
                          <span>{item.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-[#7A837C] font-mono">
                          <Clock className="w-3 h-3 text-[#A4AAA6]" />
                          <span>{item.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Split: Syllabus Progress & Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left mini-card: Syllabus Progress */}
                <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1E2621]">Syllabus Progress</h4>
                    <span className="text-xs font-bold text-[#1E2621]">{syllabusProgress}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1E3A2B] transition-all duration-500"
                      style={{ width: `${syllabusProgress}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-[#7A837C]">
                    {completedTopics} of {totalTopics} topics completed
                  </p>
                </div>

                {/* Right mini-card: Quick Links (4 grid buttons) */}
                <div className="p-4 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-2">
                  <h4 className="text-xs font-bold text-[#1E2621]">Quick Links</h4>

                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    <button
                      onClick={() => {
                        window.open('/api/export/calendar.ics', '_blank');
                        showToast('Downloading complete semester schedule .ics', 'success');
                      }}
                      className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                      title="Download Syllabus Schedule"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1E3A2B] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[8px] font-bold text-[#1E2621] leading-none">Download<br />Calendar</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('papers')}
                      className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                      title="Previous Papers"
                    >
                      <Archive className="w-3.5 h-3.5 text-[#C34E32] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[8px] font-bold text-[#1E2621] leading-none">Previous<br />Papers</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('notes')}
                      className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                      title="Class Notes"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#5344B5] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[8px] font-bold text-[#1E2621] leading-none">Class<br />Notes</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('syllabus')}
                      className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                      title="Important Topics"
                    >
                      <Star className="w-3.5 h-3.5 text-[#D4A034] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[8px] font-bold text-[#1E2621] leading-none">Important<br />Topics</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASS NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectureNotes.map(n => (
              <div
                key={n.id}
                className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#236B43]">
                      {n.subject}
                    </span>
                    <span className="text-xs text-[#7A837C] font-mono">{n.size}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1E2621]">{n.title}</h4>
                  <p className="text-xs text-[#7A837C]">Read by {n.reads} • Updated {n.date}</p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                  <span className="text-xs text-[#236B43] font-semibold">Verified faculty notes</span>
                  <button
                    onClick={() => showToast(`Downloaded "${n.title}"`, 'success')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SYLLABUS TRACKER */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#1E2621]">Master Syllabus Checklist</h3>
            <div className="space-y-6">
              {subjects.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E8E2D5]">
                        {s.code}
                      </span>
                      <h4 className="text-sm font-bold text-[#1E2621]">{s.name}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedSubjectForDetail(s)}
                      className="text-xs text-[#1E3A2B] font-bold hover:underline"
                    >
                      View Details →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.syllabus.flatMap(u => u.topics).map(tp => (
                      <div
                        key={tp.id}
                        onClick={() => toggleTopicCompletion(s.id, s.syllabus[0].id, tp.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E8E2D5] cursor-pointer hover:border-[#1E3A2B]"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            tp.completed ? 'bg-[#1E3A2B] border-[#1E3A2B] text-white' : 'border-[#B8B0A2]'
                          }`}
                        >
                          {tp.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${tp.completed ? 'line-through text-[#8C958E]' : 'text-[#1E2621] font-medium'}`}>
                          {tp.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREVIOUS PAPERS */}
      {activeTab === 'papers' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#1E2621]">Past 5-Year Question Papers & Solutions</h3>
            <div className="space-y-2">
              {pastPapers.map(pp => (
                <div
                  key={pp.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE] hover:bg-[#F5EFE4] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF4EE] text-[#236B43] flex items-center justify-center font-bold text-xs">
                      {pp.year}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E2621]">{pp.subject}</h4>
                      <p className="text-[10px] text-[#7A837C]">{pp.exam} • Difficulty: {pp.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pp.solved && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#236B43]">
                        Solved
                      </span>
                    )}
                    <button
                      onClick={() => showToast(`Opening ${pp.subject} (${pp.year}) question paper`, 'success')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold"
                    >
                      <Download className="w-3 h-3" />
                      <span>Get PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FORMULAS & CHEAT SHEETS */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Big-O Complexity & Data Structure Cheat Sheet', subject: 'DSA', file: 'PDF • 1.2 MB' },
            { title: 'SQL Joins, Indexing & Normalization Quick Ref', subject: 'DBMS', file: 'PDF • 850 KB' },
            { title: 'Network OSI Layers & TCP/IP Protocol Stack', subject: 'Networks', file: 'PDF • 2.1 MB' },
            { title: 'Linear Algebra & ML Optimization Matrix Equations', subject: 'AI/ML', file: 'PDF • 3.4 MB' }
          ].map((r, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#1E2621]">
                  {r.subject}
                </span>
                <h4 className="text-xs font-bold text-[#1E2621] mt-1">{r.title}</h4>
                <p className="text-[10px] text-[#7A837C] font-mono mt-0.5">{r.file}</p>
              </div>
              <button
                onClick={() => showToast(`Downloaded ${r.title}`, 'success')}
                className="p-2.5 rounded-2xl bg-[#EAF4EE] hover:bg-[#DEEFE4] text-[#236B43] transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: MARKS & CGPA CALCULATOR */}
      {activeTab === 'marks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#1E2621]">Current Semester GPA Estimator</h3>
            <div className="space-y-3">
              {subjects.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9F5] border border-[#EDE8DE]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2621]">{s.name}</h4>
                    <span className="text-[10px] text-[#7A837C] font-mono">{s.code} • {s.credits} Credits</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A837C]">Expected Grade:</span>
                    <select
                      value={courseGrades[s.code] || 9}
                      onChange={e => setCourseGrades(prev => ({ ...prev, [s.code]: Number(e.target.value) }))}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D5] text-xs font-bold text-[#1E2621]"
                    >
                      <option value={10}>A+ (10)</option>
                      <option value={9}>A (9)</option>
                      <option value={8}>B+ (8)</option>
                      <option value={7}>B (7)</option>
                      <option value={6}>C (6)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4 text-center">
            <h4 className="text-xs font-bold text-[#7A837C] uppercase tracking-wider">Estimated SGPA</h4>
            <div className="text-5xl font-black font-sans text-[#1E3A2B] py-2">
              {calculatedSGPA}
            </div>
            <p className="text-xs text-[#58615A]">
              On track for First Class with Distinction! 🌿
            </p>
            <button
              onClick={() => showToast('Saved estimated grades to academic transcript profile', 'success')}
              className="w-full py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
            >
              Save to Academic Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
