import { NextApiHandler } from 'next';
import prisma from '../../../lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  console.log(`[ ${req.method} ] /users`);

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();

      console.log(`Found ${users?.length} users`);

      return res.status(200).json({ users });
    } catch (error) {
      console.log('Error creating new game night', error);
      // @ts-ignore
      return res.status(500).send({ error: error?.message });
    }
  }

  return res.status(404).send({ error: 'Route not found.' });
};

export default handler;
