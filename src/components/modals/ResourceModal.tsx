import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { X, Upload, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (res: any) => void;
}

export const ResourceModal: React.FC<Props> = ({ isOpen, onClose, onAddResource }) => {
  const { showToast, subjects } = usePulse();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0]?.code || 'CS301');
  const [category, setCategory] = useState<'Cheat Sheets' | 'Lab Manuals' | 'Question Papers' | 'Templates'>('Cheat Sheets');
  const [format, setFormat] = useState('PDF • 3.5 MB');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter resource title', 'warning');
      return;
    }

    onAddResource({
      id: 'res-' + Date.now(),
      title: title.trim(),
      category,
      subject,
      format,
      downloads: '1'
    });

    showToast(`Uploaded "${title.trim()}"`, 'success');
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-elevated border border-[#E8E2D5] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E2621]">Upload Academic Resource</h3>
            <p className="text-xs text-[#7A837C]">Add notes, cheat sheets, lab manuals or templates</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C958E] hover:text-[#1E2621]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1E2621]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Concurrency & Semaphores Guide"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621] focus:outline-hidden focus:border-[#1E3A2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              >
                <option value="Cheat Sheets">Cheat Sheets</option>
                <option value="Lab Manuals">Lab Manuals</option>
                <option value="Question Papers">Question Papers</option>
                <option value="Templates">Templates</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1E2621]">Subject Code</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. CS302"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1E2621]">Format & Size</label>
            <input
              type="text"
              value={format}
              onChange={e => setFormat(e.target.value)}
              placeholder="e.g. PDF • 4.2 MB"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs text-[#1E2621]"
            />
          </div>

          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EDE9DF] text-[#58615A] text-xs font-semibold border border-[#E8E2D5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
