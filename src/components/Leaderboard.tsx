import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types/quiz';
import { getLeaderboard } from '../services/firebase';
import { soundFx } from '../services/soundFx';
import { AnimatedAvatar } from './avatars/AnimatedAvatar';

interface LeaderboardProps {
  onBackToSubjects: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBackToSubjects: _onBackToSubjects }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScores = async () => {
    soundFx.playClick();
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 rounded-3xl p-8 sm:p-10 text-slate-950 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 artistic-glow-yellow">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-950/20 backdrop-blur-md rounded-full text-[10px] font-black text-slate-950 uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" />
            <span>Global Hall of Fame</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter italic uppercase italic leading-none">
            QuizWiz Top Players
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-950/80">
            Real-time high scores saved across Firestore database sessions
          </p>
        </div>

        <button
          onClick={fetchScores}
          disabled={loading}
          className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xl"
          id="leaderboard-refresh-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-4">
        
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-white/50">Loading leaderboard rankings...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-300 dark:text-white/30 mx-auto" />
            <p className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">No high scores registered yet.</p>
            <p className="text-xs text-slate-500 dark:text-white/50">Be the first player to complete a quiz and claim 1st place!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              let rankBadge = <span className="text-sm font-black text-slate-400 dark:text-white/50">#{rank}</span>;
              let rowStyle = 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10';

              if (rank === 1) {
                rankBadge = <span className="text-2xl">🥇</span>;
                rowStyle = 'bg-amber-400/20 border-amber-400/40 artistic-glow-yellow';
              } else if (rank === 2) {
                rankBadge = <span className="text-2xl">🥈</span>;
                rowStyle = 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20';
              } else if (rank === 3) {
                rankBadge = <span className="text-2xl">🥉</span>;
                rowStyle = 'bg-orange-500/20 border-orange-400/30';
              }

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${rowStyle}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 shadow-inner">
                      {rankBadge}
                    </div>

                    <AnimatedAvatar
                      avatarId={entry.avatar}
                      size="md"
                      animate={true}
                    />

                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-900 dark:text-white truncate tracking-tight font-mono">
                        @{entry.displayName || 'player'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-white/60 truncate">
                        {entry.categoryName} • <span className="text-slate-400 dark:text-white/40">{entry.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                      {entry.score} <span className="text-xs text-slate-400 dark:text-white/50 font-normal">PTS</span>
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {entry.percentage}% Accuracy
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
