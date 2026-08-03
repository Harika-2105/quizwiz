import React from 'react';
import { getAvatarById, DEFAULT_AVATAR_ID } from './avatarCatalog';

interface AnimatedAvatarProps {
  avatarId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBorder?: boolean;
  showBadge?: boolean;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  avatarId = DEFAULT_AVATAR_ID,
  size = 'md',
  showBorder = true,
  showBadge = false,
  animate = true,
  className = '',
  onClick
}) => {
  const avatar = getAvatarById(avatarId);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-5xl'
  }[size];

  const badgeSizeClasses = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3.5 h-3.5 bottom-0 right-0',
    lg: 'w-4 h-4 bottom-0.5 right-0.5',
    xl: 'w-6 h-6 bottom-1 right-1',
    '2xl': 'w-8 h-8 bottom-1.5 right-1.5'
  }[size];

  // Custom SVG Vector graphic with CSS keyframe animation layer for each character
  const renderAvatarGraphics = () => {
    const isSmall = size === 'xs' || size === 'sm';

    switch (avatar.id) {
      // ANIMAL
      case 'animal_cyber_cat':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 drop-shadow-md">
              {/* Ears with twitch animation */}
              <polygon points="20,40 32,15 42,32" fill="#EC4899" className={animate ? "animate-pulse" : ""} />
              <polygon points="80,40 68,15 58,32" fill="#EC4899" className={animate ? "animate-pulse" : ""} />
              <polygon points="24,38 32,20 38,32" fill="#F472B6" />
              <polygon points="76,38 68,20 62,32" fill="#F472B6" />
              {/* Head */}
              <ellipse cx="50" cy="55" rx="35" ry="30" fill="#312E81" />
              {/* Cyber LED Visor */}
              <rect x="22" y="42" width="56" height="20" rx="10" fill="#06B6D4" className={animate ? "animate-pulse" : ""} />
              <rect x="26" y="46" width="48" height="12" rx="6" fill="#18181B" />
              {/* Visor glowing eyes */}
              <circle cx="38" cy="52" r="3.5" fill="#38BDF8" className={animate ? "animate-ping" : ""} />
              <circle cx="62" cy="52" r="3.5" fill="#38BDF8" className={animate ? "animate-ping" : ""} />
              {/* Cute nose & whiskers */}
              <polygon points="50,65 47,62 53,62" fill="#F472B6" />
              <line x1="15" y1="58" x2="28" y2="60" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="66" x2="28" y2="64" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="85" y1="58" x2="72" y2="60" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="85" y1="66" x2="72" y2="64" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'animal_panda':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Panda Ears */}
              <circle cx="24" cy="24" r="14" fill="#18181B" />
              <circle cx="76" cy="24" r="14" fill="#18181B" />
              {/* Head */}
              <circle cx="50" cy="52" r="36" fill="#FFFFFF" />
              {/* Eye Patches */}
              <ellipse cx="36" cy="48" rx="10" ry="13" fill="#18181B" transform="rotate(-15 36 48)" />
              <ellipse cx="64" cy="48" rx="10" ry="13" fill="#18181B" transform="rotate(15 64 48)" />
              {/* Eyes */}
              <circle cx="36" cy="46" r="4" fill="#FFFFFF" />
              <circle cx="64" cy="46" r="4" fill="#FFFFFF" />
              <circle cx="37" cy="45" r="2" fill="#10B981" />
              <circle cx="63" cy="45" r="2" fill="#10B981" />
              {/* Snout */}
              <ellipse cx="50" cy="58" rx="12" ry="8" fill="#F4F4F5" />
              <ellipse cx="50" cy="55" rx="5" ry="3" fill="#18181B" />
              {/* Mouth & Bamboo */}
              <path d="M45 61 Q50 66 55 61" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <rect x="58" y="58" width="22" height="5" rx="2.5" fill="#10B981" className={animate ? "animate-bounce" : ""} />
            </svg>
          </div>
        );

      case 'animal_dog':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Shiba Ears */}
              <polygon points="15,45 30,12 45,35" fill="#EAB308" />
              <polygon points="85,45 70,12 55,35" fill="#EAB308" />
              <polygon points="20,42 30,20 40,35" fill="#FEF08A" />
              <polygon points="80,42 70,20 60,35" fill="#FEF08A" />
              {/* Head */}
              <circle cx="50" cy="55" r="35" fill="#F59E0B" />
              <ellipse cx="50" cy="62" rx="22" ry="18" fill="#FEF08A" />
              {/* Cool Sunglasses */}
              <polygon points="20,42 48,42 45,58 25,58" fill="#18181B" />
              <polygon points="52,42 80,42 75,58 55,58" fill="#18181B" />
              <line x1="48" y1="46" x2="52" y2="46" stroke="#18181B" strokeWidth="4" />
              <line x1="24" y1="46" x2="40" y2="52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="56" y1="46" x2="72" y2="52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              {/* Nose & Tongue */}
              <ellipse cx="50" cy="62" rx="4" ry="3" fill="#18181B" />
              <path d="M47 68 Q50 78 53 68" fill="#F43F5E" className={animate ? "animate-bounce" : ""} />
            </svg>
          </div>
        );

      case 'animal_fox':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <polygon points="12,50 25,10 45,40" fill="#EA580C" />
              <polygon points="88,50 75,10 55,40" fill="#EA580C" />
              <polygon points="18,48 25,20 38,40" fill="#FFF" />
              <polygon points="82,48 75,20 62,40" fill="#FFF" />
              <polygon points="50,90 15,45 85,45" fill="#F97316" />
              <polygon points="50,90 32,50 68,50" fill="#FFFFFF" />
              <circle cx="36" cy="48" r="4.5" fill="#FEF08A" />
              <circle cx="64" cy="48" r="4.5" fill="#FEF08A" />
              <circle cx="36" cy="48" r="2" fill="#18181B" />
              <circle cx="64" cy="48" r="2" fill="#18181B" />
              <circle cx="50" cy="85" r="5" fill="#18181B" />
            </svg>
          </div>
        );

      // BOY
      case 'boy_cyber':
      case 'boy_gamer':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Headset arc */}
              <path d="M15 50 A35 35 0 0 1 85 50" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" className={animate ? "animate-pulse" : ""} />
              {/* Earcups */}
              <rect x="10" y="42" width="12" height="24" rx="6" fill="#06B6D4" />
              <rect x="78" y="42" width="12" height="24" rx="6" fill="#06B6D4" />
              {/* Hair */}
              <path d="M25 45 Q50 15 75 45 Q50 30 25 45" fill="#1E1B4B" />
              {/* Face */}
              <ellipse cx="50" cy="55" rx="28" ry="26" fill="#FDE047" />
              {/* Eyes */}
              <circle cx="38" cy="52" r="4" fill="#1E1B4B" />
              <circle cx="62" cy="52" r="4" fill="#1E1B4B" />
              <circle cx="40" cy="50" r="1.5" fill="#FFF" />
              <circle cx="64" cy="50" r="1.5" fill="#FFF" />
              {/* Cool Smile */}
              <path d="M40 64 Q50 72 60 64" stroke="#1E1B4B" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'boy_hero':
      case 'boy_ninja':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <circle cx="50" cy="50" r="38" fill="#1E293B" />
              <rect x="20" y="38" width="60" height="20" rx="4" fill="#EF4444" />
              <ellipse cx="38" cy="48" rx="6" ry="4" fill="#FEF08A" className={animate ? "animate-ping" : ""} />
              <ellipse cx="62" cy="48" rx="6" ry="4" fill="#FEF08A" className={animate ? "animate-ping" : ""} />
              <circle cx="38" cy="48" r="2.5" fill="#1E293B" />
              <circle cx="62" cy="48" r="2.5" fill="#1E293B" />
              <path d="M20 48 Q10 40 5 45" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );

      // GIRL
      case 'girl_anime':
      case 'girl_gamer':
      case 'girl_wonder':
      case 'girl_cyber':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Bunny Ears or Ribbons */}
              <path d="M25 35 Q15 5 28 25" fill="#F43F5E" stroke="#FFF" strokeWidth="2" className={animate ? "animate-bounce" : ""} />
              <path d="M75 35 Q85 5 72 25" fill="#F43F5E" stroke="#FFF" strokeWidth="2" className={animate ? "animate-bounce" : ""} />
              {/* Twin tails */}
              <circle cx="18" cy="50" r="14" fill="#EC4899" />
              <circle cx="82" cy="50" r="14" fill="#EC4899" />
              {/* Face */}
              <ellipse cx="50" cy="52" rx="26" ry="24" fill="#FEF08A" />
              {/* Hair Bangs */}
              <path d="M24 45 Q50 25 76 45 Q50 38 24 45" fill="#EC4899" />
              {/* Big Anime Eyes */}
              <ellipse cx="38" cy="50" rx="5" ry="7" fill="#8B5CF6" />
              <ellipse cx="62" cy="50" rx="5" ry="7" fill="#8B5CF6" />
              <circle cx="36" cy="48" r="2" fill="#FFF" />
              <circle cx="60" cy="48" r="2" fill="#FFF" />
              {/* Blush & Smile */}
              <ellipse cx="30" cy="58" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
              <ellipse cx="70" cy="58" rx="4" ry="2" fill="#F43F5E" opacity="0.6" />
              <path d="M44 60 Q50 66 56 60" stroke="#8B5CF6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        );

      // CARTOON
      case 'cartoon_wink':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <circle cx="50" cy="50" r="42" fill="#FACC15" />
              {/* Left Eye open */}
              <circle cx="35" cy="42" r="6" fill="#1E1B4B" />
              <circle cx="37" cy="40" r="2" fill="#FFF" />
              {/* Right Eye Winking */}
              <path d="M58 44 Q65 38 72 44" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" className={animate ? "animate-pulse" : ""} />
              {/* Big Smile */}
              <path d="M30 55 Q50 82 70 55 Z" fill="#EF4444" />
              <path d="M38 56 Q50 64 62 56" fill="#FFF" />
              {/* Tongue */}
              <path d="M42 68 Q50 80 58 68" fill="#F472B6" />
            </svg>
          </div>
        );

      case 'cartoon_scholar':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Wizard Hat */}
              <polygon points="50,5 20,40 80,40" fill="#6B21A8" />
              <ellipse cx="50" cy="40" rx="36" ry="8" fill="#581C87" />
              <circle cx="50" cy="18" r="4" fill="#FACC15" className={animate ? "animate-ping" : ""} />
              {/* Face */}
              <ellipse cx="50" cy="62" rx="28" ry="24" fill="#FDE047" />
              {/* Glasses */}
              <circle cx="38" cy="58" r="9" fill="none" stroke="#1E1B4B" strokeWidth="3" />
              <circle cx="62" cy="58" r="9" fill="none" stroke="#1E1B4B" strokeWidth="3" />
              <line x1="47" y1="58" x2="53" y2="58" stroke="#1E1B4B" strokeWidth="3" />
              <circle cx="38" cy="58" r="3" fill="#1E1B4B" />
              <circle cx="62" cy="58" r="3" fill="#1E1B4B" />
              {/* Mustache */}
              <path d="M36 72 Q50 66 64 72 Q50 78 36 72" fill="#FFF" />
            </svg>
          </div>
        );

      case 'cartoon_flame':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <path d="M50 8 Q65 30 75 45 Q88 65 75 80 Q62 95 50 95 Q38 95 25 80 Q12 65 25 45 Q35 30 50 8" fill="#EF4444" className={animate ? "animate-pulse" : ""} />
              <path d="M50 25 Q60 40 68 52 Q76 68 68 80 Q58 90 50 90 Q42 90 32 80 Q24 68 32 52 Q40 40 50 25" fill="#F97316" />
              <path d="M50 45 Q56 55 60 64 Q64 74 58 82 Q54 88 50 88 Q46 88 42 82 Q36 74 40 64 Q44 55 50 45" fill="#FACC15" />
              <circle cx="42" cy="62" r="3.5" fill="#1E1B4B" />
              <circle cx="58" cy="62" r="3.5" fill="#1E1B4B" />
            </svg>
          </div>
        );

      // GAMING
      case 'gaming_ghost':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <path d="M20 50 A30 30 0 0 1 80 50 L80 80 L70 72 L60 80 L50 72 L40 80 L30 72 L20 80 Z" fill="#22D3EE" className={animate ? "animate-bounce" : ""} />
              <ellipse cx="38" cy="45" rx="7" ry="9" fill="#FFF" />
              <ellipse cx="62" cy="45" rx="7" ry="9" fill="#FFF" />
              <circle cx="41" cy="45" r="4" fill="#1E1B4B" />
              <circle cx="65" cy="45" r="4" fill="#1E1B4B" />
            </svg>
          </div>
        );

      case 'gaming_dragon':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Dragon Wings */}
              <polygon points="15,40 5,15 35,30" fill="#E11D48" className={animate ? "animate-pulse" : ""} />
              <polygon points="85,40 95,15 65,30" fill="#E11D48" className={animate ? "animate-pulse" : ""} />
              {/* Head */}
              <polygon points="50,15 25,50 50,85 75,50" fill="#9F1239" />
              <polygon points="50,25 35,50 50,75 65,50" fill="#F43F5E" />
              {/* Eyes */}
              <polygon points="38,42 45,45 38,48" fill="#FACC15" />
              <polygon points="62,42 55,45 62,48" fill="#FACC15" />
              {/* Snout smoke */}
              <circle cx="50" cy="72" r="3" fill="#F97316" className={animate ? "animate-ping" : ""} />
            </svg>
          </div>
        );

      case 'gaming_helmet':
      case 'gaming_controller':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              <rect x="20" y="25" width="60" height="50" rx="16" fill="#3B82F6" />
              <rect x="26" y="32" width="48" height="20" rx="6" fill="#1E1B4B" />
              <line x1="32" y1="42" x2="68" y2="42" stroke="#38BDF8" strokeWidth="4" className={animate ? "animate-pulse" : ""} />
              <circle cx="36" cy="62" r="4" fill="#EF4444" />
              <circle cx="64" cy="62" r="4" fill="#FACC15" />
              <rect x="46" y="58" width="8" height="8" rx="2" fill="#22C55E" />
            </svg>
          </div>
        );

      // KIDS
      case 'kids_unicorn':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Horn */}
              <polygon points="50,5 44,32 56,32" fill="#FACC15" className={animate ? "animate-pulse" : ""} />
              {/* Rainbow Mane */}
              <circle cx="28" cy="38" r="12" fill="#F43F5E" />
              <circle cx="22" cy="52" r="12" fill="#F59E0B" />
              <circle cx="24" cy="66" r="12" fill="#10B981" />
              {/* Head */}
              <ellipse cx="56" cy="52" rx="26" ry="24" fill="#FFF" />
              <ellipse cx="66" cy="58" rx="14" ry="12" fill="#F472B6" />
              {/* Eye */}
              <ellipse cx="54" cy="48" rx="3.5" ry="5" fill="#1E1B4B" />
              <circle cx="53" cy="46" r="1.5" fill="#FFF" />
            </svg>
          </div>
        );

      case 'kids_dino':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Party Hat */}
              <polygon points="40,5 28,30 52,30" fill="#EC4899" />
              <circle cx="40" cy="5" r="3" fill="#FACC15" className={animate ? "animate-ping" : ""} />
              {/* Dino Head */}
              <circle cx="50" cy="55" r="34" fill="#84CC16" />
              <circle cx="38" cy="48" r="4" fill="#1E1B4B" />
              <circle cx="39" cy="47" r="1.5" fill="#FFF" />
              {/* Cute Snout */}
              <ellipse cx="64" cy="60" rx="16" ry="12" fill="#A3E635" />
              <circle cx="68" cy="56" r="2" fill="#1E1B4B" />
              <path d="M58 66 Q64 72 70 66" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );

      case 'kids_bear':
      case 'kids_robot':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
              {/* Antenna */}
              <line x1="50" y1="20" x2="50" y2="5" stroke="#C084FC" strokeWidth="4" />
              <circle cx="50" cy="5" r="5" fill="#F43F5E" className={animate ? "animate-ping" : ""} />
              {/* Bot Head */}
              <rect x="20" y="20" width="60" height="55" rx="14" fill="#E0E7FF" stroke="#818CF8" strokeWidth="3" />
              {/* Screen */}
              <rect x="28" y="28" width="44" height="26" rx="8" fill="#1E1B4B" />
              <circle cx="38" cy="41" r="4" fill="#22D3EE" className={animate ? "animate-pulse" : ""} />
              <circle cx="62" cy="41" r="4" fill="#22D3EE" className={animate ? "animate-pulse" : ""} />
              {/* Heart Display */}
              <path d="M50 68 L46 64 A3 3 0 0 1 50 60 A3 3 0 0 1 54 64 Z" fill="#F43F5E" />
            </svg>
          </div>
        );

      default:
        return (
          <div className={`w-full h-full flex items-center justify-center font-black ${isSmall ? 'text-sm' : 'text-3xl'}`}>
            {avatar.emojiFallback}
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
    >
      {/* Outer Glowing Border Ring */}
      <div
        className={`relative ${sizeClasses} rounded-full bg-gradient-to-tr ${avatar.bgGradient} ${
          showBorder ? 'p-0.5 sm:p-1 shadow-lg border border-white/20' : ''
        } overflow-hidden flex items-center justify-center`}
      >
        {/* Animated Background Shimmer */}
        {animate && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse pointer-events-none" />
        )}

        {/* Core Graphics */}
        <div className="w-full h-full rounded-full bg-slate-950/20 backdrop-blur-xs flex items-center justify-center overflow-hidden">
          {renderAvatarGraphics()}
        </div>
      </div>

      {/* Online/Active Badge */}
      {showBadge && (
        <span
          className={`absolute ${badgeSizeClasses} rounded-full bg-emerald-400 border-2 border-slate-950 shadow-md animate-pulse`}
          title="Online"
        />
      )}
    </div>
  );
};
