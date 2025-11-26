import Express, { Router } from 'express';
import { getClient, getClients } from './controller.js';

const router: Router = Express.Router();

/**
 * Router for client-related endpoints.
 */

/**
 * GET /clients
 * Returns a hypermedia list of links to client resources.
 */
router.get('/clients', getClients);

/**
 * GET /clients/:id
 * Returns a single client resource by id.
 */
router.get('/clients/:id', getClient);

export default router;
