// AppError.ts
export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number = 500, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message); // Sends statusCode 400
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message); // Sends statusCode 401
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(403, message); // Sends statusCode 403
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message); // Sends statusCode 404
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message); // Sends statusCode 500
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message); // Sends statusCode 409
  }
}

export class PreconditionFailedError extends AppError {
  constructor(message: string) {
    super(412, message); // Sends statusCode 412
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(429, message); // Sends statusCode 429
  }
}
