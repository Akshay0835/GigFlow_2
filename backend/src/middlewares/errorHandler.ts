import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
      const message = `Resource not found. Invalid: ${error.path}`;
      error = new AppError(message, 400);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((val: any) => val.message)
        .join(', ');
      error = new AppError(message, 400);
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token. Please log in again!', 401);
    }

    if (error.name === 'TokenExpiredError') {
      error = new AppError('Your token has expired! Please log in again.', 401);
    }

    // Operational, trusted error: send message to client
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    // Fallback if NODE_ENV is not set
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
