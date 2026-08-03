import React, { useState } from 'react';
import { Gamepad2, Search, Trophy, Sparkles, Star, Flame, Award, Users, Filter, Play, ArrowLeft, BarChart2 } from 'lucide-react';
import { GAME_CATALOG, GameCategory, GameMetadata } from './gameCatalog';
import { GameContainer } from './GameContainer';
import { GameModeSelector, PlayerMode } from './GameModeSelector';
import { soundFx } from '../../services/soundFx';
import { getGameStats } from '../../services/gameStats';

// Game Component Imports
import { SnakesLadders } from './games/SnakesLadders';
import { ChessMini } from './games/ChessMini';
import { ArrowShooting } from './games/ArrowShooting';
import { BalloonPop } from './games/BalloonPop';
import { BubbleShooter } from './games/BubbleShooter';
import { FishCatch } from './games/FishCatch';
import { TapReaction } from './games/TapReaction';
import { MemoryMatch } from './games/MemoryMatch';
import { Puzzle2048 } from './games/Puzzle2048';
import { NumberPattern } from './games/NumberPattern';
import { CookingGame } from './games/CookingGame';
import { ObjectSorting } from './games/ObjectSorting';
import { ObjectCatch } from './games/ObjectCatch';
import { ColorMatch } from './games/ColorMatch';
import { ShapeSorter } from './games/ShapeSorter';

interface GameZoneHubProps {
  onBackToSubjects?: () => void;
}

export const GameZoneHub: React.FC<GameZoneHubProps> = ({ onBackToSubjects }) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);
  const [pendingModeGame, setPendingModeGame] = useState<GameMetadata | null>(null);
  const [activePlayerMode, setActivePlayerMode] = useState<PlayerMode>('ai');
  const [activeRoomCode, setActiveRoomCode] = useState<string | undefined>(undefined);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  const gameStats = getGameStats();

  // Filter games based on search and category
  const filteredGames = GAME_CATALOG.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ id: GameCategory; name: string; icon: string }> = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'classic', name: 'Classic', icon: '🎲' },
    { id: 'action', name: 'Action', icon: '🏎️' },
    { id: 'casual', name: 'Casual & Fun', icon: '🎈' },
    { id: 'brain', name: 'Brain & Logic', icon: '🧠' },
    { id: 'simulation', name: 'Simulation', icon: '🍔' },
    { id: 'kids', name: 'Kids Arcade', icon: '⭐' }
  ];

  const handleGameLaunchClick = (game: GameMetadata) => {
    soundFx.playClick();
    if (game.isMultiplayer || ['snakes_ladders', 'chess', 'memory_match'].includes(game.id)) {
      setPendingModeGame(game);
    } else {
      setActivePlayerMode('ai');
      setActiveRoomCode(undefined);
      setActiveGame(game);
    }
  };

  const handleStartWithMode = (mode: PlayerMode, roomCode?: string) => {
    if (!pendingModeGame) return;
    setActivePlayerMode(mode);
    setActiveRoomCode(roomCode);
    setActiveGame(pendingModeGame);
    setPendingModeGame(null);
  };

  // Helper to render active game component
  const renderGameComponent = (gameProps: any) => {
    if (!activeGame) return null;
    const extraProps = {
      ...gameProps,
      playerMode: activePlayerMode,
      roomCode: activeRoomCode
    };

    switch (activeGame.id) {
      case 'snakes_ladders': return <SnakesLadders {...extraProps} />;
      case 'chess': return <ChessMini {...extraProps} />;
      case 'arrow_shooting': return <ArrowShooting {...extraProps} />;
      case 'balloon_pop': return <BalloonPop {...extraProps} />;
      case 'bubble_shooter': return <BubbleShooter {...extraProps} />;
      case 'fish_catch': return <FishCatch {...extraProps} />;
      case 'tap_reaction': return <TapReaction {...extraProps} />;
      case 'memory_match': return <MemoryMatch {...extraProps} />;
      case 'puzzle_2048': return <Puzzle2048 {...extraProps} />;
      case 'number_pattern': return <NumberPattern {...extraProps} />;
      case 'cooking_game': return <CookingGame {...extraProps} />;
      case 'object_sorting': return <ObjectSorting {...extraProps} />;
      case 'object_catch': return <ObjectCatch {...extraProps} />;
      case 'color_match': return <ColorMatch {...extraProps} />;
      case 'shape_sorter': return <ShapeSorter {...extraProps} />;
      default: return null;
    }
  };

  if (activeGame) {
    return (
      <GameContainer game={activeGame} onBackToHub={() => setActiveGame(null)}>
        {(gameProps) => renderGameComponent(gameProps)}
      </GameContainer>
    );
  }

  const lastPlayedGame = GAME_CATALOG.find(g => g.id === gameStats.lastPlayedGameId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8 animate-in fade-in duration-300">
      
      {/* Mode Selection Modal */}
      {pendingModeGame && (
        <GameModeSelector
          game={pendingModeGame}
          onStartGame={handleStartWithMode}
          onCancel={() => setPendingModeGame(null)}
        />
      )}

      {/* Hero Arcade Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/30 shadow-2xl overflow-hidden text-white">
        <div className="absolute -right-10 -bottom-10 opacity-20 text-[180px] pointer-events-none select-none">
          🎮
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {onBackToSubjects && (
              <button
                onClick={onBackToSubjects}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>QuizWiz Home</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-slate-950" />
              100% Fun & Unrestricted Game Zone
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Arcade Game Zone</span>
            <span className="text-3xl sm:text-4xl animate-bounce">🕹️</span>
          </h1>

          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
            Choose your match mode! Play vs AI Computer, Pass & Play with a Friend on the same device, or create/join an online room code!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-extrabold">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>21 Mini-Games Included</span>
            </div>

            <button
              onClick={() => setShowProgressModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              <BarChart2 className="w-4 h-4 text-slate-950" />
              <span>👉 Game Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-[#0E0627] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-black tracking-tight">Game Progress & High Scores</h3>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Last Played Game Section */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">Last Played Game</p>
              {lastPlayedGame ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{lastPlayedGame.icon}</span>
                    <div>
                      <p className="text-sm font-black text-white">{lastPlayedGame.title}</p>
                      <p className="text-[10px] text-slate-400">Category: {lastPlayedGame.categoryName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProgressModal(false);
                      handleGameLaunchClick(lastPlayedGame);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No games played yet in this session.</p>
              )}
            </div>

            {/* High Scores Section */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-amber-300">High Scores</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(gameStats.highScores).length > 0 ? (
                  Object.entries(gameStats.highScores).map(([gid, score]) => {
                    const g = GAME_CATALOG.find(x => x.id === gid);
                    return (
                      <div key={gid} className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                        <span className="font-bold text-slate-200 truncate">{g ? g.title : gid}</span>
                        <span className="font-mono font-black text-amber-400">{score} pts</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 col-span-2">Play arcade games to set new high scores!</p>
                )}
              </div>
            </div>

            {/* Board Games Win / Loss Record Section */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-teal-300">Board Game Records (Wins / Losses)</p>
              <div className="space-y-2">
                {Object.entries(gameStats.winLossRecords).length > 0 ? (
                  Object.entries(gameStats.winLossRecords).map(([gid, rec]) => {
                    const g = GAME_CATALOG.find(x => x.id === gid);
                    return (
                      <div key={gid} className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{g ? g.title : gid}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-emerald-400 font-black">{rec.wins} W</span>
                          <span className="text-rose-400 font-black">{rec.losses} L</span>
                          <span className="text-slate-400">{rec.draws} D</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">Play multiplayer or AI board games to track wins & losses!</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowProgressModal(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider"
            >
              Close Progress
            </button>

          </div>
        </div>
      )}

      {/* Search Bar & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mini-games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundFx.playClick();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mini-Games Grid Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group relative bg-white dark:bg-[#0E0627] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Icon & Category */}
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} shadow-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-wider">
                  {game.categoryName}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{game.title}</span>
                  {game.isMultiplayer && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-400/30">
                      2P / AI
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {game.rating}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  {(game.playsCount / 1000).toFixed(1)}k
                </span>
              </div>

              <button
                onClick={() => handleGameLaunchClick(game)}
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${game.color} text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5`}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
