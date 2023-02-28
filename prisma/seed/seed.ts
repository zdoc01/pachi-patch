import { PrismaClient } from '@prisma/client';
import { Games } from './data/games';
import { Users } from './data/users';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  console.log('Adding users...', Users);
  const users = await Promise.all(
    Users.map(({ email, image, name }) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          image,
          name,
        },
      })
    )
  );

  console.log('Adding games...', Games);
  await Promise.all(
    Games.map(({ name }) =>
      prisma.game.create({
        data: { name },
      })
    )
  );

  console.log('Seed complete!');
  process.exit(0);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
