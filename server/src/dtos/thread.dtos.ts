import { z } from "zod";

export const ThreadParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be numeric").transform(Number)
});

const ThreadUserSchema = z.object({
  id: z.number(),
  username: z.string()
});

export const ThreadResponseSchema = z.object({
  id: z.number(),
  value: z.number(),
  operation: z.string().nullable(),
  rightOperand: z.number().nullable(),
  parentId: z.number().nullable(),
  userId: z.number(),
  createdAt: z.date(),
  user: ThreadUserSchema,
  _count: z.object({
    replies: z.number()
  })
});

export type ThreadResponse = z.infer<typeof ThreadResponseSchema>;

const ThreadBaseSchema = z.object({
  value: z.number().finite().safe()
});

export const CreateThreadRequestSchema = ThreadBaseSchema;

export const CreateReplyRequestSchema = z
  .object({
    operation: z.enum(["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"]),
    rightOperand: z.number().finite().safe()
  })
  .refine((data) => data.operation !== "DIVIDE" || data.rightOperand !== 0, {
    message: "Cannot divide by zero",
    path: ["rightOperand"]
  });
