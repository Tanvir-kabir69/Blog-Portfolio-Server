export type SendOtpResult =
  | {
      success: true;
      reason: "successful";
      message: string;
      reused?: boolean;
    }
  | {
      success: false;
      reason: "rate_limited" | "cooldown" | "send_failed";
      message: string;
      retryAfterSeconds?: number;
    };
