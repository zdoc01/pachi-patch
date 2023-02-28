import { GameSessionStats } from '@prisma/client';

const getGameSessionStatsQueryData = (gss: Partial<GameSessionStats>) => ({
  user: {
    connect: { id: gss.userId },
  },
  gameNight: {
    connect: { id: gss.gameNightId },
  },
  game: {
    connect: { id: gss.gameId },
  },
});

export { getGameSessionStatsQueryData };
