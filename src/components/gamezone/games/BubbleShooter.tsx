import React, { useState } from 'react';
import { soundFx } from '../../../services/soundFx';

interface BubbleShooterProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const BUBBLE_COLORS = ['🔴', '🔵', '🟢', '🟡', '🟣'];

export const BubbleShooter: React.FC<BubbleShooterProps> = ({
  isPaused,
  gameOver,
  setScore,
  handleGameOver
}) => {
  const [grid, setGrid] = useState<string[][]>(() => [
    ['🔴', '🔵', '🟢', '🟡', '🟣', '🔴'],
    ['🟢', '🟡', '🔴', '🔵', '🟢', '🟡'],
    ['🔵', '🔴', '🟣', '🟡', '🔴', '🔵'],
    ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪'],
    ['⚪', '⚪', '⚪', '⚪', '⚪', '⚪']
  ]);

  const [currentBubble, setCurrentBubble] = useState<string>('🔴');

  const shootToColumn = (colIdx: number) => {
    if (isPaused || gameOver) return;

    soundFx.playPop();

    // Find first open slot in column from bottom up
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      let placedRow = -1;

      for (let r = newGrid.length - 1; r >= 0; r--) {
        if (newGrid[r][colIdx] === '⚪') {
          newGrid[r][colIdx] = currentBubble;
          placedRow = r;
          break;
        }
      }

      if (placedRow !== -1) {
        // Simple cluster match test
        let matches = 1;
        const color = currentBubble;

        // Check horizontal neighbours
        if (colIdx > 0 && newGrid[placedRow][colIdx - 1] === color) matches++;
        if (colIdx < newGrid[0].length - 1 && newGrid[placedRow][colIdx + 1] === color) matches++;

        if (matches >= 2) {
          soundFx.playCorrect();
          setScore((s) => s + matches * 20);
          // Pop matches
          newGrid[placedRow][colIdx] = '⚪';
          if (colIdx > 0 && newGrid[placedRow][colIdx - 1] === color) newGrid[placedRow][colIdx - 1] = '⚪';
          if (colIdx < newGrid[0].length - 1 && newGrid[placedRow][colIdx + 1] === color) newGrid[placedRow][colIdx + 1] = '⚪';
        }
      } else {
        // Column full
        soundFx.playIncorrect();
        handleGameOver(100);
      }

      return newGrid;
    });

    // Next random bubble
    setCurrentBubble(BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
      {/* Bubble Grid Stage */}
      <div className="w-full bg-slate-950 border-4 border-indigo-500/50 rounded-3xl p-4 shadow-2xl space-y-2">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center justify-around">
            {row.map((bubble, cIdx) => (
              <button
                key={cIdx}
                onClick={() => shootToColumn(cIdx)}
                className="text-2xl hover:scale-125 transition-transform p-1 focus:outline-none"
              >
                {bubble}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Shooter Cannon Control */}
      <div className="flex items-center justify-between w-full p-4 bg-slate-900 border border-white/10 rounded-2xl">
        <span className="text-xs font-bold text-slate-300">Next Loaded Bubble:</span>
        <span className="text-3xl animate-bounce">{currentBubble}</span>
        <span className="text-[10px] text-indigo-300 font-extrabold uppercase">Tap Column to Shoot</span>
      </div>
    </div>
  );
};
