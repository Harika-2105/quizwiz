import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundFx } from '../../../services/soundFx';
import { saveGameScore, getGameStats } from '../../../services/gameStats';
import { Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Puzzle2048Props {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

type BoardGrid = number[][];

const TILE_COLORS: Record<number, string> = {
  2: 'bg-[#eee4da] text-[#776e65]',
  4: 'bg-[#ede0c8] text-[#776e65]',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-white shadow-lg',
  256: 'bg-[#edcc61] text-white shadow-lg',
  512: 'bg-[#edc850] text-white shadow-lg',
  1024: 'bg-[#edc53f] text-white shadow-xl ring-4 ring-amber-300',
  2048: 'bg-[#edc22e] text-white shadow-2xl ring-4 ring-amber-400 animate-pulse',
};

export const Puzzle2048: React.FC<Puzzle2048Props> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver,
  restartGame
}) => {
  const [board, setBoard] = useState<BoardGrid>(() => initBoard());
  const [highScore, setHighScore] = useState<number>(() => getGameStats().highScores['puzzle_2048'] || 0);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function initBoard(): BoardGrid {
    const grid = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(grid);
    addRandomTile(grid);
    return grid;
  }

  function addRandomTile(grid: BoardGrid) {
    const emptyCells: Array<[number, number]> = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) emptyCells.push([r, c]);
      }
    }
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  // Slide & Merge Row to the left
  const slideRowLeft = (row: number[]): { newRow: number[]; gainedPoints: number } => {
    let nonZero = row.filter(val => val !== 0);
    let gainedPoints = 0;
    const result: number[] = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;
        result.push(merged);
        gainedPoints += merged;
        i++; // skip next merged tile
      } else {
        result.push(nonZero[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { newRow: result, gainedPoints };
  };

  // Move Logic for Left, Right, Up, Down
  const moveBoard = useCallback((direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    if (isPaused || gameOver) return;

    let newGrid: BoardGrid = board.map(row => [...row]);
    let totalPointsGained = 0;
    let changed = false;

    if (direction === 'LEFT') {
      for (let r = 0; r < 4; r++) {
        const { newRow, gainedPoints } = slideRowLeft(newGrid[r]);
        if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) changed = true;
        newGrid[r] = newRow;
        totalPointsGained += gainedPoints;
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        const reversed = [...newGrid[r]].reverse();
        const { newRow, gainedPoints } = slideRowLeft(reversed);
        const finalRow = newRow.reverse();
        if (JSON.stringify(newGrid[r]) !== JSON.stringify(finalRow)) changed = true;
        newGrid[r] = finalRow;
        totalPointsGained += gainedPoints;
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < 4; c++) {
        const column = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        const { newRow, gainedPoints } = slideRowLeft(column);
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== newRow[r]) changed = true;
          newGrid[r][c] = newRow[r];
        }
        totalPointsGained += gainedPoints;
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < 4; c++) {
        const column = [newGrid[3][c], newGrid[2][c], newGrid[1][c], newGrid[0][c]];
        const { newRow, gainedPoints } = slideRowLeft(column);
        const reversedCol = newRow.reverse();
        for (let r = 0; r < 4; r++) {
          if (newGrid[r][c] !== reversedCol[r]) changed = true;
          newGrid[r][c] = reversedCol[r];
        }
        totalPointsGained += gainedPoints;
      }
    }

    if (changed) {
      soundFx.playPop();
      addRandomTile(newGrid);
      setBoard(newGrid);

      const newScore = score + totalPointsGained;
      setScore(newScore);
      const newHigh = saveGameScore('puzzle_2048', newScore);
      setHighScore(newHigh);

      // Check Game Over (no empty cells and no adjacent equal tiles)
      if (checkGameOver(newGrid)) {
        soundFx.playIncorrect();
        handleGameOver(newScore);
      }
    }
  }, [board, isPaused, gameOver, score, setScore, handleGameOver]);

  const checkGameOver = (grid: BoardGrid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return false;
        if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
      }
    }
    return true;
  };

  // Keyboard Arrow Listeners
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) moveBoard('LEFT');
    else if (['ArrowRight', 'KeyD'].includes(e.code)) moveBoard('RIGHT');
    else if (['ArrowUp', 'KeyW'].includes(e.code)) moveBoard('UP');
    else if (['ArrowDown', 'KeyS'].includes(e.code)) moveBoard('DOWN');
  }, [moveBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch Swipe Gesture Detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) moveBoard('RIGHT');
        else moveBoard('LEFT');
      } else {
        if (dy > 0) moveBoard('DOWN');
        else moveBoard('UP');
      }
    }
    touchStartRef.current = null;
  };

  const handleReset = () => {
    soundFx.playClick();
    const fresh = initBoard();
    setBoard(fresh);
    restartGame();
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md">
      
      {/* High Score Bar */}
      <div className="flex items-center justify-between w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-xs font-bold text-slate-300">
        <span className="font-extrabold text-amber-300">2048 Tile Merger</span>
        <div className="flex items-center gap-1.5 text-amber-300 font-mono">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>High: {highScore}</span>
        </div>
      </div>

      {/* Classic 4x4 Grid Container with Touch Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full aspect-square bg-[#bbada0] p-3 rounded-3xl shadow-2xl grid grid-cols-4 grid-rows-4 gap-2.5 touch-none relative select-none"
      >
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl transition-all duration-100 ${
                val === 0 ? 'bg-[#ccc0b4]/60' : TILE_COLORS[val] || 'bg-[#3c3a32] text-white'
              }`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>

      {/* On-screen Directional Touch Controls */}
      <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center space-y-2">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase">Swipe Grid or Use On-Screen Controls</p>

        <div className="grid grid-cols-3 gap-2 w-36">
          <div />
          <button
            onClick={() => moveBoard('UP')}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center border border-amber-500/30 active:scale-90"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onClick={() => moveBoard('LEFT')}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center border border-amber-500/30 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-white/10 active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => moveBoard('RIGHT')}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center border border-amber-500/30 active:scale-90"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onClick={() => moveBoard('DOWN')}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center border border-amber-500/30 active:scale-90"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>
      </div>

    </div>
  );
};
