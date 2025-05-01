export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequest extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class Forbidden extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFound extends HttpError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class Conflict extends HttpError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
} 