/**
 * Base application error with an associated HTTP status code.
 */
export class BaseHttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Thrown when a resource cannot be found (404).
 */
export class NotFoundError extends BaseHttpError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/** Thrown when a request is invalid (400). */
export class BadRequestError extends BaseHttpError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/** Thrown when authentication is required and has failed (401). */
export class UnauthorizedError extends BaseHttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/** Thrown when the user is authenticated but not allowed to perform the action (403). */
export class ForbiddenError extends BaseHttpError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/** Thrown when a resource state conflicts with the request (409). */
export class ConflictError extends BaseHttpError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/** Thrown when the server understands the content type but cannot process instructions (422). */
export class UnprocessableEntityError extends BaseHttpError {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}
