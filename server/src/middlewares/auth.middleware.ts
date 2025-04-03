import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import { AuthUser, AuthUserSchema } from "../dtos/auth.dtos";
import prisma from "../prisma";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || typeof token !== "string") {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const decoded: any = jwt.verify(token, authConfig.secret as string);

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

    req.user = AuthUserSchema.parse(currentUser);
    next();
  } catch (error) {
    next(new AppError("Authentication failed", StatusCodes.UNAUTHORIZED));
  }
};
