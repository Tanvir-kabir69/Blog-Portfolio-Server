// import { transporter } from "./mailer"; // your pre-configured nodemailer transporter
import { RedisClientType } from "redis"; // node-redis v4 typing
import transporter from "../../../config/nodemailerConfig";
import { SendOtpResult } from "../interfaces/sendOtpEmail";
// ---------------------------------------------------------------
// Utility: generate numeric OTP of given length (default 6)
function generateOtp(length = 6): string {
  // create random number, pad with leading zeros if needed
  const max = 10 ** length;
  const num = Math.floor(Math.random() * max);
  return String(num).padStart(length, "0");
}

// ---------------------------------------------------------------
// Main: send OTP email
// Arguments:
// - redisClient: already connected Redis client
// - email: recipient email address
// - opts: optional behaviour controls (otpLength, ttlSeconds, rateLimit, cooldownSeconds)
async function sendOtpEmail(
  redisClient: RedisClientType,
  email: string,
  opts?: {
    otpLength?: number;
    ttlSeconds?: number; // OTP validity
    maxPerMinute?: number; // rate limit
    cooldownSeconds?: number; // time between sends to same email
  }
): Promise<SendOtpResult> {
  // default options
  const {
    otpLength = 6,
    ttlSeconds = 300, // 5 minutes validity
    maxPerMinute = 5, // max requests per 60 seconds
    cooldownSeconds = 30, // must wait 30s between successive sends
  } = opts ?? {};

  // keys (use email normalized as key)
  const keyPrefix = `otp:${email.toLowerCase()}`;
  const otpKey = `${keyPrefix}:code`; // stores the otp value
  const countKey = `${keyPrefix}:count`; // counts requests in 60s window
  const cooldownKey = `${keyPrefix}:cooldown`; // short cooldown between sends

  // 1) Rate limiting: increment request count in a 60s window
  const requests = await redisClient.incr(countKey); // atomically increment
  if (requests === 1) {
    // first increment -> set 60s expiry window
    await redisClient.expire(countKey, 60);
  }
  if (requests > maxPerMinute) {
    // too many requests in last minute
    return {
      success: false,
      reason: "rate_limited",
      message: `Too many OTP requests. Try again later.`,
      retryAfterSeconds: await redisClient.ttl(countKey),
    };
  }

  // 2) Cooldown: prevent rapid repeated sends (e.g., clicking "resend" too fast)
  const onCooldown = await redisClient.exists(cooldownKey);
  if (onCooldown) {
    const ttl = await redisClient.ttl(cooldownKey);
    return {
      success: false,
      reason: "cooldown",
      message: `Please wait ${
        ttl ?? cooldownSeconds
      } seconds before requesting another OTP.`,
      retryAfterSeconds: ttl ?? cooldownSeconds,
    };
  }

  // 3) Reuse an existing active OTP if present (prevents confusing user with multiple codes)
  let otp = await redisClient.get(otpKey);
  let reused = Boolean(otp);
  if (!otp) {
    otp = generateOtp(otpLength);
  }

  // 4) Prepare the email content (plain + HTML)
  const subject = "Your verification code";
  const text = `Your OTP code is: ${otp}. It will expire in ${Math.floor(
    ttlSeconds / 60
  )} minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h3>Verification code</h3>
      <p>Your OTP code is:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
      <p style="color: #666;">This code will expire in ${Math.floor(
        ttlSeconds / 60
      )} minutes.</p>
      <hr />
      <small>If you didn't request this, ignore this email.</small>
    </div>
  `;

  // 5) Send the email using nodemailer
  try {
    await transporter.sendMail({
      // from: `"Your App" <no-reply@yourdomain.com>`, // change to your from
      // from: `"Blog Portfolio" <no-reply@tanvirkabir890.com>`, // change to your from
      from: `"Blog Portfolio"`, // change to your from
      to: email,
      subject,
      text,
      html,
    });
  } catch (sendErr) {
    // On send failure, we do not set OTP (if it was newly generated) — to avoid orphan OTPs.
    // If we reused existing OTP, we still won't change anything. Inform caller.
    // Optionally decrement the countKey to not penalize user for mail failures (not done here).
    // console.error("Failed to send OTP email:", sendErr);
    return {
      success: false,
      reason: "send_failed",
      message: "Failed to send OTP email",
    };
  }

  // 6) On successful send: store OTP with TTL (or refresh TTL if reusing)
  // We store as string. If you prefer numeric transform later, do it in validation.
  await redisClient.set(otpKey, otp, { EX: ttlSeconds });

  // 7) Set short cooldown so user can't spam immediate resends
  await redisClient.set(cooldownKey, "1", { EX: cooldownSeconds });

  // 8) Return success and note if OTP was reused
  return {
    success: true,
    reason: "successful",
    reused, // informs caller if same OTP was used or new one generated
    message: "OTP sent",
    // do not return the OTP itself in a real production response
  };
}

export default sendOtpEmail;
