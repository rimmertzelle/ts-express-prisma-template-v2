import { PrismaClient } from '@prisma/client';
// reference a type from the generated Prisma Client
// import type { Client } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();
import { Client } from '../src/types/client.ts';

// if you use the model you have to fill in all the fields also the generated ones
const clients: Omit<Client, 'id' | 'createdAt'>[] = [
  {
    name: 'Jane Doe',
    email: 'jane@doe.com',
  },
  {
    name: 'John Doe',
    email: 'john@doe.com',
  },
  {
    name: 'Mary Jane',
    email: 'mary@jane.com',
  },
];

// first look if they exist in the database and then add them

const load = async (): Promise<void> => {
  try {
    // Use upsert to handle existing records gracefully
    // MongoDB replica set is required for upsert operations
    for (const client of clients) {
      await prisma.client.upsert({
        where: { email: client.email },
        update: {}, // Don't update if exists, just keep as is
        create: client,
      });
    }
    console.log('Added client data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
