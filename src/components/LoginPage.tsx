import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { KairoCompanion } from './Illustrations';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Lock, Mail, User, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { continueToPulse, login, loginAsGuest, signup, loading, error, clearError } = usePulse();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (mode === 'signin') {
        await login(email.trim(), password, name.trim());
      } else {
        await signup(name.trim(), email.trim(), password);
      }
    } catch {
      // Error handled in context state
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1B] flex flex-col justify-between selection:bg-[#7C9070]/20 font-sans">
      
      {/* Subtle Top Header */}
      <header className="border-b border-[#EBE9E0] bg-white/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7C9070] flex items-center justify-center text-white shadow-md shadow-[#7C9070]/10 relative overflow-hidden">
              <span className="font-display font-black text-sm select-none">P</span>
              <span className="absolute inset-0 border border-white rounded-full scale-75 animate-ping opacity-30" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight leading-none text-[#1A1A1B]">
                Pulse
              </h1>
              <span className="text-[9px] font-mono font-bold text-[#1A1A1B]/40 block tracking-wider uppercase">
                Student OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#1A1A1B]/60 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#7C9070]" />
            <span>Secure Mindful Workspace</span>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EBE9E0] shadow-sm relative overflow-hidden"
        >
          {/* Decorative Kairo Mascot */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-[#F5F1E9] p-3 rounded-full border border-[#EBE9E0] mb-3">
              <KairoCompanion size={64} expression="happy" />
            </div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#1A1A1B]">
              Welcome to Pulse
            </h2>
            <p className="text-xs text-[#1A1A1B]/60 mt-1 max-w-xs font-medium">
              Transform syllabus overload, bills, and deadlines into a calm, balanced day.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F5F1E9] border border-[#EBE9E0] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setValidationError(null);
                clearError();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#1A1A1B] shadow-sm border border-[#EBE9E0]'
                  : 'text-[#1A1A1B]/60 hover:text-[#1A1A1B]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setValidationError(null);
                clearError();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1A1A1B] shadow-sm border border-[#EBE9E0]'
                  : 'text-[#1A1A1B]/60 hover:text-[#1A1A1B]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {(validationError || error) && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Direct Access: Continue to Pulse */}
          <button
            type="button"
            onClick={() => continueToPulse()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#5E7353] hover:bg-[#506246] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5E7353]/20 cursor-pointer hover:scale-[1.01]"
          >
            <span>Continue to Pulse</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-[#EBE9E0]" />
            <span className="text-[10px] uppercase font-bold text-[#1A1A1B]/40 tracking-wider">or sign in with email</span>
            <div className="flex-1 h-[1px] bg-[#EBE9E0]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#1A1A1B]/70 uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#1A1A1B]/40 absolute left-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1B] placeholder-[#1A1A1B]/30 focus:outline-none focus:border-[#7C9070] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#1A1A1B]/70 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#1A1A1B]/40 absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1B] placeholder-[#1A1A1B]/30 focus:outline-none focus:border-[#7C9070] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1A1A1B]/70 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#1A1A1B]/40 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF9F6] border border-[#EBE9E0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1A1A1B] placeholder-[#1A1A1B]/30 focus:outline-none focus:border-[#7C9070] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#1A1A1B]/40 hover:text-[#1A1A1B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C9070] hover:bg-[#6b7d60] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => loginAsGuest('Student')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#1A1A1B]/60 hover:text-[#1A1A1B] hover:bg-[#FAF9F6] border border-dashed border-[#EBE9E0] rounded-xl transition-colors cursor-pointer mt-2 text-center"
            >
              Instant Preview (Guest Mode)
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-[#EBE9E0] flex items-center justify-center gap-1.5 text-[10px] text-[#1A1A1B]/40 text-center font-medium">
            <CheckCircle2 className="w-3 h-3 text-[#7C9070]" />
            <span>Private & Encrypted Local Session</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EBE9E0] bg-white/40 py-4 text-center text-[11px] text-[#1A1A1B]/40 font-medium">
        Pulse: Intelligent Student Life & Focus Operating System
      </footer>
    </div>
  );
};
