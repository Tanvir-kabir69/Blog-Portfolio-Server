export type VerifyOtpResult =
  | {
      success: true;
      reason: "verified";
      message: string;
    }
  | {
      success: false;
      reason:
        | "otp_not_found"
        | "otp_expired"
        | "invalid_otp"
        | "too_many_attempts"
        | "internal_error";
      message: string;
    };
