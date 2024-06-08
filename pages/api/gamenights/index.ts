import { NextApiHandler, NextApiRequest } from 'next';
import { unstable_getServerSession as getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

import { GameNight } from '@prisma/client';
import { User } from '../../../types/User';

interface GameNightRequest extends NextApiRequest {
  body: {
    users: User['id'][];
  };
}

const convertToGameSessionQueries = (
  userIds: User['id'][],
  gameNight: GameNight
) => {
  return userIds.map((userId) =>
    /**
     * Using individual `create`s as opposed to `createMany` because
     * we can't perform a nested `create` within `createMany`.
     * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
     */
    prisma.gameSession.create({
      include: {
        gameSessionStats: true,
      },
      // @ts-ignore
      data: {
        isLocked: false,
        gameNight: {
          // Have to explicity connect these relationships
          // @see https://stackoverflow.com/a/69584778
          connect: { id: gameNight.id },
        },
        game: {
          connect: { id: 1 },
        },
        user: {
          connect: { id: userId },
        },
        gameSessionStats: {
          create: {
            user: {
              connect: { id: userId },
            },
            gameNight: {
              connect: { id: gameNight.id },
            },
            game: {
              connect: { id: 1 },
            },
          },
        },
      },
    })
  );
};

const handler: NextApiHandler = async (req: GameNightRequest, res) => {
  console.log(`[ ${req.method} ] /gamenights`);

  if (req.method === 'GET') {
    try {
      const gameNights = await prisma.gameNight.findMany({
        include: {
          createdBy: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({ gameNights });
    } catch (error) {
      console.log('Error fetching game nights', error);
      // @ts-ignore
      return res.status(500).send({ error: error?.message });
    }
  } else if (req.method === 'POST') {
    try {
      // @ts-ignore-next-line
      const session = await getServerSession(req, res, authOptions);

      console.log('The current getServerSession session', session);

      if (!session?.user?.id) {
        throw new Error('Missing current session user ID');
      }

      if (!req.body?.users) {
        throw new Error('Must provide a list of user IDs');
      }

      const newGameNight = await prisma.gameNight.create({
        include: {
          createdBy: true,
        },
        data: {
          games: {
            connect: [{ id: 1 }],
          },
          createdById: session?.user?.id,
        },
      });

      console.log('Successfully created game night instance', newGameNight);

      const gameSessionQueries = convertToGameSessionQueries(
        req.body.users,
        newGameNight
      );
      await prisma.$transaction(gameSessionQueries);

      console.log(`Successfully created game sessions`);

      return res.status(201).json(newGameNight);
    } catch (error) {
      console.log('Error creating new game night', error);
      // @ts-ignore
      return res.status(500).send({ error: error?.message });
    }
  }

  return res.status(404).send({ error: 'Route not found.' });
};

export default handler;
