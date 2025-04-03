import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = "Success") {
    return res.status(StatusCodes.OK).json({
      status: "success",
      message,
      data
    });
  }

  static created(
    res: Response,
    data: any = null,
    message: string = "Created successfully"
  ) {
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      message,
      data
    });
  }

  static notFound(res: Response, message: string = "Resource not found") {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: "fail",
      message
    });
  }

  static badRequest(res: Response, message: string = "Bad request") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message
    });
  }

  static unauthorized(res: Response, message: string = "Unauthorized") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "fail",
      message
    });
  }
}
