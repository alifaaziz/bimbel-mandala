export class HttpError extends Error {
    constructor(statusCode, { message, errors }) {
      super(message);
      this.errors = errors;
      this.statusCode = statusCode;
    }
  }