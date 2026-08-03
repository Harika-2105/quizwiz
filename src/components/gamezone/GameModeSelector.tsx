import React, { useState } from 'react';
import { Bot, Users, Globe, Play, ArrowLeft, Sparkles, Shield, Info, CheckCircle, Copy, Share2 } from 'lucide-react';
import { GameMetadata } from './gameCatalog';
import { soundFx } from '../../services/soundFx';

export type PlayerMode = 'ai' | 'friend_local' | 'friend_online';

interface GameModeSelectorProps {
  game: GameMetadata;
  onStartGame: (mode: PlayerMode, roomCode?: string) => void;
  onCancel: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  game,
  onStartGame,
  onCancel
}) => {
  const [selectedMode, setSelectedMode] = useState<PlayerMode>('ai');
  const [roomCode, setRoomCode] = useState<string>(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [joinRoomInput, setJoinRoomInput] = useState<string>('');
  const [onlineTab, setOnlineTab] = useState<'create' | 'join'>('create');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    soundFx.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    soundFx.playClick();
    const finalRoom = selectedMode === 'friend_online' ? (onlineTab === 'join' ? joinRoomInput.toUpperCase() : roomCode) : undefined;
    onStartGame(selectedMode, finalRoom);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onCancel();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 text-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-3xl">{game.icon}</span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">{game.title}</h2>
              <span className="text-[10px] text-purple-300 font-extrabold uppercase">Choose Match Type</span>
            </div>
          </div>

          <div className="w-8" />
        </div>

        {/* Instructions / Game Summary Box */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white">How to Play:</p>
            <p className="text-[11px] text-purple-300/90 leading-relaxed">{game.controlsHelp}</p>
          </div>
        </div>

        {/* Player Mode Selection Buttons */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-amber-300 tracking-wider block">
            1. Choose Player Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Mode 1: AI Computer */}
            <button
              onClick={() => {
                setSelectedMode('ai');
                soundFx.playClick();
              }}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 relative overflow-hidden ${
                selectedMode === 'ai'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-amber-400 shadow-xl scale-[1.02] text-white'
                  : 'bg-slate-800/80 border-white/10 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Bot className={`w-6 h-6 ${selectedMode === 'ai' ? 'text-amber-300' : 'text-purple-400'}`} />
                {selectedMode === 'ai' && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Play vs AI</p>
                <p className="text-[10px] opacity-80 mt-0.5">Solo vs Computer</p>
              </div>
            </button>

            {/* Mode 2: Play with Friend (Same Device) */}
            <button
              onClick={() => {
                setSelectedMode('friend_local');
                soundFx.playClick();
              }}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 relative overflow-hidden ${
                selectedMode === 'friend_local'
                  ? 'bg-gradient-to-br from-rose-600 to-pink-700 border-amber-400 shadow-xl scale-[1.02] text-white'
                  : 'bg-slate-800/80 border-white/10 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Users className={`w-6 h-6 ${selectedMode === 'friend_local' ? 'text-amber-300' : 'text-pink-400'}`} />
                {selectedMode === 'friend_local' && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Pass & Play</p>
                <p className="text-[10px] opacity-80 mt-0.5">2 Players Same Device</p>
              </div>
            </button>

            {/* Mode 3: Play Online with Friend */}
            <button
              onClick={() => {
                setSelectedMode('friend_online');
                soundFx.playClick();
              }}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 relative overflow-hidden ${
                selectedMode === 'friend_online'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-amber-400 shadow-xl scale-[1.02] text-white'
                  : 'bg-slate-800/80 border-white/10 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Globe className={`w-6 h-6 ${selectedMode === 'friend_online' ? 'text-amber-300' : 'text-teal-400'}`} />
                {selectedMode === 'friend_online' && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Play Online</p>
                <p className="text-[10px] opacity-80 mt-0.5">Create or Join Room</p>
              </div>
            </button>

          </div>
        </div>

        {/* Online Room Code Config Sub-Section */}
        {selectedMode === 'friend_online' && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-teal-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setOnlineTab('create')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  onlineTab === 'create' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => setOnlineTab('join')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  onlineTab === 'join' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Join Room
              </button>
            </div>

            {onlineTab === 'create' ? (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300">Share this Room Code with your friend to play together:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 py-2 px-4 rounded-xl bg-slate-950 font-mono text-center text-lg font-black text-amber-400 border border-white/20 tracking-widest">
                    {roomCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs flex items-center gap-1 border border-teal-500/40"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300">Enter Room Code provided by your friend:</p>
                <input
                  type="text"
                  placeholder="EX: X7A8B9"
                  maxLength={6}
                  value={joinRoomInput}
                  onChange={(e) => setJoinRoomInput(e.target.value.toUpperCase())}
                  className="w-full py-2 px-4 rounded-xl bg-slate-950 text-center font-mono text-lg font-black text-amber-400 border border-white/20 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            )}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleLaunch}
          disabled={selectedMode === 'friend_online' && onlineTab === 'join' && joinRoomInput.trim().length < 4}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Start {game.title}</span>
        </button>

      </div>
    </div>
  );
};
