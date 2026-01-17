import nodemailer from "nodemailer";
import { envVars } from "./env";

const transporter = nodemailer.createTransport({
  host: envVars.SMTP.SMTP_HOST,
  port: Number(envVars.SMTP.SMTP_PORT),
  // -------------------------------------------------------
  // ⚠️ secure: true — when is it correct?
  // Port	    secure
  // 465	    true
  // 587	    false
  // -------------------------------------------------------
  secure: Number(envVars.SMTP.SMTP_PORT) === 465, // important
  auth: {
    user: envVars.SMTP.SMTP_USER,
    pass: envVars.SMTP.SMTP_PASS,
  },

  // ⏱ Timeout safety (in milliseconds)
  connectionTimeout: 10_000, // time to establish connection
  greetingTimeout: 10_000, // time to wait for SMTP greeting
  socketTimeout: 10_000, // inactivity timeout
});

// 1️⃣ Verify transporter at startup (optional but professional) ***

export default transporter;
