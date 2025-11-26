import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * Express middleware that ensures every request has a correlation id.
 * - Reads existing x-request-id header or generates one.
 * - Sets the same id on the response header.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const headerName = 'x-request-id';
  let id = req.header(headerName);
  if (!id) {
    id = randomUUID();
    req.headers[headerName] = id;
  }
  res.setHeader(headerName, id as string);
  next();
}
