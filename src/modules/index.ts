import type { Router } from 'express';
import { clientsRoutes } from './clients/index.js';

export { clientsRoutes } from './clients/index.js';

export const moduleRoutes: Router[] = [clientsRoutes];
