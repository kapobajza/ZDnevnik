export const HttpErrorStatus = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  NotImplemented: 501,
  ServiceUnavailable: 503,
} as const;

export class HttpError extends Error {
  constructor(public status: number) {
    super(`Error: ${status}`);
  }
}
