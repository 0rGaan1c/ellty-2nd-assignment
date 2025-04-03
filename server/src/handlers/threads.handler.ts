import { Request, Response } from "express";
import {
  CreateReplyRequestSchema,
  CreateThreadRequestSchema,
  ThreadParamsSchema,
  ThreadResponseSchema
} from "../dtos/thread.dtos";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import prisma from "../prisma";
import { ApiResponse } from "../utils/apiResponse";
import { calculateOperation } from "../utils/operations";

export const getThreads = catchAsync(async (req: Request, res: Response) => {
  const threads = await prisma.thread.findMany({
    where: { parentId: null },
    include: {
      user: { select: { id: true, username: true } },
      _count: { select: { replies: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  ThreadResponseSchema.array().parse(threads);

  if (threads.length === 0) {
    return ApiResponse.success(
      res,
      [],
      "No threads found. Start a new conversation!"
    );
  }

  ApiResponse.success(res, threads, "Threads fetched successfully");
});

export const getThreadReplies = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = ThreadParamsSchema.parse(req.params);

    const replies = await prisma.thread.findMany({
      where: { parentId: id },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { replies: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    ThreadResponseSchema.array().parse(replies);

    if (replies.length === 0) {
      return ApiResponse.success(
        res,
        [],
        "No replies yet. Be the first to respond!"
      );
    }

    ApiResponse.success(res, replies, "Replies fetched successfully");
  }
);

export const createThread = catchAsync(async (req: Request, res: Response) => {
  const { value } = CreateThreadRequestSchema.parse(req.body);

  const thread = await prisma.thread.create({
    data: {
      value,
      userId: req.user.id
    },
    include: {
      user: { select: { id: true, username: true } },
      _count: { select: { replies: true } }
    }
  });

  ThreadResponseSchema.parse(thread);
  ApiResponse.created(res, thread, "Thread created successfully");
});

export const createReply = catchAsync(async (req: Request, res: Response) => {
  const { id: parentId } = ThreadParamsSchema.parse(req.params);
  const { operation, rightOperand } = CreateReplyRequestSchema.parse(req.body);

  const parent = await prisma.thread.findUnique({
    where: { id: parentId },
    select: { value: true }
  });

  if (!parent) throw new AppError("Parent thread not found", 404);

  const value = calculateOperation(parent.value, operation, rightOperand);

  const reply = await prisma.thread.create({
    data: {
      value,
      operation,
      rightOperand,
      parentId,
      userId: req.user.id
    },
    include: {
      user: { select: { id: true, username: true } },
      _count: { select: { replies: true } }
    }
  });

  ThreadResponseSchema.parse(reply);
  ApiResponse.created(res, reply, "Replied successfully");
});
