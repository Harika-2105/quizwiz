import React, { useState, useEffect } from 'react';
import { User, Sparkles, Check, AlertCircle } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { SubjectSelection } from './components/SubjectSelection';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { GameZoneHub } from './components/gamezone/GameZoneHub';
import { MobileSplashScreen } from './components/MobileSplashScreen';
import { MobileAppInstallBanner } from './components/MobileAppInstallBanner';
import { QuizProgress } from './types/quiz';
import { fetchQuizQuestions, QUIZ_CATEGORIES } from './services/quizApi';
import { validateUsernameRules } from './services/firebase';

function QuizAppContent() {
  const { currentUser, loading, activeProgress, saveCurrentProgress, updateUsername } = useAuth();
  
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'subjects' | 'quiz' | 'result' | 'leaderboard' | 'dashboard' | 'gamezone'>('subjects');
  const [activeQuiz, setActiveQuiz] = useState<QuizProgress | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<number | string>('kids_zone');

  // Mandatory Username Setup State for existing or OAuth users without username
  const [setupUsernameInput, setSetupUsernameInput] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSavingSetup, setIsSavingSetup] = useState(false);

  // Sync activeQuiz with auth context activeProgress
  useEffect(() => {
    if (activeProgress && !activeQuiz) {
      setActiveQuiz(activeProgress);
    }
  }, [activeProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070214] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black tracking-widest uppercase text-amber-300">Loading QuizWiz Mobile App...</p>
      </div>
    );
  }

  const needsUsernameSetup = currentUser ? !currentUser.username : false;

  const handleSaveSetupUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    const validation = validateUsernameRules(setupUsernameInput);
    if (!validation.valid) {
      setSetupError(validation.error || 'Invalid username format.');
      return;
    }

    setIsSavingSetup(true);
    try {
      await updateUsername(setupUsernameInput.trim());
    } catch (err: any) {
      console.error('Error setting username:', err);
      setSetupError(err.message || 'Failed to set username. Please try another.');
    } finally {
      setIsSavingSetup(false);
    }
  };

  const handleStartNewQuiz = (progress: QuizProgress) => {
    setActiveQuiz(progress);
    setCurrentTab('quiz');
  };

  const handleResumeQuiz = () => {
    if (activeProgress) {
      setActiveQuiz(activeProgress);
      setCurrentTab('quiz');
    }
  };

  const handleFinishQuiz = (finalProgress: QuizProgress) => {
    setActiveQuiz(finalProgress);
    setCurrentTab('result');
  };

  const handleRetakeQuiz = async () => {
    if (!activeQuiz) return;
    try {
      const freshQuestions = await fetchQuizQuestions(
        activeQuiz.selectedCategory,
        activeQuiz.amount,
        activeQuiz.difficulty
      );

      const categoryObj = QUIZ_CATEGORIES.find((c) => c.id === activeQuiz.selectedCategory) || QUIZ_CATEGORIES[0];

      const freshProgress: QuizProgress = {
        selectedCategory: activeQuiz.selectedCategory,
        categoryName: categoryObj.name,
        difficulty: activeQuiz.difficulty,
        amount: freshQuestions.length,
        questions: freshQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        score: 0,
        completed: false,
        lastUpdated: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        timeSpentSeconds: 0,
        isKidsZone: Boolean(categoryObj.isKidsZone),
        isRiddleWorld: Boolean(categoryObj.isRiddleWorld),
        streakCount: 0
      };

      await saveCurrentProgress(freshProgress);
      setActiveQuiz(freshProgress);
      setCurrentTab('quiz');
    } catch (err) {
      console.error('Failed to retake quiz:', err);
    }
  };

  const handleStartCategoryFromDash = async (catId: number | string) => {
    try {
      const categoryObj = QUIZ_CATEGORIES.find((c) => c.id === catId) || QUIZ_CATEGORIES[0];
      const questions = await fetchQuizQuestions(catId, 10, 'any');

      const newProgress: QuizProgress = {
        selectedCategory: catId,
        categoryName: categoryObj.name,
        difficulty: 'any',
        amount: questions.length,
        questions,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        score: 0,
        completed: false,
        lastUpdated: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        timeSpentSeconds: 0,
        isKidsZone: Boolean(categoryObj.isKidsZone),
        isRiddleWorld: Boolean(categoryObj.isRiddleWorld),
        streakCount: 0
      };

      await saveCurrentProgress(newProgress);
      setActiveQuiz(newProgress);
      setCurrentTab('quiz');
    } catch (err) {
      console.error('Failed to quick start category:', err);
    }
  };

  return (
    <>
      {showSplash && <MobileSplashScreen onFinish={() => setShowSplash(false)} />}

      {!currentUser ? (
        <LoginScreen />
      ) : (
        <div className="min-h-screen bg-[#040112] text-slate-100 transition-colors duration-300">
          <MobileAppInstallBanner />
          
          <Header
            currentTab={currentTab === 'result' ? 'quiz' : currentTab}
            setCurrentTab={(tab) => {
              if (tab === 'kids_zone') {
                setSelectedCategoryKey('kids_zone');
                setCurrentTab('subjects');
              } else if (tab === 'riddles') {
                setSelectedCategoryKey('riddle_world');
                setCurrentTab('subjects');
              } else {
                setCurrentTab(tab as any);
              }
            }}
          />

          <main className="pb-12">
        {/* Mandatory Setup Username Modal for Legacy / OAuth Users */}
        {needsUsernameSetup && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0F0529] border border-amber-400/30 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl artistic-glow-yellow">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-amber-300">Choose Custom Username</h2>
                <p className="text-xs text-white/70 font-medium">
                  Create a unique username to represent you on leaderboards and in multiplayer games.
                </p>
              </div>

              {setupError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{setupError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSetupUsername} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-amber-300">
                      Unique Username
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">3-15 chars (a-z, 0-9, _)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-mono font-bold text-sm">@</span>
                    <input
                      type="text"
                      required
                      value={setupUsernameInput}
                      onChange={(e) => setSetupUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      maxLength={15}
                      placeholder="e.g. quiz_master99"
                      className="w-full bg-white/5 border border-amber-400/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-300"
                      id="setup-username-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSetup}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  id="setup-username-submit"
                >
                  {isSavingSetup ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Set Username & Continue</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {currentTab === 'subjects' && (
          <SubjectSelection
            onStartQuiz={handleStartNewQuiz}
            onResumeQuiz={handleResumeQuiz}
            defaultCategoryKey={selectedCategoryKey}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            onStartCategory={handleStartCategoryFromDash}
            onResumeQuiz={handleResumeQuiz}
            onGoToLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'quiz' && (
          activeQuiz ? (
            <QuizScreen
              progress={activeQuiz}
              onFinishQuiz={handleFinishQuiz}
              onExitToSubjects={() => setCurrentTab('subjects')}
            />
          ) : (
            <SubjectSelection
              onStartQuiz={handleStartNewQuiz}
              onResumeQuiz={handleResumeQuiz}
            />
          )
        )}

        {currentTab === 'result' && activeQuiz && (
          <ResultScreen
            progress={activeQuiz}
            onRetakeQuiz={handleRetakeQuiz}
            onChangeSubject={() => setCurrentTab('subjects')}
            onViewLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'leaderboard' && (
          <Leaderboard
            onBackToSubjects={() => setCurrentTab('subjects')}
          />
        )}

        {currentTab === 'gamezone' && (
          <GameZoneHub
            onBackToSubjects={() => setCurrentTab('subjects')}
          />
        )}
      </main>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QuizAppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
