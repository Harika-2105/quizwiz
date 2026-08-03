import React, { useState } from 'react';
import { Sparkles, LogOut, Award, CheckCircle2, User as UserIcon, Flame, Trophy, Play, Palette, Volume2, VolumeX, Baby, Gamepad2, Zap, Smile, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, AppTheme } from '../context/ThemeContext';
import { AnimatedAvatar } from './avatars/AnimatedAvatar';
import { AvatarPickerModal } from './avatars/AvatarPickerModal';
import quizWizLogo from '../assets/images/quizwiz_brand_logo_1785294045713.jpg';

interface HeaderProps {
  currentTab: 'subjects' | 'quiz' | 'leaderboard' | 'dashboard' | 'gamezone';
  setCurrentTab: (tab: 'subjects' | 'quiz' | 'leaderboard' | 'dashboard' | 'gamezone') => void;
  onOpenAuthModal?: () => void;
  onSelectKidsZone?: () => void;
  onSelectRiddleWorld?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuthModal,
  onSelectKidsZone,
  onSelectRiddleWorld
}) => {
  const { currentUser, logout, isFirebase, activeProgress, updateAvatar } = useAuth();
  const { theme, setThemeMode, soundEnabled, toggleSound } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0A001F]/90 dark:bg-[#0A001F]/90 light:bg-white/80 backdrop-blur-xl border-b border-white/10 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentTab('subjects')}
          className="flex items-center gap-3 group focus:outline-none rounded-2xl p-1 transition-all shrink-0 hover:opacity-95"
          id="header-logo-btn"
          title="Return to Home Screen"
        >
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 artistic-glow-yellow group-hover:scale-105 transition-transform">
            <img
              src={quizWizLogo}
              alt="QuizWiz Official Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 object-contain rounded-[14px] bg-slate-950 p-0.5 shadow-md border border-white/20"
            />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white drop-shadow-md">
              QuizWiz
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-white/50">
              <span>Dynamic Trivia</span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="flex items-center text-amber-500 dark:text-amber-400 font-bold">
                {isFirebase ? (
                  <>
                    <Flame className="w-3 h-3 mr-0.5 text-orange-500 inline" />
                    Firebase
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-500 inline" />
                    Live Sync
                  </>
                )}
              </span>
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => setCurrentTab('subjects')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                currentTab === 'subjects'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              id="nav-subjects-btn"
            >
              Subjects
            </button>

            {onSelectKidsZone && (
              <button
                onClick={onSelectKidsZone}
                className="px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md hover:scale-105 flex items-center gap-1 animate-bounce-subtle"
                id="nav-kidszone-btn"
                title="Kids Zone (Age < 8)"
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Kids Zone</span>
              </button>
            )}

            {onSelectRiddleWorld && (
              <button
                onClick={onSelectRiddleWorld}
                className="px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md hover:scale-105 flex items-center gap-1"
                id="nav-riddles-btn"
                title="Riddle & Game World"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Riddles</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('gamezone')}
              className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'gamezone'
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
              }`}
              id="nav-gamezone-btn"
              title="Arcade Game Zone (18 Mini-Games)"
            >
              <Gamepad2 className="w-4 h-4 text-pink-400" />
              <span>Game Zone</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              id="nav-dashboard-btn"
            >
              Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              id="nav-leaderboard-btn"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Leaderboard
            </button>
          </nav>
        )}

        {/* Right Action Bar (Sound, Resume, User Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Sound FX Toggle Switch */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border transition-all focus:outline-none ${
              soundEnabled
                ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40'
                : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            id="header-sound-btn"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {activeProgress && !activeProgress.completed && currentTab !== 'quiz' && (
            <button
              onClick={() => setCurrentTab('quiz')}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl artistic-glow-yellow transition-all transform hover:scale-105 shrink-0"
              id="header-resume-quiz-btn"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume ({activeProgress.currentQuestionIndex + 1}/{activeProgress.amount})</span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-2xl transition-all focus:outline-none"
                id="header-user-menu-btn"
              >
                <AnimatedAvatar
                  avatarId={currentUser.avatar}
                  size="sm"
                  showBadge={true}
                  animate={true}
                />
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-xs font-black text-slate-900 dark:text-white max-w-[110px] truncate tracking-tight">
                    @{currentUser.username || currentUser.displayName || 'user'}
                  </p>
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500 inline" />
                    <span>{currentUser.highScore || 0} PTS</span>
                  </p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0F0529] border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-white">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
                    <AnimatedAvatar
                      avatarId={currentUser.avatar}
                      size="md"
                      animate={true}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-white/50">Player Identity</p>
                      <p className="text-xs font-black text-amber-500 dark:text-amber-400 font-mono truncate mt-0.5">
                        @{currentUser.username || currentUser.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-white/40 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAvatarModalOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors border-b border-slate-100 dark:border-white/5"
                    id="header-choose-avatar-btn"
                  >
                    <Smile className="w-4 h-4 text-amber-400" />
                    <span>Choose Animated Avatar</span>
                  </button>
                  
                  {onSelectKidsZone && (
                    <button
                      onClick={() => {
                        onSelectKidsZone();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <Baby className="w-4 h-4" />
                      <span>Kids Zone (Under 8)</span>
                    </button>
                  )}

                  {onSelectRiddleWorld && (
                    <button
                      onClick={() => {
                        onSelectRiddleWorld();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Riddle & Game World</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setCurrentTab('dashboard');
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-purple-500" />
                    <span>Dashboard & Stats</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('leaderboard');
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Global Leaderboard</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-white/10"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 flex items-center gap-2.5 transition-colors"
                    id="header-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-yellow-300 transition-all"
              id="header-login-btn"
            >
              Log In / Sign Up
            </button>
          )}
        </div>

      </div>

      {/* Mobile Top Navigation Pills Bar (Visible on mobile screens) */}
      {currentUser && (
        <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2.5 bg-[#060114] border-t border-white/10 no-scrollbar">
          <button
            onClick={() => setCurrentTab('subjects')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
              currentTab === 'subjects'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 border border-white/10 text-white/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subjects</span>
          </button>

          {onSelectKidsZone && (
            <button
              onClick={onSelectKidsZone}
              className="px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md flex items-center gap-1 shrink-0"
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Kids Zone</span>
            </button>
          )}

          {onSelectRiddleWorld && (
            <button
              onClick={onSelectRiddleWorld}
              className="px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Riddles</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('gamezone')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              currentTab === 'gamezone'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-pink-500 text-white shadow-lg scale-105 artistic-glow-purple'
                : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/40 text-purple-200'
            }`}
            id="mobile-nav-gamezone-top-btn"
          >
            <Gamepad2 className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>🎮 Game Zone</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 border border-white/10 text-white/80'
            }`}
          >
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
              currentTab === 'leaderboard'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 border border-white/10 text-white/80'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
        </div>
      )}

      {currentUser && (
        <AvatarPickerModal
          isOpen={avatarModalOpen}
          currentAvatarId={currentUser.avatar}
          username={currentUser.username || currentUser.displayName}
          onClose={() => setAvatarModalOpen(false)}
          onSelectAvatar={async (newAvatarId) => {
            await updateAvatar(newAvatarId);
          }}
        />
      )}

      {/* Fixed Bottom Navigation Bar for Mobile Devices */}
      {currentUser && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070119]/95 backdrop-blur-2xl border-t border-purple-500/20 py-2 px-3 flex justify-around items-center text-white shadow-2xl">
          <button
            onClick={() => setCurrentTab('subjects')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-tight transition-all ${
              currentTab === 'subjects' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Subjects</span>
          </button>

          {onSelectKidsZone && (
            <button
              onClick={onSelectKidsZone}
              className="flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-tight text-pink-400 hover:text-pink-300"
            >
              <Baby className="w-5 h-5" />
              <span>Kids</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('gamezone')}
            className={`relative flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-tight transition-all p-2 rounded-2xl ${
              currentTab === 'gamezone'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110 -translate-y-2 border border-amber-300/50'
                : 'text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/30'
            }`}
            id="mobile-bottom-gamezone-btn"
          >
            <Gamepad2 className={`w-6 h-6 ${currentTab === 'gamezone' ? 'text-amber-300 animate-bounce' : 'text-pink-400'}`} />
            <span>Game Zone</span>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full shadow">
              21
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-tight transition-all ${
              currentTab === 'dashboard' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-tight transition-all ${
              currentTab === 'leaderboard' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Leaders</span>
          </button>
        </div>
      )}
    </header>
  );
};
