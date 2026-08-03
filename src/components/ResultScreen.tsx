import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { QuizProgress } from '../types/quiz';
import { soundFx } from '../services/soundFx';
import { useAuth } from '../context/AuthContext';
import { AnimatedAvatar } from './avatars/AnimatedAvatar';

interface ResultScreenProps {
  progress: QuizProgress;
  onRetakeQuiz: () => void;
  onChangeSubject: () => void;
  onViewLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  progress,
  onRetakeQuiz,
  onChangeSubject,
  onViewLeaderboard
}) => {
  const { currentUser } = useAuth();
  const totalQuestions = progress.questions.length;
  const maxScore = totalQuestions * 10;
  const percentage = Math.round((progress.score / maxScore) * 100);

  // Trigger celebration confetti on mount if score >= 50%
  useEffect(() => {
    if (percentage >= 50) {
      soundFx.playCheer();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { title: 'Master Mind! 🏆', desc: 'Outstanding job! You completely aced this quiz.' };
    if (percentage >= 70) return { title: 'Great Performance! 🌟', desc: 'Impressive knowledge across this topic.' };
    if (percentage >= 50) return { title: 'Good Effort! 👍', desc: 'Solid attempt! Keep practicing to push for 100%.' };
    return { title: 'Keep Practicing! 💪', desc: 'Don\'t give up! Review your answers below and try again.' };
  };

  const perf = getPerformanceMessage();
  const timeSpent = progress.timeSpentSeconds
    ? `${Math.floor(progress.timeSpentSeconds / 60)}m ${progress.timeSpentSeconds % 60}s`
    : 'Fast';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Result Hero Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-slate-950 text-center shadow-2xl relative overflow-hidden space-y-6 artistic-glow-yellow">
        
        <div className="flex items-center justify-center gap-4">
          {currentUser && (
            <div className="p-1 bg-slate-950/20 backdrop-blur-md rounded-full shadow-2xl">
              <AnimatedAvatar
                avatarId={currentUser.avatar}
                size="xl"
                showBadge={true}
                animate={true}
              />
            </div>
          )}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950 text-amber-400 shadow-2xl transform hover:scale-110 transition-transform artistic-glow-yellow">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 bg-slate-950/20 backdrop-blur-md rounded-full text-[10px] font-black text-slate-950 uppercase tracking-widest">
            {progress.categoryName} Quiz Completed
          </span>
          <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-slate-950 drop-shadow-md">
            {perf.title}
          </h1>
          <p className="text-sm font-bold text-slate-950/80 max-w-md mx-auto">
            {perf.desc}
          </p>
        </div>

        {/* Big Score Counter Badge */}
        <div className="bg-slate-950/20 backdrop-blur-xl border border-slate-950/20 rounded-3xl p-6 max-w-sm mx-auto shadow-inner grid grid-cols-2 gap-4">
          <div className="border-r border-slate-950/20 pr-2">
            <p className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">Final Score</p>
            <p className="text-3xl sm:text-4xl font-black text-slate-950 mt-1 font-mono">
              {progress.score} <span className="text-xs font-bold text-slate-950/60">/ {maxScore}</span>
            </p>
          </div>
          <div className="pl-2">
            <p className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">Accuracy</p>
            <p className="text-3xl sm:text-4xl font-black text-slate-950 mt-1 font-mono">
              {percentage}%
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-950 font-black uppercase tracking-wider pt-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Difficulty: <strong>{progress.difficulty}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Time Taken: <strong>{timeSpent}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onRetakeQuiz();
            }}
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 transform hover:scale-105"
            id="result-retake-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Quiz</span>
          </button>
          
          <button
            onClick={() => {
              soundFx.playClick();
              onChangeSubject();
            }}
            className="px-6 py-3.5 bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-950/20 transition-all flex items-center gap-2"
            id="result-subjects-btn"
          >
            <BookOpen className="w-4 h-4" />
            <span>Change Subject</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onViewLeaderboard();
            }}
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 transform hover:scale-105"
            id="result-leaderboard-btn"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>View Leaderboard</span>
          </button>
        </div>

      </div>

      {/* Comprehensive Answers Breakdown */}
      <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Detailed Question Review</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-0.5">
              Review your selected choices against the verified answers
            </p>
          </div>
          <span className="px-3.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white rounded-full text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-white/10">
            {progress.questions.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {progress.questions.map((q, idx) => {
            const userChoice = progress.selectedAnswers[idx];
            const isCorrect = userChoice === q.correctAnswer;

            return (
              <div
                key={q.id || idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCorrect
                    ? 'border-emerald-400/50 bg-emerald-500/10'
                    : 'border-rose-400/50 bg-rose-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  {isCorrect ? (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Correct
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium pt-1">
                  <div className={`p-3 rounded-xl border ${
                    isCorrect
                      ? 'bg-slate-50 dark:bg-white/5 border-emerald-400/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-white/5 border-rose-400/30 text-rose-800 dark:text-rose-200'
                  }`}>
                    <span className="block text-[10px] text-slate-400 dark:text-white/50 font-black uppercase tracking-wider">Your Answer</span>
                    <span className="font-bold">{userChoice || 'Not answered'}</span>
                  </div>

                  {!isCorrect && (
                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-white/5 border-emerald-400/30 text-emerald-800 dark:text-emerald-200">
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider">Correct Answer</span>
                      <span className="font-bold">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
