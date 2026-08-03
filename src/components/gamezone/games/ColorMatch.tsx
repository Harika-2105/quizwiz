import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface ColorMatchProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const COLORS = [
  { name: 'Red', hex: '#EF4444', emoji: '🔴' },
  { name: 'Blue', hex: '#3B82F6', emoji: '🔵' },
  { name: 'Green', hex: '#10B981', emoji: '🟢' },
  { name: 'Yellow', hex: '#F59E0B', emoji: '🟡' },
  { name: 'Purple', hex: '#8B5CF6', emoji: '🟣' }
];

export const ColorMatch: React.FC<ColorMatchProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const targetColor = COLORS[targetIdx % COLORS.length];

  const handleTapColor = (c: typeof COLORS[0]) => {
    if (isPaused || gameOver) return;

    if (c.name === targetColor.name) {
      soundFx.playCorrect();
      setScore((s) => s + 25);
    } else {
      soundFx.playIncorrect();
    }
    setTargetIdx((idx) => idx + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md p-6 bg-slate-950 border-4 border-pink-400/50 rounded-3xl shadow-2xl">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase text-pink-300">Tap the Matching Color Bucket!</span>
        <h3 className="text-3xl font-black text-white flex items-center justify-center gap-2">
          <span>{targetColor.emoji}</span>
          <span style={{ color: targetColor.hex }}>{targetColor.name}</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => handleTapColor(c)}
            style={{ backgroundColor: c.hex }}
            className="p-6 rounded-3xl text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-90 transition-all flex items-center justify-center gap-2 border-2 border-white/30"
          >
            <span className="text-3xl">🎨</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
