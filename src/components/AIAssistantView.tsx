import React, { useState, useRef, useEffect } from 'react';
import { usePulse } from '../context/PulseContext';
import { AssistantMessage } from '../types';
import { Send, Bot, User, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { EyeTracker } from './bencho/EyeTracker';

const SUGGESTED_QUERIES = [
  "Help me plan today",
  "What deadlines are coming up?",
  "Which task should I prioritize?",
  "Break a task into smaller steps",
  "Help me make a realistic study plan",
];

const createWelcomeMessage = (displayName: string, activeCount: number): AssistantMessage => ({
  id: 'init_1',
  sender: 'assistant',
  text: activeCount === 0
    ? `Hello ${displayName}! I’m Kairo, your study companion. Your workspace is clear. Add assignments in the database or ask me for study planning guidance.`
    : `Hello ${displayName}! I’m Kairo, your study companion. I can help you plan around your ${activeCount} active commitments. What would you like to work on?`,
  timestamp: new Date().toISOString(),
  suggestedActions: [
    { label: "What should I work on today?", actionType: 'navigate', payload: 'planner' },
    { label: "Check upcoming deadlines", actionType: 'filter', payload: 'deadlines' },
  ],
});

const renderInlineMarkdown = (text: string) => text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
  part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part
);

interface AIAssistantViewProps {
  onNavigateToTab: (tab: 'planner' | 'calendar' | 'goals' | 'commitments' | 'database') => void;
  onStartFocusTimer?: (minutes: number) => void;
  initialQuestion?: string;
  onPrefillConsumed?: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ 
  onNavigateToTab,
  onStartFocusTimer,
  initialQuestion = '',
  onPrefillConsumed,
}) => {
  const { state, askAssistant } = usePulse();
  const displayName = state.user?.name || state.userName || 'Student';

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const sendingRef = useRef(false);
  const [failedQuery, setFailedQuery] = useState<string | null>(null);
  const [failedMessageId, setFailedMessageId] = useState<string | null>(null);
  const [assistantStatus, setAssistantStatus] = useState<'checking' | 'ready' | 'missing-key' | 'unavailable'>('checking');
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    createWelcomeMessage(displayName, state.commitments.filter(c => !c.completed).length),
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialQuestion) return;
    setInputMessage(initialQuestion);
    onPrefillConsumed?.();
  }, [initialQuestion, onPrefillConsumed]);

  useEffect(() => {
    let active = true;
    fetch('/api/ai/status')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Status unavailable')))
      .then((status: { activeProvider?: string; hasGeminiKey?: boolean }) => {
        if (!active) return;
        setAssistantStatus(status.activeProvider?.toLowerCase().includes('gemini') && !status.hasGeminiKey
          ? 'missing-key'
          : 'ready');
      })
      .catch(() => { if (active) setAssistantStatus('unavailable'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setMessages(current => current.length === 1 && current[0].id === 'init_1'
      ? [createWelcomeMessage(displayName, state.commitments.filter(c => !c.completed).length)]
      : current);
  }, [displayName, state.commitments]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || sendingRef.current) return;
    sendingRef.current = true;

    const userMsg: AssistantMessage = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setFailedQuery(null);
    setFailedMessageId(null);

    try {
      const response = await askAssistant(query);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const failureId = 'err_' + Math.random().toString(36).substring(2, 9);
      setFailedQuery(query);
      setFailedMessageId(failureId);
      setMessages(prev => [
        ...prev,
        {
          id: failureId,
          sender: 'assistant',
          text: error instanceof Error ? error.message : "I couldn't reach the AI service. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'navigate' && action.payload) {
      const target = action.payload === 'today' ? 'planner' : action.payload;
      if (['planner', 'calendar', 'goals', 'commitments', 'database'].includes(target)) {
        onNavigateToTab(target);
      }
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
          <div className="w-[72px] h-[72px] flex items-center justify-center shrink-0 overflow-visible">
            <EyeTracker within="#ai-assistant-page" size={48} shape="Cube" eyes="Dots" follow={55} bounce={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-0.5 rounded-full">
                Study companion
              </span>
              <span className="text-xs text-[#1A1A1B]/40 font-mono">
                Model: {state.aiProvider === 'gemini' ? 'Gemini 3.8 Flash' : 'Open-Source'}
              </span>
            </div>
            <h2 className="font-serif font-light text-xl md:text-2xl text-[#1A1A1B] mt-0.5">
              Ask Kairo anything about your life schedule.
            </h2>
          </div>
        </div>

        <div className={'assistant-status assistant-status-' + assistantStatus} role="status" aria-live="polite">
          <span className="assistant-status-dot" />
          <span>{assistantStatus === 'checking' ? 'Checking Kairo…' : assistantStatus === 'ready' ? 'Kairo is ready' : assistantStatus === 'missing-key' ? 'AI key needed' : 'Kairo is offline'}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-[#1A1A1B]/50 font-medium">
          <Shield className="w-3.5 h-3.5 text-[#7C9070]" />
          <span>Answers grounded in real Pulse data</span>
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-4 md:p-6 shadow-sm flex flex-col h-[520px]">

        {assistantStatus === 'missing-key' && (
          <div role="status" className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Kairo is offline because Gemini isn’t configured. For local development, set <code>GEMINI_API_KEY</code> in the server <code>.env</code> file and restart Pulse. On Vercel, add it in Project Settings → Environment Variables, then redeploy.
          </div>
        )}
        {assistantStatus === 'unavailable' && (
          <div role="status" className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Kairo’s API is unavailable. Restart the local Pulse server or check that the latest Vercel deployment completed successfully.
          </div>
        )}
        
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
                    {/* Render the lightweight Markdown used in Kairo replies. */}
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
                        if (line.startsWith('- ')) {
                          return <span key={i} className="block pl-2 border-l-2 border-[#7C9070] my-1">{renderInlineMarkdown(line.substring(2))}</span>;
                        }
                        return <p key={i}>{renderInlineMarkdown(line)}</p>;
                      })}
                    </div>
                  </div>

                  {msg.id === failedMessageId && failedQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessages(prev => prev.filter(item => item.id !== failedMessageId));
                        handleSend(failedQuery);
                      }}
                      disabled={loading}
                      className="text-[11px] font-semibold text-[#7C9070] hover:text-[#5a6a50] disabled:opacity-40 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  )}

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

