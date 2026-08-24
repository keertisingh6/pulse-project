import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { KairoCompanion } from './Illustrations';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginAsGuest, signup, loading, error, clearError } = usePulse();
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

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    try {
      await loginWithGoogle();
    } catch {
      // Error handled in context state
    }
  };

  const handleGuestLogin = () => {
    setValidationError(null);
    clearError();
    loginAsGuest(name.trim() || 'Keerti');
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
                Life Inbox
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

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#FAF9F6] hover:bg-[#F5F1E9] border border-[#EBE9E0] rounded-xl text-xs font-bold text-[#1A1A1B] transition-colors cursor-pointer disabled:opacity-50 mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-[#EBE9E0]" />
            <span className="text-[10px] uppercase font-bold text-[#1A1A1B]/40 tracking-wider">or with email</span>
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
                    placeholder="Keerti Singh"
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
                  placeholder="keerti@example.com"
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
          </form>

          {/* Demo / Guest Access Shortcut */}
          <div className="mt-6 pt-5 border-t border-[#EBE9E0] text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-xs font-semibold text-[#7C9070] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Demo Mode (Instant Access)</span>
            </button>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#1A1A1B]/40 text-center font-medium">
            <CheckCircle2 className="w-3 h-3 text-[#7C9070]" />
            <span>Private & Encrypted Local Session</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EBE9E0] bg-white/40 py-4 text-center text-[11px] text-[#1A1A1B]/40 font-medium">
        Pulse: Next-Generation Life Inbox & Mindful Day Planner
      </footer>
    </div>
  );
};
