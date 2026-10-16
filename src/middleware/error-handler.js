import { HttpError } from '../lib/http-error.js';

// Express treats a middleware with four parameters as an error handler.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // When err is an HttpError, respond with its status and shape
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        details: err.details, // omitted automatically by Express/JSON.stringify if undefined
      },
    });
  }

  // Anything else is a bug. The details go to the terminal, never to the client.
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}