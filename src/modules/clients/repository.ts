import prisma from '../../db/prisma.js';
import type { Client } from './types/client.js';

/**
 * Repository responsible for data access related to Clients.
 * Encapsulates Prisma queries and shields higher layers from ORM details.
 */
export class ClientsRepository {
  /**
   * Fetch all clients.
   * @returns Promise resolving to an array of clients.
   */
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }

  /**
   * Fetch a client by its unique identifier.
   * @param id Client id
   * @returns Promise resolving to a client or null if not found.
   */
  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({ where: { id } });
  }
}

export default new ClientsRepository();
