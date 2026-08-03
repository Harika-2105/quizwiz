import React, { useState, useEffect } from 'react';
import { soundFx } from '../../../services/soundFx';
import { PlayerMode } from '../GameModeSelector';
import { Bot, Users } from 'lucide-react';

interface SnakesLaddersProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
  playerMode?: PlayerMode;
  roomCode?: string;
}

const SNAKES: { [key: number]: number } = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78
};

const LADDERS: { [key: number]: number } = {
  2: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

export const SnakesLadders: React.FC<SnakesLaddersProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver,
  playerMode = 'ai',
  roomCode
}) => {
  const [player1Pos, setPlayer1Pos] = useState<number>(1);
  const [player2Pos, setPlayer2Pos] = useState<number>(1);
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Roll the dice to begin climbing!');

  const p1Name = playerMode === 'ai' ? '🤠 You' : '🔴 Player 1';
  const p2Name = playerMode === 'ai' ? '🤖 AI Opponent' : '🔵 Player 2';

  const rollDice = () => {
    if (isPaused || gameOver || isRolling) return;
    setIsRolling(true);
    soundFx.playTick();

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);

      const currentPos = turn === 'p1' ? player1Pos : player2Pos;
      const currentName = turn === 'p1' ? p1Name : p2Name;
      let nextPos = currentPos + roll;

      if (nextPos >= 100) {
        if (turn === 'p1') setPlayer1Pos(100);
        else setPlayer2Pos(100);

        soundFx.playCheer();
        setScore((s) => s + 200);
        handleGameOver(200);
        setStatusMsg(`🎉 VICTORY! ${currentName} reached Tile 100!`);
        return;
      }

      // Check Snake or Ladder
      if (LADDERS[nextPos]) {
        soundFx.playCorrect();
        const dest = LADDERS[nextPos];
        setStatusMsg(`🪜 LADDER! ${currentName} climbed from ${nextPos} to ${dest}!`);
        nextPos = dest;
      } else if (SNAKES[nextPos]) {
        soundFx.playIncorrect();
        const dest = SNAKES[nextPos];
        setStatusMsg(`🐍 SNAKE! ${currentName} slid down from ${nextPos} to ${dest}!`);
        nextPos = dest;
      } else {
        soundFx.playPop();
        setStatusMsg(`${currentName} moved to Tile ${nextPos}.`);
      }

      if (turn === 'p1') {
        setPlayer1Pos(nextPos);
        setTurn('p2');
      } else {
        setPlayer2Pos(nextPos);
        setTurn('p1');
      }

    }, 500);
  };

  // AI Turn Handler
  useEffect(() => {
    if (playerMode === 'ai' && turn === 'p2' && !isRolling && !gameOver && !isPaused) {
      const aiTimer = setTimeout(() => {
        rollDice();
      }, 900);
      return () => clearTimeout(aiTimer);
    }
  }, [turn, playerMode, isRolling, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
      
      {/* Mode & Room Info Bar */}
      <div className="flex items-center justify-between w-full px-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300">
        <span className="flex items-center gap-1.5">
          {playerMode === 'ai' ? <Bot className="w-4 h-4 text-purple-400" /> : <Users className="w-4 h-4 text-amber-400" />}
          <span className="capitalize">{playerMode.replace('_', ' ')} Mode</span>
        </span>

        {roomCode && (
          <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-[11px]">
            Room: {roomCode}
          </span>
        )}
      </div>

      {/* 100 Tile Board Grid */}
      <div className="w-full bg-slate-950 border-4 border-amber-400/50 rounded-3xl p-2 shadow-2xl grid grid-cols-10 gap-1 text-[10px] font-black">
        {Array.from({ length: 100 }, (_, i) => 100 - i).map((tile) => {
          const isP1Here = player1Pos === tile;
          const isP2Here = player2Pos === tile;
          const isLadder = Boolean(LADDERS[tile]);
          const isSnake = Boolean(SNAKES[tile]);

          return (
            <div
              key={tile}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-between p-0.5 relative transition-all ${
                isP1Here
                  ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-300 z-10 scale-105'
                  : isP2Here
                  ? 'bg-cyan-500 text-white border-white ring-2 ring-cyan-300 z-10 scale-105'
                  : isLadder
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : isSnake
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900/80 border-white/5 text-slate-400'
              }`}
            >
              <span className="text-[8px] opacity-70 leading-none">{tile}</span>
              {isLadder && <span className="text-[10px]">🪜</span>}
              {isSnake && <span className="text-[10px]">🐍</span>}
              {isP1Here && <span className="text-xs font-black">🤠</span>}
              {isP2Here && !isP1Here && <span className="text-xs font-black">{playerMode === 'ai' ? '🤖' : '🔵'}</span>}
            </div>
          );
        })}
      </div>

      {/* Board Controls & Status */}
      <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col items-center space-y-3">
        <p className="text-xs font-extrabold text-amber-300 text-center">{statusMsg}</p>

        {/* Current Turn Badge */}
        <div className="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40">
          Turn: {turn === 'p1' ? p1Name : p2Name}
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-gradient-to-br from-amber-300 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-2xl font-black text-slate-950 ${isRolling ? 'animate-spin' : ''}`}>
            {diceRoll ?? '🎲'}
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling || (playerMode === 'ai' && turn === 'p2')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isRolling ? 'Rolling...' : (playerMode === 'ai' && turn === 'p2' ? 'AI Turn...' : 'Roll Dice 🎲')}
          </button>
        </div>

        <div className="flex items-center justify-between w-full text-[11px] font-extrabold text-slate-300 pt-1 border-t border-white/10">
          <span className="flex items-center gap-1">{p1Name}: Tile {player1Pos}</span>
          <span className="flex items-center gap-1">{p2Name}: Tile {player2Pos}</span>
        </div>
      </div>
    </div>
  );
};
