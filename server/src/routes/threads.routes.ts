import { Router } from "express";
import {
  createReply,
  createThread,
  getThreadReplies,
  getThreads
} from "../handlers/threads.handler";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getThreads);
router.post("/", protect, createThread);
router.get("/:id/replies", getThreadReplies);
router.post("/:id/replies", protect, createReply);

export default router;
