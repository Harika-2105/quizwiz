import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface CookingGameProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const INGREDIENTS = [
  { name: 'Bun Bottom', emoji: '🍞' },
  { name: 'Patty', emoji: '🥩' },
  { name: 'Cheese', emoji: '🧀' },
  { name: 'Lettuce', emoji: '🥬' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Bun Top', emoji: '🍞' }
];

const ORDERS = [
  { name: 'Cheeseburger Deluxe', recipe: ['🍞', '🥩', '🧀', '🥬', '🍞'] },
  { name: 'Double Patty Monster', recipe: ['🍞', '🥩', '🥩', '🧀', '🍅', '🍞'] },
  { name: 'Fresh Veggie Salad Bun', recipe: ['🍞', '🥬', '🍅', '🧀', '🍞'] }
];

export const CookingGame: React.FC<CookingGameProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const [orderIdx, setOrderIdx] = useState<number>(0);
  const [assembled, setAssembled] = useState<string[]>([]);

  const currentOrder = ORDERS[orderIdx % ORDERS.length];

  const addIngredient = (emoji: string) => {
    if (isPaused || gameOver) return;
    soundFx.playPop();

    const nextStack = [...assembled, emoji];
    setAssembled(nextStack);

    // Check match
    if (nextStack.length === currentOrder.recipe.length) {
      if (nextStack.every((item, i) => item === currentOrder.recipe[i])) {
        soundFx.playCheer();
        setScore((s) => s + 50);
      } else {
        soundFx.playIncorrect();
      }
      setAssembled([]);
      setOrderIdx((idx) => idx + 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md p-4 bg-slate-950 border-4 border-amber-600/50 rounded-3xl shadow-2xl">
      {/* Ticket Banner */}
      <div className="w-full bg-amber-500/20 border border-amber-400/40 p-3 rounded-2xl text-center space-y-1">
        <span className="text-[10px] font-black uppercase text-amber-300">Ticket: {currentOrder.name}</span>
        <div className="flex items-center justify-center gap-2 text-2xl pt-1">
          {currentOrder.recipe.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* Plate Stack */}
      <div className="w-full h-36 bg-slate-900 border border-white/10 rounded-2xl flex flex-col-reverse items-center justify-start p-2 gap-1 overflow-hidden">
        {assembled.map((item, idx) => (
          <span key={idx} className="text-2xl animate-bounce">
            {item}
          </span>
        ))}
      </div>

      {/* Ingredient Tray Controls */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {INGREDIENTS.map((ing) => (
          <button
            key={ing.name}
            onClick={() => addIngredient(ing.emoji)}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-xs"
          >
            <span className="text-2xl">{ing.emoji}</span>
            <span className="hidden sm:inline">{ing.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
