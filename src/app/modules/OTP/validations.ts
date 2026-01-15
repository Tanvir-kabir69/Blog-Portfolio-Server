import { z } from "zod";

// export const OTPSchema = z.object({
//   otp: z.preprocess(
//     (val) => {
//       if (typeof val === "number") return String(val);
//       if (typeof val === "string") return val;
//       return val;
//     },
//     z
//       .string()
//       .trim()
//       .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
//       .transform((val) => Number(val)) // Convert string → number
//   ),
// });

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

// export type OTPPayload = z.infer<typeof OTPSchema>;
export type EmailPayload = z.infer<typeof emailSchema>;
export type VerifyOtpPayload = z.infer<typeof verifyOtpSchema>;
