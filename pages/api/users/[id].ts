import { NextApiHandler, NextApiRequest } from 'next';
import prisma from '../../../lib/prisma';

interface SingleGameNightRequest extends NextApiRequest {
  query: {
    id?: string;
  };
}

const handler: NextApiHandler = async (req: SingleGameNightRequest, res) => {
  console.log(`[ ${req.method} ] /users/${req.query.id}`);

  if (req.method === 'GET' && req.query.id) {
    try {
      const gameNight = await prisma.user.findUnique({
        where: {
          id: req.query.id,
        },
      });

      return res.status(200).json(gameNight);
    } catch (error) {
      console.log('Error fetching user', error);
      // @ts-ignore
      return res.status(500).send({ error: error?.message });
    }
  }

  return res.status(404).send({ error: 'Route not found.' });
};

export default handler;
