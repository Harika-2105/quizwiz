import React, { useState } from 'react';
import { X, Check, Sparkles, Wand2, Volume2 } from 'lucide-react';
import { AVATAR_CATALOG, AVATAR_CATEGORIES, getAvatarById, DEFAULT_AVATAR_ID } from './avatarCatalog';
import { AnimatedAvatar } from './AnimatedAvatar';
import { soundFx } from '../../services/soundFx';

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatarId?: string;
  username?: string;
  onClose: () => void;
  onSelectAvatar: (avatarId: string) => Promise<void> | void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatarId = DEFAULT_AVATAR_ID,
  username = 'player',
  onClose,
  onSelectAvatar
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentAvatarId);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [previewBounce, setPreviewBounce] = useState(false);

  if (!isOpen) return null;

  const selectedAvatar = getAvatarById(selectedId);

  const filteredAvatars = activeTab === 'all'
    ? AVATAR_CATALOG
    : AVATAR_CATALOG.filter(a => a.category === activeTab);

  const handleChoose = (id: string) => {
    soundFx.playClick();
    setSelectedId(id);
    setPreviewBounce(true);
    setTimeout(() => setPreviewBounce(false), 600);
  };

  const handleSave = async () => {
    soundFx.playCheer();
    setIsSaving(true);
    try {
      await onSelectAvatar(selectedId);
      onClose();
    } catch (err) {
      console.error('Failed to save avatar choice:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0F0529] border border-white/15 text-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                Choose Animated Avatar
              </h2>
              <p className="text-xs text-white/60 font-medium">
                Personalize your player identity across game zones and leaderboards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all"
            id="close-avatar-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Preview Spotlight Box */}
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-white/10 flex flex-col sm:flex-row items-center gap-5">
          <div className={`relative transition-transform duration-300 ${previewBounce ? 'scale-125 rotate-6' : ''}`}>
            <AnimatedAvatar
              avatarId={selectedId}
              size="2xl"
              showBadge={true}
              animate={true}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300">
              <Wand2 className="w-3 h-3" />
              <span>{selectedAvatar.categoryLabel}</span>
            </div>

            <h3 className="text-xl font-black tracking-tight text-white">
              {selectedAvatar.name}
            </h3>

            <p className="text-xs text-white/70 max-w-md italic">
              "{selectedAvatar.description}"
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-black/40 px-3 py-1 rounded-lg border border-amber-400/20">
                @{username}
              </span>
              <button
                onClick={() => {
                  soundFx.playCorrect();
                  setPreviewBounce(true);
                  setTimeout(() => setPreviewBounce(false), 600);
                }}
                className="text-[11px] font-bold text-white/60 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Reaction</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 artistic-glow-yellow"
            id="save-avatar-selection-btn"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Equip Avatar</span>
              </>
            )}
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="p-3 bg-slate-950/40 border-b border-white/10 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {AVATAR_CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(cat.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
                id={`avatar-tab-${cat.id}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Avatars Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAvatars.map(item => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleChoose(item.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-purple-900/40 border-amber-400 shadow-xl shadow-amber-500/10 scale-105 ring-2 ring-amber-400/50'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 hover:scale-102'
                }`}
                id={`avatar-card-${item.id}`}
              >
                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Animated Avatar Graphic */}
                <AnimatedAvatar
                  avatarId={item.id}
                  size="xl"
                  animate={true}
                  className="group-hover:scale-110 transition-transform"
                />

                <div>
                  <p className={`text-xs font-black tracking-tight ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-white/50 font-medium">
                    {item.categoryLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
