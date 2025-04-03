import { NextFunction, Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ApiResponse } from "../utils/apiResponse";

const catchAsync = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  const statusCode =
    error.statusCode || err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  if (err.name === "PrismaClientKnownRequestError") {
    switch (err.code) {
      case "P2002":
        return ApiResponse.badRequest(res, "Duplicate field value entered");
      case "P2025":
        return ApiResponse.notFound(res, "Record not found");
    }
  }

  if (err instanceof z.ZodError) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message: err.errors[0].message,
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  switch (true) {
    case statusCode === StatusCodes.NOT_FOUND:
      return ApiResponse.notFound(res, error.message);
    case statusCode === StatusCodes.BAD_REQUEST:
      return ApiResponse.badRequest(res, error.message);
    case statusCode === StatusCodes.UNAUTHORIZED:
      return ApiResponse.unauthorized(res, error.message);
    case statusCode >= 400 && statusCode < 500:
      return res.status(statusCode).json({
        status: "fail",
        message: error.message || "Request failed",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      });
    default:
      return res.status(statusCode).json({
        status: "error",
        message: error.message || "Something went wrong",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      });
  }
};

export { AppError, catchAsync, errorHandler };
