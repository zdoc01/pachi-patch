import { NextApiHandler, NextApiRequest } from 'next';
import prisma from '../../../lib/prisma';

import {
  createGameSessions,
  updateGameSessions,
} from '../../../src/utils/server/game-sessions';

import { GameSession } from '../../../types/GameNight';

interface GameSessionRequest extends NextApiRequest {
  body: {
    gameSessions: GameSession[];
  };
  query: {
    id?: string;
  };
}

const handler: NextApiHandler = async (req: GameSessionRequest, res) => {
  console.log(`[ ${req.method} ] /game-sessions/batch`);

  if (!req.body?.gameSessions) {
    throw new Error(`Missing request body for GameSessions batch update`);
  }

  if (req.method === 'POST') {
    try {
      const newGameSessions = await createGameSessions(req.body.gameSessions);
      res.status(201).json({ gameSessions: newGameSessions });
    } catch (error) {
      console.log('Error creating game sessions', error);
      // @ts-ignore
      res.status(500).send({ error: error?.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedSessions = await updateGameSessions(req.body.gameSessions);
      return res.status(200).json({ gameSessions: updatedSessions });
    } catch (error) {
      console.log('Error updating game sessions', error);
      // @ts-ignore
      res.status(500).send({ error: error?.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.gameSession.deleteMany({
        where: {
          id: {
            in: req.body.gameSessions.map((gs) => gs.id),
          },
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log('Error deleting game sessions', error);
      // @ts-ignore
      res.status(500).send({ error: error?.message });
    }
  }

  res.status(500).send({ error: 'Route not found.' });
};

export default handler;
