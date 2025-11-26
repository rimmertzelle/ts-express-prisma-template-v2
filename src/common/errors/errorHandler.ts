import { Request, Response } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
import { BaseHttpError } from './httpErrors.js';
import { buildMeta } from '../utils/response.js';

/**
 * Middleware to handle errors
 * @param err - ErrorResponse object
 * @param req - Request object
 * @param res - Response object
 */
export function errorHandler(err: Error, req: Request, res: Response, next: Function): void {
  const statusFromCustom: number | undefined =
    err instanceof BaseHttpError ? err.status : undefined;
  const statusFromCause: number | undefined =
    typeof err.cause === 'number' ? err.cause : undefined;
  const errStatus: number = statusFromCustom ?? statusFromCause ?? 500;
  const errMsg: string = err.message || 'Something went wrong';
  const meta = buildMeta(req, errStatus, { title: errMsg });
  res.status(errStatus).json({ meta, data: null });
}
