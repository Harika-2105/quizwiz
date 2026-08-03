import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../../../services/soundFx';

interface ArrowShootingProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

export const ArrowShooting: React.FC<ArrowShootingProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [arrowsLeft, setArrowsLeft] = useState<number>(10);
  const [targetY, setTargetY] = useState<number>(150);
  const [targetDir, setTargetDir] = useState<number>(1);
  const [arrowX, setArrowX] = useState<number | null>(null);
  const [arrowY, setArrowY] = useState<number>(200);

  const shootArrow = () => {
    if (isPaused || gameOver || arrowX !== null || arrowsLeft <= 0) return;
    setArrowX(50);
    setArrowY(200);
    soundFx.playPop();
  };

  // Target Moving Animation Loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      // Move Target Up & Down
      setTargetY((y) => {
        let nextY = y + targetDir * 3.5;
        if (nextY < 50) {
          setTargetDir(1);
          nextY = 50;
        } else if (nextY > 320) {
          setTargetDir(-1);
          nextY = 320;
        }
        return nextY;
      });

      // Flying Arrow Motion
      if (arrowX !== null) {
        setArrowX((x) => {
          if (x === null) return null;
          const nextX = x + 18;

          // Target Hit Test (Target is at x = 340)
          if (nextX >= 340) {
            const dist = Math.abs(200 - targetY);

            if (dist < 20) {
              soundFx.playCheer();
              setScore((s) => s + 50); // Bullseye!
            } else if (dist < 45) {
              soundFx.playCorrect();
              setScore((s) => s + 25);
            } else {
              soundFx.playIncorrect();
            }

            const remaining = arrowsLeft - 1;
            setArrowsLeft(remaining);

            if (remaining <= 0) {
              handleGameOver(score + (dist < 20 ? 50 : dist < 45 ? 25 : 0));
            }

            return null; // Reset Arrow
          }
          return nextX;
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, gameOver, targetDir, targetY, arrowX, arrowsLeft, score]);

  // Render Archery Stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#090518';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bow (Left)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(40, 200, 40, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Bow String
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 160);
    ctx.lineTo(40, 240);
    ctx.stroke();

    // Draw Target Rings (Right at x = 350)
    const tx = 350;
    ctx.fillStyle = '#EF4444'; // Outer Red Ring
    ctx.beginPath();
    ctx.arc(tx, targetY, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF'; // White Ring
    ctx.beginPath();
    ctx.arc(tx, targetY, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F59E0B'; // Bullseye Gold Ring
    ctx.beginPath();
    ctx.arc(tx, targetY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw Flying Arrow
    if (arrowX !== null) {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 25, arrowY);
      ctx.stroke();

      // Arrow Tip
      ctx.fillStyle = '#E0F2FE';
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY - 5);
      ctx.lineTo(arrowX + 8, arrowY);
      ctx.lineTo(arrowX, arrowY + 5);
      ctx.fill();
    }
  }, [targetY, arrowX, arrowY]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs font-black text-amber-300 uppercase tracking-wider">
        <span>🏹 Arrows Remaining: {arrowsLeft}</span>
        <span>Target Score: {score}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-purple-500/50 rounded-3xl shadow-2xl bg-slate-950 max-w-full cursor-pointer"
        onClick={shootArrow}
      />

      <button
        onClick={shootArrow}
        disabled={arrowX !== null || arrowsLeft <= 0}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black text-lg uppercase shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        🏹 RELEASE ARROW!
      </button>
    </div>
  );
};
