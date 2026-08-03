import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Save,
  HelpCircle,
  Sparkles,
  Flame,
  Clock,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Baby,
  Gamepad2,
  Award,
  Zap
} from 'lucide-react';
import { QuizProgress, QuizQuestion } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { saveScoreToLeaderboard } from '../services/firebase';
import { soundFx } from '../services/soundFx';
import { AnimatedAvatar } from './avatars/AnimatedAvatar';

interface QuizScreenProps {
  progress: QuizProgress;
  onFinishQuiz: (finalProgress: QuizProgress) => void;
  onExitToSubjects: () => void;
}

// Animated Background component for Kids Zone
const AnimatedKidsBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80">
      {/* Floating Cloud 1 */}
      <div className="absolute top-12 -left-24 animate-cloud-slow text-pink-300/40 text-7xl select-none">
        ☁️
      </div>
      {/* Floating Cloud 2 */}
      <div className="absolute top-36 -right-24 animate-cloud-reverse text-blue-300/40 text-8xl select-none">
        ☁️
      </div>

      {/* Floating Pastel Bubbles with Emojis */}
      <div className="absolute left-[10%] bottom-0 animate-bubble-1 text-4xl select-none">
        ⭐
      </div>
      <div className="absolute left-[35%] bottom-0 animate-bubble-2 text-5xl select-none">
        🎨
      </div>
      <div className="absolute left-[65%] bottom-0 animate-bubble-3 text-4xl select-none">
        🎈
      </div>
      <div className="absolute left-[85%] bottom-0 animate-bubble-1 text-5xl select-none">
        🌈
      </div>

      {/* Rotating Stars in corners */}
      <div className="absolute top-20 left-[20%] animate-star-pulse text-amber-300/60 text-3xl select-none">
        ✨
      </div>
      <div className="absolute top-48 right-[18%] animate-star-pulse text-purple-300/60 text-3xl select-none">
        🌟
      </div>
    </div>
  );
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  progress,
  onFinishQuiz,
  onExitToSubjects
}) => {
  const { currentUser, saveCurrentProgress } = useAuth();

  const [currentIdx, setCurrentIdx] = useState<number>(progress.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    progress.selectedAnswers || {}
  );
  const [score, setScore] = useState<number>(progress.score || 0);
  const [streak, setStreak] = useState<number>(progress.streakCount || 0);
  const [saving, setSaving] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // STRICT 2-MINUTE TIMER PER QUESTION (120 seconds)
  const [questionTimer, setQuestionTimer] = useState<number>(120);

  // Total session timer
  const [totalTimerSeconds, setTotalTimerSeconds] = useState<number>(progress.timeSpentSeconds || 0);

  const currentQuestion: QuizQuestion | undefined = progress.questions[currentIdx];
  const totalQuestions = progress.questions.length;
  const currentChosenOption = selectedAnswers[currentIdx];

  // 1. Reset 2-minute timer on question index change
  useEffect(() => {
    setQuestionTimer(120);
    setShowHint(false);
  }, [currentIdx]);

  // 2. Per-Question 120s Timer Countdown & Auto-Skip
  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 15) {
          soundFx.playTick();
        }
        return prev - 1;
      });

      setTotalTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, selectedAnswers]);

  // Handle Question Timeout (Timer reached 0s)
  const handleTimeExpired = async () => {
    if (!selectedAnswers[currentIdx]) {
      const updatedAnswers = {
        ...selectedAnswers,
        [currentIdx]: '(Time Expired)'
      };
      setSelectedAnswers(updatedAnswers);
      soundFx.playIncorrect();

      // Auto-advance
      setTimeout(() => {
        handleNextQuestion(updatedAnswers);
      }, 1000);
    }
  };

  // Option selection handler
  const handleSelectOption = async (option: string) => {
    const prevAnswer = selectedAnswers[currentIdx];
    if (prevAnswer === option) return;

    let newScore = score;
    let newStreak = streak;
    const isCorrectNow = option === currentQuestion.correctAnswer;
    const wasCorrectBefore = prevAnswer === currentQuestion.correctAnswer;

    if (isCorrectNow && !wasCorrectBefore) {
      newScore += 10 + newStreak * 2; // Bonus points for streak
      newStreak += 1;
      soundFx.playCorrect();
    } else if (!isCorrectNow) {
      newStreak = 0;
      soundFx.playIncorrect();
      if (wasCorrectBefore) {
        newScore = Math.max(0, newScore - 10);
      }
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [currentIdx]: option
    };

    setSelectedAnswers(updatedAnswers);
    setScore(newScore);
    setStreak(newStreak);

    const updatedProgress: QuizProgress = {
      ...progress,
      currentQuestionIndex: currentIdx,
      selectedAnswers: updatedAnswers,
      score: newScore,
      streakCount: newStreak,
      completed: false,
      lastUpdated: new Date().toISOString(),
      timeSpentSeconds: totalTimerSeconds
    };

    setSaving(true);
    try {
      await saveCurrentProgress(updatedProgress);
    } catch (err) {
      console.error('Failed to auto-save progress:', err);
    } finally {
      setSaving(false);
    }
  };

  // Next Question / Complete Quiz
  const handleNextQuestion = async (overrideAnswers?: Record<number, string>) => {
    soundFx.playClick();
    const answersToUse = overrideAnswers || selectedAnswers;

    if (currentIdx < totalQuestions - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);

      const updatedProgress: QuizProgress = {
        ...progress,
        currentQuestionIndex: nextIdx,
        selectedAnswers: answersToUse,
        score,
        streakCount: streak,
        completed: false,
        lastUpdated: new Date().toISOString(),
        timeSpentSeconds: totalTimerSeconds
      };

      await saveCurrentProgress(updatedProgress);
    } else {
      // Complete Quiz!
      soundFx.playCheer();
      const finalProgress: QuizProgress = {
        ...progress,
        currentQuestionIndex: currentIdx,
        selectedAnswers: answersToUse,
        score,
        streakCount: streak,
        completed: true,
        lastUpdated: new Date().toISOString(),
        timeSpentSeconds: totalTimerSeconds
      };

      setSaving(true);
      await saveCurrentProgress(finalProgress);

      if (currentUser) {
        const percentage = Math.round((score / (totalQuestions * 10)) * 100);
        await saveScoreToLeaderboard({
          userId: currentUser.uid,
          displayName: currentUser.username || currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          avatar: currentUser.avatar,
          categoryName: progress.categoryName,
          score,
          totalQuestions,
          percentage,
          date: new Date().toISOString().split('T')[0]
        });
      }

      setSaving(false);
      onFinishQuiz(finalProgress);
    }
  };

  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);
  const timerMinutes = Math.floor(questionTimer / 60);
  const timerSecs = (questionTimer % 60).toString().padStart(2, '0');
  const isTimerLow = questionTimer <= 15;

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl text-center space-y-4 shadow-xl">
        <p className="text-sm font-semibold text-rose-500">No question data available.</p>
        <button
          onClick={onExitToSubjects}
          className="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Subjects
        </button>
      </div>
    );
  }

  const isKidsMode = progress.isKidsZone;

  return (
    <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${isKidsMode ? 'font-sans' : ''}`}>
      {/* Animated Background for Kids Zone */}
      {isKidsMode && <AnimatedKidsBackground />}

      {/* Quiz Top Status Bar */}
      <div className={`rounded-3xl p-5 sm:p-7 shadow-2xl border backdrop-blur-2xl space-y-5 transition-all ${
        isKidsMode
          ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-400 text-white border-pink-300'
          : 'bg-[#0F0529] dark:bg-[#0F0529] light:bg-white text-slate-900 dark:text-white border-slate-200 dark:border-white/10'
      }`}>
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Player & Category Badge */}
          <div className="flex items-center gap-2.5">
            {currentUser && (
              <AnimatedAvatar
                avatarId={currentUser.avatar}
                size="sm"
                animate={true}
              />
            )}
            <span className="px-3.5 py-1 bg-yellow-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 artistic-glow-yellow">
              {isKidsMode ? <Baby className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5" />}
              {progress.categoryName}
            </span>
            {streak > 1 && (
              <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-current text-orange-600" />
                {streak}x Streak!
              </span>
            )}
          </div>

          {/* STRICT 2-MINUTE TIMER & SCORE */}
          <div className="flex items-center gap-4 text-xs font-bold">
            
            {/* Countdown timer pill */}
            <div className={`px-4 py-1.5 rounded-full font-mono font-black flex items-center gap-2 transition-all ${
              isTimerLow
                ? 'bg-rose-500 text-white animate-pulse shadow-lg scale-105 ring-2 ring-rose-400'
                : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-amber-400 border border-slate-200 dark:border-white/10'
            }`}>
              <Clock className={`w-4 h-4 ${isTimerLow ? 'text-white animate-spin' : 'text-amber-500 dark:text-amber-400'}`} />
              <span className="text-sm tracking-wider">{timerMinutes}:{timerSecs}</span>
              {isTimerLow && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Score: <strong className="text-amber-500 dark:text-amber-400 font-mono text-sm">{score} PTS</strong></span>
            </div>

            <span className="hidden sm:inline text-slate-400 dark:text-white/40 text-[10px] uppercase tracking-widest font-mono">
              {saving ? 'Saving...' : 'Synced'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/60 mb-2">
            <span>Question {currentIdx + 1} of {totalQuestions}</span>
            <span className="text-amber-500 dark:text-amber-400 font-mono">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 rounded-full transition-all duration-300 artistic-glow-yellow"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Main Question Card */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-2xl space-y-6 ${
        isKidsMode
          ? 'bg-white text-slate-900 border-pink-200'
          : 'bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white border-slate-200 dark:border-white/10'
      }`}>
        
        {/* Question Header & Hint Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" />
              <span>Question #{currentIdx + 1}</span>
            </div>

            {currentQuestion.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-amber-400 hover:text-slate-950 transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}
          </div>

          <h2 className={`font-black tracking-tight leading-tight ${
            isKidsMode ? 'text-2xl sm:text-3xl text-pink-700' : 'text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white'
          }`}>
            {currentQuestion.question}
          </h2>

          {/* Hint Notice */}
          {showHint && currentQuestion.hint && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>Hint:</strong> {currentQuestion.hint}</span>
            </div>
          )}
        </div>

        {/* MULTIMEDIA QUESTION IMAGE DISPLAY */}
        {currentQuestion.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-72 shadow-lg bg-slate-950 flex flex-col items-center justify-center relative group">
            <img
              src={currentQuestion.imageUrl}
              alt="Question Visual"
              className="w-full h-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {currentQuestion.imageCaption && (
              <div className="w-full bg-slate-950/80 backdrop-blur-md p-2 text-center text-[11px] text-white/80 font-bold uppercase tracking-wider">
                {currentQuestion.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* KIDS ZONE VISUAL COUNTER (e.g., 🍎🍎🍎 + 🍎🍎 = ?) */}
        {currentQuestion.visualCounters && (
          <div className="p-6 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 rounded-3xl text-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-3xl sm:text-4xl">
              <div>
                {Array.from({ length: currentQuestion.visualCounters.count1 }).map((_, idx) => (
                  <span key={idx} className="inline-block animate-bounce-subtle">{currentQuestion.visualCounters?.emoji}</span>
                ))}
              </div>
              {currentQuestion.visualCounters.operator && (
                <span className="font-black text-pink-600 dark:text-pink-400">{currentQuestion.visualCounters.operator}</span>
              )}
              {currentQuestion.visualCounters.count2 !== undefined && (
                <div>
                  {Array.from({ length: currentQuestion.visualCounters.count2 }).map((_, idx) => (
                    <span key={idx} className="inline-block animate-bounce-subtle">{currentQuestion.visualCounters?.emoji}</span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs font-black uppercase text-pink-600 dark:text-pink-300">
              Count the {currentQuestion.visualCounters.emoji} items!
            </p>
          </div>
        )}

        {/* Options Grid */}
        <div className={`grid gap-3.5 ${isKidsMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = currentChosenOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const isAnswered = Boolean(currentChosenOption);

            // Option media if provided (e.g. colors or icons)
            const optionMedia = currentQuestion.optionMedias?.find((m) => m.optionText === option);

            let optionStyle = isKidsMode
              ? 'border-pink-200 bg-white text-slate-900 hover:bg-pink-50 shadow-md font-black'
              : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10';
            
            let badgeStyle = isKidsMode
              ? 'bg-pink-100 text-pink-700 font-black'
              : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white/80';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 font-black shadow-xl ring-2 ring-emerald-400';
                badgeStyle = 'bg-emerald-500 text-white font-black';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100 font-black shadow-xl ring-2 ring-rose-400';
                badgeStyle = 'bg-rose-500 text-white font-black';
              } else {
                optionStyle = 'border-slate-200 dark:border-white/5 bg-slate-100/60 dark:bg-white/5 opacity-50 text-slate-500 dark:text-white/50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between gap-4 focus:outline-none ${optionStyle} ${
                  isKidsMode ? 'py-6 text-lg font-black rounded-3xl' : ''
                }`}
                id={`quiz-option-${currentIdx}-${idx}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${badgeStyle}`}>
                    {letter}
                  </span>

                  {/* Color Swatch if color option */}
                  {optionMedia?.colorHex && (
                    <span
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md shrink-0"
                      style={{ backgroundColor: optionMedia.colorHex }}
                    />
                  )}

                  <span className="text-sm sm:text-base font-bold leading-snug">
                    {option}
                  </span>
                </div>

                {/* Option Feedback Indicator */}
                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    ) : isSelected ? (
                      <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Educational Explanation Card */}
        {currentChosenOption && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {/* Correct / Wrong Banner */}
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-3 ${
              currentChosenOption === currentQuestion.correctAnswer
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-500/20 border-rose-400/50 text-rose-950 dark:text-rose-200'
            }`}>
              {currentChosenOption === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Awesome! Correct answer (+10 PTS).</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>
                    {currentChosenOption === '(Time Expired)'
                      ? 'Time Expired! '
                      : 'Incorrect. '}
                    The correct answer is <strong className="underline font-black">{currentQuestion.correctAnswer}</strong>.
                  </span>
                </>
              )}
            </div>

            {/* Educational Explanation Box */}
            <div className="p-5 bg-amber-500/10 dark:bg-purple-950/40 border border-amber-400/40 dark:border-purple-400/30 rounded-2xl text-slate-900 dark:text-amber-100 space-y-2 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Educational Explanation</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {currentQuestion.explanation || `Fact: ${currentQuestion.correctAnswer} is the verified correct answer for this question.`}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={onExitToSubjects}
            className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
            id="quiz-save-exit-btn"
          >
            <Save className="w-4 h-4 text-amber-500" />
            <span>Save & Exit</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIdx > 0 && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentIdx(currentIdx - 1);
                }}
                className="px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
                id="quiz-prev-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={() => handleNextQuestion()}
              disabled={!currentChosenOption}
              className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 ${
                currentChosenOption
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-slate-950 hover:bg-yellow-300 transform hover:scale-105 artistic-glow-yellow'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 cursor-not-allowed border border-slate-200 dark:border-white/5'
              }`}
              id="quiz-next-btn"
            >
              <span>{currentIdx === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
