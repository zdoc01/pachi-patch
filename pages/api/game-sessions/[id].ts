import { NextApiHandler, NextApiRequest } from 'next';
import { updateGameSession } from '../../../src/utils/server/game-sessions';
import { GameSession } from '../../../types/GameNight';

interface GameSessionRequest extends NextApiRequest {
  body: GameSession;
  query: {
    id?: string;
  };
}

const handler: NextApiHandler = async (req: GameSessionRequest, res) => {
  console.log(`[ ${req.method} ] /game-sessions/${req.query.id}`);

  if (req.method === 'PUT') {
    if (!req.query.id) {
      throw new Error('No game session ID provided');
    }

    if (!req.body) {
      throw new Error(
        `Missing request body for GameSession with id [ ${req.query.id} ]`
      );
    }

    try {
      const updatedSession = await updateGameSession({
        ...req.body,
        id: req.query.id,
      });

      return res.status(200).json(updatedSession);
    } catch (error) {
      console.log('Error updating game session', error);
      // @ts-ignore
      return res.status(500).send({ error: error?.message });
    }
  }

  return res.status(500).send({ error: 'Route not found.' });
};

export default handler;
