import React, { useState, useEffect } from 'react';
import { soundFx } from '../../../services/soundFx';

interface FishCatchProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

interface Fish {
  id: number;
  x: number;
  y: number;
  type: string;
  points: number;
  speed: number;
}

export const FishCatch: React.FC<FishCatchProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver
}) => {
  const [hookY, setHookY] = useState<number>(40);
  const [hookDropping, setHookDropping] = useState<boolean>(false);
  const [fishes, setFishes] = useState<Fish[]>([
    { id: 1, x: 20, y: 120, type: '🐠', points: 15, speed: 2 },
    { id: 2, x: 250, y: 200, type: '🐟', points: 20, speed: 3 },
    { id: 3, x: 100, y: 280, type: '🐡', points: 30, speed: 1.5 },
    { id: 4, x: 300, y: 320, type: '🦈', points: 50, speed: 4 }
  ]);

  const dropHook = () => {
    if (isPaused || gameOver || hookDropping) return;
    setHookDropping(true);
    soundFx.playPop();
  };

  // Motion Loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      // Hook dropping physics
      if (hookDropping) {
        setHookY((y) => {
          const nextY = y + 10;
          if (nextY >= 350) {
            setHookDropping(false);
            return 40;
          }
          return nextY;
        });
      }

      // Swim Fishes
      setFishes((prev) =>
        prev.map((f) => {
          let nextX = f.x + f.speed;
          if (nextX > 360) nextX = -30;

          // Catch Collision with Hook
          if (hookDropping && Math.abs(f.y - hookY) < 25 && Math.abs(f.x - 180) < 30) {
            soundFx.playCorrect();
            setScore((s) => s + f.points);
            setHookDropping(false);
            setHookY(40);
            return { ...f, x: -50 };
          }

          return { ...f, x: nextX };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, gameOver, hookDropping, hookY, score]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
      {/* Ocean Stage */}
      <div className="relative w-full h-[380px] bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-950 border-4 border-cyan-400/50 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Fishing Line */}
        <div
          style={{ height: `${hookY}px` }}
          className="absolute left-1/2 top-0 w-1 bg-white/70 transform -translate-x-1/2"
        />

        {/* Hook */}
        <div
          style={{ top: `${hookY}px` }}
          className="absolute left-1/2 transform -translate-x-1/2 text-2xl transition-all"
        >
          🪝
        </div>

        {/* Swimming Fishes */}
        {fishes.map((f) => (
          <div
            key={f.id}
            style={{ left: `${f.x}px`, top: `${f.y}px` }}
            className="absolute text-3xl transition-all"
          >
            {f.type}
          </div>
        ))}
      </div>

      <button
        onClick={dropHook}
        disabled={hookDropping}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-lg uppercase shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        🎣 CAST HOOK INTO SEA
      </button>
    </div>
  );
};
