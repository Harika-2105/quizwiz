import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../../../services/soundFx';

interface ObjectCatchProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

export const ObjectCatch: React.FC<ObjectCatchProps> = ({
  isPaused,
  gameOver,
  score,
  setScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [basketX, setBasketX] = useState<number>(170);
  const [items, setItems] = useState<Array<{ id: number; x: number; y: number; isRock: boolean }>>([]);

  const moveLeft = () => setBasketX((x) => Math.max(0, x - 35));
  const moveRight = () => setBasketX((x) => Math.min(320, x + 35));

  // Motion Loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const next = prev
          .map((item) => ({ ...item, y: item.y + 6 }))
          .filter((item) => item.y < 420);

        // Catch Test
        return next.filter((item) => {
          if (item.y > 330 && item.y < 380 && Math.abs(item.x - basketX) < 45) {
            if (item.isRock) {
              soundFx.playIncorrect();
              setScore((s) => Math.max(0, s - 25));
            } else {
              soundFx.playPop();
              setScore((s) => s + 15);
            }
            return false;
          }
          return true;
        });
      });

      // Spawn falling items
      if (Math.random() < 0.08) {
        setItems((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: 20 + Math.random() * 340,
            y: -20,
            isRock: Math.random() < 0.2
          }
        ]);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, gameOver, basketX, score]);

  // Render Stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Falling Fruits & Rocks
    items.forEach((item) => {
      ctx.font = '24px sans-serif';
      ctx.fillText(item.isRock ? '🪨' : '🍎', item.x, item.y);
    });

    // Basket
    ctx.font = '36px sans-serif';
    ctx.fillText('🧺', basketX, 360);
  }, [basketX, items]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-lime-500/50 rounded-3xl shadow-2xl bg-slate-950 max-w-full"
      />

      <div className="flex items-center gap-6">
        <button
          onClick={moveLeft}
          className="px-8 py-3 rounded-2xl bg-lime-500 text-slate-950 font-black text-lg shadow-xl active:scale-95 transition-all"
        >
          ◀ Move Left
        </button>

        <button
          onClick={moveRight}
          className="px-8 py-3 rounded-2xl bg-lime-500 text-slate-950 font-black text-lg shadow-xl active:scale-95 transition-all"
        >
          Move Right ▶
        </button>
      </div>
    </div>
  );
};
