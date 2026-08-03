import React, { useState, useEffect } from 'react';
import { soundFx } from '../../../services/soundFx';

interface BalloonPopProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  isBomb?: boolean;
}

const BALLOON_COLORS = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

export const BalloonPop: React.FC<BalloonPopProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Timer Countdown
  useEffect(() => {
    if (isPaused || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          soundFx.playCheer();
          handleGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, gameOver, score]);

  // Balloon Float Motion Loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setBalloons((prev) => {
        const next = prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -80);

        // Spawn new balloons
        if (Math.random() < 0.25 && next.length < 8) {
          const isBomb = Math.random() < 0.15;
          next.push({
            id: Date.now() + Math.random(),
            x: 10 + Math.random() * 80,
            y: 420,
            speed: 2 + Math.random() * 3,
            color: isBomb ? '#1E293B' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            isBomb
          });
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, gameOver]);

  const popBalloon = (b: Balloon) => {
    if (isPaused || gameOver) return;
    if (b.isBomb) {
      soundFx.playIncorrect();
      setScore((s) => Math.max(0, s - 30));
    } else {
      soundFx.playPop();
      setScore((s) => s + 10);
    }
    setBalloons((prev) => prev.filter((item) => item.id !== b.id));
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs font-black text-amber-300 uppercase tracking-wider">
        <span>⏱️ Time: {timeLeft}s</span>
        <span>🎈 Score: {score}</span>
      </div>

      {/* Floating Arena Stage */}
      <div className="relative w-full max-w-sm h-[380px] bg-slate-950 border-4 border-pink-500/50 rounded-3xl overflow-hidden shadow-2xl p-2">
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => popBalloon(b)}
            style={{ left: `${b.x}%`, top: `${b.y}px` }}
            className="absolute transform -translate-x-1/2 cursor-pointer transition-transform active:scale-125 focus:outline-none"
          >
            {b.isBomb ? (
              <div className="w-12 h-14 bg-slate-900 border-2 border-rose-500 rounded-full flex items-center justify-center text-xl shadow-xl animate-pulse">
                💣
              </div>
            ) : (
              <div
                style={{ backgroundColor: b.color }}
                className="w-11 h-14 rounded-full shadow-lg border border-white/30 flex items-center justify-center text-xs font-black text-white"
              >
                🎈
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
