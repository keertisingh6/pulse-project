import React, { useState, useRef, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Sparkles,
  Send,
  CheckCircle2,
  User,
  Zap
} from 'lucide-react';

export const KairoStudio: React.FC = () => {
  const {
    kairoMessages,
    sendKairoMessage,
    isKairoLoading,
    applyKairoProposal,
    commitments,
    profile
  } = usePulse();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [kairoMessages, isKairoLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isKairoLoading) return;
    sendKairoMessage(input.trim());
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    sendKairoMessage(prompt);
  };

  const suggestedPrompts = [
    'What should I focus on right now?',
    'Break down DSA Assignment 5 into smaller steps',
    'Plan my weekly study blocks realistically',
    'How can I catch up without burning out?'
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E3A2B] flex items-center justify-center text-[#A8E6CF] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#1E2621]">Kairo AI Partner</h2>
            <p className="text-xs text-[#6E7570]">
              Context-aware student companion • High agency, low guilt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E3DDD0] text-xs font-semibold text-[#58615A] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#1E3A2B] animate-pulse" />
          <span>Tracking {commitments.length} commitments</span>
          <span className="text-[#D8D1C3]">|</span>
          <span className="text-[#1E3A2B]">
            {profile.geminiApiKey ? 'Gemini 1.5 Flash' : 'High-Agency Engine'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold text-[#8C958E] mr-1 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#D4A034]" />
          Quick Actions:
        </span>
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(p)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EAF4EE] border border-[#E3DDD0] text-[#1E3A2B] text-xs font-semibold transition-all shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-3xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-card space-y-5">
        {kairoMessages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs ${
                  isUser ? 'bg-[#1E3A2B] text-white' : 'bg-[#EAF4EE] text-[#1E3A2B]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`space-y-3 max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#1E3A2B] text-white rounded-tr-xs'
                      : 'bg-[#FBF9F5] border border-[#E3DDD0] text-[#1E2621] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 font-mono ${
                      isUser ? 'text-[#A8E6CF] text-right' : 'text-[#8C958E]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.suggestedActions?.map(proposal => (
                  <div
                    key={proposal.id}
                    className="p-4 rounded-2xl bg-white border-2 border-[#1E3A2B]/20 shadow-soft space-y-3"
                  >
                    <h4 className="text-xs font-extrabold text-[#1E2621]">{proposal.title}</h4>
                    <p className="text-xs text-[#58615A] leading-relaxed">{proposal.description}</p>
                    <div className="pt-1 flex justify-end">
                      {proposal.applied ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF4EE] text-[#236B43] text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => applyKairoProposal(proposal.id)}
                          className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-xs font-bold shadow-sm"
                        >
                          Apply Action
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isKairoLoading && (
          <div className="flex items-center gap-2 text-xs text-[#6E7570] font-medium">
            <Sparkles className="w-4 h-4 text-[#1E3A2B] animate-pulse" />
            <span>Kairo is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Kairo to prioritize, break down assignments, or plan your week..."
          className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-white border border-[#E3DDD0] text-xs sm:text-sm text-[#1E2621] placeholder-[#8C958E] focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]/20 shadow-soft"
        />
        <button
          type="submit"
          disabled={!input.trim() || isKairoLoading}
          className="absolute right-2 top-2 p-2 rounded-xl bg-[#1E3A2B] hover:bg-[#284E3A] text-white disabled:opacity-40 transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
