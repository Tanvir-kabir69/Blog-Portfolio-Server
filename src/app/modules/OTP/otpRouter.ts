import { IRouter, Router } from "express";
import { OTPController } from "./otpController";
import { validateRequest } from "../../middlewares/validateRequest";
import { emailSchema, verifyOtpSchema } from "./validations";

const OTPRouter: IRouter = Router();

OTPRouter.post("/sentOTP",validateRequest(emailSchema), OTPController.sentOTP);
OTPRouter.post("/verifyOTP", validateRequest(verifyOtpSchema), OTPController.verifyOTP);

export default OTPRouter;
