import { redisClient } from "../../config/redis.config";
import sendOtpEmail from "./utils/sendOtpEmail";
import verifyOtp from "./utils/verifyOtp";
import { VerifyOtpPayload } from "./validations";
import OtpEmailPurpose from "./interfaces/otpEmailPurpose";

// const sentOTP = async (email: Record<string, string>) => {
const sentOTP = async (email: string) => {
  const result = await sendOtpEmail(
    redisClient,
    { email },
    OtpEmailPurpose.VERIFICATION,
  );
  return result;
};

const verifyOTP = async (verifyOtpPayload: VerifyOtpPayload) => {
  // console.log(verifyOtpPayload);
  const result = await verifyOtp(verifyOtpPayload.email, verifyOtpPayload.otp, {
    maxAttempts: 5,
  });

  return result;
};

export const OTPService = {
  sentOTP,
  verifyOTP,
};
