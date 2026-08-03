import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Atom,
  Laptop,
  Trophy,
  Globe,
  Landmark,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  ChevronRight,
  Flame,
  Clock,
  Search,
  Baby,
  Gamepad2,
  Calculator,
  Flower2,
  Dog,
  Dna,
  X
} from 'lucide-react';
import { QUIZ_CATEGORIES, fetchQuizQuestions } from '../services/quizApi';
import { SubjectCategory, QuizProgress } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../services/soundFx';
import quizWizLogo from '../assets/images/quizwiz_brand_logo_1785294045713.jpg';

interface SubjectSelectionProps {
  onStartQuiz: (progress: QuizProgress) => void;
  onResumeQuiz: () => void;
  defaultCategoryKey?: number | string;
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  onStartQuiz,
  onResumeQuiz,
  defaultCategoryKey
}) => {
  const { currentUser, activeProgress, saveCurrentProgress, clearUserProgress } = useAuth();
  
  const [selectedCatId, setSelectedCatId] = useState<number | string>(defaultCategoryKey || 'kids_zone');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('any');
  const [amount, setAmount] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper icon renderer for subjects
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-7 h-7 text-white" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-7 h-7 text-white" />;
      case 'Calculator':
        return <Calculator className="w-7 h-7 text-white" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-white" />;
      case 'Flower2':
        return <Flower2 className="w-7 h-7 text-white" />;
      case 'Dog':
        return <Dog className="w-7 h-7 text-white" />;
      case 'Dna':
        return <Dna className="w-7 h-7 text-white" />;
      case 'Atom':
        return <Atom className="w-7 h-7 text-white" />;
      case 'Laptop':
        return <Laptop className="w-7 h-7 text-white" />;
      case 'Trophy':
        return <Trophy className="w-7 h-7 text-white" />;
      case 'Globe':
        return <Globe className="w-7 h-7 text-white" />;
      case 'Landmark':
        return <Landmark className="w-7 h-7 text-white" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-7 h-7 text-white" />;
    }
  };

  // Instant search & filter logic
  const filteredCategories = useMemo(() => {
    let list = [...QUIZ_CATEGORIES];

    // Filter by tab
    if (activeFilterTab === 'kids') {
      list = list.filter((c) => c.isKidsZone);
    } else if (activeFilterTab === 'riddles') {
      list = list.filter((c) => c.isRiddleWorld);
    } else if (activeFilterTab === 'science') {
      list = list.filter((c) => ['physics', 'botany', 'zoology', 'biology', 'science_gen', '17', 17].includes(c.id as any));
    } else if (activeFilterTab === 'math_tech') {
      list = list.filter((c) => ['math_adv', '18', 18].includes(c.id as any));
    } else if (activeFilterTab === 'humanities') {
      list = list.filter((c) => ['9', '21', '22', '23', 9, 21, 22, 23].includes(c.id as any));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const matchName = c.name.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
        const matchSub = c.subtopics?.some((s) => s.toLowerCase().includes(q));
        return matchName || matchDesc || matchTags || matchSub;
      });
    }

    return list;
  }, [searchQuery, activeFilterTab]);

  // Auto-suggestions list for typing
  const autoSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions: string[] = [];
    
    QUIZ_CATEGORIES.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) && !suggestions.includes(cat.name)) {
        suggestions.push(cat.name);
      }
      cat.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(q) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
      cat.subtopics?.forEach((sub) => {
        if (sub.toLowerCase().includes(q) && !suggestions.includes(sub)) {
          suggestions.push(sub);
        }
      });
    });

    return suggestions.slice(0, 5);
  }, [searchQuery]);

  const handleStartNewQuiz = async (overrideCatId?: number | string) => {
    soundFx.playClick();
    setLoading(true);
    setError(null);

    const catToUse = overrideCatId || selectedCatId;
    const categoryObj = QUIZ_CATEGORIES.find((c) => c.id === catToUse) || QUIZ_CATEGORIES[0];

    try {
      const questions = await fetchQuizQuestions(catToUse, amount, difficulty);

      if (!questions || questions.length === 0) {
        throw new Error('No questions could be loaded for this subject. Please try another.');
      }

      const newProgress: QuizProgress = {
        selectedCategory: catToUse,
        categoryName: categoryObj.name,
        difficulty,
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

      if (currentUser) {
        await saveCurrentProgress(newProgress);
      }
      onStartQuiz(newProgress);
    } catch (err: any) {
      console.error('Error starting quiz:', err);
      setError(err.message || 'Failed to initialize quiz. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCatObj = QUIZ_CATEGORIES.find((c) => c.id === selectedCatId) || QUIZ_CATEGORIES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-2xl relative overflow-hidden artistic-glow-yellow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-slate-950">
            <Zap className="w-3.5 h-3.5 text-slate-950" />
            <span>Multi-Topic Question Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">
            Ready for a Challenge, {currentUser?.displayName || 'Quiz Master'}?
          </h1>
          <p className="text-xs sm:text-base text-slate-950/80 font-bold max-w-xl">
            Explore subjects, search topics, or try the all-new <strong>Kids Zone</strong> &amp; <strong>Riddle World</strong>!
          </p>
        </div>

        {/* Brand Mascot Badge */}
        <div className="relative z-10 shrink-0">
          <div className="p-1 rounded-3xl bg-slate-950/25 backdrop-blur-md border border-slate-950/20 shadow-2xl hover:scale-105 transition-transform duration-300">
            <img
              src={quizWizLogo}
              alt="QuizWiz Brand Logo"
              referrerPolicy="no-referrer"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-2xl bg-slate-950 p-1 shadow-inner"
            />
          </div>
        </div>

        {/* Decorative Floating shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Resume Pending Quiz Banner if active session exists */}
      {activeProgress && !activeProgress.completed && (
        <div className="bg-white/80 dark:bg-white/5 border border-amber-400/50 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg artistic-glow-yellow">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Active Session
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-white/50">
                  Last updated {new Date(activeProgress.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">
                {activeProgress.categoryName} Quiz
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/70 font-medium">
                Question {activeProgress.currentQuestionIndex + 1} of {activeProgress.amount} • Score: <strong className="text-amber-600 dark:text-amber-400 font-bold">{activeProgress.score} pts</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                onResumeQuiz();
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
              id="subject-resume-btn"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Quiz</span>
            </button>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to discard your saved progress and start a new quiz?')) {
                  soundFx.playClick();
                  await clearUserProgress();
                }
              }}
              title="Discard saved progress"
              className="p-3 text-slate-400 dark:text-white/40 hover:text-rose-500 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              id="subject-discard-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Featured Banners Row: Kids Zone & Riddle World */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Kids Zone Hero Card */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-2 relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-pink-100 border border-white/20 inline-flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5" /> Ages Below 8 Special
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight">
              Kids Zone 🎈
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 font-medium leading-relaxed">
              Colorful cartoon interface with big buttons! Colors, animals, shapes, counting, and simple math.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCatId('kids_zone');
              handleStartNewQuiz('kids_zone');
            }}
            className="w-full py-3 bg-white hover:bg-pink-50 text-pink-700 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            id="kids-zone-hero-btn"
          >
            <Play className="w-4 h-4 fill-current text-pink-600" />
            <span>Launch Kids Zone Now</span>
          </button>
        </div>

        {/* Riddle World Hero Card */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-2 relative z-10">
            <span className="px-3 py-1 bg-slate-950/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-950 border border-slate-950/20 inline-flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" /> Interactive Games
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-950">
              Riddle World 🧩
            </h3>
            <p className="text-xs sm:text-sm text-slate-950/80 font-bold leading-relaxed">
              Test your logic with brain teasers, number series, sorting games, and pattern recognition!
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCatId('riddle_world');
              handleStartNewQuiz('riddle_world');
            }}
            className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            id="riddle-world-hero-btn"
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            <span>Play Riddle World</span>
          </button>
        </div>

      </div>

      {/* SEARCH BAR & AUTO-SUGGESTIONS */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects (e.g. Calculus, Physics, Animals, Botany, Riddles, Colors)..."
            className="w-full bg-white dark:bg-[#0F0529] border border-slate-200 dark:border-white/15 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 shadow-lg focus:outline-none focus:border-yellow-400 transition-all font-medium"
            id="subject-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Auto-suggestions Dropdown */}
        {autoSuggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/40">Suggestions:</span>
            {autoSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(sug)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 hover:bg-yellow-400 hover:text-slate-950 text-slate-700 dark:text-white/80 rounded-lg text-xs font-bold transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'kids', label: 'Kids Zone 🎈' },
            { id: 'riddles', label: 'Riddle World 🧩' },
            { id: 'science', label: 'Science & Biology 🔬' },
            { id: 'math_tech', label: 'Math & Tech 💻' },
            { id: 'humanities', label: 'General & Sports 🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeFilterTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Filtered Subject Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              All Subjects ({filteredCategories.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 font-medium mt-0.5">
              Select a category to customize difficulty and question length
            </p>
          </div>
        </div>

        {/* Subjects Grid */}
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#0F0529] rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
            <Search className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto" />
            <p className="text-sm font-black text-slate-700 dark:text-white uppercase">No subjects found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilterTab('all');
              }}
              className="px-4 py-2 bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCatId(cat.id);
                  }}
                  className={`group text-left p-6 rounded-3xl border transition-all duration-200 relative overflow-hidden focus:outline-none backdrop-blur-xl ${
                    isSelected
                      ? 'border-yellow-400 bg-amber-500/10 dark:bg-white/10 shadow-2xl scale-[1.02] artistic-glow-yellow'
                      : 'border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0F0529]/80 hover:border-yellow-400 dark:hover:border-white/30 hover:shadow-lg'
                  }`}
                  id={`subject-card-${cat.id}`}
                >
                  {/* Badge */}
                  {cat.popular && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      Popular
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform artistic-glow-purple`}>
                      {renderSubjectIcon(cat.iconName)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/10">
                      {cat.subtopics ? `${cat.subtopics.length} Subtopics` : 'Multi-Level'}
                    </span>
                    <span className="font-black text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      Select <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Configuration Bar: Difficulty & Amount */}
        <div className="bg-white dark:bg-[#0F0529] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-black text-xs uppercase tracking-widest border-b border-slate-100 dark:border-white/10 pb-4">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Customize Quiz Parameters for {selectedCatObj.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/50 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'any', label: 'Mixed' },
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' }
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setDifficulty(diff.id);
                    }}
                    className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                      difficulty === diff.id
                        ? 'bg-yellow-400 text-slate-950 shadow-lg artistic-glow-yellow'
                        : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70'
                    }`}
                    id={`diff-btn-${diff.id}`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Amount Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/50 mb-3">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setAmount(num);
                    }}
                    className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                      amount === num
                        ? 'bg-yellow-400 text-slate-950 shadow-lg artistic-glow-yellow'
                        : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70'
                    }`}
                    id={`amount-btn-${num}`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-700 dark:text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Start CTA */}
          <button
            onClick={() => handleStartNewQuiz()}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 hover:from-yellow-300 hover:to-pink-500 text-slate-950 font-black text-base uppercase tracking-wider rounded-2xl shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 artistic-glow-yellow"
            id="start-quiz-cta"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching Dynamic Questions...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start {selectedCatObj.name} Quiz ({amount} Questions)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
