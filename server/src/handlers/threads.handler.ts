import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import prisma from "../prisma";

// TODO: add validations
export const getThreads = catchAsync(async (req: Request, res: Response) => {
  const threads = await prisma.thread.findMany({
    where: { parentId: null } // Only root threads
  });
  res.json(threads);
});

export const createThread = catchAsync(async (req: Request, res: Response) => {
  const thread = await prisma.thread.create({
    data: req.body
  });
  res.json(thread);
});

export const getThreadReplies = catchAsync(
  async (req: Request, res: Response) => {
    const replies = await prisma.thread.findMany({
      where: { parentId: Number(req.params.id) }
    });
    res.json(replies);
  }
);

export const createReply = catchAsync(async (req: Request, res: Response) => {
  const reply = await prisma.thread.create({
    data: {
      ...req.body,
      parentId: Number(req.params.id)
    }
  });
  res.json(reply);
});
