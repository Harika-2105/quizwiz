import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface NumberPatternProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const PATTERNS = [
  { sequence: ['2', '4', '6', '8', '?'], correct: '10', options: ['9', '10', '12', '14'] },
  { sequence: ['5', '10', '15', '20', '?'], correct: '25', options: ['22', '24', '25', '30'] },
  { sequence: ['3', '6', '12', '24', '?'], correct: '48', options: ['36', '42', '48', '50'] },
  { sequence: ['1', '4', '9', '16', '?'], correct: '25', options: ['20', '25', '30', '36'] },
  { sequence: ['100', '90', '80', '70', '?'], correct: '60', options: ['50', '55', '60', '65'] }
];

export const NumberPattern: React.FC<NumberPatternProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const [pIndex, setPIndex] = useState<number>(0);
  const current = PATTERNS[pIndex % PATTERNS.length];

  const handleChoose = (opt: string) => {
    if (isPaused || gameOver) return;

    if (opt === current.correct) {
      soundFx.playCorrect();
      setScore((s) => s + 30);
    } else {
      soundFx.playIncorrect();
    }
    setPIndex((idx) => idx + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md p-4 bg-slate-950 border-4 border-blue-500/50 rounded-3xl shadow-2xl">
      <h3 className="text-sm font-black uppercase text-blue-300 tracking-wider">Find the Missing Number</h3>

      {/* Sequence Display */}
      <div className="flex items-center justify-center gap-3">
        {current.sequence.map((item, idx) => (
          <div
            key={idx}
            className={`w-12 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
              item === '?'
                ? 'bg-amber-400 text-slate-950 border-2 border-white animate-pulse'
                : 'bg-slate-900 border border-white/10 text-white'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Option Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoose(opt)}
            className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-xl active:scale-95 transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
