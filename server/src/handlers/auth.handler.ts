import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import prisma from "../prisma";

export const createSession = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find or create user
  let user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10)
      }
    });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid password");
  }

  // TODO: Add JWT later
  res.json({ userId: user.id });
});
