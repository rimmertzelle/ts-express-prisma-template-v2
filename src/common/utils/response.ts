import { Request } from 'express';

export interface Meta {
  status: number;
  path: string;
  method: string;
  timestamp: string;
  title?: string;
  count?: number;
  requestId?: string;
  page?: number;
  perPage?: number;
  total?: number;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

/**
 * Build a Meta object for the given request and HTTP status.
 * @param req Express request
 * @param status HTTP status code
 * @param extras Optional fields to merge into meta
 */
export function buildMeta(req: Request, status: number, extras?: Partial<Meta>): Meta {
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? undefined;
  return {
    status,
    path: req.originalUrl || req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId,
    ...extras,
  };
}

/**
 * Build a 200 OK response envelope.
 * @param req Express request
 * @param data Response payload
 * @param extras Optional meta fields
 */
export function ok<T>(req: Request, data: T, extras?: Partial<Meta>): ApiResponse<T> {
  return {
    meta: buildMeta(req, 200, extras),
    data,
  };
}

/**
 * Build a 201 Created response envelope.
 * @param req Express request
 * @param data Response payload
 * @param extras Optional meta fields
 */
export function created<T>(req: Request, data: T, extras?: Partial<Meta>): ApiResponse<T> {
  return {
    meta: buildMeta(req, 201, extras),
    data,
  };
}

/**
 * Build a 204 No Content response envelope (with null data).
 * @param req Express request
 * @param extras Optional meta fields
 */
export function noContent(req: Request, extras?: Partial<Meta>): ApiResponse<null> {
  return {
    meta: buildMeta(req, 204, extras),
    data: null,
  };
}
