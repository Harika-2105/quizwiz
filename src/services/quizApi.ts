import { QuizQuestion, RawApiQuestion, SubjectCategory, KidsSubtopic } from '../types/quiz';

export const QUIZ_CATEGORIES: SubjectCategory[] = [
  {
    id: 'kids_zone',
    name: 'Kids Zone (Under 8)',
    description: 'Fun cartoon puzzles, colors, animals, shapes, counting, and simple math for young stars!',
    iconName: 'Baby',
    badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    gradient: 'from-pink-500 via-rose-400 to-yellow-400',
    popular: true,
    isKidsZone: true,
    tags: ['kids', 'children', 'colors', 'shapes', 'animals', 'numbers', 'addition', 'subtraction', 'counting', 'toddler'],
    subtopics: ['Colors', 'Numbers & Counting', 'Animals', 'Shapes', 'Body Parts', 'Basic Math']
  },
  {
    id: 'riddle_world',
    name: 'Riddle & Game World',
    description: 'Brain teasers, logical puzzles, visual pattern recognition, series, and sorting games!',
    iconName: 'Gamepad2',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    gradient: 'from-amber-400 via-orange-500 to-purple-600',
    popular: true,
    isRiddleWorld: true,
    tags: ['riddles', 'puzzles', 'games', 'logic', 'series', 'brain teasers', 'pattern', 'sorting', 'bubble pop', 'iq'],
    subtopics: ['Word Riddles', 'Number Series', 'Pattern Recognition', 'Sorting Puzzles', 'Brain Teasers']
  },
  {
    id: 'math_adv',
    name: 'Mathematics (Advanced)',
    description: 'Calculus, linear algebra, trigonometry, geometry, probability, and advanced theorems.',
    iconName: 'Calculator',
    badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    gradient: 'from-indigo-600 via-purple-600 to-blue-600',
    popular: true,
    tags: ['math', 'mathematics', 'calculus', 'algebra', 'trigonometry', 'geometry', 'statistics', 'derivatives', 'integrals'],
    subtopics: ['Calculus', 'Algebra', 'Trigonometry', 'Geometry', 'Probability & Stats'],
    openTdbCategoryId: 19
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Mechanics, thermodynamics, quantum theory, electromagnetism, optics, and astrophysics.',
    iconName: 'Zap',
    badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    popular: true,
    tags: ['physics', 'force', 'energy', 'thermodynamics', 'quantum', 'optics', 'gravity', 'velocity', 'newton'],
    subtopics: ['Classical Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Astrophysics']
  },
  {
    id: 'botany',
    name: 'Botany & Plant Science',
    description: 'Photosynthesis, plant anatomy, taxonomy, vascular structures, flora, and ecology.',
    iconName: 'Flower2',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    gradient: 'from-emerald-500 via-teal-600 to-green-700',
    popular: false,
    tags: ['botany', 'plants', 'photosynthesis', 'flora', 'chlorophyll', 'leaves', 'trees', 'flowers', 'plant biology'],
    subtopics: ['Photosynthesis', 'Plant Anatomy', 'Taxonomy', 'Ecology', 'Plant Genetics']
  },
  {
    id: 'zoology',
    name: 'Zoology & Animal Biology',
    description: 'Animal physiology, wildlife behavior, evolutionary biology, taxonomy, and marine biology.',
    iconName: 'Dog',
    badgeColor: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
    gradient: 'from-lime-500 via-emerald-600 to-teal-700',
    popular: false,
    tags: ['zoology', 'animals', 'wildlife', 'biology', 'species', 'mammals', 'reptiles', 'birds', 'marine biology'],
    subtopics: ['Animal Physiology', 'Taxonomy', 'Ethology', 'Marine Zoology', 'Conservation']
  },
  {
    id: 'biology',
    name: 'Cellular Biology & Genetics',
    description: 'Cellular organelles, DNA, RNA, mitosis, meiosis, genetics, and biochemistry.',
    iconName: 'Dna',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    gradient: 'from-purple-500 via-fuchsia-600 to-pink-600',
    popular: true,
    tags: ['biology', 'dna', 'cell', 'genetics', 'genomics', 'mitosis', 'organelles', 'human biology', 'biochemistry'],
    subtopics: ['Cell Structure', 'Genetics', 'Molecular Biology', 'Human Physiology', 'Microbiology']
  },
  {
    id: 'science_gen',
    name: 'General Science & Chemistry',
    description: 'Chemical elements, periodic table, reactions, astronomy, space exploration, and geology.',
    iconName: 'Atom',
    badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    gradient: 'from-teal-500 via-sky-600 to-blue-700',
    popular: true,
    tags: ['science', 'chemistry', 'astronomy', 'space', 'geology', 'elements', 'molecules', 'planets'],
    subtopics: ['Periodic Table', 'Chemical Reactions', 'Astronomy & Space', 'Geology & Earth Science'],
    openTdbCategoryId: 17
  },
  {
    id: 18,
    name: 'Computers & Technology',
    description: 'Programming languages, hardware, algorithms, cybersecurity, AI, and web tech.',
    iconName: 'Laptop',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    gradient: 'from-blue-500 via-indigo-600 to-violet-700',
    popular: true,
    tags: ['computers', 'tech', 'programming', 'code', 'javascript', 'python', 'ai', 'hardware', 'cybersecurity'],
    subtopics: ['Algorithms', 'Web Development', 'Hardware', 'Cybersecurity', 'AI & ML'],
    openTdbCategoryId: 18
  },
  {
    id: 9,
    name: 'General Knowledge & Trivia',
    description: 'World facts, famous inventions, pop culture, global records, and everyday trivia.',
    iconName: 'Sparkles',
    badgeColor: 'bg-yellow-100 text-amber-800 dark:bg-yellow-900/40 dark:text-amber-300',
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    popular: true,
    tags: ['general', 'trivia', 'knowledge', 'facts', 'inventions', 'world', 'culture'],
    openTdbCategoryId: 9
  },
  {
    id: 22,
    name: 'Geography & Flags',
    description: 'World capitals, country flags, mountain ranges, oceans, maps, and landmarks.',
    iconName: 'Globe',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    gradient: 'from-rose-500 via-pink-600 to-red-600',
    popular: true,
    tags: ['geography', 'flags', 'capitals', 'countries', 'maps', 'mountains', 'continents'],
    subtopics: ['Country Flags', 'World Capitals', 'Physical Features', 'Maps'],
    openTdbCategoryId: 22
  },
  {
    id: 23,
    name: 'History & Civilizations',
    description: 'Ancient empires, historic revolutions, world wars, medieval times, and famous leaders.',
    iconName: 'Landmark',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-700',
    popular: false,
    tags: ['history', 'civilizations', 'wars', 'ancient', 'leaders', 'revolutions', 'empires'],
    openTdbCategoryId: 23
  },
  {
    id: 21,
    name: 'Sports & Olympics',
    description: 'World records, athletics, football, basketball, Olympics, and legendary sports figures.',
    iconName: 'Trophy',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    gradient: 'from-amber-500 via-orange-600 to-red-500',
    popular: false,
    tags: ['sports', 'olympics', 'football', 'basketball', 'records', 'athletes', 'tennis'],
    openTdbCategoryId: 21
  }
];

// Robust HTML Entity Decoder
export function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  const parser = new DOMParser();
  const decoded = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;
  return decoded || text;
}

// Fisher-Yates array shuffling
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ----------------------------------------------------
// DYNAMIC PROCEDURAL GENERATORS & MULTIMEDIA BANKS
// ----------------------------------------------------

// 1. Kids Zone Generator
export function generateKidsZoneQuestions(amount: number = 10): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const subtopics: KidsSubtopic[] = ['colors', 'numbers', 'objects', 'animals', 'body_parts', 'shapes', 'basic_math'];

  for (let i = 0; i < amount; i++) {
    const subtopic = subtopics[i % subtopics.length];
    
    if (subtopic === 'colors') {
      const colorList = [
        { name: 'Red', hex: '#EF4444', emoji: '🍎' },
        { name: 'Blue', hex: '#3B82F6', emoji: '🫐' },
        { name: 'Green', hex: '#22C55E', emoji: '🥦' },
        { name: 'Yellow', hex: '#EAB308', emoji: '🍌' },
        { name: 'Purple', hex: '#A855F7', emoji: '🍇' },
        { name: 'Orange', hex: '#F97316', emoji: '🍊' },
      ];
      const correct = colorList[Math.floor(Math.random() * colorList.length)];
      const wrongs = colorList.filter((c) => c.name !== correct.name).map((c) => c.name);
      const shuffledOptions = shuffleArray([correct.name, ...wrongs.slice(0, 3)]);

      questions.push({
        id: `kids_color_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: `What color is this ${correct.emoji}?`,
        correctAnswer: correct.name,
        options: shuffledOptions,
        questionKind: 'kids_zone',
        kidsSubtopic: 'colors',
        explanation: `${correct.emoji} is ${correct.name}! ${correct.name} is a bright and beautiful color that appears in nature, fruits, and art.`,
        optionMedias: shuffledOptions.map((optName) => {
          const item = colorList.find((c) => c.name === optName);
          return {
            optionText: optName,
            colorHex: item?.hex,
            emoji: item?.emoji
          };
        })
      });
    } else if (subtopic === 'numbers') {
      // Number comparison (e.g. Which is bigger: 45 or 46?)
      const n1 = Math.floor(Math.random() * 40) + 10;
      const n2 = n1 + Math.floor(Math.random() * 5) + 1;
      const isBiggerQuestion = Math.random() > 0.5;
      
      const correctNum = isBiggerQuestion ? Math.max(n1, n2) : Math.min(n1, n2);
      const wrongNum = isBiggerQuestion ? Math.min(n1, n2) : Math.max(n1, n2);
      
      const qText = isBiggerQuestion 
        ? `Which number is BIGGER: ${n1} or ${n2}?` 
        : `Which number is SMALLER: ${n1} or ${n2}?`;

      questions.push({
        id: `kids_num_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: qText,
        correctAnswer: String(correctNum),
        options: [String(correctNum), String(wrongNum)],
        questionKind: 'kids_zone',
        kidsSubtopic: 'numbers',
        explanation: isBiggerQuestion
          ? `${correctNum} is greater than ${wrongNum}! When counting up on a number line, ${correctNum} comes after ${wrongNum}.`
          : `${correctNum} is smaller than ${wrongNum}! When counting up, ${correctNum} comes before ${wrongNum}.`,
        visualCounters: { emoji: '⭐', count1: n1, count2: n2 }
      });
    } else if (subtopic === 'animals') {
      const animalList = [
        { name: 'Dog 🐶', sound: 'Woof Woof!', explanation: 'Dogs bark "Woof!" to greet humans, express joy, and protect their homes!', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop' },
        { name: 'Cat 🐱', sound: 'Meow Meow!', explanation: 'Cats purr and meow to communicate with humans and ask for pets or treats!', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop' },
        { name: 'Lion 🦁', sound: 'Roar!', explanation: 'Lions roar loudly to protect their pride and signal across the African savanna!', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop' },
        { name: 'Elephant 🐘', sound: 'Trumpet!', explanation: 'Elephants trumpet using their long flexible trunks to greet family and warn others!', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&auto=format&fit=crop' },
        { name: 'Duck 🦆', sound: 'Quack Quack!', explanation: 'Ducks quack while swimming in ponds and lakes using webbed feet to paddle!', img: 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?w=500&auto=format&fit=crop' }
      ];
      const item = animalList[Math.floor(Math.random() * animalList.length)];
      const wrongs = animalList.filter((a) => a.name !== item.name).map((a) => a.name);
      const options = shuffleArray([item.name, ...wrongs.slice(0, 3)]);

      questions.push({
        id: `kids_animal_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: `Which animal makes the sound: "${item.sound}"?`,
        correctAnswer: item.name,
        options,
        questionKind: 'kids_zone',
        kidsSubtopic: 'animals',
        explanation: item.explanation,
        imageUrl: item.img
      });
    } else if (subtopic === 'shapes') {
      const shapes = [
        { name: 'Circle 🔴', desc: 'Round like a ball', exp: 'A circle is perfectly round with no straight edges or sharp corners!' },
        { name: 'Square 🟧', desc: 'Has 4 equal sides', exp: 'A square has 4 straight sides of identical length and 4 right angles.' },
        { name: 'Triangle 🔺', desc: 'Has 3 pointy corners', exp: 'A triangle is a 3-sided shape whose inner angles always add up to 180 degrees!' },
        { name: 'Star ⭐', desc: 'Shines in the night sky', exp: 'A star shape has pointed arms radiating outwards from its center!' }
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const wrongs = shapes.filter((s) => s.name !== shape.name).map((s) => s.name);

      questions.push({
        id: `kids_shape_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: `Which shape is "${shape.desc}"?`,
        correctAnswer: shape.name,
        options: shuffleArray([shape.name, ...wrongs]),
        questionKind: 'kids_zone',
        kidsSubtopic: 'shapes',
        explanation: shape.exp
      });
    } else if (subtopic === 'body_parts') {
      const bodyParts = [
        { name: 'Eyes 👁️', use: 'seeing things around you', exp: 'Our eyes capture light reflected off objects so our brain can perceive images!' },
        { name: 'Ears 👂', use: 'listening to music and sounds', exp: 'Ears collect sound vibration waves from the air and transmit signals to our brain.' },
        { name: 'Hand 🖐️', use: 'waving hello and holding toys', exp: 'Hands have 5 flexible fingers that allow humans to grip objects and manipulate tools.' },
        { name: 'Nose 👃', use: 'smelling delicious food', exp: 'The nose contains olfactory sensors that detect scent molecules in the air.' },
        { name: 'Legs 🦵', use: 'running and jumping', exp: 'Strong leg muscles and bones support our weight and propel us forward!' }
      ];
      const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
      const wrongs = bodyParts.filter((p) => p.name !== part.name).map((p) => p.name);

      questions.push({
        id: `kids_body_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: `Which body part do we use for ${part.use}?`,
        correctAnswer: part.name,
        options: shuffleArray([part.name, ...wrongs.slice(0, 3)]),
        questionKind: 'kids_zone',
        kidsSubtopic: 'body_parts',
        explanation: part.exp
      });
    } else {
      // Basic Math
      const op = ['+', '-', 'x'][Math.floor(Math.random() * 3)];
      let a = 0, b = 0, ans = 0;
      let stepExp = '';
      if (op === '+') {
        a = Math.floor(Math.random() * 8) + 1;
        b = Math.floor(Math.random() * 8) + 1;
        ans = a + b;
        stepExp = `Adding ${a} plus ${b} means starting at ${a} and counting up ${b} more steps to get ${ans}!`;
      } else if (op === '-') {
        a = Math.floor(Math.random() * 8) + 5;
        b = Math.floor(Math.random() * a);
        ans = a - b;
        stepExp = `Subtracting ${b} from ${a} means taking away ${b} items from ${a} items, leaving ${ans}!`;
      } else {
        a = Math.floor(Math.random() * 4) + 1;
        b = Math.floor(Math.random() * 4) + 1;
        ans = a * b;
        stepExp = `Multiplying ${a} × ${b} means adding ${a} together ${b} times (${Array(b).fill(a).join(' + ')} = ${ans})!`;
      }

      const wrongs = [ans + 1, Math.max(0, ans - 1), ans + 2, ans + 3].filter((n) => n !== ans);
      const options = shuffleArray([String(ans), ...wrongs.slice(0, 3).map(String)]);

      questions.push({
        id: `kids_math_${i}_${Date.now()}`,
        category: 'Kids Zone',
        difficulty: 'kids',
        question: `What is ${a} ${op === 'x' ? '×' : op} ${b}?`,
        correctAnswer: String(ans),
        options,
        questionKind: 'kids_zone',
        kidsSubtopic: 'basic_math',
        explanation: stepExp,
        visualCounters: { emoji: '🍎', count1: a, count2: b, operator: op }
      });
    }
  }

  return questions;
}

// 2. Riddle & Game World Generator
export function generateRiddleWorldQuestions(amount: number = 10): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    {
      id: 'riddle_1',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      correctAnswer: 'An Echo',
      options: ['An Echo', 'A Shadow', 'A Cloud', 'A Whistle'],
      questionKind: 'riddle',
      hint: 'Think about sound bouncing in mountains!',
      explanation: 'An echo is produced when sound pressure waves travel, reflect off a hard physical barrier (like a mountain wall), and return back to your ears.'
    },
    {
      id: 'riddle_2',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'What has keys but no locks, space but no room, and you can enter but not go in?',
      correctAnswer: 'A Keyboard',
      options: ['A Keyboard', 'A Piano', 'A Map', 'A Safe'],
      questionKind: 'riddle',
      hint: 'You are using one right now!',
      explanation: 'A computer keyboard has letter & number keys, a Spacebar key, and an Enter key that inputs data into digital screens.'
    },
    {
      id: 'riddle_3',
      category: 'Riddle World',
      difficulty: 'hard',
      question: 'Complete the Number Logic Series: 2, 6, 12, 20, 30, ?',
      correctAnswer: '42',
      options: ['42', '36', '40', '48'],
      questionKind: 'riddle',
      hint: 'Look at the difference between numbers: +4, +6, +8, +10...',
      explanation: 'The differences between terms increase by +2 each step (+4, +6, +8, +10, +12). Adding 12 to 30 gives 42 (also n*(n+1) for n=6).'
    },
    {
      id: 'riddle_4',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'Sorting Game: Order these memory storage units from SMALLEST to LARGEST capacity!',
      correctAnswer: 'Kilobyte, Megabyte, Gigabyte, Terabyte',
      options: [
        'Kilobyte, Megabyte, Gigabyte, Terabyte',
        'Megabyte, Kilobyte, Terabyte, Gigabyte',
        'Gigabyte, Megabyte, Kilobyte, Terabyte',
        'Kilobyte, Gigabyte, Megabyte, Terabyte'
      ],
      questionKind: 'sorting',
      explanation: 'Digital memory scales exponentially: 1 KB = 1024 Bytes, 1 MB = 1024 KB, 1 GB = 1024 MB, and 1 TB = 1024 GB.',
      sortingItems: ['Kilobyte', 'Megabyte', 'Gigabyte', 'Terabyte']
    },
    {
      id: 'riddle_5',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'Pattern Series: 3, 9, 27, 81, ? What comes next?',
      correctAnswer: '243',
      options: ['243', '162', '324', '108'],
      questionKind: 'riddle',
      hint: 'Each number is multiplied by 3!',
      explanation: 'This is a geometric sequence with a common multiplier ratio of 3. Multiplying 81 × 3 equals 243.'
    },
    {
      id: 'riddle_6',
      category: 'Riddle World',
      difficulty: 'easy',
      question: 'What gets wetter and wetter the more it dries?',
      correctAnswer: 'A Towel',
      options: ['A Towel', 'A Sponge', 'The Ocean', 'Rain'],
      questionKind: 'riddle',
      explanation: 'A towel absorbs water off your body when drying you off, making the towel itself progressively wetter!'
    },
    {
      id: 'riddle_7',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'The one who makes it doesn’t want it, the one who buys it doesn’t use it, and the one who uses it doesn’t know it. What is it?',
      correctAnswer: 'A Coffin',
      options: ['A Coffin', 'A Gift', 'A Bed', 'A Book'],
      questionKind: 'riddle',
      explanation: 'A coffin is built by carpenters, purchased by grieving loved ones, and occupied after passing away.'
    },
    {
      id: 'riddle_8',
      category: 'Riddle World',
      difficulty: 'hard',
      question: 'If 1 = 3, 2 = 3, 3 = 5, 4 = 4, 5 = 4, then what does 6 = ?',
      correctAnswer: '3',
      options: ['3', '6', '5', '4'],
      questionKind: 'riddle',
      hint: 'Count the letters in the English spelling of the word "SIX"!',
      explanation: 'The pattern counts the letter length of the spelled out word: "S-I-X" has 3 letters!'
    },
    {
      id: 'riddle_9',
      category: 'Riddle World',
      difficulty: 'medium',
      question: 'Sorting Game: Order these solar system planets by distance from the Sun (Closest to Farthest)!',
      correctAnswer: 'Mercury, Venus, Earth, Mars',
      options: [
        'Mercury, Venus, Earth, Mars',
        'Venus, Mercury, Earth, Mars',
        'Earth, Mercury, Venus, Mars',
        'Mercury, Earth, Venus, Mars'
      ],
      questionKind: 'sorting',
      explanation: 'In our Solar System, the terrestrial planets orbiting outward from the Sun are Mercury, Venus, Earth, and Mars.',
      sortingItems: ['Mercury', 'Venus', 'Earth', 'Mars']
    },
    {
      id: 'riddle_10',
      category: 'Riddle World',
      difficulty: 'hard',
      question: 'A man looks at a portrait and says: "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the portrait?',
      correctAnswer: 'His Son',
      options: ['His Son', 'Himself', 'His Father', 'His Nephew'],
      questionKind: 'riddle',
      explanation: '"My father\'s son" is the speaker himself (since he has no brothers). Therefore "that man\'s father is ME", making the person in the portrait his son!'
    }
  ];

  const shuffled = shuffleArray(bank);

  // Generate extra dynamic number series puzzles if needed
  while (shuffled.length < amount) {
    const start = Math.floor(Math.random() * 5) + 1;
    const diff = Math.floor(Math.random() * 4) + 2;
    const series = [start, start + diff, start + diff * 2, start + diff * 3];
    const ans = start + diff * 4;
    const wrongs = [ans + diff, ans - 1, ans + 2];

    shuffled.push({
      id: `dyn_series_${shuffled.length}_${Date.now()}`,
      category: 'Riddle World',
      difficulty: 'medium',
      question: `Find the missing term in the sequence: ${series.join(', ')}, ?`,
      correctAnswer: String(ans),
      options: shuffleArray([String(ans), ...wrongs.map(String)]),
      questionKind: 'riddle',
      hint: `Notice the common difference of +${diff}`
    });
  }

  return shuffled.slice(0, amount);
}

// 3. Advanced Math Generator
export function generateAdvancedMathQuestions(amount: number = 10, difficulty: string = 'medium'): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    {
      id: 'math_1',
      category: 'Mathematics (Advanced)',
      difficulty: 'medium',
      question: 'What is the derivative of f(x) = x³ - 4x² + 7x - 12 with respect to x?',
      correctAnswer: '3x² - 8x + 7',
      options: ['3x² - 8x + 7', '3x² - 4x + 7', 'x² - 8x + 7', '3x² - 8x'],
      questionKind: 'standard',
      hint: 'Apply the power rule: d/dx(x^n) = n*x^(n-1)'
    },
    {
      id: 'math_2',
      category: 'Mathematics (Advanced)',
      difficulty: 'hard',
      question: 'Evaluate the definite integral ∫ from 0 to π/2 of cos(x) dx.',
      correctAnswer: '1',
      options: ['1', '0', 'π/2', '2'],
      questionKind: 'standard',
      hint: 'The antiderivative of cos(x) is sin(x)'
    },
    {
      id: 'math_3',
      category: 'Mathematics (Advanced)',
      difficulty: 'medium',
      question: 'In trigonometry, what is the value of sin²(θ) + cos²(θ)?',
      correctAnswer: '1',
      options: ['1', '0', '2', 'tan(θ)'],
      questionKind: 'standard'
    },
    {
      id: 'math_4',
      category: 'Mathematics (Advanced)',
      difficulty: 'hard',
      question: 'If a 2x2 matrix has rows [3, 4] and [1, 2], what is its determinant?',
      correctAnswer: '2',
      options: ['2', '10', '-2', '5'],
      questionKind: 'standard',
      hint: 'det = (a*d - b*c)'
    },
    {
      id: 'math_5',
      category: 'Mathematics (Advanced)',
      difficulty: 'easy',
      question: 'Solve for x in the quadratic equation: x² - 9 = 0.',
      correctAnswer: 'x = ±3',
      options: ['x = ±3', 'x = 3 only', 'x = ±9', 'x = 0'],
      questionKind: 'standard'
    },
    {
      id: 'math_6',
      category: 'Mathematics (Advanced)',
      difficulty: 'medium',
      question: 'What is the sum of the interior angles of a 6-sided hexagon?',
      correctAnswer: '720°',
      options: ['720°', '540°', '360°', '900°'],
      questionKind: 'standard',
      hint: 'Formula: (n - 2) × 180°'
    }
  ];

  const pool = [...bank];
  
  // Procedural generator for dynamic calculus/algebra
  while (pool.length < amount) {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    const qText = `What is the derivative d/dx (${a}x² + ${b}x)?`;
    const ans = `${2 * a}x + ${b}`;
    const w1 = `${a}x + ${b}`;
    const w2 = `${2 * a}x² + ${b}`;
    const w3 = `${2 * a}x`;

    pool.push({
      id: `dyn_math_${pool.length}_${Date.now()}`,
      category: 'Mathematics (Advanced)',
      difficulty: 'medium',
      question: qText,
      correctAnswer: ans,
      options: shuffleArray([ans, w1, w2, w3]),
      questionKind: 'standard'
    });
  }

  return shuffleArray(pool).slice(0, amount);
}

// 4. Specialized Physics, Botany, Zoology, Biology & Multimedia Banks
export function generateSpecializedDomainQuestions(categoryId: string | number, amount: number = 10): QuizQuestion[] {
  const domainBanks: Record<string, QuizQuestion[]> = {
    physics: [
      {
        id: 'phys_1',
        category: 'Physics',
        difficulty: 'medium',
        question: 'Which equation expresses Newton\'s Second Law of Motion?',
        correctAnswer: 'F = m × a',
        options: ['F = m × a', 'E = m × c²', 'P = V × I', 'F = G × m₁m₂ / r²'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop',
        imageCaption: 'Classical Dynamics & Force Vectors'
      },
      {
        id: 'phys_2',
        category: 'Physics',
        difficulty: 'hard',
        question: 'What physical phenomenon causes light to bend when passing from air into water?',
        correctAnswer: 'Refraction',
        options: ['Refraction', 'Diffraction', 'Polarization', 'Reflection'],
        questionKind: 'standard'
      },
      {
        id: 'phys_3',
        category: 'Physics',
        difficulty: 'medium',
        question: 'What is the SI unit of electric capacitance?',
        correctAnswer: 'Farad (F)',
        options: ['Farad (F)', 'Tesla (T)', 'Henry (H)', 'Joule (J)'],
        questionKind: 'standard'
      },
      {
        id: 'phys_4',
        category: 'Physics',
        difficulty: 'hard',
        question: 'In thermodynamics, what does the Second Law state about entropy in an isolated system?',
        correctAnswer: 'Entropy always increases or remains constant',
        options: [
          'Entropy always increases or remains constant',
          'Entropy decreases over time',
          'Entropy reaches zero at room temperature',
          'Energy is destroyed'
        ]
      }
    ],
    botany: [
      {
        id: 'bot_1',
        category: 'Botany & Plant Science',
        difficulty: 'medium',
        question: 'Which plant pigment absorbs red and blue light to drive photosynthesis, reflecting green light?',
        correctAnswer: 'Chlorophyll',
        options: ['Chlorophyll', 'Carotenoid', 'Anthocyanin', 'Xanthophyll'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop',
        imageCaption: 'Chloroplast Organelles inside Leaf Cells'
      },
      {
        id: 'bot_2',
        category: 'Botany & Plant Science',
        difficulty: 'medium',
        question: 'What vascular tissue in plants is responsible for transporting water and minerals up from the roots?',
        correctAnswer: 'Xylem',
        options: ['Xylem', 'Phloem', 'Cambium', 'Epidermis'],
        questionKind: 'standard'
      },
      {
        id: 'bot_3',
        category: 'Botany & Plant Science',
        difficulty: 'easy',
        question: 'What are the tiny pores on the underside of plant leaves called that allow gas exchange?',
        correctAnswer: 'Stomata',
        options: ['Stomata', 'Vacuoles', 'Trichomes', 'Cuticles'],
        questionKind: 'standard'
      }
    ],
    zoology: [
      {
        id: 'zoo_1',
        category: 'Zoology & Animal Biology',
        difficulty: 'medium',
        question: 'Which mammal species is known to lay eggs instead of giving live birth?',
        correctAnswer: 'Platypus',
        options: ['Platypus', 'Kangaroo', 'Koala', 'Armadillo'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop',
        imageCaption: 'Monotreme Mammal Biology'
      },
      {
        id: 'zoo_2',
        category: 'Zoology & Animal Biology',
        difficulty: 'medium',
        question: 'How many chambers are inside a mammalian heart?',
        correctAnswer: '4',
        options: ['4', '3', '2', '5'],
        questionKind: 'standard'
      },
      {
        id: 'zoo_3',
        category: 'Zoology & Animal Biology',
        difficulty: 'hard',
        question: 'What term describes cold-blooded animals whose body temperature depends on external environment?',
        correctAnswer: 'Ectothermic',
        options: ['Ectothermic', 'Endothermic', 'Homeothermic', 'Poikilostatic'],
        questionKind: 'standard'
      }
    ],
    biology: [
      {
        id: 'bio_1',
        category: 'Cellular Biology & Genetics',
        difficulty: 'medium',
        question: 'Which organelle is universally referred to as the "powerhouse of the cell"?',
        correctAnswer: 'Mitochondria',
        options: ['Mitochondria', 'Ribosome', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&auto=format&fit=crop',
        imageCaption: 'Cellular Microscopic Structure'
      },
      {
        id: 'bio_2',
        category: 'Cellular Biology & Genetics',
        difficulty: 'hard',
        question: 'Which nucleotide nitrogenous base pairs with Adenine (A) in DNA double helix?',
        correctAnswer: 'Thymine (T)',
        options: ['Thymine (T)', 'Guanine (G)', 'Cytosine (C)', 'Uracil (U)'],
        questionKind: 'standard'
      }
    ],
    geography_multimedia: [
      {
        id: 'geo_m_1',
        category: 'Geography & Flags',
        difficulty: 'medium',
        question: 'Identify the country represented by this national flag:',
        correctAnswer: 'Australia 🇦🇺',
        options: ['Australia 🇦🇺', 'New Zealand 🇳🇿', 'United Kingdom 🇬🇧', 'Fiji 🇫🇯'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&auto=format&fit=crop',
        imageCaption: 'Southern Cross & Union Jack Flag'
      },
      {
        id: 'geo_m_2',
        category: 'Geography & Flags',
        difficulty: 'medium',
        question: 'Which iconic world landmark is shown in the image below?',
        correctAnswer: 'Taj Mahal',
        options: ['Taj Mahal', 'Colosseum', 'Machu Picchu', 'Petra'],
        questionKind: 'multimedia',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop',
        imageCaption: 'Agra, India Architecture'
      }
    ]
  };

  const key = String(categoryId);
  const list = domainBanks[key] || domainBanks['physics'];
  return shuffleArray(list).slice(0, amount);
}

// ----------------------------------------------------
// MAIN FETCH METHOD WITH API + FALLBACK & EXTENSIONS
// ----------------------------------------------------

export async function fetchQuizQuestions(
  categoryKey: number | string,
  amount: number = 10,
  difficulty: string = 'any'
): Promise<QuizQuestion[]> {
  // 1. Kids Zone Special Handler
  if (categoryKey === 'kids_zone') {
    return generateKidsZoneQuestions(amount);
  }

  // 2. Riddle World Special Handler
  if (categoryKey === 'riddle_world') {
    return generateRiddleWorldQuestions(amount);
  }

  // 3. Advanced Math Special Handler
  if (categoryKey === 'math_adv') {
    return generateAdvancedMathQuestions(amount, difficulty);
  }

  // 4. Specialized Physics, Botany, Zoology, Biology Custom Handlers
  if (['physics', 'botany', 'zoology', 'biology'].includes(String(categoryKey))) {
    const customList = generateSpecializedDomainQuestions(categoryKey, amount);
    if (customList.length >= amount) return customList;
  }

  // 5. OpenTDB Fetch
  const categoryObj = QUIZ_CATEGORIES.find((c) => String(c.id) === String(categoryKey));
  const openTdbId = categoryObj?.openTdbCategoryId || (typeof categoryKey === 'number' ? categoryKey : 9);

  let url = `https://opentdb.com/api.php?amount=${amount}&category=${openTdbId}&type=multiple`;
  if (difficulty && difficulty !== 'any' && difficulty !== 'kids') {
    url += `&difficulty=${difficulty}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenTDB API status ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((raw: RawApiQuestion, idx: number) => {
        const decodedCorrect = decodeHTMLEntities(raw.correct_answer);
        const decodedIncorrect = raw.incorrect_answers.map(decodeHTMLEntities);
        const options = shuffleArray([decodedCorrect, ...decodedIncorrect]);

        return {
          id: `q_${openTdbId}_${idx}_${Date.now()}`,
          category: decodeHTMLEntities(raw.category),
          difficulty: raw.difficulty,
          question: decodeHTMLEntities(raw.question),
          correctAnswer: decodedCorrect,
          options,
          questionKind: 'standard',
          explanation: `Educational Fact: ${decodedCorrect} is the correct answer for this ${decodeHTMLEntities(raw.category)} topic!`
        };
      });
    }

    // If failed due to strict difficulty, retry with 'any'
    if (difficulty !== 'any') {
      return fetchQuizQuestions(categoryKey, amount, 'any');
    }

    throw new Error('No results from OpenTDB API');
  } catch (error) {
    console.warn('API fetch warning, using rich fallback questions:', error);
    return getFallbackQuestions(categoryKey, amount);
  }
}

// Emergency Fallback Question Bank
function getFallbackQuestions(categoryKey: number | string, amount: number): QuizQuestion[] {
  const categoryObj = QUIZ_CATEGORIES.find((c) => String(c.id) === String(categoryKey)) || QUIZ_CATEGORIES[0];
  
  if (categoryObj.isKidsZone) {
    return generateKidsZoneQuestions(amount);
  }
  if (categoryObj.isRiddleWorld) {
    return generateRiddleWorldQuestions(amount);
  }

  const sampleBank: Record<string, { q: string; correct: string; wrong: string[]; img?: string }[]> = {
    '9': [
      { q: "What is the capital city of Australia?", correct: "Canberra", wrong: ["Sydney", "Melbourne", "Brisbane"] },
      { q: "Which element has the chemical symbol 'O'?", correct: "Oxygen", wrong: ["Gold", "Osmium", "Silver"] },
      { q: "How many sides does a heptagon have?", correct: "7", wrong: ["6", "8", "5"] },
      { q: "What year did the Titanic sink?", correct: "1912", wrong: ["1905", "1918", "1923"] }
    ],
    '17': [
      { q: "What is the hardest natural substance on Earth?", correct: "Diamond", wrong: ["Gold", "Iron", "Platinum"] },
      { q: "Which gas do plants absorb during photosynthesis?", correct: "Carbon Dioxide", wrong: ["Oxygen", "Nitrogen", "Hydrogen"] }
    ],
    '18': [
      { q: "What does CPU stand for?", correct: "Central Processing Unit", wrong: ["Computer Personal Unit", "Central Power User", "Control Process Utility"] },
      { q: "Which language runs natively inside web browsers?", correct: "JavaScript", wrong: ["Python", "C++", "Java"] }
    ],
    '22': [
      { q: "What is the longest river in the world?", correct: "Nile River", wrong: ["Amazon River", "Mississippi River", "Yangtze River"] },
      { q: "Which country has the largest land area in the world?", correct: "Russia", wrong: ["Canada", "China", "United States"] }
    ]
  };

  const list = sampleBank[String(categoryKey)] || sampleBank['9'];
  return shuffleArray(list).slice(0, amount).map((item, idx) => ({
    id: `fallback_${categoryKey}_${idx}`,
    category: categoryObj.name,
    difficulty: 'medium',
    question: item.q,
    correctAnswer: item.correct,
    options: shuffleArray([item.correct, ...item.wrong]),
    imageUrl: item.img,
    questionKind: item.img ? 'multimedia' : 'standard'
  }));
}
