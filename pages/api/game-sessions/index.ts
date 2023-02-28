import { NextApiHandler, NextApiRequest } from 'next';
import { GameSession } from '../../../types/GameNight';
import prisma from '../../../lib/prisma';

interface GameSessionRequest extends NextApiRequest {
  body: GameSession;
  query: {
    gameId?: string;
    gameNightId?: string;
    userId?: string;
    isLocked?: string;
    isPlaying?: string;
  };
}

const handler: NextApiHandler = async (req: GameSessionRequest, res) => {
  const params = Object.entries(req.query);
  console.log(
    `[ ${req.method} ] /game-sessions?${params
      .map((kv) => kv.join('='))
      .join('&')}`
  );

  if (req.method === 'GET') {
    if (params.length) {
      try {
        const { gameId, gameNightId, userId, isLocked, isPlaying } = req.query;
        const gameSessions = await prisma.gameSession.findMany({
          where: {
            gameId: gameId ? parseInt(gameId, 10) : undefined,
            gameNightId: gameNightId ? parseInt(gameNightId, 10) : undefined,
            userId,
            isLocked:
              typeof isLocked !== 'undefined'
                ? Boolean(req.query.isLocked)
                : undefined,
            isPlaying:
              typeof isPlaying !== 'undefined'
                ? Boolean(req.query.isPlaying)
                : undefined,
          },
          include: {
            user: true,
          },
        });

        res.status(200).send({ gameSessions });
      } catch (error) {
        console.error('Unable to fetch GameSessions', error);
        // @ts-ignore
        res.status(500).send({ error: error?.message });
      }
    }
  }

  res.status(500).send({ error: 'Route not found.' });
};

export default handler;
