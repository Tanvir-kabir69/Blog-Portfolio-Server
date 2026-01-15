import { redisClient } from "../../../config/redis.config";
import { VerifyOtpResult } from "../interfaces/verifyOtpRequest";

// const MAX_ATTEMPTS = 5;

const verifyOtp = async (
  email: string,
  providedOtp: string,
  opts?: {
    maxAttempts?: number;
  }
): Promise<VerifyOtpResult> => {
  // default options
  const { maxAttempts = 5 } = opts ?? {};

  try {
    // const otpKey = `otp:${email}`;
    const keyPrefix = `otp:${email.toLowerCase()}`;
    const otpKey = `${keyPrefix}:code`; // stores the otp value
    const attemptKey = `otp:attempt:${email}`;

    // 1️⃣ Check OTP exists
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp) {
      return {
        success: false,
        reason: "otp_expired",
        message: "OTP expired or not found",
      };
    }

    // 2️⃣ Check attempts
    const attempts = Number(await redisClient.get(attemptKey)) || 0;
    // if (attempts >= MAX_ATTEMPTS) {
    if (attempts >= maxAttempts) {
      return {
        success: false,
        reason: "too_many_attempts",
        message: "Too many invalid attempts. Please request a new OTP.",
      };
    }

    // 3️⃣ Compare OTP
    if (storedOtp !== providedOtp) {
      await redisClient.incr(attemptKey);

      return {
        success: false,
        reason: "invalid_otp",
        message: "Invalid OTP",
      };
    }

    // 4️⃣ SUCCESS → cleanup Redis
    await redisClient.del(otpKey);
    await redisClient.del(attemptKey);

    return {
      success: true,
      reason: "verified",
      message: "OTP verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      reason: "internal_error",
      message: "OTP verification failed",
    };
  }
};

export default verifyOtp;
