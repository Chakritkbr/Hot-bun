// AppError.ts
export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message); // ส่ง statusCode 400
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message); // ส่ง statusCode 401
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message); // ส่ง statusCode 500
  }
}
