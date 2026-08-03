import React, { useState, useEffect, useCallback } from 'react';
import { soundFx } from '../../../services/soundFx';
import { PlayerMode } from '../GameModeSelector';
import { Bot, Users, ShieldAlert, Trophy, RotateCcw } from 'lucide-react';
import { recordGameWinLoss, saveGameScore } from '../../../services/gameStats';

interface ChessMiniProps {
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleGameOver: (score: number) => void;
  restartGame: () => void;
  playerMode?: PlayerMode;
  roomCode?: string;
}

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

type BoardState = (ChessPiece | null)[][];

const INITIAL_BOARD = (): BoardState => [
  [
    { type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' },
    { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }
  ],
  Array(8).fill(null).map(() => ({ type: 'p' as PieceType, color: 'b' as PieceColor })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'p' as PieceType, color: 'w' as PieceColor })),
  [
    { type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' },
    { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }
  ]
];

const PIECE_SYMBOLS: Record<string, string> = {
  'w_k': '♔', 'w_q': '♕', 'w_r': '♖', 'w_b': '♗', 'w_n': '♘', 'w_p': '♙',
  'b_k': '♚', 'b_q': '♛', 'b_r': '♜', 'b_b': '♝', 'b_n': '♞', 'b_p': '♟'
};

export const ChessMini: React.FC<ChessMiniProps> = ({
  isPaused,
  gameOver,
  setScore,
  handleGameOver,
  restartGame,
  playerMode = 'ai',
  roomCode
}) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<Array<[number, number]>>([]);
  const [inCheck, setInCheck] = useState<boolean>(false);
  const [isCheckmate, setIsCheckmate] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Select White piece to play.');
  const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

  const p1Name = playerMode === 'ai' ? '🤠 You (White)' : '⚪ Player 1 (White)';
  const p2Name = playerMode === 'ai' ? '🤖 AI (Black)' : '⚫ Player 2 (Black)';

  // Helper: Is row/col inside board limits?
  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Calculate pseudolegal moves for a piece at (r, c) on a given board
  const getPseudoMoves = useCallback((b: BoardState, r: number, c: number): Array<[number, number]> => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: Array<[number, number]> = [];
    const { type, color } = piece;
    const enemyColor: PieceColor = color === 'w' ? 'b' : 'w';

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;

      // Single forward step
      if (inBounds(r + dir, c) && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        // Double step on first move
        if (r === startRow && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        if (inBounds(r + dir, c + dc)) {
          const target = b[r + dir][c + dc];
          if (target && target.color === enemyColor) {
            moves.push([r + dir, c + dc]);
          }
        }
      }
    } else if (type === 'n') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
          const target = b[nr][nc];
          if (!target || target.color === enemyColor) {
            moves.push([nr, nc]);
          }
        }
      }
    } else if (type === 'k') {
      const kingOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      for (const [dr, dc] of kingOffsets) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
          const target = b[nr][nc];
          if (!target || target.color === enemyColor) {
            moves.push([nr, nc]);
          }
        }
      }
    } else {
      // Ray pieces: Rook ('r'), Bishop ('b'), Queen ('q')
      const directions: Array<[number, number]> = [];
      if (type === 'r' || type === 'q') {
        directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }
      if (type === 'b' || type === 'q') {
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }

      for (const [dr, dc] of directions) {
        let nr = r + dr, nc = c + dc;
        while (inBounds(nr, nc)) {
          const target = b[nr][nc];
          if (!target) {
            moves.push([nr, nc]);
          } else {
            if (target.color === enemyColor) {
              moves.push([nr, nc]);
            }
            break; // path blocked by piece
          }
          nr += dr;
          nc += dc;
        }
      }
    }

    return moves;
  }, []);

  // Find King position for color
  const findKing = useCallback((b: BoardState, color: PieceColor): [number, number] | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.type === 'k' && p.color === color) {
          return [r, c];
        }
      }
    }
    return null;
  }, []);

  // Check if King of color is currently under attack
  const isKingAttacked = useCallback((b: BoardState, kingColor: PieceColor): boolean => {
    const kingPos = findKing(b, kingColor);
    if (!kingPos) return false;
    const enemyColor: PieceColor = kingColor === 'w' ? 'b' : 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.color === enemyColor) {
          const moves = getPseudoMoves(b, r, c);
          if (moves.some(([mr, mc]) => mr === kingPos[0] && mc === kingPos[1])) {
            return true;
          }
        }
      }
    }
    return false;
  }, [findKing, getPseudoMoves]);

  // Strict Legal Moves (filtering out moves that leave own King in check)
  const getLegalMoves = useCallback((b: BoardState, r: number, c: number): Array<[number, number]> => {
    const piece = b[r][c];
    if (!piece) return [];
    const pseudo = getPseudoMoves(b, r, c);
    const legal: Array<[number, number]> = [];

    for (const [tr, tc] of pseudo) {
      // Simulate move
      const nextBoard = b.map(row => [...row]);
      nextBoard[tr][tc] = { ...piece, hasMoved: true };
      nextBoard[r][c] = null;

      if (!isKingAttacked(nextBoard, piece.color)) {
        legal.push([tr, tc]);
      }
    }

    return legal;
  }, [getPseudoMoves, isKingAttacked]);

  // Check if current side has any legal moves available
  const hasAnyLegalMoves = useCallback((b: BoardState, side: PieceColor): boolean => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.color === side) {
          const moves = getLegalMoves(b, r, c);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  }, [getLegalMoves]);

  // Handle Square Click
  const handleSquareClick = (r: number, c: number) => {
    if (isPaused || gameOver || isCheckmate) return;
    if (playerMode === 'ai' && turn === 'b') return; // AI turn

    const piece = board[r][c];

    // If a piece is already selected
    if (selectedSquare) {
      const [sr, sc] = selectedSquare;

      // If clicking same square or another piece of same color
      if (piece && piece.color === turn) {
        setSelectedSquare([r, c]);
        setValidMoves(getLegalMoves(board, r, c));
        soundFx.playClick();
        return;
      }

      // Check if (r, c) is a valid legal move
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
      if (isValid) {
        makeMove(sr, sc, r, c);
      } else {
        // Deselect or play error click
        setSelectedSquare(null);
        setValidMoves([]);
      }
      return;
    }

    // Selecting a piece for first time
    if (piece && piece.color === turn) {
      setSelectedSquare([r, c]);
      const moves = getLegalMoves(board, r, c);
      setValidMoves(moves);
      soundFx.playClick();
    }
  };

  // Make Move Execution
  const makeMove = (fromR: number, fromC: number, toR: number, toC: number) => {
    const movingPiece = board[fromR][fromC];
    if (!movingPiece) return;

    const targetPiece = board[toR][toC];
    const newBoard = board.map(row => [...row]);

    // Handle Pawn Promotion (Auto-promote to Queen for simplicity)
    let finalPiece = { ...movingPiece, hasMoved: true };
    if (movingPiece.type === 'p' && (toR === 0 || toR === 7)) {
      finalPiece.type = 'q';
    }

    newBoard[toR][toC] = finalPiece;
    newBoard[fromR][fromC] = null;

    // Capture sound & list updates
    if (targetPiece) {
      soundFx.playPop();
      if (targetPiece.color === 'w') {
        setCapturedWhite(prev => [...prev, targetPiece.type]);
      } else {
        setCapturedBlack(prev => [...prev, targetPiece.type]);
      }
    } else {
      soundFx.playClick();
    }

    setBoard(newBoard);
    setSelectedSquare(null);
    setValidMoves([]);

    const nextTurn: PieceColor = turn === 'w' ? 'b' : 'w';
    setTurn(nextTurn);

    // Check check & checkmate for next turn
    const checkState = isKingAttacked(newBoard, nextTurn);
    setInCheck(checkState);

    const hasMoves = hasAnyLegalMoves(newBoard, nextTurn);

    if (!hasMoves) {
      if (checkState) {
        // Checkmate!
        setIsCheckmate(true);
        soundFx.playCheer();
        const winner = turn === 'w' ? p1Name : p2Name;
        setStatusMsg(`CHECKMATE! ${winner} Wins! 🎉`);
        const p1Won = turn === 'w';
        saveGameScore('chess', p1Won ? 500 : 50);
        recordGameWinLoss('chess', p1Won ? 'win' : 'loss');
        handleGameOver(p1Won ? 500 : 50);
      } else {
        // Stalemate
        setStatusMsg(`STALEMATE! Draw game.`);
        recordGameWinLoss('chess', 'draw');
      }
    } else {
      if (checkState) {
        soundFx.playIncorrect();
        setStatusMsg(`CHECK! ${nextTurn === 'w' ? p1Name : p2Name} King is under attack!`);
      } else {
        setStatusMsg(`Turn: ${nextTurn === 'w' ? p1Name : p2Name}`);
      }
    }
  };

  // AI Automatic Move Execution
  useEffect(() => {
    if (playerMode === 'ai' && turn === 'b' && !gameOver && !isCheckmate && !isPaused) {
      const aiTimer = setTimeout(() => {
        // Collect all legal moves for AI (Black)
        const allLegalMoves: Array<{ from: [number, number]; to: [number, number]; priority: number }> = [];

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c]?.color === 'b') {
              const moves = getLegalMoves(board, r, c);
              for (const [tr, tc] of moves) {
                const target = board[tr][tc];
                let priority = 1;
                // Prioritize capturing higher value pieces
                if (target) {
                  const valMap: Record<PieceType, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
                  priority += valMap[target.type];
                }
                allLegalMoves.push({ from: [r, c], to: [tr, tc], priority });
              }
            }
          }
        }

        if (allLegalMoves.length > 0) {
          // Sort by priority descending and pick top option
          allLegalMoves.sort((a, b) => b.priority - a.priority);
          const topMoves = allLegalMoves.filter(m => m.priority === allLegalMoves[0].priority);
          const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];

          makeMove(chosen.from[0], chosen.from[1], chosen.to[0], chosen.to[1]);
        }
      }, 900);

      return () => clearTimeout(aiTimer);
    }
  }, [turn, playerMode, board, gameOver, isCheckmate, isPaused, getLegalMoves]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
      
      {/* Mode Header */}
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

      {/* Captured Pieces Panel */}
      <div className="flex items-center justify-between w-full text-xs bg-slate-900/90 p-2.5 rounded-2xl border border-white/10 text-slate-300">
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-400">Captured White:</span>
          <span className="text-amber-300">{capturedWhite.map(t => PIECE_SYMBOLS[`w_${t}`]).join(' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-400">Captured Black:</span>
          <span className="text-cyan-300">{capturedBlack.map(t => PIECE_SYMBOLS[`b_${t}`]).join(' ')}</span>
        </div>
      </div>

      {/* 8x8 Chessboard */}
      <div className="w-full aspect-square bg-slate-950 border-4 border-amber-400/50 rounded-3xl p-2 shadow-2xl grid grid-cols-8 grid-rows-8 gap-0.5 relative">
        {board.map((row, r) =>
          row.map((square, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
            const isValidDestination = validMoves.some(([vr, vc]) => vr === r && vc === c);
            const isKingInCheck = square?.type === 'k' && square?.color === turn && inCheck;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl font-black rounded-lg transition-all relative ${
                  isKingInCheck
                    ? 'bg-rose-600 ring-4 ring-rose-400 animate-pulse text-white z-20'
                    : isSelected
                    ? 'bg-amber-400 ring-4 ring-amber-300 scale-105 z-10 text-slate-950'
                    : isDark
                    ? 'bg-amber-950/80 text-amber-100 border border-amber-900/30 hover:bg-amber-900/80'
                    : 'bg-amber-100 text-slate-950 border border-amber-200 hover:bg-amber-200'
                }`}
              >
                {/* Piece Symbol */}
                {square ? PIECE_SYMBOLS[`${square.color}_${square.type}`] : ''}

                {/* Target Highlight Indicator */}
                {isValidDestination && (
                  <div className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                    square ? 'bg-rose-500/50 ring-2 ring-rose-400' : 'bg-emerald-500/40'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg animate-ping" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Status Msg Footer */}
      <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 text-center space-y-1">
        <p className={`text-xs font-black ${inCheck || isCheckmate ? 'text-rose-400 animate-bounce' : 'text-amber-300'}`}>
          {statusMsg}
        </p>
        <p className="text-[10px] text-slate-400">
          Tap a piece to see strictly legal moves highlighted in green dots.
        </p>
      </div>

    </div>
  );
};
