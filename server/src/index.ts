import "dotenv/config";
import express from "express";
import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import authRouter from "./routes/auth.routes";
import threadsRouter from "./routes/threads.routes";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/threads", threadsRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    statusCode: StatusCodes.OK,
    message: "✅ Running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
