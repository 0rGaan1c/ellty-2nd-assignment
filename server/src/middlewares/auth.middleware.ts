import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import prisma from "../prisma";
import { AppError } from "./errorHandler";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // 2) Verify token
    const decoded: any = jwt.verify(token, authConfig.secret);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token no longer exists",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // 4) Grant access to protected route
    req.user = {
      id: currentUser.id,
      username: currentUser.username
    };
    next();
  } catch (error) {
    next(new AppError("Authentication failed", StatusCodes.UNAUTHORIZED));
  }
};
