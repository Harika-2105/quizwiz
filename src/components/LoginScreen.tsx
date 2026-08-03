import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Flame, Eye, EyeOff, User, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateUsernameRules } from '../services/firebase';
import quizWizLogo from '../assets/images/quizwiz_brand_logo_1785294045713.jpg';

export const LoginScreen: React.FC = () => {
  const { login, signup, isFirebase } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp) {
      if (!username.trim()) {
        setError('Please create a unique username.');
        return;
      }
      const rulesCheck = validateUsernameRules(username);
      if (!rulesCheck.valid) {
        setError(rulesCheck.error || 'Invalid username format.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password, username.trim());
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err.message || 'Authentication failed. Please check your details.';
      setError(msg);
      if (msg.includes('Firebase Console') || msg.includes('Email/Password')) {
        setShowFirebaseGuide(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = 'demo.wiz@quizwiz.com';
      const demoPass = 'quizwiz123';
      try {
        await login(demoEmail, demoPass);
      } catch {
        // If demo user doesn't exist yet, sign them up with custom username
        await signup(demoEmail, demoPass, 'demo_wiz');
      }
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0A001F] text-white relative overflow-hidden">
      
      {/* Background Decorative Playful Glow Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Category Badges */}
      <div className="hidden lg:block absolute top-1/4 left-12 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-xs font-black text-amber-300 shadow-2xl transform -rotate-6 animate-bounce">
        🧪 Science & Nature 🔬
      </div>
      <div className="hidden lg:block absolute bottom-1/4 right-12 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-xs font-black text-pink-300 shadow-2xl transform rotate-6 animate-bounce delay-300">
        💻 Computers & Tech ⚡
      </div>

      <div className="w-full max-w-md bg-[#0F0529] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-2xl">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 shadow-xl mb-3 artistic-glow-yellow">
            <img
              src={quizWizLogo}
              alt="QuizWiz Logo"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain rounded-xl bg-slate-950 p-0.5"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
            Welcome to QuizWiz
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">
            {isSignUp ? 'Create your player profile & start playing' : 'Sign in to access your saved quiz progress'}
          </p>
        </div>

        {/* Firebase / Storage Banner */}
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 text-xs text-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFirebase ? (
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="font-bold uppercase tracking-wider text-[10px]">
                {isFirebase ? 'Firebase Auth & Firestore' : 'Persistent User Database'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isFirebase && (
                <button
                  type="button"
                  onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white/90 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  id="toggle-firebase-guide-btn"
                >
                  <HelpCircle className="w-3 h-3 text-amber-300" />
                  <span>Setup Guide</span>
                  {showFirebaseGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-400/30">
                Active
              </span>
            </div>
          </div>

          {/* Expandable Firebase Setup Instructions */}
          {showFirebaseGuide && (
            <div className="mt-2 p-3 bg-slate-900/90 border border-amber-400/30 rounded-xl text-[11px] text-white/90 space-y-2 font-sans animate-fadeIn">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>🔥 How to Enable Firebase Email/Password Login:</span>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-1 text-[10px]"
                >
                  Open Console <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-white/80 pl-1 font-medium">
                <li>Go to <strong className="text-white">Firebase Console</strong> and select your project.</li>
                <li>In the left sidebar, click <strong className="text-white">Authentication</strong>.</li>
                <li>Click the <strong className="text-white">Sign-in method</strong> tab.</li>
                <li>Select <strong className="text-white">Email/Password</strong> under Native providers.</li>
                <li>Toggle <strong className="text-amber-300">Enable</strong> (first switch) and click <strong className="text-white">Save</strong>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-white/5 p-1 rounded-2xl mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              !isSignUp
                ? 'bg-yellow-400 text-slate-950 shadow-lg artistic-glow-yellow'
                : 'text-white/60 hover:text-white'
            }`}
            id="auth-tab-login"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              isSignUp
                ? 'bg-yellow-400 text-slate-950 shadow-lg artistic-glow-yellow'
                : 'text-white/60 hover:text-white'
            }`}
            id="auth-tab-signup"
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-300">
                  Custom Username
                </label>
                <span className="text-[10px] text-white/40 font-mono">3-15 chars (a-z, 0-9, _)</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required={isSignUp}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="e.g. quiz_master99"
                  maxLength={15}
                  className="w-full bg-white/5 border border-amber-400/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-300 transition-all font-mono font-bold"
                  id="auth-username-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-all font-medium"
                id="auth-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-all font-medium"
                id="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 hover:from-yellow-300 hover:to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 artistic-glow-yellow"
            id="auth-submit-btn"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isSignUp ? 'Create Profile & Start' : 'Log In & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-white/50 mb-3 font-medium">Want to quickly test without registering?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/30 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            id="auth-demo-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Account Login</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-2 gap-2 text-[10px] text-white/50 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>OpenTDB API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Auto-Resume</span>
          </div>
        </div>

      </div>
    </div>
  );
};
