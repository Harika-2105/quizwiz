import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Baby,
  Gamepad2,
  Edit3,
  User,
  X,
  Check,
  Smile,
  Wand2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QUIZ_CATEGORIES } from '../services/quizApi';
import { soundFx } from '../services/soundFx';
import { validateUsernameRules } from '../services/firebase';
import { AnimatedAvatar } from './avatars/AnimatedAvatar';
import { AvatarPickerModal } from './avatars/AvatarPickerModal';
import { getAvatarById } from './avatars/avatarCatalog';

interface DashboardProps {
  onStartCategory: (catId: number | string) => void;
  onResumeQuiz: () => void;
  onGoToLeaderboard: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartCategory,
  onResumeQuiz,
  onGoToLeaderboard
}) => {
  const { currentUser, activeProgress, clearUserProgress, updateUsername, updateAvatar } = useAuth();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isChoosingAvatar, setIsChoosingAvatar] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const currentAvatarInfo = getAvatarById(currentUser?.avatar);

  const handleOpenEditUsername = () => {
    setNewUsernameInput(currentUser?.username || currentUser?.displayName || '');
    setEditError(null);
    setEditSuccess(null);
    setIsEditingUsername(true);
  };

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    const validation = validateUsernameRules(newUsernameInput);
    if (!validation.valid) {
      setEditError(validation.error || 'Invalid username format.');
      return;
    }

    setIsSavingUsername(true);
    try {
      await updateUsername(newUsernameInput.trim());
      soundFx.playCheer();
      setEditSuccess('Username updated successfully!');
      setTimeout(() => {
        setIsEditingUsername(false);
        setEditSuccess(null);
      }, 1200);
    } catch (err: any) {
      console.error('Error updating username:', err);
      setEditError(err.message || 'Failed to update username. Try another username.');
    } finally {
      setIsSavingUsername(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Card & Avatar Spotlight */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-2xl border border-white/20 relative overflow-hidden artistic-glow-yellow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-950/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-slate-950">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>QuizWiz Player Profile</span>
              </div>

              <button
                onClick={handleOpenEditUsername}
                className="px-3.5 py-1 bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border border-slate-950/20"
                id="dashboard-edit-username-btn"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Username</span>
              </button>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">
                Welcome back, @{currentUser?.username || currentUser?.displayName || 'player'}!
              </h1>
              <p className="text-xs text-slate-950/80 font-bold font-mono mt-1.5">
                Linked Email: {currentUser?.email}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-950/80 font-bold">
              Equip an animated gaming avatar to personalize your rank on leaderboards and in multiplayer zones!
            </p>
          </div>

          {/* Interactive Avatar Spotlight Box */}
          <div className="bg-slate-950/25 backdrop-blur-md border border-slate-950/20 rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center space-y-3 shrink-0 shadow-xl max-w-xs w-full">
            <div className="relative group cursor-pointer" onClick={() => setIsChoosingAvatar(true)}>
              <AnimatedAvatar
                avatarId={currentUser?.avatar}
                size="2xl"
                showBadge={true}
                animate={true}
                className="group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-amber-300 transition-opacity">
                <Smile className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-tight text-slate-950">
                {currentAvatarInfo.name}
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-950/70">
                {currentAvatarInfo.categoryLabel}
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsChoosingAvatar(true);
              }}
              className="w-full py-2.5 px-4 bg-slate-950 text-white hover:bg-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              id="dashboard-choose-avatar-main-btn"
            >
              <Smile className="w-4 h-4 text-amber-400" />
              <span>Choose Avatar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Edit Username Modal */}
      {isEditingUsername && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F0529] border border-white/15 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Edit Custom Username</h3>
                  <p className="text-[11px] text-white/50">3 to 15 characters, alphanumeric & underscores</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingUsername(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-bold">
                ⚠️ {editError}
              </div>
            )}

            {editSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveUsername} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1.5">
                  New Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-mono font-bold text-sm">@</span>
                  <input
                    type="text"
                    required
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    maxLength={15}
                    placeholder="e.g. quiz_master99"
                    className="w-full bg-white/5 border border-amber-400/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-300"
                    id="edit-username-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingUsername}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  id="save-username-btn"
                >
                  {isSavingUsername ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Username</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingUsername(false)}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-4 backdrop-blur-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg artistic-glow-yellow">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-white/50 uppercase tracking-widest">High Score</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {currentUser?.highScore || 0} <span className="text-xs font-bold text-amber-500">PTS</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-4 backdrop-blur-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg artistic-glow-purple">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-white/50 uppercase tracking-widest">Completed Quizzes</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {currentUser?.totalQuizzesCompleted || 0}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-4 backdrop-blur-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-white/50 uppercase tracking-widest">Sync Status</p>
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 inline" /> Live Cloud Sync
            </p>
          </div>
        </div>

      </div>

      {/* Active Session Resume Box */}
      {activeProgress && !activeProgress.completed && (
        <div className="bg-white dark:bg-white/5 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-400/50 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" /> Ongoing Quiz Session
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Resume {activeProgress.categoryName} Quiz
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 font-medium">
              You are currently on Question {activeProgress.currentQuestionIndex + 1} of {activeProgress.amount} with a score of <strong className="text-amber-600 dark:text-amber-400 font-bold">{activeProgress.score} pts</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                onResumeQuiz();
              }}
              className="flex-1 md:flex-none px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 artistic-glow-yellow"
              id="dashboard-resume-btn"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Quiz</span>
            </button>
            
            <button
              onClick={async () => {
                if (confirm('Discard this ongoing quiz session?')) {
                  soundFx.playClick();
                  await clearUserProgress();
                }
              }}
              className="p-3.5 bg-slate-100 dark:bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-2xl border border-slate-200 dark:border-white/10 transition-colors"
              title="Discard session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Launch Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
            Quick Launch Category
          </h2>
          <button
            onClick={() => {
              soundFx.playClick();
              onGoToLeaderboard();
            }}
            className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>View Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUIZ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                onStartCategory(cat.id);
              }}
              className="p-5 bg-white dark:bg-[#0F0529] rounded-2xl border border-slate-200 dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all text-center space-y-2.5 group backdrop-blur-xl shadow-sm hover:shadow-md"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform artistic-glow-purple`}>
                {cat.isKidsZone ? <Baby className="w-5 h-5" /> : cat.isRiddleWorld ? <Gamepad2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 truncate uppercase tracking-tight">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {currentUser && (
        <AvatarPickerModal
          isOpen={isChoosingAvatar}
          currentAvatarId={currentUser.avatar}
          username={currentUser.username || currentUser.displayName}
          onClose={() => setIsChoosingAvatar(false)}
          onSelectAvatar={async (newAvatarId) => {
            await updateAvatar(newAvatarId);
          }}
        />
      )}

    </div>
  );
};
