export type GameCategory = 'all' | 'classic' | 'action' | 'casual' | 'brain' | 'simulation' | 'kids';

export interface GameMetadata {
  id: string;
  title: string;
  category: GameCategory;
  categoryName: string;
  description: string;
  icon: string;
  color: string;
  rating: number;
  playsCount: number;
  isMultiplayer?: boolean;
  controlsHelp: string;
}

export const GAME_CATALOG: GameMetadata[] = [
  // CLASSIC
  {
    id: 'snakes_ladders',
    title: 'Snakes & Ladders 100',
    category: 'classic',
    categoryName: 'Classic',
    description: 'Climb high ladders to jump ahead or slide down slippery snakes in this classic board game!',
    icon: '🪜',
    color: 'from-amber-400 to-orange-600',
    rating: 4.7,
    playsCount: 9800,
    isMultiplayer: true,
    controlsHelp: 'Tap Roll Dice on your turn. Ladders boost you up; snakes slide you down!'
  },
  {
    id: 'chess',
    title: 'Grandmaster Chess Arena',
    category: 'classic',
    categoryName: 'Classic',
    description: 'Strategy showdown! Command pawns, knights, rooks & queens to capture the enemy King in checkmate!',
    icon: '♟️',
    color: 'from-indigo-600 to-slate-900',
    rating: 4.9,
    playsCount: 19500,
    isMultiplayer: true,
    controlsHelp: 'Tap any piece to view available moves, then tap a highlighted square to move or capture.'
  },

  // ACTION
  {
    id: 'arrow_shooting',
    title: 'Archery Target Master',
    category: 'action',
    categoryName: 'Action',
    description: 'Test your precision aiming arrow angles and string tension to hit moving bullseye targets!',
    icon: '🏹',
    color: 'from-violet-500 to-purple-700',
    rating: 4.6,
    playsCount: 8900,
    controlsHelp: 'Drag mouse/touch to aim angle & power, release to shoot arrow.'
  },

  // CASUAL & FUN
  {
    id: 'balloon_pop',
    title: 'Balloon Pop Frenzy',
    category: 'casual',
    categoryName: 'Casual & Fun',
    description: 'Pop floating colorful balloons as fast as you can before time expires! Watch out for bombs!',
    icon: '🎈',
    color: 'from-pink-500 to-rose-500',
    rating: 4.8,
    playsCount: 14200,
    controlsHelp: 'Tap or click on balloons to pop them instantly.'
  },
  {
    id: 'bubble_shooter',
    title: 'Bubble Pop Cannon',
    category: 'casual',
    categoryName: 'Casual & Fun',
    description: 'Aim your bubble cannon to match 3 or more same-colored bubbles to drop huge clusters!',
    icon: '🔮',
    color: 'from-indigo-500 to-sky-500',
    rating: 4.7,
    playsCount: 16500,
    controlsHelp: 'Aim with pointer/finger and release to shoot bubble.'
  },
  {
    id: 'fish_catch',
    title: 'Deep Sea Fish Catcher',
    category: 'casual',
    categoryName: 'Casual & Fun',
    description: 'Cast your fishing line into ocean depths to hook exotic tropical fish and golden treasure chests!',
    icon: '🎣',
    color: 'from-teal-400 to-cyan-600',
    rating: 4.7,
    playsCount: 11100,
    controlsHelp: 'Tap to drop hook into the sea and reel up fish.'
  },
  {
    id: 'tap_reaction',
    title: 'Tap Speed Reaction',
    category: 'casual',
    categoryName: 'Casual & Fun',
    description: 'Challenge your reflexes! Tap flashing neon target buttons in milliseconds as they light up!',
    icon: '⚡',
    color: 'from-yellow-400 to-amber-500',
    rating: 4.9,
    playsCount: 19400,
    controlsHelp: 'Click glowing target pads as soon as they light up.'
  },

  // BRAIN & LOGIC
  {
    id: 'memory_match',
    title: 'Memory Match Masters',
    category: 'brain',
    categoryName: 'Brain & Logic',
    description: 'Flip pairs of hidden cards to find matching emojis, animals, and space planets!',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-600',
    rating: 4.9,
    playsCount: 17800,
    isMultiplayer: true,
    controlsHelp: 'Tap cards to turn them over and match pairs.'
  },
  {
    id: 'puzzle_2048',
    title: '2048 Number Merge',
    category: 'brain',
    categoryName: 'Brain & Logic',
    description: 'Slide matching number tiles together to multiply them up to the legendary 2048 tile!',
    icon: '🔢',
    color: 'from-amber-500 to-yellow-600',
    rating: 4.8,
    playsCount: 13500,
    controlsHelp: 'Use Arrow Keys or Swipe on touch screen to slide all tiles.'
  },
  {
    id: 'number_pattern',
    title: 'Number Logic Pattern',
    category: 'brain',
    categoryName: 'Brain & Logic',
    description: 'Decode arithmetic sequences, square numbers, and hidden math rules to find missing terms!',
    icon: '💡',
    color: 'from-blue-500 to-teal-500',
    rating: 4.6,
    playsCount: 7600,
    controlsHelp: 'Select the missing number that correctly continues the logic pattern.'
  },

  // SIMULATION / FUN
  {
    id: 'cooking_game',
    title: 'Burger Chef Kitchen',
    category: 'simulation',
    categoryName: 'Simulation',
    description: 'Assemble delicious gourmet burgers with buns, patties, cheese, lettuce & tomato before orders expire!',
    icon: '🍔',
    color: 'from-amber-600 to-orange-700',
    rating: 4.8,
    playsCount: 15300,
    controlsHelp: 'Tap ingredients in order to build customer burger tickets.'
  },
  {
    id: 'object_sorting',
    title: 'Eco Sort Master',
    category: 'simulation',
    categoryName: 'Simulation',
    description: 'Sort items into correct recycling bins (Recycle, Organic, E-Waste & Hazardous) as fast as you can!',
    icon: '♻️',
    color: 'from-green-500 to-emerald-700',
    rating: 4.7,
    playsCount: 9200,
    controlsHelp: 'Drag or click items into their matching bin.'
  },
  {
    id: 'object_catch',
    title: 'Fruit Basket Catcher',
    category: 'simulation',
    categoryName: 'Simulation',
    description: 'Catch falling apples, bananas and watermelons in your basket while dodging heavy falling rocks!',
    icon: '🧺',
    color: 'from-lime-500 to-green-600',
    rating: 4.8,
    playsCount: 12900,
    controlsHelp: 'Move basket Left or Right using Arrow Keys or Screen Buttons.'
  },

  // KIDS-FRIENDLY
  {
    id: 'color_match',
    title: 'Rainbow Color Splash',
    category: 'kids',
    categoryName: 'Kids Arcade',
    description: 'Match paint buckets with colorful rainbow splashes in a bright, playful cartoon world!',
    icon: '🎨',
    color: 'from-pink-400 to-purple-500',
    rating: 4.9,
    playsCount: 14700,
    controlsHelp: 'Tap the matching color bucket.'
  },
  {
    id: 'shape_sorter',
    title: 'Cute Shape Sorter',
    category: 'kids',
    categoryName: 'Kids Arcade',
    description: 'Fit cheerful geometric shapes (Stars, Hearts, Circles, Triangles) into their cutout frames!',
    icon: '⭐',
    color: 'from-amber-300 to-pink-400',
    rating: 4.9,
    playsCount: 11800,
    controlsHelp: 'Drag or tap the matching shape cutout frame.'
  }
];
