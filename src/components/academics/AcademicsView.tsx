import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
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
  X
} from 'lucide-react';

export const AcademicsView: React.FC = () => {
  const { showToast } = usePulse();
  const [activeTab, setActiveTab] = useState<'subjects' | 'notes' | 'syllabus' | 'papers' | 'resources' | 'marks'>('subjects');

  // 6 Subject Cards matching Screenshot 2
  const subjects = [
    {
      id: 'sub-1',
      title: 'Data Structures',
      code: 'CSF20101',
      progress: 72,
      topics: '18/25 topics',
      color: 'bg-[#EAF4EE]',
      borderColor: 'border-[#D5EADB]',
      iconColor: 'text-[#236B43]',
      ringColor: '#1E3A2B',
      icon: Monitor
    },
    {
      id: 'sub-2',
      title: 'Cyber Security',
      code: 'CSF20102',
      progress: 56,
      topics: '14/25 topics',
      color: 'bg-[#FDF0ED]',
      borderColor: 'border-[#F6DCD6]',
      iconColor: 'text-[#C34E32]',
      ringColor: '#C34E32',
      icon: Shield
    },
    {
      id: 'sub-3',
      title: 'DBMS',
      code: 'CSF20103',
      progress: 64,
      topics: '16/25 topics',
      color: 'bg-[#FEF7E6]',
      borderColor: 'border-[#F6E6BF]',
      iconColor: 'text-[#A1741F]',
      ringColor: '#1E3A2B',
      icon: Database
    },
    {
      id: 'sub-4',
      title: 'AI & ML',
      code: 'CSF20104',
      progress: 48,
      topics: '12/25 topics',
      color: 'bg-[#F5EEFD]',
      borderColor: 'border-[#E3D1F7]',
      iconColor: 'text-[#5344B5]',
      ringColor: '#7B68EE',
      icon: Brain
    },
    {
      id: 'sub-5',
      title: 'Networking',
      code: 'CSF20105',
      progress: 60,
      topics: '15/25 topics',
      color: 'bg-[#EBF5FA]',
      borderColor: 'border-[#D3E8F5]',
      iconColor: 'text-[#256E93]',
      ringColor: '#1E3A2B',
      icon: Share2
    },
    {
      id: 'sub-6',
      title: 'Software Engineering',
      code: 'CSF20106',
      progress: 40,
      topics: '10/25 topics',
      color: 'bg-[#FAF0E6]',
      borderColor: 'border-[#EFE1D2]',
      iconColor: 'text-[#C34E32]',
      ringColor: '#C34E32',
      icon: FileText
    }
  ];

  // Today's Subjects timetable rows matching Screenshot 2
  const todayClasses = [
    {
      timeStart: '8:00 AM',
      timeEnd: '9:00 AM',
      title: 'Data Structures',
      type: 'Lecture',
      typeColor: 'bg-[#EAF4EE] text-[#236B43]',
      topic: 'Stacks and Queues'
    },
    {
      timeStart: '10:00 AM',
      timeEnd: '11:00 AM',
      title: 'Cyber Security',
      type: 'Lecture',
      typeColor: 'bg-[#FDF0ED] text-[#C34E32]',
      topic: 'Network Security Basics'
    },
    {
      timeStart: '12:00 PM',
      timeEnd: '1:00 PM',
      title: 'DBMS',
      type: 'Lab',
      typeColor: 'bg-[#FEF7E6] text-[#A1741F]',
      topic: 'SQL Queries'
    },
    {
      timeStart: '2:00 PM',
      timeEnd: '3:00 PM',
      title: 'AI & ML',
      type: 'Tutorial',
      typeColor: 'bg-[#F5EEFD] text-[#5344B5]',
      topic: 'Linear Regression'
    },
    {
      timeStart: '4:00 PM',
      timeEnd: '5:00 PM',
      title: 'Networking',
      type: 'Lecture',
      typeColor: 'bg-[#EBF5FA] text-[#256E93]',
      topic: 'OSI Model'
    }
  ];

  // Upcoming Assessments matching Screenshot 2
  const assessments = [
    {
      id: 'a-1',
      title: 'DSA Assignment 5',
      type: 'assignment',
      priority: 'High',
      priorityColor: 'bg-[#FDF0ED] text-[#C34E32]',
      date: '13 Oct 2025 Mon',
      hours: '2h',
      iconColor: 'bg-[#EAF4EE] text-[#236B43]'
    },
    {
      id: 'a-2',
      title: 'PBL-III Lab Report',
      type: 'Lab',
      priority: 'Medium',
      priorityColor: 'bg-[#FEF7E6] text-[#A1741F]',
      date: '27 Oct 2025 Mon',
      hours: '3h',
      iconColor: 'bg-[#F0EFFE] text-[#5344B5]'
    },
    {
      id: 'a-3',
      title: 'Software Engineering CCA',
      type: 'Exam',
      priority: 'High',
      priorityColor: 'bg-[#FDF0ED] text-[#C34E32]',
      date: '3 Nov 2025 Mon',
      hours: '5h',
      iconColor: 'bg-[#FDF0ED] text-[#C34E32]'
    },
    {
      id: 'a-4',
      title: 'Technovision Hackathon',
      type: 'Hackathon',
      priority: 'Medium',
      priorityColor: 'bg-[#FEF7E6] text-[#A1741F]',
      date: '20 Oct 2025 Mon',
      hours: '6h',
      iconColor: 'bg-[#FEF7E6] text-[#A1741F]'
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with title & Current Semester dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight">
            Academics
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Your subjects, syllabus, notes and academics in one place.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-[#1E2621] bg-white px-3 py-1.5 rounded-2xl border border-[#E8E2D5] shadow-2xs cursor-pointer">
          <span>Current Semester</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#6E7570]" />
        </div>
      </div>

      {/* 2. Filter Tabs (matching Screenshot 2) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'subjects'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Subjects (6)
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'notes'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'syllabus'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Syllabus
        </button>
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'papers'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Previous Papers
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'resources'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'marks'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
          }`}
        >
          Marks & CGPA
        </button>
      </div>

      {/* 3. 6 Subject Cards in 1 Row (matching Screenshot 2) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {subjects.map(subj => {
          const Icon = subj.icon;
          const circumference = 2 * Math.PI * 14;
          const strokeDashoffset = circumference - (subj.progress / 100) * circumference;

          return (
            <div
              key={subj.id}
              onClick={() => showToast(`Opening ${subj.title} details`, 'info')}
              className={`p-3.5 rounded-3xl ${subj.color} border ${subj.borderColor} shadow-2xs hover:shadow-card transition-all flex flex-col justify-between h-48 cursor-pointer group`}
            >
              {/* Top row: icon + three dots */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                  <Icon className={`w-4 h-4 ${subj.iconColor}`} />
                </div>
                <span className="text-xs text-[#A4AAA6] group-hover:text-[#1E2621]">···</span>
              </div>

              {/* Title & Code */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#1E2621] leading-tight line-clamp-1">
                  {subj.title}
                </h4>
                <p className="text-[10px] text-[#7A837C] font-mono">{subj.code}</p>
              </div>

              {/* Donut Progress & Topics Count */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      stroke="#EDE8DE"
                      strokeWidth="3.2"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      stroke={subj.ringColor}
                      strokeWidth="3.2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-[#1E2621]">
                    {subj.progress}%
                  </span>
                </div>

                <span className="text-[10px] text-[#7A837C] font-medium leading-tight">
                  {subj.topics}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Lower Section: Left Timetable (7 cols) + Right Assessments & Quick Links (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Today's Subjects Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
            <h3 className="text-base font-bold text-[#1E2621]">
              Today's Subjects <span className="text-xs font-normal text-[#7A837C]">Mon, 27 Oct 2025</span>
            </h3>
            <button
              onClick={() => showToast('Opening complete semester timetable', 'info')}
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
              <div className="flex items-center gap-1 text-xs text-[#58615A] bg-[#FBF9F5] px-2.5 py-1 rounded-xl border border-[#EDE8DE]">
                <span>Next 4 Weeks</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {assessments.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#F5EFE4] transition-all border border-[#EDE8DE]"
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

                    <MoreVertical className="w-3.5 h-3.5 text-[#A4AAA6]" />
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
                <span className="text-xs font-bold text-[#1E2621]">53%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#EDE8DE] overflow-hidden">
                <div className="h-full rounded-full bg-[#1E3A2B]" style={{ width: '53%' }} />
              </div>

              <p className="text-[10px] text-[#7A837C]">
                80 of 150 topics completed
              </p>
            </div>

            {/* Right mini-card: Quick Links (4 grid buttons) */}
            <div className="p-4 rounded-3xl bg-white border border-[#E8E2D5] shadow-card space-y-2">
              <h4 className="text-xs font-bold text-[#1E2621]">Quick Links</h4>

              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                <button
                  onClick={() => showToast('Downloading complete semester syllabus...', 'info')}
                  className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                  title="Download Syllabus"
                >
                  <Download className="w-3.5 h-3.5 text-[#1E3A2B] group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[8px] font-bold text-[#1E2621] leading-none">Download<br />Syllabus</span>
                </button>

                <button
                  onClick={() => showToast('Opening past 5-year question papers...', 'info')}
                  className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                  title="Previous Papers"
                >
                  <Archive className="w-3.5 h-3.5 text-[#C34E32] group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[8px] font-bold text-[#1E2621] leading-none">Previous<br />Papers</span>
                </button>

                <button
                  onClick={() => showToast('Opening lecture notes & summaries...', 'info')}
                  className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EDE9DF] border border-[#EDE8DE] flex flex-col items-center text-center transition-all group"
                  title="Class Notes"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#5344B5] group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[8px] font-bold text-[#1E2621] leading-none">Class<br />Notes</span>
                </button>

                <button
                  onClick={() => showToast('Opening high-priority topics checklist...', 'info')}
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
  );
};