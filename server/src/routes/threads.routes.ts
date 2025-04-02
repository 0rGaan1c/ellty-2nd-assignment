import { Router } from "express";
import {
  createReply,
  createThread,
  getThreadReplies,
  getThreads
} from "../handlers/threads.handler";

const router = Router();

router.get("/", getThreads);
router.post("/", createThread);
router.get("/:id/replies", getThreadReplies);
router.post("/:id/replies", createReply);

export default router;
