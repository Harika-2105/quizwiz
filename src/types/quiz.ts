export interface RawApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export type QuestionKind = 
  | 'standard'
  | 'multimedia'
  | 'riddle'
  | 'sorting'
  | 'bubble_pop'
  | 'kids_zone';

export type KidsSubtopic = 
  | 'colors'
  | 'numbers'
  | 'objects'
  | 'animals'
  | 'body_parts'
  | 'shapes'
  | 'basic_math';

export interface QuizOptionMedia {
  optionText: string;
  imageUrl?: string;
  emoji?: string;
  colorHex?: string;
  badgeBg?: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: string; // 'easy' | 'medium' | 'hard' | 'kids'
  question: string;
  correctAnswer: string;
  options: string[];
  
  // Multimedia & Interactive Extensions
  questionKind?: QuestionKind;
  imageUrl?: string;
  imageCaption?: string;
  optionMedias?: QuizOptionMedia[];
  hint?: string;
  explanation?: string;
  
  // Game & Kids extra fields
  kidsSubtopic?: KidsSubtopic;
  visualCounters?: { emoji: string; count1: number; count2?: number; operator?: string };
  sortingItems?: string[]; // Correct order
  bubbleTargets?: { id: string; label: string; isCorrect: boolean; value: number }[];
}

export interface SubjectCategory {
  id: number | string; // Numeric for OpenTDB, String for Custom (e.g. 'math_adv', 'physics', 'botany', 'riddle_world', 'kids_zone')
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
  gradient: string;
  popular?: boolean;
  isKidsZone?: boolean;
  isRiddleWorld?: boolean;
  tags: string[]; // for fast search
  subtopics?: string[];
  openTdbCategoryId?: number; // mapped OpenTDB category if applicable
}

export interface QuizProgress {
  selectedCategory: number | string;
  categoryName: string;
  difficulty: string;
  amount: number;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>; // questionIndex -> chosen option string
  score: number;
  completed: boolean;
  lastUpdated: string;
  startedAt?: string;
  timeSpentSeconds?: number;
  isKidsZone?: boolean;
  isRiddleWorld?: boolean;
  streakCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  totalQuizzesCompleted?: number;
  highScore?: number;
  preferredTheme?: 'artistic_flair' | 'playful_bright' | 'neon_cyber' | 'minimal_studio' | 'light' | 'dark';
  soundEnabled?: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  email: string;
  avatar?: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}
