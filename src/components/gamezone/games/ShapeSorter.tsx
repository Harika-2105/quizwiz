import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface ShapeSorterProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const SHAPES = [
  { name: 'Star', emoji: '⭐', color: 'from-yellow-400 to-amber-500' },
  { name: 'Heart', emoji: '❤️', color: 'from-rose-500 to-pink-600' },
  { name: 'Circle', emoji: '🟢', color: 'from-emerald-400 to-teal-500' },
  { name: 'Triangle', emoji: '🔺', color: 'from-orange-500 to-amber-600' }
];

export const ShapeSorter: React.FC<ShapeSorterProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const [sIdx, setSIdx] = useState<number>(0);
  const currentShape = SHAPES[sIdx % SHAPES.length];

  const handleTap = (s: typeof SHAPES[0]) => {
    if (isPaused || gameOver) return;

    if (s.name === currentShape.name) {
      soundFx.playCorrect();
      setScore((st) => st + 20);
    } else {
      soundFx.playIncorrect();
    }
    setSIdx((idx) => idx + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md p-6 bg-slate-950 border-4 border-amber-400/50 rounded-3xl shadow-2xl">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase text-amber-300">Fit the Shape Cutout!</span>
        <div className="p-8 bg-slate-900 border-4 border-dashed border-amber-400 rounded-3xl flex flex-col items-center justify-center text-6xl shadow-2xl animate-bounce">
          {currentShape.emoji}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {SHAPES.map((s) => (
          <button
            key={s.name}
            onClick={() => handleTap(s)}
            className={`p-5 rounded-3xl bg-gradient-to-r ${s.color} text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            <span className="text-2xl">{s.emoji}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
