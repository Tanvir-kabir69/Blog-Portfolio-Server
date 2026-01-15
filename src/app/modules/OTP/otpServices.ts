import { redisClient } from "../../config/redis.config";
import sendOtpEmail from "./utils/sendOtpEmail";
import verifyOtp from "./utils/verifyOtp";
import { VerifyOtpPayload } from "./validations";

// const sentOTP = async (email: Record<string, string>) => {
const sentOTP = async (email: string) => {
  // console.log(email)
  const result = await sendOtpEmail(redisClient, email);
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
