import { PrismaClient, Client } from '../../prisma/generated/prisma/client.ts';

// Keep it minimal: only model fields that are user-provided.
const clients: Array<Pick<Client, 'name' | 'email'>> = [
  { name: 'Ada Lovelace', email: 'ada.lovelace@example.com' },
  { name: 'Alan Turing', email: 'alan.turing@example.com' },
  { name: 'Grace Hopper', email: 'grace.hopper@example.com' },
  { name: 'Margaret Hamilton', email: 'margaret.hamilton@example.com' },
  { name: 'Donald Knuth', email: 'donald.knuth@example.com' },
  { name: 'Barbara Liskov', email: 'barbara.liskov@example.com' },
  { name: 'Edsger Dijkstra', email: 'edsger.dijkstra@example.com' },
  { name: 'Linus Torvalds', email: 'linus.torvalds@example.com' },
  { name: 'Radia Perlman', email: 'radia.perlman@example.com' },
  { name: 'Tim Berners-Lee', email: 'tim.bernerslee@example.com' },
];

export async function seedClients(prisma: PrismaClient): Promise<number> {
  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {}, // keep existing records
      create: client,
    });
  }
  return clients.length;
}
