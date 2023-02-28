import { NextApiHandler, NextApiRequest } from 'next';
import { GameNight } from '../../../types/GameNight';
import prisma from '../../../lib/prisma';

interface SingleGameNightRequest extends NextApiRequest {
  body: GameNight;
  query: {
    id?: string;
  };
}

const handler: NextApiHandler = async (req: SingleGameNightRequest, res) => {
  console.log(`[ ${req.method} ] /gamenights/${req.query.id}`);

  if (!req.query.id) {
    console.error('No game night ID provided');
    return res.status(400).send({ error: 'Missing required field [ id ]' });
  }

  if (req.method === 'GET' && req.query.id) {
    try {
      const gameNight = await prisma.gameNight.findUnique({
        where: {
          id: parseInt(req.query.id, 10),
        },
        include: {
          gameSessions: {
            include: {
              user: true,
            },
          },
        },
      });

      return res.status(200).json(gameNight);
    } catch (error) {
      console.log('Error fetching game night', error);
      // @ts-ignore
      res.status(500).send({ error: error?.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedGameNight = await prisma.gameNight.update({
        where: {
          id: parseInt(req.query.id, 10),
        },
        // @ts-ignore
        data: {
          ...req.body,
        },
      });

      return res.status(200).json(updatedGameNight);
    } catch (error) {
      console.log(
        `Error updating game night with ID [ ${req.query.id} ]`,
        error
      );
      // @ts-ignore
      res.status(500).send({ error: error?.message });
    }
  }

  res.status(500).send({ error: 'Route not found.' });
};

export default handler;
