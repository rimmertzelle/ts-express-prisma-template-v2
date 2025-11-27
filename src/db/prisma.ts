import { PrismaClient } from '../../prisma/generated/prisma/client.ts';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
/**
 * Provides a single PrismaClient instance across the process and during hot-reloads
 * in development to avoid exhausting database connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const datasourceUrl = process.env.DATABASE_URL;
if (!datasourceUrl) {
	throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Shared Prisma client.
 *
 * - In development, the instance is cached on the global object to prevent
 *   creating multiple connections during module reloads.
 * - In production, a new instance is created per process.
 */
export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		datasources: {
			db: { url: datasourceUrl },
		},
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	});

// Cache the client in development
if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
