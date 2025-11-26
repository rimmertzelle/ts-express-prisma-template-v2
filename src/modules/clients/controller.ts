import { NextFunction, Request, Response } from 'express';
import clientsService from './service.js';
import type { ClientDto } from './dtos/clientDto.js';
import type { LinkDto } from './dtos/linkDto.js';
import { ok } from '../../common/utils/response.js';
import { resourceUrl } from '../../common/utils/url.js';

/**
 * GET /clients
 * Returns a list of hyperlinks to individual client resources.
 */
export async function getClients(req: Request, res: Response): Promise<void> {
  const clients: ClientDto[] = await clientsService.listClients();
  const links: LinkDto[] = clients.map((c) => ({
    href: resourceUrl(req, `/clients/${c.id}`),
    rel: 'client',
    title: c.name ?? c.email,
  }));
  const response = ok<LinkDto[]>(req, links, { title: 'All clients', count: clients.length });
  res.status(200).json(response);
}

/**
 * GET /clients/:id
 * Returns a single client resource.
 */
export async function getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;

  try {
    const client: ClientDto = await clientsService.getClientById(id);
    const response = ok<ClientDto>(req, client, { title: 'Client by id' });
    res.status(200).json(response);
  } catch (err) {
    next(err); // forwards to error handler
  }
}
