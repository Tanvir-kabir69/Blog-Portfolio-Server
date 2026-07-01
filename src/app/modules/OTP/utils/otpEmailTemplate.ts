import OtpEmailPurpose from "../interfaces/otpEmailPurpose";

function generateOtpEmail(
  otp: string,
  expiryMinutes: number,
  purpose: OtpEmailPurpose,
  receiverName?: string,
): string {
  const trimmedName = receiverName?.trim();
  const greeting =
    trimmedName && trimmedName.length > 0 ? `Hello ${trimmedName},` : "Hello,";
  // Generate OTP boxes dynamically
  const otpBoxes = otp
    .toString()
    .split("")
    .map((digit) => `<span class="otp-box">${digit}</span>`)
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <style>
  body{
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }
  
  .email-wrapper{
    width:100%;
    background:#f5f7fb;
    padding:40px 0;
  }
  
  .email-container{
    width:100%;
    max-width:560px;
    margin:auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 10px 35px rgba(0,0,0,0.08);
  }
  
  .email-header{
    background:linear-gradient(135deg,#4f46e5,#6366f1);
    padding:28px;
    text-align:center;
    color:white;
  }
  
  .logo{
    width:40px;
    margin-bottom:10px;
  }
  
  .title{
    font-size:22px;
    font-weight:600;
  }
  
  .email-body{
    padding:35px;
    color:#333;
  }
  
  .email-body h2{
    margin:0 0 12px;
    font-size:20px;
  }
  
  .email-body p{
    color:#555;
    line-height:1.6;
    font-size:14px;
  }
  
  .otp-wrapper{
    margin:30px 0;
    text-align:center;
  }
  
  .otp-box{
    display:inline-block;
    background:#f3f4f6;
    border-radius:8px;
    padding:16px 22px;
    margin:5px;
    font-size:24px;
    font-weight:700;
    letter-spacing:2px;
    color:#111;
  }
  
  .warning{
    margin-top:25px;
    padding:14px;
    background:#fff8e6;
    border:1px solid #ffe3a3;
    border-radius:8px;
    font-size:13px;
    color:#7a5d00;
  }
  
  .email-footer{
    padding:25px;
    text-align:center;
    font-size:12px;
    color:#888;
    background:#fafafa;
  }
  
  @media (prefers-color-scheme: dark){
  
  body{
    background:#0f172a;
  }
  
  .email-container{
    background:#1e293b;
    box-shadow:none;
  }
  
  .email-body{
    color:#e2e8f0;
  }
  
  .email-body p{
    color:#cbd5e1;
  }
  
  .otp-box{
    background:#334155;
    color:white;
  }
  
  .warning{
    background:#3f2e00;
    border:1px solid #7c5a00;
    color:#ffd978;
  }
  
  .email-footer{
    background:#111827;
    color:#9ca3af;
  }
  
  }
  
  @media(max-width:600px){
  
  .email-body{
    padding:25px;
  }
  
  .otp-box{
    padding:14px 18px;
    font-size:20px;
  }
  
  }
  </style>
  </head>
  
  <body>
  
  <div class="email-wrapper">
  
  <div class="email-container">
  
  <div class="email-header">
  <img class="logo" src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" />
  <div class="title">Secure Verification</div>
  </div>
  
  <div class="email-body">
  
  <h2>${greeting}</h2>
  
  <p>
  You requested a One Time Password (OTP) for <strong>${purpose}</strong>.
  Use the code below to continue.
  </p>
  
  <div class="otp-wrapper">
  ${otpBoxes}
  </div>
  
  <p>
  This code will expire in <strong>${expiryMinutes} minutes</strong>.
  </p>
  
  <p>
  If you didn’t request this, please ignore this email.
  </p>
  
  <div class="warning">
  ⚠️ Never share this code with anyone. Our support team will never ask for your OTP.
  </div>
  
  </div>
  
  <div class="email-footer">
  © ${new Date().getFullYear()} Blog Portfolio. All rights reserved.<br>
  This email was sent for secure verification.
  </div>
  
  </div>
  
  </div>
  
  </body>
  </html>
  `;
}

export default generateOtpEmail;
