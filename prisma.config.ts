import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

export default defineConfig({
	migrations: {
		seed: 'tsx prisma/seed.ts',
	},
});


