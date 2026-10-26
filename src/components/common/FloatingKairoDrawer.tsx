import React, { useState, useRef, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  Maximize2,
  Zap,
  Bot,
  User
} from 'lucide-react';

export const FloatingKairoDrawer: React.FC = () => {
  const {
    isKairoDrawerOpen,
    setIsKairoDrawerOpen,
    kairoMessages,
    sendKairoMessage,
    isKairoLoading,
    applyKairoProposal,
    setCurrentView,
    currentView
  } = usePulse();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isKairoDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [kairoMessages, isKairoDrawerOpen, isKairoLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isKairoLoading) return;
    sendKairoMessage(input.trim());
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    sendKairoMessage(prompt);
  };

  const quickPrompts = [
    'What should I focus on next?',
    'Break down DAA assignment into steps',
    'Reschedule missed tasks realistically'
  ];

  return (
    <>
      {/* Floating Trigger Button (when drawer is closed and not on full Kairo studio view) */}
      {!isKairoDrawerOpen && currentView !== 'kairo' && (
        <button
          onClick={() => setIsKairoDrawerOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1E3A2B] text-white font-bold text-xs shadow-md hover:bg-[#284E3A] hover:scale-105 active:scale-95 transition-all group"
          title="Open Kairo Quick Assistant"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#A8E6CF]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A8E6CF] animate-ping" />
          </div>
          <span className="hidden sm:inline font-sans">Ask Kairo</span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isKairoDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-2xs animate-fade-in">
          <div className="w-full sm:w-96 md:w-[440px] h-full bg-white shadow-2xl border-l border-[#E0D9CB] flex flex-col justify-between animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#F2ECE1] flex items-center justify-between bg-[#FBF9F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1E3A2B] flex items-center justify-center text-white shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#A8E6CF]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-[#1E2621]">Kairo Assistant</h3>
                  <p className="text-[11px] text-[#7A837C]">Live Contextual Companion</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsKairoDrawerOpen(false);
                    setCurrentView('kairo');
                  }}
                  className="p-1.5 rounded-lg text-[#7A837C] hover:text-[#1E2621] hover:bg-[#EDE9DF] transition-colors"
                  title="Expand to Full Studio"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsKairoDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#7A837C] hover:text-[#1E2621] hover:bg-[#EDE9DF] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Strip */}
            <div className="px-4 py-2 bg-[#FBF9F5] border-b border-[#F2ECE1] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(p)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EAF4EE] border border-[#E3DDD0] text-[#1E3A2B] text-[11px] font-semibold whitespace-nowrap shadow-2xs"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {kairoMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isUser ? 'bg-[#1E3A2B] text-white' : 'bg-[#EAF4EE] text-[#1E3A2B]'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-2 max-w-[85%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#1E3A2B] text-white rounded-tr-xs'
                            : 'bg-[#FBF9F5] border border-[#EDE8DE] text-[#1E2621] rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className={`text-[9px] block mt-1 font-mono ${isUser ? 'text-[#A8E6CF] text-right' : 'text-[#8A938C]'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Proposals */}
                      {msg.suggestedActions?.map(proposal => (
                        <div
                          key={proposal.id}
                          className="p-3 rounded-xl bg-white border-2 border-[#1E3A2B]/20 shadow-2xs space-y-2"
                        >
                          <h5 className="text-xs font-bold text-[#1E2621]">{proposal.title}</h5>
                          <p className="text-[11px] text-[#58615A]">{proposal.description}</p>
                          <div className="flex justify-end pt-1">
                            {proposal.applied ? (
                              <span className="text-[11px] font-bold text-[#236B43] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => applyKairoProposal(proposal.id)}
                                className="px-3 py-1 rounded-lg bg-[#1E3A2B] hover:bg-[#284E3A] text-white text-[11px] font-bold shadow-2xs"
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
                <div className="flex items-center gap-2 text-xs text-[#7A837C]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3A2B] animate-pulse" />
                  <span>Kairo is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3.5 border-t border-[#F2ECE1] bg-white relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Kairo anything..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#D8D1C3] text-xs text-[#1E2621] focus:bg-white focus:outline-hidden focus:border-[#1E3A2B]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isKairoLoading}
                className="absolute right-5 top-5 p-1.5 rounded-lg bg-[#1E3A2B] hover:bg-[#284E3A] text-white disabled:opacity-40 transition-all shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
