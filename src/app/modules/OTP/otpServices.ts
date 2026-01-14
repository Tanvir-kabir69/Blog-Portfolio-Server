import { redisClient } from "../../config/redis.config";
import sendOtpEmail from "./utils/sendOtpEmail";

// const sentOTP = async (email: Record<string, string>) => {
const sentOTP = async (email: string) => {
  // console.log(email)
  const result = await sendOtpEmail(redisClient, email)
  return result
};

const verifyOTP = async (otp: Record<number, any>) => {};

export const OTPService = {
  sentOTP,
  verifyOTP,
};
