export interface GameStatsData {
  highScores: Record<string, number>;
  winLossRecords: Record<string, { wins: number; losses: number; draws: number }>;
  lastPlayedGameId?: string;
  lastPlayedTimestamp?: number;
}

const GAME_STATS_STORAGE_KEY = 'quizwiz_game_progress_v1';

export const getGameStats = (): GameStatsData => {
  try {
    const raw = localStorage.getItem(GAME_STATS_STORAGE_KEY);
    if (!raw) return { highScores: {}, winLossRecords: {} };
    return JSON.parse(raw);
  } catch (e) {
    return { highScores: {}, winLossRecords: {} };
  }
};

export const saveGameScore = (gameId: string, score: number): number => {
  const stats = getGameStats();
  const currentHigh = stats.highScores[gameId] || 0;
  const newHigh = Math.max(currentHigh, score);
  
  stats.highScores[gameId] = newHigh;
  stats.lastPlayedGameId = gameId;
  stats.lastPlayedTimestamp = Date.now();

  try {
    localStorage.setItem(GAME_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save game stats', e);
  }

  return newHigh;
};

export const recordGameWinLoss = (gameId: string, result: 'win' | 'loss' | 'draw') => {
  const stats = getGameStats();
  const rec = stats.winLossRecords[gameId] || { wins: 0, losses: 0, draws: 0 };

  if (result === 'win') rec.wins += 1;
  else if (result === 'loss') rec.losses += 1;
  else rec.draws += 1;

  stats.winLossRecords[gameId] = rec;
  stats.lastPlayedGameId = gameId;
  stats.lastPlayedTimestamp = Date.now();

  try {
    localStorage.setItem(GAME_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record win/loss', e);
  }
};

export const setLastPlayedGame = (gameId: string) => {
  const stats = getGameStats();
  stats.lastPlayedGameId = gameId;
  stats.lastPlayedTimestamp = Date.now();
  try {
    localStorage.setItem(GAME_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {}
};
