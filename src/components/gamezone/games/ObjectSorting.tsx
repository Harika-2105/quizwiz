import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface ObjectSortingProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const ITEMS = [
  { name: 'Plastic Bottle', emoji: '🍾', category: 'recycle' },
  { name: 'Apple Core', emoji: '🍎', category: 'organic' },
  { name: 'Old Battery', emoji: '🔋', category: 'hazardous' },
  { name: 'Cardboard Box', emoji: '📦', category: 'recycle' },
  { name: 'Banana Peel', emoji: '🍌', category: 'organic' },
  { name: 'Lightbulb', emoji: '💡', category: 'hazardous' }
];

export const ObjectSorting: React.FC<ObjectSortingProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const [itemIdx, setItemIdx] = useState<number>(0);
  const current = ITEMS[itemIdx % ITEMS.length];

  const handleSort = (cat: 'recycle' | 'organic' | 'hazardous') => {
    if (isPaused || gameOver) return;

    if (cat === current.category) {
      soundFx.playCorrect();
      setScore((s) => s + 20);
    } else {
      soundFx.playIncorrect();
    }
    setItemIdx((idx) => idx + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md p-4 bg-slate-950 border-4 border-emerald-500/50 rounded-3xl shadow-2xl">
      <span className="text-xs font-black uppercase text-emerald-300">Eco Recycling Sort</span>

      {/* Item Card */}
      <div className="p-6 bg-slate-900 border-2 border-white/20 rounded-3xl flex flex-col items-center gap-2 shadow-2xl animate-bounce-subtle">
        <span className="text-6xl">{current.emoji}</span>
        <span className="text-base font-black text-white">{current.name}</span>
      </div>

      {/* Bins */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <button
          onClick={() => handleSort('recycle')}
          className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex flex-col items-center gap-1 font-black text-xs uppercase shadow-xl"
        >
          <span className="text-2xl">♻️</span>
          <span>Recycle</span>
        </button>

        <button
          onClick={() => handleSort('organic')}
          className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex flex-col items-center gap-1 font-black text-xs uppercase shadow-xl"
        >
          <span className="text-2xl">🌱</span>
          <span>Organic</span>
        </button>

        <button
          onClick={() => handleSort('hazardous')}
          className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl flex flex-col items-center gap-1 font-black text-xs uppercase shadow-xl"
        >
          <span className="text-2xl">⚠️</span>
          <span>Hazardous</span>
        </button>
      </div>
    </div>
  );
};
