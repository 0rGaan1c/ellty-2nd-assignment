import { Router } from "express";
import { createSession } from "../handlers/auth.handler";

const router = Router();

// Single endpoint for both register/login
router.post("/session", createSession);

export default router;
