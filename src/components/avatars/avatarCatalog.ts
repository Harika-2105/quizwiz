export interface AvatarItem {
  id: string;
  name: string;
  category: 'boy' | 'girl' | 'cartoon' | 'animal' | 'gaming' | 'kids';
  categoryLabel: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  emojiFallback: string;
}

export const AVATAR_CATEGORIES = [
  { id: 'all', label: 'All Avatars', icon: '✨' },
  { id: 'boy', label: 'Boy Heroes', icon: '👦' },
  { id: 'girl', label: 'Girl Heroes', icon: '👧' },
  { id: 'cartoon', label: 'Cartoon Faces', icon: '😜' },
  { id: 'animal', label: 'Cute Animals', icon: '🐱' },
  { id: 'gaming', label: 'Gaming Icons', icon: '🎮' },
  { id: 'kids', label: 'Kids Friendly', icon: '🦄' },
] as const;

export const DEFAULT_AVATAR_ID = 'animal_cyber_cat';

export const AVATAR_CATALOG: AvatarItem[] = [
  // ANIMAL
  {
    id: 'animal_cyber_cat',
    name: 'Cyber Neon Cat',
    category: 'animal',
    categoryLabel: 'Cute Animals',
    description: 'Futuristic feline with glowing LED visor & twitching ears!',
    bgGradient: 'from-purple-600 via-pink-500 to-indigo-600',
    accentColor: '#EC4899',
    emojiFallback: '🐱'
  },
  {
    id: 'animal_panda',
    name: 'Bouncing Bamboo Panda',
    category: 'animal',
    categoryLabel: 'Cute Animals',
    description: 'Cheerful panda munching bamboo with playful winking eyes.',
    bgGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    accentColor: '#10B981',
    emojiFallback: '🐼'
  },
  {
    id: 'animal_dog',
    name: 'Cool Shiba Doge',
    category: 'animal',
    categoryLabel: 'Cute Animals',
    description: 'Sunglasses-wearing Shiba with golden star energy!',
    bgGradient: 'from-amber-400 via-orange-500 to-yellow-600',
    accentColor: '#F59E0B',
    emojiFallback: '🐶'
  },
  {
    id: 'animal_fox',
    name: 'Neon Fire Fox',
    category: 'animal',
    categoryLabel: 'Cute Animals',
    description: 'Mystical fox with floating ember sparks and glowing tail.',
    bgGradient: 'from-orange-500 via-red-500 to-rose-600',
    accentColor: '#F97316',
    emojiFallback: '🦊'
  },
  {
    id: 'animal_monkey',
    name: 'Astro Space Monkey',
    category: 'animal',
    categoryLabel: 'Cute Animals',
    description: 'Astronaut monkey orbiting with floating banana rockets.',
    bgGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    accentColor: '#3B82F6',
    emojiFallback: '🐵'
  },

  // BOY
  {
    id: 'boy_cyber',
    name: 'Cyber Neon Kid',
    category: 'boy',
    categoryLabel: 'Boy Heroes',
    description: 'Tech wizard boy with glowing visor and pulsing headphones.',
    bgGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    accentColor: '#06B6D4',
    emojiFallback: '👦'
  },
  {
    id: 'boy_gamer',
    name: 'Pro Gamer Boy',
    category: 'boy',
    categoryLabel: 'Boy Heroes',
    description: 'RGB headset champ ready to crush any trivia challenge!',
    bgGradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    accentColor: '#8B5CF6',
    emojiFallback: '🎮'
  },
  {
    id: 'boy_ninja',
    name: 'Shadow Shinobi',
    category: 'boy',
    categoryLabel: 'Boy Heroes',
    description: 'Stealth ninja with glowing mask and floating shurikens.',
    bgGradient: 'from-slate-800 via-zinc-900 to-neutral-950',
    accentColor: '#64748B',
    emojiFallback: '🥷'
  },
  {
    id: 'boy_hero',
    name: 'Super Astro Boy',
    category: 'boy',
    categoryLabel: 'Boy Heroes',
    description: 'Cosmic hero floating with star power cape and energy aura.',
    bgGradient: 'from-amber-400 via-yellow-500 to-red-500',
    accentColor: '#EF4444',
    emojiFallback: '🦸‍♂️'
  },

  // GIRL
  {
    id: 'girl_anime',
    name: 'Anime Star Girl',
    category: 'girl',
    categoryLabel: 'Girl Heroes',
    description: 'Pop star girl with floating hair ribbons & sparkle eyes!',
    bgGradient: 'from-pink-500 via-rose-500 to-purple-600',
    accentColor: '#F43F5E',
    emojiFallback: '👧'
  },
  {
    id: 'girl_gamer',
    name: 'Arcade Bunny Queen',
    category: 'girl',
    categoryLabel: 'Girl Heroes',
    description: 'Gamer girl wearing bunny ears headset and pixel hearts.',
    bgGradient: 'from-fuchsia-500 via-purple-600 to-pink-600',
    accentColor: '#D946EF',
    emojiFallback: '🎧'
  },
  {
    id: 'girl_wonder',
    name: 'Cosmic Princess',
    category: 'girl',
    categoryLabel: 'Girl Heroes',
    description: 'Galaxy princess crowned with orbiting shooting stars.',
    bgGradient: 'from-indigo-600 via-purple-700 to-pink-700',
    accentColor: '#6366F1',
    emojiFallback: '👸'
  },
  {
    id: 'girl_cyber',
    name: 'Neon Techie Girl',
    category: 'girl',
    categoryLabel: 'Girl Heroes',
    description: 'Cyberpunk hacker girl with cyan goggles & data pulse.',
    bgGradient: 'from-teal-400 via-emerald-500 to-cyan-600',
    accentColor: '#14B8A6',
    emojiFallback: '👩‍💻'
  },

  // CARTOON
  {
    id: 'cartoon_wink',
    name: 'Wink Master Emoji',
    category: 'cartoon',
    categoryLabel: 'Cartoon Faces',
    description: 'Joyful animated star face winking with spinning star halo!',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-500',
    accentColor: '#EAB308',
    emojiFallback: '😜'
  },
  {
    id: 'cartoon_scholar',
    name: 'Crazy Quiz Wiz',
    category: 'cartoon',
    categoryLabel: 'Cartoon Faces',
    description: 'Enchanted wizard hat face casting magical trivia spells.',
    bgGradient: 'from-purple-700 via-indigo-800 to-blue-900',
    accentColor: '#A855F7',
    emojiFallback: '🧙'
  },
  {
    id: 'cartoon_pixel',
    name: 'Retro 8-Bit Pal',
    category: 'cartoon',
    categoryLabel: 'Cartoon Faces',
    description: 'Nostalgic arcade face bouncing inside pixel CRT screen.',
    bgGradient: 'from-green-500 via-emerald-600 to-teal-800',
    accentColor: '#22C55E',
    emojiFallback: '👾'
  },
  {
    id: 'cartoon_flame',
    name: 'Blaze Spark Fire',
    category: 'cartoon',
    categoryLabel: 'Cartoon Faces',
    description: 'Fiery animated cartoon flame with high-voltage energy eyes!',
    bgGradient: 'from-red-500 via-orange-500 to-yellow-500',
    accentColor: '#EF4444',
    emojiFallback: '🔥'
  },

  // GAMING
  {
    id: 'gaming_ghost',
    name: 'Arcade Neon Ghost',
    category: 'gaming',
    categoryLabel: 'Gaming Icons',
    description: 'Retro arcade ghost floating up and down with shifting colors.',
    bgGradient: 'from-cyan-600 via-blue-700 to-purple-800',
    accentColor: '#06B6D4',
    emojiFallback: '👻'
  },
  {
    id: 'gaming_dragon',
    name: 'Pixel Fire Dragon',
    category: 'gaming',
    categoryLabel: 'Gaming Icons',
    description: 'Legendary dragon breathing animated embers and flapping wings.',
    bgGradient: 'from-rose-600 via-red-700 to-orange-600',
    accentColor: '#E11D48',
    emojiFallback: '🐉'
  },
  {
    id: 'gaming_helmet',
    name: 'Mecha Cyber Knight',
    category: 'gaming',
    categoryLabel: 'Gaming Icons',
    description: 'Pulsing visor helmet with metallic sheen and energy aura.',
    bgGradient: 'from-slate-700 via-blue-900 to-indigo-950',
    accentColor: '#38BDF8',
    emojiFallback: '🤖'
  },
  {
    id: 'gaming_controller',
    name: 'GamePad Monster',
    category: 'gaming',
    categoryLabel: 'Gaming Icons',
    description: 'Interactive controller character with glowing D-pad eyes!',
    bgGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    accentColor: '#818CF8',
    emojiFallback: '🕹️'
  },

  // KIDS
  {
    id: 'kids_unicorn',
    name: 'Magic Rainbow Unicorn',
    category: 'kids',
    categoryLabel: 'Kids Friendly',
    description: 'Sparkling unicorn horn with floating rainbow star dust!',
    bgGradient: 'from-pink-400 via-purple-400 to-indigo-400',
    accentColor: '#EC4899',
    emojiFallback: '🦄'
  },
  {
    id: 'kids_dino',
    name: 'Party Dino T-Rex',
    category: 'kids',
    categoryLabel: 'Kids Friendly',
    description: 'Friendly green dinosaur wearing party hat and dancing!',
    bgGradient: 'from-lime-400 via-emerald-500 to-teal-600',
    accentColor: '#84CC16',
    emojiFallback: '🦖'
  },
  {
    id: 'kids_bear',
    name: 'Space Astronaut Bear',
    category: 'kids',
    categoryLabel: 'Kids Friendly',
    description: 'Teddy bear astronaut floating in bubble helmet.',
    bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
    accentColor: '#38BDF8',
    emojiFallback: '🧸'
  },
  {
    id: 'kids_robot',
    name: 'Friendly Beep Bot',
    category: 'kids',
    categoryLabel: 'Kids Friendly',
    description: 'Animated cute robot with blinking antenna & glowing heart.',
    bgGradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    accentColor: '#C084FC',
    emojiFallback: '🤖'
  }
];

export function getAvatarById(id?: string): AvatarItem {
  if (!id) return AVATAR_CATALOG[0];
  return AVATAR_CATALOG.find(a => a.id === id) || AVATAR_CATALOG[0];
}
