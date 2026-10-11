import React, { useState, useRef, useEffect } from 'react';
import { usePulse } from '../context/PulseContext';
import { AssistantMessage } from '../types';
import { 
  Sparkles, Send, Bot, User, ArrowRight, Clock, 
  Calendar, CheckCircle2, Shield, RefreshCw, Smile, MessageSquareQuote 
} from 'lucide-react';
import { motion } from 'motion/react';

const SUGGESTED_QUERIES = [
  "What do I need to finish today?",
  "When is my next deadline?",
  "Control Uday Control: Is my schedule overloaded?",
  "Why this Kolaveri Di with this compiler bug?",
  "Dekh raha hai Vinod... any overdue tasks?",
  "Show my upcoming exams and viva schedule",
  "Aap chronology samajhiye: order my tasks",
];

interface AIAssistantViewProps {
  onNavigateToTab: (tab: 'today' | 'calendar' | 'goals' | 'commitments' | 'database') => void;
  onStartFocusTimer?: (minutes: number) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ 
  onNavigateToTab, 
  onStartFocusTimer 
}) => {
  const { state, askAssistant, setMemePersonalityMode } = usePulse();
  const displayName = state.user?.name || state.userName || 'Student';
  const memeMode = state.memePersonalityMode || 'college_friend';

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    const activeCount = state.commitments.filter(c => !c.completed).length;
    let initialGreeting = `Hello ${displayName}! I am **Kairo**, your personal student companion. `;
    if (memeMode !== 'off') {
      initialGreeting += `Think of me as that one college friend who knows both your syllabus deadlines and the internet. `;
    }
    initialGreeting += activeCount === 0
      ? `Your workspace is currently clear. Add assignments in the database or ask me for study planning guidance.`
      : `I have full context on your **${activeCount} active commitments** and daily timeline. How can I guide you today?`;

    return [
      {
        id: 'init_1',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: "What should I work on today?", actionType: 'navigate', payload: 'today' },
          { label: "Check upcoming deadlines", actionType: 'filter', payload: 'deadlines' },
        ],
      },
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const cyclePersonalityMode = () => {
    const modes: Array<'off' | 'college_friend' | 'full_desi'> = ['college_friend', 'full_desi', 'off'];
    const nextIndex = (modes.indexOf(memeMode) + 1) % modes.length;
    setMemePersonalityMode(modes[nextIndex]);
  };

  const getModeLabel = () => {
    switch (memeMode) {
      case 'full_desi': return 'Hostelite Banter 🔥';
      case 'college_friend': return 'Desi Campus Buddy ☕';
      case 'off': return 'Neutral Mentor 🎓';
      default: return 'Desi Campus Buddy ☕';
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: AssistantMessage = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await askAssistant(query);
      setMessages(prev => [...prev, response]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: "I had trouble analyzing that right now. Please verify your connection or ask again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'navigate' && action.payload) {
      onNavigateToTab(action.payload);
    } else if (action.actionType === 'add_focus' && onStartFocusTimer) {
      onStartFocusTimer(action.payload || 25);
    } else if (action.actionType === 'filter') {
      handleSend(`Tell me more about ${action.payload}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="ai-assistant-page">
      
      {/* Header */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7C9070] text-white flex items-center justify-center font-serif font-black text-xl shadow-md shadow-[#7C9070]/20">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cyclePersonalityMode}
                className="text-[10px] uppercase font-bold tracking-wider text-[#7C9070] hover:text-[#5a6a50] bg-[#7C9070]/10 hover:bg-[#7C9070]/20 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                title="Click to cycle personality mode: College Buddy / Hostelite / Neutral"
              >
                <span>{getModeLabel()}</span>
                <span className="text-[9px] opacity-60">(click to toggle)</span>
              </button>
              <span className="text-xs text-[#1A1A1B]/40 font-mono">
                Model: {state.aiProvider === 'gemini' ? 'Gemini 3.8 Flash' : 'Open-Source'}
              </span>
            </div>
            <h2 className="font-serif font-light text-xl md:text-2xl text-[#1A1A1B] mt-0.5">
              Ask Kairo anything about your life schedule.
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#1A1A1B]/50 font-medium">
          <Shield className="w-3.5 h-3.5 text-[#7C9070]" />
          <span>Answers grounded in real Pulse data</span>
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-4 md:p-6 shadow-sm flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser 
                    ? 'bg-[#1A1A1B] text-white' 
                    : 'bg-[#7C9070]/10 text-[#7C9070] border border-[#7C9070]/20'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : ''}`}>
                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1A1A1B] text-white font-medium rounded-tr-xs'
                      : 'bg-[#FAF9F6] border border-[#EBE9E0] text-[#1A1A1B] rounded-tl-xs font-sans'
                  }`}>
                    {/* Basic Markdown rendering for bold & blockquotes */}
                    <div className="whitespace-pre-wrap space-y-1">
                      {msg.text.split('\n').map((line, i) => {
                        if (line.startsWith('> ')) {
                          return (
                            <blockquote key={i} className="pl-3 border-l-2 border-amber-500 text-amber-900 bg-amber-50/60 py-1 px-2 rounded-r-lg my-1.5 italic text-xs font-medium">
                              {line.substring(2)}
                            </blockquote>
                          );
                        }
                        if (line.startsWith('• ')) {
                          return (
                            <span key={i} className="block pl-2 border-l-2 border-[#7C9070] my-1">
                              {line.substring(2)}
                            </span>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="text-[11px] font-semibold text-[#7C9070] hover:text-[#5a6a50] bg-white border border-[#7C9070]/30 hover:border-[#7C9070] px-3 py-1 rounded-full shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[10px] font-mono text-[#1A1A1B]/35 block ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#7C9070]/10 text-[#7C9070] border border-[#7C9070]/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-[#FAF9F6] border border-[#EBE9E0] p-4 rounded-2xl rounded-tl-xs text-xs text-[#1A1A1B]/60 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C9070]" />
                <span>Kairo is analyzing your schedule and commitments...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Query Pills */}
        <div className="pt-3 pb-2 border-t border-[#EBE9E0] overflow-x-auto scrollbar-none flex gap-1.5">
          {SUGGESTED_QUERIES.map(q => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1 bg-[#FAF9F6] hover:bg-[#F5F1E9] border border-[#EBE9E0] text-[#1A1A1B]/70 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#FAF9F6] border border-[#EBE9E0] rounded-2xl p-1.5 focus-within:border-[#7C9070] transition-colors"
          >
            <input
              type="text"
              placeholder={`Ask Kairo anything about your assignments, deadlines, or daily plan...`}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent px-3 text-xs md:text-sm text-[#1A1A1B] outline-none placeholder-[#1A1A1B]/40"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="w-9 h-9 rounded-xl bg-[#7C9070] hover:bg-[#6c7d61] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
