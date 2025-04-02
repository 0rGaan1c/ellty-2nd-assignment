import express from "express";
import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 3000;

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
