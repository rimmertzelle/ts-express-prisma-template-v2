import { Request } from 'express';

/**
 * Build an absolute URL for a resource path based on the incoming request.
 * @param req Express request
 * @param path Relative or absolute resource path (e.g. "/clients/1")
 * @returns Absolute URL string
 */
export function resourceUrl(req: Request, path: string): string {
  const protocol = req.protocol;
  const host = req.get('host');
  const base = `${protocol}://${host}`;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}
