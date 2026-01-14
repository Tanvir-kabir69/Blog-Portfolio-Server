import { IRouter, Router } from "express";
import { OTPController } from "./otpController";
import { validateRequest } from "../../middlewares/validateRequest";
import { emailSchema, OTPSchema } from "./validations";

const OTPRouter: IRouter = Router();

OTPRouter.post("/sentOTP",validateRequest(emailSchema), OTPController.sentOTP);
OTPRouter.post("/verifyOTP", validateRequest(OTPSchema), OTPController.verifyOTP);

export default OTPRouter;
