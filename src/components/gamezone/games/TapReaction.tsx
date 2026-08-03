import React, { useState, useEffect } from 'react';
import { soundFx } from '../../../services/soundFx';

interface TapReactionProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

export const TapReaction: React.FC<TapReactionProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver
}) => {
  const [activePad, setActivePad] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Randomly light up a pad
  useEffect(() => {
    if (isPaused || gameOver) return;

    const timer = setTimeout(() => {
      const padIdx = Math.floor(Math.random() * 9);
      setActivePad(padIdx);
      setStartTime(Date.now());
    }, 1000 + Math.random() * 1500);

    return () => clearTimeout(timer);
  }, [activePad, isPaused, gameOver]);

  const tapPad = (padIdx: number) => {
    if (isPaused || gameOver) return;

    if (padIdx === activePad) {
      const ms = Date.now() - startTime;
      soundFx.playCorrect();
      setReactionTime(ms);
      setScore((s) => s + Math.max(10, 500 - ms));
      setActivePad(null);
    } else {
      soundFx.playIncorrect();
      setScore((s) => Math.max(0, s - 20));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5 w-full max-w-sm">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase text-amber-300">
          {reactionTime ? `Last Reaction: ${reactionTime} ms` : 'Tap the glowing pad instantly!'}
        </p>
      </div>

      {/* 3x3 Target Pad Grid */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square bg-slate-950 p-4 border-4 border-amber-400/50 rounded-3xl shadow-2xl">
        {Array.from({ length: 9 }).map((_, idx) => {
          const isActive = idx === activePad;
          return (
            <button
              key={idx}
              onClick={() => tapPad(idx)}
              className={`rounded-2xl transition-all duration-150 flex items-center justify-center font-black text-2xl active:scale-90 ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-2xl scale-105 border-2 border-white animate-bounce'
                  : 'bg-slate-900 border border-white/10 text-slate-700 hover:bg-slate-800'
              }`}
            >
              {isActive ? '⚡' : '•'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
