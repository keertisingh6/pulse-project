import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Bookmark,
  FileText,
  Download,
  ExternalLink,
  Folder,
  Plus,
  Search,
  BookOpen,
  Code2,
  Sparkles,
  Archive,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { showToast } = usePulse();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cheat Sheets' | 'Lab Manuals' | 'Question Papers' | 'Templates'>('All');

  const resources = [
    {
      id: 'res-1',
      title: 'Data Structures & Algorithms Complete Cheat Sheet',
      category: 'Cheat Sheets',
      subject: 'CS301',
      format: 'PDF • 4.8 MB',
      color: '#EAF4EE',
      accent: '#236B43',
      downloads: '1.2k'
    },
    {
      id: 'res-2',
      title: 'Database Management Systems Lab Manual & SQL Triggers Guide',
      category: 'Lab Manuals',
      subject: 'CS302',
      format: 'PDF • 3.2 MB',
      color: '#FEF7E6',
      accent: '#A1741F',
      downloads: '850'
    },
    {
      id: 'res-3',
      title: 'Cyber Security OWASP Top 10 & Crypto Handshake Reference',
      category: 'Cheat Sheets',
      subject: 'CS305',
      format: 'PDF • 2.6 MB',
      color: '#FDF0ED',
      accent: '#C34E32',
      downloads: '940'
    },
    {
      id: 'res-4',
      title: 'Fullstack Hackathon Production Boilerplate (React + Vite + FastAPI)',
      category: 'Templates',
      subject: 'Projects',
      format: 'ZIP • GitHub Repo',
      color: '#EEF4FF',
      accent: '#256E93',
      downloads: '2.1k'
    },
    {
      id: 'res-5',
      title: 'Computer Networks 5-Year Midterm & Endsem Solved Papers',
      category: 'Question Papers',
      subject: 'CS303',
      format: 'PDF • 8.1 MB',
      color: '#F0EFFE',
      accent: '#5344B5',
      downloads: '1.7k'
    },
    {
      id: 'res-6',
      title: 'Software Engineering Agile Sprint & SRS Specification Document',
      category: 'Templates',
      subject: 'CS306',
      format: 'DOCX • 1.1 MB',
      color: '#EAF4EE',
      accent: '#236B43',
      downloads: '620'
    }
  ];

  const filtered = resources.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-normal text-[#1E2621] tracking-tight">
            Resources <span className="inline-block">🌿</span>
          </h2>
          <p className="text-xs text-[#6E7570] font-sans">
            Curated course notes, formula sheets, lab references, and project boilerplates.
          </p>
        </div>

        <button
          onClick={() => showToast('Opening resource submission portal...', 'info')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7A837C]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search notes, formulas, subjects..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-[#E8E2D5] text-xs text-[#1E2621] placeholder-[#8A938C] focus:outline-hidden focus:border-[#1E3A2B] shadow-2xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {(['All', 'Cheat Sheets', 'Lab Manuals', 'Question Papers', 'Templates'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-white text-[#58615A] hover:bg-[#EDE9DF] border border-[#E3DDD0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(res => (
          <div
            key={res.id}
            className="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#1E2621] border border-[#E8E1D3]">
                  {res.subject}
                </span>

                <span className="text-[11px] font-semibold text-[#7A837C]">
                  {res.downloads} downloads
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#1E2621] group-hover:text-[#1E3A2B] transition-colors leading-snug">
                {res.title}
              </h4>
            </div>

            <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
              <span className="text-xs text-[#7A837C] font-mono">{res.format}</span>

              <button
                onClick={() => showToast(`Downloaded "${res.title}"`, 'success')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F5] hover:bg-[#1E3A2B] text-[#1E2621] hover:text-white border border-[#EDE8DE] hover:border-[#1E3A2B] text-xs font-semibold transition-all group/btn"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};