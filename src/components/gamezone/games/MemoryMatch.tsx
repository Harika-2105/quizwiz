import React, { useState, useEffect } from 'react';
import { soundFx } from '../../../services/soundFx';

interface MemoryMatchProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
}

const EMOJI_PAIRS = ['🚀', '🌟', '💎', '🎨', '🦁', '🍕', '🎮', '🦄'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({
  isPaused,
  gameOver,
  score,
  setScore,
  handleGameOver
}) => {
  const [cards, setCards] = useState<Card[]>(() => {
    const deck = [...EMOJI_PAIRS, ...EMOJI_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    return deck;
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const handleCardClick = (cardId: number) => {
    if (isPaused || gameOver) return;
    if (flippedCards.length >= 2) return;

    const target = cards.find((c) => c.id === cardId);
    if (!target || target.isFlipped || target.isMatched) return;

    soundFx.playClick();

    // Flip card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    const nextFlipped = [...flippedCards, cardId];
    setFlippedCards(nextFlipped);

    // Check Match when 2 flipped
    if (nextFlipped.length === 2) {
      const card1 = cards.find((c) => c.id === nextFlipped[0]);
      const card2 = cards.find((c) => c.id === nextFlipped[1]);

      if (card1 && card2 && card1.emoji === card2.emoji) {
        soundFx.playCorrect();
        setScore((s) => s + 50);

        setCards((prev) =>
          prev.map((c) =>
            c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
          )
        );
        setFlippedCards([]);

        // Check if all matched
        setTimeout(() => {
          setCards((curr) => {
            if (curr.every((c) => c.isMatched || c.id === card1.id || c.id === card2.id)) {
              soundFx.playCheer();
              handleGameOver(score + 50);
            }
            return curr;
          });
        }, 300);

      } else {
        soundFx.playIncorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === nextFlipped[0] || c.id === nextFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
      <div className="grid grid-cols-4 gap-3 w-full aspect-square bg-slate-950 p-4 border-4 border-purple-500/50 rounded-3xl shadow-2xl">
        {cards.map((card) => {
          const showEmoji = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`rounded-2xl flex items-center justify-center text-2xl font-black transition-all duration-300 transform active:scale-90 ${
                card.isMatched
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white'
                  : showEmoji
                  ? 'bg-purple-600 border-2 border-purple-300 text-white shadow-xl scale-105'
                  : 'bg-slate-900 border border-white/10 text-transparent hover:bg-slate-800'
              }`}
            >
              {showEmoji ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
