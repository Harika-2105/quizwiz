import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Pause, Play, Volume2, VolumeX, HelpCircle, Trophy, Sparkles, Award } from 'lucide-react';
import { GameMetadata } from './gameCatalog';
import { soundFx } from '../../services/soundFx';

interface GameContainerProps {
  game: GameMetadata;
  onBackToHub: () => void;
  children: (props: {
    isPaused: boolean;
    gameOver: boolean;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    handleGameOver: (finalScore: number) => void;
    restartGame: () => void;
  }) => React.ReactNode;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  game,
  onBackToHub,
  children
}) => {
  const [score, setScore] = useState<number>(0);
  const [sessionHighScore, setSessionHighScore] = useState<number>(() => {
    const saved = sessionStorage.getItem(`game_hs_${game.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());
  const [trophyEarned, setTrophyEarned] = useState<string | null>(null);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
    soundFx.playCheer();
    if (finalScore > sessionHighScore) {
      setSessionHighScore(finalScore);
      sessionStorage.setItem(`game_hs_${game.id}`, String(finalScore));
    }

    // Assign session trophy milestone
    if (finalScore >= 500) {
      setTrophyEarned('🏆 Arcade Legend');
    } else if (finalScore >= 200) {
      setTrophyEarned('🥇 Gold Master');
    } else if (finalScore >= 100) {
      setTrophyEarned('🥈 Silver Gamer');
    } else {
      setTrophyEarned('🥉 Bronze Challenger');
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setTrophyEarned(null);
    soundFx.playClick();
  };

  return (
    <div className="min-h-[85vh] max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Top Header Controls Bar */}
      <div className="bg-slate-900/90 dark:bg-[#0E0627]/90 text-white p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Exit & Game Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onBackToHub();
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
            title="Back to Game Hub"
            id="game-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Arcade Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{game.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">{game.title}</h2>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-gradient-to-r ${game.color} text-white shadow-sm`}>
                  {game.categoryName}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 dark:text-slate-400 hidden sm:block">{game.description}</p>
            </div>
          </div>
        </div>

        {/* Right: Score Counter & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Current & High Score Badges */}
          <div className="flex items-center gap-2 bg-black/40 p-2 sm:p-2.5 rounded-2xl border border-white/10">
            <div className="px-2 text-center">
              <span className="text-[9px] uppercase font-bold text-amber-400 block tracking-wider">Score</span>
              <span className="text-base sm:text-xl font-black text-white">{score}</span>
            </div>
            <div className="w-px h-7 bg-white/10"></div>
            <div className="px-2 text-center">
              <span className="text-[9px] uppercase font-bold text-teal-400 block tracking-wider">High</span>
              <span className="text-base sm:text-xl font-black text-teal-200">{sessionHighScore}</span>
            </div>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              soundFx.playClick();
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Restart */}
          <button
            onClick={restartGame}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Restart Game"
          >
            <RefreshCw className="w-4 h-4 text-cyan-300" />
          </button>

          {/* How to Play Help */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-purple-300" />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </div>

      {/* Game Stage Arena Canvas Area */}
      <div className="relative bg-slate-900/80 dark:bg-[#0A021D] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[420px] flex flex-col items-center justify-center overflow-hidden">
        
        {/* How to Play Modal Overlay */}
        {showHelp && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4 text-white animate-in fade-in duration-200">
            <div className="p-4 rounded-full bg-purple-500/20 text-purple-300 text-4xl">
              🎮
            </div>
            <h3 className="text-xl font-black">{game.title} - Controls</h3>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed font-medium">
              {game.controlsHelp}
            </p>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-amber-300">
              💡 Tip: Games are for fun entertainment! Scores stay temporary during your session.
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              Got It! Start Playing
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4 animate-in fade-in">
            <Pause className="w-12 h-12 text-amber-400 animate-pulse" />
            <h3 className="text-2xl font-black tracking-tight">GAME PAUSED</h3>
            <p className="text-xs text-slate-300">Take a breather or resume when ready!</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
            >
              Resume Game
            </button>
          </div>
        )}

        {/* Game Over Modal Screen */}
        {gameOver && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-5 text-white animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-2xl animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-amber-400 tracking-tight">GAME OVER</h3>
              <p className="text-xs text-slate-300 font-medium">Great effort in {game.title}!</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Your Score</span>
                <span className="text-2xl font-black text-white">{score}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Session High</span>
                <span className="text-2xl font-black text-teal-300">{sessionHighScore}</span>
              </div>
            </div>

            {trophyEarned && (
              <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Unlocked Badge: {trophyEarned}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                onClick={onBackToHub}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider transition-all"
              >
                Back to Arcade Hub
              </button>
            </div>
          </div>
        )}

        {/* Render Actual Game Component */}
        {children({
          isPaused,
          gameOver,
          score,
          setScore,
          handleGameOver,
          restartGame
        })}
      </div>
    </div>
  );
};
