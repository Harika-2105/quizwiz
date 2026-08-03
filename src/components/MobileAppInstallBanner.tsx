import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, Sparkles, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import quizWizLogo from '../assets/images/quizwiz_brand_logo_1785294045713.jpg';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const MobileAppInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowApkGuide(true);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <>
      {/* Sticky Bottom/Top Banner for Mobile App Install */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 border-y border-amber-400/30 p-3 sm:p-4 text-white shadow-2xl relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={quizWizLogo}
              alt="QuizWiz App Icon"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl bg-slate-950 p-0.5 border border-amber-400/40 shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-tight text-amber-300 truncate">
                  QuizWiz Mobile App
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-bold rounded-full border border-teal-500/30">
                  Full Screen • No Browser UI
                </span>
              </div>
              <p className="text-[11px] text-white/70 truncate">
                Install as a native app on your phone home screen!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 artistic-glow-yellow"
              id="pwa-install-banner-btn"
            >
              <Smartphone className="w-4 h-4 fill-slate-950" />
              <span>{deferredPrompt ? 'Install App' : 'Get Mobile App'}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              id="dismiss-install-banner-btn"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* APK & PWA Guide Modal */}
      {showApkGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F0529] border border-amber-400/30 text-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-amber-300">Install QuizWiz Mobile App</h3>
                  <p className="text-xs text-white/60">Android & iOS Installation Guide</p>
                </div>
              </div>
              <button
                onClick={() => setShowApkGuide(false)}
                className="p-2 text-white/60 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Option 1: Add to Home Screen (Instant Mobile App)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-white/80 font-medium pl-1">
                  <li>Tap your browser's menu button <strong>(⋮ or Share icon)</strong>.</li>
                  <li>Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.</li>
                  <li>QuizWiz will open as a full-screen, fast mobile app with custom icon!</li>
                </ol>
              </div>

              <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Option 2: Generate Standalone Android APK</span>
                </div>
                <p className="text-white/80 font-medium leading-relaxed">
                  To turn this application into a standalone Android APK file, you can upload the app URL to <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold">PWABuilder.com</a> or use Bubblewrap CLI to package it into an APK file instantly.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowApkGuide(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              Got It, Launch App!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
