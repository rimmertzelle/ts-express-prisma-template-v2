import { PrismaClient } from '@prisma/client';
import { seedClients } from '../src/modules/clients/seed.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const count = await seedClients(prisma);
  console.log(`Seeded ${count} clients`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
