import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { OTPService } from "./otpServices";

const sentOTP = catchAsync(async (req: Request, res: Response) => {
  //
  const result = await OTPService.sentOTP(req?.body.email);
  if (!result.success) {
    sendResponse(res, {
      success: false,
      message: "OTP is not sent successfully",
      statusCode: httpStatus.BAD_REQUEST,
      data: result,
    });

    return;
  }

  sendResponse(res, {
    success: true,
    message: "OTP is sent successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  //
  await OTPService.verifyOTP(req?.body);

  sendResponse(res, {
    success: true,
    message: "OTP verified successfully",
    statusCode: httpStatus.OK,
    data: null,
  });
});

export const OTPController = {
  sentOTP,
  verifyOTP,
};
