import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import { SessionRequestSchema, SessionResponseSchema } from "../dtos/auth.dtos";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import prisma from "../prisma";
import { ApiResponse } from "../utils/apiResponse";

const signToken = (id: number): string => {
  if (!authConfig.secret) {
    throw new AppError(
      "JWT secret not configured",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  try {
    const secret = authConfig.secret as string;

    const payload = { id };

    const options: jwt.SignOptions = {
      expiresIn: authConfig.expiresIn
    };

    return jwt.sign(payload, secret, options);
  } catch (error) {
    console.error("JWT signing error:", error);
    throw new AppError(
      "Failed to generate token",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const createSession = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = SessionRequestSchema.parse(req.body);

  let user = await prisma.user.findUnique({ where: { username } });

  let message = "";

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10)
      }
    });
    message = "User registered successfully";
  } else if (!(await bcrypt.compare(password, user.password))) {
    throw new AppError(
      "Username or password is incorrect!",
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = signToken(user.id);
  const responseData = {
    userId: user.id,
    username: user.username,
    token
  };

  SessionResponseSchema.parse(responseData);

  return ApiResponse.success(res, responseData, message || "Login successful");
});
