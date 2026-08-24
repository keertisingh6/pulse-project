import React, { useState, useRef } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Upload, FileText, Clipboard, Sparkles, Check, 
  AlertCircle, ArrowRight, CornerDownRight, Laptop, BookOpen, CreditCard, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Preset real-world files for easy 1-click demonstration
interface PresetNotice {
  id: string;
  title: string;
  icon: React.ReactNode;
  userType: string;
  sourceName: string;
  mimeType: string;
  text: string;
}

const PRESETS: PresetNotice[] = [
  {
    id: 'p_student',
    title: 'University Math Exam Postponement',
    icon: <BookOpen className="w-5 h-5 text-[#7C9070]" />,
    userType: 'Student Scene',
    sourceName: 'Syllabus_Update.txt',
    mimeType: 'text/plain',
    text: `DEPARTMENT OF COMPUTER SCIENCE
Course: CS 302 Linear Algebra
ANNOUNCEMENT:
Please note that the Linear Algebra Midterm Exam initially scheduled for June 26 has been postponed to next Friday, July 3, 2026, starting at 10:00 AM in Hall C.
This is a high-priority exam covering Vector Spaces and Eigenvalues. Expect to dedicate about 6 hours of revision study.`
  },
  {
    id: 'p_parent',
    title: 'PG&E Power Utility Bill',
    icon: <CreditCard className="w-5 h-5 text-[#7C9070]" />,
    userType: 'Bill Payment Scene',
    sourceName: 'pge_june_invoice.png',
    mimeType: 'image/png',
    text: `PACIFIC GAS AND ELECTRIC COMPANY
Statement Date: June 22, 2026
Account Number: 80491-3
Total Energy Charges Due: $118.40
Payment Due Date: July 1, 2026
Pay on your PGE portal. Late fees of 1.5% will apply if paid after the due date.`
  },
  {
    id: 'p_freelancer',
    title: 'Milestone 2 Client Email',
    icon: <Laptop className="w-5 h-5 text-[#7C9070]" />,
    userType: 'Freelancer / Client Scene',
    sourceName: 'sora_feedback_email.txt',
    mimeType: 'text/plain',
    text: `From: Sora Development Team (milestones@sora.io)
Subject: Re: High fidelity prototype walkthrough v2

Hi Keerti,
We reviewed the figma files and everything is outstanding!
Can we lock in our final walkthrough session next Monday, June 29, 2026, at 3:30 PM (your local time)?
We will need to finalize the client deliverables and complete some adjustments beforehand, which we estimate will take about 2 hours. Let us know if this works!`
  },
  {
    id: 'p_interview',
    title: 'Tech Interview Invitation',
    icon: <Mail className="w-5 h-5 text-[#7C9070]" />,
    userType: 'Job Seeker / Employee Scene',
    sourceName: 'VeloCorp_Invite.eml',
    mimeType: 'text/plain',
    text: `Dear Keerti,
We are excited to proceed to the final round!
Your technical panel interview with VeloCorp is scheduled for Friday, June 26, 2026 at 11:30 AM EST.
This is a 60-minute coding interview covering web architecture and system design. Please join via Google Meet link: meet.google.com/vel-corp-tech.
Good luck!`
  }
];

export const LifeInbox: React.FC = () => {
  const { importCommitments } = usePulse();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<any[]>([]);
  
  // Custom paste field state
  const [rawText, setRawText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger Gemini API extraction
  const processExtraction = async (text: string, fileBase64?: string, mimeType?: string, name?: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    setExtractedItems([]);

    try {
      const results = await importCommitments(text, fileBase64, mimeType, name);
      setExtractedItems(results);
      setSuccess(true);
      setRawText('');
      
      // Auto-clear success message after some time
      setTimeout(() => setSuccess(false), 8000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'We could not read this document. Try a different preset or text copy.');
    } finally {
      setLoading(false);
    }
  };

  // Preset click handler
  const handleSelectPreset = (preset: PresetNotice) => {
    processExtraction(preset.text, undefined, preset.mimeType, preset.sourceName);
  };

  // Text paste form handler
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    processExtraction(rawText, undefined, 'text/plain', 'Pasted_Inbox_Snippet.txt');
  };

  // Image/File Uploader Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseUploadedFile(file);
  };

  const parseUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part
      const base64Data = result.split(',')[1];
      processExtraction(
        `File: ${file.name}\nSize: ${file.size} bytes`,
        base64Data,
        file.type,
        file.name
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6" id="life-inbox-section">
      {/* Intro visual banner */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-5 justify-between shadow-sm">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="bg-[#7C9070] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
              Demo Feature
            </span>
            <span className="text-[#1A1A1B] font-serif font-semibold text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#7C9070]" />
              Pulse Life Inbox
            </span>
          </div>
          <h3 className="font-serif font-light text-xl md:text-2xl text-[#1A1A1B] leading-tight">
            Ditch the manual task entry.
          </h3>
          <p className="text-[#1A1A1B]/70 text-xs md:text-sm max-w-lg leading-relaxed">
            PULSE automatically parses screenshots of bills, university notices, emails, and PDFs. Kairo will extract commitments, dates, efforts, and schedule your day.
          </p>
        </div>
        <div className="text-[#1A1A1B]/40 text-xs font-mono select-none hidden md:block">
          ⚡ Powered by Gemini 3.5
        </div>
      </div>

      {/* Grid: Demo Presets on Left, Custom Uploads on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Presets - Ideal for testing */}
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div>
            <h4 className="font-serif font-semibold text-[#1A1A1B] text-base">
              Try Interactive Demo Presets
            </h4>
            <p className="text-[#1A1A1B]/50 text-xs mt-0.5">
              Click a preset document to see Kairo extract real commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                disabled={loading}
                className="flex flex-col items-start text-left p-4 bg-[#F5F1E9]/40 hover:bg-[#7C9070]/10 border border-[#EBE9E0] hover:border-[#7C9070] rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 hover:shadow-sm"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] font-bold text-[#1A1A1B]/40 uppercase tracking-wide">
                    {preset.userType}
                  </span>
                  {preset.icon}
                </div>
                <h5 className="font-serif font-bold text-xs text-[#1A1A1B] line-clamp-1">
                  {preset.title}
                </h5>
                <span className="text-[11px] font-mono text-[#1A1A1B]/50 mt-1 truncate w-full">
                  📄 {preset.sourceName}
                </span>
                <span className="text-[10px] text-[#7C9070] font-semibold flex items-center gap-0.5 mt-2 ml-auto">
                  Run Extraction <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input: Upload or Paste */}
        <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <h4 className="font-serif font-semibold text-[#1A1A1B] text-base">
            Import Your Own
          </h4>

          {/* Drag & Drop File Upload */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${
              dragActive 
                ? 'border-[#7C9070] bg-[#7C9070]/10' 
                : 'border-[#EBE9E0] hover:border-[#7C9070]/40 hover:bg-[#FAF9F6]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,text/*,application/pdf"
              className="hidden"
              disabled={loading}
            />
            <div className="flex flex-col items-center">
              <div className="bg-[#FAF9F6] p-2.5 rounded-full text-[#7C9070] mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#1A1A1B]/70">
                Drag and drop your file here, or <span className="text-[#7C9070] underline">browse</span>
              </p>
              <p className="text-[10px] text-[#1A1A1B]/40 mt-1">
                Supports image screenshots, PDFs, txt documents (Max 10MB)
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <span className="absolute bg-white px-3 text-[10px] font-semibold text-[#1A1A1B]/40 uppercase">Or Paste Text</span>
            <hr className="w-full border-[#EBE9E0]" />
          </div>

          {/* Text Paste Area */}
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <div className="relative">
              <Clipboard className="absolute left-3 top-2.5 h-4 w-4 text-[#1A1A1B]/40" />
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste emails, portal messages, notice boards, WhatsApp announcements..."
                rows={3}
                disabled={loading}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F1E9] border border-[#EBE9E0] rounded-xl outline-none resize-none focus:bg-white focus:ring-1 focus:ring-[#7C9070] text-[#1A1A1B]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !rawText.trim()}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1B] hover:bg-[#1A1A1B]/90 disabled:bg-[#F5F1E9] disabled:text-[#1A1A1B]/30 font-medium py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Kairo to Parse Paste</span>
            </button>
          </form>
        </div>
      </div>

      {/* Extraction Process Loader & Results display */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 text-center space-y-4 shadow-sm"
          >
            {/* Animated Loading Companion */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#7C9070]/10 rounded-full scale-125 animate-ping opacity-25" />
                <div className="w-12 h-12 rounded-full bg-[#7C9070]/10 flex items-center justify-center text-[#7C9070] animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-[#1A1A1B] text-base">
                Kairo is reading the commitment...
              </h4>
              <p className="text-[#1A1A1B]/50 text-xs max-w-sm mx-auto">
                Gemini is extracting the category, analyzing due dates from relative contexts, estimating efforts, and writing gentle advice. Hang tight.
              </p>
            </div>
            {/* Soft progress loader */}
            <div className="max-w-xs mx-auto bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#EBE9E0]">
              <div className="bg-[#7C9070] h-full rounded-full animate-[shimmer_1.5s_infinite] w-2/3" style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
              }} />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold">
              <p>{error}</p>
              <p className="text-rose-600 font-normal mt-1">Please try again, or use one of our interactive presets designed to work instantly.</p>
            </div>
          </motion.div>
        )}

        {success && extractedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF9F6] border border-[#7C9070]/30 rounded-[2rem] p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-2 text-[#7C9070]">
              <div className="bg-[#7C9070]/10 p-1.5 rounded-full text-[#7C9070]">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Successfully Extracted!</h4>
                <p className="text-[#7C9070] text-xs font-medium">Added to your Pulse Commitments feed.</p>
              </div>
            </div>

            {/* Render the newly extracted items preview */}
            <div className="space-y-2">
              {extractedItems.map(item => (
                <div key={item.id} className="bg-white border border-[#EBE9E0] rounded-2xl p-4 flex gap-3 shadow-sm">
                  <div className="bg-[#7C9070]/10 text-[#7C9070] w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-serif font-bold text-[#1A1A1B]">{item.title}</h5>
                    <div className="flex gap-2 text-[#1A1A1B]/60 font-medium text-[11px]">
                      <span>Due: <strong>{item.dueDate}</strong></span>
                      <span>•</span>
                      <span>Est: <strong>{item.estimatedEffort}</strong></span>
                      <span>•</span>
                      <span className="capitalize">Priority: <strong>{item.priority}</strong></span>
                    </div>
                    <div className="text-[11px] text-[#1A1A1B]/70 bg-[#F5F1E9] p-3 rounded-xl mt-2 border border-[#EBE9E0] font-serif italic">
                      ✨ <strong>Kairo:</strong> "{item.aiTip}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
