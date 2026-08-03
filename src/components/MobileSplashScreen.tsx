import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Smartphone, CheckCircle } from 'lucide-react';
import quizWizLogo from '../assets/images/quizwiz_brand_logo_1785294045713.jpg';

interface MobileSplashScreenProps {
  onFinish?: () => void;
}

export const MobileSplashScreen: React.FC<MobileSplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFading(true);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 500);
          }, 300);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#040112] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full flex justify-between items-center opacity-60">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" /> QuizWiz Mobile
        </span>
        <span className="text-[10px] font-mono font-bold text-white/50">v2.5 Full Edition</span>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 max-w-sm my-auto">
        {/* Glowing Brand Mascot Logo */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400 via-purple-600 to-pink-500 opacity-70 blur-2xl animate-pulse"></div>
          <div className="relative p-2 bg-slate-950 border-2 border-amber-400/50 rounded-3xl shadow-2xl overflow-hidden artistic-glow-yellow">
            <img
              src={quizWizLogo}
              alt="QuizWiz Official Brand Logo"
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-2xl bg-[#070214]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            QuizWiz
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-teal-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>LEARN SMART, PLAY SMARTER!</span>
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-white/60 font-bold">
            <span>Loading Modules...</span>
            <span className="text-amber-300">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] font-medium text-white/40 flex items-center gap-1">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
        <span>Optimized for Standalone Android & Mobile Performance</span>
      </div>
    </div>
  );
};
