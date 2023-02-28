import { GameSession, PrismaClient } from '@prisma/client';
import { getGameSessionStatsQueryData } from './game-session-stats';

const getGameSessionUpdateQuery = (gs: GameSession) => ({
  gameId: gs.gameId,
  gameNightId: gs.gameNightId,
  userId: gs.userId,
  isLocked: gs.isLocked,
  isPlaying: gs.isPlaying,
});

const getGameSessionCreateQuery = (gs: GameSession) => ({
  isLocked: gs.isLocked,
  isPlaying: gs.isPlaying,
  user: {
    connect: { id: gs.userId },
  },
  gameNight: {
    connect: { id: gs.gameNightId },
  },
  game: {
    connect: { id: gs.gameId },
  },
  gameSessionStats: {
    connectOrCreate: {
      where: {
        gameId_gameNightId_userId: {
          gameId: gs.gameId,
          gameNightId: gs.gameNightId,
          userId: gs.userId,
        },
      },
      create: getGameSessionStatsQueryData({
        userId: gs.userId,
        gameNightId: gs.gameNightId,
        gameId: gs.gameId,
      }),
    },
  },
});

const getGameSessionQueryWhereClause = (gs: GameSession) => {
  let whereClause = {};
  if (gs.id && !gs.id.startsWith('temp')) {
    whereClause = { id: gs.id };
  } else if (gs.userId && gs.gameNightId) {
    whereClause = {
      userId_gameNightId: {
        gameNightId: gs.gameNightId,
        userId: gs.userId,
      },
    };
  }

  return whereClause;
};

/**
 * Prisma doesn't support nested `create` operations on relationships
 * (e.g. GameSessionStats under GameSessions) when performed as part of
 * a `createMany` batch operation (bleh), so we need to perform the `create`s
 * separately. Doing this as an Interactive Transaction keeps it atomic,
 * so if anything fails it will be rolled back.
 *
 * @see https://github.com/prisma/prisma/issues/5455#issuecomment-1350754257
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions
 *
 * @param {GameSession[]} gameSessions Values for the new GameSession/GameSessionStats instances
 * @returns {GameSession[]}
 */
const createGameSessions = async (gameSessions: GameSession[]) => {
  // @ts-ignore
  return await prisma.$transaction(async (tx: PrismaClient) => {
    const createdSessions = await Promise.all(
      gameSessions.map((gs) => {
        const data = getGameSessionCreateQuery(gs);

        return tx.gameSession.create({
          data,
        });
      })
    );

    return createdSessions;
  });
};

const updateGameSession = (gs: GameSession) => {
  const data = getGameSessionUpdateQuery(gs);

  return prisma.gameSession.update({
    where: getGameSessionQueryWhereClause(gs),
    data,
  });
};

/**
 * Prisma Transaction ensures queries are executed sequentially
 * (important for preserving in/out order). Also allows us to
 * run multiple operations as a single, atomic operation - if any
 * opertion fails, Prisma rolls back the entire transaction. All
 * items updated here will have the same `updatedAt` value.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#transaction-api
 */
const updateGameSessions = async (gameSessions: GameSession[]) => {
  const queries = gameSessions.map(updateGameSession);
  return prisma.$transaction(queries);
};

export { createGameSessions, updateGameSession, updateGameSessions };
